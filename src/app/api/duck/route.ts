import { pool } from "@/app/tools/db";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(res: any) {
  const { link } = await res.json();

  const duckUrl = `https://duckduckgo.com/?q=` + link;

  const headless: any = process.env.HEADLESS;
  const browser = await puppeteer.launch({
    headless,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage(); // missing await

  await page.goto(duckUrl);

  //   #more-results

  const moreBtnSelector = "#more-results";

  await page.waitForSelector(moreBtnSelector, {
    timeout: 10000,
  });

  const links: any = await page.evaluate(async (selector) => {
    return new Promise(async (r) => {
      while (true) {
        const button: any = document.querySelector("#more-results");
        if (button) {
          if (button.innerText) {
            button.scrollIntoView();
            button.click();
          } else {
          }
        } else {
          console.log("нет кнопки/готово");
          const links = Array.from(
            document.querySelectorAll(".Rn_JXVtoPVAFyGkcaXyK")
          ).map((x: any) => x.href);
          r(links);
        }
        await new Promise((r2) =>
          setTimeout(() => {
            r2(1);
          }, 200)
        );
      }
    });
  }, "#more-results");

  //   await page.click(moreBtnSelector);

  const prefix = link.split("/")[4];

  const linksWithPrefix = links.filter(
    (link: string) =>
      link.split("/")[4] === prefix &&
      !/\?/.test(link) &&
      link.split("/")[2] === "www.wildberries.ru"
  );

  for (let index = 0; index < linksWithPrefix.length; index++) {
    const link = linksWithPrefix[index];
    await pool
      .promise()
      .query("INSERT INTO categories (link) VALUES (?)", [link])
      .catch((e) => {});
  }

  console.log("linksWithPrefix", linksWithPrefix.length);
  await browser.close();

  return NextResponse.json({
    success: null,
    links: linksWithPrefix.length,
  });
}
