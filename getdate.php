<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<title>test</title>
</head>
<body>
<?
if(!empty($_POST['mydate'])){
	echo $_POST['mydate'];
}else{
	echo "未选择日期";
};
?>
</body>
</html>