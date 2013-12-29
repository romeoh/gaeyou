var code = 'sa'
	movieOk = false

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,sendPollData
			,uname = M('#uname').val()
			,kasid = M('#kasid').val()
			,contents = M('#contents').html()
			,photo = M('#photo').val()
		
		if (uname === '') {
			alert('닉네임을 입력해 주세요.');
			return false;
		}
		if (photo === '') {
			alert('파일을 첨부해주세요.');
			return false;
		}
		if (photo.indexOf('.gif') == '-1') {
			alert('움직이는 짤만 첨부가능합니다.');
			return false;
		}
		if (contents === '') {
			alert('설명을 입력해주세요.');
			return false;
		}
		
		/*bodyData = {
			'uname': encodeURIComponent(uname),
			'kasid': encodeURIComponent(kasid),
			'smile': getSmile(),
			'contents': encodeURIComponent(contents),
			'photo': encodeURIComponent(photo)
		}
		$.ajax({
			 'url': apiurl + code + '_add$.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
					,idx = result['result']
					
				addComplete(code, idx);
				window.location.href = 'http://gaeyou.com/s2/#' + idx;
			}
		})*/
				
		$.ajaxFileUpload({ 
			url : apiurl + code + '_add.php',
			type: "POST",
			secureuri : false, 
			fileElementId : 'photo', 
			dataType : 'json', 
			data : {
				'uname': encodeURIComponent(uname),
				'kasid': encodeURIComponent(kasid),
				'smile': getSmile(),
				'contents': encodeURIComponent(contents),
				'photo': encodeURIComponent(photo),
				'flag': '1',
				'ua': navigator.userAgent
			},
			complete:function(e){
				if (!e.responseText || !M.json(e.responseText)) {
					alert('오류가 있습니다.')
					window.location.href = 'http://gaeyou.com/s2/';
				}
				var result = M.json(e.responseText).result;
					flist = M.storage('sa') || []
				
				if (typeof flist === 'string') {
					flist = M.json(flist)
				}
				flist.push(result);
				M.storage('sa', M.json(flist));
				//alert('등록되었습니다.');
				window.location.href = 'http://gaeyou.com/s2/';
			}
		})
	})
	
	M('#btnCancel').on('click', function(){
/**
M('#movie').val('http://youtu.be/Ecvj04wnH3M')
M('#contents').html('안녕하세요')
//M('#contents').html('안녕하세요<div>ㅋㅋㅋㅋㅋㅋㅋ</div>')
/**/
		window.location.href = 'http://gaeyou.com/s2/';
	})	
}




