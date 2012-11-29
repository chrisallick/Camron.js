var camron, channel;
$(document).ready(function() {

    channel = window.location.pathname.split("/")[2];
	camron = new Camron( window, $("#camera-wrapper"), channel );

	$("#camera-button").click(function(event){
		event.preventDefault();
		camron.open();
		$(this).fadeOut();
	});

	$(window).resize(camron.handleResize());

    $.ajax({
        type: "GET",
        url: "/images",
        dataType: "json",
        data: {
            "channel": channel
        }
    }).done(function(resp){
        if( resp && resp.images && resp.images.length > 0 ) {
            for( var i = 0, len = resp.images.length; i < len; i++ ) {
            	var image = $("<div>").addClass("image");
            	var img = new Image();
            	$(img).hide();
            	img.onload = function() {
            		var w = this.width;
            		var h = this.height;
            		$(this).css({
            			width: w/2,
            			height: h/2,
            			top: 320/2 - h/4,
            			left: 320/2 - w/4
            		}).fadeIn();
            	}
            	img.src = resp.images[i];
            	$(image).css({
            		left: i*320
            	}).html(img);
            	$("#images").append(image);
            }
        }
    });
});
