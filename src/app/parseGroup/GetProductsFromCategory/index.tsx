"use client"

import { createEvent, createStore } from "effector";
import { useStore } from "effector-react";
import { useState } from "react"

const setStateLog = createEvent();
const $storeLog = createStore<any>([])
    .on(setStateLog, (store, newStore) => ([newStore, ...store]));

export default function GetProductsFromCategory(props: {
    START_CATEGORY: number,
    START_PAGE: number
}) {

    const storeLog = useStore($storeLog);

    const [categories, setCategories] = useState([]);
    const [log, setLog] = useState<any>([
    ]);
    const startCategory = Number(props.START_CATEGORY);
    let startPage = Number(props.START_PAGE);

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
                            // newStore.push(...log);
                            setLog(`страница: ${page}, получили товаров: ${productsFromWB.products?.length}, создано товаров в бд: ${productsFromWB.created} категория: ${category.name}`);
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


        <pre>{JSON.stringify(log, null, 2)}</pre>
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