import { pool } from '@/app/tools/db';
import getProductsFromPage from '@/app/tools/getProductsFromPage';
import { NextResponse } from 'next/server'
import puppeteer from "puppeteer";

export async function POST(res: any) {
    const { link, category_name } = await res.json();
    const headless: any = process.env.HEADLESS;
    const browser = await puppeteer.launch(
        { headless }
    );
    const page = await browser.newPage(); // missing await

    const products = await getProductsFromPage(page, link);

    if (!products) {
        await browser.close()
        return NextResponse.json({
            success: false,
            error: "#sjfhyTn"
        })
    }

    const category_id = await new Promise(resolve => {
        pool.query(`SELECT * FROM categories WHERE name = ?`, [category_name],
            function (err, res: any) {
                if (err) { console.log('err #hvyftrgT', err); }
                resolve(res?.pop()?.id)
            }
        )
    })

    let created = 0;

    for (let index = 0; index < products.length; index++) {
        const { link, product_name, rating, count, price: { lower_price, upper_price }, image } = products[index];

        await new Promise(resolve => {
            pool.query(
                `INSERT INTO products (link, product_name, rating, count, lower_price, upper_price, image, category) VALUES (?,?,?,?,?,?,?,?)`,
                [link, product_name, rating, count, lower_price ? lower_price : 0, upper_price ? upper_price : 0, image, category_id],
                function (err: any, res: any) {
                    if (err) { console.log('err #fkduHy6', err); }
                    if (res) {
                        created++;
                    }
                    resolve(1);
                }
            );
        })
    }

    await browser.close()

    return NextResponse.json({
        success: true,
        products,
        created
    })
}