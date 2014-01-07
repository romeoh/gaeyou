var  code = 'novel'
	,charLength = 2
	,novelLimite = 0

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	checkCount();
	viewChar();
	
	M('#btnAdd').on('click', function(){
		if (charLength > 4) {
			alert('기본 등장인물을 추가할 수 없습니다.');
			return false;
		}
		charLength++;
		viewChar();
	})
	M('#btnDel').on('click', function(){
		if (charLength == 1) {
			alert('등장인물은 최소 1명 이상이어야 합니다.');
			return false;
		}
		charLength--;
		viewChar();
	})
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,title = M('#title').val()
			,author = M('#author').val()
			,genre = M('#genre').val()
			,mode = M('#mode').val()
			,kasid = M('#kasid').val()
			,startFic = M('#startFic').val()
			,charactor = []
		
		checkCount();
		if (title === '') {
			alert('제목을 입력해주세요.');
			M('#title').focus()
			return false;
		}
		if (author === '') {
			alert('개설자명을 입력해주세요.');
			M('#author').focus()
			return false;
		}
		if (mode == '-1') {
			alert('모드를 선택해주세요.');
			M('#mode').focus()
			return false;
		}
		if (genre == '-1') {
			alert('썰픽의 장르를 선택해주세요.');
			M('#genre').focus()
			return false;
		}
		/*if (kasid === '') {
			alert('카스아이디를 입력해주세요.');
			return false;
		}*/
		for (var i=1; i<charLength+1; i++) {
			var chara = {}
			if (M('[data-name="'+i+'"]').val() == '') {
				alert('등장인물'+i+'의 이름을 입력해주세요.');
				M('[data-name="'+i+'"]').focus()
				return false;
			}
			/*
			if (M('[data-sex="'+i+'"]').val() == '') {
				alert('등장인물'+i+'의 성별을 입력해주세요.');
				M('[data-sex="'+i+'"]').focus()
				return false;
			}
			if (M('[data-age="'+i+'"]').val() == '') {
				alert('등장인물'+i+'의 나이을 입력해주세요.');
				M('[data-age="'+i+'"]').focus()
				return false;
			}
			if (M('[data-job="'+i+'"]').val() == '') {
				alert('등장인물'+i+'의 직업을 입력해주세요.');
				M('[data-job="'+i+'"]').focus()
				return false;
			}
			if (M('[data-point="'+i+'"]').val() == '') {
				alert('등장인물'+i+'의 특징을 입력해주세요.');
				M('[data-point="'+i+'"]').focus();
				return false;
			}
			*/
			chara['name'] = encodeURIComponent( M('[data-name="'+i+'"]').val() );
			chara['sex'] = encodeURIComponent( M('[data-sex="'+i+'"]').val() );
			chara['age'] = encodeURIComponent( M('[data-age="'+i+'"]').val() );
			chara['job'] = encodeURIComponent( M('[data-job="'+i+'"]').val() );
			chara['point'] = encodeURIComponent( M('[data-point="'+i+'"]').val() );
			charactor.push(chara);
		}
		if (startFic === '') {
			alert('도입부를 적어주세요.');
			M('#startFic').focus()
			return false;
		}
		
		M('#btnReg').off('click');
		bodyData = {
			'title': encodeURIComponent(title),
			'author': encodeURIComponent(author),
			'kasid': encodeURIComponent(kasid),
			'mode': encodeURIComponent(mode),
			'genre': encodeURIComponent(genre),
			'startFic': encodeURIComponent(startFic),
			'charactor': charactor,
			'ua': navigator.userAgent,
			'url': window.location.href
		}
		$.ajax({
			 'url' : apiurl + code + '_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
					,idx = result['result']
					
				// 썸네일 만들기
				bodyData = {
					'title': title,
					'idx': result.result
				}
				$.ajax({
					 'url': apiurl + code + '_make_thum.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(){
						M.storage(code+'_count', '0');
						addComplete(code, result.result);
						alert('등록되었습니다.');
						window.location.href = 'http://gaeyou.com/novel/#' + result.result;
					}
				})
			}
		})
	})
	
	M('#btnCancel').on('click', function(){
		/**
		M('#title').val('몬스터주식회사')
		M('#genre').val('로맨스')
		M('[data-name="1"]').val('철수')
		M('[data-sex="1"]').val('남자')
		M('[data-age="1"]').val('19')
		M('[data-job="1"]').val('학생')
		M('[data-point="1"]').val('엄청 소심하고\n착하다')
		M('[data-name="2"]').val('영희')
		M('[data-sex="2"]').val('여자')
		M('[data-age="2"]').val('22')
		M('[data-job="2"]').val('백수')
		M('[data-point="2"]').val('예쁘지만\n터프하다')
		/**/
		window.history.go(-1)
	})	
}

function viewChar() {
	for (var i=1; i<charLength+1; i++) {
		M('[data-charactor="' + i + '"]').css('display', 'block');
	}
	for (var i=charLength+1; i<6; i++) {
		M('[data-charactor="' + i + '"]').css('display', 'none');
	}
}

function checkCount() {
	novelCount = M.storage(code+'_count') || 0;
	novelCount = parseInt(novelCount, 10);
	if (novelCount < novelLimite) {
		alert('새로운 썰픽을 개설하려면 다른 썰픽에 최소 '+novelLimite+'번 이상 썰을 작성하셔야 합니다.');
		window.location.href = './list.html';
	}
}






