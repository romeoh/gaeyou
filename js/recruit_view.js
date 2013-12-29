window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	bodyData = {
		
	}
	$.ajax({
		 'url': '/api/recruit_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,str = '총 '+result.length+' 명 지원'
			
			console.log(result)
			for (var i in result) {
				for (var key in result[i]) {
					str += '<dd class="inp_list">' + key + ': ' + decodeURIComponent( result[i][key] ) + '</dd>';
				}
				str += '==========';
			}
			
			//console.log(result)
			M('#lists').html(str)
		}
	})
	
	
	
	M('#payType').on('change', function(evt, mp){
		t = mp.val();
		M('#pay').val(t + ': ');
	})
	
	M('#soge').on('focus', function(evt, mp){
		if (mp.hasClass('place')) {
			mp.removeClass('place');
			mp.html('');
		}
	})
	M('#plane').on('focus', function(evt, mp){
		if (mp.hasClass('place')) {
			mp.removeClass('place');
			mp.html('');
		}
	})			
			
	// 유효성 검사
	M('#btnReg').on('click', function(evt, mp){
		var  uname = M('#uname').val()
			,sex = M('#sex').val()
			,age = M('#age').val()
			,area = M('#area').val()
			,tel = M('#tel').val()
			,email = M('#email').val()
			,katalk = M('#katalk').val()
			,kas = M('#kas').val()
			,job = M('#job').val()
			,worktime = M('#worktime').val()
			,payType = M('#payType').val()
			,pay = M('#pay').val()
			,soge = M('#soge').html()
			,plane = M('#plane').html()
			
		if (uname == '') {
			alert('이름을 입력하세요.')
			return false;
		}
		if (sex == '-1') {
			alert('성별을 선택하세요.')
			return false;
		}
		if (age == '-1') {
			alert('나이를 선택하세요.')
			return false;
		}
		if (uname == '') {
			alert('이름을 입력하세요.')
			return false;
		}
		if (area == '') {
			alert('거주지를 입력하세요.')
			return false;
		}
		if (tel == '') {
			alert('핸드폰번호를 입력하세요.')
			return false;
		}
		if (email == '') {
			alert('이메일을 입력하세요.')
			return false;
		}
		if (katalk == '') {
			alert('카톡아이디를 입력하세요.')
			return false;
		}
		if (kas == '') {
			alert('카스아이디를 입력하세요.')
			return false;
		}
		if (job == '') {
			alert('직업을 입력하세요.')
			return false;
		}
		if (worktime == '') {
			alert('운영 가능시간을 입력하세요.')
			return false;
		}
		if (payType == '-1') {
			alert('수당지급 형태를 선택하세요.')
			return false;
		}
		if (pay == '' || pay == '월급: ' || pay == '주급: ') {
			alert('원하는 수당을 입력하세요.')
			return false;
		}
		if (soge == '' || M('#soge').hasClass('place')) {
			alert('간단한 자기 소개를 입력하세요.')
			return false;
		}
		if (plane == '' || M('#plane').hasClass('place')) {
			alert('어떻게 운영할건지 계획을 알려주세요.')
			return false;
		}
		
		bodyData = {
			'uname': encodeURIComponent(uname),
			'sex': encodeURIComponent(sex),
			'age': encodeURIComponent(age),
			'area': encodeURIComponent(area),
			'tel': encodeURIComponent(tel),
			'email': encodeURIComponent(email),
			'katalk': encodeURIComponent(katalk),
			'kas': encodeURIComponent(kas),
			'job': encodeURIComponent(job),
			'worktime': encodeURIComponent(worktime),
			'pay': encodeURIComponent('(' + payType + ') ' + pay),
			'soge': encodeURIComponent(soge),
			'plane': encodeURIComponent(plane)
		}
		$.ajax({
			 'url': '/api/recruit_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				console.log(result)
				return;
				window.location.href = 'http://gaeyou.com/r/#' + addid;
			}
		})
	})
	
	M('#btnCancel').on('click', function(){
		
M('#uname').val('백민기')
M('#sex').val('남자')
M('#age').val('17')
M('#area').val('서울시 도봉구 창동')
M('#tel').val('010-6852-7811')
M('#email').val('romeoh78@gmail.com')
M('#katalk').val('romeohcom')
M('#kas').val('romeohcom')
M('#job').val('학생')
M('#worktime').val('오후시간')
M('#payType').val('주급')
M('#pay').val('주급: 1000원')
M('#soge').html('안녕하세요. 백민기입니다.')
M('#plane').html('열심히 하겠습니다.')
		//window.history.go(-1)
	})
	
