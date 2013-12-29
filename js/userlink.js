
// 댓글
M('#inpReply').on('focus', function(evt, mp){
	M('#inpUser').css('display', 'block')
	M('#inpKasid').css('display', 'block')
})
M('#inpReply').on('blur', function(evt, mp){
	M('#inpUser').css('display', 'none')
	M('#inpKasid').css('display', 'none')
})

M('#inpUser').on('focus', function(evt, mp){
	M('#inpUser').css('display', 'block')
	M('#inpKasid').css('display', 'block')
})
M('#inpUser').on('blur', function(evt, mp){
	M('#inpUser').css('display', 'none')
	M('#inpKasid').css('display', 'none')
})

M('#inpKasid').on('focus', function(evt, mp){
	M('#inpUser').css('display', 'block')
	M('#inpKasid').css('display', 'block')
})
M('#inpKasid').on('blur', function(evt, mp){
	M('#inpUser').css('display', 'none')
	M('#inpKasid').css('display', 'none')
})









