const { Builder, By } = require('selenium-webdriver');
const commonActions = require('./seleneium/support/commonActions.js');

console.log(commonActions);
console.log(typeof commonActions.createDriver);
console.log(require.resolve('./support/commonActions'));
const BASE_URL = 'http://localhost:9292/';

async function runMainTest(driver) {
    await driver.get(BASE_URL);

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    // test validate: (name, actual, and expected)
    return validate(
        'Homepage Title',
        title,
        'The Internet'
    );
}
async function runFindPageHeading(driver) {
    const element = await waitForVisible(driver, By.css('h1.heading'));
    const heading = await element.getText();

    console.log("Heading:", heading);

    // test validate: (name, actual, and expected)
    return validate(
        'Heading Test',
        heading,
        'Welcome to the-internet'
    );
}

async function runFindSubHeading(driver) {
    const element = await waitForVisible(driver, By.css('h2'));
    const heading = await element.getText();

    console.log("Sub-Heading:", heading);

    // test validate: (name, actual, and expected)
    return validate(
        'Sub-Heading Test',
        heading,
        'Available Examples'
    );
}

async function runFindItemCount(driver) {
    const list = await waitForVisible(driver, By.css('#content ul'));
    const items = await list.findElements(By.css('li'));

    const count = items.length;
    // for (let i = 0; i < count; i++) {
    //     console.log(`${i + 1}. ${await items[i].getText()}`);
    // }

    console.log('Count:', count);

    return validate(
        'Available Examples Count',
        count,
        45
    );
}

async function runAllTests() {
   const driver = await commonActions.createDriver();

    let results = [];

    try {
        addSummary('# Selenium Test Results');
        addSummary('');
        addSummary('| Test | Result |');
        addSummary('|------|--------|');

        const tests = [
            runMainTest,
            runFindPageHeading,
            runFindSubHeading,
            runFindItemCount
        ];

        for (const test of tests) {
            results.push(await test(driver));
        }

        console.log('All tests completed');

    } catch (err) {
        addSummary('| Test Suite | Failed |');
        console.error(err);
        process.exitCode = 1;

    } finally {
        await generateHtmlReport(results);
        await driver.quit();
    }
}

runAllTests();

