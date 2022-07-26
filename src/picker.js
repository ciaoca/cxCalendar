import theTool from './tool.js';

// 选择器实例
const picker = function() {
  const self = this;
  let options = {};
  let isAttach = false;

  // 分配参数
  for (let x of arguments) {
    if (theTool.isElement(x)) {
      self.input = x;
    } else if (theTool.isObject(x)) {
      options = x;
    } else if (typeof x === 'boolean') {
      isAttach = x;
    };
  };

  if (!self.input || !self.input.nodeName || ['input', 'textarea'].indexOf(self.input.nodeName.toLowerCase()) === -1) {
    console.warn('[cxCalendar] Not input element.');
    return;
  };

  // 合并输入框参数
  const keys = [
    'baseClass',
    'disableWeek',
    'disableDay',
    'endDate',
    'format',
    'hourStep',
    'language',
    'lockRow',
    'minuteStep',
    'position',
    'mode',
    'rangeSymbol',
    'rangeMaxDay',
    'rangeMaxMonth',
    'rangeMaxYear',
    'secondStep',
    'startDate',
    'type',
    'weekStart',
    'yearNum',
  ];
  const inputSettings = {};

  for (let x of keys) {
    if (typeof self.input.dataset[x] !== 'string' || !self.input.dataset[x].length) {
      continue;
    };

    switch (x) {
      case 'hourStep':
      case 'minuteStep':
      case 'secondStep':
      case 'rangeMaxDay':
      case 'rangeMaxMonth':
      case 'rangeMaxYear':
      case 'weekStart':
      case 'yearNum':
        inputSettings[x] = parseInt(self.input.dataset[x], 10);
        break;

      case 'lockRow':
        inputSettings[x] = Boolean(parseInt(self.input.dataset[x], 10));
        break;

      case 'disableWeek':
      case 'disableDay':
        inputSettings[x] = self.input.dataset[x].split(',');
        break;

      default:
        inputSettings[x] = self.input.dataset[x];
        break;
    };
  };

  if (Array.isArray(inputSettings.disableWeek)) {
    inputSettings.disableWeek = inputSettings.disableWeek.map((val) => {
      return parseInt(val, 10);
    });
  };

  self.settings = theTool.extend({}, options, inputSettings);
  self.setOptions();

  let alias = 'id_' + self.input.dataset.cxCalendarId;

  if (typeof theTool.bindFuns[alias] === 'function') {
    theTool.detach(self.input);
  };

  self.eventChange = new CustomEvent('change', {
    bubbles: true
  });

  if (isAttach) {
    self.input.dataset.cxCalendarId = theTool.cxId;
    alias = 'id_' + theTool.cxId;
    theTool.cxId++;
    theTool.bindFuns[alias] = self.show.bind(self);

    self.input.addEventListener('click', theTool.bindFuns[alias]);

  } else {
    self.show();
  };
};

