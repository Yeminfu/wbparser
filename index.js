
import puppeteer from "puppeteer";
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); // missing await
    await page.goto("https://www.wildberries.ru/catalog/obuv/muzhskaya?sort=popular&cardsize=c516x688");
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


        if (checkpoint > 5) {
            break;
        }
        await new Promise(r => {
            setTimeout(() => {
                r()
            }, 1000);
        })
    }

    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.product-card__link'))
            .map(({ href }) => href)
    });
    console.log('products', products);


    // console.log('собрали всех');
})();



// document.querySelectorAll('.product-card__link').length

// document.querySelector('.pagination');

// (async () => {
//     window.scrollTo(0, document.body.scrollHeight);
// })();


// window.pageYOffset || document.documentElement.scrollTop
// window.innerHeight


// 0