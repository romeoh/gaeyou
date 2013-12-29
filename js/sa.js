var  code = 'sa'
	,sas = {}
	,cuData = {}
	
	// 동영상 리스트 가져오기
	,pageTotal = 20
	,pageStart = 0
	
	// 신규 동영상 가져오기
	,newTotal = 5
	,newStart = 0
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 15

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	hash = getHash();
	
	// 현재 데이터 읽어오기
	bodyData = {
		'idx': hash,
		'div': 'movie'
	}
	$.ajax({
		 'url': apiurl + code + '_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			//console.log(result)
			var  result = M.json(result)
				,idx = result['idx']
				,uname = decodeURIComponent(result['uname'])
				,kasid = decodeURIComponent(result['kasid'])
				,contents = decodeURIComponent(result['contents'])
				,profile = result['profile']
				,photo = result['photo']
				,movie = result['movie']
				,heart = result['heart']
				,share = result['share']
				,reply = result['reply']
				,deleted = result['deleted']
				,view = result['view']
				,regDate = result['regDate']
				,modifyDate = result['modifyDate']
				,deleteable = checkUniq('sa', idx)
			
			// 조회수 업데이트
			setView(code, idx, cbSetView);
			function cbSetView(result){
				console.log(result)
			}
	
			cuData.idx = idx;
			cuData.uname = uname;
			cuData.kasid = kasid;
			cuData.contents = contents;
			cuData.profile = profile;
			cuData.photo = photo;
			cuData.movie = movie;
			cuData.heart = heart;
			cuData.share = share;
			cuData.reply = reply;
			cuData.deleted = deleted;
			cuData.view = view;
			cuData.regDate = regDate;
			cuData.modifyDate = modifyDate;

			if (result['idx'] == undefined || result['idx'] == '') {
				//window.location.href = 'http://gaeyou.com/s/';
				//return false;
			}

			M('#profile').attr('src', '../images/imoticon/' + profile + '.png');
			M('#uname').html(uname);
			if (deleteable || admin) {
				M('#ddate').html(M.dynamicDate(regDate) + ' <span class="del" data-del="' + idx + '"> | 삭제</span>');
			} else {
				M('#ddate').html(M.dynamicDate(regDate));
			}
			
			M('[data-sharenum]').html(share);
			M('#contents').html(contents);
			
			// 사진, 동영상 표시
			if (photo != '') {
				M('#imgCon').html('<img src="../upload/sa/' + photo + '">');
				M('[data-sharebox]').data('type', 'photo');
			} else if (movie != '') {
				var str = ''
				str += '<div class="imgCon">';
				str += '<iframe width="100%" height="315" src="http://www.youtube.com/embed/' + movie + '" frameborder="0" allowfullscreen></iframe>';
				str += '</div>';
				M('#imgCon').html(str)
				M('[data-sharebox]').data('type', 'movie');
			}
			
			// 하트, 댓글 갯수
			str = ''
			//str += '<span class="ico heart"></span>' + heart;
			str += '<span class="ico reply"></span>' + reply;
			M('#shareInfo').html(str);
			
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
			M('[data-kas]')
				.data('kas', idx)
				.on('click', function(evt, mp){
					var  idx = mp.data('kas')
						,post = ''
						,type = mp.parent().data('type')
					
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
								,content = cuData['contents'].replace(/<div>/gi, '\n').replace(/<\/div>/gi, '').replace(/\&nbsp\;/gi, '')
							
							M('[data-sharenum]').html(result['share']);
							
							post += '👻 웃긴동영상 🐾\n'
							post += '────────────────────\n'
							post += content + '\n\n';
							post += 'http://gaeyou.com/s/#' + cuData['idx'];
							
							if (type == 'movie') {
								cont = 'http://i1.ytimg.com/vi/' + cuData['movie'] + '/default.jpg';
							} else {
								cont = 'http://www.gaeyou.com/upload/sa/' + cuData['photo'];
							}
							//console.log(cont)
							urlinfo = {
								'title': '🍟 웃긴 동영상',//'깨알움짤',
								'desc': content,
								'imageurl': [cont],
								'type': 'article'
							}
							kakao.link("story").send({   
						        appid : 'gaeyou',
								appver : '1.0',
								appname : '작성: ' + cuData['uname'],//'youtube',//'★깨알유머★를 검색하세요!!',
						        post : post,
								urlinfo : M.json(urlinfo)
						    });
						}
					})
				})
			
			// 카톡으로 공유
			M('[data-katalk]')
				.data('katalk', idx)
				.on('click', function(evt, mp){
					var  idx = mp.data('katalk')
						,post = ''
						
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
								msg: decodeURIComponent(cuData['contents']),
								url: 'http://gaeyou.com/s/#' + cuData['idx'],
								appid: 'gaeyou',
								appver: '1.0',
								appname: '깨알웃사',
								type: 'link'
							});
						}
					})
				})
				
			// 타임라인 삭제
			M('[data-del]').on('click', function(evt, mp){
				if(!confirm('랭킹을 정말 삭제하시겠습니까?')) {
					return false;
				}
				bodyData = {
					'idx': cuData.idx
				}
				$.ajax({
					 'url': apiurl + 'sa_del.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						console.log(result)
						var result = M.json(result)
							sa = M.json(M.storage('sa'))
							popList = []
							
						for (var i=0; i<sa.length; i++) {
							if (result['id'] != sa[i]) {
								popList.push(sa[i])
							}
						}
						M.storage('sa', M.json(popList));
						window.location.href = 'http://gaeyou.com/s/';
					}
				})
			})
			getReplys();
			getNewList();
			getAllList();
		}
	})
}


