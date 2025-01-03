const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// const Groq = require('groq-sdk');
// const groq = new Groq({ apiKey: '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' });
// puppeteer.use(StealthPlugin());

// const randomDelay = (min, max) => {
//   const delay = Math.floor(Math.random() * (max - min) + min);
//   return new Promise((resolve) => setTimeout(resolve, delay));
// };

// async function AiQueryGenerator(query) {
//   const chatCompletion = await groq.chat.completions.create({
//     "messages": [
//       {
//         "role": "user",
//         "content": query,
//       }
//     ],
//     "model": "llama3-70b-8192",
//     "temperature": 0.7,
//     "max_tokens": 300,
//     "top_p": 1,
//     "stream": false,
//     "stop": null
//   });

//   const aiquery = chatCompletion.choices[0]?.message?.content || chatCompletion.choices[0]?.text || '';
//   if (!aiquery) {
//     return 'No content generated';
//   }

//   // Use regex to extract the query between 'startQuery' and 'endQuery'
//   const queryMatch = aiquery.match(/startQuery\n(.*?)\nendQuery/);

//   if (queryMatch && queryMatch[1]) {
//     return queryMatch[1].trim(); // Extracted query only
//   }

//   return 'No valid query found'; // In case the pattern isn't found
// }

// const datacenter = async (req, res) => {
//   const { query } = req.body;
//   console.log("query i an metting here is as here ",query)

//   if (!query) {
//     return res.status(400).json({ message: 'Query is required' });
//   }

//   try {
//     const browser = await puppeteer.launch({
//       executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/app/.apt/usr/bin/google-chrome-stable',
//       headless: true,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-blink-features=AutomationControlled',
//         '--disable-infobars',
//         '--disable-extensions',
//         '--start-maximized',
//         '--window-size=1920,1080',
//       ],
//       defaultViewport: null,
//     });

//     const page = await browser.newPage();

//     // Randomize User-Agent
//     const randomUserAgent = [
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
//     ][Math.floor(Math.random() * 3)];
//     await page.setUserAgent(randomUserAgent);
//     const prompt = `
//     These are the details provided by the user ${query} . Please carefully read and understand what the user wants to search from the google .
//     based on the details user has gieven you need to write a query which will have to most effective understand the industry he want the data tbe related also
//     understand the location.i am providing some examples so that you can understand "entertainment" "email" site : google.com "usa" "director"  "@gmail.com"
// "disney.com" "email" site : linkedin "USA" "director"
// "entertainment" "email" site : google.com "usa" "director"
// disney.com email linkedin USA director profiles

//     Please structure the response with the following format:
   
    

//     Your response should be structured as follows:

//     startquery
//     [query]
//     endQuery

//   `;
//     let aiquery=await AiQueryGenerator(prompt);
    
    

//      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(aiquery)}`;
//     await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 0 });

//     await randomDelay(1000, 3000);
//     await page.waitForSelector('.tF2Cxc', { timeout: 60000 });

//     let results = [];

//     // Loop through multiple pages to gather results
//     while (true) {
//       const pageResults = await page.evaluate(() => {
//         const results = [];
//         const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

//         document.querySelectorAll('.tF2Cxc').forEach((element) => {
//           const snippet = element.querySelector('.VwiC3b')?.innerText || '';

//           // Extract emails from the snippet text
//           const emails = snippet.match(emailRegex) || [];
//           emails.forEach(email => {
//             const domain = email.split('@')[1]; // Extract the domain after "@"
//             if (domain) {
//               results.push({
//                 email: email,
//                 url: `https://${domain}`, // Prepend "https://" to form the full domain URL
//               });
//             }
//           });
//         });

//         return results;
//       });

//       results = [...results, ...pageResults];

//       await randomDelay(2000, 5000);

//       const nextButton = await page.$('#pnnext');
//       if (!nextButton) break;

//       await Promise.all([
//         page.click('#pnnext'),
//         page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
//       ]);

//       await randomDelay(2000, 5000);
//     }

//     await browser.close();

//     // Remove duplicates by email domain
//     results = results.filter(
//       (value, index, self) =>
//         index === self.findIndex((t) => t.url === value.url)
//     );


//     res.json({ results });
//   } catch (error) {
//     console.error('Error scraping results:', error);
//     res.status(500).json({ message: 'Server error. Please try again.' });
//   }
// };
// module.exports = datacenter;


const  datacenter=async(req,res)=> {
  // Launch a browser with necessary flags for Heroku
    const { query } = req.body;
  console.log("query i an metting here is as here ",query)
  const browser = await puppeteer.launch({
    headless: true, // Puppeteer will run without a UI
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
      '--disable-extensions',
      '--start-maximized',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();

  // Visit the page
  await page.goto('https://www.w3schools.com/');

  // Extract and log all H1 elements
  const h1Texts = await page.evaluate(() => {
    const h1Elements = document.querySelectorAll('h1');
    return Array.from(h1Elements).map(h1 => h1.textContent);
  });

  // Log the H1 content
  console.log(h1Texts);

  // Close the browser
  await browser.close();
}




module.exports = datacenter;
