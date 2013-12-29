var  pollList = M.storage('pollList') || []
	,replyList = M.storage('replyList') || []
	,cuQuestion
	,apiurl = 'http://gaeyou.com/api/'
	
	// 다른랭킹 더보기
	,rankStart = 0
	,rankTotal = 20
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 15
	
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
	var  hash = window.location.hash.replace('#', '')
	
	// 현재 랭킹 전문통신
	bodyData = {
		'idx': hash
	}
	$.ajax({
		 'url': apiurl + 'rank_question_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result)
			
			if (result['idx'] == undefined) {
				window.location.href = '/r';
				return false;
			}
			
			rankData.idx = result.idx;
			rankData.title = result.title;
			rankData.question = result.question;
			rankData.totalVote = result.totalVote;
			rankData.photo = result.photo;
			
			cuQuestion = result['idx'];
			deleteAble = deleteAble(cuQuestion);
			M('#qtitle').html( decodeURIComponent(result['title']) );
			if (result['kasid'] == '') {
				author = '작성자: ' + decodeURIComponent(result['uname']);
			} else {
				author = '작성자: <a href="u.html#' + result['kasid'] + '">☞ ' + decodeURIComponent(result['uname']) + '님카스</a>';
			}
			if (deleteAble) {
				author += ' | <span data-delrank="' + cuQuestion + '">삭제</span>';
			}
			M('#qauthor').html(author);
			M('#question').html('<span class="ico_q">Q</span>' + decodeURIComponent(result['question']) )
			
			// 보기 리스트 
			getQList(cuQuestion);
			
			// 다른 리스트
			getRankList();
			
			// 댓글 불러오기
			getReply(cuQuestion);
			
			if (deleteAble) {
				M('[data-delrank]').on('click', function(evt, mp){
					if(!confirm('랭킹을 정말 삭제하시겠습니까?')) {
						return false;
					}
					id = mp.data('delrank');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + 'rank_question_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
								rankAddList = M.json(M.storage('rankAddList'))
								popList = []
								
							for (var i=0; i<rankAddList.length; i++) {
								if (result['id'] != rankAddList[i]) {
									popList.push(rankAddList[i])
								}
							}
							M.storage('rankAddList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var rankAddList = M.storage('rankAddList')
				
				if (typeof rankAddList === 'string') {
					rankAddList = M.json(rankAddList);
				} else {
					rankAddList = []
				}

				for (var i=0; i<rankAddList.length; i++) {
					if (rankAddList[i] == idx) {
						return true;
					}
				}
				return false;
			}
		}
	})
	
	// 새랭킹 만들기
	if (!M.storage('hideNoticeNew')) {
		M('#noticeNew').css('display', 'block')
	}
	M('#btnNew').on('click', function(evt, mp){
		M.storage('hideNoticeNew', 'true');
	})
	
	// 댓글
	M('#inpReply').on('focus', function(evt, mp){
		mp.focus();
		showReply();
	})
	M('#inpReply').on('blur', function(evt, mp){
		hideReply();
	})
	
	M('#uname').on('focus', function(evt, mp){
		showReply();
	})
	M('#uname').on('blur', function(evt, mp){
		M.storage('uname', mp.val())
		hideReply();
	})
	
	M('#kasid').on('focus', function(evt, mp){
		showReply();
	})
	M('#kasid').on('blur', function(evt, mp){
		M.storage('kasid', mp.val())
		hideReply();
	})
	
	if ( M.storage('uname') ) {
		M('#uname').val(M.storage('uname'))
	}
	if ( M.storage('kasid') ) {
		M('#kasid').val(M.storage('kasid'))
	}
	
	// 댓글 180자 제한
	M('#inpReply').on('keyup', function(evt, mp){
		var txt = mp.html()
		if (txt.length >= 180) {
			mp.html( txt.substr(0, 170) );
			alert('180자 이상 입력할수 없습니다.');
		}
	})
	
	// 댓글쓰기 전문통신
	M('#btnSubmit').on('click', function(evt, mp){
		if (M('#inpReply').html() == '') {
			alert('내용을 입력해주세요.');
			M('#inpReply').focus();
			return false;
		}
		
		if (M('#uname').val() == '') {
			alert('이름을 입력해주세요.');
			M('#uname').css('display', 'block');
			M('#kasid').css('display', 'block');
			M('#uname').focus();
			return false;
		}
		M.storage('uname', M.storage('uname'));
		M.storage('kasid', M.storage('kasid'));
		
		imoidx = process(dataPhoto);
		imoticon = dataPhoto[imoidx]
		bodyData = {
			'idx': encodeURIComponent(cuQuestion),
			'uname': encodeURIComponent(M('#uname').val()),
			'kasid': encodeURIComponent(M('#kasid').val()),
			'photo': encodeURIComponent(imoticon),
			'text': encodeURIComponent(M('#inpReply').html())
		}
		$.ajax({
			 'url': apiurl + 'rank_reply_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var result = M.json(result);
				replyId = result['id'];
				
				if (typeof replyList === 'string') {
					replyList = M.json(replyList);
				}
				replyList.push(replyId);
				M.storage('replyList', M.json(replyList));
				window.location.reload();
			}
		})
	})
}

