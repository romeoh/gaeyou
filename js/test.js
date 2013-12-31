var  pollList = M.storage('pollList') || []
	,code = 'test'
	,hash
	,testReplyList = M.storage('testReplyList') || []
	,cuTest
	,apiurl = 'http://gaeyou.com/api/'
	,testData = {}
	
	// 인기테스트 불러오기
	,getOrder = process(0, 4)
	,hotStart = 0
	,hotTotal = 5
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 10
	
	// 신규테스트 불러오기
	,newStart = 0
	,newTotal = 20
	,listFlag = M.storage('listFlag') || 'hot'
	
window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	/*if (!admin) {
		alert('서버 점검중입니다.');
		window.location.href = 'http://goo.gl/7g0kn1';
		return false;
	}*/
	
	var uname = M.storage('uname') || ''
	hash = window.location.hash.replace('#', '')
	
	if (uname) {
		M('#userName')
			.on('blur', function(evt, mp){
				M.storage('uname', mp.val())
			})
			.val(uname)
	}
	
	// 인기테스트 타이틀 변경
	if (listFlag == 'hot') {
		M('#hotListTitle').html('인기 테스트')
		M('#hotListOrder')
			.html('<i class="fa fa-arrow-circle-o-right"></i> 최신 실행순으로 정렬하기')
			.on('click', function(){
				M.storage('listFlag', 'new');
				window.location.reload();
			})
	} else {
		M('#hotListTitle').html('최근 테스트')
		M('#hotListOrder')
			.html('<i class="fa fa-arrow-circle-o-right"></i> 인기순으로 정렬하기')
			.on('click', function(){
				M.storage('listFlag', 'hot');
				window.location.reload();
			})
	}
	M.storage('listFlag', listFlag);
	
	// 현재 테스트 전문통신
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
				window.location.href = '/t';
				return false;
			}
			hash = result.idx
			testData.idx = result.idx;
			testData.uname = decodeURIComponent(result.uname);
			testData.kasid = decodeURIComponent(result.kasid);
			testData.title = decodeURIComponent(result.title);
			testData.exp = decodeURIComponent(result.exp);
			testData.result = decodeURIComponent(result.result);
			testData.view = result.view;
			testData.gaeup = result.gaeup;
			testData.excute = result.excute;
			testData.modifyDate = result.modifyDate;
			testData.regDate = result.regDate;
			testData.resultLeng = result.resultLeng;
			testData.good = result.good;
			
			deleteAble = checkUniq('test', testData['idx']);
			if (admin) {
				deleteAble = true;
			}
			M('#qtitle').html( testData['title'] );
			if (testData['kasid'] == '') {
				author = '작성자: ' + testData['uname'] + ' | <span>조회: <span id="viewCount">' + M.toCurrency(result['view']) + '</span>회</span>';
			} else {
				author = '작성자: <a href="../r/u.html#' + testData['kasid'] + '">☞ ' + testData['uname'] + '님카스</a> | <span>조회: <span id="viewCount">' + M.toCurrency(result['view']) + '</span>회</span>';
			}
			if (deleteAble) {
				author += ' | <span data-delrank="' + testData['idx'] + '">삭제</span>';
			}
			if (admin) {
				author += ' | <span data-good="' + testData['idx'] + '">추천</span>';
			}
			M('#qauthor').html(author)
			M('#exp').html(testData['exp']);
			M('#total').html('총 ' + M.toCurrency(testData['resultLeng']) + '개의 결과가 있습니다.');
			M('#btnTest')
				.html('<span><em class="ico_star_check"></em> 카스로 확인(' + M.toCurrency(result['excute']) + '회)</span></a>')
				.on('click', testExcute)
			M('#btnGaeup')
				.html('<span><em class="ico_gaeup"></em> 깨업(' + M.toCurrency(result['gaeup']) + '회)</span></a>')
				//.on('click', setGaeup)
			M('#creator').html(testData.uname + '님에게 한마디')
			
			getTestList();
			getTestAll();
			getReply();
			initGaeup();
			initView();
			
			if (deleteAble) {
				// 삭제하기
				M('[data-delrank]').on('click', function(evt, mp){
					if(!confirm('테스트를 정말 삭제하시겠습니까?')) {
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
								test = M.json(M.storage('test'))
								popList = []
								
							for (var i=0; i<test.length; i++) {
								if (result['id'] != test[i]) {
									popList.push(test[i])
								}
							}
							M.storage('test', M.json(popList));
							window.location.reload();
						}
					})
				})
				// 추천하기
				M('[data-good]').on('click', function(evt, mp){
					if(!confirm('테스트를 정말 추천하시겠습니까?')) {
						return false;
					}
					id = mp.data('good');
					
					bodyData = {
						'idx': id
					}
					$.ajax({
						 'url': apiurl + code + '_good.php'
						,'contentType': 'application/x-www-form-urlencoded'
						,'data': bodyData
						,'type': 'POST'
						,'success': function(result){
							var result = M.json(result)
							//alert('추천하였습니다.');
							//window.location.reload();
						}
					})
				})
			}
		}
	})
	
	// 댓글
	M('#inpReply').on('focus', function(evt, mp){
		mp.focus();
		showReply();
	})
	M('#inpReply').on('blur', function(evt, mp){
		hideReply();
	})
	
	M('#uname').on('focus', function(evt, mp){
		showReply();
	})
	M('#uname').on('blur', function(evt, mp){
		M.storage('uname', mp.val())
		hideReply();
	})
	
	M('#kasid').on('focus', function(evt, mp){
		showReply();
	})
	M('#kasid').on('blur', function(evt, mp){
		M.storage('kasid', mp.val())
		hideReply();
	})
	
	if ( M.storage('uname') ) {
		M('#uname').val(M.storage('uname'))
	}
	if ( M.storage('kasid') ) {
		M('#kasid').val(M.storage('kasid'))
	}
	
	// 댓글 180자 제한
	M('#inpReply').on('keyup', function(evt, mp){
		var txt = mp.html()
		if (txt.length >= 180) {
			mp.html( txt.substr(0, 170) );
			alert('180자 이상 입력할수 없습니다.');
		}
	})
	
	// 댓글쓰기 전문통신
	M('#btnSubmit').on('click', function(evt, mp){
		if (M('#inpReply').html() == '') {
			alert('내용을 입력해주세요.');
			M('#inpReply').focus();
			return false;
		}
		if (M('#inpReply').hasClass('msg')) {
			alert('내용을 입력해주세요.');
			M('#inpReply').focus();
			return false;
		}
		
		if (M('#uname').val() == '') {
			alert('이름을 입력해주세요.');
			M('#uname').css('display', 'block');
			M('#kasid').css('display', 'block');
			M('#uname').focus();
			return false;
		}
		M.storage('uname', M.storage('uname'));
		M.storage('kasid', M.storage('kasid'));
		
		imoidx = process(dataPhoto);
		imoticon = dataPhoto[imoidx]
		bodyData = {
			'idx': testData['idx'],
			'uname': encodeURIComponent(M('#uname').val()),
			'kasid': encodeURIComponent(M('#kasid').val()),
			'photo': encodeURIComponent(imoticon),
			'text': encodeURIComponent(M('#inpReply').html())
		}
		$.ajax({
			 'url': apiurl + code + '_reply_add.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var result = M.json(result);
				replyId = result['id'];
				
				if (typeof testReplyList === 'string') {
					testReplyList = M.json(testReplyList);
				}
				testReplyList.push(replyId);
				M.storage('testReplyList', M.json(testReplyList));
				window.location.reload();
			}
		})
	})
}

