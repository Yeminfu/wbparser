import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import getStatusAndBreadcrumbs from "./getStatusAndBreadcrumbs";
import { pool } from "@/app/tools/db";

export async function POST(request: NextRequest) {
  const { link, category_id } = await request.json();

  console.log(link);
  const status = await getStatusAndBreadcrumbs(link);
  const data = await updateCategory(category_id, status);
  console.log("status", status);

  return NextResponse.json({
    ...status,
  });
}

async function updateCategory(
  category_id: number,
  data: {
    type: "parent_category_a" | "products" | "not_found";
    breadcrumbs?: string;
    title?: string | null;
  }
) {
  // console.log("category_id", category_id);
  // console.log("datadatadata", data);

  console.log(
    `UPDATE categories SET name = ${data.title}, bread_crumbs = ${data.breadcrumbs}, status = ${data.type}`
  );

  return pool
    .promise()
    .query(
      "UPDATE categories SET name = ?, bread_crumbs = ?, status = ? WHERE id = ?",
      [data.title, data.breadcrumbs, data.type, category_id]
    )
    .then((x) => {
      console.log("success", x);
    })
    .catch((x) => {
      console.log("error #dod9", x);
    });
}
