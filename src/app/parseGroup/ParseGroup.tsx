"use client"

import ProductsGetter from "./getProductsByGroupSlug"

export default function ParseGroup() {
    return <>
    <h1>Парсер групп</h1>
        <ProductsGetter />
    </>
}