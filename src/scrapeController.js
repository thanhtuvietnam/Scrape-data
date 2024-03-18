import { scrapeCategory, scraper } from './scraper.js';
import fs from 'fs';

const scrapeController = async (browserInstance) => {
  const url = 'https://phongtro123.com/';
  const indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;

    const categories = await scrapeCategory(browser, url);
    const selectedCategories = categories.filter((category, index) => {
      return indexs.some((i) => i === index);
    });
    let result1 = await scraper(browser, selectedCategories[0].link);
    fs.writeFile('chothuephongtro.json', JSON.stringify(result1), (err) => {
      if (err) console.log('ghi data vào file json lỗi ...' + err);
      console.log('thêm data thành công ...');
    });
    let result2 = await scraper(browser, selectedCategories[1].link);
    fs.writeFile('nhachothue.json', JSON.stringify(result2), (err) => {
      if (err) console.log('ghi data vào file json lỗi ...' + err);
      console.log('thêm data thành công ...');
    });
    let result3 = await scraper(browser, selectedCategories[2].link);
    fs.writeFile('chothuecanho.json', JSON.stringify(result3), (err) => {
      if (err) console.log('ghi data vào file json lỗi ...' + err);
      console.log('thêm data thành công ...');
    });
    let result4 = await scraper(browser, selectedCategories[3].link);
    fs.writeFile('matbangvanphong.json', JSON.stringify(result4), (err) => {
      if (err) console.log('ghi data vào file json lỗi ...' + err);
      console.log('thêm data thành công ...');
    });
    await browser.close();

    // console.log(selectedCategories);
  } catch (e) {
    console.log(`lỗi ở scrapeController ${e} `);
  }
};
export default scrapeController;
