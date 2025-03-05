import { chromium } from "playwright"
import { test, expect } from '@playwright/test';

  test.describe("Hacker News", () => {
        test("articles are sorted newest to oldest", async () => {
            // initial setup
            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto("https://news.ycombinator.com/newest");

            // number of articles to test. Using a declared constant allows for easy adjustment
            const numToTest = 100;

            // loop variables
            let numTested = 0;
            let prevTime = null;

            while (numTested < numToTest) {
                // get all span elements from the page with the class name "age"
                const timeList = await page.$$('span.age');

                for (let i = 0; i < timeList.length && numTested < numToTest; i++) {
                    // read the string for the time and convert it to an integer
                    const time = await timeList[i].innerText();
                    const timeInt = convertTime(time);

                    // confirm the current time is greater than the previous time, meaning it was posted before the last one
                    if (prevTime !== null) {
                        await expect(timeInt).toBeGreaterThanOrEqual(prevTime);
                    }

                    // update loop variables
                    prevTime = timeInt;
                    numTested++;
                }

                // if we need to do more tests, and there are no articles left on this page, move to the next page
                if (numTested < numToTest) {
                    const nextPageBut = await page.$('a.morelink');
                    await nextPageBut.click();
                }
            }
        });
      test("each page has 30 articles", async () => {
          // initial setup
          const browser = await chromium.launch({ headless: false });
          const context = await browser.newContext();
          const page = await context.newPage();
          await page.goto("https://news.ycombinator.com/newest");

          // number of pages to test. Using a declared constant allows for easy adjustment
          const numToTest = 10;

          // loop variables
          let numPagesTested = 0;

          while (numPagesTested < numToTest) {
              // get and make a list of all article entries on the page (tr elements with the class name "athing")
              const itemList = await page.$$('tr.athing');
              const numItems = itemList.length;
              // are there 30 items in the list?
              await expect(numItems).toBe(30);

              //update loop variables
              numPagesTested++;

              // go to the next page
              if (numPagesTested < numToTest) {
                  const nextPageBut = await page.$('a.morelink');
                  await nextPageBut.click();
              }
          };
      });
  });

// function for converting the time string to a minutes integer (minutes used because the lowest the website displays is "0 minutes ago")
function convertTime(time) {
    const timeSplit = time.split(" ");
    let num = parseInt(timeSplit[0], 10);
    const unit = timeSplit[1].toLowerCase();
    if (unit.startsWith('minute')) {
        return num;
    } else if (unit.startsWith('hour')) {
        return num * 60;
    }
    else if (unit.startsWith('day')) {
        return num * 60 * 24;
    }
    // fallback: return the number from the string
    console.log("Failed to convert: ", time);
    return num;
}