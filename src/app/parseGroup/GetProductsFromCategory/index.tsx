"use client"

import { useState } from "react"

export default function GetProductsFromCategory() {
    const [categories, setCategories] = useState([]);
    const [log, setLog] = useState<any>([
    ]);
    const startCategory = Number(process.env.START_CATEGORY);
    let startPage = Number(process.env.START_PAGE);

    return <>
        <button className="btn btn-sm btn-outline-dark"
            onClick={async () => {
                const { categoriesFromDB } = await fetch("/api/categories/get", { method: "POST" }).then(x => x.json());
                setCategories(categoriesFromDB);
            }}
        >получить категории товаров</button>
        <div className="p-2"></div>

        <p>получено категорий {categories.length}</p>

        <button className="btn btn-sm btn-outline-dark"
            onClick={async () => {

                category_loop: for (let categoryIndex = startCategory; categoryIndex < categories.length; categoryIndex++) {
                    const category: any = categories[categoryIndex];

                    page_looop: for (let page = startPage; page < 2000; page++) {

                        const productsFromWB = await ParseCategoryPage(
                            category.link,
                            page,
                            category.name
                        )
                        if (productsFromWB.products?.length) {// если есть товары
                            const newStore = [{ page: page, products_count: productsFromWB.products?.length }];
                            newStore.push(...log);

                            console.log(`страница: ${page}, получили товаров: ${productsFromWB.products?.length}, создано товаров в бд: ${productsFromWB.created} категория: ${category.name}`);
                        } else {
                            startPage = 1;
                            continue category_loop;
                        }
                    }

                }
                console.log('собрали все товары с категории');
            }}
        >товары со всех категорий</button >

        <button onClick={() => {
            setLog([{ productsFromWBCount: 123123 }, ...log])
        }}>
            ADD LOG
        </button>
        <div>{log.map((item: any) => item.products_count).join(" | ")}</div>
    </>
}

async function ParseCategoryPage(link: string, page: number, category_name: string) {
    return await fetch(
        "/api/categories/parse",
        {
            method: "POST",
            body: JSON.stringify({
                link: `${link}?sort=popular&page=${page}`,
                category_name: category_name,
            })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        });
}