window.onpopstate = function(event) {
  var route = document.URL.split("#");
  if(route.length <= 1 || route[1] === "") {
    closeMobileSearch();
  }
  else if(route[1].startsWith("/msearch/")) {
    displayMobileSearch(event.state);
  }
}
