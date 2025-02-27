import { z } from "zod";

export const ItemSchema = z.object({
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

export type Item = z.infer<typeof ItemSchema>;
