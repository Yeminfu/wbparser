import { ProductFromDbInterface } from "@/app/types/product";

export default function ProductsViewer({
  products,
}: {
  products: ProductFromDbInterface[];
}) {
  return (
    <table>
      <tbody>
        {products.map((product, i) => (
          <tr key={product.id} className="p-1 border">
            <td>#{i + 1}</td>
            <td>
              <img src={product.image} alt="" style={{ height: 100 }} />
            </td>
            <td>
              <div>
                <strong>{product.product_name}</strong>
              </div>
              {/* <div><strong></strong></div> */}
              <div>Цена:{product.lower_price}</div>
              {/* <div>upper_price:{product.upper_price}</div> */}
              <div>рейтинг:{product.rating}</div>
              <div>оценок:{product.count}</div>

              <div>ссылка:{product.link}</div>

              {/* <div>продано:{product.count}</div> */}
            </td>
            {/* <td>{product.product_name}</td> */}
            <td>
              <button className="btn btn-success">сохранить</button>
              <button className="btn btn-danger">удалить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