function showReply() {
	if (M('#inpReply').hasClass('msg')) {
		M('#inpReply')
			.removeClass('msg')
			.html('')
	}
	M('#uname').css('display', 'block');
	M('#kasid').css('display', 'block');
}
function hideReply() {
	M('#uname').css('display', 'none');
	M('#kasid').css('display', 'none');
}

// 현재 테스트 항목 가져오기
function getTestList(){
	// 현재 랭킹 리스트 전문통신
	bodyData = {
		'idx': testData['idx']
	}
	$.ajax({
		 'url': apiurl + code + '_get_list.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);

			testData.lists = [];
			for (var i=0; i<result.length; i++) {
				testData.lists.push(decodeURIComponent(result[i]['text']).split('|'));
			}
		}
	})
}


// 다른 테스트 리스트 가져오기
function getTestAll() {
	// 인기 리스트 전문
	if (M('#hotContainer').selector.length > 0) {
		getHotTest();
	}
	
	// 신규 리스트 전문
	getNewTest()
}


// 신규 테스트 더보기
function getHotTest() {
	bodyData = {
		'total': hotTotal,
		'order': getOrder,
		'start': hotStart
	}
	$.ajax({
		 'url': apiurl + code + '_get_all_hot.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			//console.log(result)
			hotStart = hotTotal + hotStart;
			/*if (getOrder == '0') {
				M('#order').html('조회순 정렬됨');
			} else if (getOrder == '1') {
				M('#order').html('깨업순 정렬됨');
			} else if (getOrder == '2') {
				M('#order').html('결과순 정렬됨');
			} else {
				M('#order').html('실행순 정렬됨');
			}*/
			
			for (var i=0; i<result.length; i++) {
				if (testData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				
				str += '<li class="sprit_li' + sel + '">';
				str += '	<a href="/t/#' + result[i]['idx'] + '">';
				str += '		<span class="txt_bx">';
				str += '			<strong class="tit">' + decodeURIComponent(result[i]['title']) + '</strong>';
				str += '			<em class="dsc">조회: ' + M.toCurrency(result[i]['view']) + '회 | 실행: ' + M.toCurrency(result[i]['excute']) + '회 | 깨업: ' + M.toCurrency(result[i]['gaeup']) + '회 | 결과: ' + M.toCurrency(result[i]['resultLeng']) + '개</em>';
				str += '		</span>'
				//if (result[i]['good'] == '1') {
				//	str += '		<span class="good"><span class="ico_good"></span> 추천</span>';
				//}
				str += '	</a>';
				str += '</li>';
			}
			if (result.length < hotTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morehot="">더 불러오기</li>';
			}
			M('#hotContainer').html( M('#hotContainer').html() + str );
			
			// 더 불러오기
			M('[data-morehot]').on('click', function(evt, mp){
				mp.remove();
				getHotTest();
			})
		}
	})
}

