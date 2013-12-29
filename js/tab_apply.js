var  totalLength = '-1'
	,code = 'tab'
	,school

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	
	/*if (!admin) {
		alert('서비스 점검중입니다.');
		window.location.href = '/t/';
		return false;
	}*/
	
	initSchool();
	
	// 유효성 검사
	M('#btnReg').on('click', function(){
		if (school['idx'] === '') {
			alert('등록된 학교가 없습니다.');
			return false;
		}
		window.location.href = './'
	})
	
	M('#btnCancel').on('click', function(){
		window.history.go(-1);
	})	
}


function initSchool() {
	school = M.storage(code + '_school');
	if (school == null) {
		// 저장된 학교가 없음
		school = {
			'idx': '',
			'title': '',
			'school': '',
			'flag': '-1',
			'address': ''
		}
		school = M.json(school);
		M.storage(code + '_school', school);
	}
	
	school = M.json(school);
	// 저장된 학교가 있음
	M('#school').val(school['flag']);
	M('[data-keyword]').val(school['title']);
	
	// 학교 검색
	M('[data-search]').on('click', function(evt, mp){
		var  keyword = M('[data-keyword]').val()
			,flag = M('#school').val()
			
		if (flag == '-1') {
			alert('학교를 선택하세요.');
			return;
		}
		if (keyword == '') {
			alert('학교이름을 입력하세요.');
			return;
		}
		
		// 학교검색
		var databody = {
			'keyword': keyword,
			'cate': flag
		}
		request(code+'_search', databody, function(result){
			var  result = M.json(result)
				,str = ''
			if (result.length == 0) {
				str += '<ul class="result" >'
				str += '	<li>검색된 ' + getSchoolLevel(flag) + ' 결과가 없습니다.</li>'
				str += '</ul>'
			} else {
				str += '<ul class="result" >'
				for (var i=0; i<result.length; i++) {
					if (result[i]['idx'] == school['idx']) {
						txt = '선택되었습니다.';
					} else {
						txt = '선택';
					}
					str += '<li>'
					str += '	<span class="title">' + result[i]['title'] + '</span>'
					str += '	<p>(' + result[i]['address'] + ')</p>'
					str += '	<button data-idx="' + result[i]['idx'] + '" data-title="' + result[i]['title'] + '" data-cate="' + result[i]['cate'] + '" data-address="' + result[i]['address'] + '" data-school="' + getSchoolLevel(result[i]['cate']) + '">' + txt + '</button>'
					str += '</li>'
				}
				str += '</ul>'
			}
			M('[data-result]').html(str);
			
			M('[data-school]').on('click', function(evt, mp){
				if (mp.data('idx') == school['idx']) {
					alert('이미 ' + school['title'] + '입니다.')
					return false;
				}
				M('[data-school]').text('선택');
				mp.text('선택되었습니다.');
				
				var databody = {
					'old': school['idx'],
					'last': mp.data('idx')
				}
				request(code+'_add_member', databody, function(result){
					//console.log(result)
				})
				
				school = {
					'idx': mp.data('idx'),
					'title': mp.data('title'),
					'school': mp.data('school'),
					'flag': mp.data('cate'),
					'address': mp.data('address'),
				}
				school = M.json(school);
				M.storage(code + '_school', school);
				school = M.json(school);
			})
		})
		
	});
}


function getSchoolLevel(level) {
	if (level == 0) {
		return '초등학교';
	}
	if (level == 1) {
		return '중학교';
	}
	if (level == 2) {
		return '고등학교';
	}
	if (level == 3) {
		return '대학교';
	}
}

function request(tr, data, callback) {
	$.ajax({
		 'url': apiurl + tr + '.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': data
		,'type': 'POST'
		,'success': function(result){
			eval(callback)(result);
		}
	})
}




















