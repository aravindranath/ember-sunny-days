import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { HTML5_DATETIME_FORMAT } from 'ember-sunny-days/constants';
import moment from 'moment';
import SunnyDayPageObject from 'dummy/tests/helpers/sunny-day.page-object';

moduleForComponent('sunny-day', 'Integration | Component | sunny day', {
  integration: true,
  beforeEach() {
    let date = moment('January 21, 2014').utc();
    this.set('date', date);
    this.set('datetime', date.format(HTML5_DATETIME_FORMAT));
    this.component = new SunnyDayPageObject(this);
  }
});

test('renders days with moment and interval as positional arguments', function(assert) {
  this.render(hbs`{{sunny-day date}}`);
  assert.equal(this.component.value(), '21', 'renders content');
  assert.equal(this.component.datetime(), this.get('datetime'), 'has data-datetime attribute');
});

test('renders date with block param', function(assert) {
  this.render(hbs`
    {{#sunny-day date}}
      {{moment-format date 'dddd'}}
    {{/sunny-day}}
  `);

  assert.equal(this.component.value(), 'Tuesday', 'renders content');
});

test('is-selected class', function(assert) {
  assert.expect(4);

  this.on('onSelect', (date) => {
    this.set('selection', date);
  });

  this.render(hbs`
    {{sunny-day date
      selection=selection
      on-select=(action 'onSelect')
    }}
  `);
  assert.ok(!this.component.isSelected(), 'is not selected no selection has been defined');

  this.set('selection', this.get('date'));
  assert.ok(this.component.isSelected(), 'is selected when selection is defined');

  this.set('selection', null);
  assert.ok(!this.component.isSelected(), 'is not selected before click');

  this.component.selectDate();
  assert.ok(this.component.isSelected(), 'is selected on click');
});

test('is-now class', function(assert) {
  assert.expect(4);
  this.render(hbs`
    {{sunny-day date}}
  `);
  assert.ok(!this.component.isNow(), 'a date in the past is not now');

  this.set('date', moment());
  assert.ok(this.component.isNow(), 'has is-now class when date is now');

  this.render(hbs`{{sunny-day date now=now}}`);

  this.set('now', moment().subtract(1, 'day'));
  assert.ok(!this.component.isNow(), 'does not have is-now class when now property is not now');

  this.set('now', moment());
  assert.ok(this.component.isNow(), 'has is-now class when now property is now');
});

test('is-hightlighted class', function(assert){

  this.render(hbs`{{sunny-day date is-highlighted=true}}`);

  assert.ok(this.$('.sunny-day').hasClass('--is-highlighted'), 'has is-highlighted class');
});
