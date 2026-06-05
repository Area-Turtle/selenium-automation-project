const { Builder, By } = require('selenium-webdriver');

const fs = require('fs');

// console.log('root files:', fs.readdirSync('.'));

const commonActions = require('./support/commonActions');
// const otherTests = require('./seleneium_tests/*')

const BASE_URL = 'http://localhost:9292/';

async function runMainTest(driver) {
    await driver.get(BASE_URL);

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Homepage Title',
        title,
        'The Internet'
    );
}
async function runFindPageHeading(driver) {
    const element = await commonActions.waitForVisible(driver, By.css('h1.heading'));
    const heading = await element.getText();

    console.log("Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Heading Test',
        heading,
        'Welcome to the-internet'
    );
}

async function runFindSubHeading(driver) {
    const element = await commonActions.waitForVisible(driver, By.css('h2'));
    const heading = await element.getText();

    console.log("Sub-Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Sub-Heading Test',
        heading,
        'Available Examples'
    );
}

async function runFindItemCount(driver) {
    const list = await commonActions.waitForVisible(driver, By.css('#content ul'));
    const items = await list.findElements(By.css('li'));

    const count = items.length;
    // for (let i = 0; i < count; i++) {
    //     console.log(`${i + 1}. ${await items[i].getText()}`);
    // }

    console.log('Count:', count);

    return commonActions.validate(
        'Available Examples Count',
        count,
        45
    );
}

async function runABMainTest(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('A/B Testing')).click();

    const title = await driver.getTitle();
    console.log("A/B Test Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'A/B Test Head Title',
        title,
        'The Internet'
    );
}
async function runABFindPageHeading(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('A/B Testing')).click();
    // await driver.wait(async () => {
    //     const elements = await driver.findElements(
    //         By.css('.example h3')
    //     );
    //     return elements.length > 0;
    // }, 10000);
    const url = await driver.getCurrentUrl();
    console.log(url);
    const iframe = await driver.findElement(By.css("iframe"));
    await driver.switchTo().frame(iframe);
    const bodyHtml = await driver.executeScript("return document.body.innerHTML;");
    console.log(bodyHtml);

    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();
    console.log("H3 Heading:", heading);
    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'H3 Heading Test',
        heading,
        'A/B Test Control'
    );
}


async function runAllTests() {
    const driver = await commonActions.createDriver();
    let results = [];
    try {
        commonActions.addSummary('# Selenium Test Results');
        commonActions.addSummary('');
        commonActions.addSummary('| Test | Result |');
        commonActions.addSummary('|------|--------|');
        const tests = [
            runMainTest,
            runFindPageHeading,
            runFindSubHeading,
            runFindItemCount,
            runABMainTest,
            runABFindPageHeading
        ];
        for (const test of tests) {
            results.push(await test(driver));
        }
        console.log('All tests completed');
    } catch (err) {
        commonActions.addSummary('| Test Suite | Failed |');
        console.error(err);
        process.exitCode = 1;
    } finally {
        try {
            await commonActions.generateHtmlReport(results);
        } catch (reportErr) {
            console.error('Failed to generate HTML report:', reportErr);
        } try {
            if (driver) {
                await driver.quit();
            }
        } catch (quitErr) {
            console.error('Error closing driver:', quitErr);
        }
    }
}

runAllTests();

