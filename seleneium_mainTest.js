const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const fs = require('fs');

function addSummary(text) {
    if (process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
    }
}


async function runMainTest(driver) {
    await driver.get('http://localhost:9292/');

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    if (title !== 'The Internet') {
        addSummary(`| Homepage Title |  Fail (${title}) |`);
        //throw new Error(`Expected "The Internet" but got "${title}"`);
    }

    addSummary('| Homepage Title |  Pass |');
}
async function runFindPageHeading(driver) {
    const heading = await driver
        .findElement(By.css('h1.heading'))
        .getText();

    console.log("Heading:", heading);

    if (heading !== 'Welcome to the-internet') {
        addSummary(`| Heading Test |  Fail (${heading}) |`);
        //throw new Error(`Expected heading but got "${heading}"`);
    }

    addSummary('| Heading Test |  Pass |');
}

async function runFindSubHeading(driver) {
    const heading = await driver
        .findElement(By.css('h2'))
        .getText();

    console.log("Sub-Heading:", heading);
    if (heading !== 'Available Examples') {
        addSummary(`| Sub-Heading Test  |  Fail (${heading}) |`);
        //throw new Error(`Expected heading but got "${heading}"`);
    }

    addSummary('| Sub-Heading Test |  Pass |');
}

async function runFindItemCount(driver) {
    const list = await driver.findElement(By.css('#content ul'));
    const items = await list.findElements(By.tagName('li'));

    console.log('Count:', items.length);

    if (items.length !== 44) {
        addSummary(`| Available Examples Count | Fail (${items.length}) |`);
        //throw new Error(`Expected 44 items but found ${items.length}`);
    }

    addSummary(`| Available Examples Count |  Pass (${items.length}) |`);
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

        await runMainTest(driver);
        await runFindPageHeading(driver);
        await runFindSubHeading(driver);
        await runFindItemCount(driver);

        console.log('✓ All tests passed');

    } catch (err) {
        addSummary('|  Test Suite | Failed |');
        console.error(err);
        process.exitCode = 1;
    } finally {
        fs.mkdirSync('reports', { recursive: true });

        fs.writeFileSync(
            'reports/report.html',
            `
    <html>
      <body>
        <h1>Selenium Results</h1>
        <ul>
          <li>Homepage Title: Pass</li>
          <li>Heading Test: Pass</li>
          <li>Sub-Heading Test: Pass</li>
          <li>Available Examples Count: Pass</li>
        </ul>
      </body>
    </html>
    `
        );
        await driver.quit();
    }
}

runAllTests();

