/*!
 * cxCalendar
 * 
 * @version 2.0.3
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxCalendar
 * @license Released under the MIT license
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto || window.$);
  };
}(function($) {
  var cxCalendar = {
    dom: {},
    reg: {
      isYear: /^\d{4}$/,
      isTime: /^\d{1,2}(\:\d{1,2}){1,2}$/
    },
    settings: {},
    cacheDate: {},
    isElement: function(o) {
      if (o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
        return true;
      } else {
        return (o && o.nodeType && o.nodeType === 1) ? true : false;
      };
    },
    isJquery: function(o) {
      return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
    },
    isZepto: function(o) {
      return (o && o.length && (typeof Zepto === 'function' || typeof Zepto === 'object') && Zepto.zepto.isZ(o)) ? true : false;
    },
    isInteger: function(value) {
      return typeof value === 'number' && !isNaN(value) && /^\d+$/.test(value);
    },
    isPlainObject: function (obj) {
      if (typeof obj !== 'object' || obj.nodeType || obj !== null && obj !== undefined && obj === obj.window) {
        return false;
      };

      if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
      };

      return true;
    },
    isDateObject: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Date]' && typeof obj.getTime === 'function' && !isNaN(obj.getTime());
    },
  };

  // 补充前置零
  cxCalendar.fillLeadZero = function(value, num) {
    var str = String(value);

    if (str.length < num) {
      str = Array(num - str.length).fill(0).join('') + value;
    };

    return str;
  };

  // 获取当年每月的天数
  cxCalendar.getMonthDays = function(year) {
    var leapYearDay = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 1 : 0;

    return [31, 28 + leapYearDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  };

  // 获取周数
  cxCalendar.getWeekNum = function(dateObj) {
    var self = this;
    var curTime = dateObj.getTime();
    var yearFirstDate = new Date(dateObj.getFullYear(), 0, 1, 0, 0, 0, 0);
    var weekFirstTime = yearFirstDate.getTime();
    var weekDay = yearFirstDate.getDay();
    var weekNum = 0;

    if (weekDay === 0) {
      weekDay = 7;
    };

    var weekOffset = weekDay > 4 ? -1 : 0;

    if (weekDay > 4) {
      weekFirstTime += (8 - weekDay) * 86400000;
    } else {
      weekFirstTime += (1 - weekDay) * 86400000;
    };

    if (curTime < weekFirstTime) {
      weekNum = self.getWeekNum(new Date(dateObj.getFullYear() - 1, 11, 31));
    } else {
      weekNum = Math.floor((curTime - weekFirstTime) / 86400000) + 1;
      weekNum = Math.ceil(weekNum / 7);
    };

    return weekNum;
  };

  /**
   * 解析日期
   * 默认解析 ISO 8601 格式
   * 其他支持格式:
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
   * 连接符 '-' 可替换为 '.' 或 '/'
  **/
  cxCalendar.parseDate = function(value, mustDef) {
    var self = this;
    var theDate = new Date();
    var tags;

    if (self.reg.isYear.test(value)) {
      theDate.setFullYear(parseInt(value, 10));

    } else if (/^\d+$/.test(value) || (typeof value === 'number' && isFinite(value))) {
      theDate.setTime(parseInt(value, 10));

    } else if (typeof value === 'string') {
      if (self.reg.isTime.test(value)) {
        tags = value.split(':');

        if (tags.length === 2) {
          tags.push(0);
        };

        theDate.setHours(tags[0], tags[1], tags[2]);

      } else {
        value = value.replace(/[\.\/]/g, '-');

        if (/^\d{1,2}-\d{1,2}/.test(value)) {
          value = theDate.getFullYear() + '-' + value;
        } else if (/^\d{4}-\d{1,2}$/.test(value)) {
          value += '-1';
        };

        tags = value.split(/[\-\sT\:]/);
        tags[1] = parseInt(tags[1], 10) - 1;

        if (tags.length === 5) {
          tags.push(0);
        };

        theDate.setFullYear.apply(theDate, tags);

        if (tags.length > 3) {
          theDate.setHours.apply(theDate,tags.slice(3));
        };
      };

    } else {
      if (mustDef === true) {
        return theDate;
      } else {
        return null;
      };
    };

    if (!self.isDateObject(theDate) || isNaN(theDate.getTime())) {
      if (mustDef === true) {
        theDate = new Date();
      } else {
        theDate = null;
      };
    };

    return theDate;
  };

  // 格式化日期值
  cxCalendar.formatDate = function(style, time) {
    var self = this;
    var date = self.parseDate(time);
    var attr = {};

    if (!date || typeof style !== 'string') {
      return time;
    };

    attr.Y = date.getFullYear();
    attr.y = attr.Y.toString(10).slice(-2);
    attr.n = date.getMonth() + 1;
    attr.m = self.fillLeadZero(attr.n, 2);
    attr.j = date.getDate();
    attr.d = self.fillLeadZero(attr.j, 2);

    attr.G = date.getHours();
    attr.H = self.fillLeadZero(attr.G, 2);
    attr.g = attr.G > 12 ? attr.G - 12 : attr.G;
    attr.h = self.fillLeadZero(attr.g, 2);
    attr.i = self.fillLeadZero(date.getMinutes(), 2);
    attr.s = self.fillLeadZero(date.getSeconds(), 2);

    attr.timestamp = date.getTime();

    var str = style;
    var keys = ['timestamp','Y','y','m','n','d','j','H','h','G','g','i','s'];
    var reg = new RegExp('(' + keys.join('|') + ')', 'g');

    // 转义边界符号
    str = str.replace(/([\{\}])/g, '\\$1');

    // 转义关键词
    str = str.replace(reg, function(match, p1) {
      return '{{' + p1 + '}}';
    });

    // 还原转义字符
    str = str.replace(/\\\{\{(.)\}\}/g, '$1');

    // 替换关键词
    for (var i = keys.length - 1; i >= 0; i--) {
      str = str.replace(new RegExp('{{' + keys[i] + '}}', 'g'), attr[keys[i]]);
    };

    // 还原转义内容
    str = str.replace(/\\(.)/g, '$1');

    return str;
  };

  cxCalendar.init = function() {
    var self = this;

    self.dom.pane = $('<div></div>', {'class': 'cxcalendar'});
    self.dom.head = $('<div></div>', {'class': 'cxcalendar_hd'});
    self.dom.main = $('<div></div>', {'class': 'cxcalendar_bd'}).appendTo(self.dom.pane);
    self.dom.acts = $('<div></div>', {'class': 'cxcalendar_acts'});
    self.dom.blockBg = $('<div></div>', {'class': 'cxcalendar_lock'});

    self.dom.yearSelect = $('<select></select>', {'class': 'year'});
    self.dom.monthSelect = $('<select></select>', {'class': 'month'});

    self.dom.dateSet = $('<ul></ul>');
    self.dom.timeSet = $('<div></div>', {'class': 'times'});

    self.dom.hourSelect = $('<select></select>', {'class': 'hour'});
    self.dom.mintSelect = $('<select></select>', {'class': 'mint'});
    self.dom.secsSelect = $('<select></select>', {'class': 'secs'});

    self.dom.timeSet.append(self.dom.hourSelect).append('<i></i>').append(self.dom.mintSelect).append('<i></i>').append(self.dom.secsSelect).append('<a class="confirm" href="javascript://" rel="confirm"></a>');

    document.addEventListener('DOMContentLoaded', function() {
      $('body').append(self.dom.pane).append(self.dom.blockBg);
    });

    // 关闭面板
    self.dom.blockBg.on('click', function() {
      self.hidePane();
    });

    self.dom.pane.on('click', 'a', function(event) {
      event.preventDefault();
      var _this = this;

      switch (_this.rel) {
        case 'prev':
          self.gotoPrev();
          break;

        case 'next':
          self.gotoNext();
          break;

        case 'today':
          self.hidePane();
          self.setDate(new Date().getTime());
          break;

        case 'clear':
          self.hidePane();
          self.clearDate();
          break;

        case 'confirm':
          var _value;

          if (self.settings.type === 'datetime' && typeof self.cacheDate.txt === 'string' && self.cacheDate.txt.length) {
            _value = self.cacheDate.txt;

          } else {
            _value = [self.defDate.year, self.defDate.month, self.defDate.day].join('-');
          };

          _value += ' ' + [self.dom.hourSelect.val(), self.dom.mintSelect.val(), self.dom.secsSelect.val()].join(':');

          self.hidePane();
          self.setDate(_value);
          break;

        // not undefined
      };
    });

    // 选择年月
    self.dom.pane.on('change', 'select', function() {
      var _this = this;
      var name = _this.getAttribute('class') || _this.getAttribute('classname');

      if (name === 'year' || name === 'month') {
        if (name === 'year' && (self.settings.type === 'date' || self.settings.type === 'datetime')) {
          self.rebulidMonthSelect();
        };

        self.gotoDate();
      };
    });

    // 选择日期
    self.dom.pane.on('click', 'li', function() {
      var li = $(this);
      var date = li.data('date');

      if (!date) {return};

      li.addClass('selected').siblings('li').removeClass('selected');

      if (self.settings.type === 'datetime') {
        var dateSp = date.split('-');

        self.cacheDate = {
          year: parseInt(dateSp[0], 10),
          month: parseInt(dateSp[1], 10),
          day: parseInt(dateSp[2], 10),
          txt: date
        };
        return;
      };

      if (self.settings.type === 'month') {
        date += '-1';
      };

      self.hidePane();
      self.setDate(date);
    });
  };

  // 获取语言配置
  cxCalendar.getLanguage = function(name) {
    var self = this;

    if (self.isPlainObject(name)) {
      return name;
    };

    if (typeof name !== 'string') {
      if (typeof navigator.language === 'string') {
        name = navigator.language;
      } else if (typeof navigator.browserLanguage === 'string') {
        name = navigator.browserLanguage;
      };
    };

    if (typeof name === 'string') {
      name = name.toLowerCase();
    };

    if (typeof name === 'string' && typeof $.cxCalendar.languages[name] === 'object') {
      return $.cxCalendar.languages[name];
    } else {
      return $.cxCalendar.languages['default'];
    };
  };

  // 配置参数
  cxCalendar.setOptions = function(opts) {
    var self = this;
    var now = new Date();
    var minDate;
    var maxDate;
    var defDate;

    if (self.isPlainObject(opts)) {
      self.settings = $.extend({}, $.cxCalendar.defaults, opts);
    };

    // 结束日期（默认为当前日期）
    if (self.reg.isYear.test(self.settings.endDate)) {
      maxDate = new Date(self.settings.endDate, 11, 31);
    } else {
      maxDate = self.parseDate(self.settings.endDate, true);
    };

    maxDate.setHours(23, 59, 59);

    self.maxDate = {
      year: maxDate.getFullYear(),
      month: maxDate.getMonth() + 1,
      day: maxDate.getDate(),
      time: maxDate.getTime()
    };

    // 起始日期（默认为当前日期的前一年）
    if (self.reg.isYear.test(self.settings.startDate)) {
      minDate = new Date(self.settings.startDate, 0, 1);
    } else {
      minDate = self.parseDate(self.settings.startDate);
    };

    if (!self.isDateObject(minDate)) {
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

    // 默认日期
    defDate = self.parseDate(self.settings.date, true);

    if (defDate.getTime() < self.minDate.time) {
      defDate = self.parseDate(self.minDate.time, true);
    } else if (defDate.getTime() > self.maxDate.time) {
      defDate = self.parseDate(self.maxDate.time, true);
    };

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
    self.settings.wday %= 7;
    self.settings.saturday = 6 - self.settings.wday;
    self.settings.sunday = (7 - self.settings.wday) % 7;

    // 语言配置
    self.language = self.getLanguage(self.settings.language);

    // 统计节假日
    if (Array.isArray(self.language.holiday) && self.language.holiday.length) {
      self.holiday = {};

      for (var i = 0, l = self.language.holiday.length; i < l; i++) {
        self.holiday[self.language.holiday[i].day] = self.language.holiday[i].name;
      };

    } else {
      self.holiday = null;
    };
  };

  // 创建面板
  cxCalendar.buildPane = function() {
    var self = this;
    var yearOptions;
    var yearValue = self.defDate.year;
    var html;

    self.dom.head.empty();
    self.dom.main.empty();
    self.dom.acts.empty();

    // 基础样式
    var _class = 'cxcalendar';

    if (typeof self.settings.baseClass === 'string') {
      _class += ' ' + self.settings.baseClass
    };

    self.dom.pane.attr('class', _class);

    // 年份选择框
    if (['month', 'date', 'datetime'].indexOf(self.settings.type) >= 0) {
      html = '';

      for (var i = self.minDate.year; i <= self.maxDate.year; i++) {
        html += '<option value="' + i + '">' + i + '</option>';
      };

      self.dom.yearSelect.html(html).val(yearValue);

    } else if (self.settings.type === 'year') {
      var _start = Math.floor(self.minDate.year / 10) * 10;
      var _end;

      html = '';
      for (var i = _start; i <= self.maxDate.year; i += self.settings.yearNum) {
        if (i <= self.defDate.year) {
          yearValue = i;
        };

        _end = i + self.settings.yearNum - 1;

        html += '<option value="' + i + '">' + i + ' - ';

        if (_end < self.maxDate.year) {
          html += _end;
        } else {
          html += self.maxDate.year;
        };

        html += '</option>';
      };

      self.dom.yearSelect.html(html).val(yearValue);
    };

    if (['date', 'datetime'].indexOf(self.settings.type) >= 0) {
      self.dom.head.append(self.dom.yearSelect).append('<em></em>').append(self.dom.monthSelect).append('<em></em>').append('<a class="prev" href="javascript://" rel="prev"></a><a class="next" href="javascript://" rel="next"></a>');
      self.dom.dateSet.attr('class', 'days');
      self.dom.main.append(self.dom.dateSet);
      self.dom.acts.html('<a class="today" href="javascript://" rel="today"></a><a class="clear" href="javascript://" rel="clear"></a>');
      self.dom.pane.prepend(self.dom.head).append(self.dom.acts);


      if (self.settings.type === 'datetime') {
        self.buildTimes();
      };

      self.rebulidMonthSelect();
      self.dom.monthSelect.val(self.defDate.month);
      self.gotoDate([self.defDate.year, self.defDate.month].join('-'));

    } else if (self.settings.type === 'time') {
      self.dom.head.remove();
      self.dom.acts.remove();
      self.buildTimes();

    } else if (self.settings.type === 'month') {
      self.dom.head.append(self.dom.yearSelect).append('<em></em>').append('<a class="prev" href="javascript://" rel="prev"></a><a class="next" href="javascript://" rel="next"></a>');
      self.dom.dateSet.attr('class', 'months');
      self.dom.main.append(self.dom.dateSet);
      self.dom.acts.remove();
      self.dom.pane.prepend(self.dom.head);

      self.gotoDate(self.defDate.year);

    } else if (self.settings.type === 'year') {
      yearOptions = '';

      self.dom.head.append(self.dom.yearSelect).append('<a class="prev" href="javascript://" rel="prev"></a><a class="next" href="javascript://" rel="next"></a>');
      self.dom.dateSet.attr('class', 'years');
      self.dom.main.append(self.dom.dateSet);
      self.dom.acts.remove();
      self.dom.pane.prepend(self.dom.head);
      self.gotoDate(self.defDate.year);
    };
  };

  // 重新构建月份选项
  cxCalendar.rebulidMonthSelect = function() {
    var self = this;
    var year = parseInt(self.dom.yearSelect.val(), 10);
    var month = parseInt(self.dom.monthSelect.val(), 10);
    var start = 1;
    var end = 12;
    var value;
    var html = '';

    if (year === self.minDate.year && year === self.maxDate.year) {
      start = self.minDate.month;
      end = self.maxDate.month;
    } else if (year === self.minDate.year) {
      start = self.minDate.month;
      end = 12;
    } else if (year === self.maxDate.year) {
      start = 1;
      end = self.maxDate.month;
    };

    for (var i = start; i <= end; i++) {
      if (month === i) {
        value = month;
      };

      html += '<option value="' + i + '">' + self.language.monthList[i - 1] + '</option>';
    };

    self.dom.monthSelect.html(html);

    if (value) {
      self.dom.monthSelect.val(value);
    };
  };

  // 构建日期列表
  cxCalendar.buildDays = function(year, month) {
    var self = this;

    if (!self.isInteger(year) || !self.isInteger(month)) {return};

    var theDate = new Date(year, month - 1, 1);
    year = theDate.getFullYear();
    month = theDate.getMonth() + 1;

    if (year < self.minDate.year || (year === self.minDate.year && month < self.minDate.month)) {
      year = self.minDate.year;
      month = self.minDate.month;

    } else if (year > self.maxDate.year || (year === self.maxDate.year && month > self.maxDate.month)) {
      year = self.maxDate.year;
      month = self.maxDate.month;
    };

    var jsMonth = month - 1;
    var monthDays = self.getMonthDays(year);
    var sameMonthDate = new Date(year, jsMonth, 1);
    var nowDate = new Date();
    var nowText = [nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate()].join('-');

    // 获取当月第一天
    var monthFirstDay = sameMonthDate.getDay() - self.settings.wday;
    if (monthFirstDay < 0) {
      monthFirstDay += 7;
    };

    // 自适应或固定行数
    var monthDayMax = self.settings.lockRow ? 42 : Math.ceil((monthDays[jsMonth] + monthFirstDay) / 7) * 7;

    var todayDate;
    var todayYear;
    var todayMonth;
    var todayNum;
    var todayTime;
    var todayText;
    var todayName;
    var classValue;
    var html = '';

    // 星期排序
    for(var i = 0; i < 7; i++) {
      html += '<li class="week'

      // 高亮周末
      if (i === self.settings.saturday) {
        html += ' sat';
      } else if(i === self.settings.sunday) {
        html += ' sun';
      };

      html += '">' + self.language.weekList[(i + self.settings.wday) % 7] + '</li>';
    };

    for (var i = 0; i < monthDayMax; i++) {
      classValue = [];
      todayName = '';
      todayYear = year;
      todayMonth = month;
      todayNum = i - monthFirstDay + 1;
      
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
        };

      } else if (todayNum > monthDays[jsMonth]) {
        classValue.push('other');

        if (todayMonth >= 12) {
          todayYear++;
          todayMonth = 1;
          todayNum = todayNum - monthDays[0];
        } else {
          todayMonth++;
          todayNum -= monthDays[jsMonth];
        };
      };

      todayDate = new Date(todayYear, todayMonth - 1, todayNum);
      todayTime = todayDate.getTime();
      todayText = [todayYear, todayMonth, todayNum].join('-');

      // 高亮选中日期、今天
      if (todayText === self.cacheDate.txt) {
        classValue.push('selected');
      } else if (todayText === nowText) {
        classValue.push('now');
      };

      // 高亮周末
      if (i % 7 === self.settings.saturday) {
        classValue.push('sat');
      } else if (i % 7 === self.settings.sunday) {
        classValue.push('sun');
      };

      // 超出范围的无效日期
      if (todayTime < self.minDate.time || todayTime > self.maxDate.time) {
        classValue.push('del');

      // 不可选择的日期（星期）
      } else if (Array.isArray(self.settings.disableWeek) && self.settings.disableWeek.length && self.settings.disableWeek.indexOf((i + self.settings.wday) % 7) >= 0) {
        classValue.push('del');

      // 不可选择的日期
      } else if (Array.isArray(self.settings.disableDay) && self.settings.disableDay.length) {
        if (self.settings.disableDay.indexOf(String(todayNum)) >= 0 || self.settings.disableDay.indexOf(todayMonth + '-' + todayNum) >= 0 || self.settings.disableDay.indexOf(todayYear + '-' + todayMonth + '-' + todayNum) >= 0) {
          classValue.push('del');
        };
      };

      // 判断是否有节假日
      if (self.holiday) {
        if (typeof self.holiday['M' + todayMonth + '-' + todayNum] === 'string') {
          classValue.push('holiday');
          todayName = self.holiday['M' + todayMonth + '-' + todayNum];
        } else if (typeof self.holiday['D' + todayYear + '-' + todayMonth + '-' + todayNum] === 'string') {
          classValue.push('holiday');
          todayName = self.holiday['D' + todayYear + '-' + todayMonth + '-' + todayNum];
        };
      };


      html += '<li';

      if (classValue.length) {
        html += ' class="' + classValue.join(' ') + '"';
      };

      if (classValue.indexOf('del') === -1) {
        html += ' data-date="' + todayText + '"';
      };

      if (todayName.length) {
        html += ' data-title="' + todayName + '"';
      };

      if (i % 7 === 0) {
        html += ' data-week-num="' + self.getWeekNum(todayDate) + '"';
      };

      html += '>' + todayNum + '</li>';
    };

    self.dom.dateSet.html(html);
    self.dom.yearSelect.val(year);
    self.dom.monthSelect.val(month);
  };

  // 构建时间选择
  cxCalendar.buildTimes = function() {
    var self = this;
    var hourOptions = '';
    var mintOptions = '';
    var secsOptions = '';
    var hourValue;
    var mintValue;
    var secsValue;
    var optionValue;

    for (var i = 0; i < 24; i += self.settings.hourStep) {
      if (i <= self.defDate.hour) {
        hourValue = i;
      };

      optionValue = i < 10 ? '0' + String(i) : i;
      hourOptions += '<option value="' + optionValue + '">' + optionValue + '</option>';
    };

    for (var i = 0; i < 60; i += self.settings.minuteStep) {
      if (i <= self.defDate.mint) {
        mintValue = i;
      };

      optionValue = i < 10 ? '0' + String(i) : i;
      mintOptions += '<option value="' + optionValue + '">' + optionValue + '</option>';
    };

    for (var i = 0; i < 60; i += self.settings.secondStep) {
      if (i <= self.defDate.secs) {
        secsValue = i;
      };

      optionValue = i < 10 ? '0' + String(i) : i;
      secsOptions += '<option value="' + optionValue + '">' + optionValue + '</option>';
    };

    hourValue = self.fillLeadZero(hourValue, 2);
    mintValue = self.fillLeadZero(mintValue, 2);
    secsValue = self.fillLeadZero(secsValue, 2);

    self.dom.hourSelect.html(hourOptions).val(hourValue);
    self.dom.mintSelect.html(mintOptions).val(mintValue);
    self.dom.secsSelect.html(secsOptions).val(secsValue);

    self.dom.main.append(self.dom.timeSet);
  };

  // 构建月份列表
  cxCalendar.buildMonths = function(year) {
    var self = this;
    var start = 1;
    var end = 12;
    var classValue;
    var todayText;
    var html = '';

    if (!self.isInteger(year)) {return};

    var nowDate = new Date();
    var nowText = [nowDate.getFullYear(), nowDate.getMonth() + 1].join('-');
    var selectedText = [self.cacheDate.year, self.cacheDate.month].join('-');

    for (var i = start; i <= end; i++) {
      todayText = year + '-' + i;
      classValue = [];

      if (todayText === nowText) {
        classValue.push('now');
      };

      if (todayText === selectedText) {
        classValue.push('selected');
      };

      if ((year === self.minDate.year && i < self.minDate.month) || (year === self.maxDate.year && i > self.maxDate.month)) {
        classValue.push('del');
      };

      html += '<li';

      if (classValue.length) {
        html += ' class="' + classValue.join(' ') + '"';
      };

      if (classValue.indexOf('del') === -1) {
        html += ' data-date="' + todayText + '"';
      };

      html += '>' + self.language.monthList[i - 1] + '</li>';
    };

    self.dom.dateSet.html(html);
  };

  // 构建年份列表
  cxCalendar.buildYears = function(year) {
    var self = this;
    var start = self.minDate.year;
    var end;
    var diff;
    var classValue;
    var html = '';

    if (!self.isInteger(year)) {return};

    var yearValue = parseInt(self.dom.yearSelect.val(), 10);
    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();

    if (year < self.minDate.year) {
      start = self.minDate.year;
    } else if (year > self.maxDate.year) {
      start = self.maxDate.year;
    };

    start = Math.floor(start / 10) * 10;
    diff = year - start;

    if (diff >= self.settings.yearNum) {
      start += Math.floor(diff / self.settings.yearNum) * self.settings.yearNum;
    };

    end = start + self.settings.yearNum - 1;

    if (end > self.maxDate.year) {
      end = self.maxDate.year;
    };

    if (yearValue !== start) {
      self.dom.yearSelect.val(start);
    };

    for (var i = start; i <= end; i++) {
      classValue = [];

      if (i === nowYear) {
        classValue.push('now');
      };

      if (i === self.cacheDate.year) {
        classValue.push('selected');
      };

      if (i < self.minDate.year) {
        classValue.push('del');
      };

      html += '<li';

      if (classValue.length) {
        html += ' class="' + classValue.join(' ') + '"';
      };

      if (classValue.indexOf('del') === -1) {
        html += ' data-date="' + i + '"';
      };

      html += '>' + i + '</li>';
    };

    self.dom.dateSet.html(html);
  };

  // 向前翻页
  cxCalendar.gotoPrev = function() {
    var self = this;
    var monthIndex;

    switch (self.settings.type) {
      case 'date':
      case 'datetime':
        monthIndex = self.dom.monthSelect[0].selectedIndex;

        if (monthIndex > 0) {
          self.dom.monthSelect[0].selectedIndex -= 1;
          self.dom.monthSelect.trigger('change');

        } else if (monthIndex === 0) {
          if (self.dom.yearSelect[0].selectedIndex > 0) {
            self.dom.yearSelect[0].selectedIndex -= 1;

            self.rebulidMonthSelect();
            self.dom.monthSelect[0].selectedIndex = self.dom.monthSelect[0].length - 1;
            self.dom.monthSelect.trigger('change');
          };
        };
        break;

      case 'month':
      case 'year':
        if (self.dom.yearSelect[0].selectedIndex > 0) {
          self.dom.yearSelect[0].selectedIndex -= 1;
          self.dom.yearSelect.trigger('change');
        };
        break;
    };
  };

  // 向后翻页
  cxCalendar.gotoNext = function() {
    var self = this;
    var monthIndex;
    var monthMax;

    switch (self.settings.type) {
      case 'date':
      case 'datetime':
        monthIndex = self.dom.monthSelect[0].selectedIndex;
        monthMax = self.dom.monthSelect[0].length - 1;

        if (monthIndex < monthMax) {
          self.dom.monthSelect[0].selectedIndex += 1;
          self.dom.monthSelect.trigger('change');

        } else if (monthIndex === monthMax) {
          if (self.dom.yearSelect[0].selectedIndex < self.dom.yearSelect[0].length - 1) {
            self.dom.yearSelect[0].selectedIndex += 1;

            self.rebulidMonthSelect();
            self.dom.monthSelect[0].selectedIndex = 0;
            self.dom.monthSelect.trigger('change');
          };
        };
        break;

      case 'month':
      case 'year':
        if (self.dom.yearSelect[0].selectedIndex < self.dom.yearSelect[0].length - 1) {
          self.dom.yearSelect[0].selectedIndex += 1;
          self.dom.yearSelect.trigger('change');
        };
        break;
    };
  };

  // 跳转到日期
  cxCalendar.gotoDate = function(value) {
    var self = this;
    var yearValue = parseInt(self.dom.yearSelect.val(), 10);
    var monthValue = parseInt(self.dom.monthSelect.val(), 10);
    var theDate;
    var theYear;
    var theMonth;

    if (value === undefined) {
      theYear = yearValue;
      theMonth = monthValue;
    } else {
      theDate = self.parseDate(value, true);
      theYear = theDate.getFullYear();
      theMonth = theDate.getMonth() + 1;

      if (theYear !== yearValue || theMonth !== monthValue) {
        self.rebulidMonthSelect();
        self.dom.monthSelect.val(theMonth);
      };
    };

    switch (self.settings.type) {
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
    };
  };

  // 获取当前选中日期
  cxCalendar.getDate = function(style) {
    var self = this;
    var value = self.cacheInput.val();

    if (typeof style !== 'string' || !style.length) {
      style = self.settings.format;
    };

    value = self.formatDate(style, value);

    return value;
  };

  // 设置日期
  cxCalendar.setDate = function(value) {
    var self = this;
    var theDate = self.parseDate(value);

    if (!self.isDateObject(theDate)) {return};

    var theYear = theDate.getFullYear();
    var theMonth = theDate.getMonth() + 1;
    var theDay = theDate.getDate();
    var theTime = theDate.getTime();

    if (theTime < self.minDate.time) {
      theTime = self.minDate.time;
    } else if (theTime > self.maxDate.time) {
      theTime = self.maxDate.time;
    };

    // if (self.settings.type === 'year' && (theYear < self.minDate.year || theYear > self.maxDate.year)) {
    //   return;
    // } else if (self.settings.type === 'month' && ((theYear === self.minDate.year && theMonth < self.minDate.month) || (theYear === self.maxDate.year && theMonth > self.maxDate.month))) {
    //   return;

    // } else if ((self.settings.type === 'date' || self.settings.type === 'datetime') && (theTime < self.minDate.time || theTime > self.maxDate.time)) {
    //   return;
    // };

    var theValue = self.formatDate(self.settings.format, theTime);

    self.cacheInput.val(theValue).trigger('change');
  };
  
  // 清除日期
  cxCalendar.clearDate = function() {
    var self = this;
    self.cacheInput.val('');
  };

  // 隐藏日期选择器
  cxCalendar.showPane = function() {
    var self = this;
    var pos = self.settings.position;

    var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    var paneWidth = self.dom.pane.width();
    var paneHeight = self.dom.pane.height();

    var elRect = self.cacheInput[0].getBoundingClientRect();
    var clientTop = elRect.top;
    var clientLeft = elRect.left;
    var elWidth = elRect.width;
    var elHeight = elRect.height;

    var elTop = clientTop + window.pageYOffset - document.documentElement.clientTop;
    var elLeft = clientLeft + window.pageXOffset - document.documentElement.clientLeft;

    var paneTop = ((clientTop + elHeight + paneHeight) > winHeight) ? elTop - paneHeight : elTop + elHeight;
    var paneLeft = ((clientLeft + paneWidth) > winWidth) ? elLeft - paneWidth + elWidth : elLeft;

    if (typeof pos === 'string' && pos.length) {
      switch(pos) {
        case 'fixed':
          paneTop = null;
          paneLeft = null;
          break

        case 'top':
          paneTop = elTop - paneHeight;
          break

        case 'bottom':
          paneTop = elTop + elHeight;
          break

        case 'left':
        case 'right':
          paneTop = ((clientTop + elHeight + paneHeight) > winHeight) ? elTop + elHeight - paneHeight : elTop;
          paneLeft = (pos === 'left') ? elLeft - paneWidth : elLeft + elWidth;
          break

        // not default
      };
    };

    if (typeof paneTop === 'number' && typeof paneLeft === 'number') {
      self.dom.pane.css({
        'top': paneTop,
        'left': paneLeft
      });
    };

    self.dom.pane.addClass('show');
    self.dom.blockBg.addClass('show');
  };

  // 隐藏日期选择器
  cxCalendar.hidePane = function() {
    var self = this;
    self.dom.pane.removeClass('show');
    self.dom.blockBg.removeClass('show');

    self.delayHide = setTimeout(function() {
      self.dom.pane.removeAttr('style');
    }, 300);
  };

  cxCalendar.show = function(el, settings) {
    var self = this;

    if (self.delayHide) {
      clearTimeout(self.delayHide);
    };

    if (!self.isPlainObject(settings)) {
      settings = {};
    };

    self.cacheDate = {};
    self.cacheInput = el;

    var _value = self.cacheInput.val();

    // 默认日期
    if (_value && _value.length) {
      var theDate = self.parseDate(_value);

      if (self.isDateObject(theDate)) {
        settings.date = _value;

        self.cacheDate = {
          year: theDate.getFullYear(),
          month: theDate.getMonth() + 1,
          day: theDate.getDate(),
        };
        self.cacheDate.txt = [self.cacheDate.year, self.cacheDate.month, self.cacheDate.day].join('-');
      };
    };

    self.setOptions(settings);
    self.buildPane();
    self.showPane();
  };

  $.cxCalendar = function() {
    var self = this;
    var input;
    var settings;
    var callback;
    var isAttach = false;

    // 分配参数
    for (var i = 0, l = arguments.length; i < l; i++) {
      if (cxCalendar.isJquery(arguments[i]) || cxCalendar.isZepto(arguments[i])) {
        input = arguments[i];
      } else if (cxCalendar.isElement(arguments[i])) {
        input = $(arguments[i]);
      } else if (typeof arguments[i] === 'function') {
        callback = arguments[i];
      } else if (typeof arguments[i] === 'object') {
        settings = arguments[i];
      } else if (typeof arguments[i] === 'boolean') {
        isAttach = arguments[i];
      };
    };

    if (!input.length) {return};

    // 合并输入框参数
    var inputSettings = {
      startDate: input.data('startDate'),
      endDate: input.data('endDate'),
      type: input.data('type'),
      format: input.data('format'),
      wday: input.data('wday'),
      yearNum: input.data('yearNum'),
      hourStep: input.data('hourStep'),
      minuteStep: input.data('minuteStep'),
      secondStep: input.data('secondStep'),
      disableWeek: input.data('disableWeek'),
      disableDay: input.data('disableDay'),
      position: input.data('position'),
      baseClass: input.data('baseClass'),
      language: input.data('language'),
    };

    if (parseInt(input.data('lockRow'), 10) === 1) {
      inputSettings.lockRow = true;
    };

    // 不可选择的日期
    if (typeof inputSettings.disableWeek === 'string' && inputSettings.disableWeek.length && /^[\d\,]+$/.test(inputSettings.disableWeek)) {
      inputSettings.disableWeek = inputSettings.disableWeek.split(',');

      for (var i = 0, l = inputSettings.disableWeek.length; i < l; i++) {
        inputSettings.disableWeek[i] = parseInt(inputSettings.disableWeek[i], 10);
      };
    } else {
      inputSettings.disableWeek = undefined;
    };

    if (typeof inputSettings.disableDay === 'string' && inputSettings.disableDay.length && /^[\d\-\,]+$/.test(inputSettings.disableDay)) {
      inputSettings.disableDay = inputSettings.disableDay.split(',');
    } else {
      inputSettings.disableDay = undefined;
    };

    for (var x in inputSettings) {
      if (inputSettings[x] === undefined) {
        delete inputSettings[x];
      };
    };

    settings = $.extend({}, $.cxCalendar.defaults, settings, inputSettings);

    if (isAttach) {
      input.on('focus', function() {
        cxCalendar.show(input, settings);
      });
    } else {
      cxCalendar.show(input, settings);
    };

    if (typeof callback === 'function') {
      var api = function(input, settings){
        return {
          setOptions: function(opts) {
            settings = $.extend(settings, opts);
          },
          show: function() {
            cxCalendar.show(input, settings);
          },
          hide: function() {
            cxCalendar.hidePane();
          },
          getDate: function(style) {
            cxCalendar.cacheInput = input;
            return cxCalendar.getDate(style);
          },
          setDate: function(value) {
            cxCalendar.cacheInput = input;
            cxCalendar.setOptions(settings);
            cxCalendar.setDate(value);
          },
          clearDate: function() {
            cxCalendar.cacheInput = input;
            cxCalendar.clearDate();
          }
        };
      };

      callback(api(input, settings));
    };

    return this;
  };

  // 默认值
  $.cxCalendar.defaults = {
    startDate: undefined,   // 开始日期
    endDate: undefined,     // 结束日期
    date: undefined,        // 默认日期
    type: 'date',           // 日期类型
    format: 'Y-m-d',        // 日期值格式
    wday: 0,                // 星期开始于周几
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
  $.cxCalendar.languages = {
    'default': {
      monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      holiday: []
    }
  };

  $.fn.cxCalendar = function(settings, callback) {
    this.each(function(i) {
      $.cxCalendar(this, settings, callback, true);
    });
    return this;
  };

  cxCalendar.init();
}));