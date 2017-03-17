import Ember from 'ember';
import moment from 'moment';
const { computed } = Ember; 

export default Ember.Controller.extend({
  init() {
    this._super(...arguments);

    this.set('startDate', moment('01/01/2017'));
    this.set('endDate', moment('06/01/2018'));
    // this.set('date', moment('06/01/2018'));
  },

  actions: {
    changeDate(date) {
      this.set('date', date);
    }
  }
});