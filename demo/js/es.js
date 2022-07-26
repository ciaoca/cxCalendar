import cxCalendar from '../../dist/js/cxcalendar.es.js';

cxCalendar.defaults.mode = 'range';
cxCalendar.defaults.rangeSymbol = ' 至 ';
cxCalendar.defaults.rangeMaxDay = 7;
cxCalendar.defaults.rangeMaxMonth = 3;
cxCalendar.defaults.rangeMaxYear = 2;

const demo = document.getElementById('demo');
const list = [
  {title: '日期', type: 'date', format: 'Y-m-d'},
  {title: '日期和时间', type: 'datetime', format: 'Y-m-d H:i:s'},
  {title: '年份', type: 'year', format: 'Y'},
  {title: '月份', type: 'month', format: 'Y-m'},
  {title: '时间', type: 'time', format: 'H:i:s'},
];

const addItem = (data) => {
  demo.insertAdjacentHTML('beforeend', '<section><label>选择' + data.title + '：</label><input type="text" readonly data-type="' + data.type + '" data-format="' + data.format + '"></section>');
};

const removeItem = () => {
  const el = demo.querySelectorAll('section');

  if (el.length) {
    demo.removeChild(el[el.length - 1]);
  };
};

document.body.addEventListener('click', (e) => {
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

for (let x of list) {
  addItem(x);
};