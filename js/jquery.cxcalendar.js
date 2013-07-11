/*!
 * cxCalendar 1.1
 * date: 2012-01-14
 * https://github.com/ciaoca/cxCalendar
 * (c) 2012 Ciaoca, http://ciaoca.com/
 */
(function($){
	$.fn.cxCalendar=function(settings,language){
		if(this.length<1){return;};
		settings=$.extend({},$.cxCalendar.defaults,settings);
		language=$.extend({},$.cxCalendar.language,language);

		var date_obj=this;

		// 获取默认日期
		if(date_obj.val().length>0){
			settings.date=date_obj.val();
			settings.date=settings.date.replace(/\./g,"/");
			settings.date=settings.date.replace(/-/g,"/");
			settings.date=settings.date.replace(/\//g,"/");
			settings.date=Date.parse(settings.date);
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

		// 判断闰年
		var leapYear=function(y){
			return ((y%4==0 && y%100!=0) || y%400==0) ? 1 : 0;
		};

		// 定义每月的天数
		var date_name_month=new Array(31,28+leapYear(def_year),31,30,31,30,31,31,30,31,30,31);

		// 定义每周的日期
		var date_name_week=language.week_list;

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
		for(var i=settings.begin_year;i<=settings.end_year;i++){
			temp_html+="<option value='"+i+"'>"+i+"</option>";
		};
		year_list=$("<select></select>",{"class":"year_set"}).html(temp_html).appendTo(date_set).val(def_year);
		date_set.append(" - ");
		
		temp_html="";
		for(var i=0;i<12;i++){
			temp_html+="<option value='"+(i+1)+"'>"+language.month_list[i]+"</option>";
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
		block_bg=$("<div></div>").css({"display":"none","position":"absolute","top":"0","left":"0","background":"#fff","opacity":"0","z-index":"999"}).appendTo("body");

		// 显示日期选择器
		var dateShow=function(){
			var doc_w=document.body.clientWidth;
			var doc_h=document.body.clientHeight;
			var pane_w=date_pane.outerWidth();
			var pane_h=date_pane.outerHeight();
			var pane_top=date_obj.offset().top;
			var pane_left=date_obj.offset().left;
			var obj_w=date_obj.outerWidth();
			var obj_h=date_obj.outerHeight();
			
			pane_top=((pane_top+pane_h+obj_h)>doc_h) ? pane_top-pane_h : pane_top+obj_h;
			pane_left=((pane_left+pane_w)>doc_w) ? pane_left-(pane_w-obj_w) : pane_left;
			
			date_txt.html("<span class='y'>"+year_list.val()+"</span>"+language.year+"<span class='m'>"+language.month_list[month_list.val()-1]+"</span>"+language.month);
			date_pane.css({"top":pane_top,"left":pane_left}).show();
			block_bg.css({width:doc_w,height:doc_h}).show();
		};

		// 更改日历函数
		var dateChange=function(y,m){
			if(m<1){
				y--;
				m=12;
			}else if(m>12){
				y++;
				m=1;
			};
			var text_m=m;
			m--;

			if(y<settings.begin_year){
				y=settings.end_year;
			}else if(y>settings.end_year){
				y=settings.begin_year;
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
			val_date=date_obj.val();
			val_date=val_date.replace(/\./g,"/");
			val_date=val_date.replace(/-/g,"/");
			val_date=val_date.replace(/\//g,"/");
			val_date=new Date(Date.parse(val_date));
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

			date_txt.html("<span class='y'>"+y+"</span>"+language.year+"<span class='m'>"+language.month_list[m]+"</span>"+language.month);
			year_list.val(y);
			month_list.val(m+1);
		};

		// 选择日期函数
		var dateSelect=function(d){
			var temp_month,temp_day;
				temp_month=month_list.val();
				temp_day=d;
			if(settings.type=="yyyy-mm-dd"){
				temp_month="0"+month_list.val();
				temp_day="0"+d;
				temp_month=temp_month.substr((temp_month.length-2),temp_month.length);
				temp_day=temp_day.substr((temp_day.length-2),temp_day.length);
			};
			date_obj.val(year_list.val()+settings.hyphen+temp_month+settings.hyphen+temp_day);
			dateExit();
		};

		// 关闭日期函数
		var dateExit=function(){
			date_pane.hide();
			block_bg.hide();
			date_set.hide();
			date_txt.show();
		};

		// 面板 <a> 事件
		date_pane.delegate("a","click",function(){
			if(!this.rel){return};

			var _rel=this.rel;
			switch(_rel){
				case "pre":
					dateChange(year_list.val(),parseInt(month_list.val(),10)-1);
					break
				case "next":
					dateChange(year_list.val(),parseInt(month_list.val(),10)+1);
					break
				case "clear":
					date_obj.val("");
					dateChange(def_year,def_month);
					dateExit();
					break
			};
		});

		// 选择日期事件
		date_table.delegate("td","click",function(){
			var _this=$(this);
			if(_this.hasClass("num")){
				date_table.find("td").removeClass("selected");
				_this.addClass("selected");
				dateSelect(_this.data("day"));
			};
		});

		// 显示面板事件
		date_obj.bind("click",dateShow);

		// 关闭面板事件
		block_bg.bind("click",dateExit);

		// 显示年月选择
		date_txt.bind("click",function(){
			date_txt.hide();
			date_set.show();
		});

		// 更改年月事件
		year_list.bind("change",function(){
			dateChange(year_list.val(),month_list.val());
		});
		month_list.bind("change",function(){
			dateChange(year_list.val(),month_list.val());
		});

		// 第一次初始化
		dateChange(def_year,def_month);
	};
	
	// 默认值
	$.cxCalendar={defaults:{
		begin_year:1950,	// 开始年份
		end_year:2030,		// 结束年份
		date:new Date(),	// 默认日期
		type:"yyyy-mm-dd",	// 日期格式
		hyphen:"-",			// 日期链接符
		wday:0				// 周第一天
	},language:{
		/* 中文 */
		year:"年",
		month:"月",
		month_list:["1","2","3","4","5","6","7","8","9","10","11","12"],
		week_list:["日","一","二","三","四","五","六"]
		
		/* English 
		year:"",
		month:"",
		month_list:["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
		week_list:["Sun","Mon","Tur","Wed","Thu","Fri","Sat"]
		*/
		
		/* 日本語 
		year:"年",
		month:"月",
		month_list:["1","2","3","4","5","6","7","8","9","10","11","12"],
		week_list:["日","月","火","水","木","金","土"]
		*/
	}};
})(jQuery);