import { load } from "cheerio";
import { ofetch } from "ofetch";

export type WordMeaning = Record<string, Array<{ en: string; cn: string }>>;

export const read = async (word: string) => {
  const res = await ofetch(
    `https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%AE%80%E4%BD%93/${word}`,
  );

  const $ = load(res.data);

  if (!$(".di-title")) {
    return null;
  }

  const phonetic = $(".pos-header .us.dpron-i .pron.dpron").first().text();
  const meaning: WordMeaning = {};

  $(".entry-body__el").each(function (this: any) {
    const part = $(this).find(".pos-header > .posgram > .pos").text();
    meaning[part] = [];

    $(".sense-body .def-block").each(function (this: any) {
      const en = $(this).find(".ddef_h .def.ddef_d").text();
      const cn = $(this).find(".def-body > .trans.dtrans").text();
      meaning[part].push({
        en,
        cn,
      });
    });
  });

  const examples: string[] = [];

  $("#dataset-example .lbb.lb-cm").each(function (this: any) {
    examples.push($(this).find(".deg").text().trim().replace("\n", ""));
  });

  return {
    word,
    phonetic,
    meaning,
    examples,
  };
};
