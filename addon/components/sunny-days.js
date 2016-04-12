import Ember from 'ember';
import layout from '../templates/components/sunny-days';
import moment from 'moment';
import _range from 'lodash/utility/range';

const { computed } = Ember;
const DAY_COUNT = 42;

const DaySelector = Ember.Component.extend({
  layout,
  classNames: 'sunny-days',

  didReceiveAttrs() {
    this._super(...arguments);
    let date = this.get('date');
    this.set('_date', date || moment());
  },

  days: computed('_date', function() {
    let dateStart = moment(this.get('_date')).startOf('month');
    let dayOfWeek = dateStart.day();
    let dayRange = _range((-1)*dayOfWeek, DAY_COUNT - dayOfWeek);
    return dayRange.map(d => dateStart.clone().add(d, 'days'));
  }),

  actions: {
    selectDay(day) {
      this.sendAction('on-select', day);
    }
  }
});

DaySelector.reopenClass({
  positionalParams: ['date']
});

export default DaySelector;
