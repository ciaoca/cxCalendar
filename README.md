#jQuery cxCalendar

cxCalendar 是基于 jQuery 的日期选择器插件。

它灵活自由，你可以自定义外观，日期的范围，返回的格式等。

**版本：**

* jQuery v1.7+
* jQuery cxCalendar v1.5

文档：http://code.ciaoca.com/jquery/cxcalendar/

示例：http://code.ciaoca.com/jquery/cxcalendar/demo/

![Preview](http://code.ciaoca.com/jquery/cxcalendar/preview.png)

##使用方法
###载入 CSS 文件
```html
<link rel="stylesheet" href="jquery.cxcalendar.css">
```

###载入 JavaScript 文件
```html
<script src="jquery.js"></script>
<script src="jquery.cxcalendar.js"></script>
```

###DOM 结构
```html
<input id="element_id" type="text">
```

###调用 cxCalendar
```javascript
$("#element_id").cxCalendar();
```

###设置全局默认值
```javascript
// 需在引入 <script src="js/jquery.cxcalendar.js"></script> 之后，调用之前设置
$.cxCalendar.defaults.startDate = 1980;
$.cxCalendar.defaults.language = {
  monthList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
  weekList: ['Sun', 'Mon', 'Tur', 'Wed', 'Thu', 'Fri', 'Sat'] 
};
```

##参数说明
<table>
  <thead>
    <tr>
      <th width="100">名称</th>
      <th width="160">默认值</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>startDate</td>
    <td>1950</td>
    <td>
      <p>起始日期</p>
      <p>若指定年份，设置值为 4 位数的数字</p>
      <p>若指定某一天，设置值为字符串或时间戳，该值能被<code>new Date(value)</code>处理</p>
    </td>
  </tr>
  <tr>
    <td>endDate</td>
    <td>2030</td>
    <td>
      <p>结束日期</p>
      <p>若指定年份，设置值为 4 位数的数字</p>
      <p>若指定某一天，设置值为字符串或时间戳，该值能被<code>new Date(value)</code>处理</p>
    </td>
  </tr>
  <tr>
    <td>date</td>
    <td>undefined</td>
    <td>
      <p>默认日期</p>
      <p>默认获取当前日期，自定义可使用字符串或时间戳，该值能被<code>new Date(value)</code>处理</p>
      <p>※ input 中的 value 值优先级要高级此值</p>
    </td>
  </tr>
  <tr>
    <td>type</td>
    <td>'date'</td>
    <td>
      <p>日期类型<strong>（v1.5 新增）</strong></p>
      <p>'date': 只选择日期</p>
      <p>'datetime': 选择日期和时间</p>
    </td>
  </tr>
  <tr>
    <td>format</td>
    <td>'YYYY-MM-DD'</td>
    <td>
      <p>日期值格式<strong>（自 v1.5 开始，之前版本的 type 更名为 format）</strong></p>
      <p>'YYYY': 年份，完整 4 位数字</p>
      <p>'YY': 年份，仅末尾 2 位数字</p>
      <p>'MM': 月份，数字带前导零（01-12）</p>
      <p>'M': 月份（1-12）</p>
      <p>'DD': 月份中的第几天，数字带前导零（01-31）</p>
      <p>'D': 月份中的第几天（1-31）</p>
      <p>'HH': 小时，24 小时格式，数字带前导零（00-23）</p>
      <p>'H': 小时，24 小时格式（0-23）</p>
      <p>'hh': 小时，12 小时格式，数字带前导零（01-12）</p>
      <p>'h': 小时，12 小时格式（1-12）</p>
      <p>'mm': 分钟，数字带前导零（00-59）</p>
      <p>'m': 分钟（0-59）</p>
      <p>'ss': 分钟，数字带前导零（00-59）</p>
      <p>'s': 分钟（0-59）</p>
      <p>'TIME': 时间戳</p>
      <p>'STRING': 日期的字符串，例：Wed Jul 28 1993</p>
    </td>
  </tr>
  <tr>
    <td>wday</td>
    <td>0</td>
    <td>星期开始于周几可设置为：0-6 之间的数字
      <p>0: 星期日</p>
      <p>1: 星期一</p>
      <p>2: 星期二</p>
      <p>3: 星期三</p>
      <p>4: 星期四</p>
      <p>5: 星期五</p>
      <p>6: 星期六</p>
    </td>
  </tr>
  <tr>
    <td>position</td>
    <td>undefined</td>
    <td>面板显示的位置详见：<a target="_blank" href="demo/position.html">[Demo Position]</a></td>
  </tr>
  <tr>
    <td>baseClass</td>
    <td>undefined</td>
    <td>给面板容器增加 class，不会覆盖默认的 class</td>
  </tr>
  <tr>
    <td>language</td>
    <td>undefined</td>
    <td><p>自定义语言</p>
      <p>值类型可是是字符串或对象</p>
      <p>若为字符串，为语言配置文件中的属性名称（需要载入<code>jquery.cxcalendar.languages.js</code>）</p>
      <p>若为对象，则按照对象所设置的语言</p>
    </td>
  </tr>
</table>

##data 属性参数
<table>
  <thead>
    <tr>
      <th width="160">名称</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>data-start-date</td>
    <td>起始日期</td>
  </tr>
  <tr>
    <td>data-end-date</td>
    <td>结束日期</td>
  </tr>
  <tr>
    <td>data-type</td>
    <td>日期类型</td>
  </tr>
  <tr>
    <td>data-format</td>
    <td>日期值格式</td>
  </tr>
  <tr>
    <td>data-position</td>
    <td>面板显示的位置</td>
  </tr>
  <tr>
    <td>data-wday</td>
    <td>星期开始于周几</td>
  </tr>
  <tr>
    <td>data-language</td>
    <td>自定义语言</td>
  </tr>
</table>
```html
<input id="element_id" type="text" value="1988-1-31" data-start-date="2000" data-end-date="2015" data-format="YYYY/M/D" data-language="en">
```
※ data 属性设置的参数优先级要高于调用时参数设置的值

##多语言配置说明
只需载入<code>jquery.cxcalendar.languages.js</code>，即可根据用户的语言环境，自动显示对应的语言。
<table>
  <thead>
    <tr>
      <th width="100">名称</th>
      <th width="360">默认值</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>monthList</td>
    <td>['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']</td>
    <td>月份的名称。</td>
  </tr>
  <tr>
    <td>weekList</td>
    <td>['日', '一', '二', '三', '四', '五', '六']</td>
    <td>星期的名称。从星期日开始排序。</td>
  </tr>
  <tr>
    <td>holiday</td>
    <td>[]</td>
    <td>节假日配置。</td>
  </tr>
</table>

##API 接口
```javascript
var Api;
$('#element_id').cxCalendar(function(api){
  Api = api;
});
// 或者作为第二个参数传入
$('#element_id').cxCalendar({
  type: 'YYYY/M/D'
}, function(api){
  Api = api;
});
```
<table>
  <thead>
    <tr>
      <th width="240">名称</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>show()</td>
    <td>显示面板</td>
  </tr>
  <tr>
    <td>hide()</td>
    <td>隐藏面板</td>
  </tr>
  <tr>
    <td>getDate(style)</td>
    <td>获取当前选择的日期（style 格式与参数 format 相同）</td>
  </tr>
  <tr>
    <td>setDate(value)</td>
    <td>传入一个字符串来设置日期</td>
  </tr>
  <tr>
    <td>setDate(year, month, day)</td>
    <td>分别传入年、月、日来设置日期</td>
  </tr>
  <tr>
    <td>gotoDate(value)</td>
    <td>传入一个字符串来调整日期（只是显示面板变化，不会进行设置值）</td>
  </tr>
  <tr>
    <td>gotoDate(year, month)</td>
    <td>分别传入年、月来调整日期（只是显示面板变化，不会进行设置值）</td>
  </tr>
  <tr>
    <td>clearDate()</td>
    <td>清除日期值</td>
  </tr>
  <tr>
    <td>setOptions(opt)</td>
    <td>重新设置参数</td>
  </tr>
</table>
