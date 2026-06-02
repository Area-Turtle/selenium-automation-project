const { By, until, Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const fs = require('fs');


function addSummary(text) {
    if (process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(
            process.env.GITHUB_STEP_SUMMARY,
            text + '\n'
        );
    }
}

function validate(name, actual, expected) {
    const passed = actual === expected;

    addSummary(
        `| ${name} | ${expected} | ${actual} | ${passed ? 'Pass' : 'Fail'} |`
    );

    return {
        name,
        status: passed ? 'Pass' : 'Fail',
        expected,
        actual
    };
}

async function waitForVisible(driver, locator, timeout = 10000) {
    const element = await driver.wait(
        until.elementLocated(locator),
        timeout
    );

    return element;
}
async function createDriver() {
    let options = new chrome.Options();

    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    return await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
}

module.exports = {
    addSummary,
    validate,
    waitForVisible,
    createDriver
};