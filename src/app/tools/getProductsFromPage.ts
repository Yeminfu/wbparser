export default async function getProductsFromPage(page: any, link: string) {
    await page.goto(link);
    await page.waitForSelector('.product-card__link');

    let checkpoint = 0;
    while (true) {
        await page.evaluate(() => {
            window.scrollBy(0, 500);
        })

        const element = await page.$('footer'); // Замените '#yourElementId' на селектор вашего HTML элемента
        const elementBoundingBox = await element.boundingBox();
        const viewportHeight = page.viewport().height;

        if (
            elementBoundingBox.y + elementBoundingBox.height >= 0 &&
            elementBoundingBox.y <= viewportHeight
        ) {
            // console.log('Элемент находится в видимой области (viewport)');
            checkpoint++;
        } else {
            // console.log('Элемент не находится в видимой области (viewport)');
            checkpoint = 0;
        }

        if (checkpoint > 3) {
            break;
        }
        await new Promise(r => {
            setTimeout(() => {
                r(1)
            }, 500);
        })
    }

    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.product-card__wrapper'))
            .map((product: any) => {
                if (product === null) {
                    return null;
                } else {
                    const link = product.querySelector(".product-card__link").href;
                    const product_name = product.querySelector(".product-card__name").innerText;
                    const rating = Number(product.querySelector(".address-rate-mini--sm").innerText);
                    const count = Number(product.querySelector(".product-card__count").innerText.replace(/[^0-9]/igm, ""));
                    const image = product.querySelector(".j-thumbnail").src
                    const price = {
                        lower_price: product.querySelector(".price__lower-price")?.innerText.replace(/[^0-9]/igm, ""),
                        upper_price: product.querySelector(".price__wrap del")?.innerText.replace(/[^0-9]/igm, ""),
                    }

                    return {
                        link,
                        product_name,
                        rating,
                        count,
                        price,
                        image
                    }
                }


            })
    });
    // console.log('products', products);
    return products;
}