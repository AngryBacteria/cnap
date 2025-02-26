/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Ban */
export interface Ban {
  /** Championid */
  championId: number;
  /** Pickturn */
  pickTurn: number;
  [key: string]: any;
}

/** Baron */
export interface Baron {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** Challenges */
export interface Challenges {
  /** 12Assiststreakcount */
  "12AssistStreakCount": number;
  /** Infernalscalepickup */
  InfernalScalePickup: number;
  /** Swarm Defeataatrox */
  SWARM_DefeatAatrox: number;
  /** Swarm Defeatbriar */
  SWARM_DefeatBriar: number;
  /** Swarm Defeatminibosses */
  SWARM_DefeatMiniBosses: number;
  /** Swarm Evolveweapon */
  SWARM_EvolveWeapon: number;
  /** Swarm Have3Passives */
  SWARM_Have3Passives: number;
  /** Swarm Killenemy */
  SWARM_KillEnemy: number;
  /** Swarm Pickupgold */
  SWARM_PickupGold: number;
  /** Swarm Reachlevel50 */
  SWARM_ReachLevel50: number;
  /** Swarm Survive15Min */
  SWARM_Survive15Min: number;
  /** Swarm Winwith5Evolvedweapons */
  SWARM_WinWith5EvolvedWeapons: number;
  /** Abilityuses */
  abilityUses: number;
  /** Acesbefore15Minutes */
  acesBefore15Minutes: number;
  /** Alliedjunglemonsterkills */
  alliedJungleMonsterKills: number;
  /** Baronbuffgoldadvantageoverthreshold */
  baronBuffGoldAdvantageOverThreshold?: number | null;
  /** Barontakedowns */
  baronTakedowns: number;
  /** Blastconeoppositeopponentcount */
  blastConeOppositeOpponentCount: number;
  /** Bountygold */
  bountyGold: number;
  /** Buffsstolen */
  buffsStolen: number;
  /** Completesupportquestintime */
  completeSupportQuestInTime: number;
  /** Controlwardtimecoverageinriverorenemyhalf */
  controlWardTimeCoverageInRiverOrEnemyHalf?: number | null;
  /** Controlwardsplaced */
  controlWardsPlaced: number;
  /** Damageperminute */
  damagePerMinute: number;
  /** Damagetakenonteampercentage */
  damageTakenOnTeamPercentage: number;
  /** Dancedwithriftherald */
  dancedWithRiftHerald: number;
  /** Deathsbyenemychamps */
  deathsByEnemyChamps: number;
  /** Dodgeskillshotssmallwindow */
  dodgeSkillShotsSmallWindow: number;
  /** Doubleaces */
  doubleAces: number;
  /** Dragontakedowns */
  dragonTakedowns: number;
  /** Earliestbaron */
  earliestBaron?: number | null;
  /** Earlylaningphasegoldexpadvantage */
  earlyLaningPhaseGoldExpAdvantage: number;
  /** Effectivehealandshielding */
  effectiveHealAndShielding: number;
  /** Elderdragonkillswithopposingsoul */
  elderDragonKillsWithOpposingSoul: number;
  /** Elderdragonmultikills */
  elderDragonMultikills: number;
  /** Enemychampionimmobilizations */
  enemyChampionImmobilizations: number;
  /** Enemyjunglemonsterkills */
  enemyJungleMonsterKills: number;
  /** Epicmonsterkillsnearenemyjungler */
  epicMonsterKillsNearEnemyJungler: number;
  /** Epicmonsterkillswithin30Secondsofspawn */
  epicMonsterKillsWithin30SecondsOfSpawn: number;
  /** Epicmonstersteals */
  epicMonsterSteals: number;
  /** Epicmonsterstolenwithoutsmite */
  epicMonsterStolenWithoutSmite: number;
  /** Firstturretkilled */
  firstTurretKilled: number;
  /** Firstturretkilledtime */
  firstTurretKilledTime?: number | null;
  /** Fistbumpparticipation */
  fistBumpParticipation: number;
  /** Flawlessaces */
  flawlessAces: number;
  /** Fullteamtakedown */
  fullTeamTakedown: number;
  /** Gamelength */
  gameLength: number;
  /** Gettakedownsinalllanesearlyjungleaslaner */
  getTakedownsInAllLanesEarlyJungleAsLaner?: number | null;
  /** Goldperminute */
  goldPerMinute: number;
  /** Hadopennexus */
  hadOpenNexus: number;
  /** Highestcrowdcontrolscore */
  highestCrowdControlScore?: number | null;
  /** Immobilizeandkillwithally */
  immobilizeAndKillWithAlly: number;
  /** Initialbuffcount */
  initialBuffCount: number;
  /** Initialcrabcount */
  initialCrabCount: number;
  /** Junglecsbefore10Minutes */
  jungleCsBefore10Minutes: number;
  /** Junglertakedownsneardamagedepicmonster */
  junglerTakedownsNearDamagedEpicMonster: number;
  /** Kturretsdestroyedbeforeplatesfall */
  kTurretsDestroyedBeforePlatesFall: number;
  /** Kda */
  kda: number;
  /** Killafterhiddenwithally */
  killAfterHiddenWithAlly: number;
  /** Killparticipation */
  killParticipation: number;
  /** Killedchamptookfullteamdamagesurvived */
  killedChampTookFullTeamDamageSurvived: number;
  /** Killingsprees */
  killingSprees: number;
  /** Killsnearenemyturret */
  killsNearEnemyTurret: number;
  /** Killsonotherlanesearlyjungleaslaner */
  killsOnOtherLanesEarlyJungleAsLaner?: number | null;
  /** Killsonrecentlyhealedbyarampack */
  killsOnRecentlyHealedByAramPack: number;
  /** Killsunderownturret */
  killsUnderOwnTurret: number;
  /** Killswithhelpfromepicmonster */
  killsWithHelpFromEpicMonster: number;
  /** Knockenemyintoteamandkill */
  knockEnemyIntoTeamAndKill: number;
  /** Landskillshotsearlygame */
  landSkillShotsEarlyGame: number;
  /** Laneminionsfirst10Minutes */
  laneMinionsFirst10Minutes: number;
  /** Laningphasegoldexpadvantage */
  laningPhaseGoldExpAdvantage?: number | null;
  /** Legendarycount */
  legendaryCount: number;
  /** Legendaryitemused */
  legendaryItemUsed: number[];
  /** Lostaninhibitor */
  lostAnInhibitor: number;
  /** Maxcsadvantageonlaneopponent */
  maxCsAdvantageOnLaneOpponent: number;
  /** Maxkilldeficit */
  maxKillDeficit: number;
  /** Maxlevelleadlaneopponent */
  maxLevelLeadLaneOpponent: number;
  /** Mejaisfullstackintime */
  mejaisFullStackInTime: number;
  /** Moreenemyjunglethanopponent */
  moreEnemyJungleThanOpponent: number;
  /** Multikillonespell */
  multiKillOneSpell: number;
  /** Multiturretriftheraldcount */
  multiTurretRiftHeraldCount: number;
  /** Multikills */
  multikills: number;
  /** Multikillsafteraggressiveflash */
  multikillsAfterAggressiveFlash: number;
  /** Outerturretexecutesbefore10Minutes */
  outerTurretExecutesBefore10Minutes: number;
  /** Outnumberedkills */
  outnumberedKills: number;
  /** Outnumberednexuskill */
  outnumberedNexusKill: number;
  /** Perfectdragonsoulstaken */
  perfectDragonSoulsTaken: number;
  /** Perfectgame */
  perfectGame: number;
  /** Pickkillwithally */
  pickKillWithAlly: number;
  /** Playedchampselectposition */
  playedChampSelectPosition?: number | null;
  /** Poroexplosions */
  poroExplosions: number;
  /** Quickcleanse */
  quickCleanse: number;
  /** Quickfirstturret */
  quickFirstTurret: number;
  /** Quicksolokills */
  quickSoloKills: number;
  /** Riftheraldtakedowns */
  riftHeraldTakedowns: number;
  /** Saveallyfromdeath */
  saveAllyFromDeath: number;
  /** Scuttlecrabkills */
  scuttleCrabKills: number;
  /** Skillshotsdodged */
  skillshotsDodged: number;
  /** Skillshotshit */
  skillshotsHit: number;
  /** Snowballshit */
  snowballsHit: number;
  /** Solobaronkills */
  soloBaronKills: number;
  /** Solokills */
  soloKills: number;
  /** Soloturretslategame */
  soloTurretsLategame?: number | null;
  /** Stealthwardsplaced */
  stealthWardsPlaced: number;
  /** Survivedsingledigithpcount */
  survivedSingleDigitHpCount: number;
  /** Survivedthreeimmobilizesinfight */
  survivedThreeImmobilizesInFight: number;
  /** Takedownonfirstturret */
  takedownOnFirstTurret: number;
  /** Takedowns */
  takedowns: number;
  /** Takedownsaftergainingleveladvantage */
  takedownsAfterGainingLevelAdvantage: number;
  /** Takedownsbeforejungleminionspawn */
  takedownsBeforeJungleMinionSpawn: number;
  /** Takedownsfirstxminutes */
  takedownsFirstXMinutes: number;
  /** Takedownsinalcove */
  takedownsInAlcove: number;
  /** Takedownsinenemyfountain */
  takedownsInEnemyFountain: number;
  /** Teambaronkills */
  teamBaronKills: number;
  /** Teamdamagepercentage */
  teamDamagePercentage: number;
  /** Teamelderdragonkills */
  teamElderDragonKills: number;
  /** Teamriftheraldkills */
  teamRiftHeraldKills: number;
  /** Tooklargedamagesurvived */
  tookLargeDamageSurvived: number;
  /** Turretplatestaken */
  turretPlatesTaken: number;
  /** Turrettakedowns */
  turretTakedowns: number;
  /** Turretstakenwithriftherald */
  turretsTakenWithRiftHerald: number;
  /** Twentyminionsin3Secondscount */
  twentyMinionsIn3SecondsCount: number;
  /** Twowardsonesweepercount */
  twoWardsOneSweeperCount: number;
  /** Unseenrecalls */
  unseenRecalls: number;
  /** Visionscoreadvantagelaneopponent */
  visionScoreAdvantageLaneOpponent: number;
  /** Visionscoreperminute */
  visionScorePerMinute: number;
  /** Voidmonsterkill */
  voidMonsterKill: number;
  /** Wardtakedowns */
  wardTakedowns: number;
  /** Wardtakedownsbefore20M */
  wardTakedownsBefore20M: number;
  /** Wardsguarded */
  wardsGuarded: number;
  /** Earliestdragontakedown */
  earliestDragonTakedown?: number | null;
  /** Junglerkillsearlyjungle */
  junglerKillsEarlyJungle?: number | null;
  /** Killsonlanersearlyjungleasjungler */
  killsOnLanersEarlyJungleAsJungler?: number | null;
  /** Fastestlegendary */
  fastestLegendary?: number | null;
  /** Highestchampiondamage */
  highestChampionDamage?: number | null;
  /** Highestwardkills */
  highestWardKills?: number | null;
  /** Shortesttimetoacefromfirsttakedown */
  shortestTimeToAceFromFirstTakedown?: number | null;
  /** Fastersupportquestcompletion */
  fasterSupportQuestCompletion?: number | null;
  /** Healfrommapsources */
  HealFromMapSources?: number | null;
  /** Hadafkteammate */
  hadAfkTeammate?: number | null;
  /** Teleporttakedowns */
  teleportTakedowns?: number | null;
  [key: string]: any;
}

/** Champion */
export interface Champion {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** ChampionDTO */
export interface ChampionDTO {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Alias */
  alias: string;
  /** Title */
  title: string;
  /** Shortbio */
  shortBio: string;
  tacticalInfo: LolV1ChampionTacticalInfo;
  playstyleInfo: LolV1ChampionPlaystyleInfo;
  /** Squareportraitpath */
  squarePortraitPath: string;
  /** Stingersfxpath */
  stingerSfxPath: string;
  /** Choosevopath */
  chooseVoPath: string;
  /** Banvopath */
  banVoPath: string;
  /** Roles */
  roles: string[];
  /** Recommendeditemdefaults */
  recommendedItemDefaults: number[];
  /** Skins */
  skins: LolV1ChampionSkin[];
  passive: LolV1ChampionPassive;
  /** Spells */
  spells: LolV1ChampionSpell[];
  /** Uncenteredsplashpath */
  uncenteredSplashPath: string;
  [key: string]: any;
}

/** ChampionReducedDTO */
export interface ChampionReducedDTO {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Alias */
  alias: string;
  /** Title */
  title: string;
  /** Shortbio */
  shortBio: string;
  /** Uncenteredsplashpath */
  uncenteredSplashPath: string;
  [key: string]: any;
}

/** Dragon */
export interface Dragon {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** Horde */
export interface Horde {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** InfoSingle */
export interface InfoSingle {
  /** Endofgameresult */
  endOfGameResult: string;
  /** Gamecreation */
  gameCreation: number;
  /** Gameduration */
  gameDuration: number;
  /** Gameendtimestamp */
  gameEndTimestamp: number;
  /** Gameid */
  gameId: number;
  /** Gamemode */
  gameMode: string;
  /** Gamename */
  gameName: string;
  /** Gamestarttimestamp */
  gameStartTimestamp: number;
  /** Gametype */
  gameType: string;
  /** Gameversion */
  gameVersion: string;
  /** Mapid */
  mapId: number;
  participants: Participant;
  /** Platformid */
  platformId: string;
  /** Queueid */
  queueId: number;
  /** Teams */
  teams: Team[];
  /** Tournamentcode */
  tournamentCode: string;
  [key: string]: any;
}

/** Inhibitor */
export interface Inhibitor {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** ItemDTO */
export interface ItemDTO {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Active */
  active: boolean;
  /** Instore */
  inStore: boolean;
  /** Categories */
  categories: string[];
  /** Maxstacks */
  maxStacks: number;
  /** Requiredchampion */
  requiredChampion: string;
  /** Requiredally */
  requiredAlly: string;
  /** Requiredbuffcurrencyname */
  requiredBuffCurrencyName: string;
  /** Requiredbuffcurrencycost */
  requiredBuffCurrencyCost: number;
  /** Specialrecipe */
  specialRecipe: number;
  /** Isenchantment */
  isEnchantment: boolean;
  /** Price */
  price: number;
  /** Pricetotal */
  priceTotal: number;
  /** Iconpath */
  iconPath: string;
  /** Displayinitemsets */
  displayInItemSets: boolean;
  [key: string]: any;
}

/** LolV1ChampionPassive */
export interface LolV1ChampionPassive {
  /** Name */
  name: string;
  /** Abilityiconpath */
  abilityIconPath: string;
  /** Abilityvideopath */
  abilityVideoPath: string;
  /** Abilityvideoimagepath */
  abilityVideoImagePath: string;
  /** Description */
  description: string;
  [key: string]: any;
}

/** LolV1ChampionPlaystyleInfo */
export interface LolV1ChampionPlaystyleInfo {
  /** Damage */
  damage: number;
  /** Durability */
  durability: number;
  /** Crowdcontrol */
  crowdControl: number;
  /** Mobility */
  mobility: number;
  /** Utility */
  utility: number;
  [key: string]: any;
}

/** LolV1ChampionSkin */
export interface LolV1ChampionSkin {
  /** Id */
  id: number;
  /** Isbase */
  isBase: boolean;
  /** Name */
  name: string;
  /** Splashpath */
  splashPath: string;
  /** Uncenteredsplashpath */
  uncenteredSplashPath: string;
  /** Tilepath */
  tilePath: string;
  /** Loadscreenpath */
  loadScreenPath: string;
  /** Loadscreenvintagepath */
  loadScreenVintagePath?: string | null;
  /** Skintype */
  skinType: string;
  /** Rarity */
  rarity: string;
  /** Islegacy */
  isLegacy: boolean;
  /** Splashvideopath */
  splashVideoPath: string | null;
  /** Collectionsplashvideopath */
  collectionSplashVideoPath: string | null;
  /** Collectioncardhovervideopath */
  collectionCardHoverVideoPath: string | null;
  /** Featurestext */
  featuresText: string | null;
  /** Chromapath */
  chromaPath?: string | null;
  /** Emblems */
  emblems: string | null;
  /** Regionrarityid */
  regionRarityId: number;
  /** Raritygempath */
  rarityGemPath: string | null;
  /** Skinlines */
  skinLines: LolV1ChampionSkinLine[] | null;
  /** Description */
  description: string | null;
  /** Chromas */
  chromas?: LolV1ChampionSkinChroma[] | null;
  [key: string]: any;
}

/** LolV1ChampionSkinChroma */
export interface LolV1ChampionSkinChroma {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Chromapath */
  chromaPath: string;
  /** Colors */
  colors: string[];
  /** Descriptions */
  descriptions: LolV1ChampionSkinChromaDescription[];
  /** Rarities */
  rarities: LolV1ChampionSkinChromaRarity[];
  [key: string]: any;
}

/** LolV1ChampionSkinChromaDescription */
export interface LolV1ChampionSkinChromaDescription {
  /** Region */
  region: string;
  /** Description */
  description: string;
  [key: string]: any;
}

/** LolV1ChampionSkinChromaRarity */
export interface LolV1ChampionSkinChromaRarity {
  /** Region */
  region: string;
  /** Rarity */
  rarity: number;
  [key: string]: any;
}

/** LolV1ChampionSkinLine */
export interface LolV1ChampionSkinLine {
  /** Id */
  id: number;
  [key: string]: any;
}

/** LolV1ChampionSpell */
export interface LolV1ChampionSpell {
  /** Spellkey */
  spellKey: string;
  /** Name */
  name: string;
  /** Abilityiconpath */
  abilityIconPath: string;
  /** Abilityvideopath */
  abilityVideoPath: string;
  /** Abilityvideoimagepath */
  abilityVideoImagePath: string;
  /** Cost */
  cost: string;
  /** Cooldown */
  cooldown: string;
  /** Description */
  description: string;
  /** Dynamicdescription */
  dynamicDescription: string;
  /** Range */
  range: number[];
  /** Costcoefficients */
  costCoefficients: number[];
  /** Cooldowncoefficients */
  cooldownCoefficients: number[];
  coefficients: LolV1ChampionSpellCoefficients;
  effectAmounts: LolV1ChampionSpellEffectAmounts;
  ammo: LolV1ChampionSpellAmmo;
  /** Maxlevel */
  maxLevel: number;
  [key: string]: any;
}

/** LolV1ChampionSpellAmmo */
export interface LolV1ChampionSpellAmmo {
  /** Ammorechargetime */
  ammoRechargeTime: number[];
  /** Maxammo */
  maxAmmo: number[];
  [key: string]: any;
}

/** LolV1ChampionSpellCoefficients */
export interface LolV1ChampionSpellCoefficients {
  /** Coefficient1 */
  coefficient1: number;
  /** Coefficient2 */
  coefficient2: number;
  [key: string]: any;
}

/** LolV1ChampionSpellEffectAmounts */
export interface LolV1ChampionSpellEffectAmounts {
  /** Effect1Amount */
  Effect1Amount: number[];
  /** Effect2Amount */
  Effect2Amount: number[];
  /** Effect3Amount */
  Effect3Amount: number[];
  /** Effect4Amount */
  Effect4Amount: number[];
  /** Effect5Amount */
  Effect5Amount: number[];
  /** Effect6Amount */
  Effect6Amount: number[];
  /** Effect7Amount */
  Effect7Amount: number[];
  /** Effect8Amount */
  Effect8Amount: number[];
  /** Effect9Amount */
  Effect9Amount: number[];
  /** Effect10Amount */
  Effect10Amount: number[];
  [key: string]: any;
}

/** LolV1ChampionTacticalInfo */
export interface LolV1ChampionTacticalInfo {
  /** Style */
  style: number;
  /** Difficulty */
  difficulty: number;
  /** Damagetype */
  damageType: string;
  [key: string]: any;
}

/** MatchV5SingleDTO */
export interface MatchV5SingleDTO {
  metadata: Metadata;
  info: InfoSingle;
  [key: string]: any;
}

/** MatchesByChampionResponse */
export interface MatchesByChampionResponse {
  /** Page */
  page: number;
  /** Maxpage */
  maxPage: number;
  /** Data */
  data: MatchV5SingleDTO[];
  [key: string]: any;
}

/** Metadata */
export interface Metadata {
  /** Dataversion */
  dataVersion: string;
  /** Matchid */
  matchId: string;
  /** Participants */
  participants: string[];
  [key: string]: any;
}

/** Missions */
export interface Missions {
  /** Playerscore0 */
  playerScore0: number;
  /** Playerscore1 */
  playerScore1: number;
  /** Playerscore2 */
  playerScore2: number;
  /** Playerscore3 */
  playerScore3: number;
  /** Playerscore4 */
  playerScore4: number;
  /** Playerscore5 */
  playerScore5: number;
  /** Playerscore6 */
  playerScore6: number;
  /** Playerscore7 */
  playerScore7: number;
  /** Playerscore8 */
  playerScore8: number;
  /** Playerscore9 */
  playerScore9: number;
  /** Playerscore10 */
  playerScore10: number;
  /** Playerscore11 */
  playerScore11: number;
  [key: string]: any;
}

/** Objectives */
export interface Objectives {
  baron: Baron;
  champion: Champion;
  dragon: Dragon;
  horde: Horde;
  inhibitor: Inhibitor;
  riftHerald: RiftHerald;
  tower: Tower;
  [key: string]: any;
}

/** Participant */
export interface Participant {
  /** Allinpings */
  allInPings: number;
  /** Assistmepings */
  assistMePings: number;
  /** Assists */
  assists: number;
  /** Baronkills */
  baronKills: number;
  /** Basicpings */
  basicPings: number;
  /** Bountylevel */
  bountyLevel: number;
  challenges?: Challenges | null;
  /** Champexperience */
  champExperience: number;
  /** Champlevel */
  champLevel: number;
  /** Championid */
  championId: number;
  /** Championname */
  championName: string;
  /** Championtransform */
  championTransform: number;
  /** Commandpings */
  commandPings: number;
  /** Consumablespurchased */
  consumablesPurchased: number;
  /** Damagedealttobuildings */
  damageDealtToBuildings: number;
  /** Damagedealttoobjectives */
  damageDealtToObjectives: number;
  /** Damagedealttoturrets */
  damageDealtToTurrets: number;
  /** Damageselfmitigated */
  damageSelfMitigated: number;
  /** Dangerpings */
  dangerPings: number;
  /** Deaths */
  deaths: number;
  /** Detectorwardsplaced */
  detectorWardsPlaced: number;
  /** Doublekills */
  doubleKills: number;
  /** Dragonkills */
  dragonKills: number;
  /** Eligibleforprogression */
  eligibleForProgression: boolean;
  /** Enemymissingpings */
  enemyMissingPings: number;
  /** Enemyvisionpings */
  enemyVisionPings: number;
  /** Firstbloodassist */
  firstBloodAssist: boolean;
  /** Firstbloodkill */
  firstBloodKill: boolean;
  /** Firsttowerassist */
  firstTowerAssist: boolean;
  /** Firsttowerkill */
  firstTowerKill: boolean;
  /** Gameendedinearlysurrender */
  gameEndedInEarlySurrender: boolean;
  /** Gameendedinsurrender */
  gameEndedInSurrender: boolean;
  /** Getbackpings */
  getBackPings: number;
  /** Goldearned */
  goldEarned: number;
  /** Goldspent */
  goldSpent: number;
  /** Holdpings */
  holdPings: number;
  /** Individualposition */
  individualPosition: string;
  /** Inhibitorkills */
  inhibitorKills: number;
  /** Inhibitortakedowns */
  inhibitorTakedowns: number;
  /** Inhibitorslost */
  inhibitorsLost: number;
  /** Item0 */
  item0: number;
  /** Item1 */
  item1: number;
  /** Item2 */
  item2: number;
  /** Item3 */
  item3: number;
  /** Item4 */
  item4: number;
  /** Item5 */
  item5: number;
  /** Item6 */
  item6: number;
  /** Itemspurchased */
  itemsPurchased: number;
  /** Killingsprees */
  killingSprees: number;
  /** Kills */
  kills: number;
  /** Lane */
  lane: string;
  /** Largestcriticalstrike */
  largestCriticalStrike: number;
  /** Largestkillingspree */
  largestKillingSpree: number;
  /** Largestmultikill */
  largestMultiKill: number;
  /** Longesttimespentliving */
  longestTimeSpentLiving: number;
  /** Magicdamagedealt */
  magicDamageDealt: number;
  /** Magicdamagedealttochampions */
  magicDamageDealtToChampions: number;
  /** Magicdamagetaken */
  magicDamageTaken: number;
  missions: Missions;
  /** Needvisionpings */
  needVisionPings: number;
  /** Neutralminionskilled */
  neutralMinionsKilled: number;
  /** Nexuskills */
  nexusKills: number;
  /** Nexuslost */
  nexusLost: number;
  /** Nexustakedowns */
  nexusTakedowns: number;
  /** Objectivesstolen */
  objectivesStolen: number;
  /** Objectivesstolenassists */
  objectivesStolenAssists: number;
  /** Onmywaypings */
  onMyWayPings: number;
  /** Participantid */
  participantId: number;
  /** Pentakills */
  pentaKills: number;
  perks?: Perks | null;
  /** Physicaldamagedealt */
  physicalDamageDealt: number;
  /** Physicaldamagedealttochampions */
  physicalDamageDealtToChampions: number;
  /** Physicaldamagetaken */
  physicalDamageTaken: number;
  /** Placement */
  placement: number;
  /** Playeraugment1 */
  playerAugment1: number;
  /** Playeraugment2 */
  playerAugment2: number;
  /** Playeraugment3 */
  playerAugment3: number;
  /** Playeraugment4 */
  playerAugment4: number;
  /** Playeraugment5 */
  playerAugment5: number;
  /** Playeraugment6 */
  playerAugment6: number;
  /** Playersubteamid */
  playerSubteamId: number;
  /** Profileicon */
  profileIcon: number;
  /** Pushpings */
  pushPings: number;
  /** Puuid */
  puuid: string;
  /** Quadrakills */
  quadraKills: number;
  /** Riotidgamename */
  riotIdGameName: string;
  /** Riotidtagline */
  riotIdTagline: string;
  /** Role */
  role: string;
  /** Sightwardsboughtingame */
  sightWardsBoughtInGame: number;
  /** Spell1Casts */
  spell1Casts: number;
  /** Spell2Casts */
  spell2Casts: number;
  /** Spell3Casts */
  spell3Casts: number;
  /** Spell4Casts */
  spell4Casts: number;
  /** Subteamplacement */
  subteamPlacement: number;
  /** Summoner1Casts */
  summoner1Casts: number;
  /** Summoner1Id */
  summoner1Id: number;
  /** Summoner2Casts */
  summoner2Casts: number;
  /** Summoner2Id */
  summoner2Id: number;
  /** Summonerid */
  summonerId: string;
  /** Summonerlevel */
  summonerLevel: number;
  /** Summonername */
  summonerName: string;
  /** Teamearlysurrendered */
  teamEarlySurrendered: boolean;
  /** Teamid */
  teamId: number;
  /** Teamposition */
  teamPosition: string;
  /** Timeccingothers */
  timeCCingOthers: number;
  /** Timeplayed */
  timePlayed: number;
  /** Totalallyjungleminionskilled */
  totalAllyJungleMinionsKilled: number;
  /** Totaldamagedealt */
  totalDamageDealt: number;
  /** Totaldamagedealttochampions */
  totalDamageDealtToChampions: number;
  /** Totaldamageshieldedonteammates */
  totalDamageShieldedOnTeammates: number;
  /** Totaldamagetaken */
  totalDamageTaken: number;
  /** Totalenemyjungleminionskilled */
  totalEnemyJungleMinionsKilled: number;
  /** Totalheal */
  totalHeal: number;
  /** Totalhealsonteammates */
  totalHealsOnTeammates: number;
  /** Totalminionskilled */
  totalMinionsKilled: number;
  /** Totaltimeccdealt */
  totalTimeCCDealt: number;
  /** Totaltimespentdead */
  totalTimeSpentDead: number;
  /** Totalunitshealed */
  totalUnitsHealed: number;
  /** Triplekills */
  tripleKills: number;
  /** Truedamagedealt */
  trueDamageDealt: number;
  /** Truedamagedealttochampions */
  trueDamageDealtToChampions: number;
  /** Truedamagetaken */
  trueDamageTaken: number;
  /** Turretkills */
  turretKills: number;
  /** Turrettakedowns */
  turretTakedowns: number;
  /** Turretslost */
  turretsLost: number;
  /** Unrealkills */
  unrealKills: number;
  /** Visionclearedpings */
  visionClearedPings: number;
  /** Visionscore */
  visionScore: number;
  /** Visionwardsboughtingame */
  visionWardsBoughtInGame: number;
  /** Wardskilled */
  wardsKilled: number;
  /** Wardsplaced */
  wardsPlaced: number;
  /** Win */
  win: boolean;
  [key: string]: any;
}

/** Perks */
export interface Perks {
  statPerks: StatPerks;
  /** Styles */
  styles: Style[];
  [key: string]: any;
}

/** QueueDTO */
export interface QueueDTO {
  /** Queueid */
  queueId: number;
  /** Map */
  map: string;
  /** Description */
  description: string | null;
  /** Notes */
  notes: string | null;
  [key: string]: any;
}

/** RiftHerald */
export interface RiftHerald {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** Selection */
export interface Selection {
  /** Perk */
  perk: number;
  /** Var1 */
  var1: number;
  /** Var2 */
  var2: number;
  /** Var3 */
  var3: number;
  [key: string]: any;
}

/** StatPerks */
export interface StatPerks {
  /** Defense */
  defense: number;
  /** Flex */
  flex: number;
  /** Offense */
  offense: number;
  [key: string]: any;
}

/** Style */
export interface Style {
  /** Description */
  description: string;
  /** Selections */
  selections: Selection[];
  /** Style */
  style: number;
  [key: string]: any;
}

/** SummonerDBDTO */
export interface SummonerDBDTO {
  /**
   * Id
   * Encrypted summoner ID. Used for looking up League-specific information.
   */
  id: string;
  /**
   * Accountid
   * Encrypted account ID. Legacy identifier maintained for backwards compatibility.
   */
  accountId: string;
  /**
   * Puuid
   * Player Universally Unique Identifier. A unique identifier for the player across all Riot games.
   */
  puuid: string;
  /**
   * Profileiconid
   * ID of the summoner icon associated with the player profile.
   */
  profileIconId: number;
  /**
   * Revisiondate
   * Date when the summoner profile was last modified, in epoch milliseconds.
   */
  revisionDate: number;
  /**
   * Summonerlevel
   * Experience level of the summoner account.
   */
  summonerLevel: number;
  /**
   * Gamename
   * The player's in-game name (IGN) shown in League of Legends.
   */
  gameName: string;
  /**
   * Tagline
   * The player's tag line (similar to Discord's discriminator) that appears after the # in their Riot ID.
   */
  tagLine: string;
  [key: string]: any;
}

/** SummonerSpellDTO */
export interface SummonerSpellDTO {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Summonerlevel */
  summonerLevel: number;
  /** Cooldown */
  cooldown: number;
  /** Gamemodes */
  gameModes: string[];
  /** Iconpath */
  iconPath: string;
  [key: string]: any;
}

/** Team */
export interface Team {
  /** Bans */
  bans: Ban[];
  objectives?: Objectives | null;
  /** Teamid */
  teamId: number;
  /** Win */
  win: boolean;
  [key: string]: any;
}

/** Tower */
export interface Tower {
  /** First */
  first: boolean;
  /** Kills */
  kills: number;
  [key: string]: any;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}
