import Ember from 'ember';
import { HTML5_DATETIME_FORMAT } from 'ember-sunny-days/constants';

export default class SunnyDaysPageObject {
  constructor(env, prefix = '') {
    this.env = env;
    this.prefix = prefix;
    this.$ = this.env.$;
  }

  emptyCount() {
    return this.$(`${this.prefix}.sunny-day.--is-empty`).length;
  }

  notEmptyCount() {
    return this.$(`${this.prefix}.sunny-day`).not('.--is-empty').length;
  }

  disabledCount() {
    return this.$(`${this.prefix}.sunny-day.--is-disabled`).length;
  }

  notDisabledCount() {
    return this.$(`${this.prefix}.sunny-day`).not('.--is-disabled').length;
  }

  days() {
    return this.$(`${this.prefix}.sunny-day`).map(trimText).toArray();
  }

  headers() {
    return this.$(`${this.prefix}.sunny-days--nameofday`).map(trimText).toArray();
  }

  isSelected(date) {
    let datetime = date.format(HTML5_DATETIME_FORMAT);
    return this.$(`${this.prefix}.sunny-day[data-datetime="${datetime}"]`).hasClass('--is-selected');
  }

  highlighted() {
    return this.$(`${this.prefix}.--is-highlighted`).map(trimText).toArray();
  }

  selectDay(day) {
    let datetime = day.format(HTML5_DATETIME_FORMAT);
    this.$(`${this.prefix}.sunny-day[data-datetime="${datetime}"]`).click();
  }

  mouseenterDay(day) {
    let datetime = day.format(HTML5_DATETIME_FORMAT);
    this.$(`${this.prefix}.sunny-day[data-datetime="${datetime}"]`).trigger('mouseenter');
  }
}

function trimText() {
  return Ember.$(this).text().trim();
}
