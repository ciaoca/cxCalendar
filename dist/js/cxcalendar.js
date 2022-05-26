/**
 * cxCalendar
 * @version 3.0.0
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxCalendar
 * @license Released under the MIT license
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
typeof define === 'function' && define.amd ? define(factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cxCalendar = factory());
})(this, (function () { 'use strict';

const theTool = {
  dom: {},
  reg: {
    isYear: /^\d{4}$/,
    isTime: /^\d{1,2}(\:\d{1,2}){1,2}$/
  },
  cacheDate: {},
  cxId: 1,
  bindFuns: {},

  isElement: function(o) {
    if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
      return true;
    } else {
      return (o && o.nodeType && o.nodeType === 1) ? true : false;
    }  },
  isInteger: function(value) {
    return typeof value === 'number' && !isNaN(value) && /^\d+$/.test(value);
  },
  isObject: function(value) {
    if (value === undefined || value === null || Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
    }
    if (value.constructor && !Object.prototype.hasOwnProperty.call(value.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
    return true;
  },
  isDate: function(value) {
    return (value instanceof Date || Object.prototype.toString.call(value) === '[object Date]') && isFinite(value.getTime());
  },
};

// 合并对象
theTool.extend = function(target, ...sources) {
  const self = this;

  if (!self.isObject(target)) {
    return;
  }
  for (let x of sources) {
    if (!self.isObject(x)) {
      continue;
    }
    for (let y in x) {
      if (Array.isArray(x[y])) {
        target[y] = [].concat(x[y]);

      } else if (self.isObject(x[y])) {
        if (!self.isObject(target[y])) {
          target[y] = {};
        }        self.extend(target[y], x[y]);

      } else {
        target[y] = x[y];
      }    }  }
  return target;
};

// 补充前置零
theTool.fillLeadZero = function(value, num) {
  let str = String(value);

  if (str.length < num) {
    str = Array(num - str.length).fill(0).join('') + value;
  }
  return str;
};

// 获取当年每月的天数
theTool.getMonthDays = function(year) {
  const leapYearDay = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 1 : 0;
  return [31, 28 + leapYearDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

// 获取周数
theTool.getWeekNum = function(dateObj) {
  const self = this;
  const curTime = dateObj.getTime();
  const yearFirstDate = new Date(dateObj.getFullYear(), 0, 1, 0, 0, 0, 0);
  let weekFirstTime = yearFirstDate.getTime();
  let weekDay = yearFirstDate.getDay();
  let weekNum = 0;

  if (weekDay === 0) {
    weekDay = 7;
  }
  if (weekDay > 4) {
    weekFirstTime += (8 - weekDay) * 86400000;
  } else {
    weekFirstTime += (1 - weekDay) * 86400000;
  }
  if (curTime < weekFirstTime) {
    weekNum = self.getWeekNum(new Date(dateObj.getFullYear() - 1, 11, 31));
  } else {
    weekNum = Math.floor((curTime - weekFirstTime) / 86400000) + 1;
    weekNum = Math.ceil(weekNum / 7);
  }
  return weekNum;
};

/**
 * 解析日期
 * 默认支持 ISO 8601 格式，和以下格式
 * y
 * y-m
 * y-m-d
 * y-m-d h:i
 * y-m-d h:i:s
 * m-d
 * m-d h:i
 * m-d h:i:s
 * h:i
 * h:i:s
 * 
 * 日期连接符 '-' 可替换为 '.' 或 '/'
**/
theTool.parseDate = function(value, mustDef) {
  const self = this;
  let theDate = new Date();

  if (self.reg.isYear.test(value)) {
    theDate.setFullYear(parseInt(value, 10));

  } else if (self.isInteger(value)) {
    theDate.setTime(parseInt(value, 10));

  } else if (typeof value === 'string' && value.length) {
    let tags;

    if (self.reg.isTime.test(value)) {
      tags = value.split(':').map((x) => {
        return parseInt(x, 10);
      });

      if (tags.length < 4) {
        tags = tags.concat(Array(4 - tags.length).fill(0));
      } else if (tags.length > 4) {
        tags.length = 4;
      }
      theDate.setHours.apply(theDate, tags);

    } else {
      value = value.replace(/[\.\/]/g, '-');

      if (/^\d{1,2}-\d{1,2}/.test(value)) {
        value = theDate.getFullYear() + '-' + value;
      } else if (/^\d{4}-\d{1,2}$/.test(value)) {
        value += '-1';
      }
      tags = value.split(/[\-\sT\:]/).map((x) => {
        return parseInt(x, 10);
      });

      if (tags.length > 1) {
        tags[1] -= 1;
      }
      if (tags.length < 7) {
        tags = tags.concat(Array(7 - tags.length).fill(0));
      } else if (tags.length > 7) {
        tags.length = 7;
      }
      theDate.setFullYear.apply(theDate, tags.slice(0, 3));
      theDate.setHours.apply(theDate, tags.slice(3));
    }
  } else {
    theDate = null;
  }
  if (mustDef === true && !self.isDate(theDate)) {
    theDate = new Date();
  }
  return theDate;
};

