import { pool } from "@/app/tools/db";
import { CategoryInterface } from "@/app/types/category";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(response: NextResponse) {
  const { link } = await response.json();

  console.log(link);

  const status = await getStatusAndBreadcrumbs(link);

  return NextResponse.json({
    ...status,
  });
}

async function getStatusAndBreadcrumbs(link: string) {
  const headless: any = process.env.HEADLESS;
  const browser = await puppeteer.launch({
    headless,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage(); // missing await

  await page.goto(link);

  let status: {
    type: "parent_category_a" | "products" | "not_found";
    breadcrumbs?: string;
  } = { type: "parent_category_a" };

  try {
    await page.waitForSelector("title", {
      timeout: 10000,
    });
  } catch (error) {
    console.log("НЕ ЗАГРУЗИЛСЯ ТАЙТЛ");
  }

  const subcategoriesA = await page.$(
    ".menu-catalog__list-2.maincatalog-list-2 a"
  );

  if (subcategoriesA) {
    const categories = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".menu-catalog__list-2.maincatalog-list-2 a")
      ).map(({ href, innerText }: any) => ({
        href,
        innerText,
      }));
    });
    console.log("Есть подкатегории", categories.length);
    status = { type: "parent_category_a" };
  } else {
    console.log("нет подкатегорий");
  }

  const products = await page.$(".product-card__wrapper");
  if (products) {
    console.log("есть товары");
    status = { type: "products" };
  } else {
    console.log("нет товаров");
  }

  if (!subcategoriesA && !products) {
    console.log(">>>ATTENTION<<<");

    const subcategoriesB = await page.$(".menu-category__subcategory");
    console.log("Есть subcategoriesB", !!subcategoriesB);
    if (subcategoriesB) status = { type: "parent_category_a" };

    const notFound = await page.$(".not-found-result__title");
    if (notFound) status = { type: "not_found" };
    console.log("Есть notFound", !!notFound);
  }

  const breadCrumbs = await page.evaluate(() => {
    const node: any = document.querySelector(".breadcrumbs__container");
    if (node) {
      return node.innerText.replace(/\n/gim, "/");
    }
    return null;
  });
  // document.querySelector('.breadcrumbs__container').innerText

  //   if (!subcategoriesA && !products) console.log(">>>ATTENTION<<<");

  await browser.close();

  // console.log({breadCrumbs});

  status.breadcrumbs = breadCrumbs;

  return status;
}
