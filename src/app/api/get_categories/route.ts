import { pool } from '@/app/tools/db';
import { NextResponse } from 'next/server'
import puppeteer from "puppeteer";

export async function POST(res: any) {

    const { link: parentLink, name: parentName } = await res.json();
    const headless: any = process.env.HEADLESS;

    const browser = await puppeteer.launch({ headless, args: ['--no-sandbox'] });
    const page = await browser.newPage(); // missing await

    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(parentLink);

    await page.waitForSelector('.j-menu-item');

    const subCategories = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.j-menu-item'))
            .map((subcategoryNode: any) => {
                return {
                    name: subcategoryNode.innerHTML,
                    link: subcategoryNode.href
                }
            })
    });

    const counter = {
        inserted: 0,
        declined: 0
    };

    for (let index = 0; index < subCategories.length; index++) {
        const { name: subcategoryName, link: subcategoryLink } = subCategories[index];
        const newSubcategoryName = `${parentName}>${subcategoryName}`;
        const inserted = await insertCategory({
            name: newSubcategoryName,
            link: subcategoryLink
        });
        if (inserted?.affectedRows) {
            ++counter.inserted;
        } else {
            ++counter.declined;
        }
    }

    await browser.close()

    return NextResponse.json({
        success: true,
        counter
    })
}

function insertCategory(values: { name: string, link: string }): Promise<{ affectedRows: number } | null> {
    return new Promise(resolve => {
        pool.query(
            `INSERT INTO categories (${Object.keys(values)}) VALUES (${Object.values(values).map(() => "?")})`,
            [values.name, values.link],
            function (err: any, res: any) {
                if (err?.code !== "ER_DUP_ENTRY") {
                    console.log('err kjdfgb8uY', err);
                }
                resolve(res);
            }
        )
    })
}

