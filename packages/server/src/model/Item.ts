import { ObjectId } from "mongodb";
import { z } from "zod";
import {MongoDBIDSchema} from "./Database.js";

export const ItemDBSchema = z.object({
	_id: MongoDBIDSchema,
	id: z.number(),
	active: z.boolean(),
	categories: z.array(z.string()),
	description: z.string(),
	displayInItemSets: z.boolean(),
	from: z.array(z.number()),
	iconPath: z.string(),
	inStore: z.boolean(),
	isEnchantment: z.boolean(),
	maxStacks: z.number(),
	name: z.string(),
	price: z.number(),
	priceTotal: z.number(),
	requiredAlly: z.string(),
	requiredBuffCurrencyCost: z.number(),
	requiredBuffCurrencyName: z.string(),
	requiredChampion: z.string(),
	specialRecipe: z.number(),
	to: z.array(z.number()),
});

export type ItemDB = z.infer<typeof ItemDBSchema>;