// 格式化日期值
theTool.formatDate = function(style, time) {
  const self = this;
  const date = self.parseDate(time);

  if (typeof style !== 'string' || !self.isDate(date)) {
    return time;
  }
  const attr = {
    Y: date.getFullYear(),
    n: date.getMonth() + 1,
    j: date.getDate(),
    G: date.getHours(),
    timestamp: date.getTime(),
  };

  attr.y = attr.Y.toString(10).slice(-2);
  attr.m = self.fillLeadZero(attr.n, 2);
  attr.d = self.fillLeadZero(attr.j, 2);

  attr.H = self.fillLeadZero(attr.G, 2);
  attr.g = attr.G > 12 ? attr.G - 12 : attr.G;
  attr.h = self.fillLeadZero(attr.g, 2);
  attr.i = self.fillLeadZero(date.getMinutes(), 2);
  attr.s = self.fillLeadZero(date.getSeconds(), 2);

  const keys = ['timestamp', 'Y', 'y', 'm', 'n', 'd', 'j', 'H', 'h', 'G', 'g', 'i', 's'];
  const reg = new RegExp('(' + keys.join('|') + ')', 'g');
  let str = style;

  // 转义边界符号
  str = str.replace(/([\{\}])/g, '\\$1');

  // 转义关键词
  str = str.replace(reg, (match, p1) => {
    return '{{' + p1 + '}}';
  });

  // 还原转义字符
  str = str.replace(/\\\{\{(.)\}\}/g, '$1');

  // 替换关键词
  for (let x of keys) {
    str = str.replace(new RegExp('{{' + x + '}}', 'g'), attr[x]);
  }
  // 还原转义内容
  str = str.replace(/\\(.)/g, '$1');

  return str;
};

// 获取语言配置
theTool.getLanguage = function(name) {
  const self = this;

  if (self.isObject(name)) {
    return name;
  }
  if (typeof name !== 'string' || !name.length) {
    if (typeof navigator.language === 'string') {
      name = navigator.language;
    } else if (typeof navigator.browserLanguage === 'string') {
      name = navigator.browserLanguage;
    }  }
  if (typeof name === 'string') {
    name = name.toLowerCase();
  }
  if (typeof name === 'string' && name.length && typeof cxCalendar.languages[name] === 'object') {
    return cxCalendar.languages[name];
  } else {
    return cxCalendar.languages['default'];
  }};

theTool.init = function() {
  const self = this;

  self.buildStage();
  self.bindEvent();
};

// 构建选择器
theTool.buildStage = function() {
  const self = this;

  self.dom.maskBg = document.createElement('div');
  self.dom.maskBg.classList.add('cxcalendar_mask');

  self.dom.panel = document.createElement('div');
  self.dom.panel.classList.add('cxcalendar');

  self.dom.head = document.createElement('div');
  self.dom.head.classList.add('cxcalendar_hd');

  self.dom.main = document.createElement('div');
  self.dom.main.classList.add('cxcalendar_bd');

  self.dom.acts = document.createElement('div');
  self.dom.acts.classList.add('cxcalendar_acts');

  self.dom.dateSet = document.createElement('div');

  self.dom.timeSet = document.createElement('div');
  self.dom.timeSet.classList.add('times');

  self.dom.acts.innerHTML = '<a class="today" href="javascript://" rel="today"></a><a class="clear" href="javascript://" rel="clear"></a>';

  self.dom.panel.insertAdjacentElement('beforeend', self.dom.main);
  document.body.insertAdjacentElement('beforeend', self.dom.panel);
  self.dom.panel.insertAdjacentElement('afterend', self.dom.maskBg);
};

