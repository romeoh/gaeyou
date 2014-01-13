var  code = 'novel_reply'
	,cuData = {}
	,hash
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 15

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
	
	// 썰 전문통신
	databody = {
		'idx': hash
	}
	request(code+'_get_all', databody, function(result){
		//console.log(result) 
		var  result = M.json(result)
			,str = ''
			,rstr = ''
			
		//console.log(result)
		cuData['idx'] = hash = result.idx;
		cuData['author'] = decodeURIComponent(result.author);
		cuData['kasid'] = decodeURIComponent(result.kasid);
		cuData['title'] = decodeURIComponent(result.title);
		cuData['genre'] = decodeURIComponent(result.genre);
		cuData['first_fic'] = decodeURIComponent(result.first_fic);
		cuData['reply'] = result.reply;
		cuData['good'] = result.good;
		cuData['fic_count'] = result.fic_count;
		cuData['view'] = result.view;
		cuData['regDate'] = result.regDate;
		cuData['charactor'] = [];
		cuData['replyList'] = [];

		// 등장인물
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
			str += '<dd>이름: ' + cuData['charactor'][i]['name'] + '</dd>';
			str += '<dd>나이: ' + cuData['charactor'][i]['age'] + '</dd>';
			str += '<dd>성별: ' + cuData['charactor'][i]['sex'] + '</dd>';
			str += '<dd>직업: ' + cuData['charactor'][i]['job'] + '</dd>';
			str += '<dd>특징: ' + cuData['charactor'][i]['point'] + '</dd>';
		}
		M('#fictitle').html('<a href="./#' + cuData['idx'] + '">' + cuData['title'] + '</a>');
		M('#title').html('<i class="fa fa-check"></i> 제목: ' + cuData['title']);
		M('#genre').html('<i class="fa fa-check"></i> 장르: ' + cuData['genre']);
		M('#author').html('<i class="fa fa-check"></i> 개설: ' + cuData['author']);
		M('#charactor').html(str);
		
		// 댓글가져오기
		if (result.replyList.length == 0) {
			rstr += '<li>';
			rstr += '	<p class="no_reply"><i class="fa fa-pencil"></i> 제일 먼저 댓글을 작성해 보세요.</p>';
			rstr += '</li>';
		} else {
			for (var i=0; i<result.replyList.length; i++) {
				var  replys = {}
					,deleteAble = checkUniq(code + '_list', result.replyList[i]['idx'])
					//,n = i+1
				replys['uname'] = decodeURIComponent( result.replyList[i]['uname'] );
				replys['kasid'] = decodeURIComponent( result.replyList[i]['kasid'] );
				replys['text'] = decodeURIComponent( result.replyList[i]['text'] );
				replys['idx'] = decodeURIComponent( result.replyList[i]['idx'] );
				replys['regDate'] = result.replyList[i]['regDate'];
				cuData['replyList'].push(replys);
				rstr += '<li>';
				rstr += '	<div class="reply_info">';
				rstr += '		<span>' + replys['uname'] + '</span>';
				rstr += '		<span> | ' + M.dynamicDate(replys['regDate']) + '</span>';
				if (deleteAble) {
					rstr += '		<span> | <i class="fa fa-trash-o" data-del="' + replys['idx'] + '"></i></span>';
				}
				rstr += '	</div>';
				rstr += '	<p>' + replys['text'] + '</p>';
				rstr += '</li>';
				
			}	
		}
		
		M('#reply_con').html(rstr);
		M('#replyTitle').html('<i class="fa fa-smile-o"></i> 댓글 <span>(' + cuData['reply'] + '개)</span>')
		M('#btnBack').attr('href', './#' + cuData['idx'])
		
		// 삭제하기
		if (deleteAble) {
			M('[data-del]').on('click', function(evt, mp){
				if(!confirm('정말 삭제하시겠습니까?')) {
					return false;
				}
				id = mp.data('del');
				
				bodyData = {
					'idx': id,
					'novelIdx': cuData['idx'],
					'ua': navigator.userAgent
				}
				$.ajax({
					 'url': apiurl + code + '_del.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						var result = M.json(result)
							test = M.json(M.storage(code + '_list'))
							popList = []
							
						for (var i=0; i<test.length; i++) {
							if (result['id'] != test[i]) {
								popList.push(test[i]);
							}
						}
						M.storage(code + '_list', M.json(popList));
						window.location.reload();
					}
				})
			})
		}
			
		initWriteReply();
	})
	
	
	M('#btnDetail').on('click', function(evt, mp){
		if (M('#storyBox').hasClass('close')) {
			M('#storyBox').removeClass('close');
			M('#btnDetail').html('<i class="fa fa-chevron-circle-up"></i> 닫기')
		} else {
			M('#storyBox').addClass('close')
			M('#btnDetail').html('<i class="fa fa-chevron-circle-down"></i> 더보기')
		}
	})
}

function action(_data) {
	var  data = _data || {}
		,media = data.media || 'story'
		,post = ''
		,twit = ''
	
	data.title = cuData['title'];
	data.app = '썰픽: 함께 쓰는 소셜픽션';
	data.url = 'http://gaeyou.com/novel/reply.html#'+cuData['idx'];

	if (media == 'talk') {
		shareData(data);
		return false;
	}
	
	post += '🎩 썰픽: 함께 쓰는 소셜픽션\n';
	post += '────────────────────\n'
	post += '[' + data.title + ']\n\n';
	post += cuData['first_fic']+'';
	data.post = post;
	
	data.desc = '모두가 함께 쓰는 썰픽\n함께 써봐요~';
	data.app = '썰픽: 함께 쓰는 소셜픽션';
	data.img = 'http://gaeyou.com/upload/novel/'+cuData['idx']+'.png';

	shareData(data);
}

// 댓글쓰기 전문
function initWriteReply() {
	M('#fcontent').on('focus', function(evt, mp){
		if (mp.hasClass('place')) {
			mp.removeClass('place');
			mp.val('');
		}
	})
	M('#fcontent').on('blur', function(evt, mp){
		if (mp.val() == '') {
			mp.addClass('place');
			mp.val('심각한 욕설, 선정적인 표현은 삭제될 수 있습니다.');
		}
	})
	M('#fcontent').on('keyup', function(evt, mp){
		M('#ficleng').html(mp.val().length+'/1000')
	})
	M('#btnReg').on('click', function(evt, mp){
		if (M('#fauthor').val() == '') {
			alert('닉네임을 입려하세요.');
			M('#fauthor').focus();
			return false;
		}
		if (M('#fcontent').hasClass('place')) {
			alert('댓글을 입력해 주세요.');
			M('#fcontent').focus();
			return false;
		}
		databody = {
			'idx': cuData['idx'],
			'uname': encodeURIComponent(M('#fauthor').val()),
			'kasid': '',
			'text': encodeURIComponent(M('#fcontent').val()),
			'ua': navigator.userAgent,
			'url': window.location.href
		}
		request(code+'_add', databody, function(result){
			var  result = M.json(result)
				,key = code + '_list'
			
			setUniq(key, result['id']);
			window.location.reload();
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












