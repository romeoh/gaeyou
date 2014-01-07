var  code = 'novel'
	
	// 리스트 가져오기
	,pageTotal = 20
	,pageStart = 0

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
	
	var databody = {
		
	}
	request(code+'_get_list', databody, function(result){
		var  result = M.json(result)
			,str = ''
			
		for (var i=0; i<result.length; i++) {
			str += '<li>';
			str += '	<a href="./#' + result[i]['idx'] + '">';
			str += '		<img src="../upload/novel/'+result[i]['idx']+'.png" style="width:80px; height:80px">';
			str += '		<div class="letter">' + decodeURIComponent( result[i]['title'] ) + '</div>';
			str += '		<p class="story">' + decodeURIComponent( result[i]['first_fic'] ) + '</p>';
			str += '		<div class="info">';
			str += '			<i class="fa fa-book"></i> ' + result[i]['fic_count'] + '';
			str += '			<i class="fa fa-eye"></i> ' + result[i]['view'] + '';
			str += '			<i class="fa fa-comments"></i> ' + result[i]['reply'] + '';
			//str += '			<i class="fa fa-bookmark"></i> ' + decodeURIComponent( result[i]['genre'] ) + '';
			if (result[i]['mode'] == 'private') {
				str += '			<i class="fa fa-lock fa-red"></i>';
			} else {
				str += '			<i class="fa fa-unlock fa-green"></i>';
			}
			str += '		</div>';
			str += '	</a>';
			str += '</li>';
		}
		M('#hotContainer').html(str)
	})
	
}

// 전문통신
function request(tr, data, callback) {
	if (data['file']) {
		$.ajaxFileUpload({ 
			url : apiurl + tr + '.php',
			type: "POST",
			secureuri : false, 
			fileElementId : data['file'], //'photo'
			dataType : 'json', 
			data : data,
			complete:function(result){
				callback(result);
			}
		})
	} else {
		$.ajax({
			 'url': apiurl + tr + '.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': data
			,'type': 'POST'
			,'success': function(result){
				callback(result);
			}
		})
	}
}













