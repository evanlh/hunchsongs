
$.ajaxSetup ({
	cache: false
});

$('#loading')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
        $('#grooveshark').hide();
    })
    .ajaxStop(function() {
        $(this).hide();
        $('#grooveshark').show();
    })
;

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

$("#getSongs").submit(function(){
        var user = $('#user').val();
        var genre = $('#genre').val();
        user = user.replace (/[^a-z0-9A-Z_]/g, '');
        if (user.length == 0) {
                $("#user").focus();
        } else {
                var url = "http://api.hunch.com/api/v1/get-recommendations/?";

                $.getJSON(
                        url + "&callback=?",
                        {user_id: "tw_" + user, topic_ids: "list_" + genre + "-musician", limit: 100, sites: "pandora"},
                        function(json) {
                                artists = Array();
                                $.each (json.recommendations, function (index, val) {
                                    artists.push(val.title);
                                });
                                // randomize and limit list of artists to 15
                                fisherYates(artists);
                                a = artists.slice(0, Math.min(artists.length, 15))
                                $.getJSON(
                                    "getSongIds.php",
                                    {q: a},
                                    function (response) {
                                        $("#grooveshark").html('<object width="220" height="400"><param name="movie" value="http://listen.grooveshark.com/widget.swf"></param><param name="wmode" value="window"></param><param name="allowScriptAccess" value="always"></param><param name="flashvars" value="hostname=cowbell.grooveshark.com&style=metal&bbg=003366&bfg=60778f&bt=FFFFFF&bth=003366&pbg=FFFFFF&pbgh=60778f&pfg=003366&pfgh=FFFFFF&si=FFFFFF&lbg=FFFFFF&lbgh=60778f&lfg=003366&lfgh=FFFFFF&sb=FFFFFF&sbh=60778f&p=0&songIDs=' + response + '"></param><embed src="http://listen.grooveshark.com/widget.swf" type="application/x-shockwave-flash" width="220" height="400" flashvars="hostname=cowbell.grooveshark.com&style=metal&bbg=003366&bfg=60778f&bt=FFFFFF&bth=003366&pbg=FFFFFF&pbgh=60778f&pfg=003366&pfgh=FFFFFF&si=FFFFFF&lbg=FFFFFF&lbgh=60778f&lfg=003366&lfgh=FFFFFF&sb=FFFFFF&sbh=60778f&p=0&songIDs=' + response + '" allowScriptAccess="always" wmode="window"></embed></object>');
                                    }
                                );
                        }
                );
        }
	return false;
});
