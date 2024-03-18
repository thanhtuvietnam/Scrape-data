import startBrowser from './src/browser.js';
import scrapeController from './src/scrapeController.js';

const runScraping = async () => {
  try {
    let browser = startBrowser();
    scrapeController(browser);
  } catch (error) {
    console.log(`lỗi ở mainjs ${error} `);
  }
};
runScraping()