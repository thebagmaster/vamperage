var selectedColor = 1;
var n2c = {
    1:'aqua',
    2:'blue',
    3:'brown',
    4:'green',
    5:'red',
    6:'white',
    7:'purple',
    8:'yellow',
    9:'megenta',
    10:'black'
};

var c2n = {
    'aqua':1,
    'blue':2,
    'brown':3,
    'green':4,
    'red':5,
    'white':6,
    'purple':7,
    'yellow':8,
    'megenta':9,
    'black':10
};




function myfunction(){
    var test = document.getElementById("testtext").value;
    var box = document.getElementById("textbox3");
    box.value = test;
    player.loadVideoById(test , 0, "large");
    console.log(playerdata);
    var vidname = playerdata['title'];
    $.post("/carter", { url: test, name: vidname}, function(data, status){console.log(data)});
}


function myfunction2(){
    var test = document.getElementById("querytext").value;
    var box = document.getElementById("textbox3");
    $.post("/dbrequest", { url: test}, function(data, status){
	console.log(data);
	var name = data[0]['name'];
	box.value = name;
    });
}


$( document ).ready(function(){    
    var yloc = 1;
    var xloc = 1;
    $('body').append("<div id=pixelgrid style='position:relative;'></div>");
    for(var x = 1; x < 10001; x++){    
	$('#pixelgrid').append("<div class= 'unit unit-red' id=x" + xloc + "y" + yloc + " color=0  onclick= changeColor(this);"+
			       " style='position:absolute;top:"+(yloc*10)+"px;left:"+(xloc*10)+"px;'></div>");
	xloc++;
	if(x % 100 == 0){
	    yloc++;
	    xloc = 1;
	}
	
	$.post("/dbrequest", {id:'x' + xloc +'y'+ yloc, todo: 'get'}, function(data, status){
	    console.log("data");
	    var color = data['color'];
	    $('#x'+ xloc + 'y' + yloc).attr('class', 'unit unit-'+c2n[color]);
	});	
    }
    
    $('body').append("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>");    
});

function pickSelectedColor(pixel){
    selectedColor = pixel.getAttribute('color');
    console.log(selectedColor);
}

function changeColor(pixel){
    console.log("went into change color");
    console.log(selectedColor);
    pixel.className = 'unit unit-'+n2c[selectedColor];
    
    var cordid = pixel.getAttribute('id');
    console.log(cordid);
    $.post("/dbrequest", { id: cordid, color: selectedColor, todo: 'store'}, function(data, status){
	console.log(data);
    });

	
}


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var playerdata;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
	height: '390',
	width: '640',
	videoId: 'M7lc1UVf-VE',
	events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	}
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}


// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
	done = true;
	playerdata = player.getVideoData();
    }   
}
function stopVideo() {
    player.stopVideo();
}


