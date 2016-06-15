import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import SunnyDaysPageObject from 'dummy/tests/helpers/sunny-days.page-object';
import Ember from 'ember';

moduleForComponent('sunny-days', 'Integration | Component | sunny days', {
  integration: true,
  beforeEach() {
    this.set('month', moment('August 2015'));
    this.component = new SunnyDaysPageObject(this);
  }
});

test('should render without month passed in', function (assert) {

  this.render(hbs`{{sunny-days}}`);
  assert.ok(this.$(), 'something is rendered');
});

test('should default to now when null is passed in as month', function (assert){

  this.render(hbs`{{sunny-days null}}`);

  assert.ok(this.$(), 'something is rendered');
});

test('should allow selection to be null', function(assert){

  this.set('date', undefined);
  this.set('selection', undefined);
  this.render(hbs`{{sunny-days date selection=selection}}`);

  assert.ok(this.component.notEmptyCount() > 27, 'should render atleast 27 days');
});

test('default behavior', function(assert) {
  this.render(hbs`{{sunny-days month}}`);

  assert.equal(this.component.notEmptyCount(), 31, 'Number of days in August 2015');
  assert.equal(this.component.emptyCount(), 11, 'The number of empty slots is 42 - 31');
  assert.deepEqual(this.component.days(), [
     '',    '',   '',   '',   '',  '',   '1',
    '2',   '3',  '4',  '5',  '6',  '7',  '8',
    '9',  '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22',
    '23', '24', '25', '26', '27', '28', '29',
    '30',  '31', '',   '',    '',   '',  ''
  ], 'August 2015 calendar renders properly');
  assert.deepEqual(this.component.headers(), 	[
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ], 'headers are present');
});

test('yields days as block parameter', function(assert) {
  this.render(hbs`
    {{#sunny-days month as |day|}}
      {{sunny-day day
        is-disabled=(not (moment-same month day 'month'))
      }}
    {{/sunny-days}}
  `);

  assert.equal(this.component.notDisabledCount(), 31, 'Number of days in August 2015');
  assert.equal(this.component.emptyCount(), 0, 'There are zero empty slots');
  assert.equal(this.component.disabledCount(), 11, 'There are 11 deactivated slots');
  assert.deepEqual(this.component.days(), [
    '26',  '27', '28', '29', '30',  '31', '1',
    '2',   '3',  '4',  '5',  '6',  '7',  '8',
    '9',  '10', '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20', '21', '22',
    '23', '24', '25', '26', '27', '28', '29',
    '30',  '31', '1',  '2',  '3',  '4',  '5'
  ], 'August 2015 calendar renders properly');
  assert.deepEqual(this.component.headers(), 	[
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ], 'headers are present');
});

test('on-select action', function(assert) {
  const DAY = moment('August 18, 2015');
  let selectedDay;

  this.on('selectDay', function(day) {
    selectedDay = day;
    this.set('selection', day);
  });

  this.render(hbs`{{sunny-days month selection=selection on-select=(action 'selectDay')}}`);
  this.component.selectDay(DAY);
  assert.equal(selectedDay.format('YYYY-MM-DD'), '2015-08-18', 'day has been selected');
  assert.ok(this.component.isSelected(DAY), 'element has selected class');
});

test('it should accept a selection date attribute', function(assert){

  let date = moment('March 14, 2016');

  this.set('date', date);
  this.render(hbs`{{sunny-days date selection=date}}`);

  assert.ok(this.$('.sunny-day--is-selected:contains(14)').length, '14th is selected');

});

test('it should accept start and end arguments', function(assert){

  let date = moment('March 14, 2016');
  let start = moment('March 10, 2016');
  let end = moment('March 17, 2016');

  this.set('date', date);
  this.set('start', start);
  this.set('end', end);

  this.render(hbs`
    {{#sunny-days date start=start end=end as |day|}}
      {{sunny-day day
        is-selected=(moment-same selection day 'day')
        is-highlighted=(or (moment-between day start end) (moment-same day start) (moment-same day end))
      }}
    {{/sunny-days}}
  `);

  assert.equal(this.$('.sunny-day--is-highlighted').length, 8, '8 days are highlighted');
  assert.deepEqual(this.component.highlighted(), [ '10', '11', '12', '13', '14', '15', '16', '17' ], 'highlighted days');
});

test('it should highlight elements with default layout', function(assert){

  let date = moment('March 14, 2016');
  let start = moment('March 10, 2016');
  let end = moment('March 17, 2016');

  this.set('date', date);
  this.set('start', start);
  this.set('end', end);

  this.render(hbs`{{sunny-days date start=start end=end}}`);

  assert.equal(this.$('.sunny-day--is-highlighted').length, 8, '8 days are highlighted');
  assert.deepEqual(this.component.highlighted(), [ '10', '11', '12', '13', '14', '15', '16', '17' ], 'highlighted days');
});

test('it should accept intervalComponent as an argument', function(assert){

  this.set('date', moment('March 14, 2016'));

  this.register('component:fake-interval', Ember.Component.extend({
    classNames: ['fake-interval']
  }));

  this.render(hbs`{{sunny-days date intervalComponent=(component 'fake-interval')}}`);

  assert.equal(this.$('.fake-interval').length, 42, '42 fake intervals were rendered');
});
