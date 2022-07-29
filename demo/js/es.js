import cxCalendar from '../../dist/js/cxcalendar.es.js';

// cxCalendar.defaults.mode = 'range';
// cxCalendar.defaults.rangeSymbol = ' 至 ';
// cxCalendar.defaults.rangeMaxDay = 7;
// cxCalendar.defaults.rangeMaxMonth = 3;
// cxCalendar.defaults.rangeMaxYear = 2;

const nowDate = new Date();
const doms = {};
const list = [
  {title: '日期', type: 'date', format: 'Y-m-d'},
  {title: '日期和时间', type: 'datetime', format: 'Y-m-d H:i:s'},
  {title: '年份', type: 'year', format: 'Y'},
  {title: '月份', type: 'month', format: 'Y-m'},
  {title: '时间', type: 'time', format: 'H:i:s'},
];
let theApi;
const apiOptions = {
  mode: '',
  rangeSymbol: ' - ',
};

const start = () => {
  doms.demo = document.getElementById('demo');
  doms.apiInput = document.getElementById('date_api');
  doms.apiActs = document.getElementById('api_acts');

  for (let x of list) {
    addItem(x);
  };

  attach();
  bindEvents();
};

const bindEvents = () => {
  doms.apiInput.addEventListener('change', (e) => {
    console.log('api-change-event');
  });

  doms.apiActs.addEventListener('click', (e) => {
    const el = e.target;
    const nodeName = el.nodeName.toLowerCase();

    if (nodeName === 'a' && el.rel) {
      const rel = el.rel;
      const rev = el.rev;
      let opts;
    
      switch (rel) {
        case 'show':
          theApi.show();
          break;

        case 'get':
          const value = theApi.getDate();
          console.log('getDate:', value);
          break;

        case 'set':
          if (apiOptions.mode === 'range') {
            opts = [nowDate.getFullYear(), getRandomNumber(1, 6), getRandomNumber(1, 31)].join('/');
            opts += apiOptions.rangeSymbol;
            opts += [nowDate.getFullYear(), getRandomNumber(7, 12), getRandomNumber(1, 31)].join('/');

          } else {
            opts = [nowDate.getFullYear(), getRandomNumber(1, 12), getRandomNumber(1, 31)].join('/');
          };

          console.log('setDate:', opts);
          theApi.setDate(opts);
          break;

        case 'clear':
          theApi.clearDate();
          break;

        case 'mode':
          apiOptions.mode = rev;
          theApi.setOptions({
            mode: rev
          });
          theApi.show();
          break;

        case 'type':
          opts = {
            type: rev
          };

          switch (rev) {
            case 'year':
              opts.format = 'Y';
              break;

            case 'month':
              opts.format = 'Y-m';
              break;

            case 'datetime':
              opts.format = 'Y-m-d H:i:s';
              break;

            case 'time':
              opts.format = 'H:i:s';
              break;

            default:
              opts.format = 'Y-m-d';
              break;
          };

          theApi.setOptions(opts);
          theApi.show();
          break;

        case 'lang':
          opts = {
            language: rev,
            baseClass: ''
          };

          if (rev !== 'zh-cn') {
            opts.baseClass = 'en';
          };

          theApi.setOptions(opts);
          theApi.show();
          break;

        case 'attach':
          attach();
          break;

        case 'detach':
          cxCalendar.detach(doms.apiInput);
          theApi = null;
          break;
      };
    }
  });

  doms.demo.addEventListener('click', (e) => {
    const el = e.target;
    const nodeName = el.nodeName.toLowerCase();

    if (nodeName === 'a' && el.rel) {
      const rel = el.rel;

      if (['add', 'remove'].indexOf(rel) >= 0) {
        event.preventDefault();

        if (rel === 'add') {
          addItem(list[Math.floor(Math.random() * list.length)]);

        } else if (rel === 'remove') {
          removeItem();
        };
      };

    } else if (nodeName === 'input') {
      cxCalendar(el);
    };
  });
};

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const attach = () => {
  theApi = cxCalendar.attach(doms.apiInput, {
    startDate: nowDate.getFullYear() - 1,
    endDate: nowDate.getFullYear() + 1,
  });
  console.log(theApi);
};

const addItem = (data) => {
  doms.demo.insertAdjacentHTML('beforeend', '<section><label>选择' + data.title + '：</label><input type="text" readonly data-type="' + data.type + '" data-format="' + data.format + '"></section>');
};

const removeItem = () => {
  const el = doms.demo.querySelectorAll('section');

  if (el.length) {
    doms.demo.removeChild(el[el.length - 1]);
  };
};

document.addEventListener('DOMContentLoaded', () => {
  start();
});