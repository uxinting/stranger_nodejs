(function(w){

	var lisHeight = 48; //body.padding-top
	
	function getSomeone() {
		$('#index').hide();
		$('#chat').show();
		
		$('#back span').removeClass('hidden');
		$('header .nvtt').text( 'Hi' );
		$('#connect').removeClass('active');
		
		var el = $('<li class="c_ok"><p>已为你连接上一位朋友，打个招呼吧</p></li>');
		el.appendTo($('#chat ul'));
		
		lisHeight += parseInt( el.css( 'height' ) );
	}
	
	function onOpen(e) {
		console.log('Connected.');
	}
	
	function onClose(e) {
		if ( $('#chat').css('display') == 'none' ) return;
		
		console.log('Disconnected.');
		
		alert('连接已断开.');
		
		$('header .nvtt').text( '遇见' );
		$('#back span').addClass('hidden');
		
		var el = $('<li class="c_err"><p>连接已断开</p></li>');
		el.appendTo($('#chat ul'));
		
		lisHeight += parseInt( el.css( 'height' ) );
		
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
				default:break;
			}
		} else {
			var el = $('<li><p>' + msg.msg + '</p></li>');
			el.addClass( msg.from ).appendTo($('#chat ul'));
			
			lisHeight += parseInt( el.css( 'height' ) );
			
			var ulH = $('#chat .control').offset().top;
			console.log( ulH );
			
			if ( ulH < lisHeight ) {
				$('ul').scrollTop(lisHeight - ulH);
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
	
	$('#about-btn').click(function(){
		var text = prompt('感谢您使用本应用，欢迎反馈任何建议或意见。\n也可以直接给作者发邮件:\nwu.xinting@hotmail.com', '我想对作者说');
		if ( text ) {
			$.get( 'http://112.74.78.178:8081/about', {msg: text});
		}
	})
	
	$('ul').css({'height': $(w).height()-100+'px'});
})(window)
