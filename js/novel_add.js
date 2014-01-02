var  totalLength = '-1'
	,code = 'worldcup'

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	// 경기수
	M('#play').on('change', function(evt, mp){
		var  str = ''
		
		totalLength = mp.val()
			
		if (mp.val() == -1) {
			M('#pcontent').html('');
			return false;
		}
		for (var i=0; i<totalLength; i++) {
			var n = i+1;
			
			str += '<div class="plist">';
			str += '	<div class="inner_item">';
			str += '		<span class="txt_g"><input type="text" placeholder="' + n + '번을 입력하세요." data-game="' + i + '" maxlength="30"></span>';
			str += '	</div>';
			str += '</div>';
		}
		M('#pcontent').html(str);
		checkVaridation()
	})
	
	function checkVaridation() {
		M('[data-game]').on('blur', function(evt, mp){
			var  idx = mp.data('game')
				,val = mp.val()
			
			for (var i=0; i<totalLength; i++) {
				var liVal = M('[data-game="'+i+'"]').val()
				if (val.indexOf(liVal) != '-1') {
					if (liVal != '' && idx != i) {
						var n = i + 1;
						alert( n + '번에 이미 ' + val + '이(가) 있습니다.')
					}
				}
			}
		})
	}
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,title = M('#title').val()
			,uname = M('#uname').val()
			,kasid = M('#kasid').val()
			,lists = []
			
		if (title === '') {
			alert('제목을 입력해주세요.');
			M('#title').focus()
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
		if (totalLength === '-1') {
			alert('참여수를 선택해주세요.');
			return false;
		}
		
		for (var i=0; i<totalLength; i++) {
			var n = i + 1
			if (M('[data-game="' + i + '"]').val() == '') {
				alert( n + '번째 항목을 입력해주세요.');
				return false;
			} else {
				lists.push( encodeURIComponent(M('[data-game="' + i + '"]').val()) )
			}
			
			/*
			if (M('[data-list="' + i + '"]').val() === '') {
				n = i+1
				alert(n + '번째 리스트를 입력해주세요.');
				return false;
			} else {
				lists.push( encodeURIComponent(M('[data-list="' + i + '"]').val()) )
			}
			*/
		}
		M('#btnReg').off('click');
		bodyData = {
			'title': encodeURIComponent(title),
			'uname': encodeURIComponent(uname),
			'kasid': encodeURIComponent(kasid),
			'lists': lists
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
						addComplete(code, result.result);
						alert('등록되었습니다.');
						window.location.href = 'http://gaeyou.com/w/#' + result.result;
					}
				})
			}
		})
	})
	
	M('#btnCancel').on('click', function(){
		window.history.go(-1)
	})	
}




