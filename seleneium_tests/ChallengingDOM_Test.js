const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';


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
async function verifyButtonText(driver) {
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