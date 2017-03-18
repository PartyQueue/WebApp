$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $.get( "http://www.shaneschulte.com/queue/", function( data ) {
    var result = JSON.parse(data);
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
        $(".now-playing").attr("data-original-title", "Song requested by: "+now_playing.addedBy);
      });
    }
  });
});
