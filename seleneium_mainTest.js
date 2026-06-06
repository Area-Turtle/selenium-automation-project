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

async function runARMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Add/Remove Elements')).click();

    const title = await driver.getTitle();
    console.log("Add/Remove Elements Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Add/Remove Elements Head Title',
        title,
        'The Internet'
    );
}

async function runARFindPageHeading(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();
    const element = await waitForVisible(driver, By.css('h3'));
    const heading = await element.getText();

    console.log("Add/Remove H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Add/Remove H3 Heading Test',
        heading,
        'Add/Remove Elements'
    );
}

async function runARAddElement(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();

    //<button onclick="addElement()">Add Element</button>
    const element = await driver.findElement(By.css('button[onclick="addElement()"]')).click();

    //#content > div > button
    const heading = await element.getText();

    const deleteButton = await driver.findElement(By.css('button.added-manually'));

    const hasMoreThanOne = deleteButtons.length > 1;

    console.log(hasMoreThanOne);

    console.log("Add Button:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Add/Remove H3 Heading Test',
        heading,
        'Add Element'
    );
}

async function runARRemoveElement(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();

    //<button onclick="addElement()">Add Element</button>
        const addButton = await driver.findElement(
        By.css('button[onclick="addElement()"]')
    );

    //#content > div > button
    console.log('Add Button:', await addButton.getText());

    // const heading = await element.getText();
    console.log("Add Button:", heading);

    // const deleteButtons = await driver.findElement(By.css('button.added-manually')).click();
    const deleteButton = await driver.findElement(
        By.css('button.added-manually')
    );
    await deleteButton.click();
    // await driver.findElements(
    //     By.css('#elements button.added-manually')
    // );

    // const isEmpty = deleteButtons.length === 0;
    
    // console.log(await deleteButtons.isDisplayed());
        const remainingButtons = await driver.findElements(
        By.css('#elements button.added-manually')
    );
     const isEmpty = remainingButtons.length === 0;

    console.log('Container empty:', isEmpty);
    //await driver.findElement(By.css('button.added-manually')).click();
    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Delete Button Removed Test',
        isEmpty,
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
            runARMainTest,
            runARFindPageHeading,
            runARAddElement,
            runARRemoveElement
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