function showReply() {
	if (M('#inpReply').hasClass('msg')) {
		M('#inpReply')
			.removeClass('msg')
			.html('')
	}
	M('#uname').css('display', 'block');
	M('#kasid').css('display', 'block');
}
function hideReply() {
	M('#uname').css('display', 'none');
	M('#kasid').css('display', 'none');
}

function getQList(cuQuestion){
	// 현재 랭킹 리스트 전문통신
	bodyData = {
		'idx': cuQuestion
	}
	$.ajax({
		 'url': apiurl + 'rank_list_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			for (var i=0; i<result.length; i++) {
				str += '<div class="plist" data-b="' + result[i]['idx'] + '">';
				str += '	<div class="inner_item">';
				str += '		<span class="txt_g">' + decodeURIComponent(result[i]['text']) + '</span>';
				str += '		<span class="check_item"><span class="ico_ent ico_check"></span></span>';
				str += '	</div>';
				str += '</div>';
			}
			M('#qList').html(str);
			listEvent();
		}
	})
}

function listEvent() {
	// 카스로 보내기
	M('#pollStory').on('click', function(){
		goKas();
	})
	
	// 카톡으로 보내기
	M('#pollKakao').on('click', function(){
		kakao.link('talk').send({
			msg: rankData['title'],
			url: 'http://gaeyou.com/r/#' + rankData['idx'],
			appid: 'gaeyou',
			appver: '1.0',
			appname: '랭킹에 참여해보세요.',//'★깨알유머★를 검색하세요!!',
			type: 'link'
		});
	})
	
	M('[data-b]').on('click', function(evt, mp){
		M('[data-b]').removeClass('on');
		mp.addClass('on');
		M('[data-submit-b]').data('submit-b', mp.data('b'));
	})
	
	M('[data-submit-b]').on('click', function(evt, mp){
		if (typeof pollList === 'string') {
			pollList = M.json(pollList);
		}
		for (var poll in pollList) {
			if (pollList[poll] == cuQuestion) {
				alert('이미 참여한 랭킹입니다.\n새로운 랭킹을 만들어 보면 어떨까요?');
				return false;
			}
		}
		if (mp.data('submit-b') == '') {
			alert('하나의 항목을 선택하세요.');
			return false;
		}
		
		bodyData = {
			'idx': mp.data('submit-b'),
			'questionIdx': rankData['idx']
		}
		$.ajax({
			 'url': apiurl + 'rank_poll_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				if (confirm('랭킹에 참여했습니다.\n결과를 확인할까요?')) {
					goKas();
				} else {
					alert('랭킹에 반영되었습니다.');
				}
				M('[data-b]').removeClass('on');
				pollList.push(cuQuestion);
				M.storage('pollList', M.json(pollList));
			}
		})
	})
}


