var camron;
$(document).ready(function() {

	camron = new Camron( window, $("#camera-wrapper"), true );

	$("#camera-button").click(function(event){
		event.preventDefault();
		camron.open();
		$(this).fadeOut();
	});

	$(window).resize(camron.handleResize());
});
