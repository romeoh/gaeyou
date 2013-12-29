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
		str += '	<li data-page="worldcup"><a href="../w/">슈퍼랭킹</a></li>';
		//str += '	<li data-page="friend"><a href="../f/">친구만들기</a></li>';
		str += '	<li data-page="tab"><a href="../tab/">탭탭탭!!!<span class="new"></span></a></li>';
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
			.on('blur', function(){
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
	
	if (!checkUniq(key, hash)) {
		bodyData = {
			'idx': hash
		}
		//console.log(api)
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


// 게시물 등록완료
function addComplete(code, idx) {
	var key = code
	setUniq(key, idx);
}



// 댓글상자
function initReplyBox() {
	var str = ''
	
	if (M('[data-replybox]').selector.length > 0) {
		str += '<div class="kasid">';
		str += '	<input type="text" placeholder="이름을 입력하세요." data-uname>';
		str += '	<input type="text" placeholder="카스아이디를 입력하세요." data-kasid>';
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
		str += '		<dd><a href="/s"><span class="ico arrow"></span>웃긴 동영상<span class="ico good"></span></a></dd>';
		str += '		<dd><a href="/s2"><span class="ico arrow"></span>움직이는 짤방<span class="ico up"></span></a></dd>';
		
		str += '		<dt>슈퍼랭킹</dt>';
		str += '		<dd><a href="/w"><span class="ico arrow"></span>슈퍼랭킹</a></dd>';
		str += '		<dd><a href="/r"><span class="ico arrow"></span>깨알랭킹</a></dd>';
		
		str += '		<dt>탭탭탭!!!</dt>';
		str += '		<dd><a href="/tab"><span class="ico arrow"></span>탭탭탭!!!<span class="ico new"></span></a></dd>';
		str += '		<dd><a href="/tab/history.html"><span class="ico arrow"></span>역대전적</a></dd>';
		str += '		<dd><a href="/tab/bunker.html"><span class="ico arrow"></span>우리학교 벙커</a></dd>';
		
		str += '		<dt>친구만들기</dt>';
		str += '		<dd><a href="/f2"><span class="ico arrow"></span>카스 품앗이<span class="ico new"></span></a></dd>';
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




















