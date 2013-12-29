var  code = 'tab'
	,school
	,setting
	,gameIdx
	,hasTouch = 'ontouchstart' in window
	,evtStart = hasTouch ? evtStart = 'touchstart' : evtStart = 'mousedown'
	,evtEnd = hasTouch ? evtEnd = 'touchend' : evtEnd = 'mouseup'
	,count = 0
	,addValue = 1
	,isChance = false
	,chanceTimeCount = null
	,isAuto = false
	,autoId = null
	,noChance = false
	,s = Math.round(+new Date()/1000)
	,crown = ['♚','♛','♜','♝','♞']
	
window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	// storage 초기화
	initSchool();
	
	// 경기정보 초기화
	initGame();
	
	// 탭탭탭 버튼 이벤트
	M('#tab_act')
		.on(evtStart, onPress)
		.on(evtEnd, onRelease)
	
	M('#btnAuto').on('click', function(evt, mp){
		if (isAuto) {
			endAuto();
			return false;
		}
		if (mp.hasClass('blue')) {
			isAuto = true;
			autoId = setInterval(onAuto, 180);
		} else {
			alert('15탭 이상부터 자동탭이 가능합니다.')
		}
	});
	
	M('#btnSubmit').on('click', function(evt, mp){
		M('#btnSubmit').off('click');
		var t = Math.round(+new Date()/1000)	// t: 현재 timestamp	// s: 페이지 로딩시 timestamp	// key: 페이지 머문 시간
			key = t - s;
		
		if (!mp.hasClass('red')) {
			alert('20탭 이상 전송가능합니다.')
			return false;
		}
		sendScore()
		/*var databody = {
			'score': count,
			'schoolIdx': school['idx'],
			'gameIdx': gameIdx,
			't': t,
			's': s,
			'key': key,
			'agent': navigator.userAgent
		}
		
		request(code+'_set_score', databody, function(result) {
			if (!setting['mytab'][gameIdx]) {
				setting['mytab'][gameIdx] = count
			} else {
				setting['mytab'][gameIdx] = setting['mytab'][gameIdx] + count
			}
			M.storage(code + '_setting', M.json(setting));
			alert(school['title'] + '에 ' + M.toCurrency(count) + '탭이 추가되었습니다.');
			window.location.href = './';
		})*/
	
	});
	
	// 새로고침
	M('#reloadMyschool').on('click', function(evt, mp) {
		mp.animate({
			'rotate': '180deg'
		}, function(){
			mp.animate({
				'rotate': '0deg'
			})
		})
		getMySchool()
	});
	M('#boardReload').on('click', function(evt, mp) {
		mp.animate({
			'rotate': '180deg'
		}, function(){
			mp.animate({
				'rotate': '0deg'
			})
		})
		getSchoolScore();
	});
	
	// 역대 전적보기
	M('#btnHistory').on('click', function() {
		window.location.href = './history.html'
	})
	
	// 학교 카테고리 변경
	M('#category').on('change', function(evt, mp) {
		setting['category'] = mp.val()
		M.storage(code + '_setting', M.json(setting));
		getSchoolScore();
	})
	
	// 친구들 소환하기
	M('#btnCall').on('click', function(){
		var  imgs = 'http://gaeyou.com/images/thum/tab2.png'
			,post = ''
		
		post += '🏫 탭탭탭!!! 전국 학교 대항전 \n';
		post += '────────────────────\n'
		post += '"' + school['title'] + '"는 \n';
		post += '현재 ' + M.toCurrency(school['score']) + '탭으로 ' + M.toCurrency(school['categoryRank']) + '위 (전국순위: ' + M.toCurrency(school['allRank']) + '위)입니다.\n';
		post += '"' + school['title'] + '" 팸들은 모두 힘을 합쳐 탭탭탭!!\n';
		post += '전국 순위를 올려봐요!!!\n\n';
		post += '────────────────────\n'
		post += '🎃 탭탭탭!!! 참여하기:\n';
		post += 'http://gaeyou.com/tab/';
			
		urlinfo = {
			'title': '탭탭탭!! 전국 학교 대항전',
			'desc': school['title'] + '는 현재 전국 ' + school['rank'] + '위 입니다.',
			'imageurl': [imgs],
			'type': 'article'
		}
		
		kakao.link("story").send({   
			post : post,
			appid : 'gaeyou',
			appver : '1.0',
			appname : school['title'] + '팸은 다 모여라!!',
			urlinfo : M.json(urlinfo)
		});
	})
}

