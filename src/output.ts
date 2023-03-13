import { WordMeaning } from "./read";

const TAB = "    ";
export const outputMd = (title: string, phonetic: string, meaning: WordMeaning) => {
  return [
    `## ${title}`,
    `\`${phonetic}\``,
    "- 释义",
    ...Object.keys(meaning).map((k) => {
      return [
        `${TAB}- ${k}`,
        meaning[k]
          .map((item) => {
            return [`${TAB}${TAB}- ${item.en}`, `${TAB}${TAB}- ${item.cn}`].join("\n");
          })
          .join("\n"),
      ].join("\n");
    }),
  ].join("\n");
};
