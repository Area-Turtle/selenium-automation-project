const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'File Uploader';


async function runFUMainTest(driver) {
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
async function runFUFindPageHeading(driver) {
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

async function runFUUploadButtons(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    const uploadInput = await driver.findElement(
        By.id('file-upload')
    );

    const uploadButton = await driver.findElement(
        By.id('file-submit')
    );

    return commonActions.validate(
        '(File Uploader) Controls Exist',
        !!uploadInput && !!uploadButton,
        true
    );
}

async function runFUUploadTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    await driver.findElement(
        By.id('file-upload')
    ).sendKeys(filePath);

    const selectedFile = await driver.findElement(
        By.id('file-upload')
    ).getAttribute('value');

    console.log(selectedFile);
    return commonActions.validate(
        '(File Uploader) File Selected',
        selectedFile.includes('sample.txt'),
        true
    );
}