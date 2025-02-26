import { z } from "zod";

export const ChallengesSchema = z
	.object({
		"12AssistStreakCount": z.number().optional(),
		abilityUses: z.number().optional(),
		acesBefore15Minutes: z.number().optional(),
		alliedJungleMonsterKills: z.number().optional(),
		baronTakedowns: z.number().optional(),
		blastConeOppositeOpponentCount: z.number().optional(),
		bountyGold: z.number().optional(),
		buffsStolen: z.number().optional(),
		completeSupportQuestInTime: z.number().optional(),
		controlWardsPlaced: z.number().optional(),
		damagePerMinute: z.number().optional(),
		damageTakenOnTeamPercentage: z.number().optional(),
		dancedWithRiftHerald: z.number().optional(),
		deathsByEnemyChamps: z.number().optional(),
		dodgeSkillShotsSmallWindow: z.number().optional(),
		doubleAces: z.number().optional(),
		dragonTakedowns: z.number().optional(),
		earlyLaningPhaseGoldExpAdvantage: z.number().optional(),
		effectiveHealAndShielding: z.number().optional(),
		elderDragonKillsWithOpposingSoul: z.number().optional(),
		elderDragonMultikills: z.number().optional(),
		enemyChampionImmobilizations: z.number().optional(),
		enemyJungleMonsterKills: z.number().optional(),
		epicMonsterKillsNearEnemyJungler: z.number().optional(),
		epicMonsterKillsWithin30SecondsOfSpawn: z.number().optional(),
		epicMonsterSteals: z.number().optional(),
		epicMonsterStolenWithoutSmite: z.number().optional(),
		firstTurretKilled: z.number().optional(),
		firstTurretKilledTime: z.number().optional(),
		flawlessAces: z.number().optional(),
		fullTeamTakedown: z.number().optional(),
		gameLength: z.number().optional(),
		getTakedownsInAllLanesEarlyJungleAsLaner: z.number().optional(),
		goldPerMinute: z.number().optional(),
		hadOpenNexus: z.number().optional(),
		immobilizeAndKillWithAlly: z.number().optional(),
		initialBuffCount: z.number().optional(),
		initialCrabCount: z.number().optional(),
		jungleCsBefore10Minutes: z.number().optional(),
		junglerTakedownsNearDamagedEpicMonster: z.number().optional(),
		kTurretsDestroyedBeforePlatesFall: z.number().optional(),
		kda: z.number().optional(),
		killAfterHiddenWithAlly: z.number().optional(),
		killParticipation: z.number().optional(),
		killedChampTookFullTeamDamageSurvived: z.number().optional(),
		killingSprees: z.number().optional(),
		killsNearEnemyTurret: z.number().optional(),
		killsOnOtherLanesEarlyJungleAsLaner: z.number().optional(),
		killsOnRecentlyHealedByAramPack: z.number().optional(),
		killsUnderOwnTurret: z.number().optional(),
		killsWithHelpFromEpicMonster: z.number().optional(),
		knockEnemyIntoTeamAndKill: z.number().optional(),
		landSkillShotsEarlyGame: z.number().optional(),
		laneMinionsFirst10Minutes: z.number().optional(),
		laningPhaseGoldExpAdvantage: z.number().optional(),
		legendaryCount: z.number().optional(),
		legendaryItemUsed: z.array(z.number()).optional(),
		lostAnInhibitor: z.number().optional(),
		maxCsAdvantageOnLaneOpponent: z.number().optional(),
		maxKillDeficit: z.number().optional(),
		maxLevelLeadLaneOpponent: z.number().optional(),
		mejaisFullStackInTime: z.number().optional(),
		moreEnemyJungleThanOpponent: z.number().optional(),
		multiKillOneSpell: z.number().optional(),
		multiTurretRiftHeraldCount: z.number().optional(),
		multikills: z.number().optional(),
		multikillsAfterAggressiveFlash: z.number().optional(),
		outerTurretExecutesBefore10Minutes: z.number().optional(),
		outnumberedKills: z.number().optional(),
		outnumberedNexusKill: z.number().optional(),
		perfectDragonSoulsTaken: z.number().optional(),
		perfectGame: z.number().optional(),
		pickKillWithAlly: z.number().optional(),
		poroExplosions: z.number().optional(),
		quickCleanse: z.number().optional(),
		quickFirstTurret: z.number().optional(),
		quickSoloKills: z.number().optional(),
		riftHeraldTakedowns: z.number().optional(),
		saveAllyFromDeath: z.number().optional(),
		scuttleCrabKills: z.number().optional(),
		skillshotsDodged: z.number().optional(),
		skillshotsHit: z.number().optional(),
		snowballsHit: z.number().optional(),
		soloBaronKills: z.number().optional(),
		soloKills: z.number().optional(),
		stealthWardsPlaced: z.number().optional(),
		survivedSingleDigitHpCount: z.number().optional(),
		survivedThreeImmobilizesInFight: z.number().optional(),
		takedownOnFirstTurret: z.number().optional(),
		takedowns: z.number().optional(),
		takedownsAfterGainingLevelAdvantage: z.number().optional(),
		takedownsBeforeJungleMinionSpawn: z.number().optional(),
		takedownsFirstXMinutes: z.number().optional(),
		takedownsInAlcove: z.number().optional(),
		takedownsInEnemyFountain: z.number().optional(),
		teamBaronKills: z.number().optional(),
		teamDamagePercentage: z.number().optional(),
		teamElderDragonKills: z.number().optional(),
		teamRiftHeraldKills: z.number().optional(),
		tookLargeDamageSurvived: z.number().optional(),
		turretPlatesTaken: z.number().optional(),
		turretTakedowns: z.number().optional(),
		turretsTakenWithRiftHerald: z.number().optional(),
		twentyMinionsIn3SecondsCount: z.number().optional(),
		twoWardsOneSweeperCount: z.number().optional(),
		unseenRecalls: z.number().optional(),
		visionScoreAdvantageLaneOpponent: z.number().optional(),
		visionScorePerMinute: z.number().optional(),
		wardTakedowns: z.number().optional(),
		wardTakedownsBefore20M: z.number().optional(),
		wardsGuarded: z.number().optional(),
		highestCrowdControlScore: z.number().optional(),
		highestWardKills: z.number().optional(),
		junglerKillsEarlyJungle: z.number().optional(),
		killsOnLanersEarlyJungleAsJungler: z.number().optional(),
		controlWardTimeCoverageInRiverOrEnemyHalf: z.number().optional(),
		fastestLegendary: z.number().optional(),
		highestChampionDamage: z.number().optional(),
		shortestTimeToAceFromFirstTakedown: z.number().optional(),
		soloTurretsLategame: z.number().optional(),
		earliestDragonTakedown: z.number().optional(),
		InfernalScalePickup: z.number().optional(),
		SWARM_DefeatAatrox: z.number().optional(),
		SWARM_DefeatBriar: z.number().optional(),
		SWARM_DefeatMiniBosses: z.number().optional(),
		SWARM_EvolveWeapon: z.number().optional(),
		SWARM_Have3Passives: z.number().optional(),
		SWARM_KillEnemy: z.number().optional(),
		SWARM_PickupGold: z.number().optional(),
		SWARM_ReachLevel50: z.number().optional(),
		SWARM_Survive15Min: z.number().optional(),
		SWARM_WinWith5EvolvedWeapons: z.number().optional(),
		earliestBaron: z.number().optional(),
		fistBumpParticipation: z.number().optional(),
		playedChampSelectPosition: z.number().optional(),
		thirdInhibitorDestroyedTime: z.number().optional(),
		voidMonsterKill: z.number().optional(),
		mythicItemUsed: z.number().optional(),
		baronBuffGoldAdvantageOverThreshold: z.number().optional(),
		hadAfkTeammate: z.number().optional(),
		teleportTakedowns: z.number().optional(),
		fasterSupportQuestCompletion: z.number().optional(),
		threeWardsOneSweeperCount: z.number().optional(),
		HealFromMapSources: z.number().optional(),
		earliestElderDragon: z.number().optional(),
	})
	.passthrough();
