import './style.css';
import theTool from './tool.js';
import picker from './picker.js';

const cxCalendar = function(el, options, isAttach) {
  if (theTool.isObject(options)) {
    options = theTool.extend({}, cxCalendar.defaults, options);
  } else {
    options = theTool.extend({}, cxCalendar.defaults);
  };

  const result = new picker(el, options, isAttach);

  if (isAttach) {
    return result;
  };
};

cxCalendar.attach = function(el, options) {
  return this(el, options, true);
};

cxCalendar.detach = function(el) {
  theTool.detach(el);
};

// 默认配置
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
  mode: 'single',         // 选择模式
  rangeSymbol: ' - ',     // 日期范围拼接符号
  rangeMaxDay: 0,         // 日期范围最长间隔
  rangeMaxMonth: 0,       // 月份范围最长间隔
  rangeMaxYear: 0,        // 年份范围最长间隔
  button: {},             // 操作按钮
  position: undefined,    // 面板位置
  baseClass: undefined,   // 基础样式
  language: undefined     // 语言配置
};

export default cxCalendar;