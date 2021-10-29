# cxCalendar

cxCalendar 是基于 jQuery 的日期选择器插件，支持日期、时间、月份、年份等多种类型。

它灵活自由，你可以自定义外观，日期的范围，返回的格式等。

同时兼容 Zepto，方便在移动端使用。

> 若从 1.x 版本升级迁移，请查看 [cxCalendar v2.0.0 说明及升级适配](https://github.com/ciaoca/cxCalendar/wiki/cxCalendar-v2.0.0-%E8%AF%B4%E6%98%8E%E5%8F%8A%E5%8D%87%E7%BA%A7%E9%80%82%E9%85%8D)



**版本：**

* jQuery v1.7+ || Zepto v1.0+
* cxCalendar v2.0.2

Demo: https://ciaoca.github.io/cxCalendar/



## 使用方法

### 载入 CSS 文件

```html
<link rel="stylesheet" href="cxcalendar.css">
```

### 载入 JavaScript 文件

```html
<script src="jquery.js"></script>
<script src="cxcalendar.js"></script>
```

### DOM 结构

```html
<input id="element_id" type="text">
```

### 调用 cxCalendar

```javascript
// 方式一：绑定到输入框
$("#element_id").cxCalendar();

// 方式二：动态调用，适合页面中的 input 有可能新增或删除的情况
$('#demo').on('focus', 'input', function(event) {
  $.cxCalendar(this);
});
```

### 设置全局默认值

```javascript
$.cxCalendar.defaults.type = 'datetime';
$.cxCalendar.defaults.language = {
  monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
  weekList: ['Sun', 'Mon', 'Tur', 'Wed', 'Thu', 'Fri', 'Sat'] 
};
```



## 参数说明

名称|默认值|说明
---|---|---
date|undefined|**默认日期**（默认获取当前日期）<br>可使用时间戳或字符串<br>※ input 的 value 值优先级更高
startDate|undefined|**起始日期**（默认获取当前日期的一年前）<br>可使用时间戳或字符串，若设置值为 4 位数字，则转换为当年的1月1日<br>如: 2020 => 2020/1/1
endDate|undefined|**结束日期**（默认获取当前日期）<br>可使用时间戳或字符串，若设置值为 4 位数字，则转换为当年的12月31日<br>如: 2020 => 2020/12/31
type|'date'|**日期类型** <br>`'year'` 年份<br>`'month'` 年份和月份<br>`'date'` 日期<br>`'datetime'` 日期和时间<br>`'time'` 时间
format|'Y-m-d'|**日期值格式** <br>`'Y'` 年份，完整 4 位数字<br>`'y'` 年份，仅末尾 2 位数字<br>`'m'` 月份，数字带前导零（01-12）<br>`'n'` 月份（1-12）<br>`'d'` 月份中的第几天，有前导零（01-31）<br>`'j'` 月份中的第几天（1-31）<br>`'H'` 小时，24 小时格式，有前导零（00-23）<br>`'G'` 小时，24 小时格式（0-23）<br>`'h'` 小时，12 小时格式，有前导零（01-12）<br>`'g'` 小时，12 小时格式（1-12）<br>`'i'` 分钟，数字带前导零（00-59）<br>`'s'` 秒，数字带前导零（00-59）<br>`'timestamp'` 时间戳（毫秒）
wday|0|**星期开始于周几**<br>`0` 星期日<br>`1` 星期一<br>`2` 星期二<br>`3` 星期三<br>`4` 星期四<br>`5` 星期五<br>`6` 星期六
lockRow|false|**是否固定行数**<br />`date` 或 `datetime` 显示日期时，可能会出现 5 行或 6 行<br />默认自适应，设为 `true` 则固定为 6 行
yearNum|20|**年份每页条数**
hourStep|1|**小时间隔**
minuteStep|1|**分钟间隔**
secondStep|1|**秒间隔**
disableWeek|[]|**不可选择的日期（星期值）**<br>`0` 星期日<br/>`1` 星期一<br/>`2` 星期二<br/>`3` 星期三<br/>`4` 星期四<br/>`5` 星期五<br/>`6` 星期六<br>例：`[0,6]` 表示所有周六、周日不可选择
disableDay|[]|**不可选择的日期**<br>`'1'` 每月 1 号<br>`'1-5'` 每年 1 月 5 日<br>`'2020-1-1'` 指定具体日期<br>※ 不要有前导零
position|undefined|**面板显示位置**<br>详见：[[Demo Position](https://ciaoca.github.io/cxCalendar/position.html)]
baseClass|undefined|**自定义 class 名称**<br>仅在面板容器增加 class，不会覆盖默认的 class
language|undefined|**自定义语言**<br>值类型为 `object`  或  `string`<br>若为 `string`，将在语言配置文件中查找对应键名（需载入 `cxcalendar.languages.js` ）

### `date`, `startDate`, `endDate` 的优先级与范围
- 当 `date` 早于 `startDate` 时，则为 `startDate`，晚于 `endDate` 时，则为 `endDate`
- 当 `startDate` 日期晚于 `endDate` 时，调整为 `endDate` 的一年前

### `date`, `startDate`, `endDate` 支持的时间格式

> 日期连接符 `-` 可替换为 `.` 或 `/`  
> 月/日/时/分/秒，可为数字或带有前导零

- `y`
- `y-m`
- `y-m-d`
- `y-m-d h:i`
- `y-m-d h:i:s`
- `m-d`
- `m-d h:i`
- `m-d h:i:s`
- `h:i`
- `h:i:s`


## data 属性参数

名称|说明
---|---
data-start-date|起始日期
data-end-date|结束日期
data-type|日期类型
data-format|日期值格式
data-wday|星期开始于周几
data-year-num|年份每页条数
data-hour-step|小时间隔
data-minute-step|分钟间隔
data-second-step|秒间隔
data-lock-row|是否固定行数，值为 `1` 时固定，例：`data-lock-row="1"`
data-disable-week|不可选择的日期（星期值），例：`data-disable-week="0,6"`
data-disable-day|不可选择的日期，例：`data-disable-day="1,5-2,2021-2-11"`
data-position|面板显示位置
data-base-class|自定义 class 名称
data-language|自定义语言名称（仅支持 `languages` 已配置的键名）

```html
<input id="element_id" type="text" value="2020-12-1" data-start-date="2020" data-end-date="2021" data-format="Y/m/d" data-language="en">
```
※ data 属性设置的参数优先级要高于调用时参数设置的值



## 多语言配置说明

在 `cxcalendar.languages.js` 文件中进行配置，载入即可根据用户的语言环境，自动显示对应的语言。

名称|默认值|说明
---|---|---
monthList|['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']|月份的名称
weekList|['日', '一', '二', '三', '四', '五', '六']|星期的名称（从周日开始排序）
holiday|[]|节假日配置

```javascript
// 自定义语言示例
'zh-cn': {
  monthList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  weekList: ['日', '一', '二', '三', '四', '五', '六'],
  holiday: [
    {day: 'M1-1', name: '元旦'},  // 以 M 开头，指定月日，每年固定重复的节日
    {day: 'D2021-2-12', name: '春节'}  // 以 D 开头，指定具体日期的节日
  ]
}
```



## API 接口

```javascript
var Api;

$('#element_id').cxCalendar(function(api){
  Api = api;
});

// 或者作为第二个参数传入
$('#element_id').cxCalendar({
  type: 'Y/m/d'
}, function(api){
  Api = api;
});
```

名称|说明
---|---
show()|显示面板
hide()|隐藏面板
getDate(style)|获取当前选择的日期（style 格式与参数 format 相同）
setDate(value)|传入一个字符串来设置日期
clearDate()|清除日期值
setOptions(opt)|设置参数
