import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { click } from 'ember-native-dom-helpers/test-support/helpers';
import Ember from 'ember';
const { $ } = Ember;

moduleForComponent('sunny-pikaday', 'Integration | Component | sunny pickaday', {
  integration: true,
  beforeEach() {
    let date = moment('March 8, 2017');
    this.set('date', date);
  }
});

test('renders pikaday', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date}}`);
  assert.ok(this.$('.sunny-pikaday').length,'component rendered with class');
  assert.ok(this.$('.sunny-pikaday input').length,'component input rendered');
});

test('datepicker with one month view is rendered on click', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date}}`);
  click('.ember-basic-dropdown-trigger');
  assert.ok($('.singleMonthView').length,'component with one month view is rendered');
  assert.equal($('.sunny-day--is-now').text().trim(),'8','8th March is selected');
  assert.equal($('.sunny-days--nameofmonth').text().trim(),'March 2017','March is selected');
  let days = $('.sunny-day:not(.sunny-day--is-empty)');

  assert.equal(days.length, 31, 'There are 31 days');
  for(let day = 1; day <= 31; day++) {
    assert.equal($(days[day-1]).text().trim(), `${day}`, 'days are renderend as per the month of March');
  }
});

test('datepicker with two month view is rendered on click', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date showTwoMonths=true}}`);
  click('.ember-basic-dropdown-trigger');
  assert.ok($('.twoMonthView').length,'component with two month view is rendered');
  assert.equal($('.sunny-day--is-now').text().trim(),'8','8th March is selected');
  assert.equal($('.twoMonthView .first-pikaday .sunny-days--nameofmonth').text().trim(),'March 2017','March is rendered');
  assert.equal($('.twoMonthView .second-pikaday .sunny-days--nameofmonth').text().trim(),'April 2017','April is rendered');
  let daysOfFirstPikaday = $('.first-pikaday .sunny-day:not(.sunny-day--is-empty)');
  let daysOfSecondPikaday = $('.second-pikaday .sunny-day:not(.sunny-day--is-empty)');

  assert.equal(daysOfFirstPikaday.length, 31, 'There are 31 days');
  assert.equal(daysOfSecondPikaday.length, 30, 'There are 30 days');
  for(let day = 1; day <= 31; day++) {
    assert.equal($(daysOfFirstPikaday[day-1]).text().trim(), `${day}`, 'days are renderend as per the month of March');
  }

  for(let day = 1; day <= 30; day++) {
    assert.equal($(daysOfSecondPikaday[day-1]).text().trim(), `${day}`, 'days are renderend as per the month of April');
  }
});

test('select date from pikaday', function(assert) {
  this.on('changeDate', function(date) {
    let expectedDate = moment('March 12, 2017');
    assert.ok(expectedDate.isSame(date, 'day'), 'Expected date is received');
  });
  this.render(hbs`{{sunny-pikaday date=date on-select=(action "changeDate")}}`);
  click('.ember-basic-dropdown-trigger');
  $('.sunny-day:contains(12)').click();
  assert.expect(1);
});

test('mark date as selected', function(assert) {
  let date = moment('June 25 2017');
  this.set('date', date);
  this.render(hbs`{{sunny-pikaday date=date}}`);
  click('.ember-basic-dropdown-trigger');
  assert.ok($('.sunny-day:contains(25)').hasClass('sunny-day--is-selected'),'Specified date is selected');
});

test('change to next month', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date}}`);
  click('.ember-basic-dropdown-trigger');
  click('.next');
  assert.equal($('.singleMonthView .sunny-days--nameofmonth').text().trim(),'April 2017','Change to next month is working as required');
});

test('change to previous month', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date}}`);
  click('.ember-basic-dropdown-trigger');
  click('.prev');
  assert.equal($('.singleMonthView .sunny-days--nameofmonth').text().trim(),'February 2017','Change to previous month is working as required');
});

test('change to next month for two month view', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date showTwoMonths=true}}`);
  click('.ember-basic-dropdown-trigger');
  click('.next');
  assert.equal($('.twoMonthView .first-pikaday .sunny-days--nameofmonth').text().trim(),'April 2017','Change to next month is working for two month view as required');
  assert.equal($('.twoMonthView .second-pikaday .sunny-days--nameofmonth').text().trim(),'May 2017','Change to next month is working for two month view as required');
});

