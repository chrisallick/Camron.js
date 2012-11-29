var camronphone;
$(document).ready(function(){
	// document.addEventListener('touchmove',function(e) {
	// 	e.preventDefault();
	// });

	camronphone = new CamronPhone( window, $("fileinput") );

	$("#file").change(function(){
		camronphone.handleFile( this.files[0] );
	});

    $.ajax({
        type: "GET",
        url: "/images",
        dataType: "json",
        data: {
            "channel": "camronjs"
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
            			width: w,
            			height: h,
            			top: 640/2 - h/2,
            			left: 640/2 - w/2
            		}).fadeIn();
            	}
            	img.src = resp.images[i];
            	$(image).css({
            		left: i*640
            	}).html(img);
            	$("#images").append(image);
            }
        }
    });
});