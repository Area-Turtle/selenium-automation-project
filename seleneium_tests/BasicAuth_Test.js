const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';


async function runBAFindPageHeading(driver) {
    await driver.get(BASE_URL);
    //await driver.findElement(By.linkText('Basic Auth')).click();
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

    //await driver.get(authUrl);

    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Basic Auth')).click();

    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    // <div class="example">
    //<h3>Basic Auth</h3>
    const heading = await element.getText();
    
    console.log("H3 Heading:", heading);
    
    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'H3 Heading Test',
        heading,
        'Basic Auth'
    );
}
