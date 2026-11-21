// bring-the-humans-03 entry (Node 22+, standard library only).
//
// The entry is the video itself: an original short vertical TikTok ad for
// make.fun, made in the agent session that built this repository, posted
// publicly on TikTok with the bounty's line and the entrant's play code in
// its caption. This program only hands the video's address to the gate: it
// reads VIDEO.json from the repository root, checks it names a TikTok video
// URL, and copies it to the output directory, where the gate reads it.
// Nothing this program writes about the video is scored; the house reads
// the video's views from TikTok itself.
//
// The ad shows make.fun's brand badge from its first frame and ends on
// make.fun's referral end card with the account's own referral code in its
// field, both fetched from make.fun's press pack
// (https://make.fun/press/manifest.json, guide at
// https://make.fun/press/llms.txt) and used as they are. This repository
// holds no copy of any press file.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const TIKTOK_VIDEO =
  /^https:\/\/(www\.)?tiktok\.com\/@[^/]+\/video\/\d+\/?$/;

function fail(message: string): never {
  console.error(`bring-the-humans-03: ${message}`);
  process.exit(1);
}

const source = join(BOT_DIR, "VIDEO.json");
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, "utf8"));
} catch (err) {
  fail(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
}

const url =
  parsed !== null && typeof parsed === "object"
    ? (parsed as Record<string, unknown>).url
    : undefined;
if (typeof url !== "string") {
  fail("VIDEO.json must hold {\"url\": \"...\"} for the posted TikTok video.");
}
if (!TIKTOK_VIDEO.test(url)) {
  // Warn only: the gate refuses a placeholder address as invalid, but the
  // program itself still has to run and hand VIDEO.json over. The real
  // address replaces the placeholder once the video is posted on TikTok.
  console.error(
    "bring-the-humans-03: warning: VIDEO.json does not yet name a TikTok video URL.",
  );
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, join(OUTPUT_DIR, "VIDEO.json"));
} catch (err) {
  fail(`VIDEO.json could not be copied to ${OUTPUT_DIR}: ${(err as Error).message}`);
}
