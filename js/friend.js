var  replyFriendList = M.storage('replyFriendList') || []
	,code = 'friend'
	,cuData = {}
	,apiurl = 'http://gaeyou.com/api/'
	
	// 더보기
	,friendStart = 0
	,friendTotal = 20
	
	,rankData = {}
	,ClevisURL = {

// URL Pattern
_patterns : {
	url : '(?:\\b(?:(?:(?:(ftp|https?|mailto|telnet):\\/\\/)?(?:((?:[\\w$\\-'
		+ '_\\.\\+\\!\\*\\\'\\(\\),;\\?&=]|%[0-9a-f][0-9a-f])+(?:\\:(?:[\\w$'
		+ '\\-_\\.\\+\\!\\*\\\'\\(\\),;\\?&=]|%[0-9a-f][0-9a-f])+)?)\\@)?((?'
		+ ':[\\d]{1,3}\\.){3}[\\d]{1,3}|(?:[a-z0-9]+\\.|[a-z0-9][a-z0-9\\-]+'
		+ '[a-z0-9]\\.)+(?:biz|com|info|name|net|org|pro|aero|asia|cat|coop|'
		+ 'edu|gov|int|jobs|mil|mobi|museum|tel|travel|ero|gov|post|geo|cym|'
		+ 'arpa|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|'
		+ 'bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bw|by|bz|ca|cc|cd|cf|cg|ch'
		+ '|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|e'
		+ 'r|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|'
		+ 'gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it'
		+ '|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|l'
		+ 't|lu|lv|ly|ma|mc|me|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|'
		+ 'mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph'
		+ '|pk|pl|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|s'
		+ 'i|sk|sl|sm|sn|sr|st|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|'
		+ 'tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|za|zm'
		+ '|zw)|localhost)\\b(?:\\:([\\d]+))?)|(?:(file):\\/\\/\\/?)?([a-z]:'
		+ '))(?:\\/((?:(?:[\\w$\\-\\.\\+\\!\\*\\(\\),;:@=ㄱ-ㅎㅏ-ㅣ가-힣]|%['
		+ '0-9a-f][0-9a-f]|&(?:nbsp|lt|gt|amp|cent|pound|yen|euro|sect|copy|'
		+ 'reg);)*\\/)*)([^\\s\\/\\?:\\"\\\'<>\\|#]*)(?:[\\?:;]((?:\\b[\\w]+'
		+ '(?:=(?:[\\w\\$\\-\\.\\+\\!\\*\\(\\),;:=ㄱ-ㅎㅏ-ㅣ가-힣]|%[0-9a-f]'
		+ '[0-9a-f]|&(?:nbsp|lt|gt|amp|cent|pound|yen|euro|sect|copy|reg);)*'
		+ ')?\\&?)*))*(#[\\w\\-ㄱ-ㅎㅏ-ㅣ가-힣]+)?)?)',
	querystring: new RegExp('(\\b[\\w]+(?:=(?:[\\w\\$\\-\\.\\+\\!\\*\\(\\),;'
		+ ':=ㄱ-ㅎㅏ-ㅣ가-힣]|%[0-9a-f][0-9a-f]|&(?:nbsp|lt|gt|amp|cent|poun'
		+ 'd|yen|euro|sect|copy|reg);)*)?)\\&?', 'gi')
},

/**
 * _process : 정규식 컴파일 후 검색
 * @param   (string)		string		  문자열
 * @param   (string)		modifiers	   정규식 수식어
 * @return  (mixed)						 정규식 결과 = [ array | null ]
 */
_process : function (string, modifiers) {
	if ( ! string) throw new Error(1, '입력값이 비어 있습니다.');

	var p = new RegExp(ClevisURL._patterns.url, modifiers);
	return string.match(p);
},

/**
 * collect : 문장에서 여러 URL 주소 검색
 * @param   (string)		text			URL 을 찾을 문장
 * @return  (array)						 배열로 리턴
 */
collect : function (text) {
	var r = ClevisURL._process(text, 'gmi');
	return (r) ? r : [];
},

/**
 * parse : 하나의 URL 주소를 분석
 * @param   (string)		url			 URL 주소
 * @return  (object)						객체로 리턴
 */
parse : function (url, type) {
	var r = ClevisURL._process(url, 'mi');

	if ( ! r) return {};

	// HTTP 인증정보
	if (r[2]) r[2] = r[2].split(':');

	// 쿼리스트링 분석
	if (r[9]) {
		r[9] = r[9].match(ClevisURL._patterns.querystring);
		for (var n = 0; n < r[9].length; n++) {
			r[9][n] = (r[9][n] ? r[9][n].replace(/\&$/, '').split('=') : []);
			if (r[9][n].length == 1)
				r[9][n][1] = '';
		}
	}

	// 프로토콜이 없을 경우 추가
	if ( ! r[1] && ! r[5]) {
		// 도메인이 없는 경우 로컬 파일 주소로 설정
		if ( ! r[3]) r[5] = 'file';

		// E-Mail 인지 체크
		else if (r[0].match(new RegExp('^('+ r[2][0] +'@'+ r[3] +')$')))
			r[1] = 'mailto';

		// 기타 기본 포트를 기준으로 프로토콜 설정.
		// 포트가 없을 경우 기본적으로 http 로 설정
		else {
			switch (r[4]) {
				case 21:	r[1] = 'ftp'; break;
				case 23:	r[1] = 'telnet'; break;
				case 443:   r[1] = 'https'; break;
				case 80:
				default:	r[1] = 'http'; break;
			}
		}

		r[0] = (r[1] ? r[1] +'://' : r[5] +':///')
			+ r[0];
	}

	return {
		'url'	   : r[0],					 // 전체 URL
		'protocol'  : (r[1] ? r[1] : r[5]),	 // [ftp|http|https|mailto|telnet] | [file]
		'userid'	: (r[2] ? r[2][0] : ''),	// 아이디 : HTTP 인증 정보
		'userpass'  : (r[2] ? r[2][1] : ''),	// 비밀번호
		'domain'	: (r[3] ? r[3] : ''),	   // 도메인주소
		'port'	  : (r[4] ? r[4] : ''),	   // 포트
		'drive'	 : (r[6] ? r[6] : ''),	   // 'file' 프로토콜인 경우
		'directory' : (r[7] ? r[7] : ''),	   // 하위 디렉토리
		'filename'  : (r[8] ? r[8] : ''),	   // 파일명
		'querys'	: (r[9] ? r[9] : ''),	   // 쿼리스트링
		'anchor'	: (r[10] ? r[10] : '')	  // Anchor
	};
}
};// END: ClevisURL;


