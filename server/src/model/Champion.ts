import { z } from "zod";

export const PassiveSchema = z.object({
	name: z.string(),
	abilityIconPath: z.string(),
	abilityVideoPath: z.string(),
	abilityVideoImagePath: z.string(),
	description: z.string(),
});
export type Passive = z.infer<typeof PassiveSchema>;

export const PlaystyleInfoSchema = z.object({
	damage: z.number(),
	durability: z.number(),
	crowdControl: z.number(),
	mobility: z.number(),
	utility: z.number(),
});
export type PlaystyleInfo = z.infer<typeof PlaystyleInfoSchema>;

export const DescriptionSchema = z.object({
	region: z.string(),
	description: z.string(),
});
export type Description = z.infer<typeof DescriptionSchema>;

export const RaritySchema = z.object({
	region: z.string(),
	rarity: z.number(),
});
export type Rarity = z.infer<typeof RaritySchema>;

export const OverlaySchema = z.object({
	centeredLCOverlayPath: z.string(),
	uncenteredLCOverlayPath: z.string(),
	socialCardLCOverlayPath: z.string(),
	tileLCOverlayPath: z.string(),
});
export type Overlay = z.infer<typeof OverlaySchema>;

export const LayerSchema = z.object({
	contentId: z.string(),
	layer: z.number(),
	priority: z.number(),
	borderPath: z.string(),
});
export type Layer = z.infer<typeof LayerSchema>;

export const DescriptionInfoSchema = z.object({
	title: z.string(),
	description: z.string(),
	iconPath: z.string(),
});
export type DescriptionInfo = z.infer<typeof DescriptionInfoSchema>;

export const SkinFeaturePreviewDatumSchema = z.object({
	description: z.string(),
	iconPath: z.string(),
	videoPath: z.string(),
});
export type SkinFeaturePreviewDatum = z.infer<
	typeof SkinFeaturePreviewDatumSchema
>;

export const SkinLineSchema = z.object({
	id: z.number(),
});
export type SkinLine = z.infer<typeof SkinLineSchema>;

export const AmmoSchema = z.object({
	ammoRechargeTime: z.array(z.number()),
	maxAmmo: z.array(z.number()),
});
export type Ammo = z.infer<typeof AmmoSchema>;

export const CoefficientsSchema = z.object({
	coefficient1: z.number(),
	coefficient2: z.number(),
});
export type Coefficients = z.infer<typeof CoefficientsSchema>;

export const TacticalInfoSchema = z.object({
	style: z.number(),
	difficulty: z.number(),
	damageType: z.string(),
});
export type TacticalInfo = z.infer<typeof TacticalInfoSchema>;

export const AugmentSchema = z.object({
	contentId: z.string(),
	overlays: z.array(OverlaySchema),
});
export type Augment = z.infer<typeof AugmentSchema>;

export const BordersSchema = z.object({
	layer0: z.array(LayerSchema),
	layer1: z.array(LayerSchema).nullish(),
});
export type Borders = z.infer<typeof BordersSchema>;

export const SpellSchema = z.object({
	spellKey: z.string(),
	name: z.string(),
	abilityIconPath: z.string(),
	abilityVideoPath: z.string(),
	abilityVideoImagePath: z.string(),
	cost: z.string(),
	cooldown: z.string(),
	description: z.string(),
	dynamicDescription: z.string(),
	range: z.array(z.number()),
	costCoefficients: z.array(z.number()),
	cooldownCoefficients: z.array(z.number()),
	coefficients: CoefficientsSchema,
	effectAmounts: z.record(z.string(), z.array(z.number())),
	ammo: AmmoSchema,
	maxLevel: z.number(),
});
export type Spell = z.infer<typeof SpellSchema>;

export const SkinAugmentsSchema = z.object({
	borders: BordersSchema,
	augments: z.array(AugmentSchema).nullish(),
});
export type SkinAugments = z.infer<typeof SkinAugmentsSchema>;

export const TierSchema = z.object({
	id: z.number(),
	name: z.string(),
	stage: z.number(),
	description: z.string(),
	splashPath: z.string(),
	uncenteredSplashPath: z.string(),
	tilePath: z.string(),
	loadScreenPath: z.string(),
	shortName: z.string(),
	splashVideoPath: z.string().nullish(),
	collectionSplashVideoPath: z.string().nullish(),
	collectionCardHoverVideoPath: z.string().nullish(),
	skinAugments: SkinAugmentsSchema.nullish(),
	loadScreenVintagePath: z.string().nullish(),
});
export type Tier = z.infer<typeof TierSchema>;

export const ChromaSchema = z.object({
	id: z.number(),
	name: z.string(),
	chromaPath: z.string(),
	colors: z.array(z.string()),
	descriptions: z.array(DescriptionSchema),
	rarities: z.array(RaritySchema),
	contentId: z.string(),
	skinAugments: SkinAugmentsSchema.nullish(),
});
export type Chroma = z.infer<typeof ChromaSchema>;

export const QuestSkinInfoSchema = z.object({
	name: z.string(),
	productType: z.string(),
	collectionDescription: z.string(),
	descriptionInfo: z.array(DescriptionInfoSchema),
	splashPath: z.string(),
	uncenteredSplashPath: z.string(),
	tilePath: z.string(),
	collectionCardPath: z.string(),
	tiers: z.array(TierSchema),
});
export type QuestSkinInfo = z.infer<typeof QuestSkinInfoSchema>;

export const SkinSchema = z.object({
	id: z.number(),
	isBase: z.boolean(),
	name: z.string(),
	splashPath: z.string(),
	uncenteredSplashPath: z.string(),
	tilePath: z.string(),
	loadScreenPath: z.string(),
	loadScreenVintagePath: z.string().nullish(),
	skinType: z.string(),
	rarity: z.string(),
	isLegacy: z.boolean(),
	splashVideoPath: z.string().nullish(),
	collectionSplashVideoPath: z.string().nullish(),
	collectionCardHoverVideoPath: z.string().nullish(),
	featuresText: z.string().nullish(),
	chromaPath: z.string().nullish(),
	emblems: z.null(),
	regionRarityId: z.number(),
	rarityGemPath: z.null(),
	skinLines: z.array(SkinLineSchema).nullish(),
	description: z.string().nullish(),
	chromas: z.array(ChromaSchema).nullish(),
	contentId: z.string(),
	skinAugments: SkinAugmentsSchema.nullish(),
	questSkinInfo: QuestSkinInfoSchema.nullish(),
	skinFeaturePreviewData: z.array(SkinFeaturePreviewDatumSchema).nullish(),
});
export type Skin = z.infer<typeof SkinSchema>;

export const ChampionSchema = z.object({
	id: z.number(),
	alias: z.string(),
	banVoPath: z.string(),
	chooseVoPath: z.string(),
	name: z.string(),
	passive: PassiveSchema,
	playstyleInfo: PlaystyleInfoSchema,
	recommendedItemDefaults: z.array(z.any()),
	roles: z.array(z.string()),
	shortBio: z.string(),
	skins: z.array(SkinSchema),
	spells: z.array(SpellSchema),
	squarePortraitPath: z.string(),
	stingerSfxPath: z.string(),
	tacticalInfo: TacticalInfoSchema,
	title: z.string(),
	uncenteredSplashPath: z.string().nullish(),
	spellbookOverride: z.array(z.array(SpellSchema)).nullish(),
});
export type Champion = z.infer<typeof ChampionSchema>;
