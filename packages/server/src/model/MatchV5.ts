import z from "zod/v4";

const ParticipantSchema = z.looseObject({
	assists: z.number(),
	championId: z.number(),
	deaths: z.number(),
	doubleKills: z.number(),
	gameEndedInEarlySurrender: z.boolean(),
	gameEndedInSurrender: z.boolean(),
	individualPosition: z.string(),
	item0: z.number(),
	item1: z.number(),
	item2: z.number(),
	item3: z.number(),
	item4: z.number(),
	item5: z.number(),
	item6: z.number(),
	kills: z.number(),
	lane: z.string(),
	puuid: z.string(),
	riotIdTagline: z.string(),
	summonerName: z.string(),
	teamPosition: z.string(),
	win: z.boolean(),
	summoner1Id: z.number(),
	summoner2Id: z.number(),
	tripleKills: z.number(),
	quadraKills: z.number(),
	pentaKills: z.number(),
	visionScore: z.number(),
	totalMinionsKilled: z.number(),
});

const InfoSchema = z.looseObject({
	endOfGameResult: z.string(),
	gameCreation: z.number(),
	gameDuration: z.number(),
	gameMode: z.string(),
	gameType: z.string(),
	gameVersion: z.string(),
	mapId: z.number(),
	participants: z.array(ParticipantSchema),
	queueId: z.number(),
	platformId: z.string(),
});

const MetadataSchema = z.looseObject({
	dataVersion: z.string(),
	matchId: z.string(),
	participants: z.array(z.string()),
});

export const MatchSchema = z.looseObject({
	metadata: MetadataSchema,
	info: InfoSchema,
});

export type MatchV5DB = z.infer<typeof MatchSchema>;
