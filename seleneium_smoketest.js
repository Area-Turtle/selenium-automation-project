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
        await driver.get('http://localhost:9292/');
        let title = await driver.getTitle();
        // console.log("Page Title:", title);

        if (title !== 'The Internet') {
            throw new Error(
                `Expected title "The Internet" but found "${title}"`
                
            );
        }

    } finally {
        await driver.quit();
    }
}

async function runFindPageTitle() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('http://localhost:9292/');
        let headTitle = await driver.getFindElement(
            By.css("h1.heading")
        ).getText();
        console.log("heading:", headTitle);

        if (headTitle !== 'Welcome to the-internet') {
            throw new Error(
                `Expected title "Welcome to the-internet" but found "${title}"`
                
            );
        }

    } finally {
        await driver.quit();
    }
}

runSmokeTest();
runFindPageTitle()