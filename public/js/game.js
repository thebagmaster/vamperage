var games = {};

// var gameschema = {
//   storytellers:{type:'list-string', table:'accts'},
//   characters:{type:'list-string', table:'characters'},
// }

function clearGameForm(){
  $('.gamename').val('');
  $('.gamests,.gamechars')
    .find('option')
    .remove();
}

function savegame(){
  var id = $('.list-group-games .active').attr('uid');
  $.post("/api/game",{func:'savegame',gamedata:formtogd(),id:id},
  function(data, status){
    if(data == 'success'){
      successmsg('.pane-games','Success!','Game saved.');
      initChar(id);
    }
  });
}

function delgame(){
  var id = $('.list-group-games .active').attr('uid');
  $.post("/api/game",{func:'delgame',id:id},
  function(data, status){
    if(data == 'success'){
      successmsg('.pane-games','Success!','Game deleted.');
      initChar();
    }
  });
}

function gdtoform(gd){
  clearGameForm();
  var keys = Object.keys(gd);
  for (var i = 0; i < keys.length; i++) {
    var cur = gd[keys[i]];
    if(cur.constructor === Array){
      for (var j = 0; j < cur.length; j++)
        if(keys[i] == 'storytellers')
            $('.gamests').append('<option>' + cur[j] + '</option>');
        else
            $('.gamechars').append('<option>' + cur[j] + '</option>');
      }else if (keys[i] == 'name'){
      $('.gamename').val(cur);
    }
  }
}

function formtogd(){
  var dic = {};
  dic['name'] = $('.gamename').val();
  dic['sts'] = [];
  $('.gamests').find('option').each(function(){dic['sts'].push($(this).html())});
  dic['chars'] = [];
  $('.gamechars').find('option').each(function(){dic['chars'].push($(this).html())});
  return dic;
}

function newgame(){
  $('.list-group-games').find('a').removeClass('active');
  $('.panel-newgame').slideDown();
  clearGameForm();
}

function initGames(){
  $.post("/api/game",{func:'getgames'},
  function(data, status){
    var id = $('.list-group-games .active').attr('uid');
    games = {};
    $('.list-group-games').empty();
    for(var i=0;i<data.length;i++) {
      games[data[i]['_id']] = data[i];
      $('.list-group-games').append('<a class="list-group-item" uid='
                                              +data[i]['_id']+'>'
                                              +data[i]['name']+'</a>');

      $('.list-group-games a').click(function(e) {
          e.preventDefault();
          var $this = $(this);
          if($this.hasClass('active')){
            $this.parent().find('a').removeClass('active');
            clearGameForm();
            $('.panel-newgame').slideUp();
          }else {
            $this.parent().find('a').removeClass('active');
            $this.addClass('active');
            gdtoform(games[$this.attr('uid')]);
            $('.panel-newgame').slideDown();
          }
      });
      if(id != undefined)
        $('.list-group-chars').children().each(function(i,e){
          var $e = $(e);
          if($e.attr("uid") == id){
            $e.addClass('active');
            gdtoform(chars[id]);
          }
        });
      }
  });
}
