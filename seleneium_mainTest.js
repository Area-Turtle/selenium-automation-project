const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

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

async function runFindSubHeading(driver) {
    const heading = await driver
        .findElement(By.css('h2'))
        .getText();

    console.log("Sub-Heading:", heading);
    if (heading !== 'Available Examples') {
        addSummary(`| Sub-Heading Test  |  Fail (${heading}) |`);
        //throw new Error(`Expected heading but got "${heading}"`);
        return { name: 'Sub-Heading Test', status: 'Fail', value: heading };
    }
    else {
        addSummary('| Sub-Heading Test |  Pass |');
        return { name: 'Sub-Heading Test', status: 'Pass', value: heading };
    }
}

async function runFindItemCount(driver) {
    const list = await driver.findElement(By.css('#content ul'));
    const items = await list.findElements(By.tagName('li'));

    for (let i = 0; i < items.length; i++) {
        console.log(`${i + 1}. ${await items[i].getText()}`);
    }

    if (items.length !== 44) {
        addSummary(`| Available Examples Count | Fail (${items.length}) |`);
        //throw new Error(`Expected 44 items but found ${items.length}`);
        return {
            name: 'Available Examples Count',
            status: 'Fail',
            value: items.length
        };
    }
    else {
        addSummary(`| Available Examples Count |  Pass (${items.length}) |`);
        return {
            name: 'Available Examples Count',
            status: 'Pass',
            value: items.length
        };
    }
}


async function runAllTests() {
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    let results = [];
    let rows = '';

    try {
        addSummary('# Selenium Test Results');
        addSummary('');
        addSummary('| Test | Result |');
        addSummary('|------|--------|');

        results.push(await runMainTest(driver));
        results.push(await runFindPageHeading(driver));
        results.push(await runFindSubHeading(driver));
        results.push(await runFindItemCount(driver));

        rows = results.map(r => {
            const color = r.status === 'Pass' ? 'green' : 'red';

            return `
                <tr>
                    <td>${r.name}</td>
                    <td style="color:${color}; font-weight:bold;">
                        ${r.status}
                    </td>
                    <td>${r.value}</td>
                </tr>
            `;
        }).join('');

        console.log('✓ All tests completed');

    } catch (err) {
        addSummary('| Test Suite | Failed |');
        console.error(err);
        process.exitCode = 1;

    } finally {
        fs.mkdirSync('reports', { recursive: true });

        fs.writeFileSync(
            'reports/report.html',
            `
            <html>
              <body>
                <h1>Selenium Results</h1>
                <table border="1" cellpadding="8">
                  <tr>
                    <th>Test</th>
                    <th>Status</th>
                    <th>Value</th>
                  </tr>
                  ${rows}
                </table>
              </body>
            </html>
            `
        );

        await driver.quit();
    }
}

runAllTests();

