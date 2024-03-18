import puppeteer from 'puppeteer';

const startBrowser = async () => {
  let browser; // Định nghĩa biến browser ở đây để bạn có thể trả về giá trị của nó
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.log(`lỗi ở startBrowser ${error} `);
  }
  return browser;
};
export default startBrowser;