function getRankList() {

	// 다른 랭킹 리스트 전문통신
	bodyData = {
		'total': rankTotal,
		'start': rankStart
	}
	$.ajax({
		 'url': apiurl + 'rank_question_get_list.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			//console.log(result)
			var  str = ''
				,result = M.json(result);
			
			rankStart = rankTotal + rankStart;
			for (var i=0; i<result.length; i++) {
				if (rankData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				str += '<li data-rank-idx="' + result[i]['idx'] + '" data-new="" data-hot="">';
				str += '	<span class="ico' + sel + '"></span><a href="/r/#' + result[i]['idx'] + '">' + decodeURIComponent(result[i]['title']).substr(0, 19) + '</a> <span class="ico"></span> <span style="color:#bbb; float:right; font-size:11px">' + M.toCurrency(result[i]['totalVote']) + '명 참여</span>';	// new hot
				str += '</li>';
			}
			if (result.length < rankTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-more>랭킹 더 불러오기</li>';
			}
			M('#replyContainer').html( M('#replyContainer').html() + str );
			
			M('[data-more]').on('click', function(evt, mp){
				mp.remove();
				getRankList();
			})
		}
	})
}

function getReply(cuQuestion){
	
	// 댓글 가져오기 전문통신
	bodyData = {
		'idx': cuQuestion,
		'total': replyTotal,
		'start': replyStart
	}
	$.ajax({
		 'url': apiurl + 'rank_reply_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json( result )
			
			replyStart = replyTotal + replyStart;
			//console.log(result)
			if (result.length == 0) {
				str += '<li>';
				str += '	<div class="noReply">처음으로 댓글을 써보세요.</div>';
				str += '</li>';
				M('#replyList').html(str)
			} else {
				if (result.length < replyTotal) {
					//str += '<li class="more">마지막입니다.</li>';
				} else {
					str += '<li class="more" data-replymore>댓글 더 불러오기</li>';
				}
				for (var i=result.length-1; i>=0; i--) {
				//for (var i=5; i>0; i--) {
					var  content = result[i]['text']
						,urlParser = ClevisURL.collect(content)
					
					if (urlParser[0]) {
						urlTxt = urlParser[0].replace('http://', '').replace('https://', '').replace('www.', '');
						urlTxt = content.replace(urlParser, '<a href="'+urlParser+'" target="_blank">'+urlTxt+'</a>')
					} else {
						urlTxt = content
					}
					deleteable = deleteAble(result[i]['idx']);
					
					str += '<li data-reply="' + result[i]['idx'] + '">';
					str += '	<div class="profile">';
					str += '		<div class="photo"><img src="../images/imoticon/' + result[i]['photo'] + '.png" alt=""></div>';
					str += '		<div class="user">';
					str += '			<span class="uname">' + decodeURIComponent(result[i]['uname']).substr(0, 10) + '</span>';
					str += '			<span class="date">' + M.dynamicDate(result[i]['regDate']) + '</span>';
					str += '			<span class="date">';
					//str += '				<span>신고</span>';
					if (deleteable) {
						str += '				<span data-delreply="' + result[i]['idx'] + '">삭제</span>';
					}
					str += '			</span>';
					str += '		</div>';
					str += '	</div>';
					str += '	<div class="desc">' + decodeURIComponent(urlTxt) + '</div>';
					
					if (result[i]['kasid'] == '') {
						//str += '	<div class="kas">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '</div>';
					} else {
						str += '	<div class="kas"><a href="u.html#' + result[i]['kasid'] + '">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '님카스</a></div>';
					}
					str += '</li>';
				}
				M('#replyList').html(str + M('#replyList').html());
				
				// 댓글 더보기
				M('[data-replymore]').on('click', function(evt, mp){
					mp.remove()
					getReply(cuQuestion);
				})
				
				// 댓글 삭제
				M('[data-delreply]').on('click', function(evt, mp){
					if(!confirm('댓글을 삭제하겠습니까?')) {
						return false;
					}
					
					id = mp.data('delreply');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + 'rank_reply_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
								replyList = M.json(M.storage('replyList'))
								popList = []
								
							for (var i=0; i<replyList.length; i++) {
								if (result['id'] != replyList[i]) {
									popList.push(replyList[i])
								}
							}
							M.storage('replyList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var replyList = M.storage('replyList') || []
				
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


// 카스로 확인하기
function goKas() {
	bodyData = {
		'idx': rankData['idx']
	}
	$.ajax({
		 'url': apiurl + 'rank_poll_result.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,post = ''
			
			post += '[' + decodeURIComponent(rankData['title']) + ']\n'
			post += decodeURIComponent(rankData['question']) + '\n\n';
			post += '[결과]\n'
			post += getResultString(result);
			
			post += '\n\n총 ' + decodeURIComponent(getTotalVote(result)) + '명이 랭킹에 참여했습니다.\n';
			post += '모두 참여해보세요~\n\n';
			post += '♞ 투표하러 가기\n';
			post += 'http://gaeyou.com/r/#' + rankData['idx'];
			console.log(post)
			
			urlinfo = {
				'title': decodeURIComponent(rankData['title']),
				'desc': decodeURIComponent(rankData['question']),
				'imageurl': ['http://www.gaeyou.com/images/thum/rank.png'],
				'type': 'article'
			}
			kakao.link("story").send({   
		        appid : 'gaeyou',
				appver : '1.0',
				appname : '★깨알유머★를 검색하세요!!',
		        post : post,
				urlinfo : M.json(urlinfo)
		    });
		}
	})
}

function getTotalVote(value) {
	var totalPoll = 0
	
	for (var i=0; i<value.length; i++) {
		totalPoll += parseInt(value[i]['vote'], 10);
	}
	return totalPoll;
}
function getResultString(value, platform) {
	var  str = ''
		,totalPoll = getTotalVote(value)

	for (var i=0; i<value.length; i++) {
		var val = Math.round(value[i]['vote'] / totalPoll * 100) || 0
		//console.log(value[i], totalPoll, val, cuRank)
		if (platform === 'twit') {
			str += '\n- ' + val + '% (' + value[i]['vote'] + '명): ' + decodeURIComponent(value[i]['text']) + ''
		} else {
			str += '\n' + getGraph(val) + ' ' + val + '% (' + value[i]['vote'] + '명): ' + decodeURIComponent(value[i]['text']) + ''
		}
	}
	return str.replace(/\n/, '');
}

function getGraph(value){
	var dataGraph = [
		'□□□□□□□□□□',
		'■□□□□□□□□□',
		'■■□□□□□□□□',
		'■■■□□□□□□□',
		'■■■■□□□□□□',
		'■■■■■□□□□□',
		'■■■■■■□□□□',
		'■■■■■■■□□□',
		'■■■■■■■■□□',
		'■■■■■■■■■□',
		'■■■■■■■■■■'
	]
	return dataGraph[Math.round(value/10)];
}

function process(_min, _max){
	var data, min, max

	if ( getDataType(_min) === 'object' || getDataType(_min) === 'array' ) {
		data = _min;
		return Math.floor(Math.random() * data.length);
	} else {
		min = _min;
		max = _max;
		return Math.floor(Math.random() * (max-min) + min)
	}
}

function getDataType(_value) {
	if (typeof _value === 'string') {
		return 'string';
	}
	if (typeof _value === 'number') {
		return 'number';
	}
	if (_value.constructor === Object) {
		return 'object';
	}
	if (_value.constructor === Array) {
		return 'array';
	}
	if (_value.constructor === Function) {
		return 'function';
	}
	if (_value.constructor === Boolean) {
		return 'boolean';
	}
	return undefined;
}

dataPhoto = [
	'smile1',
	'smile2',
	'smile3',
	'smile4',
	'smile5'
]












