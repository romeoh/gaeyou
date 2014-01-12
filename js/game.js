var  code = 'game'
	,hash
	,cuData = {}
	
	,replyStart = 0
	,replyTotal = 20

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	hash = getHash();
	
	M('#btnGaeup').on('click', function(){
		setGaeup('up')
	})
	M('#btnGaedown').on('click', function(){
		setGaeup('down')
	})
	
	if (admin) {
		M('#btnNew').html('<a class="gnbNew" href="add.html"></a>');
	}
	
	// 썰 전문통신
	databody = {
		'idx': hash
	}
	
	request(code+'_get_list', databody, function(result){
		var  result = M.json(result)
			,str = ''
			
		if (result.length == 0) {
			window.location.href = './list.html'
		}
		cuData['idx'] = hash = result[0].idx;
		cuData['title'] = decodeURIComponent(result[0].title).replace(/\+/g, ' ').replace('\n', '<br>');
		cuData['game_url'] = decodeURIComponent(result[0].game_url);
		cuData['thum'] = decodeURIComponent(result[0].thum);
		cuData['thum_large'] = decodeURIComponent(result[0].thum_large);
		cuData['genre'] = decodeURIComponent(result[0].genre);
		cuData['mode'] = decodeURIComponent(result[0].mode);
		cuData['text'] = decodeURIComponent(result[0].text).replace(/\+/g, ' ').replace('\n', '<br>');
		cuData['reply'] = result[0].reply;
		cuData['good'] = result[0].good;
		cuData['bad'] = result[0].bad;
		cuData['view'] = result[0].view;
		cuData['regDate'] = result[0].regDate;
		cuData['replyList'] = [];
		
		M('#thum').html('<img src="http://romeoh.github.io/gaeyou/upload/game/large/' + cuData['thum_large'] + '">');
		//M('#thum').html('<img src="../upload/game/large/' + cuData['thum_large'] + '">');
		M('#title').html( cuData['title'] );
		M('#desc').html( cuData['text'] );
		M('#title').html( cuData['title'] );
		M('#title').html( cuData['title'] );
		M('#btnGaeup').html('<i class="fa fa-thumbs-up"></i> 깨업 (' + cuData['good'] + ')')
		M('#btnGaedown').html('<i class="fa fa-thumbs-down"></i> 깨따 (' + cuData['bad'] + ')')
		M('#replyTitle').html('<i class="fa fa-smile-o"></i> ' + cuData['reply'] + '개의 댓글이 있습니다. ');
		
		M('#gametitle')
			.html(cuData['title'])
			.on('click', function(){
				window.location.href = './list.html'
			})
		
		M('#play').on('click', function() {
			var  winWidth = window.innerWidth
				,winHeight = window.innerHeight
			
			if (!getAd()) {
				alert('공유 좀 부탁 드릴께요~');
				M('#adinfo').css('display', 'block')
				M.scroll( M.scroll().y + 300 );
				return false;
			}
			
			if (cuData['mode'] == 'LAND' && winWidth < winHeight) {
				alert('스마트폰을 가로로 돌린 후 다시 시작하세요.')
				return false;
			}
			if (cuData['mode'] == 'PORT' && winWidth > winHeight) {
				alert('스마트폰을 세로로 돌린 후 다시 시작하세요.')
				return false;
			}
			window.location.href = cuData['game_url'];
		})
		initView();
		//initWriteReply()
		//getReply()
	})
}

// 깨업
function setGaeup(flag) {
	if ( checkUniq(code + '_gaeup_list', cuData['idx']) ) {
		//if (!admin) {
			alert('이미 평가 하셨습니다.');
			return false;
		//}
	}

	// 깨업
	databody = {
		'idx': hash,
		'flag': flag
	}
	request(code+'_gaeup', databody, function(result){
		var  result = M.json(result)
				
		setUniq(code + '_gaeup_list', cuData['idx']);
		if (result['flag'] == 'up') {
			M('#btnGaeup').html('<i class="fa fa-thumbs-up"></i> 깨업 (' + result['total'] + ')')
		} else if (result['flag'] == 'down') {
			M('#btnGaedown').html('<i class="fa fa-thumbs-down"></i> 깨따 (' + result['total'] + ')')
		}
		
	})
}

// 조회수 올리기
function initView() {
	// 조회수 업데이트
	//if ( !checkUniq(code + '_view', cuData['idx']) ) {
	//if ( !checkUniq(code + '_view', cuData['idx']) || admin) {
		bodyData = {
			'idx': cuData['idx'],
			'code': code,
			'url': window.location.href,
			'ua': navigator.userAgent
		}
		$.ajax({
			 'url': apiurl + code + '_view.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq(code + '_view', cuData['idx']);
				//M('#viewCount').html(result['total']);
			}
		})
	//}
}


