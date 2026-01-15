import puppeteer from 'puppeteer';

const [,, tournamentId, pdfPath] = process.argv;

if (!tournamentId || !pdfPath) {
  console.error("Usage: node generateBracketPdf.js <tournamentId> <pdfPath>");
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Go to the public bracket page
  await page.goto(`http://localhost:8000/public/tournaments/${tournamentId}/brackets`, {
    waitUntil: 'networkidle0',
  });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF generated at ${pdfPath}`);
})();
