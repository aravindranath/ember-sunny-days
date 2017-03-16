import Ember from 'ember';
import layout from '../templates/components/sunny-day';
import moment from 'moment';
import { HTML5_DATETIME_FORMAT } from '../constants';

const { computed } = Ember;

const SunnyDay = Ember.Component.extend({
  layout,

  attributeBindings: ['data-datetime'],
  classNames: ['sunny-day'],
  classNameBindings: [
    'is-selected:sunny-day--is-selected',
    'is-disabled:sunny-day--is-disabled',
    'is-now:sunny-day--is-now',
    'is-empty:sunny-day--is-empty',
    'is-highlighted:sunny-day--is-highlighted',
    'is-focused:sunny-day--is-focused',
    'is-weekend:sunny-day--is-weekend'
  ],

  format: 'D',

  now: computed(function(){
    return moment();
  }),

  'data-datetime': computed('date', {
    get() {
      let date = this.get('date');
      if (date) {
        return date.format(HTML5_DATETIME_FORMAT);
      }
    }
  }),

  'is-now': computed('date', 'now', 'is-empty', {
    get() {
      if (this.get('is-empty')) {
        return false;
      }
      let date = this.get('date');
      if (date) {
        return date.isSame(this.get('now'), 'day');
      }
    }
  }),

  'is-selected': computed('date', 'selection', 'is-empty', {
    get() {
      if (this.get('is-empty')) {
        return false;
      }
      let date = this.get('date');
      if (date) {
        return date.isSame(this.get('selection'), 'day');
      }
    }
  }),

  'is-focused': computed('date', {
    get() {
      if (this.get('is-empty')) {
        return false;
      }
      let date = this.get('date');
      if (date) {
        return true;
      }
    }
  }),

  'is-weekend': computed('date', {
    get() {
      if (this.get('is-empty')) {
        return false;
      }
      let date = this.get('date');
      if ((moment(date).isoWeekday() === 6) || (moment(date).isoWeekday() === 7)) {
        return true;
      }
    }
  }),

  click() {
    this.sendAction('on-select', this.get('date'));
  }
});

SunnyDay.reopenClass({
  positionalParams: ['date']
});

export default SunnyDay;
