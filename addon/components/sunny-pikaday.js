import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/sunny-pikaday';

const { computed } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['sunny-pikaday'],
  currentMonthName: computed('_date',function() {
    return moment(this.get('_date')).format('MMMM YYYY');
  }),
  nextMonth: computed('_date',function() {
    return this.get('_date').clone().startOf('month').add(1, 'month');
  }),
  nextMonthName: computed('nextMonth',function() {
    return moment(this.get('nextMonth')).format('MMMM YYYY');
  }),
  formatedSelectedDate: computed('date','format',function() {
    let date = this.get('date');
    return date ? moment(date).format(this.get('format')) : '';
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    let date = this.get('date');
    if (!date) {
      this.set('_date', moment());
    } else {
      this.set('_date', moment(date));
    }
  },

  actions: {
    sendDate(date) {
      this.sendAction('on-select', date);
    },
    nextMonth() {
      let date = this.get('_date');
      let nextMonth = date.clone().startOf('month').add(1, 'month');
      this.set('_date', nextMonth);
    },
    previousMonth() {
      let date = this.get('_date');
      let previousMonth = date.clone().startOf('month').subtract(1, 'month');
      this.set('_date', previousMonth);
    }
  }
});
