var code = 'friend2'

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/**
	if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '../f/';
		return false;
	}
	/**/
	
	M('#letter').on('focus', function(evt, mp){
		if (mp.hasClass('place')) {
			mp.removeClass('place');
			mp.html('')
		}
	})
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,uname = M('#uname').val()
			,kasid = M('#kasid').val()
			,help = M('#help').val()
			,letter = M('#letter').html()
			
		
		if (uname === '') {
			alert('닉네임을 입력하세요.');
			return false;
		}
		if (kasid === '') {
			alert('카스아이디를 입력해주세요.');
			return false;
		}
		if (help === '-1') {
			alert('도움받을 항목을 선택해주세요.');
			return false;
		}
		if (letter === '' || M('#letter').hasClass('place')) {
			alert('하고싶은말 또는 도움받을 게시판을 설명해주세요.');
			return false;
		}
		
		
		$.ajaxFileUpload({ 
			url : apiurl + code + '_add.php', 
			type: "POST",
			secureuri : false, 
			fileElementId : 'profile', 
			dataType : 'json', 
			data : {
				'uname': encodeURIComponent(uname),
				'kasid': encodeURIComponent(kasid),
				'help': encodeURIComponent(help),
				'letter': encodeURIComponent(letter)
			},
			complete:function(e){
				result = M.json(e.responseText).result;
				if (!e.responseText || !M.json(e.responseText)) {
					alert('오류가 있습니다.')
					window.location.href = 'http://gaeyou.com/f/';
				}
				addComplete(code+'List', result);
				window.location.href = 'http://gaeyou.com/f2/#' + result;
			}
		})
	})
	
	M('#btnCancel').on('click', function(){
/**
M('#mySex').val('남자')
M('#myArea').val('서울')
M('#msg').val('카카오스토리')
M('#uid').val('romeohcom')
M('#profile').val('')
M('#fsex').val('여자')
M('#fage').val('17~18세')
M('#relation').val('이성친구')
M('#letter').html('안녕하세요.')
form.like[1].checked = 'checked'
form.like[2].checked = 'checked'
/**/
		window.location.href = 'http://gaeyou.com/f2/';
	})	
}



