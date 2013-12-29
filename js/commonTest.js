

window.addEventListener('DOMContentLoaded', ready, false);
function ready() {
	//result = "(?:\[이름\])"
	//result = '나의 [이름]님은 [항목5]'
	result = '나의<b><c><d> 님은'
	//p = new RegExp(string, 'gim');
	//rst = string.match(p);
	/*permision = (/\[이름\]/gi).test(result) ? true : 	false
	permision = (/\[항목1\]/gi).test(result) ? true : false
	permision = (/\[항목2\]/gi).test(result) ? true : false
	permision = (/\[항목3\]/gi).test(result) ? true : false
	permision = (/\[항목4\]/gi).test(result) ? true : false
	permision = (/\[항목5\]/gi).test(result) ? true : false*/
	//permision = (/\.|[항목[1-5]\]/gi).test(result) ? true : false			
	permision = result.replace(/<[bc]+>/gi, 'ㅌ')
	//console.log(permision)
}

















