var  replyFriendList = M.storage('replyFriendList') || []
	,code = 'friend2'
	,cuData = {}
	,apiurl = 'http://gaeyou.com/api/'
	
	// 더보기
	,friendStart = 0
	,friendTotal = 20
	
	,rankData = {}
	

window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	/**
	if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '../t/';
		return false;
	}
	/**/
	
	
	var  hash = window.location.hash.replace('#', '')
	
	// 현재 친구찾기 전문통신
	bodyData = {
		'idx': hash
	}
	$.ajax({
		 'url': apiurl + code + '_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
			
			cuData['idx'] = result['idx']
			cuData['uname'] = decodeURIComponent(result['uname'])
			cuData['kasid'] = decodeURIComponent(result['kasid'])
			cuData['profile'] = decodeURIComponent(result['profile'])
			cuData['help'] = decodeURIComponent(result['help'])
			cuData['letter'] = decodeURIComponent(result['letter'])
			cuData['gaeup'] = decodeURIComponent(result['gaeup'])
			
			// 조회수 업데이트
			setView(code, cuData['idx'], cbSetView);
			function cbSetView(result){
				//console.log(result)
			}
			
			if (cuData['idx'] == undefined) {
				window.location.href = 'http://gaeyou.com/f2/';
				return false;
			}
			
			deleteAble = deleteAble(cuData['idx']);
			
			if (cuData['profile']) {
				M('.profile').css('display', 'block')
				M('#profile')
					.attr('src', 'http://gaeyou.com/upload/friend/middle/'+cuData['profile'])
					.on('click', function(){
						M('[data-pop]')
							.css('display', 'block')
							.on('click', function(){
								M('[data-pop]').css('display', 'none')
							})
						
						M('[data-full]').attr('src', 'http://gaeyou.com/upload/friend/large/'+decodeURIComponent(cuData['profile']))
					})
			}
			
			title = getTitle(cuData['help']) || cuData['letter'];
			
			M('#qtitle').html(title)
			M('#uname').html( cuData['uname'] );
			M('#kasid').html( '<a href="../r/u.html#' + cuData['kasid'] + '">' + cuData['kasid'].replace('@', '') + '</a>' );
			M('#help').html( title );
			M('#letter').html( cuData['letter'] );
			M('#btnClip').attr('href', '../r/u.html#' + cuData['kasid'])
			M('#gaeup').html('<em class="ico_gaeup"></em>깨업 (' + result['gaeup'] + '회)');
					
			getReply(cuData.idx);
			getFriendList();
			
			//console.log(admin , deleteAble, admin || deleteAble)
			if (admin || deleteAble) {
				M('#fauthor').css('display', 'block')
				
				M('#fauthor').on('click', function(evt, mp){
					if(!confirm('정말 삭제하시겠습니까?')) {
						return false;
					}
					bodyData = {
						'idx': cuData.idx
					}
					$.ajax({
						 'url': apiurl + code + '_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							console.log(result)
							var result = M.json(result)
								friendList = M.json(M.storage('friendList'))
								popList = []
								
							for (var i=0; i<friendList.length; i++) {
								if (result['id'] != friendList[i]) {
									popList.push(friendList[i])
								}
							}
							M.storage('friendList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var friendList = M.storage(code + 'List')
				
				if (typeof friendList === 'string') {
					friendList = M.json(friendList);
				} else {
					friendList = []
				}

				for (var i=0; i<friendList.length; i++) {
					if (friendList[i] == idx) {
						return true;
					}
				}
				return false;
			}
			
		}
	})
	
	// 깨업
	M('#btnGaeup').on('click', function(evt, mp){
		if ( checkUniq('gaeupList', cuData.idx) ) {
			alert('이미 깨업하셨습니다.');
			return false;
		}
		
		// 깨업 전문 통신
		bodyData = {
			'idx': cuData.idx
		}
		$.ajax({
			 'url': apiurl + code + '_gaeup.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq('gaeupList', cuData.idx);
				M('#gaeup').html('<em class="ico_gaeup"></em>깨업 (' + result['total'] + '회)');
			}
		})
	})
}



function getReply(idx) {
	// 댓글 가져오기 전문통신
	bodyData = {
		'idx': idx,
		'total':'10',
		'start':''
	}
	$.ajax({
		 'url': apiurl + code + '_reply_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json( result )
	
			if (result.length == 0) {
				str += '<li>';
				str += '	<div class="noReply">처음으로 댓글을 써보세요.</div>';
				str += '</li>';
				M('#replyList').html(str)
				M('.noReply').on('click', function(){
					showReply();
					M('#inpReply').focus()
				})
			} else {
				for (var i=0; i<result.length; i++) {
					var  content = result[i]['text']
				
					deleteable = deleteAble(result[i]['idx']);
					console.log(result[i]['idx'])
					str += '<li data-reply="' + result[i]['idx'] + '">';
					str += '	<div class="profile">';
					str += '		<div class="photo"><img src="../images/imoticon/' + result[i]['photo'] + '.png" alt=""></div>';
					str += '		<div class="user">';
					str += '			<span class="uname">' + decodeURIComponent(result[i]['uname']) + '</span>';
					str += '			<span class="date">' + M.dynamicDate(result[i]['regDate']) + '</span>';
					str += '			<span class="date">';
					//str += '				<span>신고</span>';
					if (deleteable || admin) {
						str += '				<span data-delreply="' + result[i]['idx'] + '">삭제</span>';
					}
					str += '			</span>';
					str += '		</div>';
					str += '	</div>';
					str += '	<div class="desc">' + decodeURIComponent(content) + '</div>';
					
					if (result[i]['kasid'] == '') {
						//str += '	<div class="kas">☞ ' + decodeURIComponent(result[i]['uname']) + '</div>';
					} else {
						str += '	<div class="kas"><a href="../r/u.html#' + result[i]['kasid'] + '">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '님카스</a></div>';
					}
					str += '</li>';
				}
				M('#replyList').html(str);
				M('[data-delreply]').on('click', function(evt, mp){
					if(!confirm('댓글을 삭제하겠습니까?')) {
						return false;
					}
					
					id = mp.data('delreply');
					
					bodyData = {
						'idx': id,
						'friendIdx': cuData['idx']
					}
					$.ajax({
						 'url': apiurl + 'friend_reply_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
						console.log(result)
							var result = M.json(result)
								replyList = M.json(M.storage('replyFriendList'))
								popList = []
								
							for (var i=0; i<replyList.length; i++) {
								if (result['id'] != replyList[i]) {
									popList.push(replyList[i])
								}
							}
							M.storage('replyFriendList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var replyList = M.storage(code + 'ReplyList') || []
				
				if (typeof replyList === 'string') {
					replyList = M.json(replyList);
				}

				for (var i=0; i<replyList.length; i++) {
					if (replyList[i] == idx) {
						return true;
					}
				}
				return false;
			}
		}
	})
}


// 친구리스트 전문통신
function getFriendList() {
	bodyData = {
		'total': friendTotal,
		'start': friendStart
	}
	$.ajax({
		 'url': apiurl + code + '_list_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
				,str = ''
			//console.log(result)
			friendStart = friendTotal + friendStart;
			for (var i=0; i<result.length; i++) {
				var  idx = result[i]['idx']
					,uname = decodeURIComponent(result[i]['uname'])
					,kasid = decodeURIComponent(result[i]['kasid'])
					,help = decodeURIComponent(result[i]['help'])
					,profile = decodeURIComponent(result[i]['profile'])
					,letter = decodeURIComponent(result[i]['letter'])
					,gaeup = decodeURIComponent(result[i]['gaeup'])
					,view = decodeURIComponent(result[i]['view'])
					,reply = decodeURIComponent(result[i]['reply'])
				
				title = letter + ' (' + help + ')'
				
				if (idx == cuData.idx) {
					sel = 'sel';
				} else {
					sel = '';
				}
				
				if (profile == '') {
					photo = 'profile.jpg';
				} else {
					photo = profile;
				}
				
				str += '<li data-rank-idx="124" data-new="" data-hot="" class="' + sel + '">';
				str += '	<a href="/f2/#' + idx + '">';
				str += '		<img src="http://gaeyou.com/upload/friend/small/'+photo+'">';
				str += '		<div class="letter">' + uname + '</div>';
				str += '		<div class="info">';
				//str += '			' + fage + ' / ' + fsex;	//relative
				str += '			<span>조회: ' + M.toCurrency(view) + ' | 댓글: ' + reply + ' | 깨업: ' + gaeup + '</span>';	//relative
				str += '		</div>';	
				str += '	</a>';
				str += '</li>';	
			}
			if (result.length < friendTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-more>더 불러오기</li>';
			}
			M('#replyContainer').html( M('#replyContainer').html() + str);
			M('[data-more]').on('click', function(evt, mp){
				mp.remove();
				getFriendList();
			})
		}
	})
}


function getTitle(help) {
	if (help == '좋아요' || 
		help == '멋져요' || 
		help == '기뻐요' || 
		help == '슬퍼요' || 
		help == '힘내요') {
		 return help + ' 눌러주세요.';
	}
	if (help == '공유') {
		return help + ' 부탁해요.';
	}
	if (help == '댓썰') {
		return help + ' 공유 부탁해요.';
	}
	if (help == '친추') {
		return help + ' 해주세요.';
	}
	if (help == '댓글') {
		return help + ' 좀 써주세요.';
	}
	if (help == '기타') {
		return help + ' 도움요청';
	}
	return false;
}












