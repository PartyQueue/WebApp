/* Open */
$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $("#mobile-search-form").submit(function(e) {
    $("#mobile-search-bar").blur();
    e.preventDefault();
    $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: $("#mobile-search-bar").val(),
                type: 'track'
            },
            success: function (response) {
                console.log(response);
                $('#mobile-results').html('');
                $.each(response.tracks.items, function(k,v) {
                  $("#original .song").html(v.name);
                  artist_name = '';
                  $.each(v.artists, function(art, ist) {
                    artist_name += ist.name + ', ';
                  });
                  artist_name = artist_name.substring(0, artist_name.length-2);
                  $("#original .artist").html(artist_name);
                  $("#original .album").attr("src", v.album.images[2].url);
                  $("#original").clone().removeClass("hidden-xs-up").attr("id",v.id).appendTo("#mobile-results");
                  $("#"+v.id).click(function() {
                    var that = $(this);
                    var jqxhr = $.post("http://"+window.location.host+"/add", {'track': $(this).attr("id")}, function(data) {
                      $.notify("Your song has been requested!", {className:"success", position:"bottom right"});
                      that.remove();
                    })
                    .fail(function() {
                      $.notify("Song request failed.", {className:"error", position:"bottom right"});
                      that.show("slow");
                    });
                    that.hide("fast");
                  });
            });
            $(".closebtn").removeClass("hidden-xs-up");
            document.getElementById("mobile-search").style.height = "100vh";
        }});
  });
});
/* Close */
function closeNav() {
    $(".closebtn").addClass("hidden-xs-up");
    document.getElementById("mobile-search").style.height = "0vh";
}
