
window.addEventListener('DOMContentLoaded', ready, false);

function ready() {
	M('#btnlogin').on('click', function(){
		var  uid = M('#uid').val()
			,upw = M('#upw').val()
		if (uid === 'romeoh' && upw === 'love78') {
			M.storage('admin', 'romeoh');
		}
	})
	M('#btnlogout').on('click', function(){
		M.storage('admin', '');
	})
}