test('change to previous month for two month view', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date showTwoMonths=true}}`);
  click('.ember-basic-dropdown-trigger');
  click('.prev');
  assert.equal($('.twoMonthView .first-pikaday .sunny-days--nameofmonth').text().trim(),'February 2017','Change to previous month is working for two month view as required');
  assert.equal($('.twoMonthView .second-pikaday .sunny-days--nameofmonth').text().trim(),'March 2017','Change to previous month is working for two month view as required');
});

// Test case for datesHighlighted
test('check if dates are highlighted, enabled/disabled, tooltip is visible for single pikaday', function(assert) {

  let dates = {
    '18/06/2017': {
      tooltip: 'Christmas',
      enabled: true,
    },
    '25/06/2017': {
      tooltip: 'Holi',
      enabled: false
    },
    '05/06/2017': {
      tooltip: 'Diwali',
      enabled: false
    }
  };

  let date = moment('June 12 2017');
  this.set('date', date);
  this.set('dates', dates);

  let enabledDays = Object.keys(dates).reduce(function(accumulator, key) {
    let value = dates[key];
    let {enabled} = value;
    if (enabled) {
      accumulator.push(key);
    }
    return accumulator;
  }, []);

  let tooltips = Object.keys(dates).reduce(function(accumulator, key) {
    let { tooltip } = dates[key];
    accumulator[key] = tooltip;
    return accumulator;
  }, {});

  this.set('tooltips', tooltips);
  this.set('enabledDays', enabledDays);

  this.render(hbs`
    {{#sunny-pikaday date=date as |day|}}
      {{#with (moment-format day "DD/MM/YYYY") as |formatted|}}
        {{#if (contains formatted enabledDays)}}
          <button {{action day.select}}>
            {{moment-format day "d"}}
            {{#tooltip-on-element}}
              {{get tooltips formatted}}
            {{/tooltip-on-element}}
          </button>        
        {{else}}
            {{moment-format day "d"}}
            {{#tooltip-on-element}}
              {{get tooltips formatted}}
            {{/tooltip-on-element}}        
        {{/if}}
      {{/with}}
    {{/sunny-pikaday}}
  `);

  click('.ember-basic-dropdown-trigger');

  assert.ok($('.sunny-day:contains(18)').hasClass('sunny-day--is-highlighted'), 'Specified date is highlighted');
  assert.ok($('.sunny-day:contains(25)').hasClass('sunny-day--is-highlighted'), 'Specified date is highlighted');
  assert.ok($('.sunny-day:contains(05)').hasClass('sunny-day--is-highlighted'), 'Specified date is highlighted');

  assert.ok($('.sunny-day:contains(25)').hasClass('sunny-day--is-disabled'), 'Specified date is disabled');
  assert.ok($('.sunny-day:contains(05)').hasClass('sunny-day--is-disabled'), 'Specified date is disabled');

  assert.equal($('.sunny-day:contains(05)').attr('title'), 'Diwali', 'Specified title is shown');
  assert.equal($('.sunny-day:contains(18)').attr('title'), 'Christmas', 'Specified title is shown');
  assert.equal($('.sunny-day:contains(25)').attr('title'), 'Holi', 'Specified title is shown');
});

//Test case for startDate
test('check if the navigation is disabled before startDate of pikaday', function(assert){
  let startDate = moment('05/03/2017');
  this.set('startDate', startDate);

  this.render(hbs`{{sunny-pikaday date=date startDate=startDate}}`);

  click('.ember-basic-dropdown-trigger');

  assert.equal($('.prev').is(':visible'), false, 'Button to navigate to previous month is hidden');
});

//Test case for endDate
test('check if the navigation is disabled after endDate of pikaday', function(assert){
  let endDate = moment('29/03/2017');
  this.set('endDate', endDate);

  this.render(hbs`{{sunny-pikaday date=date endDate=endDate}}`);

  click('.ember-basic-dropdown-trigger');

  assert.equal($('.next').is(':visible'), false, 'Button to navigate to next month is hidden');
});

//Test case for minViewMode
test('check if minViewMode is rendered', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date minViewMode="months"}}`);

  click('.ember-basic-dropdown-trigger');
  assert.equal($('.sunny-days').is(':visible'), false, 'Days are hidden');
  
  click('.sunny-month:contains(Mar)');
  assert.equal($('.sunny-days').is(':visible'), false, 'Days are hidden');
  
  click('.sunny-days--nameofmonth');

  assert.equal($('.sunny-months').is(':visible'), true, 'Months are visible');

  click('.sunny-days--nameofmonth');

  assert.equal($('.sunny-months').is(':visible'), false, 'Months are hidden');
  assert.equal($('.sunny-years').is(':visible'), true, 'Years are visible');
});

//Test case for maxViewMode
test('check if maxViewMode is rendered', function(assert) {
  this.render(hbs`{{sunny-pikaday date=date maxViewMode="months"}}`);

  click('.ember-basic-dropdown-trigger');

  assert.equal($('.sunny-days').is(':visible'), true, 'Days are visible');
  
  click('.sunny-days--nameofmonth');
  
  assert.equal($('.sunny-days').is(':visible'), false, 'Days are hidden');
  assert.equal($('.sunny-months').is(':visible'), true, 'Months are visible');
  
  click('.sunny-days--nameofmonth');

  assert.equal($('.sunny-months').is(':visible'), true, 'Months are visible');
  assert.equal($('.sunny-years').is(':visible'), false, 'Years are hidden');
});