import { pool } from "@/app/tools/db";
import { ProductFromDbInterface } from "@/app/types/product";
import ProductsViewer from "../../components/ProductsViewer";

export default async function Page(a: {
  params: { parent: string; children: string };
}) {
  const { parent, children } = a.params;
  const products: ProductFromDbInterface[] = await pool
    .promise()
    .query(
      "select * from products where category = ? order by count desc limit 1000",
      [children]
    )
    .then(([x]: any) => {
      return x;
    });
  //   console.log("aaa", a);
  return (
    <>
      {/* page */}
      {/* <h1>{}</h1> */}
      <div>{products.length}</div>
      <ProductsViewer products={products} />
    </>
  );
}