export type Challenges = z.infer<typeof ChallengesSchema>;

export const MissionsSchema = z
	.object({
		playerScore0: z.number().optional(),
		playerScore1: z.number().optional(),
		playerScore2: z.number().optional(),
		playerScore3: z.number().optional(),
		playerScore4: z.number().optional(),
		playerScore5: z.number().optional(),
		playerScore6: z.number().optional(),
		playerScore7: z.number().optional(),
		playerScore8: z.number().optional(),
		playerScore9: z.number().optional(),
		playerScore10: z.number().optional(),
		playerScore11: z.number().optional(),
	})
	.passthrough();
export type Missions = z.infer<typeof MissionsSchema>;

export const StatPerksSchema = z
	.object({
		defense: z.number().optional(),
		flex: z.number().optional(),
		offense: z.number().optional(),
	})
	.passthrough();
export type StatPerks = z.infer<typeof StatPerksSchema>;

export const SelectionSchema = z
	.object({
		perk: z.number().optional(),
		var1: z.number().optional(),
		var2: z.number().optional(),
		var3: z.number().optional(),
	})
	.passthrough();
export type Selection = z.infer<typeof SelectionSchema>;

export const BanSchema = z
	.object({
		championId: z.number().optional(),
		pickTurn: z.number().optional(),
	})
	.passthrough();
