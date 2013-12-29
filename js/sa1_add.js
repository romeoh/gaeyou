var code = 'sa'
	movieOk = false

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	M('#movie')
		.on('focus', function(evt, mp) {
			movieOk = false;
		})
		.on('blur', function(evt, mp) {
			var  movie = M('#movie').val()
				,youtubeid
			
			if (movie.indexOf('youtu') == '-1') {
				//alert('YOUTUBE 동영상만 지원합니다.');
				return false;
			}
			if (movie.indexOf('youtu.be/') != '-1') {
				youtubeid = movie.split('youtu.be/')[1];
			}
			if (movie.indexOf('v=') != '-1') {
				youtubeid = movie.split('?v=')[1].split('&')[0];
			}
			if (!youtubeid) {
				return false;
			}
			movieOk = true;
			M('#sampleMovie').html('<iframe width="100%" height="315" src="http://www.youtube.com/embed/' + youtubeid + '" frameborder="0" allowfullscreen></iframe>')
		})
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		var  bodyData
			,sendPollData
			,uname = M('#uname').val()
			,kasid = M('#kasid').val()
			,contents = M('#contents').html()
			,movie = M('#movie').val()
			,youtubeid = ''
		
		if (uname === '') {
			alert('닉네임을 입력해 주세요.');
			return false;
		}
		if (movie === '') {
			alert('동영상주소를 입력해주세요.');
			return false;
		}
		if (movie.indexOf('youtu') == '-1') {
			alert('YOUTUBE 동영상만 지원합니다.');
			return false;
		}
		if (movie.indexOf('youtu.be/') != '-1') {
			youtubeid = movie.split('youtu.be/')[1];
		}
		if (movie.indexOf('v=') != '-1') {
			youtubeid = movie.split('?v=')[1].split('&')[0];
		}
		if (!movieOk) {
			alert('죄송합니다. 등록할수 없는 동영상입니다.');
			return false;
		}
		
		if (contents === '') {
			alert('설명을 입력해주세요.');
			return false;
		}
		
		bodyData = {
			'uname': encodeURIComponent(uname),
			'kasid': encodeURIComponent(kasid),
			'smile': getSmile(),
			'contents': encodeURIComponent(contents),
			'movie': encodeURIComponent(youtubeid),
			'category': 'music'
		}
		$.ajax({
			 'url': apiurl + code + '_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
					,idx = result['result']
					
				addComplete(code, idx);
				window.location.href = 'http://gaeyou.com/s1/#' + idx;
			}
		})
				
		
		
		
		
		/*$.ajaxFileUpload({ 
			url : '../api/sa_add.php', 
			type: "POST",
			secureuri : false, 
			fileElementId : 'photo', 
			dataType : 'json', 
			data : {
				'uname': encodeURIComponent(uname),
				'kasid': encodeURIComponent(kasid),
				'smile': getSmile(),
				'contents': encodeURIComponent(contents),
				'movie': encodeURIComponent(youtubeid)
			},
			complete:function(e){
				if (!e.responseText || !M.json(e.responseText)) {
					alert('오류가 있습니다.')
					window.location.href = 'http://gaeyou.com/s/';
				}
				var result = M.json(e.responseText).result;
					flist = M.storage('sa') || []
				
				if (typeof flist === 'string') {
					flist = M.json(flist)
				}
				flist.push(result);
				M.storage('sa', M.json(flist));
				//alert('등록되었습니다.');
				window.location.href = 'http://gaeyou.com/s/';
			}
		})
		*/
	})
	
	M('#btnCancel').on('click', function(){
/**
M('#movie').val('http://youtu.be/Ecvj04wnH3M')
M('#contents').html('안녕하세요')
//M('#contents').html('안녕하세요<div>ㅋㅋㅋㅋㅋㅋㅋ</div>')
/**/
		window.location.href = 'http://gaeyou.com/s/';
	})	
}




