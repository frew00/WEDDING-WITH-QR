const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function main() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    console.log('Launching browser using:', edgePath);

    const browser = await puppeteer.launch({
        executablePath: edgePath,
        headless: true,
        protocolTimeout: 120000,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 1200, deviceScaleFactor: 2 });

    const htmlPath = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
    console.log('Navigating to:', htmlPath);
    await page.goto(htmlPath, { waitUntil: 'domcontentloaded', timeout: 0 });
    await new Promise(r => setTimeout(r, 2000));

    // Hide envelope overlay to capture full website content
    await page.evaluate(() => {
        const env = document.getElementById('envelope-overlay');
        if (env) env.style.display = 'none';
        
        // Remove animation infinite loops for crisp snapshot rendering
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    });

    // Generate clean A4 printable multi-page PDF of the website
    await page.pdf({
        path: path.resolve(__dirname, 'Wedding_Website_Design_Preview.pdf'),
        format: 'A4',
        printBackground: true,
        timeout: 0,
        margin: { top: '15px', right: '15px', bottom: '15px', left: '15px' }
    });
    console.log('Created: Wedding_Website_Design_Preview.pdf');

    await browser.close();
}

main().catch(err => {
    console.error('Error generating PDF:', err);
    process.exit(1);
});
