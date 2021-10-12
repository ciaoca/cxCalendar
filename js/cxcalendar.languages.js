/**!
 * cxCalendar Multi-Language Configure
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxCalendar
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto || window.$);
  };
}(function($) {
  $.extend($.cxCalendar.languages, {
    // Default
    // 默认为中文，可以在此设定替换默认语言
    // 'default': {
    //   monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    //   weekList: ['日', '一', '二', '三', '四', '五', '六'],
    //   holiday: []
    // },

    // English
    'en': {
      monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekList: ['Sun', 'Mon', 'Tur', 'Wed', 'Thu', 'Fri', 'Sat'],
      holiday: []
    },

    // Japanese
    'ja': {
      monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      weekList: ['日', '月', '火', '水', '木', '金', '土'],
      holiday: []
    },

    // Chinese
    'zh-cn': {
      monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      holiday: [
        // {day: 'M1-1', name: '元旦'},
        // {day: 'M2-14', name: '情人节'},
        // {day: 'M3-5', name: '学雷锋纪念日'},
        // {day: 'M3-8', name: '妇女节'},
        // {day: 'M3-12', name: '植树节'},
        // {day: 'M3-14', name: '白色情人节'},
        // {day: 'M3-15', name: '消费者权益日'},
        // {day: 'M4-1', name: '愚人节'},
        // {day: 'M5-1', name: '劳动节'},
        // {day: 'M5-4', name: '青年节'},
        // {day: 'M5-12', name: '护士节'},
        // {day: 'M6-1', name: '儿童节'},
        // {day: 'M8-1', name: '建党节'},
        // {day: 'M8-1', name: '建军节'},
        // {day: 'M9-10', name: '教师节'},
        // {day: 'M10-1', name: '国庆节'},
        // {day: 'M11-1', name: '万圣节'},
        // {day: 'M12-25', name: '圣诞节'},
        // {day: 'D2021-1-5', name: '小寒'},
        // {day: 'D2021-1-20', name: '大寒'},
        // {day: 'D2021-2-3', name: '立春'},
        // {day: 'D2021-2-4', name: '小年'},
        // {day: 'D2021-2-11', name: '除夕'},
        // {day: 'D2021-2-12', name: '春节'},
        // {day: 'D2021-2-18', name: '雨水'},
        // {day: 'D2021-2-26', name: '元宵节'},
        // {day: 'D2021-3-5', name: '惊蛰'},
        // {day: 'D2021-3-20', name: '春分'},
        // {day: 'D2021-4-4', name: '清明'},
        // {day: 'D2021-4-20', name: '谷雨'},
        // {day: 'D2021-4-22', name: '地球日'},
        // {day: 'D2021-5-5', name: '立夏'},
        // {day: 'D2021-5-9', name: '母亲节'},
        // {day: 'D2021-5-21', name: '小满'},
        // {day: 'D2021-6-5', name: '芒种'},
        // {day: 'D2021-6-14', name: '端午节'},
        // {day: 'D2021-6-20', name: '父亲节'},
        // {day: 'D2021-6-21', name: '夏至'},
        // {day: 'D2021-7-7', name: '小暑'},
        // {day: 'D2021-7-22', name: '大暑'},
        // {day: 'D2021-8-7', name: '立秋'},
        // {day: 'D2021-8-14', name: '七夕'},
        // {day: 'D2021-8-22', name: '中元节'},
        // {day: 'D2021-8-23', name: '处暑'},
        // {day: 'D2021-9-7', name: '白露'},
        // {day: 'D2021-9-21', name: '中秋节'},
        // {day: 'D2021-9-23', name: '秋分'},
        // {day: 'D2021-10-8', name: '寒露'},
        // {day: 'D2021-10-14', name: '重阳节'},
        // {day: 'D2021-10-23', name: '霜降'},
        // {day: 'D2021-11-7', name: '立冬'},
        // {day: 'D2021-11-22', name: '小雪'},
        // {day: 'D2021-11-25', name: '感恩节'},
        // {day: 'D2021-12-7', name: '大雪'},
        // {day: 'D2021-12-21', name: '冬至'}
      ]
    }
  });
}));