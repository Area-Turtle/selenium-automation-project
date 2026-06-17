const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'Exit Intent';

function openModal() {
    const actions = driver.actions({ bridge: true });

    // Move mouse into page first
    await actions.move({ x: 100, y: 100 }).perform();

    // Then move near the top edge to trigger exit intent
    await actions.move({ x: 100, y: 0 }).perform();

    const modal = await driver.wait(
        until.elementLocated(By.css('.modal')),
        10000
    );
}

async function runEIMainTest(driver) {
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
async function runEIFindPageHeading(driver) {
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
async function runEICheckModal(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    openModal()

    return commonActions.validate(
        '(Exit Intent) Modal Visible',
        await modal.isDisplayed(),
        true
    );
}

async function runEICheckModalText(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    openModal()

    const title = await driver.findElement(
        By.css('.modal-title h3')
    ).getText();

    return commonActions.validate(
        '(Exit Intent) Modal Title',
        title.toUpperCase(),
        'THIS IS A MODAL WINDOW'
    );
}

async function runEICheckModalClose(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    openModal()

    await driver.findElement(
        By.css('.modal-footer p')
    ).click();

    await driver.wait(async () => {
        const modals = await driver.findElements(
            By.css('.modal')
        );

        return modals.length === 0 ||
            !(await modals[0].isDisplayed());
    }, 10000);

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