// 绑定事件
theTool.bindEvent = function() {
  const self = this;

  // 关闭面板
  self.dom.maskBg.addEventListener('click', () => {
    self.hidePanel();
  });

  self.dom.panel.addEventListener('click', (e) => {
    const el = e.target;
    const nodeName = el.nodeName.toLowerCase();

    if (nodeName === 'a' && el.rel) {
      event.preventDefault();

      switch (el.rel) {
        // 上个月
        case 'prev':
          self.gotoPrev();
          break;

        // 下个月
        case 'next':
          self.gotoNext();
          break;

        // 今日
        case 'today':
          self.hidePanel();
          cacheApi.setDate(new Date().getTime());
          break;

        // 清除
        case 'clear':
          self.hidePanel();
          cacheApi.clearDate();
          break;

        // 确认
        case 'confirm':
          self.hidePanel();
          self.confirmTime();
          break;
      }
    // 选择日期
    } else if (nodeName === 'li' && el.dataset.date) {
      let date = el.dataset.date;

      if (typeof date !== 'string' || !date.length) {
        return;
      }
      for (let x of el.parentNode.querySelectorAll('li')) {
        x.classList.remove('selected');
      }
      el.classList.add('selected');

      if (cacheApi.settings.type === 'datetime') {
        const dateSp = date.split('-');

        self.cacheDate = {
          year: parseInt(dateSp[0], 10),
          month: parseInt(dateSp[1], 10),
          day: parseInt(dateSp[2], 10),
          txt: date
        };
        return;
      }
      if (cacheApi.settings.type === 'month') {
        date += '-1';
      }
      self.hidePanel();
      cacheApi.setDate(date);
    }  });

  // 选择年月
  self.dom.panel.addEventListener('change', (e) => {
    const el = e.target;
    const nodeName = el.nodeName.toLowerCase();

    if (nodeName === 'select' && ['year', 'month'].indexOf(el.name) >= 0) {
      self.gotoDate();
    }  });
};

theTool.getSelects = function(list, values) {
  const self = this;
  const selects = {};

  for (let x of self.dom.head.querySelectorAll('select')) {
    if (list.indexOf(x.name) >= 0) {
      selects[x.name] = x;

      if (self.isObject(values)) {
        values[x.name] = parseInt(x.value, 10);
      }    }  }
  return selects;
};

// 创建面板
theTool.buildPanel = function() {
  const self = this;

  if (cacheApi.settings.date) {
    self.cacheDate = {
      year: cacheApi.defDate.year,
      month: cacheApi.defDate.month,
      day: cacheApi.defDate.day,
      txt: [cacheApi.defDate.year, cacheApi.defDate.month, cacheApi.defDate.day].join('-')
    };
  } else {
    self.cacheDate = {};
  }
  self.dom.head.innerHTML = '';
  self.dom.main.innerHTML = '';

  // 基础样式
  const classValue = ['cxcalendar', 'm_' + cacheApi.settings.type];

  if (typeof cacheApi.settings.baseClass === 'string' && cacheApi.settings.baseClass.length) {
    classValue.push(cacheApi.settings.baseClass);
  }
  self.dom.panel.className = classValue.join(' ');

  const splitHtml = '<em></em>';
  const prevNextHtml = '<a class="prev" href="javascript://" rel="prev"></a><a class="next" href="javascript://" rel="next"></a>';
  let html = '';

  // 年份选择框
  if (['month', 'date', 'datetime'].indexOf(cacheApi.settings.type) >= 0) {
    html += '<select name="year" class="year">';

    for (let i = cacheApi.minDate.year; i <= cacheApi.maxDate.year; i++) {
      html += '<option value="' + i + '">' + i + '</option>';
    }
    html += '</select>';

  } else if (cacheApi.settings.type === 'year') {
    let start = Math.floor(cacheApi.minDate.year / 10) * 10;

    html += '<select name="year" class="year">';

    for (let i = start; i <= cacheApi.maxDate.year; i += cacheApi.settings.yearNum) {
      let end = i + cacheApi.settings.yearNum - 1;
      html += '<option value="' + i + '">' + i + ' - ';
      // html += end < cacheApi.maxDate.year ? end : cacheApi.maxDate.year;
      html += end;
      html += '</option>';
    }
    html += '</select>';
  }
  if (['date', 'datetime'].indexOf(cacheApi.settings.type) >= 0) {
    html += splitHtml;
    html += '<select name="month" class="month"></select>';
    html += splitHtml;
    html += prevNextHtml;

    self.dom.head.innerHTML = html;
    self.dom.dateSet.className = 'days';

    self.dom.main.insertAdjacentElement('beforeend', self.dom.dateSet);
    self.dom.panel.insertAdjacentElement('afterbegin', self.dom.head);
    self.dom.panel.insertAdjacentElement('beforeend', self.dom.acts);

    if (cacheApi.settings.type === 'datetime') {
      self.buildTimes();
    }
    self.gotoDate([cacheApi.defDate.year, cacheApi.defDate.month].join('-'));

  } else if (cacheApi.settings.type === 'time') {
    if (self.dom.panel.contains(self.dom.head)) {
      self.dom.panel.removeChild(self.dom.head);
    }    if (self.dom.panel.contains(self.dom.acts)) {
      self.dom.panel.removeChild(self.dom.acts);
    }
    self.buildTimes();

  } else if (cacheApi.settings.type === 'month') {
    html += splitHtml;
    html += prevNextHtml;

    self.dom.head.innerHTML = html;
    self.dom.dateSet.className = 'months';

    self.dom.main.insertAdjacentElement('beforeend', self.dom.dateSet);
    self.dom.panel.insertAdjacentElement('afterbegin', self.dom.head);
    self.dom.panel.insertAdjacentElement('beforeend', self.dom.acts);

    self.gotoDate(cacheApi.defDate.year);

  } else if (cacheApi.settings.type === 'year') {
    html += prevNextHtml;

    self.dom.head.innerHTML = html;
    self.dom.dateSet.className = 'years';

    self.dom.main.insertAdjacentElement('beforeend', self.dom.dateSet);
    self.dom.panel.insertAdjacentElement('afterbegin', self.dom.head);
    self.dom.panel.insertAdjacentElement('beforeend', self.dom.acts);

    self.gotoDate(cacheApi.defDate.year);
  }};

