var  code = 'game'

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,title = M('#title').val()
			,game_url = M('#game_url').val()
			,photo = M('#photo').val()
			,large = M('#large').val()
			,genre = M('#genre').val()
			,mode = M('#mode').val()
			,desc = M('#desc').val()
		
		if (title === '') {
			alert('제목을 입력해주세요.');
			M('#title').focus()
			return false;
		}
		if (game_url === '') {
			alert('게임 주소를 입력해주세요.');
			M('#game_url').focus()
			return false;
		}
		if (photo == '') {
			alert('썸네일 선택해주세요.');
			M('#photo').focus()
			return false;
		}
		if (large == '') {
			alert('큰이미지를 선택해주세요.');
			M('#large').focus()
			return false;
		}
		if (genre == '-1') {
			alert('장르를 선택해주세요.');
			M('#genre').focus()
			return false;
		}
		if (mode == '-1') {
			alert('화면모드를 선택해주세요.');
			M('#mode').focus()
			return false;
		}
		if (desc == '') {
			alert('게임을 설명해주세요.');
			M('#desc').focus()
			return false;
		}
		
		M('#form1').attr('action', '../api/game_add.php');
		document.form1.submit();
		/*
		$.ajaxFileUpload({ 
			url : apiurl + code + '_add.php',
			type: "POST",
			secureuri : false, 
			fileElementId : 'photo', 
			dataType : 'json', 
			data : {
				'title': encodeURIComponent(title),
				'game_url': encodeURIComponent(game_url),
				'photo': encodeURIComponent(photo),
				'genre': encodeURIComponent(genre),
				'desc': encodeURIComponent(desc),
				'url': window.location.href,
				'ua': navigator.userAgent
			},
			complete:function(e){
				if (!e.responseText || !M.json(e.responseText)) {
					alert('오류가 있습니다.')
					window.location.href = 'http://gaeyou.com/s2/';
				}
				var result = M.json(e.responseText).result;
					flist = M.storage(code) || []
				
				if (typeof flist === 'string') {
					flist = M.json(flist)
				}
				flist.push(result);
				M.storage(code, M.json(flist));
				//alert('등록되었습니다.');
				window.location.href = './list.html';
			}
		})
		*/
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






