import Ember from 'ember';

export function momentIsBetween([date, start, end]/*, hash*/) {
  if (!date) {
    return;
  }
  return date.isBetween(start, end);
}

export default Ember.Helper.helper(momentIsBetween);