export type Ban = z.infer<typeof BanSchema>;

export const EpicMonsterKillSchema = z
	.object({
		featState: z.number().optional(),
	})
	.passthrough();
export type EpicMonsterKill = z.infer<typeof EpicMonsterKillSchema>;

export const AtakhanSchema = z
	.object({
		first: z.boolean().optional(),
		kills: z.number().optional(),
	})
	.passthrough();
export type Atakhan = z.infer<typeof AtakhanSchema>;

export const MetadataSchema = z
	.object({
		dataVersion: z.string().optional(),
		matchId: z.string().optional(),
		participants: z.array(z.string()).optional(),
	})
	.passthrough();
export type Metadata = z.infer<typeof MetadataSchema>;

export const StyleSchema = z
	.object({
		description: z.string().optional(),
		selections: z.array(SelectionSchema).optional(),
		style: z.number().optional(),
	})
	.passthrough();
export type Style = z.infer<typeof StyleSchema>;

export const FeatsSchema = z
	.object({
		EPIC_MONSTER_KILL: EpicMonsterKillSchema.optional(),
		FIRST_BLOOD: EpicMonsterKillSchema.optional(),
		FIRST_TURRET: EpicMonsterKillSchema.optional(),
	})
	.passthrough();
export type Feats = z.infer<typeof FeatsSchema>;

export const ObjectivesSchema = z
	.object({
		baron: AtakhanSchema.optional(),
		champion: AtakhanSchema.optional(),
		dragon: AtakhanSchema.optional(),
		horde: AtakhanSchema.optional(),
		inhibitor: AtakhanSchema.optional(),
		riftHerald: AtakhanSchema.optional(),
		tower: AtakhanSchema.optional(),
		atakhan: AtakhanSchema.optional(),
	})
	.passthrough();
export type Objectives = z.infer<typeof ObjectivesSchema>;

export const PerksSchema = z
	.object({
		statPerks: StatPerksSchema.optional(),
		styles: z.array(StyleSchema).optional(),
	})
	.passthrough();
export type Perks = z.infer<typeof PerksSchema>;

export const TeamSchema = z
	.object({
		bans: z.array(BanSchema).optional(),
		objectives: ObjectivesSchema.optional(),
		teamId: z.number().optional(),
		win: z.boolean().optional(),
		feats: FeatsSchema.optional(),
	})
	.passthrough();
export type Team = z.infer<typeof TeamSchema>;

