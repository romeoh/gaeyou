var  code = 'novel'
	,hash
	,cuData = {}
	,novelComp = M.storage('novel_comp') || '{}'

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
	
	hash = getHash();
	novelComp = M.json(novelComp);
	
	M('#btnDetail').on('click', function(evt, mp){
		if (M('#storyBox').hasClass('close')) {
			M('#storyBox').removeClass('close');
			M('#btnDetail').html('<i class="fa fa-chevron-circle-up"></i> 닫기')
		} else {
			M('#storyBox').addClass('close')
			M('#btnDetail').html('<i class="fa fa-chevron-circle-down"></i> 더보기')
		}
	})
	
	// 썰 전문통신
	databody = {
		'idx': hash
	}
	request(code+'_get', databody, function(result){
		var  result = M.json(result)
			,str = ''
			,novelStr = ''
		
		cuData['idx'] = hash = result.idx;
		cuData['author'] = decodeURIComponent(result.author);
		cuData['kasid'] = decodeURIComponent(result.kasid);
		cuData['title'] = decodeURIComponent(result.title);
		cuData['mode'] = decodeURIComponent(result.mode);
		cuData['genre'] = decodeURIComponent(result.genre);
		cuData['first_fic'] = decodeURIComponent(result.first_fic);
		cuData['reply'] = result.reply;
		cuData['good'] = result.good;
		cuData['fic_count'] = result.fic_count;
		cuData['view'] = result.view;
		cuData['regDate'] = result.regDate;
		cuData['charactor'] = [];
		
		for (var i=0; i<result.charactor.length; i++) {
			var  chara = {}
				,n = i+1
				
			chara['name'] = decodeURIComponent( result.charactor[i]['name'] );
			chara['age'] = decodeURIComponent( result.charactor[i]['age'] );
			chara['sex'] = decodeURIComponent( result.charactor[i]['sex'] );
			chara['job'] = decodeURIComponent( result.charactor[i]['job'] );
			chara['point'] = decodeURIComponent( result.charactor[i]['point'] );
			cuData['charactor'].push(chara);
			
			str += '<dt><i class="fa fa-male"></i> 등장인물' + n + '</dt>';
			str += '<dd><span>이름:</span> ' + cuData['charactor'][i]['name'] + '</dd>';
			if (cuData['charactor'][i]['age']) {
				str += '<dd><span>나이:</span> ' + cuData['charactor'][i]['age'] + '</dd>';
			}
			if (cuData['charactor'][i]['sex']) {
				str += '<dd><span>성별:</span> ' + cuData['charactor'][i]['sex'] + '</dd>';
			}
			if (cuData['charactor'][i]['job']) {
				str += '<dd><span>직업:</span> ' + cuData['charactor'][i]['job'] + '</dd>';
			}
			if (cuData['charactor'][i]['point']) {
				str += '<dd><span>특징:</span> ' + cuData['charactor'][i]['point'] + '</dd>';
			}
		}
		if (cuData['mode'] == 'public') {
			M('#writeBook').css('display', 'block')
			M('#mode').html('<i class="fa fa-check"></i> 모드: 모두쓰기');
		} else {
			if (getPrivate(cuData['idx'])) {
				M('#writeBook').css('display', 'block');
				M('#writeTitle').html('<i class="fa fa-lock"></i> 썰픽션을 전개 해보세요.')
			}
			M('#mode').html('<i class="fa fa-check"></i> 모드: 혼자쓰기');
		}
		
		M('#fictitle').html('<a href="./list.html">' + cuData['title'] + '</a>');
		M('#title').html('<i class="fa fa-check"></i> 제목: ' + cuData['title']);
		M('#genre').html('<i class="fa fa-check"></i> 장르: ' + cuData['genre']);
		M('#author').html('<i class="fa fa-check"></i> 개설: ' + cuData['author']);
		M('#replyTitle').html('<i class="fa fa-smile-o"></i> ' + cuData['reply'] + '개의 댓글이 있습니다. ');
		M('#charactor').html(str);
		M('#btnGoReply').attr('href', './reply.html#'+cuData['idx']);
		
		novelStr += '<div class="para">';
		novelStr += '	<div class="author">도입부</div>';
		novelStr += '	<p>' + cuData['first_fic'].replace(/\n/g, '<br>') + '</p>';
		novelStr += '</div>';
		novelStr += '<div class="data" id="novel">';
		novelStr += '</div>';

		M('#novelBook').html(novelStr);
		
		// 썰픽 가져오기
		getFiction();
		initView();
	})
	
	// 썰픽쓰기
	initWriteFiction();
}


