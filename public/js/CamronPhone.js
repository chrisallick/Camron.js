CamronPhone = function( _p, _upload ) {
    var self = this;
    var parent = _p;

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

                    var img = new Image();
                    img.onload = function(){
                        img.width = this.height;
                        img.height = this.width;
                        $("#images").prepend(this);
                    }
                    img.src = $("#image")[0].toDataURL("image/png");

                    $.ajax({
                        type: 'POST',
                        url: '/upload',
                        dataType: "json",
                        data: { image: $("#image")[0].toDataURL("image/png").replace(/^data:image\/(png|jpeg);base64,/, "") }, //wtf?!
                        success: function(resp){
                            if( resp["result"] && resp["result"] == "success") {
                                console.log( resp["msg"] );
                            }
                        }
                    });
                }
            });
            

        }
        reader.readAsDataURL(file);
    }
}