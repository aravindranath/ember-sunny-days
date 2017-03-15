import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/sunny-pikaday';
import _range from 'lodash/utility/range';

const { computed } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['sunny-pikaday'],

  horizontalPosition: 'auto',
  verticalPosition: 'below',
  interval: 'month',

  currentMonthName: computed('_date', function() {
    return moment(this.get('_date')).format('MMMM YYYY');
  }),
  currentYear: computed('_date', function() {
    return moment(this.get('_date')).format('YYYY');
  }),
  currentDecade: computed('_date', function() {
    let year = moment(this.get('_date')).year();
    let firstYear = year - (year % 10) - 1;
    let beginningOfDecade = moment(firstYear, 'YYYY');
    let decade = _range(12).map(y => beginningOfDecade.clone().add(y, 'year'));
    let endOfDecade = decade[decade.length - 1];
    return `${moment(beginningOfDecade).format('YYYY')}-${moment(endOfDecade).format('YYYY')}`;
  }),
  nextMonth: computed('_date', function() {
    return this.get('_date').clone().startOf('month').add(1, 'month');
  }),
  nextMonthName: computed('nextMonth', function() {
    return moment(this.get('nextMonth')).format('MMMM YYYY');
  }),
  formatedSelectedDate: computed('date','format', function() {
    let date = this.get('date');
    return date ? moment(date).format(this.get('format')) : '';
  }),
  disablePreviousMonthNavigation: computed('_date', function() {
    if((moment(this.get('_date')).isAfter(this.get('startDate'))) || (!this.get('startDate'))) {
      return true;
    }
  }),
  disableNextMonthNavigation: computed('_date', function() {
    if((moment(this.get('_date')).isBefore(this.get('endDate'))) || (!this.get('endDate'))) {
      return true;
    }
  }),
  months: computed('_date', function() {
    let year = moment(this.get('_date')).year();
    // ensures that we start with the correct month in the correct year
    let january = new moment().year(year).month(0).startOf('month');
    return _range(12).map(m => january.clone().add(m, 'months'));
  }),
  years: computed('_date', function() {
    let year = moment(this.get('_date')).year();
    let firstYear = year - (year % 10) - 1;
    let beginningOfDecade = moment(firstYear, 'YYYY');
    return _range(12).map(y => beginningOfDecade.clone().add(y, 'year'));
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
    next() {
      let date = this.get('_date');
      if(this.get('interval') === 'month') {
        let nextMonth = date.clone().startOf('month').add(1, 'month');
        this.set('_date', nextMonth);
      } else if(this.get('interval') === 'year') {
        let nextYear = date.clone().startOf('year').add(1, 'year');
        this.set('_date', nextYear);
      } else if(this.get('interval') === 'decade') {
        let nextYear = date.clone().startOf('year').add(10, 'year');
        this.set('_date', nextYear);
      }
    },
    previous() {
      let date = this.get('_date');
      if(this.get('interval') === 'month') {
        let previousMonth = date.clone().startOf('month').subtract(1, 'month');
        this.set('_date', previousMonth);
      } else if(this.get('interval') === 'year') {
        let previousYear = date.clone().startOf('year').subtract(1, 'year');
        this.set('_date', previousYear);
      } else if(this.get('interval') === 'decade') {
        let previousYear = date.clone().startOf('year').subtract(10, 'year');
        this.set('_date', previousYear);
      }
    },
    zoomIn(zoomInTo) {
      this.set('interval', zoomInTo);
    },
    zoomOut(zoomOutTo, date) {
      if(this.get('startDate') || this.get('endDate')) {
        if((date.isBefore(this.get('startDate'))) || (date.isAfter(this.get('endDate')))) {
          return false;
        } else {
          this.set('_date', date);
          this.set('interval', zoomOutTo);
        }
      } else {
        this.set('_date', date);
        this.set('interval', zoomOutTo);
      }
    }
  }
});
