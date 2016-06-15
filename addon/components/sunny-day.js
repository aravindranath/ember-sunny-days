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
    'is-highlighted:sunny-day--is-highlighted'
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

  'is-now': computed('date', 'now', {
    get() {
      let date = this.get('date');
      if (date) {
        return date.isSame(this.get('now'), 'day');
      }
    }
  }),

  'is-selected': computed('date', 'selection', {
    get() {
      let date = this.get('date');
      if (date) {
        return date.isSame(this.get('selection'), 'day');
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
