const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'Dynamic Loading';


async function runDLMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const title = await driver.getTitle();
    console.log(`(${pageTopic}) Head Title:`, title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        `(${pageTopic}) Head Title`,
        title,
        'The Internet'
    );
}
async function runDLFindPageHeading(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        `${pageTopic} H3 Heading Test`,
        heading,
        pageTopic
    );
}

async function runDLDynamicExample1(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    await driver.findElement(
        By.linkText('Example 1: Element on page that is hidden')
    ).click();

    await driver.findElement(By.css('#start button')).click();

    const hello = await driver.wait(
        until.elementLocated(By.css('#finish h4')),
        10000
    );

    await driver.wait(
        until.elementIsVisible(hello),
        10000
    );

    const text = await hello.getText();

    return commonActions.validate(
        'Dynamic Loading Example 1',
        text,
        'Hello World!'
    );
}

async function runDLExample2(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Dynamic Loading')).click();
    await driver.findElement(
        By.linkText('Example 2: Element rendered after the fact')
    ).click();

    await driver.findElement(By.css('#start button')).click();

    const hello = await driver.wait(
        until.elementLocated(By.css('#finish h4')),
        10000
    );

    const text = await hello.getText();

    return commonActions.validate(
        'Dynamic Loading Example 2',
        text,
        'Hello World!'
    );
}