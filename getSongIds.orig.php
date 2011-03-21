<?php
/*
Example
http://tinysong.com/b/Girl+Talk+
Ask+About+Me?format=json&key=APIKey
Returns
{
  "Url": "http:\/\/tinysong.com\/6OAB",
  "SongID": 13963,
  "SongName": "Ask About Me",
  "ArtistID": 77,
  "ArtistName": "Girl Talk",
  "AlbumID": 117512,
  "AlbumName": "Girl Talk"
}
*/

$key = "KEY";
$url = "http://tinysong.com/s/";
$artist = $_GET["q"];
//echo $artist;

$output = Array();
$q = $url . urlencode($artist) . "?format=json&key=" . $key . "&limit=20";
//echo $q;
$c = file_get_contents ($q);
//echo $c;
if (strlen($c) > 2) {
        $songs = json_decode ($c);
        // check that we got something, and that the artist names are close to avoid weird guesses from TinySong
        foreach ($songs as $song) {
            $similar = levenshtein(strtolower($song->ArtistName), strtolower($artist)) / strlen($artist);
            if (!is_null($song) && $similar < .3) {
                array_push($output, $song);
            }
        }
        echo json_encode($output);
} else {
    return;
}


?>
