function performAlbumLookup(id, stash) {
  $.get("https://api.spotify.com/v1/albums/"+id, function (response) {
    var stateObj = response;
    console.log(stateObj);
    displayDesktopAlbum(stateObj);
    if(stash) history.pushState(stateObj, "", "#/album/"+id);
    //else history.replaceState(stateObj, "Search results", "#/artist/"+id);
  });
}
function displayDesktopAlbum(response) {
  var $div = $('#desktop-results');
  $div.html(``);
  var $row = $('<div>', {'class':'row no-gutters'});
  var $topTracks = $('<div>', {'class':'col-12', 'id':'albumTracks'});
  $topTracks.append(`<div class="row av" style="padding-bottom:16px;"><div class="col-3"><img class="img-fluid" src='`+response.images[0].url+`' /></div><div class="col-9"><p class="spot">`+response.album_type.toUpperCase()+`</p><h1>`+response.name+`</h1><p>By `+buildArtistStringWithLinks(response.artists)+` &bull; `+response.release_date+`</p></div></div><div class="popularSongSpacer"></div>`);
  $row.append($topTracks);
  $div.append($row);
  $.each(response.tracks.items, function(k,v) {
    $entry = $("<div>", {"class":"popularSong", "id":v.id}).html(v.name);
    $topTracks.append($entry);
  });
  $(".popularSong").click(function() {
    var that = $(this);
    requestSong(that);
  });
}