// 重新构建月份选项
theTool.rebuildMonthSelect = function() {
  const self = this;
  const values = {};
  const selects = self.getSelects(['year', 'month'], values);
  let start = 1;
  let end = 12;

  if (values.year === cacheApi.minDate.year && values.year === cacheApi.maxDate.year) {
    start = cacheApi.minDate.month;
    end = cacheApi.maxDate.month;
  } else if (values.year === cacheApi.minDate.year) {
    start = cacheApi.minDate.month;
  } else if (values.year === cacheApi.maxDate.year) {
    end = cacheApi.maxDate.month;
  }
  let html = '';

  for (let i = start; i <= end; i++) {
    html += '<option value="' + i + '"';

    if (values.month === i) {
      html += ' selected';
    }
    html += '>' + cacheApi.language.monthList[i - 1] + '</option>';
  }
  selects.month.innerHTML = html;
};

// 构建日期列表
theTool.buildDays = function(year, month) {
  const self = this;

  if (!self.isInteger(year) || !self.isInteger(month)) {
    return;
  }
  const saturday = 6 - cacheApi.settings.weekStart;
  const sunday = (7 - cacheApi.settings.weekStart) % 7;

  const theDate = new Date(year, month - 1, 1);
  year = theDate.getFullYear();
  month = theDate.getMonth() + 1;

  if (year < cacheApi.minDate.year || (year === cacheApi.minDate.year && month < cacheApi.minDate.month)) {
    year = cacheApi.minDate.year;
    month = cacheApi.minDate.month;

  } else if (year > cacheApi.maxDate.year || (year === cacheApi.maxDate.year && month > cacheApi.maxDate.month)) {
    year = cacheApi.maxDate.year;
    month = cacheApi.maxDate.month;
  }
  const jsMonth = month - 1;
  const monthDays = self.getMonthDays(year);
  const sameMonthDate = new Date(year, jsMonth, 1);
  const nowDate = new Date();
  const nowText = [nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate()].join('-');

  // 获取当月第一天
  let monthFirstDay = sameMonthDate.getDay() - cacheApi.settings.weekStart;
  if (monthFirstDay < 0) {
    monthFirstDay += 7;
  }
  // 自适应或固定行数
  let monthDayMax = cacheApi.settings.lockRow ? 42 : Math.ceil((monthDays[jsMonth] + monthFirstDay) / 7) * 7;
  let html = '<ul>';

  // 星期排序
  for(let i = 0; i < 7; i++) {
    html += '<li class="week';

    // 高亮周末
    if (i === saturday) {
      html += ' sat';
    } else if(i === sunday) {
      html += ' sun';
    }
    html += '">' + cacheApi.language.weekList[(i + cacheApi.settings.weekStart) % 7] + '</li>';
  }
  for (let i = 0; i < monthDayMax; i++) {
    const classValue = [];
    let todayYear = year;
    let todayMonth = month;
    let todayNum = i - monthFirstDay + 1;
    
    // 填充上月和下月的日期
    if (todayNum <= 0) {
      classValue.push('other');

      if (todayMonth <= 1) {
        todayYear--;
        todayMonth = 12;
        todayNum = monthDays[11] + todayNum;
      } else {
        todayMonth--;
        todayNum = monthDays[jsMonth - 1] + todayNum;
      }
    } else if (todayNum > monthDays[jsMonth]) {
      classValue.push('other');

      if (todayMonth >= 12) {
        todayYear++;
        todayMonth = 1;
        todayNum = todayNum - monthDays[0];
      } else {
        todayMonth++;
        todayNum -= monthDays[jsMonth];
      }    }
    const todayDate = new Date(todayYear, todayMonth - 1, todayNum);
    const todayTime = todayDate.getTime();
    const todayText = [todayYear, todayMonth, todayNum].join('-');
    let todayName = '';

    // 高亮选中日期、今天
    if (todayText === self.cacheDate.txt) {
      classValue.push('selected');
    } else if (todayText === nowText) {
      classValue.push('now');
    }
    // 高亮周末
    if (i % 7 === saturday) {
      classValue.push('sat');
    } else if (i % 7 === sunday) {
      classValue.push('sun');
    }
    // 超出范围的无效日期
    if (todayTime < cacheApi.minDate.time || todayTime > cacheApi.maxDate.time) {
      classValue.push('del');

    // 不可选择的日期（星期）
    } else if (Array.isArray(cacheApi.settings.disableWeek) && cacheApi.settings.disableWeek.length && cacheApi.settings.disableWeek.indexOf((i + cacheApi.settings.weekStart) % 7) >= 0) {
      classValue.push('del');

    // 不可选择的日期
    } else if (Array.isArray(cacheApi.settings.disableDay) && cacheApi.settings.disableDay.length) {
      if (cacheApi.settings.disableDay.indexOf(String(todayNum)) >= 0 || cacheApi.settings.disableDay.indexOf([todayMonth, todayNum].join('-')) >= 0 || cacheApi.settings.disableDay.indexOf([todayYear, todayMonth, todayNum].join('-')) >= 0) {
        classValue.push('del');
      }    }
    // 判断是否有节假日
    if (self.holiday) {
      const keys = [
        [todayYear, todayMonth, todayNum].join('-'),
        [todayMonth, todayNum].join('-'),
      ];

      for (let x of keys) {
        if (typeof self.holiday[x] === 'string') {
          classValue.push('holiday');
          todayName = self.holiday[dKey];
          break;
        }      }    }
    html += '<li';

    if (classValue.length) {
      html += ' class="' + classValue.join(' ') + '"';
    }
    if (classValue.indexOf('del') === -1) {
      html += ' data-date="' + todayText + '"';
    }
    if (todayName.length) {
      html += ' data-title="' + todayName + '"';
    }
    if (i % 7 === 0) {
      html += ' data-week-num="' + self.getWeekNum(todayDate) + '"';
    }
    html += '>' + todayNum + '</li>';
  }
  html += '</ul>';

  self.dom.dateSet.innerHTML = html;
};

