"use client"

import { useEffect, useState } from "react";
import parentCategories from "./parentCategories.json";

export default function ViewAllCategories() {
    // const categories = getAllCategories();
    const [categories, setCategories]: any = useState();
    useEffect(() => {
        (async () => {
            setCategories(
                ...await getAllCategories()
            )
        })()
    }, []);
    return <>
        <pre>{JSON.stringify(['categories', categories])}</pre>
        <pre>{JSON.stringify(['parentCategories', parentCategories], null, " ")}</pre>
    </>
}

async function getAllCategories() {
    // console.log('getAllCategories');
    return ["result getAllCategories"];
}