var  sas = {}
	,apiurl = 'http://gaeyou.com/api/'
	,pageTotal = 5
	,pageStart

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	M.scroll(0);
	location.reload();
}, false);

function ready() {
	var  hash = window.location.hash.replace('#', '')
	
	if (!admin) {
		alert('서버 점검중입니다.');
		window.location.href = 'http://gaeyou.com/t/';
		return false;
	}
	
	
	if (hash == '') {
		pageStart = 1;
	} else {
		pageStart = hash;
	}

	//console.log(pageStart)
	// 타임라인 모두 가져오기 전문통신
	bodyData = {
		'idx': hash,
		'total': pageTotal * pageStart,
		'start': pageTotal * (pageStart-1)
	}
	$.ajax({
		 'url': apiurl + 'sa_get_all.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			console.log(result)
			var  resultData = M.json(result)
				,result = resultData['list']
				,totalLength = resultData['total']
				,str = ''
			
			sas = result;
			//console.log(result)
			if (result.length == 0) {
				window.location.href = '../s/'
			}
			if (result['idx'] == undefined) {
				//window.location.href = 'http://gaeyou.com/f/add.html';
				//return false;
			}
			
			for (var i=0; i<result.length; i++) {
				var  idx = result[i]['idx']
					,uname = decodeURIComponent(result[i]['uname'])
					,kasid = decodeURIComponent(result[i]['kasid'])
					,contents = decodeURIComponent(result[i]['contents'])
					,profile = result[i]['profile']
					,photo = result[i]['photo']
					,movie = result[i]['movie']
					,heart = result[i]['heart']
					,share = result[i]['share']
					,reply = result[i]['reply']
					,deleted = result[i]['deleted']
					,regDate = result[i]['regDate']
					,modifyDate = result[i]['modifyDate']
				
				str += '<div class="container">';
				str += '	<div class="box">';
				str += '		<div class="finfo">';
				str += '			<div class="thum"><img src="../images/imoticon/' + profile + '.png"></div>';
				str += '			<div class="author">';
				str += '				<span class="uname">' + uname + '</span>';
				str += '				<div class="ddate">' + M.dynamicDate(regDate) + ' <span class="shareInfo"><span class="ico reply"></span>' + reply + '</span></div>';
				str += '				<div class="sharebox" data-sharebox="' + idx + '"';
				if (photo != '') {
					str += '					data-type="photo">';
				} else {
					str += '					data-type="movie">';
				}
				str += '					<span class="num" data-sharenum>' + share + '</span>';
				str += '					<span class="btnKas" data-kas="' + idx + '"></span>';
				str += '					<span class="btnKatalk" data-katalk="' + idx + '"></span>';
				str += '					<img src="../images/common/btn_share_list.png">';
				str += '				</div>';
				str += '				<span class="btnShare" data-share="' + idx + '">';
				str += '					<span class="num" data-sharenum>' + share + '</span>';
				str += '					<img src="../images/common/btn_share.png">';
				str += '				</span>';
				str += '			</div>';
				str += '			<div class="contents">' + contents + '</div>';
				str += '		</div>';
				
				if (photo != '') {
					str += '		<div class="imgCon"><img src="../upload/sa/' + photo + '"></div>';	
					str += '		<a href="view.html#' + idx + '" class="link"></a>';
				} else if (movie != '') {
					str += '		<div class="imgCon">';
					str += '		<iframe width="100%" height="315" src="http://www.youtube.com/embed/' + movie + '" frameborder="0" allowfullscreen></iframe>';
					str += '		</div>';
					str += '		<a href="view.html#' + idx + '" class="link video"></a>';
				}
				
				str += '	</div>';
				str += '</div>';
			}
			M('#wrap').html(str);
			
			// 페이징 처리
			pagingAll = Math.ceil(totalLength/pageTotal);
			cuPage = hash || 1
			str  = '<ul>';
			if (cuPage != 1) {
				str += '	<li><a href="../s/">이전</a></li>';
			}
			for (var i=0; i<pagingAll; i++) {
				var  sel
					,n = i + 1
				
				if (cuPage == n) {
					sel = ' class="sel"';
				} else {
					sel = '';
				}
				str += '	<li'+sel+'><a href="../s/#' + n + '">' + n + '</a></li>';
			}
			if (cuPage != n) {
				str += '	<li><a href="../s/#' + pagingAll + '">다음</a></li>';
			}
			str += '</ul>';
			
			M('#paging').html(str);
			
			// 공유 이벤트
			$('[data-share]').on('click', function(evt, mp){
				var idx = $(this).data('share')
				$('[data-sharebox="' + idx + '"]').css('display', 'block');
				return false;
			})
			$('body').on('click', function(evt, mp){
				$('[data-sharebox]').css('display', 'none');
			})
			
			// 카스로 공유
			M('[data-kas]').on('click', function(evt, mp){
				var  idx = mp.data('kas')
					,post = ''
					,cuSa
					,type = mp.parent().data('type')
				
				for (var key in sas) {
					if (sas[key]['idx'] == idx) {
						cuSa = sas[key];
					}
				}
				
				// 타임라인 모두 가져오기 전문통신
				bodyData = {
					'idx': idx
				}
				$.ajax({
					 'url': apiurl + 'sa_set_share.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						var result = M.json(result)
						
						M('[data-sharenum]').html(result['share']);
						
						post += '[웃낀동영상]\n'
						post += decodeURIComponent(cuSa['contents']).replace(/<div>/g, '\n').replace(/<\/div>/g, '') + '\n\n';
						post += 'http://gaeyou.com/s/view.html#' + cuSa['idx'];
						
						if (type == 'movie') {
							cont = 'http://i1.ytimg.com/vi/' + cuSa['movie'] + '/default.jpg';
						} else {
							cont = 'http://www.gaeyou.com/upload/sa/' + cuSa['photo'];
						}
						urlinfo = {
							'title': '웃낀 동영상',//'깨알움짤',
							'desc': decodeURIComponent(cuSa['contents']),
							'imageurl': [cont],
							'type': 'article'
						}
						kakao.link("story").send({   
					        appid : 'gaeyou',
							appver : '1.0',
							appname : 'youtube',//'★깨알유머★를 검색하세요!!',
					        post : post,
							urlinfo : M.json(urlinfo)
					    });
					}
				})
			})
			
			// 카톡으로 공유
			M('[data-katalk]').on('click', function(evt, mp){
				var  idx = mp.data('katalk')
					,post = ''
					,cuSa
				
				for (var key in sas) {
					if (sas[key]['idx'] == idx) {
						cuSa = sas[key];
					}
				}
				
				// 타임라인 모두 가져오기 전문통신
				bodyData = {
					'idx': idx
				}
				$.ajax({
					 'url': apiurl + 'sa_set_share.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						var result = M.json(result)
						
						M('[data-sharenum]').html(result['share']);
						
						kakao.link('talk').send({
							msg: decodeURIComponent(cuSa['contents']),
							url: 'http://gaeyou.com/s/view.html#' + cuSa['idx'],
							appid: 'gaeyou',
							appver: '1.0',
							appname: '깨알웃사',
							type: 'link'
						});
					}
				})
			})
		}
	})
}















