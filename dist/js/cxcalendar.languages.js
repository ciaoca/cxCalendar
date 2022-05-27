/**
 * cxCalendar 多语言配置
 * @type {Object}
 * 
 * 配置多种语言可以让浏览器自动适配，语言名称使用小写
 * 浏览器语言参考
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/language
 */
cxCalendar.languages = {
  /**
   * 如果只使用一种语言，可以只保留 default
   * 当无法自动适配时，将使用 default 的配置
   */
  'default': {
    am: '上午',
    pm: '下午',
    monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
    holiday: []
  },

  // English
  'en': {
    am: 'AM',
    pm: 'PM',
    monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekList: ['Sun', 'Mon', 'Tur', 'Wed', 'Thu', 'Fri', 'Sat'],
    holiday: []
  },

  // Japanese
  'ja': {
    am: '午前',
    pm: '午後',
    monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    weekList: ['日', '月', '火', '水', '木', '金', '土'],
    holiday: []
  },

  // 简体中文
  'zh-cn': {
    am: '上午',
    pm: '下午',
    monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
    holiday: [
      // {day: '1-1', name: '元旦'},
      // {day: '2-14', name: '情人节'},
      // {day: '3-5', name: '学雷锋纪念日'},
      // {day: '3-8', name: '妇女节'},
      // {day: '3-12', name: '植树节'},
      // {day: '3-14', name: '白色情人节'},
      // {day: '3-15', name: '消费者权益日'},
      // {day: '4-1', name: '愚人节'},
      // {day: '5-1', name: '劳动节'},
      // {day: '5-4', name: '青年节'},
      // {day: '5-12', name: '护士节'},
      // {day: '6-1', name: '儿童节'},
      // {day: '8-1', name: '建党节'},
      // {day: '8-1', name: '建军节'},
      // {day: '9-10', name: '教师节'},
      // {day: '10-1', name: '国庆节'},
      // {day: '11-1', name: '万圣节'},
      // {day: '12-25', name: '圣诞节'},
      // {day: '2021-1-5', name: '小寒'},
      // {day: '2021-1-20', name: '大寒'},
      // {day: '2021-2-3', name: '立春'},
      // {day: '2021-2-4', name: '小年'},
      // {day: '2021-2-11', name: '除夕'},
      // {day: '2021-2-12', name: '春节'},
      // {day: '2021-2-18', name: '雨水'},
      // {day: '2021-2-26', name: '元宵节'},
      // {day: '2021-3-5', name: '惊蛰'},
      // {day: '2021-3-20', name: '春分'},
      // {day: '2021-4-4', name: '清明'},
      // {day: '2021-4-20', name: '谷雨'},
      // {day: '2021-4-22', name: '地球日'},
      // {day: '2021-5-5', name: '立夏'},
      // {day: '2021-5-9', name: '母亲节'},
      // {day: '2021-5-21', name: '小满'},
      // {day: '2021-6-5', name: '芒种'},
      // {day: '2021-6-14', name: '端午节'},
      // {day: '2021-6-20', name: '父亲节'},
      // {day: '2021-6-21', name: '夏至'},
      // {day: '2021-7-7', name: '小暑'},
      // {day: '2021-7-22', name: '大暑'},
      // {day: '2021-8-7', name: '立秋'},
      // {day: '2021-8-14', name: '七夕'},
      // {day: '2021-8-22', name: '中元节'},
      // {day: '2021-8-23', name: '处暑'},
      // {day: '2021-9-7', name: '白露'},
      // {day: '2021-9-21', name: '中秋节'},
      // {day: '2021-9-23', name: '秋分'},
      // {day: '2021-10-8', name: '寒露'},
      // {day: '2021-10-14', name: '重阳节'},
      // {day: '2021-10-23', name: '霜降'},
      // {day: '2021-11-7', name: '立冬'},
      // {day: '2021-11-22', name: '小雪'},
      // {day: '2021-11-25', name: '感恩节'},
      // {day: '2021-12-7', name: '大雪'},
      // {day: '2021-12-21', name: '冬至'}
    ]
  }
};