// 构建时间选择
theTool.buildTimes = function() {
  const self = this;
  const values = {};
  let optionValue;
  const splitHtml = '<i></i>';
  let html = '<select name="hour" class="hour">';

  for (let i = 0; i < 24; i += cacheApi.settings.hourStep) {
    optionValue = self.fillLeadZero(i, 2);

    if (i <= cacheApi.defDate.hour) {
      values.hour = optionValue;
    }
    html += '<option value="' + optionValue + '">' + optionValue + '</option>';
  }
  html += '</select>';
  html += splitHtml;
  html += '<select name="mint" class="mint">';

  for (let i = 0; i < 60; i += cacheApi.settings.minuteStep) {
    optionValue = self.fillLeadZero(i, 2);

    if (i <= cacheApi.defDate.mint) {
      values.mint = optionValue;
    }
    html += '<option value="' + optionValue + '">' + optionValue + '</option>';
  }
  html += '</select>';
  html += splitHtml;
  html += '<select name="secs" class="secs">';

  for (let i = 0; i < 60; i += cacheApi.settings.secondStep) {
    optionValue = self.fillLeadZero(i, 2);

    if (i <= cacheApi.defDate.secs) {
      values.secs = optionValue;
    }
    html += '<option value="' + optionValue + '">' + optionValue + '</option>';
  }
  html += '</select>';
  html += '<a class="confirm" href="javascript://" rel="confirm"></a>';

  self.dom.timeSet.innerHTML = html;
  self.dom.main.insertAdjacentElement('beforeend', self.dom.timeSet);

  for (let x of self.dom.timeSet.querySelectorAll('select')) {
    if (values[x.name]) {
      x.value = values[x.name];
    }  }};

// 构建月份列表
theTool.buildMonths = function(year) {
  const self = this;

  if (!self.isInteger(year)) {
    return;
  }
  const nowDate = new Date();
  const nowText = [nowDate.getFullYear(), nowDate.getMonth() + 1].join('-');
  const selectedText = [self.cacheDate.year, self.cacheDate.month].join('-');
  let html = '<ul>';

  for (let i = 1; i <= 12; i++) {
    const classValue = [];
    const todayText = year + '-' + i;


    if (todayText === selectedText) {
      classValue.push('selected');
    } else if (todayText === nowText) {
      classValue.push('now');
    }
    if ((year === cacheApi.minDate.year && i < cacheApi.minDate.month) || (year === cacheApi.maxDate.year && i > cacheApi.maxDate.month)) {
      classValue.push('del');
    }
    html += '<li';

    if (classValue.length) {
      html += ' class="' + classValue.join(' ') + '"';
    }
    if (classValue.indexOf('del') === -1) {
      html += ' data-date="' + todayText + '"';
    }
    html += '>' + cacheApi.language.monthList[i - 1] + '</li>';
  }
  html += '</ul>';

  self.dom.dateSet.innerHTML = html;
};

