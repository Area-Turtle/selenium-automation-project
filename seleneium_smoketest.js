const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

function addSummary(text) {
    if (process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(
            process.env.GITHUB_STEP_SUMMARY,
            text + '\n'
        );
    }
}

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
        console.log("Page Title:", title);
        addSummary('| Homepage Title | ✅ Pass |');
        if (title !== 'The Internet') {
            throw new Error(
                `Expected title "The Internet" but found "${title}"`

            );
            addSummary('| Title test | ❌ Fail |');
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
        const headTitle = await driver
            .findElement(By.css('h1.heading'))
            .getText();

        console.log("heading title:", headTitle);
        addSummary('| heading title test | ✅ Pass |');
        if (headTitle !== 'Welcome to the-internet') {
            throw new Error(
                `Expected title "Welcome to the-internet" but found "${headTitle}"`
                
            );
            addSummary('| heading title test| ❌ Fail |');
        }

    } finally {
        await driver.quit();
    }
}

async function runAllTests() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        await runSmokeTest(driver);
        await runFindPageTitle(driver);

        console.log('✓ All tests passed');
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}

runAllTests();