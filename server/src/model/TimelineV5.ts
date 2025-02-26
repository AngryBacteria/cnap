import { z } from "zod";

export const PositionSchema = z
	.object({
		x: z.number().optional(),
		y: z.number().optional(),
	})
	.passthrough();
export type Position = z.infer<typeof PositionSchema>;

export const VictimDamageSchema = z
	.object({
		basic: z.boolean().optional(),
		magicDamage: z.number().optional(),
		name: z.string().optional(),
		participantId: z.number().optional(),
		physicalDamage: z.number().optional(),
		spellName: z.string().optional(),
		spellSlot: z.number().optional(),
		trueDamage: z.number().optional(),
		type: z.string().optional(),
	})
	.passthrough();
export type VictimDamage = z.infer<typeof VictimDamageSchema>;

export const ChampionStatsSchema = z
	.object({
		abilityHaste: z.number().optional(),
		abilityPower: z.number().optional(),
		armor: z.number().optional(),
		armorPen: z.number().optional(),
		armorPenPercent: z.number().optional(),
		attackDamage: z.number().optional(),
		attackSpeed: z.number().optional(),
		bonusArmorPenPercent: z.number().optional(),
		bonusMagicPenPercent: z.number().optional(),
		ccReduction: z.number().optional(),
		cooldownReduction: z.number().optional(),
		health: z.number().optional(),
		healthMax: z.number().optional(),
		healthRegen: z.number().optional(),
		lifesteal: z.number().optional(),
		magicPen: z.number().optional(),
		magicPenPercent: z.number().optional(),
		magicResist: z.number().optional(),
		movementSpeed: z.number().optional(),
		omnivamp: z.number().optional(),
		physicalVamp: z.number().optional(),
		power: z.number().optional(),
		powerMax: z.number().optional(),
		powerRegen: z.number().optional(),
		spellVamp: z.number().optional(),
	})
	.passthrough();
export type ChampionStats = z.infer<typeof ChampionStatsSchema>;

export const DamageStatsSchema = z
	.object({
		magicDamageDone: z.number().optional(),
		magicDamageDoneToChampions: z.number().optional(),
		magicDamageTaken: z.number().optional(),
		physicalDamageDone: z.number().optional(),
		physicalDamageDoneToChampions: z.number().optional(),
		physicalDamageTaken: z.number().optional(),
		totalDamageDone: z.number().optional(),
		totalDamageDoneToChampions: z.number().optional(),
		totalDamageTaken: z.number().optional(),
		trueDamageDone: z.number().optional(),
		trueDamageDoneToChampions: z.number().optional(),
		trueDamageTaken: z.number().optional(),
	})
	.passthrough();
export type DamageStats = z.infer<typeof DamageStatsSchema>;

export const ParticipantSchema = z
	.object({
		participantId: z.number().optional(),
		puuid: z.string().optional(),
	})
	.passthrough();
export type Participant = z.infer<typeof ParticipantSchema>;

export const MetadataSchema = z
	.object({
		dataVersion: z.string().optional(),
		matchId: z.string().optional(),
		participants: z.array(z.string()).optional(),
	})
	.passthrough();
export type Metadata = z.infer<typeof MetadataSchema>;

export const EventSchema = z
	.object({
		realTimestamp: z.number().optional(),
		timestamp: z.number().optional(),
		type: z.string().optional(),
		levelUpType: z.string().optional(),
		participantId: z.number().optional(),
		skillSlot: z.number().optional(),
		itemId: z.number().optional(),
		creatorId: z.number().optional(),
		wardType: z.string().optional(),
		killerId: z.number().optional(),
		assistingParticipantIds: z.array(z.number()).optional(),
		bounty: z.number().optional(),
		killStreakLength: z.number().optional(),
		position: PositionSchema.optional(),
		shutdownBounty: z.number().optional(),
		victimDamageDealt: z.array(VictimDamageSchema).optional(),
		victimDamageReceived: z.array(VictimDamageSchema).optional(),
		victimId: z.number().optional(),
		killType: z.string().optional(),
		level: z.number().optional(),
		laneType: z.string().optional(),
		teamId: z.number().optional(),
		multiKillLength: z.number().optional(),
		afterId: z.number().optional(),
		beforeId: z.number().optional(),
		goldGain: z.number().optional(),
		killerTeamId: z.number().optional(),
		monsterType: z.string().optional(),
		monsterSubType: z.string().optional(),
		buildingType: z.string().optional(),
		towerType: z.string().optional(),
		actualStartTime: z.number().optional(),
		gameId: z.number().optional(),
		winningTeam: z.number().optional(),
		name: z.string().optional(),
		transformType: z.string().optional(),
		featType: z.number().optional(),
		featValue: z.number().optional(),
	})
	.passthrough();
export type Event = z.infer<typeof EventSchema>;

export const The1Schema = z
	.object({
		championStats: ChampionStatsSchema.optional(),
		currentGold: z.number().optional(),
		damageStats: DamageStatsSchema.optional(),
		goldPerSecond: z.number().optional(),
		jungleMinionsKilled: z.number().optional(),
		level: z.number().optional(),
		minionsKilled: z.number().optional(),
		participantId: z.number().optional(),
		position: PositionSchema.optional(),
		timeEnemySpentControlled: z.number().optional(),
		totalGold: z.number().optional(),
		xp: z.number().optional(),
	})
	.passthrough();
export type The1 = z.infer<typeof The1Schema>;

export const ParticipantFramesSchema = z
	.object({
		"1": The1Schema.optional(),
		"2": The1Schema.optional(),
		"3": The1Schema.optional(),
		"4": The1Schema.optional(),
		"5": The1Schema.optional(),
		"6": The1Schema.optional(),
		"7": The1Schema.optional(),
		"8": The1Schema.optional(),
		"9": The1Schema.optional(),
		"10": The1Schema.optional(),
		"11": The1Schema.optional(),
		"12": The1Schema.optional(),
		"13": The1Schema.optional(),
		"14": The1Schema.optional(),
		"15": The1Schema.optional(),
		"16": The1Schema.optional(),
	})
	.passthrough();
export type ParticipantFrames = z.infer<typeof ParticipantFramesSchema>;

export const FrameSchema = z
	.object({
		events: z.array(EventSchema).optional(),
		participantFrames: ParticipantFramesSchema.optional(),
		timestamp: z.number().optional(),
	})
	.passthrough();
export type Frame = z.infer<typeof FrameSchema>;

export const InfoSchema = z
	.object({
		frameInterval: z.number().optional(),
		frames: z.array(FrameSchema).optional(),
		gameId: z.number().optional(),
		participants: z.array(ParticipantSchema).optional(),
		endOfGameResult: z.string().optional(),
	})
	.passthrough();
export type Info = z.infer<typeof InfoSchema>;

export const TimelineV5Schema = z
	.object({
		metadata: MetadataSchema.optional(),
		info: InfoSchema.optional(),
	})
	.passthrough();
export type TimelineV5 = z.infer<typeof TimelineV5Schema>;

//TODO: proper types