// 다른 테스트 리스트 전문통신
function getNewTest() {
	bodyData = {
		'total': newTotal,
		'start': newStart,
		'flag': listFlag
	}
	$.ajax({
		 'url': apiurl + code + '_get_all.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			newStart = newTotal + newStart;
			for (var i=0; i<result.length; i++) {
				if (testData['idx'] == result[i]['idx']) {
					sel = ' sel'
				} else {
					sel = ''
				}
				
				str += '<li class="sprit_li' + sel + '">';
				str += '	<a href="/t/#' + result[i]['idx'] + '">';
				str += '		<span class="txt_bx">';
				str += '			<strong class="tit">' + decodeURIComponent(result[i]['title']) + '</strong>';
				str += '			<em class="dsc">조회: ' + M.toCurrency(result[i]['view']) + '회 | 실행: ' + M.toCurrency(result[i]['excute']) + '회 | 깨업: ' + M.toCurrency(result[i]['gaeup']) + '회 | 결과: ' + M.toCurrency(result[i]['resultLeng']) + '개</em>';
				str += '		</span>'
				//if (result[i]['good'] == '1') {
				//	str += '		<span class="good"><span class="ico_good"></span> 추천</span>';
				//}
				str += '	</a>';
				str += '</li>';
			}
			if (result.length < newTotal) {
				str += '<li class="more">마지막입니다.</li>';
			} else {
				str += '<li class="more" data-morenew="">더 불러오기</li>';
			}
			M('#replyContainer').html( M('#replyContainer').html() + str );
			// 더 불러오기
			M('[data-morenew]').on('click', function(evt, mp){
				mp.remove();
				getNewTest();
			})
		}
	})
}

// 테스트 깨업
function initGaeup() {
	// 깨업
	M('#btnGaeup').on('click', function(evt, mp){
		if ( checkUniq('testGaeupList', testData['idx']) ) {
			alert('이미 깨업하셨습니다.');
			return false;
		}
		
		// 깨업 전문 통신
		bodyData = {
			'idx': testData['idx']
		}
		$.ajax({
			 'url': apiurl + code + '_gaeup.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq('testGaeupList', testData['idx']);
				M('#btnGaeup').html('<span><em class="ico_gaeup"></em>깨업 (' + result['total'] + '회)</span></a>');
			}
		})
	})
}

