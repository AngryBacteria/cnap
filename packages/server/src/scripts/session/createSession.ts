import fs from "node:fs";
import Groq from "groq-sdk";
import "dotenv/config";
import { ObjectId } from "mongodb";
import OpenAI from "openai";
import { z } from "zod";
import dbh from "../../helpers/DBHelper.js";
import logger from "../../helpers/Logger.js";
import { CollectionName } from "../../model/Database.js";
import {
	type PenAndPaperCharacterDB,
	PenAndPaperCharacterDBSchema,
	type PenAndPaperSessionDB,
	PenAndPaperSessionDBSchema,
} from "../../model/PenAndPaper.js";

// FFMPEG script to split audio files into X second segments
//  ffmpeg -i input.m4a -f segment -segment_time 4000 -c:a copy -reset_timestamps 1 output_%03d.m4a

// Replace with your own values
const ORIGINAL_AUDIO_FILES = ["SWN_Robin_22-03-2025_1.m4a"];
const SPLIT_AUDIO_FILES = ["out000.m4a", "out001.m4a", "out002.m4a"];
const DATE = Date.parse("2025-03-22"); // YYYY-MM-DD (USA) format
const CAMPAIGN = "A Star Without Names";
const FRAMEWORK = "SWN";

// Optional to change
const SERVICE: "groq" | "openai" = "groq"; // Choose the service to use for transcription
const LANGUAGE = "de";
const TEMPERATURE = 0.0;

const sessionName = ORIGINAL_AUDIO_FILES[0];
if (!sessionName) {
	throw new Error("Session name is not defined");
}
const sessionTemplate: PenAndPaperSessionDB = {
	framework: FRAMEWORK,
	dmMemberId: new ObjectId("67ceddb5f102f50d7e216048"),
	characterMemberIds: [
		new ObjectId("67f00162441e948f5d968bc2"),
		new ObjectId("67f00162441e948f5d968bc3"),
		new ObjectId("67f00162441e948f5d968bc4"),
	],
	timestamp: DATE.valueOf(),
	sessionName,
	campaign: CAMPAIGN,
	transcriptions: [] as string[],
	summaryLong: "",
	summaryShort: "",
	goals: [],
	audioFileUrls: ORIGINAL_AUDIO_FILES.map(
		(file) => `https://cnap.ch/static/penAndPaperAudios/${file}`,
	),
};

const characters: PenAndPaperCharacterDB[] = [
	{
		name: "Lucy",
		memberId: new ObjectId("67ceddb5f102f50d7e216042"),
		imageUrls: [],
	},
	{
		name: "Gron",
		memberId: new ObjectId("67ceddb5f102f50d7e21605d"),
		imageUrls: [],
	},
	{
		name: "Alfonso de Arcturus",
		memberId: new ObjectId("67ceddb5f102f50d7e216053"),
		imageUrls: [],
	},
];

async function uploadSession() {
	let finalTranscription = "";
	for (const audioFile of SPLIT_AUDIO_FILES) {
		if (SERVICE === "groq") {
			const groq = new Groq();
			const transcription = await groq.audio.transcriptions.create({
				file: fs.createReadStream(audioFile),
				model: "whisper-large-v3-turbo",
				response_format: "text",
				language: LANGUAGE,
				temperature: TEMPERATURE,
			});
			finalTranscription += z.string().parse(transcription).trim();
			finalTranscription += "\n";
			finalTranscription += "\n";
		} else {
			const openai = new OpenAI();
			const transcription = await openai.audio.transcriptions.create({
				file: fs.createReadStream(audioFile),
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
		CollectionName.PEN_AND_PAPER_SESSION,
		PenAndPaperSessionDBSchema,
	);
}

async function uploadCharacters() {
	await dbh.genericUpsert(
		characters,
		"name",
		CollectionName.PEN_AND_PAPER_CHARACTER,
		PenAndPaperCharacterDBSchema,
	);
}

// await uploadSession();
// await uploadCharacters();
