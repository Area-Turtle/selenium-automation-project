const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';


async function runCMMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Context Menu')).click();

    const title = await driver.getTitle();
    console.log("Context Menu Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Context Menu Head Title',
        title,
        'The Internet'
    );
}
async function runCMFindPageHeading(driver) {
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'H3 Heading Test',
        heading,
        'Context Menu'
    );
}
