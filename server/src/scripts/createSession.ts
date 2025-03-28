import fs from "node:fs";
import Groq from "groq-sdk";
import { ObjectId } from "mongodb";
import "dotenv/config";
import { z } from "zod";
import dbh from "../helpers/DBHelper.js";
import { CollectionName } from "../model/Database.js";

const AUDIO_FILES = ["SWN_Robin_06-02-2025_1.m4a"];
const LANGUAGE = "de";
const TEMPERATURE = 0.0;

const groq = new Groq();

const sessionTemplate = {
	timestamp: 1726342283027,
	sessionName: "SWN_Robin_06-02-2025_1",
	dmId: new ObjectId("67ceddb5f102f50d7e216048"),
	playerIds: [
		new ObjectId("67ceddb5f102f50d7e21605d"),
		new ObjectId("67ceddb5f102f50d7e216053"),
		new ObjectId("67ceddb5f102f50d7e216042"),
	],
	campaign: "A star without names",
	transcriptions: [] as string[],
	summaries: [] as string[],
	audioFiles: AUDIO_FILES,
};

for (const filePath of AUDIO_FILES) {
	const transcription = await groq.audio.transcriptions.create({
		file: fs.createReadStream(`C:\\Users\\nijog\\Downloads\\${filePath}`),
		model: "whisper-large-v3-turbo",
		prompt: "Specify context or spelling",
		response_format: "text",
		language: LANGUAGE,
		temperature: TEMPERATURE,
	});
	sessionTemplate.transcriptions.push(z.string().parse(transcription).trim());
}

await dbh.genericUpsert(
	[sessionTemplate],
	"sessionName",
	CollectionName.SESSION,
);
