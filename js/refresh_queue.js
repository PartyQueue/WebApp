var timeoutQueue;
$(document).ready(function() {
  clearNowPlaying();
  downloadQueue();
});

function downloadQueue() {
  var jqxhr = $.get( "http://"+window.location.host+"/queue", function( data ) {
    console.log(data);
    updateQueue(data);
  });

  jqxhr.fail(function() {
    timeoutQueue = setTimeout(downloadQueue, 5000);
  });
}

function updateQueue(data) {
  if(!first_success) getCountryCode();
  if(data.length == 0) {
    timeoutQueue = setTimeout(downloadQueue, 10000);
    return clearNowPlaying();
  }

  var now_playing = data.shift();
  $.get("https://api.spotify.com/v1/tracks/"+now_playing.track,
      function(data) { updateNowPlaying(data); });
  if(now_playing.time === undefined) timeoutQueue = setTimeout(downloadQueue, 15000);
  else {timeoutQueue = setTimeout(downloadQueue, now_playing.time+3000); }

  if(data.length == 0) return clearQueuedSongs();

  // Construct API URL
  var url = "https://api.spotify.com/v1/tracks/?ids=";
  for(var i=0; i<Math.min(20,data.length); i++) url += data[i].track+",";
  url = url.substring(0, url.length-1);

  // GET queue metadata
  var extra = Math.max(0, data.length - 20);
  $.get(url, function(data) { updateQueuedSongs(data, extra); });
}

function updateQueuedSongs(data, extra) {

  // Clear old results
  $(".song-queue").html('');
  var $badge = $("<span>", {"class":"badge badge-default"}).html("Next");

  // Iterate results
  $.each(data.tracks, function(k,v) {
    // Construct div element for this entry
    var $div = $("<div>", {"class": "queued-song performs-search", "id":v.album.id});
    var $song = $("<h4>").html(v.name);
    var $artist = $("<p>", {"class":"no-margins"}).html(buildArtistString(v.artists));

    if(k == 0) $song.prepend(" ").prepend($badge);
    $div.append($song).append($artist);

    // Insert entry into the DOM
    $(".song-queue").append($div);
  });
  $(".performs-search").click(function() {
    performAlbumLookup($(this).attr("id"), true);
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
  $(".now-playing .album-holder").addClass("hidden-xs-up");
}

function updateNowPlaying(data) {
  $(".now-playing .song").html(data.name);
  $(".now-playing .artist").html(buildArtistString(data.artists));
  if(data.album.images.length == 0) {
    $(".now-playing .album-holder").addClass("hidden-xs-up");
  }
  else {
    $(".now-playing .album").attr("src", data.album.images[0].url);
    $(".now-playing .album-holder").removeClass("hidden-xs-up");
  }
}
