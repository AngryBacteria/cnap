import fs from "node:fs";
import Groq from "groq-sdk";
import { ObjectId } from "mongodb";
import "dotenv/config";
import OpenAI from "openai";
import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import { CollectionName } from "../../model/Database.js";
import type { PenAndPaperSessionDB } from "../../model/PenAndPaper.js";

// FFMPEG script to split audio files into X second segments
//  ffmpeg -i somefile.mp3 -f segment -segment_time X -c copy out%03d.mp3

const ORIGINAL_AUDIO_FILE = ["SWN_Robin_06-02-2025_1.m4a"];
const SPLIT_AUDIO_FILES = ["out000.m4a", "out001.m4a", "out002.m4a"];
const DATE = Date.parse("2025-02-06"); // YYYY-MM-DD (USA) format

const SERVICE: "groq" | "openai" = "groq"; // Choose the service to use for transcription
const LANGUAGE = "de";
const TEMPERATURE = 0.0;

const groq = new Groq();
const openai = new OpenAI();

const sessionTemplate: PenAndPaperSessionDB = {
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
	summaryLong: "",
	summaryShort: "",
	audioFiles: ORIGINAL_AUDIO_FILE,
};

let finalTranscription = "";
for (const audioFile of SPLIT_AUDIO_FILES) {
	if (SERVICE === "groq") {
		const transcription = await groq.audio.transcriptions.create({
			file: fs.createReadStream(audioFile),
			model: "whisper-large-v3-turbo",
			//prompt: "Specify context or spelling",
			response_format: "text",
			language: LANGUAGE,
			temperature: TEMPERATURE,
		});
		finalTranscription += z.string().parse(transcription).trim();
		finalTranscription += "\n";
		finalTranscription += "\n";
	} else {
		const transcription = await openai.audio.transcriptions.create({
			file: fs.createReadStream("/path/to/file/speech.mp3"),
			model: "gpt-4o-transcribe",
			language: LANGUAGE,
			response_format: "text",
		});
		finalTranscription += z.string().parse(transcription).trim();
		finalTranscription += "\n";
		finalTranscription += "\n";
	}

	logger.debug(`Transcription for ${audioFile} finished`);
}
sessionTemplate.transcriptions.push(finalTranscription.trim());

await dbh.genericUpsert(
	[sessionTemplate],
	"sessionName",
	CollectionName.SESSION,
);
