import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import { CollectionName, type MongoPipeline } from "../model/Database.js";
import type { MatchV5DB } from "../model/MatchV5.js";
import { MemberDBSchema, MemberWithSummonerSchema } from "../model/Member.js";
import { PenAndPaperSessionSchema } from "../model/PenAndPaper.js";
import { db } from "./index.js";
import {
	LEAGUE_MATCHES_TABLE,
	LEAGUE_MATCH_PARTICIPANTS_TABLE,
} from "./schemas/LeagueMatch.js";
import { MEMBERS_TABLE } from "./schemas/Member.js";
import {
	PEN_AND_PAPER_CHARACTER_TABLE,
	PEN_AND_PAPER_SESSION_TABLE,
} from "./schemas/PenAndPaper.js";
import { LEAGUE_SUMMONERS_TABLE } from "./schemas/Summoner.js";

async function migrateMembers() {
	const membersMongodb = await dbh.genericGet(
		CollectionName.MEMBER,
		{ limit: 1000 },
		MemberDBSchema,
	);
	if (!membersMongodb.success) {
		throw new Error(
			`Failed to fetch members from MongoDB: ${membersMongodb.error}`,
		);
	}

	await db.delete(MEMBERS_TABLE);
	const members = membersMongodb.data;
	await db.insert(MEMBERS_TABLE).values(members);
}

async function migrateSummoners() {
	const pipeline: MongoPipeline = [];
	pipeline.push({
		$lookup: {
			from: "summoner",
			localField: "_id",
			foreignField: "memberId",
			as: "leagueSummoners",
		},
	});
	const memberResponse = await dbh.genericPipeline(
		pipeline,
		CollectionName.MEMBER,
		MemberWithSummonerSchema,
	);

	if (!memberResponse.success) {
		throw new Error("Members with summoners couldn't be fetched");
	}

	await db.delete(LEAGUE_SUMMONERS_TABLE);

	const pgSummoners: (typeof LEAGUE_SUMMONERS_TABLE.$inferInsert)[] =
		memberResponse.data.flatMap((member) => {
			return member.leagueSummoners.map((summoner) => {
				return {
					...summoner,
					memberGameName: member.gameName,
				};
			});
		});

	await db.insert(LEAGUE_SUMMONERS_TABLE).values(pgSummoners);
}

async function migratePnP() {
	const SESSION_PIPELINE: MongoPipeline = [
		{
			$lookup: {
				from: "pen_and_paper_character",
				localField: "characterMemberIds",
				foreignField: "_id",
				as: "characters",
				pipeline: [
					{
						$lookup: {
							from: "member",
							localField: "memberId",
							foreignField: "_id",
							as: "member",
						},
					},
					{ $unwind: { path: "$member" } },
				],
			},
		},
		{
			$lookup: {
				from: "member",
				localField: "dmMemberId",
				foreignField: "_id",
				as: "dm",
			},
		},
		{ $unwind: { path: "$dm" } },
		{
			$project: {
				characterMemberIds: 0,
				dmMemberId: 0,
				"characters.memberId": 0,
			},
		},
		{
			$sort: {
				timestamp: -1,
			},
		},
	];

	const sessionResponse = await dbh.genericPipeline(
		SESSION_PIPELINE,
		CollectionName.PEN_AND_PAPER_SESSION,
		PenAndPaperSessionSchema,
	);
	if (!sessionResponse.success) {
		throw new Error("PnP sessions couldn't be fetched");
	}

	await db.delete(PEN_AND_PAPER_CHARACTER_TABLE);
	await db.delete(PEN_AND_PAPER_SESSION_TABLE);

	const charactersPG = new Map<
		string,
		typeof PEN_AND_PAPER_CHARACTER_TABLE.$inferInsert
	>();

	for (const session of sessionResponse.data) {
		for (const char of session.characters) {
			if (!charactersPG.has(char.name)) {
				charactersPG.set(char.name, {
					...char,
					memberGameName: char.member.gameName,
				});
			}
		}
	}

	const sessions: (typeof PEN_AND_PAPER_SESSION_TABLE.$inferInsert)[] =
		sessionResponse.data.map((session) => {
			return {
				...session,
				dmMemberGameName: session.dm.gameName,
				characters: session.characters.map((char) => char.name),
			};
		});

	await db
		.insert(PEN_AND_PAPER_CHARACTER_TABLE)
		.values(Array.from(charactersPG.values()));

	await db.insert(PEN_AND_PAPER_SESSION_TABLE).values(sessions);
}

async function migrateMatches() {
	const matchesMongo = await dbh.genericGet(CollectionName.MATCH, {
		limit: 100,
		offset: 0,
	});
	if (!matchesMongo.success) {
		throw new Error(
			`Failed to fetch matches from MongoDB: ${matchesMongo.error}`,
		);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const matches = (matchesMongo.data as any as MatchV5DB[]).map((match) => {
		return {
			matchId: match.metadata.matchId,
			dataVersion: match.metadata.dataVersion,
			raw: match,
		};
	});
	const participants: (typeof LEAGUE_MATCH_PARTICIPANTS_TABLE.$inferInsert)[] =
		matches.flatMap((match) => {
			return match.raw.info.participants.map((participant) => {
				return {
					...participant,
					matchId: match.raw.metadata.matchId,
					queueId: match.raw.info.queueId,
					gameMode: match.raw.info.gameMode,
					mapId: match.raw.info.mapId,
					gameDuration: match.raw.info.gameDuration,
				};
			});
		});

	await db.delete(LEAGUE_MATCHES_TABLE);
	await db.delete(LEAGUE_MATCH_PARTICIPANTS_TABLE);
	await db.insert(LEAGUE_MATCHES_TABLE).values(matches);
	await db.insert(LEAGUE_MATCH_PARTICIPANTS_TABLE).values(participants);
}

async function migrate() {
	//await migrateMembers();
	//await migrateSummoners();
	//await migratePnP();
	await migrateMatches();
}

migrate()
	.then(() => logger.debug("Successfully migrated"))
	.catch((error) => {
		logger.error({ err: error }, "Migration failed:");
	});
