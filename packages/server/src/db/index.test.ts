import { describe, expect, it } from "vitest";
import { getMissingMatchParticipants } from "./index.js";

describe("Index DB", () => {
	it("getMissingMatchParticipants: No participants are missing in database", async () => {
		const missing = await getMissingMatchParticipants();
		expect(missing.length).toBe(0);
	});
});
