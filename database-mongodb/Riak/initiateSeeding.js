const { handleSeeding } = require('./seed.js');
const data = require('../../unsplashData.js');
//when generating 10,000,000 records change arguments to: (10, 25, 10000, true)
//arguments map to numberOfRequests, urlsPerRequest, totalNumberOfBatches, and actuallyInsert
for (let i = 0; i < 10000; i++) {
  setTimeout(handleSeeding.bind(this, 10, 25, 1, true, data, i), 1500 * i);
}
