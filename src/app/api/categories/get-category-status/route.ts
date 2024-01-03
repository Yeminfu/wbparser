import { pool } from "@/app/tools/db";
import { CategoryInterface } from "@/app/types/category";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST() {
  const categoriesFromDB = await getCategoriesFromDB();

  for (let index = 0; index < categoriesFromDB.length; index++) {
    const category = categoriesFromDB[index];
    console.log(index, category.link);
    await getStatusAndBreadcrumbs(category.link);
    // break;
  }

  return NextResponse.json({
    success: true,
    categoriesFromDB,
  });
}

async function getCategoriesFromDB(): Promise<CategoryInterface[]> {
  return await new Promise((resolve) => {
    pool.query(`SELECT * FROM categories`, function (err: any, res: any) {
      if (err) {
        console.log("err #k3mhHuT", err);
      }
      resolve(res);
    });
  });
}

async function getStatusAndBreadcrumbs(link: string) {
  const headless: any = process.env.HEADLESS;
  const browser = await puppeteer.launch({
    headless,
     args: ["--no-sandbox"]
  });
  const page = await browser.newPage(); // missing await

  await page.goto(link);

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
    // console.log("есть подкатегории");
    const categories = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".menu-catalog__list-2.maincatalog-list-2 a")
      ).map(({ href, innerText }: any) => ({
        href,
        innerText,
      }));
    });
    console.log("Есть подкатегории", categories.length);
  } else {
    console.log("нет подкатегорий");
  }

  const products = await page.$(".product-card__wrapper");
  if (products) {
    console.log("есть товары");
  } else {
    console.log("нет товаров");
  }

  if (!subcategoriesA && !products) {
    console.log(">>>ATTENTION<<<");

    const subcategoriesB = await page.$(".menu-category__subcategory");
    console.log("Есть subcategoriesB", !!subcategoriesB);

    const notFound = await page.$(".not-found-result__title");
    console.log("Есть notFound", !!notFound);
  }

  //   if (!subcategoriesA && !products) console.log(">>>ATTENTION<<<");

  await browser.close();
}
