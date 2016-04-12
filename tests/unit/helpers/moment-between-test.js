import { momentIsBetween } from '../../../helpers/moment-between';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Helper | moment between');

// Replace this with your real tests.
test('it works', function(assert) {
  let date = moment('March 14, 2016');
  let start = moment('March 10, 2016');
  let end = moment('March 17, 2016');

  assert.ok(momentIsBetween([date, start, end]), `${date} is between ${start} and ${end}`);
  
  assert.notOk(momentIsBetween([start, date, end]), `${start} is not between ${date} and ${end}`);
});
