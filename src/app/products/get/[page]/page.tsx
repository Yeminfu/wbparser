import { pool } from "@/app/tools/db";
import ProductsFilter from "../productsFilter/productsFilter";
import ProductsPagination from "../productsPagination/productsPagination";
import Link from "next/link";

export default async function Page(props: { params: { page: string }, searchParams: any }) {
    const { total,
        page,
        perPage,
        pages,
        products, } = await getProducts(props.searchParams, props.params.page)
    const columns: string[] = await new Promise(resolve => {
        pool.query(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'wbparsing' AND TABLE_NAME = 'products'",
            function (err, res: any) {
                if (err) {
                    console.log('err #12', err);
                }
                resolve(res?.map((v: any) => v.COLUMN_NAME) || [])
            }
        )
    })
    return <>
        <h1>Все товары</h1>
        <ProductsFilter columns={columns} searchParams={props.searchParams} />
        <ProductsPagination searchParams={props.searchParams} currentPage={props.params.page} pages={pages}/>


        <pre>{JSON.stringify({
            total,
            page,
            perPage, 
            pages, 
        }, null, 2)}</pre>
        <div className="row">
            {products.map(product => <div className="col-2">
                <div className="card">
                    <div className="card-header">
                        {product.product_name}
                    </div>
                    <div className="card-body">
                        <img src={product.image} alt="" className="mw-100" />
                        <pre>{JSON.stringify(product, null, 2)}</pre>
                        <Link href={product.link} target="_blank">ссыль</Link>
                    </div>
                </div>
            </div>)}
        </div>
    </>
}


async function getProducts(searchParams: any, page: number | string) {
    const whereArr = [];

    for (const key in searchParams) {
        if (Object.prototype.hasOwnProperty.call(searchParams, key)) {
            const element = searchParams[key];
            whereArr.push(
                `${key} LIKE "%${element}%"`
            );
        }
    }

    const perPage = 10;
    const offset = (Number(page) - 1) * perPage;

    const whereString = whereArr.length ? ("WHERE " + whereArr.join(" AND ")) : "";

    const total = await new Promise(resolve => {
        pool.query(
            `SELECT count(*) as count FROM products ${whereString}`,
            function (err, res: any) {
                if (err) {
                    console.log('err #dksrm4', err);
                }
                resolve((res?.pop()?.count) || 0)
            }
        )
    })



    const products: ProductInterface[] = await new Promise(resolve => {
        const qs = `SELECT * FROM products ${whereString} LIMIT  ${offset}, ${perPage}`;
        pool.query(
            qs,
            function (err, res: any) {
                if (err) {
                    console.log('err #dkrm4', err);
                }
                resolve(res || [])
            }
        )
    })

    const pages = Math.ceil(Number(total)/perPage)

    return {
        total,
        page,
        perPage,
        products,
        pages 
    }

}

interface ProductInterface {
    id: number
    link: string
    image: string
    product_name: string
}