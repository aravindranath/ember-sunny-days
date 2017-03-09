import Ember from 'ember';
import moment from 'moment';
const { computed } = Ember; 

export default Ember.Controller.extend({
  init() {
    this._super(...arguments);

    // this.set('date', moment());
  },

  actions: {
    changeDate(date) {
      this.set('date', date);
    }
  }
});