return
	// 새로 등록
	var  cuNewList = 2	// 디폴트 보기 갯수
		,rankAddList = M.storage('rankAddList') || []
		,sampleIdx = process(sampleData)
		,apiurl = 'http://gaeyou.com/api/'

	M('#btnAdd').on('click', function(evt, mp){
		if (cuNewList === 9) {
			alert('더 이상 입력할수 없습니다.')
			return false;
		}
		cuNewList++
		var str = ''
			n = cuNewList + 1
	
		M('#pcontent').append('div', {
			 'className': 'plist'
			,'data-b': cuNewList
		})
		str += '<div class="inner_item">';
		str += '	<span class="txt_g"><input type="text" placeholder="' + n + '번 보기를 입력하세요." data-list="' + cuNewList + '" maxlength="30"></span>';
		str += '</div>';
		M('[data-b="' + cuNewList + '"]').html(str)
	})
	
	M('#btnDel').on('click', function(evt, mp){
		if (cuNewList === 1) {
			alert('최소 2개이상 입력해야 합니다.')
			return false;
		}
		M('[data-b="' + cuNewList + '"]').remove();
		cuNewList--;
	})
	
	// 질문 포커스시 삭제
	M('#qst')
		.on('focus', function(evt, mp){
			if (mp.hasClass('place')) {
				mp
					.html('')
					.removeClass('place')
			}
		})
		// 질문 100자 제한
		.on('keyup', function(evt, mp){
			var txt = mp.html()
			if (txt.length >= 100) {
				alert('100자 이상 입력할수 없습니다.');
				mp.html( txt.substr(0, 99) );
			}
		})
		.html(sampleData[sampleIdx]['question'])
	
	M('#title')
		.on('focus', function(evt, mp){
			if (M('#qst').hasClass('place')) {
				M('#qst')
					.html('')
					.removeClass('place')
			}
		})
		.attr('placeholder', sampleData[sampleIdx]['title'])
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,sendPollData
			,title = M('#title').val()
			,question = M('#qst').html()
			,uname = M('#uname').val()
			,kasid = M('#kasid').val()
			,lists = []
			
		if (title === '') {
			alert('제목을 입력해주세요.');
			M('#title').focus()
			return false;
		}
		if (question === '(필수) 이곳에 질문을 입력하세요.') {
			alert('상세 질문을 입력해주세요.');
			M('#qst').html('')
			M('#qst').focus()
			return false;
		}
		if (question === '') {
			alert('상세 질문을 입력해주세요.');
			M('#qst').focus()
			return false;
		}
		if (uname === '') {
			alert('닉네임을 입력해주세요.');
			M('#uname').focus()
			return false;
		}
		/*if (kasid === '') {
			alert('카스아이디를 입력해주세요.');
			return false;
		}*/
		for (var i=0; i<cuNewList+1; i++) {
			if (M('[data-list="' + i + '"]').val() === '') {
				n = i+1
				alert(n + '번째 리스트를 입력해주세요.');
				return false;
			} else {
				lists.push( encodeURIComponent(M('[data-list="' + i + '"]').val()) )
			}
		}
		M.storage('uname', uname);
		M.storage('kasid', kasid);
		
		bodyData = {
			'title': encodeURIComponent(title),
			'question': encodeURIComponent(question),
			'uname': encodeURIComponent(uname),
			'kasid': encodeURIComponent(kasid),
			//'photo': 'photo.png',
			'lists': lists
		}
		$.ajax({
			 'url': apiurl + 'rank_question_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var result = M.json(result);
				addid = result['result'];
				if (typeof rankAddList === 'string') {
					rankAddList = M.json(rankAddList);
				}
				rankAddList.push(addid)
				M.storage('rankAddList', M.json(rankAddList));
				
				if (confirm('랭킹을 등록했습니다. 친구들에게 알릴까요?')) {
					var post = ''
					
					post += '[' + title + ']\n';
					post += question + '\n\n';
					for (var i=0; i<lists.length; i++) {
						n = i + 1
						post += n + '. ' + decodeURIComponent(lists[i]) + '\n';
					}
					post += '\n♚ ' + decodeURIComponent(uname) + '님이 랭킹을 등록했어요~\n';
					post += '랭킹에 참여해보세요.\n\n';
					post += '♞ 투표하러 가기\n';
					post += 'http://gaeyou.com/r/#'+result['result'];
					console.log(post)
					urlinfo = {
						'title': title,
						'desc': question,
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
				window.location.href = 'http://gaeyou.com/r/#' + addid;
			}
		})
	})
	
	M('#btnCancel').on('click', function(){
		window.history.go(-1)
	})	
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

