if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}
const csv = require('d3-fetch').csv;

const number = '10020'
const url = `https://chre.ashmus.ox.ac.uk/hoard/${number}/csv/coins`


csv(url)
    .then((data) => {
        console.log(data)
    })


// 1. Setup puppeteer-cluster
// 2. Feed URLs to cluster.queue()
// 3. Determine if URL has a valid CSV to parse
// 4. Fetch data as CSV
//      - Use D3.csv to fetch and parse CSV
// 5. Extract contents from CSV:
//      - Create unique ID, based on n-value from for-loop
//      - Count total number of coins
//      - Count reign from emperors
//      - Count mint from region
//      - Count demonination for currency
//      - Count material
// 6. Add content from step 2 to JSON
//      - Use fs.writeFile to write JSON
//      - Use JSON.stringify() to convert JavaScript object to JSON