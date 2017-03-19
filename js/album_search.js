function performAlbumLookup(id, stash) {
  $.get("https://api.spotify.com/v1/albums/"+id, function (response) {
    var stateObj = response;
    displayDesktopAlbum(stateObj);
    if(stash && JSON.stringify(history.state) !== JSON.stringify(stateObj)) history.pushState(stateObj, "", "#/album/"+id);
  });
}
function displayDesktopAlbum(response) {
  var $div = $('#desktop-results');
  $div.html(``);
  var $row = $('<div>', {'class':'row no-gutters'});
  var $topTracks = $('<div>', {'class':'col-12', 'id':'albumTracks'});
  var imgu = (response.images.length == 0) ? placeholder : response.images[0].url;
  $topTracks.append(`<div class="row av" style="padding-bottom:16px;"><div class="col-3"><img class="img-fluid" src='`+imgu+`' /></div><div class="col-9"><p class="spot">`+response.album_type.toUpperCase()+`</p><h1>`+response.name+`</h1><p>By `+buildArtistStringWithLinks(response.artists)+` &bull; `+response.release_date+`</p></div></div><div class="popularSongSpacer"></div>`);
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
