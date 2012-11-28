Camron = function( _p, _el ) {
	var self = this;
	var parent = _p;

	this.trashio = new TrashIO( self, "camronjs" );
	this.camera = _el;
	this.timeUntilPhoto = 3;
	this.ct;

	this.flash = false;
	this.html5 = false;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

	$(".takepicture", self.camera).click(function(){
		self.takePicture();
	});

	$(".closecamera", self.camera).click(function(){
		$("#camera-button").fadeIn();
		$(self.camera).animate({
			top: 0,
			left: 0,
			width: 0,
			height: 0
		}, 250, function(){
			if( self.html5 ) {
				var video = document.querySelector('video');
				video.src = "";
			}
			$(self.camera).hide();
		});
	});

	this.handleResize = function() {

	}

	this.addImage = function( url ) {
		console.log( url );
		
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
		img.src = url;
		$(image).html(img);
		$("#images").prepend(image);

	    $(".image").each(function(index,value){
	        $(this).css({
	            left: index*320
	        });
	    });
	}

	this.uploadPhoto = function( img ) {
		$.ajax({
			type: 'POST',
			url: '/uploadfile',
			dataType: "json",
			data: { image: img },
			success: function(resp) {
				// if( resp["result"] && resp["result"] == "success") {
				// 	var msg = trash.createMessage("image",resp["msg"]);
				// 	trash.trashio.sendMessage(msg);
				// }
				$(self.camera).hide();
				$("#camera-button").fadeIn();
			}
		});
	}

	this.cameraCountdown = function() {
		clearTimeout( self.ct );
		self.timeUntilPhoto--;
		$(".countdown", self.camera).html(self.timeUntilPhoto);
		if(self.timeUntilPhoto == 0 ) {
			$(".countdown", self.camera).html("");
			$(".countdown", self.camera).css("background-color", "#FFFFFF");
			$(".countdown", self.camera).fadeOut(1500);
			if( self.flash ) {
				var photo = webcam.save();
				$("#main").prepend("<p>dom element:</p><img class='snapshot' src='data:image/jpeg;base64,"+photo+"' /><p>canvas:</p><canvas></canvas>");
				var canvas = document.querySelector('canvas');

				canvas.width = 320;
				canvas.height = 240;
				var ctx = canvas.getContext('2d');
				var img = new Image();
				img.onload = function() {
					ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				}
				img.src = "data:image/jpeg;base64,"+photo;
			} else if( self.html5 ) {
				$("#main").prepend("<p>canvas:</p><canvas></canvas>");
				var canvas = document.querySelector('canvas');

				canvas.width = 320;
				canvas.height = 240;
				var canvas = document.querySelector('canvas');

				canvas.width = 320;
				canvas.height = 240;
				var video = document.querySelector('video');
				var ctx = canvas.getContext('2d');
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				$("#main").prepend("<p>dom element:</p><img src='"+canvas.toDataURL()+"' />");
			}
		} else {
			self.ct = setTimeout( self.cameraCountdown, 1000 );
		}
	}

	this.successCallback = function( stream ) {
		self.html5 = true;
		var video = $("#camera-wrapper .camera video")[0];
		video.width = 640;
		video.height = 480;

		video.src = window.URL.createObjectURL( stream ) || stream;

		$(".camera").css("opacity","1");
	}
	this.errorCallback = function(error) { console.log( error ); }

	this.attachHTML5  = function( el ) {
		var video = document.querySelector('video');
		video.width = 640;
		video.height = 480;

		var localMediaStream = null;

		if (navigator.getUserMedia) {
  			navigator.getUserMedia({video: true}, self.successCallback, self.errorCallback);
		} else {
			self.attachFlash( el );
		}
	}

	this.attachFlash = function( el ) {
	    el.webcam({
	        swffile: "./swf/sAS3Cam.swf?v=20120613",

	        previewWidth: 640,
	        previewHeight: 480,

	        resolutionWidth: 640,
	        resolutionHeight: 480,

	        noCameraFound: function () {

	        },

	        swfApiFail: function(e) {
	        },

	        cameraDisabled: function () {

	        },

	        cameraEnabled:  function () {
	        	self.flash = true;
	            var cameraApi = this;
	            if (cameraApi.isCameraEnabled) {
	                return;
	            } else {
	                cameraApi.isCameraEnabled = true;
	            }
	            var cams = cameraApi.getCameraList();

	            setTimeout(function() {
	                cameraApi.setCamera('0');
	                $(".camera").css("opacity","1");
	            }, 750);
	        }
	    });
	}

	this.open = function() {
		$(self.camera).show().animate({
			top: 60,
			left: $(document).width()/2 - 480/2,
			width: 640,
			height: 480
		}, 250);
		self.attachHTML5( $(".camera", self.camera) );
	}

	this.takePicture = function() {
		self.timeUntilPhoto = 3;
		$(".countdown", self.camera).css("background-color", "transparent").html("3").show();
		clearTimeout( self.ct );
		self.ct = setTimeout( self.cameraCountdown, 1000 );
	}
}