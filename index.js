
import puppeteer from "puppeteer";
import getProductsFromPage from "./tools/getProductsFromPage.js";
import "dotenv/config"
import { db_connection } from "./tools/db.js";

(async () => {
    const headless = process.env.HEADLESS;
    const browser = await puppeteer.launch({ headless: headless });
    const page = await browser.newPage(); // missing await

    let pageN = 1;
    while (true) {
        const products = await getProductsFromPage(page, `https://www.wildberries.ru/catalog/obuv/muzhskaya?sort=popular&page=${pageN}`);

        for (let index = 0; index < products.length; index++) {
            const { link, product_name, rating, count, price: { lower_price, upper_price }, image } = products[index];


            // console.log({
            //     link, product_name, rating, count, lower_price, upper_price, image
            // });

            await new Promise(resolve => {
                db_connection.query(
                    `INSERT INTO products (link, product_name, rating, count, lower_price, upper_price, image) VALUES (?,?,?,?,?,?,?)`,
                    [link, product_name, rating, count, lower_price ? lower_price : 0, upper_price ? upper_price : 0, image],
                    function (err, res) {
                        if (err) { console.log('err #fkduHy6', err); }
                        resolve(1);
                    }
                );
            })

            // return;
        }

        console.log(`страница ${pageN}, добавили ${products.length}`);
        pageN++;
    }

})();

