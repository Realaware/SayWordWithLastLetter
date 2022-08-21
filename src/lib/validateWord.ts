import axios from "axios";
import CONSTANTS from "../constants.json";

export default async function validateSentence(
  q: string,
  lang?: string
): Promise<boolean> {
  const regex = /[!@#$%^&*(),.?":_{}|<>~_=-\\\[\]/';`]/gm

  console.log(regex.exec(q));

  const { data, status } = await axios.get(
    encodeURI(`https://kkutu.co.kr/o/dict/${q.trim()}
  `),
    {
      params: { lang: lang ?? "ko" },
      headers: {
        Referer: "https://kkutu.co.kr/o/game?server=0",
        connection: "keep-alive",
        Cookie:
          "kkuko=s%3AsaYHm6r2LvB6oeAli1bg1FR9KFxm2VW0.m44q3UT5m8DMChYhcOmQndGXcesDTUSC2JIvP28DHFA",
      },
      validateStatus: null,
    }
  );

  return !(status === 200 && "error" in data);
}