// 构建年份列表
theTool.buildYears = function(year) {
  const self = this;
  let start = cacheApi.minDate.year;
  let end;
  let diff;

  if (!self.isInteger(year)) {
    return;
  }
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear();

  if (year < cacheApi.minDate.year) {
    start = cacheApi.minDate.year;
  } else if (year > cacheApi.maxDate.year) {
    start = cacheApi.maxDate.year;
  }
  start = Math.floor(start / 10) * 10;
  diff = year - start;

  if (diff >= cacheApi.settings.yearNum) {
    start += Math.floor(diff / cacheApi.settings.yearNum) * cacheApi.settings.yearNum;
  }
  end = start + cacheApi.settings.yearNum - 1;

  // if (end > cacheApi.maxDate.year) {
  //   end = cacheApi.maxDate.year;
  // };

  let html = '<ul>';

  for (let i = start; i <= end; i++) {
    const classValue = [];

    if (i === self.cacheDate.year) {
      classValue.push('selected');
    } else if (i === nowYear) {
      classValue.push('now');
    }
    if (i < cacheApi.minDate.year || i > cacheApi.maxDate.year) {
      classValue.push('del');
    }
    html += '<li';

    if (classValue.length) {
      html += ' class="' + classValue.join(' ') + '"';
    }
    if (classValue.indexOf('del') === -1) {
      html += ' data-date="' + i + '"';
    }
    html += '>' + i + '</li>';
  }
  html += '</ul>';

  self.dom.dateSet.innerHTML = html;
};

// 跳转到日期
theTool.gotoDate = function(value) {
  const self = this;
  const values = {};
  const selects = self.getSelects(['year', 'month'], values);

  let theYear;
  let theMonth;

  if (value === undefined) {
    theYear = values.year;
    theMonth = values.month;

  } else {
    const theDate = self.parseDate(value, true);
    theYear = theDate.getFullYear();
    theMonth = theDate.getMonth() + 1;
  }
  if (cacheApi.settings.type === 'year') {
    let startYear = theYear;

    for (let x of selects.year.options) {
      let val = parseInt(x.value, 10);

      if (val <= theYear) {
        startYear = val;
      } else {
        break;
      }    }
    if (startYear !== values.year) {
      selects.year.value = startYear;
    }
  } else if (theYear !== values.year) {
    selects.year.value = theYear;

    if (['date', 'datetime'].indexOf(cacheApi.settings.type) >= 0) {
      self.rebuildMonthSelect();
      selects.month.value = theMonth;
    }  }
  switch (cacheApi.settings.type) {
    case 'date':
    case 'datetime':
      self.buildDays(theYear, theMonth);
      break;

    case 'month':
      self.buildMonths(theYear);
      break;

    case 'year':
      self.buildYears(theYear);
      break;
  }};

// 向前翻页
theTool.gotoPrev = function() {
  const self = this;
  const selects = self.getSelects(['year', 'month']);

  switch (cacheApi.settings.type) {
    case 'date':
    case 'datetime':
      const monthIndex = selects.month.selectedIndex;

      if (monthIndex > 0) {
        selects.month.selectedIndex -= 1;
        self.gotoDate();

      } else if (monthIndex === 0) {
        if (selects.year.selectedIndex > 0) {
          selects.year.selectedIndex -= 1;

          self.rebuildMonthSelect();
          selects.month.selectedIndex = selects.month.length - 1;
          self.gotoDate();
        }      }      break;

    case 'month':
    case 'year':
      if (selects.year.selectedIndex > 0) {
        selects.year.selectedIndex -= 1;
        self.gotoDate();
      }      break;
  }};

// 向后翻页
theTool.gotoNext = function() {
  const self = this;
  const selects = self.getSelects(['year', 'month']);

  switch (cacheApi.settings.type) {
    case 'date':
    case 'datetime':
      const monthIndex = selects.month.selectedIndex;
      const monthMax = selects.month.length - 1;

      if (monthIndex < monthMax) {
        selects.month.selectedIndex += 1;
        self.gotoDate();

      } else if (monthIndex === monthMax) {
        if (selects.year.selectedIndex < selects.year.length - 1) {
          selects.year.selectedIndex += 1;

          self.rebuildMonthSelect();
          selects.month.selectedIndex = 0;
          self.gotoDate();
        }      }      break;

    case 'month':
    case 'year':
      if (selects.year.selectedIndex < selects.year.length - 1) {
        selects.year.selectedIndex += 1;
        self.gotoDate();
      }      break;
  }};

