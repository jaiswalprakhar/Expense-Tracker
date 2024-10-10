const puppeteer = require('puppeteer');

// Function to generate a PDF using PDFKit from the generated HTML-like structure-
const generatePDF = async (htmlContent) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF from the page content
    const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });

    // Close Puppeteer browser
    await browser.close();

    return pdfBuffer;
}

module.exports = { generatePDF };