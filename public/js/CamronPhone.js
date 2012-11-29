CamronPhone = function( _p, _upload ) {
    var self = this;
    var parent = _p;

    this.trashio = new TrashIO( self, "camronjs" );
    this.upload = _upload || false;

    this.handleFile = function(file) {
        var reader = new FileReader;
        reader.onload = function (event) {
            var dataURL = event.target.result;
            var byteString = atob(dataURL.split(',')[1]);
            var binary = new BinaryFile(byteString, 0, byteString.length);

            var exif = EXIF.readFromBinaryFile(binary);
            var orientation = exif["Orientation"];

            var mpImg = new MegaPixImage(file);

            mpImg.render(document.getElementById('image'), {
                maxWidth: 640,
                maxHeight: 480,
                orientation: orientation,
                onRender: function(){
                    var canvas = document.getElementById('image');

                    var image = $("<div>").addClass("image");
                    var img = new Image();
                    $(img).hide();
                    img.onload = function(){
                        var w = this.width;
                        var h = this.height;
                        $(this).css({
                            width: w,
                            height: h,
                            top: 640/2 - h/2,
                            left: 640/2 - w/2
                        }).fadeIn();
                    }
                    img.src = $("#image")[0].toDataURL("image/png");
                    $(image).html(img);
                    $("#images").prepend(image);

                    $(".image").each(function(index,value){
                        $(this).css({
                            left: index*640
                        });
                    });

                    $.ajax({
                        type: 'POST',
                        url: '/upload',
                        dataType: "json",
                        data: { image: $("#image")[0].toDataURL("image/png").replace(/^data:image\/(png|jpeg);base64,/, "") }, //wtf?!
                        success: function(resp){
                            if( resp["result"] && resp["result"] == "success") {
                                var msg = self.trashio.createMessage("add", resp["msg"] );
                                self.trashio.sendMessage(msg);
                            }
                        }
                    });
                }
            });
        }
        reader.readAsDataURL(file);
    }

    this.addImage = function( url ) {
        var image = $("<div>").addClass("image");
        var img = new Image();
        $(img).hide();
        img.onload = function(){
            var w = this.width;
            var h = this.height;
            $(this).css({
                width: w,
                height: h,
                top: 640/2 - h/2,
                left: 640/2 - w/2
            }).fadeIn();
        }
        img.src = url;
        $(image).html(img);
        $("#images").prepend(image);

        $(".image").each(function(index,value){
            $(this).css({
                left: index*640
            });
        });
    }
}