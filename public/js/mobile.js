var camronphone;
$(document).ready(function(){
	document.addEventListener('touchmove',function(e) {
		e.preventDefault();
	});

	camronphone = new CamronPhone( window, $("fileinput") );

	$("#file").change(function(){
		camronphone.handleFile( this.files[0] );
	});
});