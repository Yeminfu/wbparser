import { pool } from '@/app/tools/db';
import getProductsFromPage from '@/app/tools/getProductsFromPage';
import { NextResponse } from 'next/server'
import puppeteer from "puppeteer";

export async function POST(res: any) {

    const { link } = await res.json();

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); // missing await

    const products = await getProductsFromPage(page, link);

    for (let index = 0; index < products.length; index++) {
        const { link, product_name, rating, count, price: { lower_price, upper_price }, image } = products[index];

        await new Promise(resolve => {
            pool.query(
                `INSERT INTO products (link, product_name, rating, count, lower_price, upper_price, image) VALUES (?,?,?,?,?,?,?)`,
                [link, product_name, rating, count, lower_price ? lower_price : 0, upper_price ? upper_price : 0, image],
                function (err: any, res: any) {
                    if (err) { console.log('err #fkduHy6', err); }
                    resolve(1);
                }
            );
        })
        // break;
    }

    await browser.close()

    return NextResponse.json({
        success: true,
        products
    })
}