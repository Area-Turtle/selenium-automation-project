const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';

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