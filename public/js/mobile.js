var camronphone, channel;
$(document).ready(function(){
    channel = window.location.pathname.split("/")[2];

    document.body.addEventListener('touchmove',function(e){
        if(!$(e.target).hasClass(".scrollable")) {
            e.preventDefault();
        }
    });

    camronphone = new CamronPhone( window, $("fileinput"), channel );

    $("#file").change(function(){
        camronphone.handleFile( this.files[0] );
    });

    var index = 0;
    var $sw = $('#images');

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

            $sw.on('swipe', function (event) {
                event.preventDefault();

                if( ["left","right"].indexOf(event.direction) != -1 ) {
                    if( event.direction == "right" && index > 0 ) {
                        index--;
                        $(".image").animate({
                            left: "+=640"
                        });
                        console.log("right", index);
                    } else if( event.direction == "left" && index <= $(".image").length-1 ) {
                        index++;
                        $(".image").animate({
                            left: "-=640"
                        });
                        console.log("left", index);
                    }
                }
            });
        }
    });
});