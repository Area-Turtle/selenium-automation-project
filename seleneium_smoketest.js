const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runSmokeTest() {
     let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('http://localhost:3000');

        let title = await driver.getTitle();
        console.log("Page Title:", title);

        if (!title) {
            throw new Error("Localhost did not load properly.");
        }

    } finally {
        await driver.quit();
    }
}

runSmokeTest();