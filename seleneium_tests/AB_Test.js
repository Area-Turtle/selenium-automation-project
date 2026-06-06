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


    // const bodyHtml = await driver.executeScript("return document.body.innerHTML;");
    // console.log(bodyHtml);
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    //const element = await driver.findElement(By.css('.example h3'));
    const heading = await element.getText();
    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'A/B H3 Heading Test',
        heading,
        ['A/B Test Control', 'No A/B Test']
    );
}