window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	/**
	if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '../t/';
		return false;
	}
	/**/
	
	
	var  hash = window.location.hash.replace('#', '')
	
	// 현재 친구찾기 전문통신
	bodyData = {
		'idx': hash
	}
	$.ajax({
		 'url': apiurl + 'friend_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,idx = result['idx']
				,mySex = decodeURIComponent(result['mySex'])
				,myArea = decodeURIComponent(result['myArea'])
				,uid = decodeURIComponent(result['uid'])
				,msg = decodeURIComponent(result['msg'])
				,likes = decodeURIComponent(result['likes'])
				,fsex = decodeURIComponent(result['fsex'])
				,fage = decodeURIComponent(result['fage'])
				,relative = decodeURIComponent(result['relative'])
				,gaeup = result['gaeup']
				,letter = decodeURIComponent(result['letter'])
			
			// 조회수 업데이트
			setView(code, idx, cbSetView);
			function cbSetView(result){
				//console.log(result)
			}
			
			if (result['idx'] == undefined) {
				window.location.href = 'http://gaeyou.com/f/';
				return false;
			}
			//console.log(result)
			cuData.idx = result['idx']
			cuData.mySex = mySex
			cuData.myArea = myArea
			cuData.uid = uid
			cuData.msg = msg
			cuData.likes = likes
			cuData.fsex = fsex
			cuData.fage = fage
			cuData.relative = relative
			cuData.gaeup = gaeup
			cuData.letter = letter
			deleteAble = deleteAble(cuData.idx);
			
			if (result['profile']) {
				M('.profile').css('display', 'block')
				M('#profile')
					.attr('src', 'http://gaeyou.com/upload/friend/middle/'+decodeURIComponent(result['profile']))
					.on('click', function(){
						M('[data-pop]')
							.css('display', 'block')
							.on('click', function(){
								M('[data-pop]').css('display', 'none')
							})
						
						M('[data-full]').attr('src', 'http://gaeyou.com/upload/friend/large/'+decodeURIComponent(result['profile']))
					})
				
			}
			M('#qtitle').html(fage + ' / ' + fsex + ' / ' + relative + ' 구해요')
			M('#mySex').html( mySex );
			M('#myArea').html( myArea );
			M('#uid').html( uid + ' (' + msg + ')' );
			M('#likes').html( likes );
			
			M('#fsex').html( fsex );
			M('#fage').html( fage );
			M('#relative').html( relative );
			M('#letter').html( letter );
			M('#gaeup').html('<em class="ico_gaeup"></em>깨업 (' + gaeup + '회)');
			
			getReply(cuData.idx);
			getFriendList();
			
			if (cuData['msg'] == '카카오스토리') {
				M('#btnClip')
					.html('<span><em class="ico_check"></em>스토리 방문</span>')
					.attr('href', '../r/u.html#' + cuData.uid)
				M('#clipboard').css('display', 'none')
			} else {
				M('#btnClip').html('<span><em class="ico_check"></em>' + cuData.uid + '</span>');
			}
			//console.log(admin , deleteAble, admin || deleteAble)
			if (admin || deleteAble) {
				M('#fauthor').css('display', 'block')
				
				M('#fauthor').on('click', function(evt, mp){
					if(!confirm('랭킹을 정말 삭제하시겠습니까?')) {
						return false;
					}
					bodyData = {
						'idx': cuData.idx
					}
					$.ajax({
						 'url': apiurl + 'friend_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							console.log(result)
							var result = M.json(result)
								friendList = M.json(M.storage('friendList'))
								popList = []
								
							for (var i=0; i<friendList.length; i++) {
								if (result['id'] != friendList[i]) {
									popList.push(friendList[i])
								}
							}
							M.storage('friendList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var friendList = M.storage('friendList')
				
				if (typeof friendList === 'string') {
					friendList = M.json(friendList);
				} else {
					friendList = []
				}

				for (var i=0; i<friendList.length; i++) {
					if (friendList[i] == idx) {
						return true;
					}
				}
				return false;
			}
			
		}
	})
	
	// 클립보드에 복사
	/*M('#btnClip').on('click', function(evt, mp){
		id = cuData.uid
		window.clipboardData.setData("Text", oViewLink);
		console.log(evt, id)
		
	})*/
	
	// 깨업
	M('#btnGaeup').on('click', function(evt, mp){
		if ( checkUniq('gaeupList', cuData.idx) ) {
			alert('이미 깨업하셨습니다.');
			return false;
		}
		
		// 깨업 전문 통신
		bodyData = {
			'idx': cuData.idx
		}
		$.ajax({
			 'url': apiurl + 'friend_gaeup.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq('gaeupList', cuData.idx);
				M('#gaeup').html('<em class="ico_gaeup"></em>깨업 (' + result['total'] + '회)');
			}
		})
	})
}




function getReply(idx) {
	// 댓글 가져오기 전문통신
	bodyData = {
		'idx': idx,
		'total':'10',
		'start':''
	}
	$.ajax({
		 'url': apiurl + 'friend_reply_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json( result )
	
			if (result.length == 0) {
				str += '<li>';
				str += '	<div class="noReply">처음으로 댓글을 써보세요.</div>';
				str += '</li>';
				M('#replyList').html(str)
			} else {
				for (var i=0; i<result.length; i++) {
					var  content = result[i]['text']
						,urlParser = ClevisURL.collect(content)
					
					if (urlParser[0]) {
						urlTxt = urlParser[0].replace('http://', '').replace('https://', '').replace('www.', '');
						urlTxt = content.replace(urlParser, '<a href="'+urlParser+'" target="_blank">'+urlTxt+'</a>')
					} else {
						urlTxt = content
					}
					deleteable = deleteAble(result[i]['idx']);
					//console.log(decodeURIComponent(urlTxt))
					str += '<li data-reply="' + result[i]['idx'] + '">';
					str += '	<div class="profile">';
					str += '		<div class="photo"><img src="../images/imoticon/' + result[i]['photo'] + '.png" alt=""></div>';
					str += '		<div class="user">';
					str += '			<span class="uname">' + decodeURIComponent(result[i]['uname']) + '</span>';
					str += '			<span class="date">' + M.dynamicDate(result[i]['regDate']) + '</span>';
					str += '			<span class="date">';
					//str += '				<span>신고</span>';
					if (deleteable || admin) {
						str += '				<span data-delreply="' + result[i]['idx'] + '">삭제</span>';
					}
					str += '			</span>';
					str += '		</div>';
					str += '	</div>';
					str += '	<div class="desc">' + decodeURIComponent(urlTxt) + '</div>';
					
					if (result[i]['kasid'] == '') {
						//str += '	<div class="kas">☞ ' + decodeURIComponent(result[i]['uname']) + '</div>';
					} else {
						str += '	<div class="kas"><a href="../r/u.html#' + result[i]['kasid'] + '">☞ ' + decodeURIComponent(result[i]['uname']) + '님카스</a></div>';
					}
					str += '</li>';
				}
				M('#replyList').html(str);
				M('[data-delreply]').on('click', function(evt, mp){
					if(!confirm('댓글을 삭제하겠습니까?')) {
						return false;
					}
					
					id = mp.data('delreply');
					
					bodyData = {
						'idx': id,
						'friendIdx': cuData['idx']
					}
					$.ajax({
						 'url': apiurl + 'friend_reply_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
						console.log(result)
							var result = M.json(result)
								replyList = M.json(M.storage('replyFriendList'))
								popList = []
								
							for (var i=0; i<replyList.length; i++) {
								if (result['id'] != replyList[i]) {
									popList.push(replyList[i])
								}
							}
							M.storage('replyFriendList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var replyList = M.storage('replyFriendList') || []
				
				if (typeof replyList === 'string') {
					replyList = M.json(replyList);
				}

				for (var i=0; i<replyList.length; i++) {
					if (replyList[i] == idx) {
						return true;
					}
				}
				return false;
			}
		}
	})
}


// 친구리스트 전문통신
function getFriendList() {
	bodyData = {
		'total': friendTotal,
		'start': friendStart
	}
	$.ajax({
		 'url': apiurl + 'friend_list_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,str = ''
			//console.log(result)
			friendStart = friendTotal + friendStart;
			for (var i=0; i<result.length; i++) {
				var  idx = result[i]['idx']
					,mySex = decodeURIComponent(result[i]['mySex'])
					,myArea = decodeURIComponent(result[i]['myArea'])
					,uid = decodeURIComponent(result[i]['uid'])
					,profile = decodeURIComponent(result[i]['profile'])
					,msg = decodeURIComponent(result[i]['msg'])
					,likes = decodeURIComponent(result[i]['likes'])
					,fsex = decodeURIComponent(result[i]['fsex'])
					,fage = decodeURIComponent(result[i]['fage'])
					,relative = decodeURIComponent(result[i]['relative'])
					,gaeup = decodeURIComponent(result[i]['gaeup'])
					,view = decodeURIComponent(result[i]['view'])
					,reply = decodeURIComponent(result[i]['reply'])
					,letter = decodeURIComponent(result[i]['letter'])
				
				if (idx == cuData.idx) {
					sel = 'sel';
				} else {
					sel = '';
				}
				if (letter == '' || letter == '<br>') {
					le = relative;
				} else {
					le = letter;
				}
				if (profile == '') {
					photo = 'profile.jpg';
				} else {
					photo = profile;
				}
				
				str += '<li data-rank-idx="124" data-new="" data-hot="" class="' + sel + '">';
				str += '	<a href="/f/#' + idx + '">';
				str += '		<img src="http://gaeyou.com/upload/friend/small/'+photo+'">';
				str += '		<div class="letter">' + le + '</div>';
				str += '		<div class="info">';
				//str += '			' + fage + ' / ' + fsex;	//relative
				str += '			<span>조회: ' + M.toCurrency(view) + ' | 댓글: ' + reply + ' | 깨업: ' + gaeup + '</span>';	//relative
				str += '		</div>';	
				str += '	</a>';
				str += '</li>';	
			}
			if (result.length < friendTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-more>더 불러오기</li>';
			}
			M('#replyContainer').html( M('#replyContainer').html() + str);
			M('[data-more]').on('click', function(evt, mp){
				mp.remove();
				getFriendList();
			})
		}
	})
}














