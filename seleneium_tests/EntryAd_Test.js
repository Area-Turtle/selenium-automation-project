const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'Entry Ad';

function closeModal() {
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
}

async function runEAMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    closeModal()


    const title = await driver.getTitle();
    console.log(`(${pageTopic}) Head Title:`, title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        `(${pageTopic}) Head Title`,
        title,
        'The Internet'
    );
}
async function runEAFindPageHeading(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    closeModal()
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

async function runEAVerifiyModal(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const title = await driver.findElement(
        By.css('.modal h3')
    ).getText();

    return commonActions.validate(
        'Modal Title',
        title.toUpperCase(),
        'THIS IS A MODAL WINDOW'
    );
}

async function runEAReOpenModal(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    closeModal()

    await driver.findElement(
        By.linkText('click here')
    ).click();

    const modal = await driver.wait(
        until.elementLocated(By.css('.modal')),
        10000
    );

    return commonActions.validate(
        'Modal Reopened',
        await modal.isDisplayed(),
        true
    );
}