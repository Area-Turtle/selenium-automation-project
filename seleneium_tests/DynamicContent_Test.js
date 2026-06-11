const { Builder, By } = require('selenium-webdriver');
const commonActions = require('../support/commonActions');
const BASE_URL = 'http://localhost:9292/';
const pageTopic = 'Dynamic Content';


async function runDCMainTest(driver) {
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
async function runDCFindPageHeading(driver) {
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
async function runDCFindDynamicImage(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    const contentBlocks = await driver.findElements(
        By.css('#content .row')
    );
    console.log(`Found ${contentBlocks.length} content blocks`);

    const images = await driver.findElements(
        By.css('#content .row img')
    );

    let invalidImageCount = 0;
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
                console.log(`${src} responce not okay and status 400`);
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
                console.log(`${src} urlhost not expected`);
            }

            // 5. Timeout / unreachable handling is covered by fetch failure
            if (redirected && status >= 300) {
                isInvalid = true;
                console.log(`${src} redirected with status greater then 300`);
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
        invalidImageCount,
        0
    );
}

async function runDCFindDynamicText(driver) {
    await driver.get(BASE_URL);
    // <a href="/add_remove_elements/">Add/Remove Elements</a>
    await driver.findElement(By.linkText(pageTopic)).click();
    const contentBlocks = await driver.findElements(
        By.css('#content .row')
    );

    console.log(`Found ${contentBlocks.length} content blocks`);

    const paragraphs = await driver.findElements(
        By.css('#content .row .large-10')
    );

    let validParagraphs = 0;

    for (const p of paragraphs) {
        const text = await p.getText();

        if (text.trim()) {
            validParagraphs++;
        }
    }

    return commonActions.validate(
        `${pageTopic} Dynamic Text Test`,
        validParagraphs,
        paragraphs.length
    );
}