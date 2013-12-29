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
			mp
				.removeClass('place')
				.html('');
		}
	})


	M('#msg').on('change', function(evt, mp){
		if (mp.val() === '-1') {
			M('#lblId').html('<span class="opt"></span>아이디(필수)');
		} else {
			M('#lblId').html('<span class="opt"></span>' + mp.val() + ' 아이디(필수)');	
		}
	})
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,sendPollData
			,mySex = M('#mySex').val()
			,myArea = M('#myArea').val()
			,msg = M('#msg').val()
			,uid = M('#uid').val()
			,profile = M('#profile').val()
			,like = form.like
			,likeLists = []
			,fsex = M('#fsex').val()
			,fage = M('#fage').val()
			,relation = M('#relation').val()
			,letter
		
		if (mySex === '-1') {
			alert('나의 성별을 선택해주세요.');
			return false;
		}
		if (myArea === '-1') {
			alert('나의 거주지를 선택해주세요.');
			return false;
		}
		if (msg === '-1') {
			alert('사용할 메신져를 선택해주세요.');
			M('#msg').focus()
			return false;
		}
		if (uid === '') {
			alert(msg + ' 아이디를 입력하세요.');
			M('#uid').focus()
			return false;
		}
		if (fsex === '-1') {
			alert('친구의 성별을 선택해주세요.');
			M('#qst').focus()
			return false;
		}
		if (fage === '') {
			alert('친구의 나이대를 입력해주세요.');
			M('#fage').focus()
			return false;
		}
		if (relation === '-1') {
			alert('친구와의 관계를 선택해주세요.');
			return false;
		}
		
		// 관심사
		for (var i=0; i<like.length; i++) {
			if (like[i].checked) {
				likeLists.push(like[i].value);
			}
		}
		likeLists = likeLists.join(',');
		
		// 하고싶은말
		if (M('#letter').hasClass('place')) {
			letter = ''
		} else {
			letter = M('#letter').html()
		}
		
		
		$.ajaxFileUpload({ 
			url : '../api/friend_add.php', 
			type: "POST",
			secureuri : false, 
			fileElementId : 'profile', 
			dataType : 'json', 
			data : {
			   'mySex': encodeURIComponent(mySex),
			   'myArea': encodeURIComponent(myArea),
			   'msg': encodeURIComponent(msg),
			   'uid': encodeURIComponent(uid),
			   'like': encodeURIComponent(likeLists),
			   'fsex': encodeURIComponent(fsex),
			   'fage': encodeURIComponent(fage),
			   'relation': encodeURIComponent(relation),
			   'letter': encodeURIComponent(letter)
			},
			complete:function(e){
				if (!e.responseText || !M.json(e.responseText)) {
					alert('오류가 있습니다.')
					window.location.href = 'http://gaeyou.com/f/';
				}
				var result = M.json(e.responseText).result;
					flist = M.storage('friendList') || []
				
				if (typeof flist === 'string') {
					flist = M.json(flist)
				}
				flist.push(result);
				M.storage('friendList', M.json(flist));
				alert('친구찾기에 등록되었습니다.');
				window.location.href = 'http://gaeyou.com/f/';
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
		window.location.href = 'http://gaeyou.com/f/';
	})	
}



