# cxCalendar

cxCalendar 是基于 JavaScript 的日期选择器插件，支持日期、时间、月份、年份等多种类型。

它灵活自由，你可以自定义外观，日期的范围，返回的格式等。



**优点**

- 无第三方依赖
- 支持单日期、日期范围
- 支持 CSS 自定义样式
- 支持多语言扩展
- 全局仅有一个选择器，不对 DOM 造成污染



Demo: https://ciaoca.github.io/cxCalendar/

> 从 v3.0 开始，已移除 jQuery 的依赖，如果需要使用旧版，可查看 [v2 分支](https://github.com/ciaoca/cxCalendar/tree/v2)。



## 安装方法

### 浏览器端引入

```html
<link rel="stylesheet" href="cxcalendar.css">
<script src="cxcalendar.js"></script>
```



### 从 NPM 安装，作为模块引入

```shell
npm install cxcalendar
```

```javascript
import 'cxcalendar.css';
import cxCalendar from 'cxcalendar';
```



### 使用

```javascript
// 绑定到输入框
cxCalendar.attach(document.getElementById('input'));

// 动态调用，适合 input 可能会新增或删除的情况
document.body.addEventListener('focus', (e) => {
  if (e.target.nodeName.toLowerCase() === 'input') {
    cxCalendar(e.target);
  };
});
```



### 设置默认参数

```javascript
cxCalendar.defaults.type = 'datetime';
cxCalendar.defaults.language = {
  monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
  weekList: ['Sun', 'Mon', 'Tur', 'Wed', 'Thu', 'Fri', 'Sat'] 
};
```



## API 接口

```javascript
cxCalendar(document.getElementById('input')); // 立即显示日期选择器
cxCalendar.attach(document.getElementById('input'));
cxCalendar.detach(document.getElementById('input'));
```

名称|说明
---|---
attach(element, options)|绑定日期选择器
detach(element)|解除绑定



### 实例 API 接口

```javascript
var input = document.getElementById('input');

// 获取实例
var api = cxCalendar.attach(input);
api.show();

// 销毁实例
cxCalendar.detach(input);
```

名称|说明
---|---
show()|显示面板
hide()|隐藏面板
getDate(format)|获取当前选择的日期
setDate(value)|设置日期值（时间戳或日期字符串）
clearDate()|清除日期值
setOptions(options)|设置参数



## options 参数说明

```javascript
cxCalendar(element, options);
cxCalendar.attach(element, options);
```

名称|类型|默认值|说明
---|---|---|---
date|integer<br />string|undefined|**默认日期**（默认获取当前日期）<br />可使用时间戳或字符串<br />※ input 的 value 值优先级更高
startDate|integer<br />string|undefined|**起始日期**（默认获取当前日期的一年前）<br />可使用时间戳或字符串<br />若设置值为 4 位数字，则转换为当年的1月1日<br />如: 2020 => 2020/1/1
endDate|integer<br />string|undefined|**结束日期**（默认获取当前日期）<br />可使用时间戳或字符串<br />若设置值为 4 位数字，则转换为当年的12月31日<br />如: 2020 => 2020/12/31
type|string|'date'|**日期类型** <br />`'year'` 年份<br />`'month'` 年份和月份<br />`'date'` 日期<br />`'datetime'` 日期和时间<br />`'time'` 时间
format|string|'Y-m-d'|**日期值格式** <br />`'Y'` 年份，完整 4 位数字<br />`'y'` 年份，仅末尾 2 位数字<br />`'m'` 月份，数字带前导零（01-12）<br />`'n'` 月份（1-12）<br />`'d'` 月份中的第几天，有前导零（01-31）<br />`'j'` 月份中的第几天（1-31）<br />`'H'` 小时，24 小时格式，有前导零（00-23）<br />`'G'` 小时，24 小时格式（0-23）<br />`'h'` 小时，12 小时格式，有前导零（01-12）<br />`'g'` 小时，12 小时格式（1-12）<br />`'i'` 分钟，数字带前导零（00-59）<br />`'s'` 秒，数字带前导零（00-59）<br />`'a'` 上午或下午名称<br />`'timestamp'` 时间戳（毫秒）
weekStart|integer|0|**星期开始于周几**<br />`0` 星期日<br />`1` 星期一<br />`2` 星期二<br />`3` 星期三<br />`4` 星期四<br />`5` 星期五<br />`6` 星期六
lockRow|boolean|false|**是否固定行数**<br />每个月的日期数，可能会出现 5 行或 6 行<br />默认自适应，设为 `true` 则固定为 6 行
yearNum|integer|20|**年份每页条数**
hourStep|integer|1|**小时间隔**
minuteStep|integer|1|**分钟间隔**
secondStep|integer|1|**秒间隔**
disableWeek|array|[]|**不可选择的日期（星期值）**<br />`0` 星期日<br/>`1` 星期一<br/>`2` 星期二<br/>`3` 星期三<br/>`4` 星期四<br/>`5` 星期五<br/>`6` 星期六<br />例：`[0,6]` 表示所有周六、周日不可选择
disableDay|array|[]|**不可选择的日期**<br />`'1'` 每月 1 号<br />`'1-5'` 每年 1 月 5 日<br />`'2020-1-1'` 指定具体日期<br />※ 不要有前导零
mode|string|'single'|**是否使用日期范围模式**<br />`'single'` 单选模式<br />`'range'` 范围模式
rangeSymbol|string|' - '|**日期范围拼接符号**
position|string|undefined|**显示位置**<br />`'top'` 上<br />`'bottom'` 下<br />`'left'` 左<br />`'right'` 右<br />`'fixed'` 自定义，配合 `baseClass` 使用<br />默认自适应，可参考：[[Demo Position](https://ciaoca.github.io/cxCalendar/position.html)]
baseClass|string|undefined|**追加样式名称**<br />仅在面板容器增加 class，不会覆盖默认的 class
language|string<br />object|undefined|**语言配置**<br />若为 `string`，将在语言配置文件中查找对应键名（需载入 `cxcalendar.languages.js` ）

### `date`, `startDate`, `endDate` 的优先级与范围
- 当 `date` 早于 `startDate` 时，则为 `startDate`，晚于 `endDate` 时，则为 `endDate`
- 当 `startDate` 日期晚于 `endDate` 时，调整为 `endDate` 的一年前

### `date`, `startDate`, `endDate` 支持的时间格式

> 日期连接符 `-` 可替换为 `.` 或 `/`  
> 月、日、时、分、秒，可为数字或带有前导零

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

```html
<input type="text" value="2020-12-1" data-start-date="2020" data-end-date="2021" data-format="Y/m/d" data-language="en">
```
> ※ data 属性参数优先级要高于调用时的 options 参数

名称|说明
---|---
data-start-date|起始日期
data-end-date|结束日期
data-type|日期类型
data-format|日期值格式
data-weekStart|星期开始于周几
data-year-num|年份每页条数
data-hour-step|小时间隔
data-minute-step|分钟间隔
data-second-step|秒间隔
data-lock-row|是否固定行数，值为 `1` 时视为 `true` ，例：`data-lock-row="1"`
data-disable-week|不可选择的日期（星期值），例：`data-disable-week="0,6"`
data-disable-day|不可选择的日期，例：`data-disable-day="1,5-2,2021-2-11"`
data-mode|选择模式
data-range-symbol|日期范围拼接符号
data-position|显示位置
data-base-class|追加样式名称
data-language|语言名称（仅支持 `languages` 已配置的键名）



## 多语言配置

在 `cxcalendar.languages.js` 文件中进行配置，载入即可根据用户的语言环境，自动显示对应的语言。

名称|默认值|说明
---|---|---
am|'上午'|12小时制的上午名称
pm|'下午'|12小时制的下午名称
monthList|['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']|月份的名称
weekList|['日', '一', '二', '三', '四', '五', '六']|星期的名称（从周日开始排序）
holiday|[]|节假日配置

```javascript
// 自定义语言示例
'zh-cn': {
  am: '上午',
  pm: '下午',
  monthList: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  weekList: ['日', '一', '二', '三', '四', '五', '六'],
  holiday: [
    {day: '1-1', name: '元旦'},  // 指定每年重复的节日
    {day: '2021-2-12', name: '春节'}  // 指定具体日期的节日
  ]
}
```

