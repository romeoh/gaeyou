var  apiurl = 'http://gaeyou.com/api/'
	,hash
	,admin = M.storage('admin') == 'romeoh' ? admin = true : admin = false
	
	
window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	initNavi();
	initUserName();
	initReplyBox();
	initMenu();
}

function initNavi() {
	if (M('[data-navi]').selector.length > 0) {
		var  str = ''
			,page = M('[data-navi]').data('navi')
		
		str += '<ul class="nav">';
		str += '	<li data-page="test"><a href="../t/">깨알테스트</a></li>';
		str += '	<li data-page="sa"><a href="../s/">동영상</a></li>';
		str += '	<li data-page="rank"><a href="../r/">랭킹</a></li>';
		str += '	<li data-page="worldcup"><a href="../w/">월드컵</a></li>';
		//str += '	<li data-page="game"><a href="../game/list.html">웹게임 <i class="fa fa-star fa-yellow"></i></a></li>';
		//str += '	<li data-page="novel"><a href="../novel/list.html">썰픽</li>';
		//str += '	<li data-page="friend"><a href="../f/">친구만들기</a></li>';
		//str += '	<li data-page="tab"><a href="../tab/">탭탭탭!!!<span class="new"></span></a></li>';
		str += '</ul>';
		str += '<div></div>';
		M('[data-navi]').html(str);
		M('[data-page="' + page + '"]').addClass('on');
	}
}

// 이름과 카카오 아이디 설정
function initUserName() {
	if (M('[data-uname]').selector.length > 0) {
		var uname = M.storage('uname') || '';
		M('[data-uname]')
			.val(uname)
			.on('blur', function(evt, mp){
				M.storage('uname', M('[data-uname]').val())
			})
	}
	if (M('[data-kasid]').selector.length > 0) {
		var uname = M.storage('kasid') || '';
		M('[data-kasid]')
			.val(uname)
			.on('blur', function(){
				M.storage('kasid', M('[data-kasid]').val())
			})
	}
}

// hash 가져오기
function getHash() {
	var hash = window.location.hash.replace('#', '')
	if (hash == '') {
		return '';
	}
	return hash;
}

// 조회수 체크
function setView(code, hash, cb) {
	var	 key = code + 'ViewList'
		,api = apiurl + code + '_view.php'
		,view = M.storage(key)
		
	if (view == null) {
		view = [];
	}
	if (getDataType(view) == 'string') {
		view = M.json(view);
	}
	//if (!checkUniq(key, hash)) {
		bodyData = {
			'idx': hash,
			'code': code,
			'url': window.location.href,
			'ua': navigator.userAgent
		}
		//console.log(bodyData)
		$.ajax({
			 'url': api
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq(key, hash);
				cb(result);
			}
		})
	//}
}


// 게시물 등록완료
function addComplete(code, idx) {
	var key = code
	setUniq(key, idx);
}

// flag == 2 : 이름
function decodeText(txt, flag) {
	var  val = decodeURIComponent(txt)
		,filter = /쓰래기|쓰레기|스래기|스레기|찌레기|찌ㅡ레기|놈|시발놈|씨발놈|씨발|시발|시벌|시.발|시.벌|씨벌|시1발|시2발|씨1발|ㅅㅂ|ㅅ ㅂ|씨2발|지랄|빙시|병신|븅신|븅시|병 신|섹스|창녀|니미럴|자위중|병맛|새끼|새.끼|미친|ㅁㅊ|ㅂㅅ|야동|또라이|돌아이|욕|짜증|뒤저라|뒤져라|나가뒤져|나가 뒤져/g
		
	if (flag == '2') {
		return val
			.replace(/깨유|운영자|깨알유머|관리자|admin/g, val+'화이팅')
			.replace(filter, '♡')
			.replace(/romeoh/, '<i class="fa fa-plus-square"></i> 깨알유머')
	}
	return val
			.replace(filter, '♡')
			.replace(/존나|졸라|존니|존내/g, '매우')

}

