import { z } from "zod";
import { MongoDBIDSchema } from "./Database.js";

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

export const SummonerIconDBSchema = z.object({
	_id: MongoDBIDSchema,
	id: z.number(),
	contentId: z.string(),
	descriptions: z.array(DescriptionSchema),
	disabledRegions: z.array(z.string()),
	esportsEvent: z.string().nullish(),
	esportsRegion: z.string().nullish(),
	esportsTeam: z.string().nullish(),
	imagePath: z.string().nullish(),
	isLegacy: z.boolean(),
	rarities: z.array(RaritySchema),
	title: z.string(),
	yearReleased: z.number(),
});

export type SummonerIconDB = z.infer<typeof SummonerIconDBSchema>;
