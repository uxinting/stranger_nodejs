(function(w){
	
	function send() {
		var text = $('.control input').val();
		if ( !text ) return;
		
		$('.control input').val('');
		
		wss.send( text );
	}
	
	$('.control button').click(function(e){
		send();
	})
	
	$('input').keyup( function( e ) {
		
		if ( e.keyCode == '13' ) {
			send();
		}
	})
	
	$('#back').click(function(){back();})
})(window)
