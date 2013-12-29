var  pollList = M.storage('pollList') || []
	,testReplyList = M.storage('testReplyList') || []
	,cuTest
	,apiurl = 'http://gaeyou.com/api/'
	,testData = {}
	
	// 인기테스트 불러오기
//	,getOrder = process(0, 4)
	,hotStart = 0
	,hotTotal = 5
	
	// 댓글 더보기
	,replyStart = 0
	,replyTotal = 15
	
	// 신규테스트 불러오기
	,newStart = 0
	,newTotal = 20

	
window.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('hashchange', function() {
	location.reload();
	M.scroll(0);
}, false);

function ready() {
	
	
	
	
	// 다른 테스트 리스트 전문통신
	bodyData = {
		//'total': newTotal,
		//'start': newStart
	}
	$.ajax({
		 'url': apiurl + 'test_auto.php'
		,'contentType': 'application/x-www-form-urlencoded'
		,'data': bodyData
		,'type': 'POST'
		,'success': function(result){
			var  str = ''
				,result = M.json(result);
			
			
			//return false;
			
			
			
			for (var i=0; i<result.length; i++) {
			//for (var i=0; i<2; i++) {
				console.log(result[i]['idx'], decodeURIComponent(result[i]['title']) )
				
				bodyData = {
					'title': decodeURIComponent(result[i]['title']),
					'idx': result[i]['idx']
				}
				$.ajax({
					 'url': '../api/test_make_thum.php'
					,'contentType': 'application/x-www-form-urlencoded'
					,'data': bodyData
					,'type': 'POST'
					,'success': function(result){
						console.log(result)
						//alert('테스트가 등록되었습니다.');
						//window.location.href = 'http://gaeyou.com/t/#' + result.result;
					}
				})
			}
			
			
			// 썸네일 만들기
				
			
			
		}
	})
	
	
	
	
}






