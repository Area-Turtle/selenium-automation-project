const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const elementCount = 1

async function runBAMainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    const basicAuthLink = await driver.findElement(
        By.linkText('Basic Auth')
    );
    const href = await basicAuthLink.getAttribute('href');

    console.log("Original href:", href);

    const authUrl = href.replace(
        'https://',
        'https://admin:admin@'
    );

    await driver.get(authUrl);

    const title = await driver.getTitle();
    console.log("Basic Auth Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Basic Auth Head Title',
        title,
        'The Internet'
    );
}