// 썰픽 가져오기 전문
function getFiction() {
	// 썰 전문통신
	databody = {
		'idx': hash
	}
	request(code+'_fictions_get', databody, function(result){
		var  result = M.json(result)
			,str = ''
			,fiction = cuData['first_fic'] + '\n\n'
		
		for (var i=0; i<result.length; i++) {
			str += '<div class="para">';
			str += '	<div class="author">';
			str += '		<span>' + decodeURIComponent(result[i]['author']) + '</span> 님의 썰 ';
			if (getComp(result[i]['idx'])) {
				str += '	<i class="fa fa-trash-o" data-del="' + result[i]['idx'] + '"></i>';
			}
			str += '	</div>';
			str += '	<p>' + decodeURIComponent(result[i]['text']).replace(/\n/g, '<br>') + '</p>';
			str += '</div>';
			fiction += decodeURIComponent(result[i]['text']) + '\n\n';
		}
		cuData['fiction'] = fiction
		M('#novel').html(str);
		M('[data-del]').on('click', function(evt, mp){
			if(!confirm('테스트를 정말 삭제하시겠습니까?')) {
				return false;
			}
			var idx = mp.data('del')
			bodyData = {
				'idx': idx,
				'novelIdx': cuData['idx'],
				'ua': navigator.userAgent,
				'url': window.location.href
			}
			$.ajax({
				 'url': apiurl + code + '_del.php'
				,'contentType': 'application/x-www-form-urlencoded'
				,'data': bodyData
				,'type': 'POST'
				,'success': function(result){
					var  result = M.json(result)
						,popList = []
						,comps = novelComp[cuData['idx']]
						
					for (i in comps) {
						if (result['id'] != comps[i]) {
							popList.push(comps[i]);
						}
					}
					novelComp[cuData['idx']] = popList;
					M.storage('novel_comp', M.json(novelComp));
					window.location.reload();
				}
			})
		})
	})
}

// 조회수 올리기
function initView() {
	// 조회수 업데이트
	if ( !checkUniq(code + '_view', cuData['idx']) ) {
		bodyData = {
			'idx': cuData['idx'],
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
				
				setUniq(code + '_view', cuData['idx']);
				//M('#viewCount').html(result['total']);
			}
		})
	}
}


// 썰픽쓰기 전문
function initWriteFiction() {
	M('#fcontent').on('focus', function(evt, mp){
		if (!getAd()) {
			alert('이 썰을 한번 홍보해주셔야 썰픽을 쓸수 있습니다.');
			M('#fcontent').blur();
			M('#adinfo').css('display', 'block');
			M.scroll( M.scroll().y + 320 )
			return false;
		}
		if (mp.hasClass('place')) {
			mp.removeClass('place');
			mp.val('');
		}
	})
	M('#fcontent').on('blur', function(evt, mp){
		if (mp.val() == '') {
			mp.addClass('place');
			mp.val('심각한 욕설, 너무 선정적인 내용은 자제 부탁드려요.');
		}
	})
	M('#fcontent').on('keyup', function(evt, mp){
		M('#ficleng').html(mp.val().length+'/1000')
	})
	M('#btnReg').on('click', function(evt, mp){
		if (!getAd()) {
			alert('이 썰을 한번 홍보해주셔야 썰픽을 쓸수 있습니다.');
			M('#fcontent').blur();
			M('#adinfo').css('display', 'block')
			return false;
		}
		if (M('#fauthor').val() == '') {
			alert('필명을 입려하세요.');
			M('#fauthor').focus();
			return false;
		}
		if (M('#fcontent').hasClass('place')) {
			alert('썰픽을 적어주세요.');
			M('#fcontent').focus();
			return false;
		}
		databody = {
			'idx': cuData['idx'],
			'author': encodeURIComponent(M('#fauthor').val()),
			'kasid': '',
			'content': encodeURIComponent(M('#fcontent').val()),
			'ua': navigator.userAgent,
			'url': window.location.href
		}
		request(code+'_fiction_add', databody, function(result){
			var  result = M.json(result)
				,fic_count = M.storage(code+'_count') || 0
			fic_count = Number(fic_count) + Number(1);
			M.storage(code+'_count', fic_count);
			
			if (setComp(result['result']) ) {
				window.location.reload();
			}
		})
	})
}

function action(_data) {
	var  data = _data || {}
		,media = data.media || 'story'
		,post = ''
		,twit = ''
	
	if (!getAd()) {
		setUniq(code + '_ad', cuData['idx']);
	}
	
	data.title = cuData['title'];
	data.app = '썰픽: 함께 쓰는 소셜픽션';
	data.url = 'http://gaeyou.com/novel/#'+cuData['idx'];

	if (media == 'talk') {
		shareData(data);
		return false;
	}
	
	post += '🎩 썰픽: 함께 쓰는 소셜픽션\n';
	post += '────────────────────\n'
	post += '[' + data.title + ']\n\n';
	post += cuData['fiction']+'';
	data.post = post;
	
	data.desc = '모두가 함께 쓰는 썰픽\n함께 써봐요~';
	data.app = '썰픽: 함께 쓰는 소셜픽션';
	data.img = 'http://gaeyou.com/upload/novel/'+cuData['idx']+'.png';

	shareData(data);
}

function getAd() {
	var adList = M.storage(code + '_ad') || '[]'
	adList = M.json(adList)
	
	for (var i in adList) {
		if (adList[i] == cuData['idx']) {
			return true;
		}
	}
	return true;
	//return false;
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

function getComp(idx) {
	compList = novelComp[cuData['idx']];
	for (i in compList) {
		if (compList[i] == idx) {
			return true;
		}
	}
	return false;
}

function getPrivate(idx) {
	var private = M.storage(code) || [];
	private = M.json(private);
	for (i in private) {
		if (private[i] == idx) {
			return true;
		}
	}
	return false;
}

function setComp(idx) {
	var complist = novelComp[cuData['idx']] || []
	complist.push(idx);
	novelComp[cuData['idx']] = complist;
	M.storage('novel_comp', M.json(novelComp));
	return true;
}





