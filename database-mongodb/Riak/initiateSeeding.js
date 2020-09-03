const { handleSeeding } = require('./seed.js');
const data = require('../../unsplashData.js');
//when generating 10,000,000 records change arguments to: (10, 25, 10000, true)
//arguments map to numberOfRequests, urlsPerRequest, totalNumberOfBatches, and actuallyInsert
handleSeeding(2, 25, 10000, true, data);
