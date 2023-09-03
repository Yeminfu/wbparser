"use client"

import { useState } from "react"

export default function GetProductsFromCategory() {
    const [categories, setCategories] = useState([]);
    const [log, setLog] = useState<any>([
        { page: 1, products_count: 45800 }
    ]);

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

                category_loop: for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
                    const category: any = categories[categoryIndex];
                    page_looop: for (let page = 1; page < 2000; page++) {
                        const products = await ParseCategoryPage(
                            category.link,
                            page
                        )
                        if (products.products?.length) {
                            const newStore = [{ page: page, products_count: products.products?.length }];
                            newStore.push(...log);
                            console.log(`страница: ${page}, получили товаров: ${products.products?.length}, категория: ${category.name}   `);
                        } else {
                            console.log('собрали весь товар с категории');
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

async function ParseCategoryPage(link: string, page: number) {
    return await fetch(
        "/api/categories/parse",
        {
            method: "POST",
            body: JSON.stringify({
                link: `${link}?sort=popular&page=${page}`
            })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        });
}