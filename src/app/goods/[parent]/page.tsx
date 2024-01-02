import { pool } from "@/app/tools/db";
import { CategoryInterface } from "@/app/types/category";
import { ProductFromDbInterface } from "@/app/types/product";
import Link from "next/link";
import ProductsViewer from "../components/ProductsViewer";

export default async function Page(a: { params: { parent: string } }) {
  const parentName = decodeURI(a.params.parent);
  const childCategories = await getCategoriesByParent(parentName);

  const products: ProductFromDbInterface[] = await pool
    .promise()
    .query(
      "select * from products where category in (select id from categories WHERE name LIKE ?) order by count desc limit 1000",
      [`${parentName}%`]
    )
    .then(([x]: any) => {
      return x;
    });
  return (
    <>
      <h1>{parentName}</h1>
      {/* <pre>{JSON.stringify(childCategories, null, 2)}</pre> */}
      <div className="row">
        <div className="col-2">
          <ul className="list-group">
            {childCategories.map((category) => {
              return (
                <li className="list-group-item">
                  <Link href={`/goods/${parentName}/${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col">
          {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
          <ProductsViewer products={products} />
        </div>
      </div>
    </>
  );
}

async function getCategoriesByParent(
  parent: string
): Promise<CategoryInterface[]> {
  return pool
    .promise()
    .query(`select * from categories WHERE name LIKE ? AND id IN (SELECT DISTINCT category FROM products)`, [`${parent}%`])
    .then(([x]: any) => {
      return x;
    })
    .catch((_) => []);
}

// SELECT DISTINCT category FROM products;