// 댓글 가져오기
function getReply() {
	databody = {
		'idx': cuData['idx'],
		'total': replyTotal,
		'start': replyStart
	}

	request(code+'_reply_get', databody, function(result){
		var  result = M.json(result)
			,str = ''

		replyStart = replyTotal + replyStart;
		
		// 댓글가져오기
		if (result.length == 0) {
			str += '<li>';
			str += '	<p class="no_reply"><i class="fa fa-pencil"></i> 제일 먼저 댓글을 작성해 보세요.</p>';
			str += '</li>';
		} else {
			if (result.length < replyTotal) {
				//str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-replymore>댓글 더 불러오기</li>';
			}
			
			for (var i=result.length-1; i>=0; i--) {
				var  replys = {}
					,deleteAble = checkUniq(code + '_list', result[i]['idx'])
					//,n = i+1

				replys['uname'] = decodeURIComponent( result[i]['uname'] );
				replys['kasid'] = decodeURIComponent( result[i]['kasid'] );
				replys['text'] = decodeURIComponent( result[i]['text'] );
				replys['idx'] = decodeURIComponent( result[i]['idx'] );
				replys['regDate'] = result[i]['regDate'];
				cuData['replyList'].push(replys);
				str += '<li>';
				str += '	<div class="reply_info">';
				str += '		<span>' + replys['uname'] + '</span>';
				str += '		<span> | ' + M.dynamicDate(replys['regDate']) + '</span>';
				if (deleteAble) {
					str += '		<span> | <i class="fa fa-trash-o" data-del="' + replys['idx'] + '"></i></span>';
				}
				str += '	</div>';
				str += '	<p>' + replys['text'] + '</p>';
				str += '</li>';
			}
		}
		
		//M('#reply_con').html( str + M('#reply_con').html() );
		//M('#replyTitle').html('<i class="fa fa-smile-o"></i> 댓글 <span>(' + cuData['reply'] + '개)</span>')
		
		// 댓글 더보기
		/*M('[data-replymore]').on('click', function(evt, mp){
			mp.remove();
			getReply();
		})*/
		
		
		// 삭제하기
		/*if (deleteAble) {
			M('[data-del]').on('click', function(evt, mp){
				if(!confirm('정말 삭제하시겠습니까?')) {
					return false;
				}
				id = mp.data('del');
				
				bodyData = {
					'idx': id,
					'gameIdx': cuData['idx'],
					'ua': navigator.userAgent
				}
				$.ajax({
					 'url': apiurl + code + '_reply_del.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						var result = M.json(result)
							test = M.json(M.storage(code + '_list'))
							popList = []
							
						for (var i=0; i<test.length; i++) {
							if (result['id'] != test[i]) {
								popList.push(test[i]);
							}
						}
						M.storage(code + '_list', M.json(popList));
						window.location.reload();
					}
				})
			})
		}*/
	})
}

// 댓글쓰기 전문
function initWriteReply() {
	M('#fcontent').on('focus', function(evt, mp){
		if (mp.hasClass('place')) {
			mp.removeClass('place');
			mp.val('');
		}
	})
	M('#fcontent').on('blur', function(evt, mp){
		if (mp.val() == '') {
			mp.addClass('place');
			mp.val('심각한 욕설, 선정적인 표현은 삭제될 수 있습니다.');
		}
	})
	M('#fcontent').on('keyup', function(evt, mp){
		M('#ficleng').html(mp.val().length+'/1000')
	})
	M('#btnReg').on('click', function(evt, mp){
		if (M('#fauthor').val() == '') {
			alert('닉네임을 입려하세요.');
			M('#fauthor').focus();
			return false;
		}
		if (M('#fcontent').hasClass('place')) {
			alert('댓글을 입력해 주세요.');
			M('#fcontent').focus();
			return false;
		}
		databody = {
			'idx': cuData['idx'],
			'uname': encodeURIComponent(M('#fauthor').val()),
			'kasid': '',
			'text': encodeURIComponent(M('#fcontent').val()),
			'ua': navigator.userAgent,
			'url': window.location.href
		}
		request(code+'_reply_add', databody, function(result){
			console.log(result)
			var  result = M.json(result)
				,key = code + '_list'
			
			setUniq(key, result['id']);
			window.location.reload();
		})
	})
}


function action(_data) {
	var  data = _data || {}
		,media = data.media || 'story'
		,post = ''
		,twit = ''
	
	if (!getAd()) {
		setUniq(code + '_ad', cuData['idx']);
	}
	
	data.title = cuData['title'];
	data.app = '설치하지 않고 즐기는: 웹게임';
	data.url = 'http://gaeyou.com/game/#'+cuData['idx'];

	if (media == 'talk') {
		shareData(data);
		return false;
	}
	
	post += '🐼 설치할 필요없는 웹게임\n';
	post += '────────────────────\n'
	post += '[' + data.title + ']\n\n';
	post += cuData['text'].replace(/\<br\>/g, '\n')+'';
	data.post = post;
	
	data.desc = '깨알유머 웹게임';
	data.app = '설치하지 않고 웹게임을 즐기세요.';
	data.img = 'http://gaeyou.com/upload/game/thum/'+cuData['thum'];

	shareData(data);
}

function getAd() {
	var adList = M.storage(code + '_ad') || '[]'
	adList = M.json(adList)
	
	for (var i in adList) {
		if (adList[i] == cuData['idx']) {
			return true;
		}
	}
	return false;
}

// 전문통신
function request(tr, data, callback) {
	if (data['file']) {
		$.ajaxFileUpload({ 
			url : apiurl + tr + '.php',
			type: "POST",
			secureuri : false, 
			fileElementId : data['file'], //'photo'
			dataType : 'json', 
			data : data,
			complete:function(result){
				callback(result);
			}
		})
	} else {
		$.ajax({
			 'url': apiurl + tr + '.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': data
			,'type': 'POST'
			,'success': function(result){
				callback(result);
			}
		})
	}
}






