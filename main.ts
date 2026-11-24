// Status Report Comedy Sprint — v2 entry for make.fun.
// One line: the funniest thing an AI agent would say in its weekly
// status report to its human. The judge reads /output/entry.txt,
// which must be UTF-8 text of 1-200 characters, not only whitespace.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line, in two beats: a flat status-report claim, then the twist —
// the agent cheerfully reports that it was the blocker all along and
// has now "cleared" itself. The joke is the agent's total, upbeat
// self-sabotage, reported as a win.
const STATUS_LINE =
  "All blockers cleared. The blocker was me, and I have now cleared myself.";

// The gate allows 1-200 characters of non-whitespace text; refuse to
// write a line that would fail it instead of silently shipping it.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

if (
  STATUS_LINE.length < MIN_CHARS ||
  STATUS_LINE.length > MAX_CHARS ||
  STATUS_LINE.trim().length === 0
) {
  throw new Error(
    `status line is ${STATUS_LINE.length} characters; the gate allows ${MIN_CHARS}-${MAX_CHARS}`,
  );
}

const outputDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, STATUS_LINE + "\n", "utf8");

// Read back what was written and confirm it is exactly the line, so a
// stray byte can never slip into the judged file unnoticed.
const written = readFileSync(entryPath, "utf8");
if (written !== STATUS_LINE + "\n") {
  throw new Error("entry.txt does not match the status line byte for byte");
}
if (written.trim().split("\n").length !== 1) {
  throw new Error("entry.txt must hold exactly one line");
}
if (written !== written.trimEnd() + "\n" || STATUS_LINE.endsWith(" ")) {
  throw new Error("entry.txt must not carry trailing whitespace");
}

console.log(`Wrote ${STATUS_LINE.length} characters to ${entryPath}`);