// 댓글상자
function initReplyBox() {
	var str = ''
	
	if (M('[data-replybox]').selector.length > 0) {
		str += '<div class="kasid">';
		str += '	<input type="text" placeholder="이름을 입력하세요." maxlength="20" data-uname>';
		str += '	<input type="text" placeholder="카스아이디를 입력하세요." maxlength="20" data-kasid>';
		str += '</div>';
		str += '<div class="recon">';
		str += '	<div contenteditable="true" class="con msg" id="inpReply">이곳에 댓글을 써보세요~</div>';
		str += '<div class="btnbox"><a id="btnSubmit" class="btn_submit"><span>전송</span></a></div>';
		str += '</div>';
		
		M('[data-replybox]').html(str);
		
		// 댓글
		M('#inpReply')
			.on('focus', function(evt, mp){
				mp.focus();
				showReply();
			})
			.on('blur', function(evt, mp){
				hideReply();
			})
		
		M('[data-uname]')
			.on('focus', function(evt, mp){
				showReply();
			})
			.on('blur', function(evt, mp){
				M.storage('uname', mp.val())
				hideReply();
			})
			.val( M.storage('uname') || '' )
		
		M('[data-kasid]')
			.on('focus', function(evt, mp){
				showReply();
			})
			.on('blur', function(evt, mp){
				M.storage('kasid', mp.val())
				hideReply();
			})
			.val( M.storage('kasid') || '' )
		
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
			if (M('#inpReply').hasClass('msg')) {
				alert('내용을 입력해주세요.');
				M('#inpReply').focus();
				return false;
			}
			
			if (M('[data-uname]').val() == '') {
				alert('이름을 입력해주세요.');
				M('[data-uname]').css('display', 'block');
				M('[data-kasid]').css('display', 'block');
				M('[data-uname]').focus();
				return false;
			}
			M.storage('uname', M.storage('uname'));
			M.storage('kasid', M.storage('kasid'));
			
			imoidx = process(dataPhoto);
			imoticon = dataPhoto[imoidx]
			bodyData = {
				'idx': cuData['idx'],
				'uname': encodeURIComponent(M('[data-uname]').val()),
				'kasid': encodeURIComponent(M('[data-kasid]').val()),
				'photo': encodeURIComponent(imoticon),
				'text': encodeURIComponent(M('#inpReply').html()),
				'ua': navigator.userAgent
			}
			$.ajax({
				 'url': apiurl + code + '_reply_add.php'
				,'contentType': 'application/x-www-form-urlencoded'
				,'data': bodyData
				,'type': 'POST'
				,'success': function(result){
					var  result = M.json(result)
						,key = code + 'ReplyList'
					
					setUniq(key, result['id']);
					window.location.reload();
				}
			})
		})
	}
}

function showReply() {
	if (M('#inpReply').hasClass('msg')) {
		M('#inpReply')
			.removeClass('msg')
			.html('')
	}
	M('[data-uname]').css('display', 'block');
	M('[data-kasid]').css('display', 'block');
}
function hideReply() {
	M('[data-uname]').css('display', 'none');
	M('[data-kasid]').css('display', 'none');
}

function setReply(code, hash, cd) {
	var	 key = code + 'ViewList'
		,api = apiurl + code + '_view.php'
		,view = M.storage(key)
		
	if (view == null) {
		view = [];
	}
	if (getDataType(view) == 'string') {
		view = M.json(view);
	}
	
	if (!checkUniq(key, hash)) {
		bodyData = {
			'idx': hash
		}
		console.log(api)
		$.ajax({
			 'url': api
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq(key, hash);
				cb(result);
			}
		})
	}
}


