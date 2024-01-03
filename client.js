require("dotenv").config();

// START_PAGE=0

(async () => {
  const { categoriesFromDB: categories } = await fetch(
    `${process.env.url}/api/categories/get`,
    {
      method: "POST",
    }
  ).then((x) => x.json());

  for (let index = 8; index < categories.length; index++) {
    const category = categories[index];
    try {
      const data = await getCategoryData(category.link);
      console.log("data", index, data, category.link);
    } catch (error) {
      console.log("error #z0z9", error);
    }
  }
})();

async function getCategoryData(link) {
  // console.log('get', link);
  return fetch(`${process.env.url}/api/categories/get-category-status`, {
    method: "POST",
    body: JSON.stringify({ link }),
  })
    .then((x) => x.json())
    .then((x) => {
      return x;
    });
}