// 显示面板
theTool.showPanel = function() {
  const self = this;

  if (self.delayHide) {
    clearTimeout(self.delayHide);
  }
  const pos = cacheApi.settings.position;

  const winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  const elRect = cacheApi.input.getBoundingClientRect();
  const elWidth = elRect.width;
  const elHeight = elRect.height;
  const elClientTop = elRect.top;
  const elClientLeft = elRect.left;
  const elTop = elClientTop + window.pageYOffset - document.documentElement.clientTop;
  const elLeft = elClientLeft + window.pageXOffset - document.documentElement.clientLeft;

  const panelRect = self.dom.panel.getBoundingClientRect();
  const panelWidth = panelRect.width;
  const panelHeight = panelRect.height;
  let panelTop = ((elClientTop + elHeight + panelHeight) > winHeight) ? elTop - panelHeight : elTop + elHeight;
  let panelLeft = ((elClientLeft + panelWidth) > winWidth) ? elLeft - panelWidth + elWidth : elLeft;

  if (typeof pos === 'string' && pos.length) {
    switch(pos) {
      case 'fixed':
        panelTop = null;
        panelLeft = null;
        break;

      case 'top':
        panelTop = elTop - panelHeight;
        break;

      case 'bottom':
        panelTop = elTop + elHeight;
        break;

      case 'left':
      case 'right':
        panelTop = ((elClientTop + elHeight + panelHeight) > winHeight) ? elTop + elHeight - panelHeight : elTop;
        panelLeft = (pos === 'left') ? elLeft - panelWidth : elLeft + elWidth;
        break;
    }  }
  if (typeof panelTop === 'number' && typeof panelLeft === 'number') {
    self.dom.panel.style.top = panelTop + 'px';
    self.dom.panel.style.left = panelLeft + 'px';
  }
  self.dom.panel.classList.add('show');
};

// 隐藏面板
theTool.hidePanel = function() {
  const self = this;
  self.dom.panel.classList.remove('show');

  self.delayHide = setTimeout(() => {
    self.dom.panel.removeAttribute('style');
  }, 300);
};

// 确认选择
theTool.confirmTime = function() {
  const self = this;
  let value;

  if (cacheApi.settings.type === 'datetime' && typeof self.cacheDate.txt === 'string' && self.cacheDate.txt.length) {
    value = self.cacheDate.txt;

  } else {
    value = [cacheApi.defDate.year, cacheApi.defDate.month, cacheApi.defDate.day].join('-');
  }
  const times = Array(3).fill('00');

  for (let x of self.dom.timeSet.querySelectorAll('select')) {
    switch (x.name) {
      case 'hour':
        times[0] = x.value;
        break;

      case 'mint':
        times[1] = x.value;
        break;

      case 'secs':
        times[2] = x.value;
        break;
    }  }
  value += ' ' + times.join(':');

  cacheApi.setDate(value);
};

// 解除绑定
theTool.detach = function(el) {
  const self = this;

  if (!self.isElement(el)) {
    return;
  }
  const alias = 'id_' + el.dataset.cxCalendarId;
  delete el.dataset.cxCalendarId;

  if (typeof self.bindFuns[alias] === 'function') {
    el.removeEventListener('click', self.bindFuns[alias]);
    delete self.bindFuns[alias];
  }};

document.addEventListener('DOMContentLoaded', () => {
  theTool.init();
});

// 缓存项
let cacheApi;


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
    }  }
  if (!self.input || !self.input.nodeName || self.input.nodeName.toLowerCase() !== 'input') {
    console.warn('[cxCalendar] Not input element.');
    return;
  }
  const maps = {
    baseClass: 'baseClass',
    disableWeek: 'disableWeek',
    disableDay: 'disableDay',
    endDate: 'endDate',
    format: 'format',
    hourStep: 'hourStep',
    language: 'language',
    lockRow: 'lockRow',
    minuteStep: 'minuteStep',
    position: 'position',
    secondStep: 'secondStep',
    startDate: 'startDate',
    type: 'type',
    weekStart: 'weekStart',
    yearNum: 'yearNum',
  };

  // 合并输入框参数
  const inputSettings = {};

  for (let x in maps) {
    if (typeof self.input.dataset[maps[x]] === 'string' && self.input.dataset[maps[x]].length) {
      if (x === 'lockRow') {
        inputSettings[x] = Boolean(parseInt(self.input.dataset[maps[x]], 10));

      } else if (['disableWeek', 'disableDay'].indexOf(x) >= 0) {
        inputSettings[x] = self.input.dataset[maps[x]].split(',');

      } else {
        inputSettings[x] = self.input.dataset[maps[x]];
      }    }  }
  if (Array.isArray(inputSettings.disableWeek)) {
    inputSettings.disableWeek.forEach((val) => {
    });
  }
  self.settings = theTool.extend({}, cxCalendar.defaults, options, inputSettings);
  self.setOptions();

  let alias = 'id_' + self.input.dataset.cxCalendarId;

  if (typeof theTool.bindFuns[alias] === 'function') {
    self.detach(self.input);
  }
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
  }};

