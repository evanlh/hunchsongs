/*
 * Intialization
 */

$(document).ajaxStart(function() {
        $('#loading').show();
    }).ajaxStop(function() {
        $('#loading').hide();
    });
    
$('#loading').hide();

$.ajaxSetup ({
	cache: false,
        timeout: 10000

});

/*
 *  Utility functions
 */

// from here: http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}


/*
 * Artist
 *
 */

function Artist(name,url,image_url,css_id,result_id, topic_id) {
    this.name = typeof(name) !== "undefined" ? name : "";
    this.image_url = typeof(image_url) !== "undefined" ? image_url : "";
    this.result_id = typeof(result_id) !== "undefined" ? result_id : "";
    this.topic_id = typeof(topic_id) !== "undefined" ? topic_id : "";
    this.url = typeof(url) !== "undefined" ? url : "";
    this.css_id = typeof(css_id) !== "undefined" ? css_id : "";
}

/*
 * Artist.show ()
 *
 */
Artist.prototype.show = function () {

    var twitter = '<a href="http://twitter.com/share" class="twitter-share-button" data-url="http://beckonr.com/hunchsongs/" data-text="I discovered '+ this.name +' using HunchSongs!" data-count="none" data-via="evanlh"></a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';
    var title = '<a href="' + this.url + '" target="_blank">' + this.name + '<img src="img/pandora-icon.gif" alt="(pandora)"></a>';
    $('#current').html(title + twitter);
    $('#photo').hide();
    $('#photo').html('<a href="' + this.url + '"><img src="' + this.image_url + '"></a>');
    $.ajax({
        url: "getSongIds.php",
        dataType: "json",
        async: true,
        data: {q: this.name},
        success: function (response) {
            var songids = Array();
            if (response != null) {
                $.each (response, function(index, val) {
                        songids.push (val.SongID);
                })
            }
            $('#grooveshark').html('<object width="220" height="500"><param name="movie" value="http://listen.grooveshark.com/widget.swf"></param><param name="wmode" value="window"></param><param name="allowScriptAccess" value="always"></param><param name="flashvars" value="hostname=cowbell.grooveshark.com&style=metal&bbg=003366&bfg=60778f&bt=FFFFFF&bth=003366&pbg=FFFFFF&pbgh=60778f&pfg=003366&pfgh=FFFFFF&si=FFFFFF&lbg=FFFFFF&lbgh=60778f&lfg=003366&lfgh=FFFFFF&sb=FFFFFF&sbh=60778f&p=1&songIDs=' + songids + '"></param><embed src="http://listen.grooveshark.com/widget.swf" type="application/x-shockwave-flash" width="220" height="500" flashvars="hostname=cowbell.grooveshark.com&style=metal&bbg=003366&bfg=60778f&bt=FFFFFF&bth=003366&pbg=FFFFFF&pbgh=60778f&pfg=003366&pfgh=FFFFFF&si=FFFFFF&lbg=FFFFFF&lbgh=60778f&lfg=003366&lfgh=FFFFFF&sb=FFFFFF&sbh=60778f&p=1&songIDs=' + songids + '" allowScriptAccess="always" wmode="window"></embed></object>');
            $('#current').fadeIn();
            $('#photo').fadeIn();
        }
    });
    $('#hypem').hide();
    $('#hypem').append('<div id="hypem-widget" style="height: 200px; float: left;"></div><script type="text/javascript" src="http://hypem.com/widget/v2/search/'+ this.name + '/5/hype.js?bcol=FFFFFF&lcol=60778f&tcol=003366"></script>');
    $('#hypem').show();
}

/*
 * Suggestions
 *
 */

function Suggestions () {
    this.artists = Array();
}

Suggestions.prototype.SuccessCallback = function (json) {
    var artists = Array();
    if (json != null) {
        $('#artists').html('<h2><a href="http://hunch.com/browse-topics/music/">Suggestions</a></h2>');

        r = json.recommendations;
        fisherYates(r);
        a = r.slice(0, Math.min(artists.length, 15))

        $.each (a, function (index, val) {
            artists.push(new Artist(val.title, val.url, val.image_url, val.title + "-" + index, val.result_id, val.topic_ids));
        });

        this.artists = artists;
        //$('#artists').removeData();
        $.each (artists, function (index, val) {
            var link = '<p><a class="artist" href="" id="' + val.css_id + '">' + val.name + '</a>';
            link += '<a class="similar" id="' + val.result_id + '">similar</a></p>';
            $('#artists').append(link);
            //$('#artists').data('#artist-' + index, val);

        });
    } else {
        $('#loading').hide(); // working around the bug where ajaxStart/Stop don't get thrown...
        $('#artists').html('');
        $('#artists').append ("<p>Sorry, we couldn't retrieve the list of songs. Try again with a different Twitter account or check back later.</p>");
    }
}

Suggestions.prototype.get = function (url, data) {
    $('#loading').show();
    $.ajax({
            url: url + "&callback=?",
            dataType: 'json',
            data: data,
            success: this.SuccessCallback,
            error: function(jqxhr, textStatus, errorThrown) {
                $('#loading').hide(); // working around the bug where ajaxStart/Stop don't get thrown...
                $('#artists').html('');
                $('#artists').append ("<p>Sorry, we couldn't retrieve the list of songs. Try again with a different Twitter account or check back later.</p>");

            },
            complete: function() {
                $('#loading').hide();
            }
    });
}
Suggestions.prototype.getByUser = function (user, genre) {
    var url = "http://api.hunch.com/api/v1/get-recommendations/?";
    var data = {user_id: "tw_" + user, topic_ids: "list_" + genre + "-musician", limit: 60, sites: "pandora"};
    this.get(url, data);
}

Suggestions.prototype.getByArtist = function (artist) {
    var url = "http://api.hunch.com/api/v1/get-similar-results/?";
    var data = {topic_ids: "list_" + artist.topic_id, result_id: artist.result_id, limit: 60, sites: "pandora"};
    this.get(url, data);
}

/*
 *  Event handlers
 */

$('#user').click(function() {
    $(this).val('');
});
$('#user').blur(function() {
    if ($(this).val().length == 0) {
        $(this).val('@evanlh');
    }
});

$("#getSongs").submit(function(){
        var user = $('#user').val();
        var genre = $('#genre').val();
        user = user.replace (/[^a-z0-9A-Z_]/g, '');
        genre = genre.replace (/['&]/g,'-');
        if (user.length == 0) {
                $("#user").focus();
        } else {
            getSuggestionsByUser(user, genre); // TODO
        }
	return false;
});

$('#artists').click( function(ev){
    var el=$(ev.target);
    if ( el.is('a') ){
        var a = el.text();
        getArtist(a); // TODO
    }
    return false;
});
