$(document).ajaxStart(function() {
        $('#loading').show();
    }).ajaxStop(function() {
        $('#loading').hide();
    });
    
$('#loading').hide();
//$('#current').hide();

$.ajaxSetup ({
	cache: false,
        timeout: 10000

});

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
                var url = "http://api.hunch.com/api/v1/get-recommendations/?";
                $('#loading').show();
                
                $.ajax({
                        url: url + "&callback=?",
                        dataType: 'json',
                        data: {user_id: "tw_" + user, topic_ids: "list_" + genre + "-musician", limit: 60, sites: "pandora"},
                        success: function(json) {
                                var artists = Array();
                                if (json != null) {
                                    $('#artists').html('<h2><a href="http://hunch.com/browse-topics/music/">Suggestions</a></h2>');

                                    $.each (json.recommendations, function (index, val) {
                                        artists.push({artist: val.title, img: val.image_url, url: val.url, result_id: val.result_id, topic_id: val.topic_ids});
                                    });
                                    // randomize and limit list of artists to 15
                                    fisherYates(artists);
                                    a = artists.slice(0, Math.min(artists.length, 15))
                                    
                                    $('#artists').removeData();
                                    $.each (a, function (index, val) {
                                        var link = '<p><a class="artist" href="" id="#artist-' + index + '">' + val.artist + '</a></p>';
                                        $('#artists').append(link);
                                        $('#artists').data('#artist-' + index, val);
                                        
                                    });
                                } else {
                                    $('#loading').hide(); // working around the bug where ajaxStart/Stop don't get thrown...
                                    $('#artists').html('');
                                    $('#artists').append ("<p>Sorry, we couldn't retrieve the list of songs. Try again with a different Twitter account or check back later.</p>");
                                }
                                
                        },
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
	return false;
});

$('#artists').click( function(ev){
    var el=$(ev.target);
    if ( el.is('a') ){
        var a = el.text();
        var twitter = '<a href="http://twitter.com/share" class="twitter-share-button" data-url="http://beckonr.com/hunchsongs/" data-text="I discovered '+ a+' using HunchSongs!" data-count="none" data-via="evanlh"></a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';
        
        var title = '<a href="' + $('#artists').data(el.attr('id')).url + '" target="_blank">' + a + '<img src="img/pandora-icon.gif" alt="(pandora)"></a>';
        $('#current').html(title + twitter);
        $('#photo').hide();
        $('#photo').html('<img src="' + $('#artists').data(el.attr('id')).img + '">')
        $.ajax({
            url: "getSongIds.php",
            dataType: "json",
            async: true,
            data: {q: a},
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
        
        /*
        $.ajax({
                url: "getHype.php?",
                dataType: "json",
                data: {q: a.toString().toLowerCase()},
                async: true,
                success: function (response) {
                    var i = 0;
                    //alert (response);
                    $.each(response, function (index,val) {
                        //alert(val);
                        $('#hypem').append('<p><a href="' + val.url[0] + '" target="_blank">' + val.title[0] + '</a> - ' + val.description + '</p>');
                        i++;
                        if (i >= 6) { return false; }
                    });
                    if (i > 0) {
                            $('#hypem').show();
                    }
                }

        });*/
        $('#hypem').append('<div id="hypem-widget" style="height: 200px; float: left;"></div><script type="text/javascript" src="http://hypem.com/widget/v2/search/'+ a.toString().toLowerCase() + '/5/hype.js?bcol=FFFFFF&lcol=60778f&tcol=003366"></script>');
        $('#hypem').show();
    }
    return false;
});
