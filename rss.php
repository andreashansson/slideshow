<?php
if(!array_key_exists("feedType", $_GET) || ($_GET["feedType"] != "sport" && $_GET["feedType"] != "news")) {
	http_response_code(400);
} else {
	$process = curl_init("http://www.standard.co.uk/" . $_GET["feedType"] . "/service/rssftpwfilt");
	curl_setopt($process, CURLOPT_USERPWD, "std3:[kn5E]\\.8n");
	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
	$xmlFeed = curl_exec($process);
	curl_close($process);

	header('Content-type: application/xml');
	echo $xmlFeed;
}