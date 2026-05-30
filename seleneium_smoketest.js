const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const fs = require('fs');

function addSummary(text) {
    if (process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
    }
}


async function runSmokeTest(driver) {
    await driver.get('http://localhost:9292/');

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    if (title !== 'The Internet') {
        throw new Error(`Expected "The Internet" but got "${title}"`);
    }

    addSummary('| Homepage Title | ✅ Pass |');
}
async function runFindPageTitle(driver) {
    const heading = await driver
        .findElement(By.css('h1.heading'))
        .getText();

    console.log("Heading:", heading);

    if (heading !== 'Welcome to the-internet') {
        throw new Error(`Expected heading but got "${heading}"`);
    }

    addSummary('| Heading Test | ✅ Pass |');
}

async function runAllTests() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        addSummary('# Selenium Test Results');
        addSummary('');
        addSummary('| Test | Result |');
        addSummary('|------|--------|');

        await runSmokeTest(driver);
        await runFindPageTitle(driver);

        console.log('✓ All tests passed');

    } catch (err) {
        addSummary('| ❌ Test Suite | Failed |');
        console.error(err);
        process.exitCode = 1;
    } finally {
        fs.mkdirSync('reports', { recursive: true });

        fs.writeFileSync(
            'reports/report.html',
            '<h1>Selenium Results</h1>'
        );
        await driver.quit();
    }
}

runAllTests();

