const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'File Downloader';


async function runFDMainTest(driver) {
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
async function runFDFindPageHeading(driver) {
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

async function runFDVerifyDownloadList(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const links = await driver.findElements(
        By.css('#content a')
    );

    return commonActions.validate(
        '(File Downloader) Link Count',
        links.length > 0,
        true
    );
}

async function runFDVerifyURLValid(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();

    const links = await driver.findElements(
        By.css('#content a')
    );

    let invalidLinks = 0;

    for (const link of links) {
        const fileName = await link.getText();
        const href = await link.getAttribute('href');

        try {
            const response = await fetch(href, {
                method: 'HEAD'
            });

            console.log(
                `${fileName}: ${href} -> ${response.status}`
            );

            if (
                !response.ok ||
                !href.includes('/download/')
            ) {
                invalidLinks++;
            }
        } catch (error) {
            console.log(
                `${fileName}: ${href} -> ERROR`
            );

            invalidLinks++;
        }
    }
    // test validate: (name, actual, and expected)
    return commonActions.validate(
        '(File Downloader) All Download URLs Valid',
        invalidLinks,
        0
    );
}