import dbh from "../helpers/DBHelper.js";
import logger from "../helpers/Logger.js";
import { CollectionName, type MongoPipeline } from "../model/Database.js";
import type { MatchV5DB } from "../model/MatchV5.js";
import { MemberDBSchema, MemberWithSummonerSchema } from "../model/Member.js";
import { PenAndPaperSessionSchema } from "../model/PenAndPaper.js";
import { db } from "./index.js";
import { MEMBERS_TABLE } from "./schemas/Member.js";
import { LEAGUE_SUMMONERS_TABLE } from "./schemas/Summoner.js";
import {
	LEAGUE_MATCHES_TABLE,
	LEAGUE_MATCH_PARTICIPANTS_TABLE,
	LEAGUE_TIMELINES_TABLE,
} from "./schemas/index.js";
import {
	PEN_AND_PAPER_CHARACTER_TABLE,
	PEN_AND_PAPER_SESSION_TABLE,
} from "./schemas/index.js";

async function migrateMembers() {
	logger.debug("Migrating members from MongoDB");

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

	logger.debug(
		`Members Migration completed! Total members processed: ${members.length}`,
	);
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

	logger.debug("Migrating summoners from MongoDB");

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

	logger.debug(
		`Summoners Migration completed! Total summoners processed: ${pgSummoners.length}`,
	);
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

	logger.debug("Migrating Pen and Paper sessions and characters from MongoDB");

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

	logger.debug(
		`PnP Migration completed! Total sessions processed: ${sessions.length}`,
	);
	logger.debug(
		`PnP Migration completed! Total characters processed: ${charactersPG.size}`,
	);
}

async function migrateTimeline() {
	const batchSize = 20;
	let offset = 0;
	let hasMoreData = true;

	// Clear tables once at the beginning
	logger.debug("Clearing existing Timelines data");
	await db.delete(LEAGUE_TIMELINES_TABLE);

	let totalProcessed = 0;
	while (hasMoreData) {
		logger.debug(`Processing batch starting at offset ${offset}...`);

		const timelinesMongo = await dbh.genericGet(CollectionName.TIMELINE, {
			limit: batchSize,
			offset: offset,
		});

		if (!timelinesMongo.success) {
			throw new Error(
				`Failed to fetch matches from MongoDB: ${timelinesMongo.error}`,
			);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const mongoData = timelinesMongo.data as any as MatchV5DB[];

		// Check if we've reached the end
		if (!mongoData || mongoData.length === 0) {
			hasMoreData = false;
			break;
		}

		// Process current batch
		const timelines = mongoData.map((match) => {
			return {
				matchId: match.metadata.matchId,
				dataVersion: match.metadata.dataVersion,
				raw: match,
			};
		});
		await db.insert(LEAGUE_TIMELINES_TABLE).values(timelines);

		totalProcessed += timelines.length;
		logger.debug(`Processed ${totalProcessed} matches so far...`);

		offset += batchSize;

		if (mongoData.length < batchSize) {
			hasMoreData = false;
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}
}

async function migrateMatches() {
	const batchSize = 20;
	let offset = 0;
	let hasMoreData = true;

	// Clear tables once at the beginning
	logger.debug("Clearing existing Matches data");
	await db.delete(LEAGUE_MATCHES_TABLE);
	await db.delete(LEAGUE_MATCH_PARTICIPANTS_TABLE);

	let totalProcessed = 0;

	while (hasMoreData) {
		logger.debug(`Processing batch starting at offset ${offset}...`);

		const matchesMongo = await dbh.genericGet(CollectionName.MATCH, {
			limit: batchSize,
			offset: offset,
		});

		if (!matchesMongo.success) {
			throw new Error(
				`Failed to fetch matches from MongoDB: ${matchesMongo.error}`,
			);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const mongoData = matchesMongo.data as any as MatchV5DB[];

		// Check if we've reached the end
		if (!mongoData || mongoData.length === 0) {
			hasMoreData = false;
			break;
		}

		// Process current batch
		const matches = mongoData.map((match) => {
			return {
				matchId: match.metadata.matchId,
				dataVersion: match.metadata.dataVersion,
				raw: match,
			};
		});

		const participants: (typeof LEAGUE_MATCH_PARTICIPANTS_TABLE.$inferInsert)[] =
			matches.flatMap((match) => {
				return match.raw.info.participants
					.filter((participant) => participant.puuid.toLowerCase() !== "bot")
					.map((participant) => {
						return {
							...participant,
							matchId: match.raw.metadata.matchId,
							queueId: match.raw.info.queueId,
							gameMode: match.raw.info.gameMode,
							mapId: match.raw.info.mapId,
							gameDuration: match.raw.info.gameDuration,
							endOfGameResult: match.raw.info.endOfGameResult,
							gameCreation: match.raw.info.gameCreation,
							gameType: match.raw.info.gameType,
							gameVersion: match.raw.info.gameVersion,
							platformId: match.raw.info.platformId,
						};
					});
			});

		await db.insert(LEAGUE_MATCHES_TABLE).values(matches);
		await db.insert(LEAGUE_MATCH_PARTICIPANTS_TABLE).values(participants);

		totalProcessed += matches.length;
		logger.debug(`Processed ${totalProcessed} matches so far...`);

		offset += batchSize;

		if (mongoData.length < batchSize) {
			hasMoreData = false;
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	logger.debug(
		`Matches Migration completed! Total matches processed: ${totalProcessed}`,
	);
}

async function migrate() {
	// await migrateMembers();
	// await migrateSummoners();
	await migratePnP();
	// await migrateMatches();
	// await migrateTimeline();
}

migrate()
	.then(() => logger.debug("Successfully migrated"))
	.catch((error) => {
		logger.error({ err: error }, "Migration failed:");
	});

/**
 * ALTER TABLE league_match_participants
 * ADD COLUMN if not exists testcol integer;
 *
 * UPDATE league_match_participants lmp
 * SET testcol = COALESCE(
 *     (participant_data->>'baronKills')::integer,
 *     0
 * )
 * FROM league_matches lm,
 * LATERAL jsonb_array_elements(lm.raw->'info'->'participants') AS participant_data
 * WHERE lmp.match_id = lm.match_id
 * AND participant_data->>'puuid' = lmp.puuid;
 */
