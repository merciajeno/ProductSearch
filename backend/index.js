const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Visible browser
        defaultViewport: null, // Matches your screen size
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const url = 'https://www.amazon.in/ref=nav_logo';
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Search for the product
    await page.type('#twotabsearchtextbox', 'ferero rocher');
    await page.click('#nav-search-submit-button');

    // Wait for results to load
    await page.waitForSelector('.a-section .a-spacing-small');
    // await page.waitForTimeout(5000); // Delay of 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000)); // Delay of 5 seconds

    // Scrape product data
    const productList = await page.evaluate(() => {
        const productData = [];
        const products = document.querySelectorAll('.a-section .a-spacing-small');
        products.forEach(product => {
            const title = product.querySelector('h2');
            const price = product.querySelector('.a-price-whole');
            const proTitle = title ? title.innerText.trim() : 'No title';
            const proPrice = price ? price.innerText.trim() : 'No price';
            if (proTitle != 'No title' && proPrice != 'No price')
                productData.push({ title: proTitle, price: proPrice });
        });
        return productData;
    });

    console.log(productList);
    await browser.close();
})();
