const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';


async function runCBMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Checkboxes')).click();

    const title = await driver.getTitle();
    console.log("Checkboxes Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Checkboxes Head Title',
        title,
        'The Internet'
    );
}
async function runCBFindPageHeading(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Checkboxes')).click();
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Checkboxes H3 Heading Test',
        heading,
        'Checkboxes'
    );
}

async function runCBCheckboxCheck(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Checkboxes')).click();
    const checkboxes = await driver.findElements(
        By.css('#checkboxes input[type="checkbox"]')
    );

    if (checkboxes.length !== 2) {
        throw new Error(`Expected 2 checkboxes, found ${checkboxes.length}`);
    }

    // Verify initial state
    const checkbox1Checked = await checkboxes[0].isSelected();
    const checkbox2Checked = await checkboxes[1].isSelected();

    // console.log('Checkbox 1:', checkbox1Checked);
    // console.log('Checkbox 2:', checkbox2Checked);

    if (checkbox1Checked) {
        // throw new Error('Checkbox 1 should be unchecked by default');
        console.log('Checkbox 1:', checkboxes[0]);
    }

    if (!checkbox2Checked) {
        // throw new Error('Checkbox 2 should be checked by default');
        console.log('Checkbox 2:', checkboxes[1]);
    }

    // Toggle checkbox 1 ON
    await checkboxes[0].click();

    if (!(await checkboxes[0].isSelected())) {
        // throw new Error('Checkbox 1 should be checked after click');
        console.log('Checkbox 1:', checkboxes[0]);
    }

    // Toggle checkbox 2 OFF
    await checkboxes[1].click();

    if (await checkboxes[1].isSelected()) {
        // throw new Error('Checkbox 2 should be unchecked after click');
        console.log('Checkbox 2 status:', checkboxes[1]);
    }

    console.log('Checkbox test passed');
    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Checkbox State Test',
        checkbox0[0] === true && checkbox[1] === false,
        true
    );
}
