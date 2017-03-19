$(document).ready(function() {
  downloadQueue();
});

function downloadQueue() {
  $.get( "http://"+window.location.host+"/queue/", function( data ) {
    updateQueue(data);
  });
}

function updateQueue(data) {
  var result = data;

  if(result.length == 0) return clearNowPlaying();

  var now_playing = result.shift();
  $.get("https://api.spotify.com/v1/tracks/"+now_playing.track,
      function(data) { updateNowPlaying(data); });

  if(result.length == 0) return clearQueuedSongs();

  // Construct API URL
  var url = "https://api.spotify.com/v1/tracks/?ids=";
  for(var i=0; i<Math.min(20,result.length); i++) url += result[i].track+",";
  url = url.substring(0, url.length-1);

  // GET queue metadata
  var extra = Math.max(0, result.length - 20);
  $.get(url, function(data) { updateQueuedSongs(data, extra); });
}

function updateQueuedSongs(data, extra) {
  // Clear old results
  $(".song-queue").html('');
  var $badge = $("<span>", {"class":"badge badge-default"}).html("Next");

  // Iterate results
  $.each(data.tracks, function(k,v) {
    // Construct div element for this entry
    var $div = $("<div>", {"class": "queued-song"});
    var $song = $("<h4>").html(v.name);
    var $artist = $("<p>", {"class":"no-margins"}).html(buildArtistString(v.artists));

    if(k == 0) $song.prepend(" ").prepend($badge);
    $div.append($song).append($artist);

    // Insert entry into the DOM
    $(".song-queue").append($div);
  });
  if(extra == 0) return;
  var $div = $("<div>", {"class": "queued-song"});
  var $text = $("<p>", {"class":"no-margins text-center"}).html("+"+extra+" more tracks");
  $(".song-queue").append($div.append($text));
}

function clearQueuedSongs() {
  $(".song-queue").html('');
}

function clearNowPlaying() {
  $(".now-playing .song").html("Nothing Playing");
  $(".now-playing .artist").html("Request songs to get the party started!");
  $(".now-playing .album").addClass("hidden-xs-up");
}

function updateNowPlaying(data) {
  $(".now-playing .song").html(data.name);
  $(".now-playing .artist").html(buildArtistString(data.artists));
  $(".now-playing .album").attr("src", data.album.images[0].url);
  $(".now-playing .album").removeClass("hidden-xs-up");
}