// 새로운 동영상 리스트 가져오기
function getNewList() {
	// 타임라인 모두 가져오기 전문통신
	bodyData = {
		'total': newTotal,
		'start': newStart,
		'flag': 'new',
		'div': 'movie'
	}
	$.ajax({
		 'url': apiurl + code + '_get_all.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result) {
			//console.log(result)
			var  resultData = M.json(result)
				,result = resultData['list']
				,totalLength = resultData['total']
				,str = ''
			
			newStart = newTotal + newStart;
			
			sas = result;
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
					,view = result[i]['view']
					,regDate = result[i]['regDate']
					,modifyDate = result[i]['modifyDate']
				
				if (idx == cuData.idx) {
					sel = 'sel';
				} else {
					sel = '';
				}
				
				str += '<li data-rank-idx="124" data-new="" data-hot="" class="'+sel+'">';
				str += '	<a href="/s/#' + idx + '">';
				str += '		<img src="http://i1.ytimg.com/vi/'+movie+'/default.jpg"/>';
				str += '		<div class="letter">' + contents + '</div>';
				str += '		<div class="info">';
				str += '			조회: ' + M.toCurrency(view) + ' | ';
				str += '			댓글: ' + reply + ' | ';
				str += '			공유: ' + share + '';
				str += '			<span class="ico"></span>';
				str += '		</div>';	
				str += '	</a>';
				str += '</li>';	
				
			}
			if (result.length < newTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morenew>더 불러오기</li>';
			}
			
			M('#newContainer').html( M('#newContainer').html() + str);
			
			M('[data-morenew]').on('click', function(evt, mp){
				mp.remove();
				getNewList();
			})
		}
	})
}