// 조회수 올리기
function initView() {
	// 조회수 업데이트
	if ( !checkUniq('testViewList', testData['idx']) ) {
		bodyData = {
			'idx': testData['idx'],
			'code': code,
			'url': window.location.href,
			'ua': navigator.userAgent
		}
		$.ajax({
			 'url': apiurl + code + '_view.php'
			,'contentType': 'application/x-www-form-urlencoded'
			,'data': bodyData
			,'type': 'POST'
			,'success': function(result){
				var  result = M.json(result)
				
				setUniq('testViewList', testData['idx']);
				M('#viewCount').html(result['total']);
			}
		})
	}
}


// 테스트 실행
function testExcute() {
	var  userName = M('#userName').val()
		,result = testData['result']
		,post = ''
		
	if (userName == '') {
		alert('이름을 입력해주세요.');
		return false;
	}
	result = result.replace(/#이름#/, userName)
	if (result.indexOf('#항목1#') != -1) {
		ranList1 = testData['lists'][0]
		idx1 = process(ranList1)
		result = result.replace(/#항목1#/, ranList1[idx1])
	}
	if (result.indexOf('#항목2#') != -1) {
		ranList2 = testData['lists'][1]
		idx2 = process(ranList2)
		result = result.replace(/#항목2#/, ranList2[idx2])
	}
	if (result.indexOf('#항목3#') != -1) {
		ranList3 = testData['lists'][2]
		idx3 = process(ranList3)
		result = result.replace(/#항목3#/, ranList3[idx3])
	}
	if (result.indexOf('#항목4#') != -1) {
		ranList4 = testData['lists'][3]
		idx4 = process(ranList4)
		result = result.replace(/#항목4#/, ranList4[idx4])
	}
	if (result.indexOf('#항목5#') != -1) {
		ranList5 = testData['lists'][4]
		idx5 = process(ranList5)
		result = result.replace(/#항목5#/, ranList5[idx5])
	}
			
	post += getSpecial() + ' ' + testData['title'] + '\n'
	post += '────────────────────\n'
	//post += '[결과]\n'
	post += result + '\n\n';
	post += 'http://gaeyou.com/t/#' + testData['idx'];
	console.log(post);
	
	// 테스트 전문 통신
	bodyData = {
		'idx': testData['idx']
	}
	$.ajax({
		 'url': apiurl + code + '_excute.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  result = M.json(result)
			M('#btnTest').html('<span><em class="ico_star_check"></em> 카스로 확인(' + result['total'] + '회)</span></a>');
			
			thumidx = process(dataThum)
			
			urlinfo = {
				'title': getSpecial() + ' ' +testData['title'],
				'desc': testData['exp'],
				//'imageurl': ['http://www.gaeyou.com/images/thum/'+dataThum[thumidx]],
				'imageurl': ['http://www.gaeyou.com/upload/fonts/'+testData['idx']+'.png'],
				'type': 'article'
			}
			kakao.link("story").send({   
		        appid : 'gaeyou',
				appver : '1.0',
				appname : testData['uname']+'님 제작',//'★깨알유머★를 검색하세요!!',
		        post : post,
				urlinfo : M.json(urlinfo)
		    });
		}
	})
}



// 댓글 가져오기 전문통신
function getReply(){
	bodyData = {
		'idx': testData['idx'],
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
			//console.log(result.length)
			if (result.length == 0) {
				str += '<li>';
				str += '	<div class="noReply" id="noReply">처음으로 댓글을 써보세요.</div>';
				str += '</li>';
				
				M('#replyList').html(str)
				M('#noReply').on('click', function(){
					M('#inpReply').focus();
				})
			} else {
				//console.log(result)
				if (result.length < replyTotal) {
					//str += '<li class="more">마지막입니다.</li>';
				} else {
					str += '<li class="more" data-replymore>댓글 더 불러오기</li>';
				}
				
				for (var i=0; i<result.length; i++) {
					var  content = result[i]['text']
						
					deleteable = deleteAble(result[i]['idx']);
					str += '<li data-reply="' + result[i]['idx'] + '">';
					str += '	<div class="profile">';
					str += '		<div class="photo"><img src="../images/imoticon/' + result[i]['photo'] + '.png" alt=""></div>';
					str += '		<div class="user">';
					str += '			<span class="uname">' + decodeURIComponent(result[i]['uname']).substr(0, 10) + '</span>';
					str += '			<span class="date">' + M.dynamicDate(result[i]['regDate']) + '</span>';
					str += '			<span class="date">';
					//str += '				<span>신고</span>';
					if (deleteable) {
						str += '				<span data-delreply="' + result[i]['idx'] + '">삭제</span>';
					}
					str += '			</span>';
					str += '		</div>';
					str += '	</div>';
					str += '	<div class="desc">' + decodeURIComponent(content) + '</div>';
					
					if (result[i]['kasid'] == '') {
						//str += '	<div class="kas">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '</div>';
					} else {
						str += '	<div class="kas"><a href="../r/u.html#' + result[i]['kasid'] + '">☞ ' + decodeURIComponent(result[i]['uname']).substr(0, 4) + '님카스</a></div>';
					}
					str += '</li>';
				}
				M('#replyList').html(str + M('#replyList').html());
				
				// 댓글 더보기
				M('[data-replymore]').on('click', function(evt, mp){
					mp.remove()
					getReply();
				})
				
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
								testReplyList = M.json(M.storage('testReplyList'))
								popList = []
								
							for (var i=0; i<testReplyList.length; i++) {
								if (result['id'] != testReplyList[i]) {
									popList.push(testReplyList[i])
								}
							}
							M.storage('testReplyList', M.json(popList));
							window.location.reload();
						}
					})
				})
			}
			function deleteAble(idx) {
				var testReplyList = M.storage('testReplyList') || []
				
				if (typeof testReplyList === 'string') {
					testReplyList = M.json(testReplyList);
				}

				for (var i=0; i<testReplyList.length; i++) {
					if (testReplyList[i] == idx) {
						return true;
					}
				}
				return false;
			}
		}
	})
}


