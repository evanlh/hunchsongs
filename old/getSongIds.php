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

//$key = "52a8e6aaa1153b7e2ed35acea45ca1b9";
$key = "9d64c2f4f32c9134aecd0243055af406";
$url = "http://tinysong.com/b/";
$artists = $_GET["q"];

$song_ids = Array();
$i = 0;
foreach ($artists as $artist) {
        if ($i > 15) { break; } // just in case someone passes in too many artists
        $c = file_get_contents ($url . urlencode($artist) . "?format=json&key=" . $key);
        if (strlen($c) > 2) {
            
            $song = json_decode ($c);
            // check that we got something, and that the artist names match to avoid weird guesses from TinySong
            if (!is_null($song) && strtolower($song->ArtistName) == strtolower($artist)) {
                array_push($song_ids, $song->SongID);
            }
        }

        usleep(300000);
        $i++;
}

echo json_encode($song_ids);

?>