picker.prototype.setOptions = function(options) {
  const self = this;
  let maxDate;
  let minDate;
  let defDate;

  if (theTool.isObject(options)) {
    theTool.extend(self.settings, options);
  }
  // 结束日期（默认为当前日期）
  if (theTool.reg.isYear.test(self.settings.endDate)) {
    maxDate = new Date(self.settings.endDate, 11, 31);
  } else {
    maxDate = theTool.parseDate(self.settings.endDate, true);
  }
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
  }
  if (!theTool.isDate(minDate)) {
    minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
  }
  // 若超过结束日期，则设为结束日期的前一年
  if (minDate.getTime() > self.maxDate.time) {
    minDate = new Date(self.maxDate.year - 1, self.maxDate.month - 1, self.maxDate.day);
  }
  minDate.setHours(0, 0, 0, 0);

  self.minDate = {
    year: minDate.getFullYear(),
    month: minDate.getMonth() + 1,
    day: minDate.getDate(),
    time: minDate.getTime()
  };

  // 默认日期
  defDate = theTool.parseDate(self.settings.date, true);

  if (defDate.getTime() < self.minDate.time) {
    defDate = theTool.parseDate(self.minDate.time, true);
  } else if (defDate.getTime() > self.maxDate.time) {
    defDate = theTool.parseDate(self.maxDate.time, true);
  }
  self.defDate = {
    year: defDate.getFullYear(),
    month: defDate.getMonth() + 1,
    day: defDate.getDate(),
    hour: defDate.getHours(),
    mint: defDate.getMinutes(),
    secs: defDate.getSeconds(),
    time: defDate.getTime()
  };

  // 星期的起始位置
  self.settings.weekStart %= 7;

  // 语言配置
  self.language = theTool.getLanguage(self.settings.language);

  // 统计节假日
  if (Array.isArray(self.language.holiday) && self.language.holiday.length) {
    self.holiday = {};

    for (let x of self.language.holiday) {
      self.holiday[x.day] = x.name;
    }
  } else {
    self.holiday = null;
  }};

picker.prototype.show = function() {
  const self = this;
  const value = self.input.value;

  // 默认日期
  if (value && value.length) {
    self.settings.date = value;
    self.setOptions();
  }
  cacheApi = self;

  theTool.buildPanel();
  theTool.showPanel();
};

picker.prototype.hide = function() {
  theTool.hidePanel();
};

picker.prototype.getDate = function(style) {
  const self = this;
  const value = self.input.value;

  if (typeof style !== 'string' || !style.length) {
    style = self.settings.format;
  }
  return theTool.formatDate(style, value);
};

picker.prototype.setDate = function(value) {
  const self = this;
  const oldValue = self.input.value;
  const theDate = theTool.parseDate(value);

  if (!theTool.isDate(theDate)) {
    return;
  }
  let theTime = theDate.getTime();

  if (theTime < self.minDate.time) {
    theTime = self.minDate.time;
  } else if (theTime > self.maxDate.time) {
    theTime = self.maxDate.time;
  }
  const newValue = theTool.formatDate(self.settings.format, theTime);

  if (oldValue !== newValue) {
    self.input.value = newValue;
    self.input.dispatchEvent(self.eventChange);
  }};

picker.prototype.clearDate = function() {
  const self = this;
  const oldValue = self.input.value;

  if (oldValue && oldValue.length) {
    self.input.value = '';
    self.input.dispatchEvent(self.eventChange);
  }};


const cxCalendar = function(el, options, isAttach) {
  const result = new picker(...arguments);

  if (isAttach) {
    return result;
  }};

cxCalendar.attach = function(el, options) {
  return this(el, options, true);
};

cxCalendar.detach = function(el) {
  theTool.detach(el);
};

// 默认值
cxCalendar.defaults = {
  startDate: undefined,   // 开始日期
  endDate: undefined,     // 结束日期
  date: undefined,        // 默认日期
  type: 'date',           // 日期类型
  format: 'Y-m-d',        // 日期值格式
  weekStart: 0,           // 星期开始于周几
  lockRow: false,         // 固定日期的行数
  yearNum: 20,            // 年份每页条数
  hourStep: 1,            // 小时间隔
  minuteStep: 1,          // 分钟间隔
  secondStep: 1,          // 秒间隔
  disableWeek: [],        // 不可选择的日期（星期值）
  disableDay: [],         // 不可选择的日期
  position: undefined,    // 面板位置
  baseClass: undefined,   // 基础样式
  language: undefined     // 语言配置
};

// 默认语言配置
cxCalendar.languages = {
  'default': {
    monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
    holiday: []
  }
};

return cxCalendar;

}));
