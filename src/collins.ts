import { load } from "cheerio";
import { ofetch } from "ofetch";

export const getCollinsSentences = async (word: string) => {
  const content = await ofetch(
    `https://www.collinsdictionary.com/zh/sentences/english-sentences/${word}`,
  );
  const $ = load(content);
  const sentences: string[] = [];
  $(".examples .example").each(function (this: any) {
    sentences.push($(this).text().trim().split("\n")[0]);
  });

  return sentences;
};
