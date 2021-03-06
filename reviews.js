var jackrabbit = require('jackrabbit');
var db = require('./db');

var rabbit = jackrabbit(process.env.CLOUDAMQP_URL);
var exchange = rabbit.default();

exchange
  .queue({ name: 'reviews.get' })
  .consume(onReviewsGet);

function onReviewsGet(data, reply) {
  var reviews = db[data.id];
  var averageRating = reviews
    ? reviews.reduce(sum, 0) / reviews.length
    : undefined;

  console.log('got request for reviews:', data.id);

  reply({
    count: reviews.length,
    averageRating: averageRating
  });
}

function sum(prev, current, index, arr) {
  return prev + current.rating;
}
