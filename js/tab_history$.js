var  code = 'tab'
	,school = []
	,setting
	,rankTotal = 50
	,rankStart = 0
	,cuGame

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	return false
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	setting = M.storage(code + '_setting');
	setting = M.json(setting)
	getGameRoundAll();
	
	// 카스로 보내기
	M('#btnKas').on('click', function(){
		var  post = ''
			,imgs = 'http://gaeyou.com/images/thum/tab2.png'
		
		post += '🏫 탭탭탭!!! 학교 대항전 전국 순위 \n';
		post += '───────────────────────\n'
		for (var i=0; i<school.length; i++) {
			var n = i+1
			post += n + '위: ' + school[i]['title'] + ' (' + M.toCurrency(school[i]['score']) + '탭)\n'
		}
		post += '───────────────────────\n'
		post += '🎃 탭탭탭!!! 참여하기:\n';
		post += 'http://gaeyou.com/tab/';
			
		urlinfo = {
			'title': '탭탭탭!! 전국 학교 대항전',
			'desc': '우리 학교를 선택하고 무조건 탭탭탭!!!\n전국 순위를 올리자',
			'imageurl': [imgs],
			'type': 'article'
		}
		
		kakao.link("story").send({   
			post : post,
			appid : 'gaeyou',
			appver : '1.0',
			appname : '',
			urlinfo : M.json(urlinfo)
		});
	})
	
	M('#btnCancel').on('click', function(){
		window.history.go(-1);
	})
	M('#btnMore').on('click', function(){
		getSchoolRank()
	})
	
	// 학교 카테고리 변경
	M('#category').on('change', function(evt, mp) {
		setting['category'] = mp.val()
		M.storage(code + '_setting', M.json(setting));
		rankStart = 0;
		M('#container').html('');
		M('#btnMore').css('display', 'block');
		getSchoolRank();
	})
}

function getGameRoundAll() {
	var databody = {
	}
	request(code+'_get_round_all', databody, function(result){
		var  result = M.json(result)
			,str = ''
		
		for (var i=0; i<result.length; i++) {
			var  games = result[i]['gameIdx']
				,round = result[i]['round']
			//console.log(result[i])
			if (i==0) {
				cuGame = games;
			}
			str += '<option value="' + games + '">제 ' + round + '경기 ' + games.substr(0,4) + '년 ' + games.substr(4) + '주차 </option>'
		}
		M('#round')
			.html(str)
			.on('change', function(evt, mp){
				cuGame = mp.val();
				rankStart = 0;
				M('#container').html('');
				M('#btnMore').css('display', 'block');
				getSchoolRank()
			});
		
		getSchoolRank();
	})
}

function getSchoolRank() {
	var databody = {
		'gameIdx': cuGame,
		'category': setting['category'],
		'total': rankTotal,
		'start': rankStart
	}
	request(code+'_get_score_all', databody, function(result){
		//console.log(result)
		var  result = M.json(result)
			,str = ''
		//console.log(result)
		for (var i=0; i<result.length; i++) {
			var  title = result[i]['title']
				,score = result[i]['score']
				,member = result[i]['member']
				,schoolIdx = result[i]['schoolIdx']
				,n = i+1 + Number(rankStart)
				
			school[i+rankStart] = result[i]
			
			str += '<li>';
			str += '	<div class="rank"><a href="./bunker.html#' + schoolIdx + '"><span>' + n + '위: </span>' + title + '</a></div>';
			str += '	<div class="rank_info">';
			str += '		<span>' + M.toCurrency(score) + '탭 | ' + M.toCurrency(member) + '명의 동창</span>';
			str += '	</div>';
			str += '</li>';
		}
		//M('#container').html( M('#container').html() + str);
		rankStart = rankTotal + rankStart;
		if (result.length < rankTotal) {
			M('#btnMore').css('display', 'none');
		}
		M('#category').val(setting['category']);
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




















