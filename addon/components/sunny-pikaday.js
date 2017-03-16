import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/sunny-pikaday';
import _range from 'lodash/utility/range';
import { 
  EKMixin,
  keyUp, 
  keyDown 
} from 'ember-keyboard';

const { computed } = Ember;

const DEFAULT_FORMAT = 'DD/MM/YYYY';

export default Ember.Component.extend(EKMixin, {
  layout,
  classNames: ['sunny-pikaday'],

  horizontalPosition: 'auto',
  verticalPosition: 'below',
  interval: 'month',

  _date: computed(function() {
    return moment();
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    let date = this.get('date');
    let _date = this.get('_date');

    if (date && !date.isSame(_date)) {
      this.setDate(date);
    }
  },

  setDate(date) {
    let format = this.get('format');
    let _date, value;
    if (moment.isMoment(date)) {
      _date = date.clone();
      if (format) {
        value = date.format(format);
      }
    } else {
      if (format) {
        _date = moment(date, format);
        value = date;
      } else {
        _date = moment(date);
        value = _date.format(DEFAULT_FORMAT);
      }
    }
    if (value) {
      this.set('value', value);
    }
    this.set('_date', _date);
  },

  keyboardActivated: computed.readOnly('isOpen'),

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

  _theDayBeforeToday: Ember.on(keyUp('ArrowLeft'), function(event) {
    let date = this.get('_date');
    if(this.get('interval') === 'month') {
      let theDayBefore = date.clone().subtract(1, 'day');
      this.set('_date', theDayBefore);
    } else if(this.get('interval') === 'year') {
      let theMonthBefore = date.clone().startOf('month').subtract(1, 'month');
      this.set('_date', theMonthBefore);
    } else if(this.get('interval') === 'decade') {
      let theYearBefore = date.clone().startOf('year').subtract(1, 'year');
      this.set('_date', theYearBefore);
    }
  }),

  _theDayAfterToday: Ember.on(keyUp('ArrowRight'), function(event) {
    let date = this.get('_date');
    if(this.get('interval') === 'month') {
      let theDayAfter = date.clone().add(1, 'day');
      this.set('_date', theDayAfter);
    } else if(this.get('interval') === 'year') {
      let theMonthAfter = date.clone().startOf('month').add(1, 'month');
      this.set('_date', theMonthAfter);
    } else if(this.get('interval') === 'decade') {
      let theYearAfter = date.clone().startOf('year').add(1, 'year');
      this.set('_date', theYearAfter);
    }
  }),

  _selectDate: Ember.on(keyUp('Enter'), function(event) {
    let date = this.get('_date');
    if(this.get('interval') === 'month') {
      this.set('date', date);
    } else if(this.get('interval') === 'year') {
      this.set('interval', 'month');
    } else if(this.get('interval') === 'decade') {
      this.set('interval', 'year');
    }
  }),

  _theDayAboveToday: Ember.on(keyUp('ArrowUp'), function(event) {
    let date = this.get('_date');
    if(this.get('interval') === 'month') {
      let theDayAbove = date.clone().subtract(7, 'day');
      this.set('_date', theDayAbove);
    } else if(this.get('interval') === 'year') {
      let theMonthAbove = date.clone().startOf('month').subtract(3, 'month');
      this.set('_date', theMonthAbove);
    } else if(this.get('interval') === 'decade') {
      let theYearAbove = date.clone().startOf('year').subtract(3, 'year');
      this.set('_date', theYearAbove);
    }
  }),

  _theDayBelowToday: Ember.on(keyUp('ArrowDown'), function(event) {
    let date = this.get('_date');
    if(this.get('interval') === 'month') {
      let theDayBelow = date.clone().add(7, 'day');
      this.set('_date', theDayBelow);
    } else if(this.get('interval') === 'year') {
      let theMonthBelow = date.clone().startOf('month').add(3, 'month');
      this.set('_date', theMonthBelow);
    } else if(this.get('interval') === 'decade') {
      let theYearBelow = date.clone().startOf('year').add(3, 'year');
      this.set('_date', theYearBelow);
    }
  }),

  actions: {
    updateInput(value) {
      this.set('value', value);
      let date = moment(value, this.get('format'), true);
      if(date.isValid()) {
        this.set('_date', date);
      }
    },
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
        let nextDecade = date.clone().startOf('year').add(10, 'year');
        this.set('_date', nextDecade);
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
        let previousDecade = date.clone().startOf('year').subtract(10, 'year');
        this.set('_date', previousDecade);
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
    },
    onOpen() {
      this.set('isOpen', true);
    },
    onClose() {
      this.set('isOpen', false);
    }
  }
});
