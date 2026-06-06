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
    console.log('VALIDATE INPUT:', actual);
    const passed = Array.isArray(expected)
        ? expected.includes(actual)
        : actual === expected;
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

    await driver.wait(
        until.elementIsVisible(element),
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
async function generateHtmlReport(results) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `reports/report-${timestamp}.html`;

    fs.mkdirSync('reports', { recursive: true });

    const rows = results.map(r => {
        const color = r.status === 'Pass' ? 'green' : 'red';

        return `
            <tr>
                <td>${r.name}</td>
                <td style="color:${color}; font-weight:bold;">
                    ${r.status}
                </td>
            </tr>
        `;
    }).join('');

    const html = `
    <html>
      <body>
        <h1>Selenium Results</h1>
        <p><strong>Run Time:</strong> ${new Date().toLocaleString()}</p>

        <table border="1" cellpadding="8">
          <tr>
            <th>Test</th>
            <th>Status</th>
          </tr>
          ${rows}
        </table>
      </body>
    </html>
    `;

    fs.writeFileSync(filename, html);

    console.log(`Report created: ${filename}`);

    return filename;
}
module.exports = {
    addSummary,
    validate,
    waitForVisible,
    createDriver,
    generateHtmlReport
};