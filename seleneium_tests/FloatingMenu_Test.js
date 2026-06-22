const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'Floating Menu';


async function runFMMainTest(driver) {
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
async function runFMFindPageHeading(driver) {
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

async function runFMVerifyMenuButtonsExist(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const buttons = await driver.findElements(
    By.css('#menu a')
);

console.log(`Found ${buttons.length} buttons`);
for (const button of buttons) {
    console.log(await button.getText());
}
    // test validate: (name, actual, and expected)
const buttons = await driver.findElements(
    By.css('#menu a')
);

const texts = [];

for (const button of buttons) {
    texts.push(await button.getText());
}

return commonActions.validate(
    '(Floating Menu) Button Count',
    texts.length,
    4
);
}

async function runFMMenuButtonsExistOnScroll(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const menu = await driver.findElement(
        By.id('menu')
    );

    await driver.executeScript(
        'window.scrollTo(0, document.body.scrollHeight);'
    );

    return commonActions.validate(
        '(Floating Menu) Menu Visible After Scroll',
        await menu.isDisplayed(),
        true
    );
}