// school 초기화
function initSchool() {
	school = M.storage(code + '_school');
	if (school == null) {
		// 저장된 학교가 없음
		school = {
			'idx': '',
			'title': '',
			'school': '',
			'flag': '-1',
			'address': ''
		}
		school = M.json(school);
		M.storage(code + '_school', school);
	}
	school = M.json(school);
	
	setting = M.storage(code + '_setting');
	if (setting == null) {
		// 저장된 학교가 없음
		setting = {
			'category': '0',
			'mytab': {},
			'reply': []
		}
		setting = M.json(setting);
		M.storage(code + '_setting', setting);
	}
	setting = M.json(setting);
}


// 경기정보 초기화
function initGame() {
	var databody = {
	}
	request(code+'_get_game', databody, function(result){
		var result = M.json(result);
		gameIdx = result['gameIdx'];
		M('#rankTitle').html('제 '+result['round'] + '경기 (' + gameIdx.substr(0,4) + '년 ' + gameIdx.substr(4) + '주차)')
		getSchoolScore();
	})
}

function getSchoolScore() {
	var databody = {
		'gameIdx': gameIdx,
		'category': setting['category'],
		'total': '20',
		'start': 0
	}
	request(code+'_get_score_all', databody, function(result){
		var  result = M.json(result)
			,str = ''
		//console.log(result)
		// 점수가 없을경우
		if (result.length == 0) {
			M('#schoolBoard').html('아직 점수가 없습니다.');
			M('#boardReload').css('display', 'none');
			M('#boardReload').css('display', 'none');
			M('#btnMoreBoard').css('display', 'none');
			return false;
		}
		
		for (var i=0; i<result.length; i++) {
			var  n = i + 1
				,c = ''
				,cls = ''
			
			if (i < 5) {
				c = crown[i] + ' '
				cls = 'crown'
			}
			str += '<a href="./bunker.html#' + result[i]['schoolIdx'] + '">';
			str += '	<dt class="' + cls + '">' + c + n + '위</dt>';
			str += '	<dd class="' + cls + '">' + result[i]['title'] +  ' (' + M.toCurrency(result[i]['score']) + '탭)</dd>';
			str += '</a>';
		}
		
		// 학교 점수 출력
		M('#schoolBoard').html(str)
		
		// 우리학교 탭 점수 가져오기
		if (school['idx'] != '') {
			getMySchool();
		}
		M('#category').val(setting['category']);
	})
}

// 우리학교 탭 가져오기
function getMySchool() {
	var databody = {
		'schoolIdx': school['idx'],
		'category': school['flag'],
		'gameIdx': gameIdx
	}
	request(code+'_get_myschool', databody, function(result){
		var result = M.json(result)
		//console.log(result)
		M('#mySchool').css('display', 'block');
		M('#mySchoolR').html('❉ ' + result['title'] + ' 순위 ❉');
		M('#mySchoolTitle').html('<span class="schoolName">' + result['title'] + '</span> (총 ' + result['member'] + '명)');
		M('#btnBunker').attr('href', './bunker.html#'+result['idx']);
		//console.log(result)
		if (result['score'] == '') {
			M('#mySchoolRank').html('현재순위: -위')
			M('#mySchoolTab').html('0탭')
		} else {
			M('#mySchoolRank').html('현재순위: <span>' + result['categoryRank'] + '위</span>')
			M('#mySchoolRankAll').html('(전체순위: <span>' + result['allRank'] + '위</span>)')
			M('#mySchoolTab').html('전체누적: '+M.toCurrency(result['score']) + '탭');
			school['allRank'] = result['allRank'];
			school['categoryRank'] = result['categoryRank'];
			school['score'] = result['score'];
		}
	})
}

