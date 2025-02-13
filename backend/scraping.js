const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Use the StealthPlugin by initializing it properly
puppeteer.use(StealthPlugin());


// (async () => {
//     const browser = await puppeteer.launch({ headless: false, defaultViewport: null });

//     // Open a new page
//     const page = await browser.newPage();

//     // Set a custom User-Agent
//     await page.setUserAgent(
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//     );

//     // Navigate to the URL
//     const url = 'https://amazon.in';
//     await page.goto(url, { waitUntil: 'domcontentloaded' });

//     console.log('Done.....');

//     // Close the browser
//     await browser.close();
// })();

async function scrapeAmazon() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null })
    const page = await browser.newPage()
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const searchQuery = 'laptop'; // Replace with your search query
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.s-asin')
        const productList = [];
        productElements.forEach(el => {
            const name = el.querySelector('h2 span')?.innerText || 'No Name';
            const price = el.querySelector('.a-price-whole')?.innerText || 'No Price';
            productList.push({ name, price })
        });
        return productList
    })
    console.log(products)
    await browser.close()
}

async function scrapeFlipkart() {

    const searchQuery = 'laptop';
    const url = `https://www.flipkart.com/search?q=${searchQuery}`;

    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('._6i1qKy')
    await page.click('._6i1qKy')// 4& above rating
    const productList = await page.evaluate(() => {
        const products = [];
        const allProducts = document.querySelectorAll('.slAVV4')
        allProducts.forEach(el => {
            const productName = el.querySelector('.wjcEIp')?.innerText || 'No Name';
            const productPrice = el.querySelector('.Nx9bqj')?.innerText || 'No Price';

            if (productName !== 'No Name' && productPrice !== 'No Price') {
                products.push({ productName, productPrice });
            }
        });
        return products;
    });

    console.log(productList);
    await browser.close();
}

async function scrapeNetMeds() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null })
    const page = await browser.newPage()
    const searchQuery = 'sunscreen'
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    const url = `https://www.netmeds.com/catalogsearch/result/${searchQuery}/all`;
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-index="prod_meds_products_popularity"]');
    await page.click('[data-index="prod_meds_products_popularity"]');
    await page.waitForSelector('.cat-item');
    const productList = await page.evaluate(() => {
        const products = []
        const allProducts = document.querySelectorAll('.cat-item')
        allProducts.forEach(el => {
            const productName = el.querySelector('.clsgetname')?.innerText || 'No Name'
            const productPrice = el.querySelector('#final_price')?.innerText || 'No Price'
            if (productName != 'No Name' && productPrice != 'No Price')
                products.push({ productName, productPrice })
        })
        return products
    })
    console.log(productList)
    await browser.close();
}

async function scrapeBigBasket() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null })
    const page = await browser.newPage()
    const searchQuery = 'banana'
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    const url = `https://www.bigbasket.com/ps/?q=${searchQuery}`
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('input[id="5"]')
    await page.locator('input[id="5"]').click()
    await browser.close()
}
scrapeBigBasket();