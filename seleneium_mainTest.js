const { Builder, By } = require('selenium-webdriver');

const fs = require('fs');

// console.log('root files:', fs.readdirSync('.'));

const commonActions = require('./support/commonActions');
// const otherTests = require('./seleneium_tests/*')

const BASE_URL = 'http://localhost:9292/';

async function runMainTest(driver) {
    await driver.get(BASE_URL);

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Homepage Title',
        title,
        'The Internet'
    );
}
async function runFindPageHeading(driver) {
    const element = await commonActions.waitForVisible(driver, By.css('h1.heading'));
    const heading = await element.getText();

    console.log("Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Heading Test',
        heading,
        'Welcome to the-internet'
    );
}

async function runFindSubHeading(driver) {
    const element = await commonActions.waitForVisible(driver, By.css('h2'));
    const heading = await element.getText();

    console.log("Sub-Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Sub-Heading Test',
        heading,
        'Available Examples'
    );
}

async function runFindItemCount(driver) {
    const list = await commonActions.waitForVisible(driver, By.css('#content ul'));
    const items = await list.findElements(By.css('li'));

    const count = items.length;
    // for (let i = 0; i < count; i++) {
    //     console.log(`${i + 1}. ${await items[i].getText()}`);
    // }

    console.log('Count:', count);

    return commonActions.validate(
        'Available Examples Count',
        count,
        45
    );
}

async function runBIainTest(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Broken Images')).click();

    const title = await driver.getTitle();
    console.log("Broken Images Head Title:", title);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Broken Images Head Title',
        title,
        'The Internet'
    );
}
async function runBIFindPageHeading(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText('Broken Images')).click();
    const element = await commonActions.waitForVisible(driver, By.css('.example h3'));
    const heading = await element.getText();

    console.log("H3 Heading:", heading);

    // test validate: (name, actual, and expected)
    return commonActions.validate(
        'Broken Image H3 Heading Test',
        heading,
        'Broken Images'
    );
}
async function runBICombinedImageTest(driver) {
    await driver.get(BASE_URL);
    await driver.findElement(By.linkText('Broken Images')).click();

    const images = await driver.findElements(By.tagName('img'));

    let invalidImageCount = 0;

    const expectedHost = new URL(BASE_URL).hostname;

    for (const img of images) {
        const src = await img.getAttribute('src');

        let isInvalid = false;

        try {
            // 1. DOM broken check (image failed to render)
            const domBroken = await driver.executeScript(`
                return arguments[0].complete &&
                       arguments[0].naturalWidth === 0;
            `, img);

            if (domBroken) {
                isInvalid = true;
            }

            // 2. HTTP validation + redirect + status check
            const response = await fetch(src);
            const status = response.status;
            const redirected = response.redirected;
            const contentType = response.headers.get('content-type');

            if (!response.ok || status === 404) {
                isInvalid = true;
            }

            // 3. Format mismatch check
            const ext = src.split('.').pop().toLowerCase();

            if (
                (ext === 'jpg' && contentType?.includes('png')) ||
                (ext === 'png' && contentType?.includes('jpeg'))
            ) {
                isInvalid = true;
            }

            // 4. Wrong host (site relocation issue)
            const url = new URL(src, BASE_URL);
            const expected = expectedHost;

            if (url.hostname !== expected) {
                isInvalid = true;
            }

            // 5. Timeout / unreachable handling is covered by fetch failure
            if (redirected && status >= 300) {
                isInvalid = true;
            }

            console.log(`${src} -> ${isInvalid ? 'INVALID' : 'OK'}`);

            if (isInvalid) {
                invalidImageCount++;
            }

        } catch (e) {
            // Server timeout / unreachable / DNS failure
            console.log(`${src} -> ERROR / TIMEOUT`);
            invalidImageCount++;
        }
    }

    console.log('Total invalid images:', invalidImageCount);

    return commonActions.validate(
        'Invalid Image Count',
        invalidImageCount > 1,
        true
    );
}
async function runAllTests() {
    const driver = await commonActions.createDriver();
    let results = [];
    try {
        commonActions.addSummary('# Selenium Test Results');
        commonActions.addSummary('');
        commonActions.addSummary('| Test | Result |');
        commonActions.addSummary('|------|--------|');
        const tests = [
            runMainTest,
            runFindPageHeading,
            runFindSubHeading,
            runFindItemCount,
            runBIainTest,
            runBIFindPageHeading,
            runBICombinedImageTest
        ];
        for (const test of tests) {
            results.push(await test(driver));
        }
        console.log('All tests completed');
    } catch (err) {
        commonActions.addSummary('| Test Suite | Failed |');
        console.error(err);
        process.exitCode = 1;
    } finally {
        try {
            await commonActions.generateHtmlReport(results);
        } catch (reportErr) {
            console.error('Failed to generate HTML report:', reportErr);
        } try {
            if (driver) {
                await driver.quit();
            }
        } catch (quitErr) {
            console.error('Error closing driver:', quitErr);
        }
    }
}

runAllTests();

