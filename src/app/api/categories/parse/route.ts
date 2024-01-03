// import { pool } from "@/app/tools/db";
// import getProductsFromPage from "@/app/tools/getProductsFromPage";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(res: any) {
  const { link, category_name } = await res.json();

  console.log("парсим категорию", link);

  const headless: any = process.env.HEADLESS;
  const browser = await puppeteer.launch({
    headless: false,
    //  args: ["--no-sandbox"]
  });
  const page = await browser.newPage(); // missing await

  await page.goto(link);

  await page.waitForSelector("title", {
    timeout: 10000,
  });

  //   console.log("загрузилось");

  const subcategories = await page.$(
    ".menu-catalog__list-2.maincatalog-list-2 a"
  );
  if (subcategories) {
    // console.log("есть подкатегории");
    const categories = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".menu-catalog__list-2.maincatalog-list-2 a")
      ).map(({ href, innerText }: any) => ({
        href,
        innerText,
      }));
    });

    // console.log(
    //   `Это родительская категория, в ней подкатегорий: `,
    //   categories.length
    // );

    await browser.close();

    return NextResponse.json({
      success: true,
      type: "category",
      categories: categories,
    });
  } else {
    console.log("нет подкатегорий");
  }

  //   try {
  //     await page.waitForSelector(".menu-catalog__list-2.maincatalog-list-2 a", {
  //       timeout: 10000,
  //     });
  //     await page.evaluate(() => {
  //       window.scrollBy(0, 500);
  //     });
  //     const categories = await page.evaluate(() => {
  //       return Array.from(
  //         document.querySelectorAll(".menu-catalog__list-2.maincatalog-list-2 a")
  //       ).map(({ href, innerText }: any) => ({
  //         href,
  //         innerText,
  //       }));
  //     });

  //     console.log(
  //       `Это родительская категория, в ней подкатегорий: `,
  //       categories.length
  //     );

  //     await page.close();

  //     return NextResponse.json({
  //       success: true,
  //       type: "category",
  //       categories: categories,
  //     });
  //   } catch (error) {
  //     // console.log("err #f8fj", error);
  //   }

  //   console.log("Это дочерняя категория в ней товаров:", null);

  await browser.close();

  return NextResponse.json({
    type: "products",
    products: [],
    success: true,
  });

  //   console.log();
}

// function getSubcategories() {
//   const menuItemsNodes = Array.from(
//     document.querySelectorAll(".menu-catalog__list-2.maincatalog-list-2 a")
//   ).map(({ href, innerText }) => ({
//     href,
//     innerText,
//   }));

// }
