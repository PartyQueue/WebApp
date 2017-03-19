window.onpopstate = routeHandler;
window.onload = loadHandler;

function loadHandler(event) {
  $("#loginModal").modal();
  $("#set-nick").click(login);
  $("#login-form").submit(function(e) {
    e.preventDefault();
    login();
  });
  routeHandler(event);
}

function getCountryCode() {
  $.get( "http://"+window.location.host+"/country/", function( data ) {
    console.log("Found Country Code: "+data);
    spotify_country = data;
    first_success = true;
  });
}

function login() {
  username = $("#nickname").val();
  $("#loginModal").modal('hide');
}

function routeHandler(event) {

  var route = document.URL.split("#");
  if(route.length <= 1 || route[1] === "") {
    closeMobileSearch();
    closeDesktopSearch();
  }
  else if(route[1].startsWith("/msearch/")) {
    if(event.state === undefined || event.state === null) performMobileSearch(decodeURI(route[1].split("/")[2]), false);
    else displayMobileSearch(event.state);
  }
  else if(route[1].startsWith("/search/")) {
    if(event.state === undefined || event.state === null) performDesktopSearch(decodeURI(route[1].split("/")[2]), false);
    else displayDesktopSearch(event.state);
  }
  else if(route[1].startsWith("/artist/")) {
    if(event.state === undefined || event.state === null) performArtistLookup(route[1].split("/")[2], false);
    else displayDesktopArtist(event.state);
  }
  else if(route[1].startsWith("/album/")) {
    if(event.state === undefined || event.state === null) performAlbumLookup(route[1].split("/")[2], false);
    else displayDesktopAlbum(event.state);
  }
}
