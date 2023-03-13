import fs, { existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { getCollinsSentences, outputMd, read } from "../src/index";

// eslint-disable-next-line no-underscore-dangle
const __DIRNAME = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__DIRNAME, "../output");
const WORD_PATH = resolve(__DIRNAME, "./words.txt");

if (!existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const readWords = () => {
  const content = fs.readFileSync(WORD_PATH, "utf8");

  return content
    .split(/\r\n|\n/)
    .map((t) => {
      return t.trim();
    })
    .filter(Boolean);
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const start = async (words: string[]) => {
  let wordContent = "";
  let exampleContent = "";
  await Promise.all(
    words.map(async (w) => {
      await sleep(1000);

      const res = await read(w);
      if (res) {
        const md = outputMd(res.word, res.phonetic, res.meaning);

        wordContent += `${md}\n\n`;

        const examples = res.examples
          .map((t) => {
            return `- ${t}`;
          })
          .join("\n");
        exampleContent += `${examples}\n\n`;
      }

      const content = await getCollinsSentences(w);
      exampleContent += `${content
        .map((t) => {
          return `- ${t}`;
        })
        .join("\n")}\n\n`;
    }),
  );
  const wFilePath = resolve(OUTPUT_DIR, `${words[0][0].toUpperCase()}.md`);
  const eFilePath = resolve(OUTPUT_DIR, `${words[0][0].toUpperCase()}.example.md`);

  fs.writeFileSync(wFilePath, wordContent, "utf-8");
  fs.writeFileSync(eFilePath, exampleContent, "utf-8");
};

start(readWords());
