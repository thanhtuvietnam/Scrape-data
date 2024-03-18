export const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log('>>Mở tab mới...');
      await page.setViewport({
        width: 960,
        height: 930,
        deviceScaleFactor: 1,
      });
      console.log(`>>set view port`);
      await page.goto(url);
      console.log('Truy cập vào...' + url);
      await page.waitForSelector('#webpage');
      console.log('>>Website đã load xong');
      // ! Lấy data
      const dataCategory = await page.$$eval('#navbar-menu>ul>li', (elements) => {
        dataCategory = elements.map((element) => {
          return {
            category: element.querySelector('a').innerText,
            link: element.querySelector('a').href,
          };
        });
        console.log(elements);
        return dataCategory;
      });
      // console.log(dataCategory);

      await page.close();
      console.log(`>>tab đã đóng`);
      resolve(dataCategory);
    } catch (error) {
      console.log(`lỗi ở scrape category ${error} `);
      reject(error);
    }
  });

export const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();
      console.log('>>Đã mở tab mới...');
      await newPage.setViewport({
        width: 960,
        height: 930,
        deviceScaleFactor: 1,
      });
      console.log(`>>set view port cho newPage`);
      await newPage.goto(url);
      console.log('>>Đã truy cập vào trang' + url);
      await newPage.waitForSelector('#main');
      console.log('>>Đã load xong tab main...');

      const scrapeData = {};

      //lấy header
      const headerData = await newPage.$eval('header', (el) => {
        return {
          title: el.querySelector('h1').innerText,
          description: el.querySelector('p').innerText,
        };
      });
      scrapeData.header = headerData;
      //lấy links detail item
      const detailLinks = await newPage.$$eval('#left-col> section.section-post-listing ul>li', (els) => {
        detailLinks = els.map((el) => {
          return el.querySelector('.post-meta>h3>a').href;
        });
        return detailLinks;
      });

      // console.log(detailLinks);
      const scraperDetail = async (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            console.log('>>Đã mở tab mới...');
            await pageDetail.setViewport({
              width: 960,
              height: 930,
              deviceScaleFactor: 1,
            });
            console.log(`>>set view port cho pageDetail`);

            await pageDetail.goto(link);
            console.log('>>Truy cập' + link);
            await pageDetail.waitForSelector('#main');

            //!Cào data về
            const detailData = {};
            //?lấy ảnh
            const images = await pageDetail.$$eval('#left-col>article>div.post-images>div.images-swiper-container> div.swiper-wrapper>div.swiper-slide', (els) => {
              images = els.map((el) => {
                return el.querySelector('img')?.src;
              });
              return images.filter((i) => !i === false);
            });
            detailData.images = images;
            // console.log(images);

            //!Lấy header detail
            const header = await pageDetail.$eval('header.page-header', (el) => {
              return {
                title: el.querySelector('h1>a').innerText,
                star: el.querySelector('h1>span')?.className?.replace(/^\D+/g, ''),
                class: {
                  content: el.querySelector('p').innerText,
                  classType: el.querySelector('p>a>strong').innerText,
                },
                address: el.querySelector('address').innerText,
                attributes: {
                  price: el.querySelector('div.post-attributes>.price>span').innerText,
                  acreage: el.querySelector('div.post-attributes>.acreage>span').innerText,
                  published: el.querySelector('div.post-attributes>.published>span').innerText,
                  hashtag: el.querySelector('div.post-attributes>.hashtag>span').innerText,
                },
              };
            });

            detailData.header = header;
            // console.log(header);
            //!lấy thông tin mô tả

            const mainContentHeader = await pageDetail.$eval('#left-col>article.the-post>section.post-main-content', (el) => el.querySelector('div.section-header > h2').innerText);

            const mainContentContent = await pageDetail.$$eval('#left-col>article.the-post>section.post-main-content>div.section-content>p', (els) => els.map((el) => el.innerText));

            detailData.mainContent = {
              header: mainContentHeader,
              content: mainContentContent,
            };
            // console.log(detailData.mainContent);
            //! lấy Đặc điểm tin đăng
            const overviewHeader = await pageDetail.$eval('#left-col>article.the-post>section.post-overview>div.section-header>h3', (el) => el.innerText);
            const overviewContentContent = await pageDetail.$$eval('#left-col>article.the-post>section.post-overview>div.section-content>table.table>tbody>tr', (els) => {
              return els.map((el) => {
                return {
                  name: el.querySelector('td:first-child').innerText,
                  content: el.querySelector('td:last-child').innerText,
                };
              });
            });

            detailData.overviewMain = {
              header: overviewHeader,
              content: overviewContentContent,
            };
            // console.log(detailData.overviewMain);

            //! lấy Thông tin liên hệ
            const contactHeader = await pageDetail.$eval('#left-col>article.the-post>section.post-contact>div.section-header>h3', (el) => el.innerText);
            const contactContent = await pageDetail.$$eval('#left-col>article.the-post>section.post-contact>div.section-content>table.table>tbody>tr', (els) => {
              return els.map((el) => {
                return {
                  name: el.querySelector('td:first-child').innerText,
                  content: el.querySelector('td:last-child').innerText,
                };
              });
            });

            detailData.contactMain = {
              header: contactHeader,
              content: contactContent,
            };
            // console.log(detailData.contactMain);

            await pageDetail.close();
            resolve(detailData);
          } catch (error) {
            console.log('Lấy data detail lỗi' + error);
            reject(error);
          }
        });

      const details = [];
      for (let link of detailLinks) {
        const detail = await scraperDetail(link);
        details.push(detail);
      }

      scrapeData.body = details;

      console.log('>>Trình duyệt đã đóng...');
      resolve(scrapeData);
    } catch (error) {
      reject(error);
    }
  });