export const ParticipantSchema = z
	.object({
		allInPings: z.number().optional(),
		assistMePings: z.number().optional(),
		assists: z.number().optional(),
		baronKills: z.number().optional(),
		basicPings: z.number().optional(),
		bountyLevel: z.number().optional(),
		challenges: ChallengesSchema.optional(),
		champExperience: z.number().optional(),
		champLevel: z.number().optional(),
		championId: z.number().optional(),
		championName: z.string().optional(),
		championTransform: z.number().optional(),
		commandPings: z.number().optional(),
		consumablesPurchased: z.number().optional(),
		damageDealtToBuildings: z.number().optional(),
		damageDealtToObjectives: z.number().optional(),
		damageDealtToTurrets: z.number().optional(),
		damageSelfMitigated: z.number().optional(),
		dangerPings: z.number().optional(),
		deaths: z.number().optional(),
		detectorWardsPlaced: z.number().optional(),
		doubleKills: z.number().optional(),
		dragonKills: z.number().optional(),
		eligibleForProgression: z.boolean().optional(),
		enemyMissingPings: z.number().optional(),
		enemyVisionPings: z.number().optional(),
		firstBloodAssist: z.boolean().optional(),
		firstBloodKill: z.boolean().optional(),
		firstTowerAssist: z.boolean().optional(),
		firstTowerKill: z.boolean().optional(),
		gameEndedInEarlySurrender: z.boolean().optional(),
		gameEndedInSurrender: z.boolean().optional(),
		getBackPings: z.number().optional(),
		goldEarned: z.number().optional(),
		goldSpent: z.number().optional(),
		holdPings: z.number().optional(),
		individualPosition: z.string().optional(),
		inhibitorKills: z.number().optional(),
		inhibitorTakedowns: z.number().optional(),
		inhibitorsLost: z.number().optional(),
		item0: z.number().optional(),
		item1: z.number().optional(),
		item2: z.number().optional(),
		item3: z.number().optional(),
		item4: z.number().optional(),
		item5: z.number().optional(),
		item6: z.number().optional(),
		itemsPurchased: z.number().optional(),
		killingSprees: z.number().optional(),
		kills: z.number().optional(),
		lane: z.string().optional(),
		largestCriticalStrike: z.number().optional(),
		largestKillingSpree: z.number().optional(),
		largestMultiKill: z.number().optional(),
		longestTimeSpentLiving: z.number().optional(),
		magicDamageDealt: z.number().optional(),
		magicDamageDealtToChampions: z.number().optional(),
		magicDamageTaken: z.number().optional(),
		missions: MissionsSchema.optional(),
		needVisionPings: z.number().optional(),
		neutralMinionsKilled: z.number().optional(),
		nexusKills: z.number().optional(),
		nexusLost: z.number().optional(),
		nexusTakedowns: z.number().optional(),
		objectivesStolen: z.number().optional(),
		objectivesStolenAssists: z.number().optional(),
		onMyWayPings: z.number().optional(),
		participantId: z.number().optional(),
		pentaKills: z.number().optional(),
		perks: PerksSchema.optional(),
		physicalDamageDealt: z.number().optional(),
		physicalDamageDealtToChampions: z.number().optional(),
		physicalDamageTaken: z.number().optional(),
		placement: z.number().optional(),
		playerAugment1: z.number().optional(),
		playerAugment2: z.number().optional(),
		playerAugment3: z.number().optional(),
		playerAugment4: z.number().optional(),
		playerSubteamId: z.number().optional(),
		profileIcon: z.number().optional(),
		pushPings: z.number().optional(),
		puuid: z.string().optional(),
		quadraKills: z.number().optional(),
		riotIdGameName: z.string().optional(),
		riotIdTagline: z.string().optional(),
		role: z.string().optional(),
		sightWardsBoughtInGame: z.number().optional(),
		spell1Casts: z.number().optional(),
		spell2Casts: z.number().optional(),
		spell3Casts: z.number().optional(),
		spell4Casts: z.number().optional(),
		subteamPlacement: z.number().optional(),
		summoner1Casts: z.number().optional(),
		summoner1Id: z.number().optional(),
		summoner2Casts: z.number().optional(),
		summoner2Id: z.number().optional(),
		summonerId: z.string().optional(),
		summonerLevel: z.number().optional(),
		summonerName: z.string().optional(),
		teamEarlySurrendered: z.boolean().optional(),
		teamId: z.number().optional(),
		teamPosition: z.string().optional(),
		timeCCingOthers: z.number().optional(),
		timePlayed: z.number().optional(),
		totalAllyJungleMinionsKilled: z.number().optional(),
		totalDamageDealt: z.number().optional(),
		totalDamageDealtToChampions: z.number().optional(),
		totalDamageShieldedOnTeammates: z.number().optional(),
		totalDamageTaken: z.number().optional(),
		totalEnemyJungleMinionsKilled: z.number().optional(),
		totalHeal: z.number().optional(),
		totalHealsOnTeammates: z.number().optional(),
		totalMinionsKilled: z.number().optional(),
		totalTimeCCDealt: z.number().optional(),
		totalTimeSpentDead: z.number().optional(),
		totalUnitsHealed: z.number().optional(),
		tripleKills: z.number().optional(),
		trueDamageDealt: z.number().optional(),
		trueDamageDealtToChampions: z.number().optional(),
		trueDamageTaken: z.number().optional(),
		turretKills: z.number().optional(),
		turretTakedowns: z.number().optional(),
		turretsLost: z.number().optional(),
		unrealKills: z.number().optional(),
		visionClearedPings: z.number().optional(),
		visionScore: z.number().optional(),
		visionWardsBoughtInGame: z.number().optional(),
		wardsKilled: z.number().optional(),
		wardsPlaced: z.number().optional(),
		win: z.boolean().optional(),
		playerAugment5: z.number().optional(),
		playerAugment6: z.number().optional(),
		baitPings: z.number().optional(),
		riotIdName: z.string().optional(),
		retreatPings: z.number().optional(),
		playerScore0: z.number().optional(),
		playerScore1: z.number().optional(),
		playerScore10: z.number().optional(),
		playerScore11: z.number().optional(),
		playerScore2: z.number().optional(),
		playerScore3: z.number().optional(),
		playerScore4: z.number().optional(),
		playerScore5: z.number().optional(),
		playerScore6: z.number().optional(),
		playerScore7: z.number().optional(),
		playerScore8: z.number().optional(),
		playerScore9: z.number().optional(),
		PlayerScore0: z.number().optional(),
		PlayerScore1: z.number().optional(),
		PlayerScore10: z.number().optional(),
		PlayerScore11: z.number().optional(),
		PlayerScore2: z.number().optional(),
		PlayerScore3: z.number().optional(),
		PlayerScore4: z.number().optional(),
		PlayerScore5: z.number().optional(),
		PlayerScore6: z.number().optional(),
		PlayerScore7: z.number().optional(),
		PlayerScore8: z.number().optional(),
		PlayerScore9: z.number().optional(),
	})
	.passthrough();
