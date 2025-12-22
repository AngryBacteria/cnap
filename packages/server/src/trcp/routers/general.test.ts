import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { db } from "../../db/index.js";
import { generalRouter } from "./general.js";

const mockMemberBase = {
	id: 1,
	name: "Core Member",
	core: true,
	leagueSummoners: [],
	gameName: "",
	punchline: "",
	profilePictureBase64: null,
	profilePictureMimeType: null,
};
const mockMemberCore = {
	...mockMemberBase,
	core: true,
};
const mockMemberNonCore = {
	...mockMemberBase,
	core: false,
};

describe("getServerTime", () => {
	test("should return a Date instance", async () => {
		const caller = generalRouter.createCaller({});
		const result = await caller.getServerTime();
		expect(result).toBeInstanceOf(Date);
	});
});

describe("getMembers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("should return members", async () => {
		vi.spyOn(db.query.MEMBERS_TABLE, "findMany").mockResolvedValueOnce([
			mockMemberCore,
			mockMemberNonCore,
		]);
		const caller = generalRouter.createCaller({});
		const result = await caller.getMembers({});

		expect(db.query.MEMBERS_TABLE.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { core: undefined },
			}),
		);
		expect(result).toEqual([mockMemberCore, mockMemberNonCore]);
	});

	test("should return members when onlyCore=false", async () => {
		vi.spyOn(db.query.MEMBERS_TABLE, "findMany").mockResolvedValueOnce([
			mockMemberNonCore,
		]);
		const caller = generalRouter.createCaller({});
		const result = await caller.getMembers({ onlyCore: false });

		expect(db.query.MEMBERS_TABLE.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { core: false },
			}),
		);
		expect(result).toEqual([mockMemberNonCore]);
	});

	test("should return members when onlyCore=true", async () => {
		vi.spyOn(db.query.MEMBERS_TABLE, "findMany").mockResolvedValueOnce([
			mockMemberCore,
		]);
		const caller = generalRouter.createCaller({});
		const result = await caller.getMembers({ onlyCore: true });

		expect(db.query.MEMBERS_TABLE.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { core: true },
			}),
		);
		expect(result).toEqual([mockMemberCore]);
	});

	test("should throw NOT_FOUND if no members exist", async () => {
		vi.spyOn(db.query.MEMBERS_TABLE, "findMany").mockResolvedValue([]);

		const caller = generalRouter.createCaller({});

		await expect(caller.getMembers({})).rejects.toThrow(TRPCError);

		await expect(caller.getMembers({})).rejects.toMatchObject({
			code: "NOT_FOUND",
		});
	});

	test("should throw INTERNAL_SERVER_ERROR on db failure", async () => {
		const dbError = new Error("DB failure");

		vi.spyOn(db.query.MEMBERS_TABLE, "findMany").mockRejectedValue(dbError);

		const caller = generalRouter.createCaller({});

		await expect(caller.getMembers({})).rejects.toThrow(TRPCError);

		await expect(caller.getMembers({})).rejects.toMatchObject({
			code: "INTERNAL_SERVER_ERROR",
		});
	});
});
