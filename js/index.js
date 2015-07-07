(function(w){

	function getSomeone() {
		$('#index').hide();
		$('#chat').show();
		
		$('#back span').removeClass('hidden');
		$('header .nvtt').text( 'Hi' );
		$('#connect').removeClass('active');
		$('<li class="c_ok"><p>已为你连接上一位朋友，打个招呼吧</p></li>').appendTo($('#chat ul'));
	}
	
	function onOpen(e) {
		console.log('Connected.');
	}
	
	function onClose(e) {
		if ( $('#chat').css('display') == 'none' ) return;
		
		console.log('Disconnected.');
		
		$('header .nvtt').text( '遇见' );
		$('#back span').addClass('hidden');
		$('<li class="c_err"><p>对方已断开</p></li>').appendTo($('#chat ul'));
		
		$('#chat').hide();
		$('#index').show();
	}
	
	function onMsg(e) {
		var msg = JSON.parse(e.data);
		if ( msg.from == 'server' ) {
			switch ( msg.msg ) {
				case 'you':
					getSomeone();
				break;
				case 'close':
					alert('对方断开了连接.');
					onClose();
				break;
				default:break;
			}
		} else {
			$('<li><p>' + msg.msg + '</p></li>').addClass( msg.from ).appendTo($('#chat ul'));
			
			var ulH = $('ul').height();
			var lisH = $('ul li.me, ul li.you').length * $('ul li.me:first').height() +
					   $('ul li.c_ok, ul li.c_err').length * parseInt($('ul li.c_ok:first').css('height'));
			if ( ulH < lisH ) {
				$('ul').scrollTop(lisH - ulH);
			}
		}
	}
	
	function onErr(e) {
		console.error( 'Error ' + e.data );
	}
	
	function connect() {
		var wspath = 'ws://112.74.78.178:8080';
		var ws = new WebSocket(wspath);
		
		ws.onopen = function(e) { onOpen(e); };
		ws.onmessage = function(e) { onMsg(e); };
		ws.onclose = function(e) { onClose(e); };
		ws.onerror = function(e) { onErr(e); };
		
		return ws;
	}
	
	w.back = function() {
		if ( $('#chat').css('display') != 'none' ) {
			if ( confirm('是否要退出当前聊天?') ) {
				wss.close();
			}
		} else {
			if ( confirm('是否要退出程序?') ) {
				if(w.plus){
					ws=plus.webview.currentWebview();
					if (ws.preate) {
						ws.hide('auto');
					} else {
						ws.close('auto');
					}
				} else {
					w.close();
				}
			}
		}
	}
	
	$('#connect').click(function(e){
		$(this).toggleClass('active');
		
		//Connect websocket server
		if ( $(this).hasClass('active') ) {
			w.wss = connect();
		} else {
			w.wss.close();
		}
	})
	
	$('#about').click(function(){
		alert('About!');
	})
	
	$('ul').css({'height': $(w).height()-100+'px'});
})(window)
