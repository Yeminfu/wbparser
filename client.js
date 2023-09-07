
require('dotenv').config();



// START_PAGE=0

(async () => {
    console.log(
        [
            process.env.START_CATEGORY,
            process.env.START_PAGE,
        ]
    );

    const { categoriesFromDB: categories } = await fetch(
        `${process.env.url}/api/categories/get`,
        {
            method: "POST"
        }
    )
        .then(x => x.json());
    // console.log('categories', Object.keys(categories));


    category_loop: for (let categoryIndex = process.env.START_CATEGORY; categoryIndex < categories.length; categoryIndex++) {
        const category = categories[categoryIndex];

        page_looop: for (let page = process.env.START_PAGE; page < 2000; page++) {

            const productsFromWB = await ParseCategoryPage(
                category.link,
                page,
                category.name
            )
            if (productsFromWB.products?.length) {// если есть товары
                // newStore.push(...log);
                // setLog(`страница: ${page}, получили товаров: ${productsFromWB.products?.length}, создано товаров в бд: ${productsFromWB.created} категория: ${category.name}`);
                console.log(`страница: ${page}, получили товаров: ${productsFromWB.products?.length}, создано товаров в бд: ${productsFromWB.created} категория: (${categoryIndex})/${category.name}`);
            } else {
                startPage = 1;
                continue category_loop;
            }
        }

    }
    console.log('собрали все товары с категории');


})();

console.log(process.env.url) // remove this after you've confirmed it is working


async function ParseCategoryPage(link, page, category_name) {
    return await fetch(
        `${process.env.url}/api/categories/parse`,
        {
            method: "POST",
            body: JSON.stringify({
                link: `${link}?sort=popular&page=${page}`,
                category_name: category_name,
            })
        }
    )
        .then(x => x.json())
        .then(x => {
            return x;
        });
}