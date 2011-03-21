<?php
/*
    http://hypem.com/playlist/artist/artist+name/json/1/data.js
    http://hypem.com/feed/artist/artist+name/1/feed.xml
 */


$artist = $_GET["q"];
$url = "http://hypem.com/feed/artist/" . urlencode(strtolower($artist)) . "/1/feed.xml";
//echo $url

$output = Array();
//echo $q;
$c = file_get_contents ($url);

if (strlen($c) > 2) {
    $rss = simplexml_load_string($c);
    $rssarr = json_decode(json_encode($rss),false);
    //var_dump($rssarr);
        
    foreach ($rss->channel->item as $song) {
        //var_dump($song);
        $a["title"] = $song->title;
        $a["url"] = $song->link;
        $a["description"] = substr($song->description, 0, 40) . "...";
        $a["date"] = substr($song->pubDate, 0, 16);
        array_push($output, $a);
    }

    echo json_encode($output);
} else {
    return;
}

?>