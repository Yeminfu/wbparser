"use client"

import CategoriesGetter from "./CategoriesGetter"
import GetProductsFromCategory from "./GetProductsFromCategory"
import ProductsGetter from "./getProductsByGroupSlug"

export default function ParseGroup(props: {
    START_CATEGORY: number,
    START_PAGE: number
}) {
    const { START_CATEGORY, START_PAGE } = props;
    return <>
        <h1>groups.parse</h1>
        <div className="border border-dark m-2">
            <ProductsGetter />
        </div>
        <div className="border border-dark m-2">
            <CategoriesGetter />
        </div>
        <div className="border border-dark m-2">
            <GetProductsFromCategory
                START_CATEGORY={START_CATEGORY}
                START_PAGE={START_PAGE}
            />
        </div>
    </>
}