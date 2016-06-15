export default class SunnyDayPageObject {
  constructor(env) {
    this.env = env;
    this.$ = this.env.$;
  }

  selector() {
    return this.$('.sunny-day');
  }

  value() {
    return this.selector().text().trim();
  }

  datetime() {
    return this.selector().attr('data-datetime');
  }

  isSelected() {
    return this.selector().hasClass('sunny-day--is-selected');
  }

  isNow() {
    return this.selector().hasClass('sunny-day--is-now');
  }

  selectDate() {
    this.selector().click();
  }
}
