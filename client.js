require("dotenv").config();

const START_PAGE = process.env.START_PAGE;

(async () => {
  const { categoriesFromDB: categories } = await fetch(
    `${process.env.url}/api/categories/get`,
    {
      method: "POST",
    }
  ).then((x) => x.json());

  for (let index = START_PAGE; index < categories.length; index++) {
    const category = categories[index];
    try {
      const data = await getCategoryData(category.link, category.id);
      console.log("data", index, data, category.link);
    } catch (error) {
      console.log("error #z0z9", error);
    }
  }
})();

async function getCategoryData(link, category_id) {
  // console.log('get', link);
  return fetch(`${process.env.url}/api/categories/get-category-status`, {
    method: "POST",
    body: JSON.stringify({ link, category_id }),
  })
    .then((x) => x.json())
    .then((x) => {
      return x;
    });
}
