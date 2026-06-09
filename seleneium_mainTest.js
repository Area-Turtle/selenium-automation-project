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

async function runCDMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Challenging DOM')).click();

    const title = await driver.getTitle();
    console.log("Challenging DOM Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Challenging DOM Head Title',
        title,
        'The Internet'
    );
}
async function runCDFindPageHeading(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Challenging DOM')).click();
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Challenging DOM H3 Heading Test',
        heading,
        'Challenging DOM'
    );
}
async function runCDCheckButton(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Challenging DOM')).click();
    const buttons = await driver.findElements(By.css('a.button'));

    const allowedTexts = new Set(['foo', 'bar', 'qux', 'baz']);

    let valid = buttons.length > 0;

    for (const btn of buttons) {
        const text = await btn.getText();

        console.log('Button text:', text);

        if (!allowedTexts.has(text)) {
            valid = false;
        }
    }

    return commonActions.validate(
        'Button Text Valid (foo/bar/qux)',
        valid,
        true
    );
}
async function runCDCheckButtonAlert(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Challenging DOM')).click();
    const buttons = await driver.findElements(By.css('a.button.alert'));

    const allowedTexts = new Set(['foo', 'bar', 'qux', 'baz']);

    let valid = buttons.length > 0;

    for (const btn of buttons) {
        const text = await btn.getText();

        console.log('Button text:', text);

        if (!allowedTexts.has(text)) {
            valid = false;
        }
    }

    return commonActions.validate(
        'Button Text Valid (foo/bar/qux/baz)',
        valid,
        true
    );
}

async function runCDCheckButtonSuccess(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Challenging DOM')).click();

    const buttons = await driver.findElements(By.css('a.button.success'));

    const allowedTexts = new Set(['foo', 'bar', 'qux', 'baz']);

    let valid = buttons.length > 0;

    for (const btn of buttons) {

        // DOM text
        const domText = await btn.getText();

        // ::before text
        const beforeText = await driver.executeScript(`
            return window.getComputedStyle(arguments[0], '::before')
                         .getPropertyValue('content');
        `, btn);

        const cleanBefore = beforeText.replace(/['"]/g, '');

        const fullVisibleText = cleanBefore + domText;

        console.log('Visible text:', fullVisibleText);

        // validate DOM text
        if (!allowedTexts.has(domText)) {
            valid = false;
        }
    }

    return commonActions.validate(
        'Success Button Text Valid',
        valid,
        true
    );
}

async function runCDCheckCanvas(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Challenging DOM')).click();
    const canvas = await driver.findElement(By.tagName('canvas'));

    const hasContent = await driver.executeScript(`
        const canvas = arguments[0];
        const ctx = canvas.getContext('2d');

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        for (let i = 0; i < data.length; i++) {
            if (data[i] !== 0) return true;
        }

        return false;
    `, canvas);

    console.log('Canvas has content:', hasContent);

    return commonActions.validate(
        'Canvas Displays Content',
        hasContent,
        true
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
            runCDMainTest,
            runCDFindPageHeading,
            runCDCheckButton,
            runCDCheckButtonAlert,
            runCDCheckButtonSuccess,
            runCDCheckCanvas
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