export type Participant = z.infer<typeof ParticipantSchema>;

export const InfoSchema = z
	.object({
		endOfGameResult: z.string().optional(),
		gameCreation: z.number().optional(),
		gameDuration: z.number().optional(),
		gameEndTimestamp: z.number().optional(),
		gameId: z.number().optional(),
		gameMode: z.string().optional(),
		gameName: z.string().optional(),
		gameStartTimestamp: z.number().optional(),
		gameType: z.string().optional(),
		gameVersion: z.string().optional(),
		mapId: z.number().optional(),
		participants: z.array(ParticipantSchema).optional(),
		platformId: z.string().optional(),
		queueId: z.number().optional(),
		teams: z.array(TeamSchema).optional(),
		tournamentCode: z.string().optional(),
	})
	.passthrough();
export type Info = z.infer<typeof InfoSchema>;

export const MatchV5Schema = z
	.object({
		metadata: MetadataSchema.optional(),
		info: InfoSchema.optional(),
	})
	.passthrough();
export type MatchV5 = z.infer<typeof MatchV5Schema>;
//TODO: proper types

export const InfoSingleSchema = InfoSchema.omit({ participants: true }).extend({
	participants: ParticipantSchema.optional(),
});
export type InfoSingle = z.infer<typeof InfoSingleSchema>;

export const MatchV5SingleSchema = z
	.object({
		metadata: MetadataSchema.optional(),
		info: InfoSingleSchema.optional(),
	})
	.passthrough();
export type MatchV5Single = z.infer<typeof MatchV5SingleSchema>;
