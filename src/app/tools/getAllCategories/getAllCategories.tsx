"use client"

// import { useEffect, useState } from "react";
import parentCategories from "./parentCategories.json";

export default function ViewAllCategories() {
    return <>
        <button onClick={async () => {
            for (let index = 0; index < parentCategories.length; index++) {
                const parent = parentCategories[index];
                console.log('parent', parent.innerText);

                const r = await getSubcategoriesByDuck(parent.href);
                console.log('r.links', r.links.length);

            }
        }}>
            получить категории
        </button>
        <br />
        <button onClick={async () => {
            getCategoryData()
        }}>
            получить данные о категориях
        </button>
    </>
}

type DataFromCategory = { type: "category", categories: any[] } | { type: "products", products: any[] } | { type: "trash", products: any[] }

async function getCategoryData(): Promise<DataFromCategory> {
    // console.log('get', link);
    return fetch(
        "/api/categories/get-category-status",
        {
            method: "POST",
            // body: JSON.stringify({ link })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        })
}


async function getSubcategoriesByDuck(link: string): Promise<{ links: string[] }> {
    console.log('get', link);

    return fetch(
        "/api/duck",
        {
            method: "POST",
            body: JSON.stringify({ link })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        })
}