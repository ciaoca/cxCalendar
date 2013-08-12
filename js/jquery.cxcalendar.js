/*!
 * cxCalendar 1.2
 * http://code.ciaoca.com/
 * https://github.com/ciaoca/cxCalendar
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2013-07-31
 */
(function($){
	$.fn.cxCalendar=function(settings,language){
		if(this.length<1){return;};

		var theCalendar={};
		var obj=theCalendar.jqobj=this;
		var fun=theCalendar.fun={};
		var reportCalendear;

		settings=$.extend({},$.cxCalendar.defaults,settings,{
			beginyear:obj.data("beginyear"),
			endyear:obj.data("endyear"),
			type:obj.data("type"),
			hyphen:obj.data("hyphen"),
			wday:obj.data("wday")
		});
		language=$.extend({},$.cxCalendar.language,language);
		
		var dataParse=function(date){
			var newdate=date;
			newdate=newdate.replace(/\./g,"/");
			newdate=newdate.replace(/-/g,"/");
			newdate=newdate.replace(/\//g,"/");
			newdate=Date.parse(newdate);
			return newdate;
		};

		// 判断闰年
		var leapYear=function(y){
			return ((y%4==0 && y%100!=0) || y%400==0) ? 1 : 0;
		};

		// 获取默认日期
		if(obj.val().length>0){
			settings.date=dataParse(obj.val());
		};
		settings.date=new Date(settings.date);
		if(isNaN(settings.date.getFullYear())){
			settings.date=new Date();
		};
		settings.date.setHours(0);
		settings.date.setMinutes(0);
		settings.date.setSeconds(0);

		var def_year=settings.date.getFullYear();
		var def_month=settings.date.getMonth()+1;
		var def_day=settings.date.getDate();

		// 定义每月的天数
		var date_name_month=new Array(31,28+leapYear(def_year),31,30,31,30,31,31,30,31,30,31);

		// 定义每周的日期
		var date_name_week=language.weekList;

		// 定义周末
		var saturday=6-settings.wday;
		var sunday=(7-settings.wday>=7) ? 0 : (7-settings.wday);

		// 创建选择器
		var date_pane,date_hd,date_set,date_table,block_bg,temp_html;
		date_pane=$("<div></div>",{"class":"cxcalendar"});
		date_hd=$("<div></div>",{"class":"date_hd"}).appendTo(date_pane);
		date_table=$("<table></table>").appendTo(date_pane);

		var date_txt,year_list,month_list;
		date_hd.html("<a class='date_pre' href='javascript://' rel='pre'>&lt;</a><a class='date_next' href='javascript://' rel='next'>&gt;</a>");
		date_txt=$("<div></div>",{"class":"date_txt"}).appendTo(date_hd);
		date_set=$("<div></div>",{"class":"date_set"}).appendTo(date_hd);

		temp_html="";
		for(var i=settings.beginyear;i<=settings.endyear;i++){
			temp_html+="<option value='"+i+"'>"+i+"</option>";
		};
		year_list=$("<select></select>",{"class":"year_set"}).html(temp_html).appendTo(date_set).val(def_year);
		date_set.append(" - ");
		
		temp_html="";
		for(var i=0;i<12;i++){
			temp_html+="<option value='"+(i+1)+"'>"+language.monthList[i]+"</option>";
		};
		month_list=$("<select></select>",{"class":"month_set"}).html(temp_html).appendTo(date_set).val(def_month);

		temp_html="<thead><tr>";
		for(var i=0;i<7;i++){
			temp_html+="<th class='"

			// 高亮周末
			if(i==saturday){
				temp_html+=" sat";
			}else if(i==sunday){
				temp_html+=" sun";
			};

			temp_html+="'>";
			temp_html+= (i+settings.wday<7) ? date_name_week[i+settings.wday] : date_name_week[i+settings.wday-7];
			temp_html+="</th>";
		};
		temp_html+="</tr></thead>";
		temp_html+="<tbody></tbody>";
		date_table.html(temp_html);

		// 面板及背景遮挡层插入到页面中
		date_pane.appendTo("body");
		block_bg=$("<div></div>",{"class":"cxcalendar_lock"}).appendTo("body");

		// 显示日期选择器
		fun.show=function(){
			var doc_w=document.body.clientWidth;
			var doc_h=document.body.clientHeight;
			var pane_w=date_pane.outerWidth();
			var pane_h=date_pane.outerHeight();
			var pane_top=obj.offset().top;
			var pane_left=obj.offset().left;
			var obj_w=obj.outerWidth();
			var obj_h=obj.outerHeight();
			
			pane_top=((pane_top+pane_h+obj_h)>doc_h) ? pane_top-pane_h : pane_top+obj_h;
			pane_left=((pane_left+pane_w)>doc_w) ? pane_left-(pane_w-obj_w) : pane_left;
			
			// 兼容IE刷新
			date_txt.html("<span class='y'>"+year_list.val()+"</span>"+language.year+"<span class='m'>"+language.monthList[month_list.val()-1]+"</span>"+language.month);
			date_pane.css({"top":pane_top,"left":pane_left}).show();
			block_bg.css({width:doc_w,height:doc_h}).show();
			
			return this;
		};

		// 关闭日期函数
		fun.hide=function(){
			date_pane.hide();
			block_bg.hide();
			date_set.hide();
			date_txt.show();
			
			return this;
		};

		// 更改日历函数
		fun.change=function(y,m){
			if(m<1){
				y--;
				m=12;
			}else if(m>12){
				y++;
				m=1;
			};
			var text_m=m;
			m--;

			if(y<settings.beginyear){
				y=settings.endyear;
			}else if(y>settings.endyear){
				y=settings.beginyear;
			};

			date_name_month[1]=28+leapYear(y);
			temp_html="";
			var temp_date=new Date(y,m,1);
			var now_date=new Date();
			now_date.setHours(0);
			now_date.setMinutes(0);
			now_date.setSeconds(0);

			var val_date=new Date();
			val_date.setHours(0);
			val_date.setMinutes(0);
			val_date.setSeconds(0);
			val_date=dataParse(obj.val())
			val_date=new Date(val_date);
			if(isNaN(val_date.getFullYear())){
				val_date=null;
			};

			// 获取当月第一天
			var firstday=(temp_date.getDay()-settings.wday<0) ? temp_date.getDay()-settings.wday+7 : temp_date.getDay()-settings.wday;
			// 每月所需要的行数
			var tr_row=Math.ceil((date_name_month[m]+firstday)/7);
			//var tr_row=6;
			var td_num,day_num,diff_now,diff_set;

			for(var i=0;i<tr_row;i++){
				temp_html+="<tr>";
				for(var k=0;k<7;k++){
					td_num=i*7+k;
					day_num=td_num-firstday+1;
					day_num=(day_num<=0 || day_num>date_name_month[m]) ? "" : td_num-firstday+1;

					temp_html+="<td";

					// 高亮今天和选中日期
					if(typeof(day_num)=="number"){
						diff_now=null;
						diff_set=null;
						temp_date=new Date(y,m,day_num);
						diff_now=Date.parse(now_date)-Date.parse(temp_date);
						diff_set=Date.parse(val_date)-Date.parse(temp_date);
						temp_html+=(" title='"+y+settings.hyphen+text_m+settings.hyphen+day_num+"' class='num");

						// 高亮周末、今天、选中
						if(diff_set==0){
							temp_html+=" selected";
						}else if(diff_now==0){
							temp_html+=" now";
						}else if(k==saturday){
							temp_html+=" sat";
						}else if(k==sunday){
							temp_html+=" sun";
						};
						temp_html+=("'");
					};
					temp_html+=(" data-day='"+day_num+"'>"+day_num+"</td>");

				};
				temp_html+="</tr>";
			};
			date_table.find("tbody").html(temp_html);

			date_txt.html("<span class='y'>"+y+"</span>"+language.year+"<span class='m'>"+language.monthList[m]+"</span>"+language.month);
			year_list.val(y);
			month_list.val(m+1);
			
			return this;
		};

		// 选择日期函数
		fun.selected=function(d){
			var temp_month,temp_day;
				temp_month=month_list.val();
				temp_day=d;
			if(settings.type=="yyyy-mm-dd"){
				temp_month="0"+month_list.val();
				temp_day="0"+d;
				temp_month=temp_month.substr((temp_month.length-2),temp_month.length);
				temp_day=temp_day.substr((temp_day.length-2),temp_day.length);
			};
			obj.val(year_list.val()+settings.hyphen+temp_month+settings.hyphen+temp_day);
			obj.trigger("change");
			fun.hide();
			
			return this;
		};
		
		// 清除日期
		fun.clear=function(){
			obj.val("");
			fun.change(def_year,def_month);
			fun.hide();
			
			return this;
		};
		
		// 获取当前选中日期
		fun.getdate=function(){
			return obj.val();
		};
		
		// 设置日期
		fun.setdate=function(opt,m,d){
			
			if(typeof(opt)=="string"){
				fun.setdate({
					date:opt
				});
				return;
			}else if(typeof(opt)=="number"&&typeof(m)=="number"&&typeof(d)=="number"){
				fun.setdate({
					year:opt,
					month:m,
					day:d
				});
				return;
			};
			
			if(typeof(opt)!="object"){
				return false;
			};

			opt=$.extend({},{
				date:null,
				year:null,
				month:null,
				day:null,
				set:true
			},opt);

			var _date,_year,_month,_day;
			
			if(typeof(opt.date)=="string"){
				opt.date=dataParse(opt.date);
				_date=new Date(opt.date);
				_date.setHours(0);
				_date.setMinutes(0);
				_date.setSeconds(0);
		
				opt.year=_date.getFullYear();
				opt.month=_date.getMonth()+1;
				opt.day=_date.getDate();
			};

			fun.change(opt.year,opt.month);
			if(opt.set){
				fun.selected(opt.day)
			};
			
			return this;
		};
		
		fun.gotodate=function(y,m){
			if(typeof(y)=="string"){
				fun.setdate({
					date:y,
					set:false
				});
			}else if(typeof(y)=="number"&&typeof(m)=="number"){
				fun.setdate({
					year:y,
					month:m,
					day:1,
					set:false
				});
			};
			
			return this;
		};

		// 面板 <a> 事件	
		date_pane.delegate("a","click",function(){
			if(!this.rel){return};

			var _rel=this.rel;
			switch(_rel){
				case "pre":
					fun.change(year_list.val(),parseInt(month_list.val(),10)-1);
					return false;
					break
				case "next":
					fun.change(year_list.val(),parseInt(month_list.val(),10)+1);
					return false;
					break
				case "clear":
					fun.clear();
					return false;
					break
			};
		});

		// 选择日期事件
		date_table.delegate("td","click",function(){
			var _this=$(this);
			if(_this.hasClass("num")){
				date_table.find("td").removeClass("selected");
				_this.addClass("selected");
				fun.selected(_this.data("day"));
			};
		});

		// 显示面板事件
		obj.bind("click",fun.show);

		// 关闭面板事件
		block_bg.bind("click",fun.hide);

		// 显示年月选择
		date_txt.bind("click",function(){
			date_txt.hide();
			date_set.show();
		});

		// 更改年月事件
		year_list.bind("change",function(){
			fun.change(year_list.val(),month_list.val());
		});
		month_list.bind("change",function(){
			fun.change(year_list.val(),month_list.val());
		});

		// 第一次初始化
		fun.change(def_year,def_month);

		reportCalendear={
			jqobj:theCalendar.jqobj,
			show:fun.show,
			hide:fun.hide,
			getdate:fun.getdate,
			setdate:fun.setdate,
			gotodate:fun.gotodate,
			clear:fun.clear
		}
		return reportCalendear;
	};
	
	// 默认值
	$.cxCalendar={defaults:{
		beginyear:1950,		// 开始年份
		endyear:2030,		// 结束年份
		date:new Date(),	// 默认日期
		type:"yyyy-mm-dd",	// 日期格式
		hyphen:"-",			// 日期链接符
		wday:0				// 周第一天
	},language:{
		/* 中文 */
		year:"年",
		month:"月",
		monthList:["1","2","3","4","5","6","7","8","9","10","11","12"],
		weekList:["日","一","二","三","四","五","六"]
		
		/* English 
		year:"",
		month:"",
		monthList:["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
		weekList:["Sun","Mon","Tur","Wed","Thu","Fri","Sat"]
		*/
		
		/* 日本語 
		year:"年",
		month:"月",
		monthList:["1","2","3","4","5","6","7","8","9","10","11","12"],
		weekList:["日","月","火","水","木","金","土"]
		*/
	}};
	
})(jQuery);