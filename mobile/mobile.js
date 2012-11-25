var username;
var trash;
var num_images = 0;
$(document).ready(function() {

    /* SETUP */

    username = $.cookie("trash_username") || "derp";
    if( username == "derp" ) {
        $("#setusername").show();
    }
    trash = new Trash(this,username,"home");
    /* END SETUP */

    
    /* SET USERANME */

    $("#setusername").submit(function(event){
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/setusername',
            dataType: "json",
            data: { username: $("#username").val() },
            success: function(resp){
                if( resp["result"] && resp["result"] == "success") {
                    trash.username = resp["msg"];
                    $("#setusername").slideUp();
                    $("#username").blur();
                }
            }
        });
    });

    /* END SET USERANME */


    trash.trashio = new TrashIO(trash,{
        onConnect: function() {},
        onDisconnect: function() {},
        onImage : function(msg) {
            $("#stream").prepend("<li><img class='loader' src='/img/gifs/loading.gif' /><img class='image' src='"+msg["msg"]+"?vib=1' /><div class='uploadedby'>"+msg["username"]+"</div></li>");
            $(".image").load(function(){
                $(this).animate({opacity:1});
            });
        },
        onStreamHistory : function(stream) {
            for( var i = 0, len = stream.length; i < len; i++ ) {
                $("#stream").append("<li><img class='loader' src='/img/gifs/loading.gif' /><img class='image' src='"+stream[i]["msg"]+"?vib=1' /><div class='uploadedby'>"+stream[i]["username"]+"</div></li>");
            }
            $(".loader").css({
                left: $("#stream").width()/2 - $(".loader").width()/2,
                top: $("#stream li").height()/2 - $(".loader").height()/2
            });
            $("#fileinput").fadeIn();
            $(".image").load(function(){
                $(this).animate({opacity:1});
            });
        }
    });
    trash.setup();


    /* FILE UPLOAD */

    $("#file").change(function(event) {
        var reader = new FileReader;
        $(".loader").show();
        reader.onload = function (event) {
            $.ajax({
                type: 'POST',
                url: '/mobileupload',
                dataType: "json",
                data: { image: reader.result.replace(/^data:image\/(png|jpeg);base64,/, "") },
                success: function(resp){
                    if( resp["result"] && resp["result"] == "success") {
                        var msg = trash.createMessage("image",resp["msg"]);
                        trash.trashio.sendMessage(msg);
                        $(".loader").hide();
                    }
                }
            });
        }
        reader.readAsDataURL(event.target.files[0]);
    });

    /* END FILE UPLOAD */


});