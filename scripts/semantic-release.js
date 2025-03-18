import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const version = process.argv[2];
const today = new Date().toISOString().slice(0, 10);
const year = today.slice(0, 4);

// CITATION.cff
const CITATION = join(process.cwd(), 'CITATION.cff');

let text = readFileSync(CITATION).toString();
text = text.replace(
  /(?<!cff-)version:\s*["']?[\d.]+["']?/,
  `version: ${version}`,
);

text = text.replace(
  /date-released:\s*["']?\d{4}-\d{2}-\d{2}["']?/,
  `date-released: ${today}`,
);

writeFileSync(CITATION, text);

// LICENSE
const LICENSE = join(process.cwd(), 'LICENSE');

text = readFileSync(LICENSE).toString();
text = text.replace(/Copyright \(c\) \d{4}/, `Copyright (c) ${year}`);

writeFileSync(LICENSE, text);

// README.md
const README = join(process.cwd(), 'README.md');

text = readFileSync(README).toString();
text = text.replace(
  /\(\d{4}\)\. ExfilMS \(Version [\d.]+\)/,
  `(${year}). ExfilMS (Version ${version})`,
);

writeFileSync(README, text);
