window.addEventListener("DOMContentLoaded",ready,!1);
function ready(){var a=2,f=M.storage("rankAddList")||[],l=process(sampleData);M.storage("uname")&&M("#uname").val(M.storage("uname"));M.storage("kasid")&&M("#kasid").val(M.storage("kasid"));M("#btnAdd").on("click",function(e,c){if(9===a)return alert("\ub354 \uc774\uc0c1 \uc785\ub825\ud560\uc218 \uc5c6\uc2b5\ub2c8\ub2e4."),!1;a++;var b="";n=a+1;M("#pcontent").append("div",{className:"plist","data-b":a});b=b+'<div class="inner_item">'+('\t<span class="txt_g"><input type="text" placeholder="'+n+'\ubc88 \ubcf4\uae30\ub97c \uc785\ub825\ud558\uc138\uc694." data-list="'+
a+'" maxlength="30"></span>');b+="</div>";M('[data-b="'+a+'"]').html(b)});M("#btnDel").on("click",function(e,c){if(1===a)return alert("\ucd5c\uc18c 2\uac1c\uc774\uc0c1 \uc785\ub825\ud574\uc57c \ud569\ub2c8\ub2e4."),!1;M('[data-b="'+a+'"]').remove();a--});M("#qst").on("focus",function(a,c){c.hasClass("place")&&c.html("").removeClass("place")}).on("keyup",function(a,c){var b=c.html();100<=b.length&&(alert("100\uc790 \uc774\uc0c1 \uc785\ub825\ud560\uc218 \uc5c6\uc2b5\ub2c8\ub2e4."),c.html(b.substr(0,
99)))}).html(sampleData[l].question);M("#title").on("focus",function(a,c){M("#qst").hasClass("place")&&M("#qst").html("").removeClass("place")}).attr("placeholder",sampleData[l].title);M("#btnReg").on("click",function(){var e,c=M("#title").val(),b=M("#qst").html(),h=M("#uname").val();e=M("#kasid").val();var k=[];if(""===c)return alert("\uc81c\ubaa9\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694."),M("#title").focus(),!1;if("(\ud544\uc218) \uc774\uacf3\uc5d0 \uc9c8\ubb38\uc744 \uc785\ub825\ud558\uc138\uc694."===
b)return alert("\uc0c1\uc138 \uc9c8\ubb38\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694."),M("#qst").html(""),M("#qst").focus(),!1;if(""===b)return alert("\uc0c1\uc138 \uc9c8\ubb38\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694."),M("#qst").focus(),!1;if(""===h)return alert("\ub2c9\ub124\uc784\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694."),M("#uname").focus(),!1;for(var g=0;g<a+1;g++){if(""===M('[data-list="'+g+'"]').val())return n=g+1,alert(n+"\ubc88\uc9f8 \ub9ac\uc2a4\ud2b8\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694."),
!1;k.push(encodeURIComponent(M('[data-list="'+g+'"]').val()))}M.storage("uname",h);M.storage("kasid",e);e={title:encodeURIComponent(c),question:encodeURIComponent(b),uname:encodeURIComponent(h),kasid:encodeURIComponent(e),lists:k};$.ajax({url:"http://gaeyou.com/api/rank_question_add.php",contentType:"application/x-www-form-urlencoded",data:e,type:"POST",success:function(a){a=M.json(a);addid=a.result;"string"===typeof f&&(f=M.json(f));f.push(addid);M.storage("rankAddList",M.json(f));if(confirm("\ub7ad\ud0b9\uc744 \ub4f1\ub85d\ud588\uc2b5\ub2c8\ub2e4. \uce5c\uad6c\ub4e4\uc5d0\uac8c \uc54c\ub9b4\uae4c\uc694?")){var d;
d=""+("["+c+"]\n");d+=b+"\n\n";for(var e=0;e<k.length;e++)n=e+1,d+=n+". "+decodeURIComponent(k[e])+"\n";d+="\n\u265a "+decodeURIComponent(h)+"\ub2d8\uc774 \ub7ad\ud0b9\uc744 \ub4f1\ub85d\ud588\uc5b4\uc694~\n";d+="\ub7ad\ud0b9\uc5d0 \ucc38\uc5ec\ud574\ubcf4\uc138\uc694.\n\n\u265e \ud22c\ud45c\ud558\ub7ec \uac00\uae30\n";d+="http://gaeyou.com/r/#"+a.result;console.log(d);urlinfo={title:c,desc:b,imageurl:["http://www.gaeyou.com/images/thum/rank.png"],type:"article"};kakao.link("story").send({appid:"gaeyou",
appver:"1.0",appname:"\u2605\uae68\uc54c\uc720\uba38\u2605\ub97c \uac80\uc0c9\ud558\uc138\uc694!!",post:d,urlinfo:M.json(urlinfo)})}window.location.href="http://gaeyou.com/r/#"+addid}})});M("#btnCancel").on("click",function(){window.history.go(-1)})}function process(a,f){return"object"===getDataType(a)||"array"===getDataType(a)?Math.floor(Math.random()*a.length):Math.floor(Math.random()*(f-a)+a)}
function getDataType(a){if("string"===typeof a)return"string";if("number"===typeof a)return"number";if(a.constructor===Object)return"object";if(a.constructor===Array)return"array";if(a.constructor===Function)return"function";if(a.constructor===Boolean)return"boolean"}
sampleData=[{title:"(\uc608) \uc81c\uc77c \uc88b\uc544\ud558\ub294 \uad70\uac83\uc9c8\uc740?",question:"(\uc608) \uc81c\uc77c \uc88b\uc544\ud558\ub294 \uc57c\uc2dd \uad70\uac83\uc9c8\uc740 \ubb54\uac00\uc694?"},{title:"(\uc608) \uc81c\uc77c \uc2eb\uc5b4\ud558\ub294 \uacfc\ubaa9\uc740?",question:"(\uc608) \uc81c\uc77c \uc2eb\uc5b4\ud558\ub294 \uacfc\ubaa9\uc740 \ubb50\uc5d0\uc694?"},{title:"(\uc608) \uc81c\uc77c \uac00\ubcf4\uace0 \uc2f6\uc740 \ub098\ub77c\ub294?",question:"(\uc608) \uc81c\uc77c \uac00\ubcf4\uace0 \uc2f6\uc740 \ub098\ub77c\ub294 \uc5b4\ub514\uc5d0\uc694?"},
{title:"(\uc608) \uc778\ud53c\ub2c8\ud2b8\uc5d0\uc11c \uc81c\uc77c \uc88b\uc544\ud558\ub294 \uba64\ubc84\ub294?",question:"(\uc608) \uc778\ud53c\ub2c8\ud2b8\uba64\ubc84\uc911\uc5d0 \uc81c\uc77c \uc798 \uc0dd\uae34 \uba64\ubc84\ub294 \ub204\uad6c\uc5d0\uc694?"},{title:"(\uc608) B1A4\uc5d0\uc11c \uc81c\uc77c \uc88b\uc544\ud558\ub294 \uba64\ubc84\ub294?",question:"(\uc608) B1A4 \uba64\ubc84\uc911\uc5d0 \uc81c\uc77c \uadc0\uc5ec\uc6b4 \uba64\ubc84\ub294 \ub204\uad6c\uc5d0\uc694?"},{title:"(\uc608) \uc18c\ub140\uc2dc\ub300\uc5d0\uc11c \uc81c\uc77c \uc88b\uc544\ud558\ub294 \uba64\ubc84\ub294?",
question:"(\uc608) \uc18c\ub140\uc2dc\ub300 \uba64\ubc84\uc911\uc5d0 \uc81c\uc77c \uc608\uc05c \uba64\ubc84\ub294 \ub204\uad6c\uc5d0\uc694?"},{title:"(\uc608) \uccab \ub208\uc624\uba74 \ud574\ubcf4\uace0 \uc2f6\uc740\uac83?",question:"(\uc608) \uc62c\ud574 \uccab\ub208\uc5d0 \uc624\uba74 \uaf2d \ud574\ubcf4\uace0 \uc2f6\uc740\uac74 \ubb50\uc5d0\uc694?"},{title:"(\uc608) \uc560\uc778\uc774\ub791 \uac00\ubcf4\uace0 \uc2f6\uc740 \uacf3\uc740?",question:"(\uc608) \uc560\uc778\uc774 \uc0dd\uae30\uba74 \uc81c\uc77c \ucc98\uc74c\uc73c\ub85c \uac00\ubcf4\uace0 \uc2f6\uc740\uacf3\uc740 \uc5b4\ub514\uc5d0\uc694?"},
{title:"(\uc608) \ud558\ubcf5\uc774 \uc88b\uc544, \ub3d9\ubcf5\uc774 \uc88b\uc544?",question:"(\uc608) \ud558\ubcf5\uc774 \uc88b\uc544\uc694? \ub3d9\ubcf5\uc774 \uc88b\uc559\uc694?"},{title:"(\uc608) \uc81c\uc77c \uc88b\uc544\ud558\ub294 \ubaa8\ubc14\uc77c \uac8c\uc784\uc740?",question:"(\uc608) \uc694\uc998 \uc81c\uc77c \uc7ac\ubbf8\uc788\ub294 \ubaa8\ubc14\uc77c \uac8c\uc784\uc740?"},{title:"(\uc608) \uc81c\uc77c \uc88b\uc544\ud558\ub294 \ub864\ucc54\ud53c\uc5b8\uc740?",question:"(\uc608) \ucd5c\uac15 \ub864\ucc54\ud53c\uc5b8\uc740 \ubb54\uac00\uc694?"},
{title:"(\uc608) \uc801\ub2f9\ud55c \ud558\ub8e8 \uac8c\uc784\uc2dc\uac04?",question:"(\uc608) \ud558\ub8e8\uc5d0 \uba87\uc2dc\uac04 \uac8c\uc784\ud558\ub294\uac8c \uc801\ub2f9\ud558\ub2e4\uace0 \uc0dd\uac01\ud574\uc694?"},{title:"(\uc608) \uc694\uc998 \ub300\uc138 \uc544\uc774\ub3cc\uc740?",question:"(\uc608) \uc694\uc998 \ub300\uc138 \uc544\uc774\ub3cc\uc740 \ub204\uad6c\ub77c\uace0 \uc0dd\uac01\ud558\uc138\uc694?"},{title:"(\uc608) \uba85\ub3d9?, \ud64d\ub300?",question:"(\uc608) \uba85\ub3d9\uc774 \uc88b\uc544\uc694? \ud64d\ub300\uac00 \uc88b\uc544\uc694?"},
{title:"(\uc608) \ub2f9\uc2e0\uc758 \uc885\uad50\ub294?",question:"(\uc608) \ub2f9\uc2e0\uc758 \uc885\uad50\ub294 \ubb54\uac00\uc694?"},{title:"(\uc608) \ub098\uc758 \uccab\uc778\uc0c1\uc740?",question:"(\uc608) \ub2e4\ub978 \uc0ac\ub78c\ub4e4\uc774 \uc0dd\uac01\ud588\uc744\ub54c \ub098\uc758 \uccab\uc778\uc0c1\uc740 \ubb54\uac00\uc694?"},{title:"(\uc608) \uc81c\uc77c \uc9dc\uc99d\ub098\ub294 \uc2a4\ud0c0\uc77c",question:"(\uc608) \uc81c\uc77c \uc9dc\uc99d\ub098\ub294 \uc2a4\ud0c0\uc77c\uc758 \uc0ac\ub78c\uc740 \ub204\uad6c\uc778\uac00\uc694?"}];