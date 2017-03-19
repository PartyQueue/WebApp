var spotify_country="US";

function buildArtistString(artists) {
  var artist_name = '';
  $.each(artists, function(art,ist) { artist_name += ist.name + ', '; });
  return artist_name.substring(0, artist_name.length-2);
}

function buildArtistStringWithLinks(artists) {
  var artist_name = '';
  $.each(artists, function(art,ist) { artist_name += '<a title="'+ist.name+'" href="#/artist/'+ist.id+'">'+ist.name + '</a>, '; });
  return artist_name.substring(0, artist_name.length-2);
}
