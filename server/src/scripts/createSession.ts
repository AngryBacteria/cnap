import fs from "node:fs";
import Groq from "groq-sdk";
import { ObjectId } from "mongodb";
import "dotenv/config";
import { z } from "zod";
import dbh from "../helpers/DBHelper.js";
import { CollectionName } from "../model/Database.js";

const ORIGINAL_AUDIO_FILE = ["SWN_Robin_06-02-2025_1.m4a"];
const SPLIT_AUDIO_FILES = ["out000.m4a", "out001.m4a", "out002.m4a"];
const LANGUAGE = "de";
const TEMPERATURE = 0.0;
// YYYY-MM-DD
const DATE = Date.parse("2025-02-06");

const groq = new Groq();

const sessionTemplate = {
	timestamp: DATE.valueOf(),
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
	audioFiles: ORIGINAL_AUDIO_FILE,
};

let finalTranscription = "";
for (const audioFile of SPLIT_AUDIO_FILES) {
	const transcription = await groq.audio.transcriptions.create({
		file: fs.createReadStream(`C:\\Users\\nijog\\Downloads\\${audioFile}`),
		model: "whisper-large-v3-turbo",
		prompt: "Specify context or spelling",
		response_format: "text",
		language: LANGUAGE,
		temperature: TEMPERATURE,
	});
	finalTranscription += z.string().parse(transcription).trim();
	finalTranscription += "\n";
	finalTranscription += "\n";

	console.log(`Transcription for ${audioFile} finished`);
}
sessionTemplate.transcriptions.push(finalTranscription.trim());

await dbh.genericUpsert(
	[sessionTemplate],
	"sessionName",
	CollectionName.SESSION,
);
