const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';


async function runBIainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Broken Images')).click();

    const title = await driver.getTitle();
    console.log("Broken Images Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Broken Images Head Title',
        title,
        'The Internet'
    );
}
async function runBIFindPageHeading(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Broken Images')).click();
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Broken Image H3 Heading Test',
        heading,
        'Broken Images'
    );
}
async function runBICheckImageValid(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Broken Images')).click();

    const image = await driver.findElement(
        By.css('img[src*="asdf.jpg"]')
    );

    const details = await driver.executeScript(`
        return {
            src: arguments[0].src,
            complete: arguments[0].complete,
            naturalWidth: arguments[0].naturalWidth,
            naturalHeight: arguments[0].naturalHeight,
            isBroken: arguments[0].complete &&
                      arguments[0].naturalWidth === 0
        };
    `, image);

    console.log('Image Details:', details);

    return commonActions.validate(
        'Broken Image',
        details.isBroken,
        true
    );
}