var  code = 'game'
	
	// 신규리스트 가져오기
	,newTotal = 20
	,newStart = 0
	
	// 인기리스트 가져오기
	,hotTotal = 20
	,hotStart = 0
	
	,listFlag = M.storage('listFlag') || 'hot'

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
	
	// 인기테스트 타이틀 변경
	if (listFlag == 'hot') {
		M('#hotListTitle').html('급상승 인기 썰픽')
		M('#hotListOrder')
			.html('<i class="fa fa-arrow-circle-o-right"></i> 최신 실행순으로 정렬하기')
			.on('click', function(){
				M.storage('listFlag', 'new');
				window.location.reload();
			})
	} else {
		M('#hotListTitle').html('최근 썰픽')
		M('#hotListOrder')
			.html('<i class="fa fa-arrow-circle-o-right"></i> 급상승 인기순으로 정렬하기')
			.on('click', function(){
				M.storage('listFlag', 'hot');
				window.location.reload();
			})
	}
	M.storage('listFlag', listFlag);
	
	if (admin) {
		M('#btnNew').html('<a class="gnbNew" href="add.html"></a>');
	}
	getNewList();
	//getHotList();
}

// 신규
function getNewList() {
	var databody = {
		'start': newStart,
		'total': newTotal
	}
	request(code+'_get_list', databody, function(result){
		console.log(result)
		var  result = M.json(result)
			,str = ''
		
		newStart = newTotal + newStart;
			
		for (var i=0; i<result.length; i++) {
			var recommand = parseInt(result[i]['good'], 10) - parseInt(result[i]['bad'], 10);
			
			str += '<li class="">';
			str += '	<a href="./#' + result[i]['idx'] + '">';
			str += '		<div class="box_holder">';
			str += '			<div class="thum">';
			str += '				<img src="../upload/game/thum/' + result[i]['thum'] + '">';
			str += '			</div>';
			str += '			<div class="item_detail">';
			str += '				<h3>' + decodeURIComponent( result[i]['title'] ).replace(/\+/g, ' ') + '</h3>';
			str += '				<p>' + decodeURIComponent( result[i]['text'] ).replace(/\+/g, ' ') + '</p>';
			str += '				<div class="item_info">';
			str += '					<i class="fa fa-eye gray"></i><span class="num">' + result[i]['view'] + '</span>';
			//str += '					<i class="fa fa-comments gray"></i><span class="num">' + result[i]['reply'] + '</span>';
			str += '					<i class="fa fa-thumbs-up gray"></i><span class="num">' + result[i]['good'] + '</span>';
			str += '				</div>';
			str += '			</div>';
			str += '		</div>';
			str += '	</a>';
			str += '</li>';
			
		}
		if (result.length < newTotal) {
			str += '<li class="more">마지막입니다.</li>';
		} else {
			str += '<li class="more" data-morenew="">더 불러오기</li>';
		}
		M('#newContainer').html( M('#newContainer').html() + str )
		// 더 불러오기
		M('[data-morenew]').on('click', function(evt, mp){
			mp.remove();
			getNewList();
		})
	})
}

// 인기
function getHotList() {
	var databody = {
		'start': hotStart,
		'total': hotTotal,
		'flag': listFlag
	}
	request(code+'_get_list_hot', databody, function(result){
		var  result = M.json(result)
			,str = ''
		
		hotStart = hotTotal + hotStart;
			
		for (var i=0; i<result.length; i++) {
			var recommand = parseInt(result[i]['good'], 10) - parseInt(result[i]['bad'], 10)
			str += '<li>';
			str += '	<a href="./#' + result[i]['idx'] + '">';
			str += '		<img src="../upload/novel/'+result[i]['idx']+'.png" style="width:80px; height:80px">';
			str += '		<div class="letter">' + decodeURIComponent( result[i]['title'] ) + '</div>';
			str += '		<p class="story">' + decodeURIComponent( result[i]['first_fic'] ) + '</p>';
			str += '		<div class="info">';
			str += '			<i class="fa fa-book"></i> ' + result[i]['fic_count'] + '';
			str += '			<i class="fa fa-eye"></i> ' + result[i]['view'] + '';
			str += '			<i class="fa fa-comments"></i> ' + result[i]['reply'] + '';
			str += '			<i class="fa fa-thumbs-up"></i> ' + recommand + '';
			if (result[i]['mode'] == 'private') {
				str += '			<i class="fa fa-lock fa-red"></i>';
			} else {
				str += '			<i class="fa fa-unlock fa-green"></i>';
			}
			str += '		</div>';
			str += '	</a>';
			str += '</li>';
		}
		if (result.length < hotTotal) {
			str += '<li class="more">마지막입니다.</li>';
		} else {
			str += '<li class="more" data-morehot="">더 불러오기</li>';
		}
		M('#hotContainer').html( M('#hotContainer').html() + str )
		// 더 불러오기
		M('[data-morehot]').on('click', function(evt, mp){
			mp.remove();
			getHotList();
		})
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













