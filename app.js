// Dependencies
require('dotenv').config()

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}
const csv = require('d3-fetch').csv;
const { Cluster } = require('puppeteer-cluster');

// Credentials and DOM selectors
// const username = process.env.LOGIN_USER
// const password = process.env.LOGIN_PASSWORD

(async () => {
    // Create a cluster with 2 workers
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });
    
    // Define a task (in this case: fetch and parse CSV)
    await cluster.task(async ({ page, data: url }) => {
        try {
            const csvFileURI = url + '/csv/coins';
            
            csv(csvFileURI)
                .then((coinCollection) => {
                    console.info(coinCollection[0])
                })
                .catch(() => {
                    return 
                })
        } catch (err) {
            console.error(err)
        }
        
    });

    for (number = 10000; number < 10002; number++) {
        const stringifiedNumber = '' + number
        const url = `https://chre.ashmus.ox.ac.uk/hoard/${stringifiedNumber}`
        cluster.queue(url)
    }
    
    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
})();