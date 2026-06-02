const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const commonActions = require('./support/commonActions');

const fs = require('fs');

function addSummary(text) {
    if (process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
    }
}
async function runMainTest(driver) {
    await driver.get('http://localhost:9292/');

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    if (title !== 'The Internet') {
        addSummary(`| Homepage Title |  Fail (${title}) |`);
        //throw new Error(`Expected "The Internet" but got "${title}"`);
        return {
            name: 'Homepage Title',
            status: 'Fail',
            value: title
        };
    }
    else {
        addSummary('| Homepage Title |  Pass |');
        return {
            name: 'Homepage Title',
            status: 'Pass',
            value: title
        };
    }
}
async function runFindPageHeading(driver) {
    const heading = await driver
        .findElement(By.css('h1.heading'))
        .getText();

    console.log("Heading:", heading);

    if (heading !== 'Welcome to the-internet') {
        addSummary(`| Heading Test |  Fail (${heading}) |`);
        //throw new Error(`Expected heading but got "${heading}"`);
        return { name: 'Heading Test', status: 'Fail', value: heading };
    }
    else {
        addSummary('| Heading Test |  Pass |');
        return { name: 'Heading Test', status: 'Pass', value: heading };
    }
}