function onPress(evt, mp) {
	evt.preventDefault();
	
	if (school['idx'] == '') {
		alert('나의 학교를 등록하세요.');
		window.location.href = 'search.html';
		return false;
	}
	endAuto();
	M('#btnTab').addClass('active')
}

var  limitScore = 100
	,submited
	
function onRelease(evt, mp) {
	var newCount
	submited = parseInt(M('#count').data('submit'), 10)
		
	M('#btnTab').removeClass('active');
	
	count = count + addValue;
	newCount = count - submited;
	
	// 찬스 이벤트
	if (!isChance) {
		getChance();
	}
	
	// 자동탭
	if (count > 14 && !isAuto) {
		autoTab();
	}
	
	// 점수 전송
	if (count > 19) {
		submitScore();
	}
	
	M('#count')
		.html(M.toCurrency(count))
		.data('count', newCount)
	
	if (M('#count').data('count') >= limitScore) {
		sendScore(limitScore)
	}
}


function sendScore(score) {
	var  databody = {}
		,t = Math.round(+new Date()/1000)	// t: 현재 timestamp	// s: 페이지 로딩시 timestamp	// key: 페이지 머문 시간
		,key = t - s
		,sumScore = score || M('#count').data('count')
			
	databody['score'] = sumScore
	databody['schoolIdx'] = school['idx'];
	databody['gameIdx'] = gameIdx;
	databody['t'] = t;
	databody['s'] = s;
	databody['key'] = key;
	databody['agent'] = navigator.userAgent;
	databody['url'] = window.location.href;
	console.log(databody)
	
	request(code+'_set_score$', databody, function(result) {
		if (!setting['mytab'][gameIdx]) {
			setting['mytab'][gameIdx] = sumScore
		} else {
			setting['mytab'][gameIdx] = parseInt(setting['mytab'][gameIdx], 10) + parseInt(sumScore, 10)
		}
		M.storage(code + '_setting', M.json(setting));
		
		if (score) {
			M('#count').data('submit', parseInt(submited, 10) + parseInt(score, 10));
		} else {
			alert(school['title'] + '에 ' + M('#count').html() + '탭이 추가되었습니다.');
			window.location.href = './';
		}
	})
}

// 찬스 이벤트
function getChance() {
	var  idx = process(0, 30)
	if (idx == 0 && !noChance) {
		isChance = true;
		addValue = process(2, 10);
		delayTime = process(3, 15)
		chanceTime = endChance(delayTime);
		M('#btnTab')
			.html('찬스!!! <span>(X' + addValue + ')</span><p>' + delayTime + '초 남음</p>')
			.addClass('chance')
			
		//console.log('찬스', 'x'+addValue, delayTime);
		chanceTimeCount = setInterval(function(){
			timeLeft = delayTime--;
			M('#btnTab')
				.html('찬스!!! <span>(X' + addValue + ')</span><p>' + (timeLeft-1) + '초 남음</p>')
		}, 1000);
	}
}

// 찬스 끝
function endChance(delay) {
	setTimeout(function(){
		addValue = 1;
		isChance = false;
		clearInterval(chanceTimeCount);
		M('#btnTab')
			.html('탭탭탭!!!')
			.removeClass('chance')
		noChance = true;
		setTimeout(function(){
			noChance = false;
		}, 5000)
	}, delay * 1000);
}

// 자동탭
function autoTab() {
	M('#btnAuto').addClass('blue');
}

function onAuto() {
	M('#btnTab').addClass('active');
	setTimeout(onRelease, 60);
}

function endAuto() {
	if (isAuto) {
		isAuto = false;
		clearInterval(autoId);
		return false;
	}
}

// 점수 전송
function submitScore() {
	M('#btnSubmit').addClass('red');
}


function getSchoolLevel(level) {
	if (level == 0) {
		return '초등학교';
	}
	if (level == 1) {
		return '중학교';
	}
	if (level == 2) {
		return '고등학교';
	}
	if (level == 3) {
		return '대학교';
	}
}

function request(tr, data, callback) {
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




















