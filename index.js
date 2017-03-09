/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-sunny-days',

  getCssFileName: function () {
    return this.name + '.css';
  },

  isAddon: function () {
    var keywords = this.project.pkg.keywords;
    return (keywords && keywords.indexOf('ember-addon') !== -1);
  },

  included: function (app) {
    this._super.included.apply(this, arguments);
    if (!this.isAddon()) {
      app.import('vendor/' + this.getCssFileName());
    }
  },

  isDevelopingAddon: function() {
    return true;
  }
};
