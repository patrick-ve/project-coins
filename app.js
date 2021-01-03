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
                .then((coinCollections) => {
                    let entryNumber = +url.substr(url.lastIndexOf('/') + 1)
                    let coinEntry = {}

                    let materialMap = {}
                    let reignMap = {}
                    let mintMap = {}
                    let denominationMap = {}

                    for (let coinCollection of coinCollections) {
                        coinCollection.material in materialMap 
                            ? materialMap[coinCollection.material] = materialMap[coinCollection.material] + 1 
                            : materialMap[coinCollection.material] = 1 

                        coinCollection.person in reignMap
                            ? reignMap[coinCollection.person] = reignMap[coinCollection.person] + 1 
                            : reignMap[coinCollection.person] = 1 

                        coinCollection.mint in mintMap 
                            ? mintMap[coinCollection.mint] = mintMap[coinCollection.mint] + 1 
                            : mintMap[coinCollection.mint] = 1 

                        coinCollection.denomination in denominationMap
                            ? denominationMap[coinCollection.denomination] = denominationMap[coinCollection.denomination] + 1 
                            : denominationMap[coinCollection.denomination] = 1 
                    }

                    let materialArray = []
                    let reignArray = []
                    let mintArray = []
                    let denominationArray = []

                    Object.keys(materialMap).forEach(key => {
                        materialArray.push({
                            key,
                            count: materialMap[key]
                        })
                    })

                    Object.keys(reignMap).forEach(key => {
                        reignArray.push({
                            key,
                            count: reignMap[key]
                        })
                    })

                    Object.keys(mintMap).forEach(key => {
                        mintArray.push({
                            key,
                            count: mintMap[key]
                        })
                    })

                    Object.keys(denominationMap).forEach(key => {
                        denominationArray.push({
                            key,
                            count: denominationMap[key]
                        })
                    })

                    coinEntry.id = entryNumber
                    coinEntry.totalCoins = coinCollections.length
                    coinEntry.reign = reignArray
                    coinEntry.mint = mintArray
                    coinEntry.denomination = denominationArray
                    coinEntry.material = materialArray
                    console.log(coinEntry)
                })
                .catch(() => {
                    return 
                })
        } catch (err) {
            console.error(err)
        }
        
    });

    for (number = 10000; number < 10005; number++) {
        const stringifiedNumber = '' + number
        const url = `https://chre.ashmus.ox.ac.uk/hoard/${stringifiedNumber}`
        cluster.queue(url)
    }

    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
})();



// https://stackoverflow.com/questions/51317742/finding-the-frequency-of-a-key-value-pair-in-an-object-in-javascript
// https://stackoverflow.com/questions/38000705/counting-instances-of-key-value-pairs-in-json-file-in-javascript