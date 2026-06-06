const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const elementCount = 1

async function runARMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Add/Remove Elements')).click();

    const title = await driver.getTitle();
    console.log("Add/Remove Elements Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Add/Remove Elements Head Title',
        title,
        'The Internet'
    );
}

async function runARFindPageHeading(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();
    const element = await commonActions.waitForVisible(driver, By.css('h3'));
    const heading = await element.getText();

    console.log("Add/Remove H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Add/Remove H3 Heading Test',
        heading,
        'Add/Remove Elements'
    );
}

async function runARAddElement(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();
    const currentUrl = await driver.getCurrentUrl();
    console.log('Current URL:', currentUrl);
    //<button onclick="addElement()">Add Element</button>
    //commonActions.waitForVisible(driver, By.css('button[onclick="addElement()"]')).click();
    const addButton = await commonActions.waitForVisible(
        driver,
        By.css('button[onclick="addElement()"]')
    );
    const heading = await addButton.getText();
    console.log("Add Button:", heading);

    await addButton.click();
    //#content > div > button

    //await commonActions.waitForVisible(driver, By.css('button.added-manually')).click();
    //const deleteButton = await driver.findElement(By.css('button.added-manually'));
    const hasMoreThanOne = await driver.findElements(
        By.css('#elements button.added-manually')
    );

    const totalButtons = hasMoreThanOne.length > 0;

    console.log('RAW LENGTH:', hasMoreThanOne.length);
    console.log('BOOLEAN:', totalButtons);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Add Button Added',
        totalButtons,
        true
    );
}

async function runARRemoveElement(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();

    //<button onclick="addElement()">Add Element</button>
    const addButton = await commonActions.waitForVisible(driver, By.css('button[onclick="addElement()"]'))
    //#content > div > button

    console.log('Add Button:', await addButton.getText());
    await addButton.click();

    const hasMoreThanOne = await driver.findElements(
        By.css('#elements button.added-manually')
    );
    // console.log(hasMoreThanOne)
    // const heading = await element.getText();
    // console.log("Add Button:", heading);

    // const deleteButtons = await driver.findElement(By.css('button.added-manually')).click();
    const deleteButton = await commonActions.waitForVisible(
        driver,
        By.css('button.added-manually')
    );
    console.log('Delete Button: ', await deleteButton.getText())
    await deleteButton.click();
    // await driver.findElements(
    //     By.css('#elements button.added-manually')
    // );

    // const isEmpty = deleteButtons.length === 0;

    // console.log(await deleteButtons.isDisplayed());
    const remainingButtons = await driver.findElements(
        By.css('#elements button.added-manually')
    );

    // const remainingButtons = await commonActions.waitForVisible(
    //     driver,
    //     By.css('#elements button.added-manually')
    // );
    const isEmpty = remainingButtons.length === 0;

    console.log('Container empty:', isEmpty);
    //await driver.findElement(By.css('button.added-manually')).click();
    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Delete Button Removed Test',
        isEmpty,
        true
    );
}
async function runARAddMultipleElement(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Add/Remove Elements')).click();

    //<button onclick="addElement()">Add Element</button>
    const element = await driver.findElement(By.css('button[onclick="addElement()"]')).click();

    //#content > div > button
    const heading = await element.getText();

    const addButtons = await driver.findElements(
        By.css('#elements button.added-manually')
    );
    console.log('Count:', addButtons.length);
    const hasMoreThanOne = addButtons.length > 1;
    
    console.log(hasMoreThanOne);

    console.log("Add Button:", heading);

    return commonActions.validate(
        'Add button Test',
        heading,
        'Add Element'
    );
}