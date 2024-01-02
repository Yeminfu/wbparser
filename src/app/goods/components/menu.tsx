import { pool } from "@/app/tools/db";
import { CategoryInterface } from "@/app/types/category";
import Link from "next/link";

export default async function Menu() {
  const categories: CategoryInterface[] = await pool
    .promise()
    .query("select * from categories")
    .then(([x]: any) => {
      return x;
    })
    .catch((_) => []);

  const parentssCats = getParentCategoriesFrom(categories);

  return (
    <>
      <strong>категории</strong>
      <ul className="list-group">
        {parentssCats.map((parent) => {
          return (
            <li className="list-group-item">
              <Link href={`/goods/${parent}`}>{parent}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function getParentCategoriesFrom(categories: CategoryInterface[]) {
  // console.log('categories',categories);
  const unique: string[] = [];

  categories.forEach((cat) => {
    const parentCategory = cat.name.replace(
      /(#[0-9]+ )|(Категория )|(\>.+)/gim,
      ""
    );

    if (!unique.includes(parentCategory)) unique.push(parentCategory);
  });
  return unique;
}
