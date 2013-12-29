var  hash
	,code = 'tab'
	,school
	,gameIdx
	,cuData = {}
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 15
	
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
	
	school = M.json(M.storage(code + '_school'));
	hash = getHash() || school['idx'];
	
	initGame();
	
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
			'desc': school['title'] + '는 현재 전국 ' + school['categoryRank'] + '위 입니다.',
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
	
	M('#btnTab').on('click', function(){
		window.location.href = './'
	})
}


// 경기정보 초기화
function initGame() {
	var databody = {
	}
	request(code+'_get_game', databody, function(result){
		var result = M.json(result);
		gameIdx = result['gameIdx'];
		cuData['idx'] = hash;
		M('#rankTitle').html('제 '+result['round'] + '경기 (' + gameIdx.substr(0,4) + '년 ' + gameIdx.substr(4) + '주차)')
		getMySchool();
	})
}


// 우리학교 탭 가져오기
function getMySchool() {
	var databody = {
		'schoolIdx': hash,
		'gameIdx': gameIdx
	}
	
	request(code+'_get_myschool', databody, function(result){
		//console.log(result)
		var result = M.json(result)
		M('#mySchool').css('display', 'block');
		M('#mySchoolR').html('❉ ' + result['title'] + ' 순위 ❉');
		M('#mySchoolTitle').html('<span class="schoolName">' + result['title'] + '</span> (총 ' + result['member'] + '명의 친구)');
		M('#schoolName').html(result['title'])
		
		if (result['score'] == '') {
			M('#mySchoolRank').html('현재순위: -위')
			M('#mySchoolTab').html('0탭');
		} else {
			M('#mySchoolRank').html('현재순위: <span>' + result['categoryRank'] + '위</span>')
			M('#mySchoolRankAll').html('(전체순위: <span>' + result['allRank'] + '위</span>)')
			M('#mySchoolTab').html('전체누적: '+M.toCurrency(result['score']) + '탭');
			school['allRank'] = result['allRank'];
			school['categoryRank'] = result['categoryRank'];
			school['score'] = result['score'];
		}
		getReply();
	})
}

function getReply() {
	var databody = {
		'idx': hash,
		'category': school['flag'],
		'gameIdx': gameIdx,
		'total': replyTotal,
		'start': replyStart
	}
	request(code+'_reply_get', databody, function(result){
		var  result = M.json(result)
			,str = ''
		replyStart = replyTotal + replyStart;
		
		if (result.length == 0) {
			str += '<div class="rlist" data-noreply style="text-align:center; padding:20px">학교 친구들에게 글을 써보세요.</div>';
		} else {
			if (result.length < replyTotal) {
				//str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-replymore>댓글 더 불러오기</li>';
			}
			
			for (var i=0; i<result.length; i++) {
				var  idx = result[i]['idx']
					,photo = result[i]['photo']
					,regDate = result[i]['regDate']
					,schoolIdx = result[i]['schoolIdx']
					,text = decodeURIComponent(result[i]['text'])
					,uname = decodeURIComponent(result[i]['uname'])
					,kasid = decodeURIComponent(result[i]['kasid'])
					,deleteable = checkUniq(code + 'ReplyList', idx)
					
				str += '<li data-reply="' + idx + '">';
				str += '	<div class="profile">';
				str += '		<div class="photo">';
				str += '			<img src="../images/imoticon/' + photo + '.png" alt="">';
				str += '		</div>';
				str += '		<div class="user">';
				str += '			<span class="uname">' + uname + '</span>';
				str += '			<span class="date">' + M.dynamicDate(regDate) + '</span>';
				if (deleteable) {
					str += '			<span class="date" data-deleteReply="' + idx + '">삭제</span>';
				}
				str += '		</div>';
				str += '	</div>';
				str += '	<div class="desc">' + text + '</div>';
				if (kasid != '') {
					str += '	<div class="kas">';
					str += '		<a href="../r/u.html#' + kasid + '">☞ ' + uname + '님카스</a>';
					str += '	</div>';
				}
				str += '</li>';
			}
		}
		M('#replyList').html( M('#replyList').html() + str);
		
		// 댓글 더보기
		M('[data-replymore]').on('click', function(evt, mp){
			mp.remove()
			getReply();
		})
		
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
				'saIdx': cuData.idx
			}
			$.ajax({
				 'url': apiurl + code + '_reply_del.php'
				,'contentType': 'application/x-www-form-urlencoded'
				,'data': bodyData
				,'type': 'POST'
				,'success': function(result){
					var  result = M.json(result)
						,key = code + 'ReplyList'
						,replyList = M.json(M.storage(key))
						,popList = []
						
					for (var i=0; i<replyList.length; i++) {
						if (result['id'] != replyList[i]) {
							popList.push(replyList[i])
						}
					}
					M.storage(key, M.json(popList));
					window.location.reload();
				}
			})
		})
		
	})
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
			eval(callback)(result);
		}
	})
}




















