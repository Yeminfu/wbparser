// import Image from "next/image";
// import Link from "next/link";
import { pool } from "../tools/db";
// import { CategoryInterface } from "../types/category";
import { ProductFromDbInterface } from "../types/product";
import ProductsViewer from "./components/ProductsViewer";

export default async function Page() {
  //   const tables: string[] = await pool
  //     .promise()
  //     .query("show tables")
  //     .then(([x]: any) => {
  //       return x.map((x: any) => x.Tables_in_wbp);
  //     });

  //   const categories: CategoryInterface[] = await pool
  //     .promise()
  //     .query("select * from categories")
  //     .then(([x]: any) => {
  //       return x;
  //     })
  //     .catch((_) => []);

  const products: ProductFromDbInterface[] = await pool
    .promise()
    .query("select * from products  order by count desc limit 1000")
    .then(([x]: any) => {
      return x;
    });

  //   const parentssCats = getParentCategoriesFrom(categories);

  return (
    <>
      <div className="row">
        {/* <div className="col-1">
          <strong>таблицы</strong>
          {tables.map((table) => (
            <div key={table} className="p-2 border">
              Таблица {table}
            </div>
          ))}
        </div> */}
        {/* <div className="col-2">
          <strong>категории</strong>
          <ul className="list-group">
            {parentssCats.map((parent) => {
              return (
                <li className="list-group">
                  <Link href={`/goods/${parent}`}>{parent}</Link>
                </li>
              );
            })}
          </ul>
          <pre>{JSON.stringify(parentssCats, null, 2)}</pre>
          {categories.map((category, i) => (
            <div key={category.id} className="p-1 border">
              #{i + 1} Категория {category.name}
            </div>
          ))}
        </div> */}
        <div className="col">
          <strong>все товары</strong>
          <ProductsViewer products={products} />
        </div>
      </div>
    </>
  );
}
