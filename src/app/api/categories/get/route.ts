import { pool } from "@/app/tools/db";
import { NextResponse } from "next/server";

export async function POST() {

    const categoriesFromDB = await getCategoriesFromDB();

    return NextResponse.json({
        success: true,
        categoriesFromDB
    })
}

async function getCategoriesFromDB() {
    return await new Promise(resolve => {
        pool.query(
            `SELECT * FROM categories`,
            function (err: any, res: any) {
                if (err) {
                    console.log('err #kvvhHuT', err);
                }
                resolve(res);
            }
        )
    })
}