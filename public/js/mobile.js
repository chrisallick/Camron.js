var camronphone;
$(document).ready(function(){ 

	camronphone = new CamronPhone( window, $("fileinput") );

	$("#file").change(function(){
		camronphone.handleFile( this.files[0] );
	});
});