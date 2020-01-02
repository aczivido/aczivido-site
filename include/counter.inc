<?
switch (getenv("SERVER_NAME")) {
	case "hobbit":
		break;
	default:
		$conn=mysql_connect($mysql["ip"],$mysql["userid"],$mysql["pwd"]);
		$query=mysql_db_query("aczivido","UPDATE counter SET data=now(), count=count+1 WHERE subweb='$localpath'",$conn);
		mysql_close($conn);
}
?>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-656806-1";
urchinTracker();
</script>
<?