// 모든 리스트 가져오기
function getAllList() {
	// 타임라인 모두 가져오기 전문통신
	bodyData = {
		'total': pageTotal,
		'start': pageStart,
		'div': 'movie'
	}
	$.ajax({
		 'url': apiurl + code + '_get_all.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result) {
			//console.log(result)
			var  resultData = M.json(result)
				,result = resultData['list']
				,totalLength = resultData['total']
				,str = ''
			
			pageStart = pageTotal + pageStart;
			
			sas = result;
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
					,view = result[i]['view']
					,regDate = result[i]['regDate']
					,modifyDate = result[i]['modifyDate']
				
				if (idx == cuData.idx) {
					sel = 'sel';
				} else {
					sel = '';
				}
				
				str += '<li data-rank-idx="124" data-new="" data-hot="" class="'+sel+'">';
				str += '	<a href="/s/#' + idx + '">';
				str += '		<img src="http://i1.ytimg.com/vi/'+movie+'/default.jpg"/>';
				str += '		<div class="letter">' + contents + '</div>';
				str += '		<div class="info">';
				str += '			조회: ' + M.toCurrency(view) + ' | ';
				str += '			댓글: ' + reply + ' | ';
				str += '			공유: ' + share + '';
				str += '			<span class="ico"></span>';
				str += '		</div>';	
				str += '	</a>';
				str += '</li>';	
				
			}
			if (result.length < pageTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-more>더 불러오기</li>';
			}
			
			M('#movieList').html( M('#movieList').html() + str);
			
			M('[data-more]').on('click', function(evt, mp){
				mp.remove();
				getAllList();
			})			
		}
	})
}



// 댓글가져오기
function getReplys() {
	// 댓글 가져오기
	bodyData = {
		'idx': cuData['idx'],
		'total': replyTotal,
		'start': replyStart
	}
	$.ajax({
		 'url': apiurl + code + '_reply_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,str = ''
				
			replyStart = replyTotal + replyStart;
			//console.log(result)
			if (result.length == 0) {
				str += '<div class="rlist" data-noreply>처음으로 댓글을 써보세요.</div>';
			} else {
				if (result.length < replyTotal) {
					//str += '<li class="more">마지막입니다.</li>';
				} else {
					str += '<li class="more" data-replymore>댓글 더 불러오기</li>';
				}
				for (var i=0; i<result.length; i++) {
					console.log(result[i])
					var  idx = result[i]['idx']
						,kasid = decodeURIComponent(result[i]['kasid'])
						,photo = result[i]['photo']
						,uname = decodeURIComponent(result[i]['uname'])
						,regDate = result[i]['regDate']
						,text = decodeURIComponent(result[i]['text'])
						,deleteable = checkUniq(code + 'ReplyList', idx)
						
					if (uname == 'null' || uname == 'undefined') {
						uname = '익명';
					}
					str += '<div class="rlist">';
					str += '	<div class="imo"><img src="../images/imoticon/' + photo + '.png"></div>';
					str += '	<div class="author">';
					str += '		<span class="uname">' + uname + '</span>';
					str += '		<span class="ddate">' + M.dynamicDate(regDate) + '</span>';
					if (deleteable || admin) {
						str += '		<span class="delete" data-deleteReply="' + idx + '"> | 삭제</span>';
					}
					if (kasid != '') {
						str += '		<span class="kas"><a href="../r/u.html#' + kasid + '">☞ ' + uname + '님 카스</a></span>';
					}
					str += '	</div>';
					str += '	<div class="replycon" style="">' + text + '</div>';
					str += '</div>';
				}
			}
			
			M('#replyCon').html(str + M('#replyCon').html());
			
			// 댓글 더보기
			M('[data-replymore]').on('click', function(evt, mp){
				mp.remove()
				getReplys();
			})
			
			M('[data-noreply]').on('click', function(){
				M('#inpReply').focus()
			})
			
			// 삭제버튼
			M('[data-deleteReply]').on('click', function(evt, mp){
				if(!confirm('댓글을 삭제하겠습니까?')) {
					return false;
				}
				
				id = mp.data('deletereply');
				
				bodyData = {
					'idx': id,
					'saIdx': cuData.idx
				}
				$.ajax({
					 'url': apiurl + code + '_reply_del.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						var  result = M.json(result)
							,key = code + 'ReplyList'
							,replyList = M.json(M.storage(key))
							,popList = []
							
						for (var i=0; i<replyList.length; i++) {
							if (result['id'] != replyList[i]) {
								popList.push(replyList[i])
							}
						}
						M.storage(key, M.json(popList));
						window.location.reload();
					}
				})
			})
		}
	})
}











