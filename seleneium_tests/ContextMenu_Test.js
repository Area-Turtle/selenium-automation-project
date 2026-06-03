const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const elementCount = 1

async function runARMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Context Menu')).click();

    const title = await driver.getTitle();
    console.log("Context Menu Head Title:", title);

    // test validate: (name, actual, and expected)
    return validate(
        'Context Menu Head Title',
        title,
        'The Internet'
    );
}
async function runARFindPageHeading(driver) {
    const element = await waitForVisible(driver, By.css('h3.heading'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return validate(
        'H3 Heading Test',
        heading,
        'Context Menu'
    );
}