function process(_min, _max){
	var data, min, max

	if ( getDataType(_min) === 'object' || getDataType(_min) === 'array' ) {
		data = _min;
		return Math.floor(Math.random() * data.length);
	} else {
		min = _min;
		max = _max;
		return Math.floor(Math.random() * (max-min) + min)
	}
}

function getDataType(_value) {
	if (typeof _value === 'string') {
		return 'string';
	}
	if (typeof _value === 'number') {
		return 'number';
	}
	if (_value.constructor === Object) {
		return 'object';
	}
	if (_value.constructor === Array) {
		return 'array';
	}
	if (_value.constructor === Function) {
		return 'function';
	}
	if (_value.constructor === Boolean) {
		return 'boolean';
	}
	return undefined;
}

dataPhoto = [
	'smile1',
	'smile2',
	'smile3',
	'smile4',
	'smile5'
]

dataThum = [
	'myTest0.png',
	'myTest1.png',
	'myTest2.png',
	'myTest3.png',
	'myTest4.png',
	'myTest5.png',
	'myTest6.png',
	'myTest7.png',
	'myTest8.png',
	'myTest9.png',
	'myTest10.png',
	'myTest11.png',
	'myTest12.png',
	'myTest13.png',
	'myTest14.png',
	'myTest15.png',
	'myTest16.png',
	'myTest17.png',
	'myTest18.png',
	'myTest19.png',
	'myTest20.png',
	'myTest21.png',
	'myTest22.png',
	'myTest23.png'
]



// 유니크 저장소 체크하기
function checkUniq(key, value) {
	var storageKey = M.storage(key)
	if (!storageKey) {
		return false;
	}
	if (typeof storageKey === 'string') {
		storageKey = M.json(storageKey);
	}
	for (var i=0; i<storageKey.length; i++) {
		if ( storageKey[i] == value ) {
			return true;
		}
	}
	return false;
}

// 유니크 저장소 설정
function setUniq(key, value) {
	var  storageKey = M.storage(key) || []
		
	if (typeof storageKey === 'string') {
		storageKey = M.json(storageKey);
	}
	storageKey.push(value);
	M.storage(key, M.json(storageKey));
}








