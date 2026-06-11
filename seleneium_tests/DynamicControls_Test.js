const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'Dynamic Controls';


async function runDC2MainTest(driver) {
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
async function runDC2FindPageHeading(driver) {
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

async function runDC2CheckBoxRemoveAdd(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();


    const checkbox = await driver.findElement(
        By.css('#checkbox input[type="checkbox"]')
    );

    await driver.findElement(
        By.css('#checkbox-example button')
    ).click();

    await driver.wait(
        until.stalenessOf(checkbox),
        10000
    );

    const message = await driver.findElement(
        By.id('message')
    ).getText();

    // message should be: It's gone!
    console.log(rmessage);

    const removedSuccessfully = message === "It's gone!";
    
    await driver.findElement(
        By.css('#checkbox-example button')
    ).click();

    await driver.wait(
        until.elementLocated(
            By.css('#checkbox input[type="checkbox"]')
        ),
        10000
    );

    const checkboxExists =
        (await driver.findElements(
            By.css('#checkbox input[type="checkbox"]')
        )).length > 0;


    return commonActions.validate(
        `(${pageTopic}) Checkbox Remove/Add Test`,
        removedSuccessfully && checkboxExists,
        true
    );
}

async function runDC2InputDisableEnable(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const input = await driver.findElement(
        By.css('#input-example input')
    );

    const enabled = await input.isEnabled();

    console.log(enabled);

    await driver.findElement(
        By.css('#input-example button')
    ).click();

    await driver.wait(async () => {
        return await input.isEnabled();
    }, 10000);

    const inputEnabled = await driver.findElement(
        By.id('message')
    ).getText();

    console.log(inputEnabled)

    await driver.findElement(
        By.css('#input-example button')
    ).click();

    await driver.wait(async () => {
        return !(await input.isEnabled());
    }, 10000);

    const inputDisabled = await driver.findElement(
        By.id('message')
    ).getText();

    console.log(inputDisabled)

    const enabledCorrect = inputEnabled === "It's enabled!";
    const disabledCorrect = inputDisabled === "It's disabled!"; 

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        `(${pageTopic}) InputDisabledEnabled Test`,
        enabledCorrect && disabledCorrect,
        true
    );
}