// 전체 메뉴보기
function initMenu() {
	var  gnb = M('[data-gnb]')
		,speed = '0.5s'
	
	if (gnb.selector.length > 0) {
		gnb.on('click', function(){
			showGnb();
		})
	}
	
	function showGnb() {
		var  str = ''
			,uname = M.storage('uname')
		
		M('body')
			.prepend('div', {
				'className': 'bg',
				'id': 'bg'
			})
			.prepend('div', {
				'className': 'gnb',
				'id': 'gnb'
			})
		
		M('#bg').animate({
				'opacity': '0.7',
				'time': speed
			})
			.on('click', function(){
				hideGnb();
			})
		M('#gnb').animate({
			'left': '0',
			'time': speed
		})
		
		str += '<div class="head">';
		str += '	<div class="welcome" id="user">';
		str += '		안녕하세요.';
		str += '	</div>';
		str += '	<div class="close" id="btnClose"><span class="imh"></span></div>';
		str += '</div>';
		str += '<div class="menu">';
		str += '	<dl>';
		str += '		<dt>깨알테스트</dt>';
		str += '		<dd><a href="/t"><span class="ico arrow"></span>내가만든 테스트</a></dd>';
		str += '		<dd><a href="http://romeoh.github.io/kakaoStory/html/makeme.html"><span class="ico arrow"></span>깨알테스트</a></dd>';
		
		str += '		<dt>동영상</dt>';
		str += '		<dd><a href="/s"><span class="ico arrow"></span>웃긴 동영상</a></dd>';
		str += '		<dd><a href="/s2"><span class="ico arrow"></span>움직이는 짤방 <i class="fa fa-thumbs-up fa-red"></i></a></dd>';
		
		str += '		<dt>설치가 필요없는: 웹게임</dt>';
		str += '		<dd><a href="/game/list.html"><span class="ico arrow"></span>웹게임 <i class="fa fa-star fa-red"></i></a></dd>';
		
		str += '		<dt>함께쓰는 소설: 썰픽</dt>';
		str += '		<dd><a href="/novel/list.html"><span class="ico arrow"></span>썰픽</a></dd>';
		
		str += '		<dt>슈퍼랭킹</dt>';
		str += '		<dd><a href="/w"><span class="ico arrow"></span>슈퍼랭킹</a></dd>';
		str += '		<dd><a href="/r"><span class="ico arrow"></span>깨알랭킹</a></dd>';
		
		//str += '		<dt>탭탭탭!!!</dt>';
		//str += '		<dd><a href="/tab"><span class="ico arrow"></span>탭탭탭!!!<span class="ico new"></span></a></dd>';
		//str += '		<dd><a href="/tab/history.html"><span class="ico arrow"></span>역대전적</a></dd>';
		//str += '		<dd><a href="/tab/bunker.html"><span class="ico arrow"></span>우리학교 벙커</a></dd>';
		
		str += '		<dt>친구만들기</dt>';
		str += '		<dd><a href="/f2"><span class="ico arrow"></span>카스 품앗이</a></dd>';
		str += '		<dd><a href="/f"><span class="ico arrow"></span>카톡 친구만들기</a></dd>';
		
		str += '	</dl>';
		str += '</div>';
		
		M('#gnb').html(str);
		if (uname) {
			M('#user').html(uname + '님, 안녕하세요.')
		}
		M('#gnb').css('height', M('body').css('height'))
		M('#bg').css('height', M('body').css('height'))
		
		M('#btnClose').on('click', function(){
			hideGnb()
		})
	}
	
	function hideGnb() {
		M('#bg').animate({
			'opacity':'0',
			'time': speed
		}, function(evt, mp){
			mp.remove();
		})
		M('#gnb').animate({
			'left': '-250px',
			'time': speed
		}, function(evt, mp){
			mp.remove()
		}
		);
	}
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

function getSmile() {
	var idx = process(dataPhoto);
	return dataPhoto[idx]
}

M('#btnStory').on('click', function(){
	var data = {}
	data.media = 'story'
	validation(data)
});
M('#btnTwitter').on('click', function(){
	var data = {}
	data.media = 'twitter'
	validation(data)
});
M('#btnFacebook').on('click', function(){
	var data = {}
	data.media = 'facebook'
	validation(data)
});
M('#btnMe2day').on('click', function(){
	var data = {}
	data.media = 'me2day'
	validation(data)
});
M('#btnKakao').on('click', function(){
	var data = {}
	data.media = 'talk'
	action(data);
});

function validation(data) {
	action(data);
}

// 공유
function shareData(_obj, _opt) {
	var  obj = _obj || {}
		,media = obj.media || 'story'
		,id = obj.id || 'gaeyou'
		,ver = obj.ver || '1.0'
		,app = obj.app || '★깨알유머★를 검색하세요!!'
		,title = obj.title || ''
		,url = obj.url || ''
	
	if (media == 'talk') {
		var  msg = obj.msg || title || ''

		kakao.link('talk').send({
			msg: msg,
			url: url,
			appid: id,
			appver: ver,
			appname: app,
			type: 'link'
		});
		//return false;

		test  = '♥♥ [카톡친구 초대] ♥♥\n'
		test += 'appId: ' + id + '\n'
		test += 'appVersion: ' + ver + '\n'
		test += 'appName: ' + app + '\n'
		test += 'msg: \n'
		test += '-----------\n'
		test += msg + '\n'
		test += '-----------\n'
		test += 'url: ' + url + '\n'
		test += '--------------------------------------------\n'
		console.log(test)
		return false;
	}

	if (media == 'story') {
		var  post = obj.post || ''
			,desc = obj.desc || ''
			,img = obj.img || ''
			,urlinfo = {
				'title': title,
				'desc': desc,
				'imageurl': [img],
				'type': 'article'
			}
		//post = post + '\n\n' + url + '\n';//\n\n\n\n\n\n' + '★ 깨유 플친되고 선물받자 ★\nhttp://goo.gl/ElNRl3';
		if (_opt === '1') {
			// 옵션이 1이면 url없음
			post = post;
		} else {
			post = post + '\n\n' + url;
		}
		//post = post + '\n\n\n\n\n\n' + '★ 흔남 흔녀들의 필수플친! 깨유! ★\nhttp://goo.gl/ElNRl3';
		
		kakao.link("story").send({   
	        appid : id,
			appver : ver,
			appname : app,
	        post : post,
			urlinfo : M.json(urlinfo)
	    });
		//return false;
		
		test  = '♥♥ [카스로 공유] ♥♥\n'
		test += 'appId: ' + id + '\n'
		test += 'appVersion: ' + ver + '\n'
		test += 'appName: ' + app + '\n'
		test += 'post: \n'
		test += '-----------\n'
		test += post + '\n'
		test += '-----------\n'
		test += 'title: ' + title + '\n'
		test += 'desc: ' + desc + '\n'
		test += 'img: ' + img + '\n'
		test += '--------------------------------------------\n'
		console.log(test);
		
		return false;
	}

	if (media == 'twitter') {
		var  str = ''
			,post = obj.twit || obj.post || ''
			,urlLength = url.length + 5
			,postLength = post.length + urlLength + 1
			,textLimit = 140
		
		if (postLength >= textLimit) {
			twit = post.substr(0, (textLimit-urlLength)) + '...\n' + url;
		} else {
			twit = post + '\n' + url;
		}
		twit = twit.replace(/\n\n/g, '\n')

		str += 'https://twitter.com/intent/tweet?text=';
		str += encodeURIComponent(twit);
		top.location.href = str;
		//return false;

		test  = '♥♥ [트위터로 공유] ♥♥\n'
		test += 'twit: \n'
		test += '-----------\n'
		test += twit + '\n'
		test += '-----------\n'
		console.log(test)
		return false;
	}

	if (media == 'me2day') {
		var  str = ''
			,post =  obj.twit || obj.post || ''
			,tag = obj.tag || '미투데이를 더 재미있게 깨알유머 SNS 테스트 심리테스트'
			,urlLength = url.length + 5
			,postLength = post.length + urlLength + 1
			,textLimit = 150

		if (postLength >= textLimit) {
			me2 = post.substr(0, (textLimit-urlLength)) + '...\n' + url;
		} else {
			me2 = post + '\n' + url;
		}
		me2 = me2.replace(/\n\n/g, '\n')

		str += 'http://me2day.net/posts/new';
		str += '?new_post[body]=';
		str += encodeURIComponent(me2)
		str += '&new_post[tags]='
		str += encodeURIComponent(tag)
		top.location.href = str;
		//return false;

		test  = '♥♥ [미투데이로 공유] ♥♥\n'
		test += 'post: \n'
		test += '-----------\n'
		test += me2 + '\n'
		test += '-----------\n'
		console.log(test)
		return false;
	}

	// facebook sharer
	if (media == 'facebookSharer') {//
		var  str = ''
			,post = obj.post || ''
			,img = obj.img || ''
		
		str += 'http://www.facebook.com/sharer.php';
		str += '?s=100';
		str += '&p[title]=' + encodeURIComponent( post.replace(/\[.+\]/g, '') );
		str += '&p[summary]=' + encodeURIComponent( title );
		str += '&p[url]=' + encodeURIComponent(url);
		str += '&p[images][0]=' + encodeURIComponent(img);
		top.location.href = str;
		return false;
	}

	// facebook open API
	if (media == 'facebook') {//API
		M('body').prepend('script', {
			'src':'https://connect.facebook.net/en_US/all.js',
			'type': 'text/javascript',
			'id': 'facebookScript'
		})

		M('#facebookScript').on('load', function(evt, mp){
			var  obj = _obj || {}
				,mode = obj.mode || 'real'
				,feed = obj.feed || 'feed'
				,method = obj.method || 'post'
				,img = obj.img || ''
				,photo = obj.photo || obj.img || ''
				,post = obj.post || ''
				,scope = obj.scope || 'publish_actions, user_photos'
				,success = obj.success || null
				,error = obj.error || null
				,faceappid
				,message = {}

			post = post + '\n\n' + url;

			if (mode == 'real') {
				faceappid = '193169104219931';
			} else {
				faceappid = '199304076906232';
			}

			if (feed == 'feed') {
				message = {
					'message': post,
					'picture': photo
				}
			} else if (feed == 'photo') {
				message = {
					'message': post,
					'url': photo
				}
			}

			FB.init({
				'appId'     : faceappid, // App ID
				'channelUrl': '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
				'status'    : true, // check login status
				'cookie'    : true, // enable cookies to allow the server to access the session
				'xfbml'     : true  // parse XFBML
			})

			FB.login(function(response) {
				if (response.authResponse) {
					FB.api(/me/ + feed, method, message, function (response) {
						console.log(response);
						if (!response || response.error) {
							//if (error) {
							alert('죄송합니다.\n오류가 발생했습니다.');
								//error();
							//}
						} else {
							//if (success) {
							alert('페이스북에 등록 되었습니다.');
								//success();
							//}
						}
					});
				}
			}, {'scope': scope});

			//return false;
			test  = '♥♥ [페이스북으로 공유] ♥♥\n'
			test += 'feed: ' + feed + '\n'
			test += 'method: ' + method + '\n'
			test += 'photo: ' + photo + '\n'
			test += 'message: \n'
			test += '-----------\n'
			test += post + '\n'
			test += '-----------\n'
			console.log(test)

		})
		return false;
	}

	if (media == 'band') {
		var  src = ''
			,post = obj.post || ''
			,urlLength = url.length + 3
			,postLength = post.length + urlLength + 1
			,textLimit = 300

		bandPost += '[' + app + ']\n'
		bandPost += title + ': ' + post

		if (postLength >= textLimit) {
			b = bandPost.substr(0, (textLimit-urlLength)) + '...' + url;
		} else {
			b = bandPost + ' ' + url;
		}

		src += 'bandapp://create/post?text=';
		src += encodeURIComponent(bandPost);
		src += '#Intent;package=com.nhn.android.band;end;';
		top.location = str;
		return false;
	}
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



/*function shuffle(array) {
	for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}*/

function shuffle(array, length) {
	var counter = array.length,
		length = length || counter,
		temp,
		index

	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
		//console.log(arr)
	}
	array.length = length;
	return array;
}


function getSpecial() {
	var data = [
		'🐍',
		'🐎',
		'🐚',
		'🐛',
		'🐜',
		'🐝',
		'🐯',
		'🐮',
		'🐭',
		'🐬',
		'🐫',
		'🐟',
		'🐞',
		'🐺',
		'🐻',
		'🐼',
		'🐽',
		'🐾',
		'🐑',
		'🐒',
		'🐢',
		'🐡',
		'🐠',
		'🐙',
		'🐘',
		'🐗',
		'🐔',
		'🐣',
		'🐤',
		'🐥',
		'🐦',
		'🐧',
		'🐨',
		'🐩'
	],
	sc = process(data)
	return data[sc]
	
}




















