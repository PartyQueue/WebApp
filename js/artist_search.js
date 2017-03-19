function performArtistLookup(id, stash) {
  $.get('https://api.spotify.com/v1/artists/'+id+'/top-tracks?country='+spotify_country, function (response) {
    var topTracks = response;
    $.get('https://api.spotify.com/v1/artists/'+id+'/albums?album_type=album,single&limit=50&market='+spotify_country, function (response) {
      var albums = response;
      $.get('https://api.spotify.com/v1/artists/'+id+'/related-artists', function (response) {
        var related = response;
        $.get('https://api.spotify.com/v1/artists/'+id, function (response) {
          var artist = response;
          var stateObj = {"topTracks":topTracks, "albums":albums, "related":related, "artist":artist};
          displayDesktopArtist(stateObj);
          if(stash && JSON.stringify(history.state) !== JSON.stringify(stateObj)) history.pushState(stateObj, "", "#/artist/"+id);
        });
      });
    });
  });
}
function displayDesktopArtist(response) {
  var $div = $('#desktop-results');
  var imgu = (response.artist.images.length == 0) ? placeholder : response.artist.images[0].url;
  $div.html('<div class="jumbotron jumbotron-fluid" style="background-image:url('+imgu+');"><h1>'+response.artist.name+'</h1></div>');
  var $row = $('<div>', {'class':'row no-gutters'});
  var $topTracks = $('<div>', {'class':'col-7', 'id':'topTracks'});
  var $related = $('<div>', {'class':'col-5', 'id':'related'});
  $row.append($topTracks).append($related);
  $div.append($row);
  $div.append(`<div class="container-fluid"><h4 style="padding-left:12px;">Albums</h4><div class="row" id="artist-albums"></div></div>`);

  $topTracks.append('<h4>Popular</h4><div class="popularSongSpacer"></div>');
  $related.append('<h4>Related Artists</h4>');

  var i = 0;
  $.each(response.topTracks.tracks, function(k,v) {
    if(++i>5) return;
    var imgu = (v.album.images.length == 0) ? placeholder : v.album.images[v.album.images.length-1].url;
    $entry = $("<div>", {"class":"popularSong", "id":v.id}).html("<img src='"+imgu+"' width=40 height=40 />"+v.name);
    $topTracks.append($entry);
  });
  $(".popularSong").click(function() {
    var that = $(this);
    requestSong(that);
  });
  i = 0;
  $.each(response.related.artists, function(k,v) {
    if(++i>7) return;
    var imgu = (v.images.length == 0) ? placeholder : v.images[v.images.length-1].url;
    $entry = $("<div>", {"class":"relatedArtist", "id":v.id}).html("<img class='rounded-circle' src='"+imgu+"' width=40 height=40 />"+v.name);
    $related.append($entry);
  });
  $(".relatedArtist").click(function() {
    performArtistLookup($(this).attr("id"), true);
  });

  $aA = $("#artist-albums");
  $.each(response.albums.items, function(k,v) {
    $col = $("<div>", {"class":"col-xl-4 col-lg-6 thumb", "id":v.id});
    if(v.images.length == 0) return true;
    $col.append("<img class='img-fluid' src='"+v.images[0].url+"'/><p>"+v.name+"</p>");
    $aA.append($col);
  });
  $(".thumb").click(function() {
    performAlbumLookup($(this).attr("id"), true);
  });
}
