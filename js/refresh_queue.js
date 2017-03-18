$(document).ready(function() {
  $.get( "http://www.shaneschulte.com/queue/", function( data ) {
    console.log(data);
    var result = data;
    if(result.length >= 1) {
      var now_playing = result.shift();
      console.log(now_playing);
      $.get("https://api.spotify.com/v1/tracks/"+now_playing.track, function(data) {
        console.log(data);
        $(".now-playing .song").html(data.name);
        var artist_name = '';
        $.each(data.artists, function(art, ist) {
            artist_name += ist.name + ', ';
        });
        artist_name = artist_name.substring(0, artist_name.length-2);
        $(".now-playing .artist").html(artist_name);
        $(".now-playing .album").attr("src", data.album.images[0].url);
        //$(".now-playing").attr("data-original-title", "Requested by: "+now_playing.addedBy);
      });
      // Check if queue has anything left
      if(result.length >= 1) {
        var tracks = '';
        if(result.length >= 2) {
          for(var i=0; i<Math.min(50,result.length); i++) tracks += result[i].track+",";
          tracks = "https://api.spotify.com/v1/tracks/?ids="+tracks.substring(0, tracks.length-1);
        }
        else if(result.length == 1) tracks = "https://api.spotify.com/v1/tracks/"+result[0].track;
        // GET queue metadata
        $.get(tracks, function(data) {
          console.log(data);
          $(".song-queue").html('');
          $.each(data.tracks, function(k,v) {
            var $div = $("<div>", {"class": "queued-song"});
            var $song = $("<h4>").html(v.name);
            console.log(k);
            if(k == 0) $song.prepend(" ").prepend($("<span>", {"class":"badge badge-default"}).html("Next"));
            $div.append($song);
            var artist_name = '';
            $.each(v.artists, function(art, ist) {
                artist_name += ist.name + ', ';
            });
            artist_name = artist_name.substring(0, artist_name.length-2);
            $div.append($("<p>", {"class":"no-margins"}).html(artist_name));
            $(".song-queue").append($div);
          });
        });
      }
    }
  });
});
