var  code = 'worldcup'
	,cuData = {}

	// 슈퍼랭킹 리스트 가져오기
	,pageTotal = 20
	,pageStart = 0
	
	// 신규 슈퍼랭킹 가져오기
	,hotTotal = 5
	,hotStart = 0
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 15
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
	
	
	var hash = getHash();
	
	// 인기테스트 타이틀 변경
	if (listFlag == 'hot') {
		M('#hotListTitle').html('인기 슈퍼랭킹')
		M('#hotListOrder')
			.html('<i class="fa fa-arrow-circle-o-right"></i> 최신 실행순으로 정렬하기')
			.on('click', function(){
				M.storage('listFlag', 'new');
				window.location.reload();
			})
	} else {
		M('#hotListTitle').html('최근 슈퍼랭킹')
		M('#hotListOrder')
			.html('<i class="fa fa-arrow-circle-o-right"></i> 인기순으로 정렬하기')
			.on('click', function(){
				M.storage('listFlag', 'hot');
				window.location.reload();
			})
	}
	M.storage('listFlag', listFlag);
	
	// 현재 슈퍼랭킹 전문통신
	bodyData = {
		'idx': hash
	}
	$.ajax({
		 'url': apiurl + code + '_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result)
			
			if (result['idx'] == undefined) {
				window.location.href = '/w/';
				return false;
			}
			
			//console.log(result)
			cuData['idx'] = result.idx;
			cuData['uname'] = decodeURIComponent(result.uname);
			cuData['kasid'] = decodeURIComponent(result.kasid);
			cuData['title'] = decodeURIComponent(result.title);
			cuData['view'] = result.view;
			cuData['gaeup'] = result.gaeup;
			cuData['excute'] = result.excute;
			cuData['total'] = result.total;
			
			// 조회수 업데이트
			setView(code, cuData['idx'], cbSetView);
			function cbSetView(result){
				//console.log(result)
			}
			deleteAble = checkUniq('worldcup', cuData['idx'])
			
			M('#qtitle').html( cuData['title'] );
			
			if (cuData['kasid'] == '') {
				author = '작성자: ' + cuData['uname'];
			} else {
				author = '작성자: <a href="../r/u.html#' + cuData['kasid'] + '">☞ ' + cuData['uname'] + '님카스</a>';
			}
			author += ' | 조회: ' + M.toCurrency(cuData['view']);
			if (deleteAble || admin) {
				author += ' | <span data-delrank="' + cuData['idx'] + '">삭제</span>';
			}
			M('#qauthor').html(author);
			if (cuData['total'] == '4') {
				M('#readytxt').html( cuData['title'] + '<p>준결승전(4강)을 시작합니다.<p>' )
			} else {
				M('#readytxt').html( cuData['title'] + '<p>' + cuData['total'] + '강전을 시작합니다.</p>' )
			}
			// 보기 리스트 
			getList(cuData['idx']);
			
			// 다른 리스트
			getWorldcupList();
			
			// 댓글 불러오기
			getReply();
			
			// 스코어 불러오기
			M('#btnScore').on('click', function(){
				getScore();	
			})
						
			if (deleteAble || admin) {
				M('[data-delrank]').on('click', function(evt, mp){
					if(!confirm('정말 삭제하시겠습니까?')) {
						return false;
					}
					id = mp.data('delrank');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + code + '_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
								alist = M.json(M.storage('worldcup'))
								popList = []
								
							for (var i=0; i<alist.length; i++) {
								if (result['id'] != alist[i]) {
									popList.push(alist[i])
								}
							}
							M.storage('worldcup', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
		}
	})
	
	initEvent();
}


function getList(idx){
	// 현재 슈퍼랭킹 리스트 전문통신
	bodyData = {
		'idx': idx
	}
	$.ajax({
		 'url': apiurl + code + '_list_get.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
			
			cuData['list'] = M.json(result);
			stone = M.json(result);
			M('#start').on('click', function(evt, mp){
				initStart()
			})
		}
	})
}

// 리스트 가져오기
function getWorldcupList() {
	if (M('#hotContainer').selector.length > 0) {
		getHotList();
	}
	getNewList();
}

// 신규리스트
function getHotList() {
	// 다른 랭킹 리스트 전문통신
	bodyData = {
		'total': hotTotal,
		'start': hotStart
	}
	$.ajax({
		 'url': apiurl + code + '_get_list_hot.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			hotStart = hotTotal + hotStart;
			for (var i=0; i<result.length; i++) {
				if (cuData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				
				str += '<li class="sprit_li' + sel + '">';
				str += '	<a href="/w/#' + result[i]['idx'] + '">';
				str += '		<span class="txt_bx">';
				str += '			<strong class="tit">' + decodeURIComponent(result[i]['title']) + '</strong>';
				str += '			<em class="dsc">토너먼트: <span class="s' + result[i]['total'] + '">' + result[i]['total'] + '강전</span> | 조회: ' + M.toCurrency(result[i]['view']) + '회 | 경기수: ' + M.toCurrency(result[i]['excute']) + '회</em>';
				str += '		</span>'
				str += '	</a>';
				str += '</li>';
			}
			if (result.length < hotTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morehot>신규 슈퍼랭킹 더 불러오기</li>';
			}
			
			M('#hotContainer').html( M('#hotContainer').html() + str );
			
			M('[data-morehot]').on('click', function(evt, mp){
				mp.remove();
				getHotList();
			})
		}
	})
}

// 최근 슈퍼랭킹 리스트
function getNewList() {
	// 다른 랭킹 리스트 전문통신
	bodyData = {
		'total': pageTotal,
		'start': pageStart,
		'flag': listFlag
	}
	$.ajax({
		 'url': apiurl + code + '_get_list$.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			pageStart = pageTotal + pageStart;
			for (var i=0; i<result.length; i++) {
				if (cuData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				
				str += '<li class="sprit_li' + sel + '">';
				str += '	<a href="/w/#' + result[i]['idx'] + '">';
				str += '		<span class="txt_bx">';
				str += '			<strong class="tit">' + decodeURIComponent(result[i]['title']) + '</strong>';
				str += '			<em class="dsc">토너먼트: <span class="s' + result[i]['total'] + '">' + result[i]['total'] + '강전</span> | 조회: ' + M.toCurrency(result[i]['view']) + '회 | 경기수: ' + M.toCurrency(result[i]['excute']) + '회</em>';
				str += '		</span>'
				str += '	</a>';
				str += '</li>';
			}
			if (result.length < pageTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morenew>최근 슈퍼랭킹 더 불러오기</li>';
			}
			
			M('#replyContainer').html( M('#replyContainer').html() + str );
			
			M('[data-morenew]').on('click', function(evt, mp){
				mp.remove();
				getNewList();
			})
		}
	})
}


function getReply(){
	
	// 댓글 가져오기 전문통신
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
			var  str = ''
				,result = M.json( result )
			
			replyStart = replyTotal + replyStart;
			if (result.length == 0) {
				str += '<li>';
				str += '	<div class="noReply">처음으로 댓글을 써보세요.</div>';
				str += '</li>';
				M('#replyList').html(str)
			} else {
				if (result.length < replyTotal) {
					//str += '<li class="more">마지막입니다.</li>';
				} else {
					str += '<li class="more" data-replymore>댓글 더 불러오기</li>';
				}
				for (var i=result.length-1; i>=0; i--) {
				//for (var i=5; i>0; i--) {
					deleteable = deleteAble(result[i]['idx']);
					
					str += '<li data-reply="' + result[i]['idx'] + '">';
					str += '	<div class="profile">';
					str += '		<div class="photo"><img src="../images/imoticon/' + result[i]['photo'] + '.png" alt=""></div>';
					str += '		<div class="user">';
					str += '			<span class="uname">' + decodeURIComponent(result[i]['uname']).substr(0, 10) + '</span>';
					str += '			<span class="date">' + M.dynamicDate(result[i]['regDate']) + '</span>';
					str += '			<span class="date">';
					//str += '				<span>신고</span>';
					if (deleteable || admin) {
						str += '				<span data-delreply="' + result[i]['idx'] + '">삭제</span>';
					}
					str += '			</span>';
					str += '		</div>';
					str += '	</div>';
					str += '	<div class="desc">' + decodeURIComponent(result[i]['text']) + '</div>';
					
					if (result[i]['kasid'] == '') {
						//str += '	<div class="kas">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '</div>';
					} else {
						str += '	<div class="kas"><a href="u.html#' + result[i]['kasid'] + '">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '님카스</a></div>';
					}
					str += '</li>';
				}
				M('#replyList').html(str + M('#replyList').html());
				
				// 댓글 더보기
				M('[data-replymore]').on('click', function(evt, mp){
					mp.remove()
					getReply();
				})
				
				// 댓글 삭제
				M('[data-delreply]').on('click', function(evt, mp){
					if(!confirm('댓글을 삭제하겠습니까?')) {
						return false;
					}
					
					id = mp.data('delreply');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + code + '_reply_del.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
								replyList = M.json(M.storage(code + 'ReplyList'))
								popList = []
								
							for (var i=0; i<replyList.length; i++) {
								if (result['id'] != replyList[i]) {
									popList.push(replyList[i])
								}
							}
							M.storage(code + 'ReplyList', M.json(popList));
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


function getScore(flag) {
	// 다른 랭킹 리스트 전문통신
	bodyData = {
		'idx': cuData['idx']
	}
	$.ajax({
		 'url': apiurl + code + '_get_score.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			// 카스로 확인
			if (flag == 1) {
				post = '';
				post += '[슈퍼랭킹]\n'
				post += '❉ ' + cuData['title'] + ' 스코어 ❉\n'
				post += '────────────────────\n'
				for (var i=0; i<result.length; i++) {
					var n = i+1;
					post += n + '위: ' + decodeURIComponent(result[i]['text']) + ' (' + M.toCurrency(result[i]['score']) + '점)\n';
				}
				
				post += '\n♘ 경기참여\n';
				post += 'http://gaeyou.com/w/#' + cuData['idx'];
				console.log(post)
				
				urlinfo = {
					'title': getSpecial() + ' 슈퍼랭킹',
					'desc': cuData['title'],
					'imageurl': ['http://www.gaeyou.com/upload/worldcup/' + cuData['idx'] + '.png'],
					'type': 'article'
				}
				kakao.link("story").send({   
			        appid : 'gaeyou',
					appver : '1.0',
					appname : cuData['uname']+'님 제작',//'★깨알유머★를 검색하세요!!',
			        post : post,
					urlinfo : M.json(urlinfo)
			    });
			    return false;
			}
			
			// 화면에 표시
			str += '<p>❉ ' + cuData['title'] + ' 스코어 ❉</p>';
			str += '<dl class="board">';
			for (var i=0; i<result.length; i++) {
				var n = i+1;
				str += '<dt>' + n + '위</dt>';
				str += '<dd>' + decodeURIComponent(result[i]['text']) + ' (' + M.toCurrency(result[i]['score']) + '점)</dd>';
			}
			str += '</dl>';
			str += '<a href="add.html">슈퍼랭킹을 직접 만들어 보세요.</a>';
			M('#tinfo').html(str);
		}
	})
}


var  data
	,stone
	,arr32 = []
	,arr16 = []
	,arr8 = []
	,arr4 = []
	,arr3 = []
	,arr3win = []
	,arr2 = []
	,arr1 = []
	,cuRound
	,cuStage
	,winner = {}
	,semiWinner = {}
	
function initStart() {
	data = shuffle(cuData['list']);
	cuStage = parseInt(cuData['total'], 10);
	if (cuStage == 32) {
		for (var i=0; i<data.length; i++) {
			arr32.push(data[i]['seq']);
		}
	} else if (cuStage == 16) {
		for (var i=0; i<data.length; i++) {
			arr16.push(data[i]['seq']);
		}
	} else if (cuStage == 8) {
		for (var i=0; i<data.length; i++) {
			arr8.push(data[i]['seq']);
		}
	} else if (cuStage == 4) {
		for (var i=0; i<data.length; i++) {
			arr4.push(data[i]['seq']);
		}
	}
	cuRound = 0;
	
	M('#game').css('display', 'block');
	M('#ready').css('display', 'none');
	M('#getScore').css('display', 'none');
	
	M('#first').on('click', selPic);
	M('#second').on('click', selPic);

	fight(cuRound, cuStage);
}

function selPic(evt, mp){
	M('#first').html('')
	M('#second').html('')
	
	if (cuStage == 32) {
		arr16.push(mp.data('seq'));
		if (cuRound <= 14) {
			cuRound++
			fight(cuRound, 32);
		} else {
			cuStage = 16;
			cuRound = 0
			fight(cuRound, 16);
		}
	} else if (cuStage == 16) {
		arr8.push(mp.data('seq'));
		if (cuRound <= 6) {
			cuRound++
			fight(cuRound, 16);
		} else {
			cuStage = 8;
			cuRound = 0
			fight(cuRound, 8);
		}
	} else if (cuStage == 8) {
		arr4.push(mp.data('seq'));
		if (cuRound <= 2) {
			cuRound++
			fight(cuRound, 8);
		} else {
			cuStage = 4;
			cuRound = 0
			fight(cuRound, 4);
		}
	} else if (cuStage == 4) {
		arr2.push(mp.data('seq'));
		// 3,4위 결정
		if (mp.attr('id') == 'first') {
			arr3.push(M('#second').data('seq'));
		} else if (mp.attr('id') == 'second') {
			arr3.push(M('#first').data('seq'));
		}
		if (cuRound <= 0) {
			cuRound++
			fight(cuRound, 4);
		} else {
			cuStage = 3;
			cuRound = 0
			fight(cuRound, 3);
		}
	} else if (cuStage == 3) {
		arr3win.push(mp.data('seq'));
		if (mp.attr('id') == 'first') {
			arr3win.push(M('#second').data('seq'));
		} else if (mp.attr('id') == 'second') {
			arr3win.push(M('#first').data('seq'));
		}		
		cuStage = 2;
		cuRound = 0;
		fight(cuRound, 2);
	} else if (cuStage == 2) {
		M('#game').css('display', 'none');
		M('#result').css('display', 'block');
		M('#getScore').css('display', 'block');
		
		winner.names = stone[mp.data('seq')]['text']
		winner.idx = mp.data('seq')
		
		// 준우승
		if (winner.idx == arr2[0]) {
			semiWinner.name = stone[arr2[1]]['text']
			semiWinner.idx = stone[arr2[1]]['seq']
		} else {
			semiWinner.name = stone[arr2[0]]['text']
			semiWinner.idx = stone[arr2[0]]['seq']
		}
		
		M('#game').css('display', 'none');
		M('#final').css('display', 'block');
		M('#win1').html( decodeURIComponent(winner.names) );
		M('#win2').html( '♚ 준우승: ' + decodeURIComponent(semiWinner.name) );
		M('#win3').html( '♝ 3위: ' + decodeURIComponent(stone[arr3win[0]]['text']) );
		M('#win4').html( '♞ 4위: ' + decodeURIComponent(stone[arr3win[1]]['text']) );
		
		// 순위 전문 통신
		bodyData = {
			'idx': cuData['idx'],
			'w1': stone[winner.idx]['seq'],
			'w2': semiWinner.idx,
			'w3': stone[arr3win[0]]['seq'],
			'w4': stone[arr3win[1]]['seq']
		}
		$.ajax({
			 'url': apiurl + code + '_excute.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				getScore();
			}
		})
	}
}

function fight(round, final){
	var  left = (Number(round)+Number(1)) * 2 - 2
		,right = (Number(round)+Number(1)) * 2 - 1

	if (left == -1) {
		left = 0;
	}
	if (right == 0) {
		right = 1;
	}
	
	if (final == 32) {
		M('#first')
			.html( decodeURIComponent(stone[arr32[left]]['text']) )
			.data('seq', stone[arr32[left]]['seq'])
			.addClass('t32')
			
		M('#second')
			.html( decodeURIComponent(stone[arr32[right]]['text']) )
			.data('seq', stone[arr32[right]]['seq'])
			.addClass('t32')

		M('#stage').text('32강전');
		M('#round').text('('+(cuRound+1)+'/16)');
	}

	if (final == 16) {
		M('#first')
			.html( decodeURIComponent(stone[arr16[left]]['text']) )
			.data('seq', stone[arr16[left]]['seq'])
			.removeClass('t32')
			.addClass('t16')
			
		M('#second')
			.html( decodeURIComponent(stone[arr16[right]]['text']) )
			.data('seq', stone[arr16[right]]['seq'])
			.removeClass('t32')
			.addClass('t16')

		M('#stage').text('16강전');
		M('#round').text('('+(cuRound+1)+'/8)');
	}

	if (final == 8) {
		M('#first')
			.html( decodeURIComponent(stone[arr8[left]]['text']) )
			.data('seq', stone[arr8[left]]['seq'])
			.removeClass('t16')
			.addClass('t8')
			
		M('#second')
			.html( decodeURIComponent(stone[arr8[right]]['text']) )
			.data('seq', stone[arr8[right]]['seq'])
			.removeClass('t16')
			.addClass('t8')

		M('#stage').text('8강전');
		M('#round').text('('+(cuRound+1)+'/4)');
	}

	if (final == 4) {
		M('#first')
			.html( decodeURIComponent(stone[arr4[left]]['text']) )
			.data('seq', stone[arr4[left]]['seq'])
			.removeClass('t8')
			.addClass('t4')
			
		M('#second')
			.html( decodeURIComponent(stone[arr4[right]]['text']) )
			.data('seq', stone[arr4[right]]['seq'])
			.removeClass('t8')
			.addClass('t4')

		M('#stage').text('준결승');
		M('#round').text('('+(cuRound+1)+'/2)');
	}

	if (final == 3) {
		M('#first')
			.html( decodeURIComponent(stone[arr3[left]]['text']) )
			.data('seq', stone[arr3[left]]['seq'])
			.removeClass('t4')
			.addClass('t3')
			
		M('#second')
			.html( decodeURIComponent(stone[arr3[right]]['text']) )
			.data('seq', stone[arr3[right]]['seq'])
			.removeClass('t4')
			.addClass('t3')

		M('#stage').text('3,4위전');
		M('#round').text('');
	}
	
	if (final == 2) {
		M('#first')
			.html( decodeURIComponent(stone[arr2[left]]['text']) )
			.data('seq', stone[arr2[left]]['seq'])
			.removeClass('t3')
			.addClass('t2')
			
		M('#second')
			.html( decodeURIComponent(stone[arr2[right]]['text']) )
			.data('seq', stone[arr2[right]]['seq'])
			.removeClass('t3')
			.addClass('t2')

		M('#stage').text('결승');
		M('#round').text('');
	}
}


function initEvent() {
	// 카스로 보내기
	M('#btnSend').on('click', function(){
		var post = ''
		if (winner.names == undefined) {
			//alert('경기 진행중입니다.');
			getScore(1);
			return false;
		}
		
		
		post += '[슈퍼랭킹]\n'
		post += cuData['title'] + ' \n'
		post += '────────────────────\n'
		post += '♛ 최종우승: ' + decodeURIComponent(winner.names) + '\n';
		post += '♚ 준우승: ' + decodeURIComponent(semiWinner.name) + '\n';
		post += '♝ 3위: ' + decodeURIComponent(stone[arr3win[0]]['text']) + '\n';
		post += '♞ 4위: ' + decodeURIComponent(stone[arr3win[1]]['text']) + '\n\n';
		
		post += '♘ 경기참여\n';
		post += 'http://gaeyou.com/w/#' + cuData['idx'];
		console.log(post)
		
		urlinfo = {
			'title': '슈퍼랭킹',
			'desc': cuData['title'],
			'imageurl': ['http://www.gaeyou.com/upload/worldcup/' + cuData['idx'] + '.png'],
			'type': 'article'
		}
		kakao.link("story").send({   
	        appid : 'gaeyou',
			appver : '1.0',
			appname : cuData['uname']+'님 제작',//'★깨알유머★를 검색하세요!!',
	        post : post,
			urlinfo : M.json(urlinfo)
	    });
	})
	
	// 카톡으로 보내기
	M('#btnKakao').on('click', function(){
		kakao.link('talk').send({
			msg: '(슈퍼랭킹)\n'+cuData['title'],
			url: 'http://gaeyou.com/w/#' + cuData['idx'],
			appid: 'gaeyou',
			appver: '1.0',
			appname: '슈퍼랭킹',//'★깨알유머★를 검색하세요!!',
			type: 'link'
		});
	})
}