picker.prototype.setOptions = function(options) {
  const self = this;
  let maxDate;
  let minDate;
  let defDate;

  if (theTool.isObject(options)) {
    theTool.extend(self.settings, options);
  };

  // 结束日期（默认为当前日期）
  if (theTool.reg.isYear.test(self.settings.endDate)) {
    maxDate = new Date(self.settings.endDate, 11, 31);
  } else {
    maxDate = theTool.parseDate(self.settings.endDate, true);
  };

  maxDate.setHours(23, 59, 59);

  self.maxDate = {
    year: maxDate.getFullYear(),
    month: maxDate.getMonth() + 1,
    day: maxDate.getDate(),
    time: maxDate.getTime()
  };

  // 起始日期（默认为当前日期的前一年）
  if (theTool.reg.isYear.test(self.settings.startDate)) {
    minDate = new Date(self.settings.startDate, 0, 1);
  } else {
    minDate = theTool.parseDate(self.settings.startDate);
  };

  if (!theTool.isDate(minDate)) {
    minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
  };

  // 若超过结束日期，则设为结束日期的前一年
  if (minDate.getTime() > self.maxDate.time) {
    minDate = new Date(self.maxDate.year - 1, self.maxDate.month - 1, self.maxDate.day);
  };

  minDate.setHours(0, 0, 0, 0);

  self.minDate = {
    year: minDate.getFullYear(),
    month: minDate.getMonth() + 1,
    day: minDate.getDate(),
    time: minDate.getTime()
  };

  const rangeValue = {};

  // 默认日期
  if (self.settings.mode === 'range') {
    const dateSp = String(self.settings.date).split(self.settings.rangeSymbol);

    if (dateSp.length === 2) {
      defDate = theTool.parseDate(dateSp[0], true);

      const rangeEndDate = theTool.parseDate(dateSp[1], true);
      rangeValue.start = defDate.getTime();
      rangeValue.end = rangeEndDate.getTime();
    };
  };

  if (!defDate) {
    defDate = theTool.parseDate(self.settings.date, true);
  };

  if (defDate.getTime() < self.minDate.time) {
    defDate = theTool.parseDate(self.minDate.time, true);
  } else if (defDate.getTime() > self.maxDate.time) {
    defDate = theTool.parseDate(self.maxDate.time, true);
  };

  self.defDate = {
    year: defDate.getFullYear(),
    month: defDate.getMonth() + 1,
    day: defDate.getDate(),
    hour: defDate.getHours(),
    mint: defDate.getMinutes(),
    secs: defDate.getSeconds(),
    time: defDate.getTime(),
    start: rangeValue.start,
    end: rangeValue.end,
  };

  // 星期的起始位置
  self.settings.weekStart %= 7;

  // 语言配置
  self.settings.language = theTool.getLanguage(self.settings.language);

  // 统计节假日
  if (Array.isArray(self.settings.language.holiday) && self.settings.language.holiday.length) {
    self.holiday = {};

    for (let x of self.settings.language.holiday) {
      self.holiday[x.day] = x.name;
    };
  };
};

picker.prototype.show = function() {
  const self = this;

  if (self.input.value || !self.settings.date) {
    self.settings.date = self.input.value;
  };
  self.setOptions();

  theTool.cacheApi = self;
  theTool.buildPanel();
  theTool.showPanel();
};

picker.prototype.hide = function() {
  theTool.hidePanel();
};

picker.prototype.getDate = function(style) {
  const self = this;
  const oldValue = self.input.value;
  const dateList = [];

  if (typeof style !== 'string' || !style.length) {
    style = self.settings.format;
  };

  if (self.settings.mode === 'range') {
    const dateSp = String(oldValue).split(self.settings.rangeSymbol);

    if (dateSp.length === 2) {
      dateList.push(...dateSp);
    };

  } else {
    dateList.push(oldValue);
  };

  let newValue = [];

  for (let x of dateList) {
    const theDate = theTool.parseDate(x);

    if (!theTool.isDate(theDate)) {
      newValue = [];
      break;
    };

    newValue.push(theTool.formatDate(style, theDate.getTime(), self.settings.language));
  };

  newValue = self.settings.mode === 'range' ? newValue.join(self.settings.rangeSymbol) : newValue.join('');

  return newValue;
};

picker.prototype.setDate = function(value) {
  const self = this;
  const oldValue = self.input.value;
  const dateList = [];

  if (self.settings.mode === 'range') {
    const dateSp = String(value).split(self.settings.rangeSymbol);

    if (dateSp.length === 2) {
      dateList.push(...dateSp);
    };

  } else {
    dateList.push(value);
  };

  let newValue = [];

  for (let x of dateList) {
    const theDate = theTool.parseDate(x);

    if (!theTool.isDate(theDate)) {
      newValue = [];
      break;
    };

    let theTime = theDate.getTime();

    if (theTime < self.minDate.time) {
      theTime = self.minDate.time;
    } else if (theTime > self.maxDate.time) {
      theTime = self.maxDate.time;
    };

    newValue.push(theTool.formatDate(self.settings.format, theTime, self.settings.language));
  };

  newValue = self.settings.mode === 'range' ? newValue.join(self.settings.rangeSymbol) : newValue.join('');

  if (oldValue !== newValue) {
    self.input.value = newValue;
    self.input.dispatchEvent(self.eventChange);
  };
};

picker.prototype.clearDate = function() {
  const self = this;
  const oldValue = self.input.value;

  if (oldValue && oldValue.length) {
    self.input.value = '';
    self.input.dispatchEvent(self.eventChange);
  };
};

export default picker;