sampleData = [
	{'title':'(예) 제일 좋아하는 군것질은?', 'question':'(예) 제일 좋아하는 야식 군것질은 뭔가요?'},
	{'title':'(예) 제일 싫어하는 과목은?', 'question':'(예) 제일 싫어하는 과목은 뭐에요?'},
	{'title':'(예) 제일 가보고 싶은 나라는?', 'question':'(예) 제일 가보고 싶은 나라는 어디에요?'},
	{'title':'(예) 인피니트에서 제일 좋아하는 멤버는?', 'question':'(예) 인피니트멤버중에 제일 잘 생긴 멤버는 누구에요?'},
	{'title':'(예) B1A4에서 제일 좋아하는 멤버는?', 'question':'(예) B1A4 멤버중에 제일 귀여운 멤버는 누구에요?'},
	{'title':'(예) 소녀시대에서 제일 좋아하는 멤버는?', 'question':'(예) 소녀시대 멤버중에 제일 예쁜 멤버는 누구에요?'},
	{'title':'(예) 첫 눈오면 해보고 싶은것?', 'question':'(예) 올해 첫눈에 오면 꼭 해보고 싶은건 뭐에요?'},
	{'title':'(예) 애인이랑 가보고 싶은 곳은?', 'question':'(예) 애인이 생기면 제일 처음으로 가보고 싶은곳은 어디에요?'},
	{'title':'(예) 하복이 좋아, 동복이 좋아?', 'question':'(예) 하복이 좋아요? 동복이 좋앙요?'},
	{'title':'(예) 제일 좋아하는 모바일 게임은?', 'question':'(예) 요즘 제일 재미있는 모바일 게임은?'},
	{'title':'(예) 제일 좋아하는 롤챔피언은?', 'question':'(예) 최강 롤챔피언은 뭔가요?'},
	{'title':'(예) 적당한 하루 게임시간?', 'question':'(예) 하루에 몇시간 게임하는게 적당하다고 생각해요?'},
	{'title':'(예) 요즘 대세 아이돌은?', 'question':'(예) 요즘 대세 아이돌은 누구라고 생각하세요?'},
	{'title':'(예) 명동?, 홍대?', 'question':'(예) 명동이 좋아요? 홍대가 좋아요?'},
	{'title':'(예) 당신의 종교는?', 'question':'(예) 당신의 종교는 뭔가요?'},
	{'title':'(예) 나의 첫인상은?', 'question':'(예) 다른 사람들이 생각했을때 나의 첫인상은 뭔가요?'},
	{'title':'(예) 제일 짜증나는 스타일', 'question':'(예) 제일 짜증나는 스타일의 사람은 누구인가요?'}
	
]




