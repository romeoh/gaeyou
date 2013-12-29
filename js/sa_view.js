var  replySaList = M.storage('replySaList') || []
	,cuSa = {}
	,apiurl = 'http://gaeyou.com/api/'
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
	M.scroll(0);
	location.reload();
}, false);

function ready() {
	
	if (!admin) {
		alert('서버 점검중입니다.');
		window.location.href = 'http://gaeyou.com/t/';
		return false;
	}
	
	
	var  hash = window.location.hash.replace('#', '')
	
	// 현재 타임라인 가져오기
	bodyData = {
		'idx': hash
	}
	$.ajax({
		 'url': apiurl + 'sa_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,idx = result['idx']
				,uname = decodeURIComponent(result['uname'])
				,kasid = decodeURIComponent(result['kasid'])
				,contents = decodeURIComponent(result['contents'])
				,profile = result['profile']
				,photo = result['photo']
				,movie = result['movie']
				,heart = result['heart']
				,share = result['share']
				,reply = result['reply']
				,deleted = result['deleted']
				,regDate = result['regDate']
				,modifyDate = result['modifyDate']
				,deleteable = checkUniq('sa', idx)
			
			cuSa.idx = idx;
			cuSa.uname = uname;
			cuSa.kasid = kasid;
			cuSa.contents = contents;
			cuSa.profile = profile;
			cuSa.photo = photo;
			cuSa.movie = movie;
			cuSa.heart = heart;
			cuSa.share = share;
			cuSa.reply = reply;
			cuSa.deleted = deleted;
			cuSa.regDate = regDate;
			cuSa.modifyDate = modifyDate;

			//console.log(result)
			if (result['idx'] == undefined || result['idx'] == '') {
				window.location.href = 'http://gaeyou.com/s/';
				return false;
			}

			M('#profile').attr('src', '../images/imoticon/' + profile + '.png');
			M('#uname').html(uname);
			if (deleteable) {
				M('#ddate').html(M.dynamicDate(regDate) + ' <span class="del" data-del="' + idx + '"> | 삭제</span>');
			} else {
				M('#ddate').html(M.dynamicDate(regDate));
			}
			
			M('[data-sharenum]').html(share);
			M('#contents').html(contents);
			
			// 사진, 동영상 표시
			if (photo != '') {
				M('#imgCon').html('<img src="../upload/sa/' + photo + '">');
				M('[data-sharebox]').data('type', 'photo');
			} else if (movie != '') {
				var str = ''
				str += '<div class="imgCon">';
				str += '<iframe width="100%" height="315" src="http://www.youtube.com/embed/' + movie + '" frameborder="0" allowfullscreen></iframe>';
				str += '</div>';
				M('#imgCon').html(str)
				M('[data-sharebox]').data('type', 'movie');
			}
			
			// 하트, 댓글 갯수
			str = ''
			//str += '<span class="ico heart"></span>' + heart;
			str += '<span class="ico reply"></span>' + reply;
			M('#shareInfo').html(str);
			
			// 공유 이벤트
			$('[data-share]').on('click', function(evt, mp){
				var idx = $(this).data('share')
				$('[data-sharebox="' + idx + '"]').css('display', 'block');
				return false;
			})
			$('body').on('click', function(evt, mp){
				$('[data-sharebox]').css('display', 'none');
			})
			
			// 카스로 공유
			M('[data-kas]')
				.data('kas', idx)
				.on('click', function(evt, mp){
					var  idx = mp.data('kas')
						,post = ''
						,type = mp.parent().data('type')
					
					// 타임라인 모두 가져오기 전문통신
					bodyData = {
						'idx': idx
					}
					$.ajax({
						 'url': apiurl + 'sa_set_share.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
							
							M('[data-sharenum]').html(result['share']);
							
							post += '[웃낀동영상]\n'
							post += decodeURIComponent(cuSa['contents']) + '\n\n';
							post += 'http://gaeyou.com/s/view.html#' + cuSa['idx'];
							
							if (type == 'movie') {
								cont = 'http://i1.ytimg.com/vi/' + cuSa['movie'] + '/default.jpg';
							} else {
								cont = 'http://www.gaeyou.com/upload/sa/' + cuSa['photo'];
							}
							//console.log(cont)
							urlinfo = {
								'title': '웃낀 동영상',//'깨알움짤',
								'desc': decodeURIComponent(cuSa['contents']),
								'imageurl': [cont],
								'type': 'article'
							}
							kakao.link("story").send({   
						        appid : 'gaeyou',
								appver : '1.0',
								appname : 'youtube',//'★깨알유머★를 검색하세요!!',
						        post : post,
								urlinfo : M.json(urlinfo)
						    });
						}
					})
				})
			
			// 카톡으로 공유
			M('[data-katalk]')
				.data('katalk', idx)
				.on('click', function(evt, mp){
					var  idx = mp.data('katalk')
						,post = ''
						
					// 타임라인 모두 가져오기 전문통신
					bodyData = {
						'idx': idx
					}
					$.ajax({
						 'url': apiurl + 'sa_set_share.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
							
							M('[data-sharenum]').html(result['share']);
							
							kakao.link('talk').send({
								msg: decodeURIComponent(cuSa['contents']),
								url: 'http://gaeyou.com/s/view.html#' + cuSa['idx'],
								appid: 'gaeyou',
								appver: '1.0',
								appname: '깨알웃사',
								type: 'link'
							});
						}
					})
				})
				
			// 타임라인 삭제
			M('[data-del]').on('click', function(evt, mp){
				if(!confirm('랭킹을 정말 삭제하시겠습니까?')) {
					return false;
				}
				bodyData = {
					'idx': cuSa.idx
				}
				$.ajax({
					 'url': apiurl + 'sa_del.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						console.log(result)
						var result = M.json(result)
							sa = M.json(M.storage('sa'))
							popList = []
							
						for (var i=0; i<sa.length; i++) {
							if (result['id'] != sa[i]) {
								popList.push(sa[i])
							}
						}
						M.storage('sa', M.json(popList));
						window.location.href = 'http://gaeyou.com/s/';
					}
				})
			})
			
			getReplys()
		}
	})
	
	
	function getReplys() {
		// 댓글 가져오기
		bodyData = {
			'idx': hash
		}
		$.ajax({
			 'url': apiurl + 'sa_reply_get.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
					,str = ''
					
				//console.log(result)
				if (result.length == 0) {
					str += '<div class="rlist" data-noreply>처음으로 댓글을 써보세요.</div>';
				} else {
					for (var i=0; i<result.length; i++) {
						var  idx = result[i]['idx']
							,kasid = decodeURIComponent(result[i]['kasid'])
							,photo = result[i]['photo']
							,uname = decodeURIComponent(result[i]['uname'])
							,regDate = result[i]['regDate']
							,text = decodeURIComponent(result[i]['text'])
							,deleteable = checkUniq('replySaList', idx)
							
						str += '<div class="rlist">';
						str += '	<div class="imo"><img src="../images/imoticon/' + photo + '.png"></div>';
						str += '	<div class="author">';
						str += '		<span class="uname">' + uname + '</span>';
						str += '		<span class="ddate">' + M.dynamicDate(regDate) + '</span>';
						if (deleteable) {
							str += '		<span class="delete" data-deleteReply="' + idx + '"> | 삭제</span>';
						}
						if (kasid != '') {
							str += '		<span class="kas"><a href="../r/u.html#' + kasid + '">☞ ' + uname + '님 카스</a></span>';
						}
						str += '	</div>';
						str += '	<div class="replycon" style="">' + text + '</div>';
						str += '</div>';
					}
				}
				
				M('#replyCon').html(str);
				
				M('[data-noreply]').on('click', function(){
					M('#inpReply').focus()
				})
				
				// 삭제버튼
				M('[data-deleteReply]').on('click', function(evt, mp){
					if(!confirm('댓글을 삭제하겠습니까?')) {
						return false;
					}
					
					id = mp.data('deletereply');
					
					bodyData = {
						'idx': id,
						'saIdx': cuSa.idx
					}
					$.ajax({
						 'url': apiurl + 'sa_reply_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							//console.log(result)
							var result = M.json(result)
								replySaList = M.json(M.storage('replySaList'))
								popList = []
								
							for (var i=0; i<replySaList.length; i++) {
								if (result['id'] != replySaList[i]) {
									popList.push(replySaList[i])
								}
							}
							M.storage('replySaList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
		})
	}
	
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
		if (M('#inpReply').hasClass('msg')) {
			M('#inpReply').focus()
			return false;
		}
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
		
		
		//return false;
		imoidx = process(dataPhoto);
		imoticon = dataPhoto[imoidx];
		bodyData = {
			'idx': encodeURIComponent(cuSa['idx']),
			'uname': encodeURIComponent(M.storage('uname')),
			'kasid': encodeURIComponent(M.storage('kasid')),
			'photo': encodeURIComponent(imoticon),
			'text': encodeURIComponent(M('#inpReply').html())
		}
		$.ajax({
			 'url': apiurl + 'sa_reply_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				//console.log(result)
				var result = M.json(result);
				replyId = result['id'];
				
				if (typeof replySaList === 'string') {
					replySaList = M.json(replySaList);
				}
				replySaList.push(replyId);
				M.storage('replySaList', M.json(replySaList));
				window.location.reload();
			}
		})
	})
	

	// 다른 동영상 가져오기
	bodyData = {
		'idx': hash
	}
	$.ajax({
		 'url': apiurl + 'sa_get_more.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  data = M.json(result)
				,result = data['list']
				,str = ''
				
			for (var i=0; i<result.length; i++) {
				var  idx = result[i]['idx']
					,contents = decodeURIComponent(result[i]['contents'])
					,movie = result[i]['movie']
					
				str += '<li >';
				str += '	<a href="../s/view.html#' + idx + '">';
				str += '		<img src="http://i1.ytimg.com/vi/'+movie+'/default.jpg">';
				str += '		<div class="letter">' + contents + '</div>';
				str += '		</div>';	
				str += '	</a>';
				str += '</li>';	
			}
			
			M('#replyContainer').html(str);
		}
	})
}


// 유니크 저장소 체크하기
function checkUniq(key, value) {
	var storageKey = M.storage(key)
	if (!storageKey) {
		return false;
	}
	if (typeof storageKey === 'string') {
		storageKey = M.json(storageKey);
	}
	for (var i=0; i<storageKey.length; i++) {
		if ( storageKey[i] == value ) {
			return true;
		}
	}
	return false;
}

// 유니크 저장소 설정
function setUniq(key, value) {
	var  storageKey = M.storage(key) || []
		
	if (typeof storageKey === 'string') {
		storageKey = M.json(storageKey);
	}
	storageKey.push(value);
	M.storage(key, M.json(storageKey));
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










