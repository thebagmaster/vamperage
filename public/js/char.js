var chars = {};

function bubbleint(i){
  this.level = i;
  this.toBubbles = function(){
    var s = "";
    for(var i = 0; i < this.level; i++)
      s+="o";
    return s;
  }
}

function level(i){
  this.level = i;
}

function cost(i){
  this.cost = i;
}

function levelcost(i,c){
  this.level = new level(i);
  this.cost = new cost(i);
}

function xp_entry(c,i,r){
  this.change = c;
  this.changetable = "xp_mods";
  this.num = i;
  this.date = new Date();
  this.reason = r;
  this.reasontable = "xp_reason";
}

var cats={'id':'Identity','xp':'Experience','traits':'Traits','general':'General','specifics':'Specifics'};

var generic = {
  name:{iname:'Name',type:'string', table:'none', cat:'id'},
  game:{iname:'Game',type:'string', table:'vamp-games', cat:'id'},
  homegame:{iname:'Home Game',type:'string', table:'vamp-games', cat:'id'},
  creature:{iname:'Creature',type:'string', table:'lookup-creatures', cat:'id', default:'Vampire'},
  player:{iname:'Player',type:'string', table:'none', cat:'id'},
  username:{iname:'Account',type:'string', table:'none', cat:'id', disabled:true},
  cstatus:{iname:'Status',type:'string', table:'menu-Status, Character', cat:'id', default:'Active'},
  nature:{iname:'Nature',type:'string', table:'menu-Archetypes', cat:'id'},
  demeanor:{iname:'Demeanor',type:'string', table:'menu-Archetypes', cat:'id'},
  npc:{iname:'is NPC',type:'bool', table:'none', cat:'id'},
  willpower:{iname:'Willpower',type:'bubbleint', table:'none', cat:'id', default:2},
  startdate:{iname:'Start Date',type:'date', table:'none', cat:'id', disabled:true},
  modified:{iname:'Modified',type:'date', table:'none', cat:'id', disabled:true},
  notes:{iname:'Notes',type:'string', table:'none', cat:'id'},
  bio:{iname:'Biography',type:'string', table:'none', cat:'id'},

  unspent:{iname:'Unspent',type:'int', table:'none', cat:'xp'},
  earned:{iname:'Earned',type:'int', table:'none', cat:'xp'},
  recent_purchases:{iname:'Recent Purchases',type:'list-string', table:'none', cat:'xp'},
  entries:{iname:'Entries',type:'list-xp_entry', table:'none', cat:'xp'},

  physical:{iname:'Physical',type:'list-levelcost', table:'menu-Physical', cat:'traits'},
  physical_negative:{iname:'Negative Physical',type:'list-levelcost', table:'menu-Physical, Negative', cat:'traits'},
  social:{iname:'Social',type:'list-levelcost', table:'menu-Social', cat:'traits'},
  social_negative:{iname:'Negative Social',type:'list-levelcost', table:'menu-Social, Negative', cat:'traits'},
  mental:{iname:'Mental',type:'list-levelcost', table:'menu-Mental', cat:'traits'},
  mental_negative:{iname:'Negative Mental',type:'list-levelcost', table:'menu-Mental, Negative', cat:'traits'},

  abilities:{iname:'Abilities',type:'list-levelcost', table:'menu-Abilities', cat:'general'},
  backgrounds:{iname:'Backgrounds',type:'list-levelcost', table:'menu-Backgrounds', cat:'general'},
  influences:{iname:'Influences',type:'list-levelcost', table:'menu-Influences', cat:'general'},
  merits:{iname:'Merits',type:'list-cost', table:'menu-Merits', cat:'general'},
  flaws:{iname:'Flaws',type:'list-cost', table:'menu-Flaws', cat:'general'},
  health_levels:{iname:'Health Levels',type:'list-levelcost', table:'menu-Health Levels', cat:'general', default:['Healthy',2,
                                                                                                                  'Bruised',3,
                                                                                                                  'Wounded',2,
                                                                                                                  'Incapacitated',1,
                                                                                                                  'Topor',1]},
}

var vampire = {
  clan:{iname:'Clan',type:'string', table:'menu-Clan', cat:'id'},
  sect:{iname:'Sect',type:'string', table:'menu-Sect', cat:'id'},
  title:{iname:'Title',type:'string', table:'menu-Title, Vampire', cat:'id'},
  coterie:{iname:'Coterie/Pack',type:'string', table:'none', cat:'id'},
  generation:{iname:'Generation',type:'int', table:'none', cat:'id'},
  sire:{iname:'Sire',type:'string', table:'vamp-chars', cat:'id'},
  blood:{iname:'Blood',type:'bubbleint', table:'none', cat:'id', default:10},
  aura:{iname:'Aura',type:'string', table:'menu-Aura', cat:'id'},


  status:{iname:'Status',type:'list-levelcost', table:'menu-Status', cat:'specifics'},
  derangements:{iname:'Derangements',type:'list-string', table:'menu-Derangements', cat:'specifics'},
  disciplines:{iname:'Disciplines',type:'list-string', table:'menu-Disciplines', cat:'specifics'},
  rituals:{iname:'Rituals',type:'list-string', table:'menu-Rituals', cat:'specifics'},
  bloodbonds:{iname:'Blood Bonds',type:'list-levelcost', table:'vamp-chars', cat:'specifics'},
  path:{iname:'Path',type:'string', table:'menu-Path', cat:'specifics'},
  trait:{iname:'Trait',type:'bubbleint', table:'none', cat:'specifics', default:1},
  conscience:{iname:'Conscience',type:'bubbleint', table:'none', cat:'specifics', default:1},
  instinct:{iname:'Instinct',type:'bubbleint', table:'none', cat:'specifics', default:1},
  courage:{iname:'Courage',type:'bubbleint', table:'none', cat:'specifics', default:1}
}

function initChar(id){
  $.post("/api/char",{func:'getchars'},
  function(data, status){
    chars = {};
    $('.list-group-chars').empty();
    for(var i=0;i<data.length;i++){
      chars[data[i]['_id']] = data[i]['chardata'];
      $('.list-group-chars').append('<a class="list-group-item" uid='
                                              +data[i]['_id']+'>'
                                              +data[i]['chardata']['name']+'</a>');
    }
    $('.list-group-chars a').click(function(e) {
        e.preventDefault();
        var $this = $(this);
        if($this.hasClass('active')){
          $this.parent().find('a').removeClass('active');
          clearCharForm();
          defaultCharForm();
          $('.panel-newchar').slideUp();
        }else {
          $this.parent().find('a').removeClass('active');
          $this.addClass('active');
          cdtoform(chars[$this.attr('uid')]);
          $('.panel-newchar').slideDown();
        }

    });
    if(id != undefined)
      $('.list-group-chars').children().each(function(i,e){
        var $e = $(e);
        if($e.attr("uid") == id){
          $e.addClass('active');
          cdtoform(chars[id]);
        }
      });
  });
}


function createLists(schema,callback){
  $.post( "/api/table",{table:schema}, function( data ) {
    var keys = Object.keys(data);
    for(var k=0; k<keys.length; k++){
      var key = keys[k];
      var tb = data[key];

      if(tb.length > 0){
        if(!$('#'+key).exists())
          $('body').append('<datalist id="'+key+'"></datalist>');
        var $dl = $('#'+key);

        for(var i=0; i<tb.length; i++)
          if(tb[i].submenu != true){
            if(tb[i].submenu == 'none' || tb[i].submenu == undefined)
              tb[i].submenu = '';
            else {
              tb[i].submenu = tb[i].submenu + ' > ';
            }
            $dl.append('<option class="opt'+key+
            '" submenu="'+tb[i].submenu+
            '" value="'+tb[i].name+
            '" cost="'+tb[i].cost+'" >' +
            tb[i].submenu+tb[i].name+
            '</option>');
          }
          var selectList = $dl.find('option');
          selectList.sort(function(x,y){
              a = x.getAttribute('submenu');
              b = y.getAttribute('submenu');
              if ( a < b )
                return -1;
              if ( a > b )
                return 1;
              c = x.innerText;
              d = y.innerText;
              if ( c < d )
                return -1;
              if ( c > d )
                return 1;
              return 0;
          });
          $dl.html(selectList);
      }
    }
    if(callback != undefined)
      callback();
  });
}

function createFormElement(key,attribute,$in){
  var type = attribute.type;
  var table = attribute.table;
  var name = attribute.iname;
  var r = '';

  switch(type){
    case 'int':
      r+='<div class="input-group input-sm spinner">';
      r+='<span class="input-group-addon fixedw">'+name+'</span>';
      r+='<input id="charid'+key+'" type="number" name="'+key+'" class="form-control input-md" value="2" onkeyup=bubble(0,this)>';
      r+='</div>';
      $in.append(r);
      break;
    case 'bubbleint':
      r+='<div class="input-group input-sm spinner">';
      r+='<span class="input-group-addon fixedw">'+name+'</span>';
      r+='<input type="text" class="form-control bubbles input-md" value="oo">';
      r+='<input id="charid'+key+'" type="text" name="'+key+'" class="form-control bubblenumber input-md" value="2" onkeyup=bubble(0,this)>';
      r+='<div class="input-group-btn-vertical">';
      r+='<button class="btn btn-default" type="button" onclick=bubble(1,this)><span class="glyphicon glyphicon-triangle-top"></span></button>';
      r+='<button class="btn btn-default" type="button" onclick=bubble(-1,this)><span class="glyphicon glyphicon-triangle-bottom"></span></button>';
      r+='</div>';
      r+='</div>';
      $in.append(r);
      break;
    case 'string':
      r+='<div class="input-group input-sm">';
      r+='<span class="input-group-addon fixedw">'+name+'</span>';
      r+='<input  id="charid'+key+'" type="text" class="form-control charstring" list="'+key+'"  name="'+key+'" >';
      r+='</div>';
      $in.append(r);
      break;
    case 'list-string':
    case 'list-cost':
    case 'list-levelcost':
      r+='<div class="input-group listlevel input-sm '+type+'">';
      r+='<span class="input-group-addon"><div>'+name+'</div></span>';
      r+='<div class="ghosts">';
      r+='<input type="text" class="form-control custom-entry input-md" value="" placeholder="Custom Entry">';
      r+='<button class="form-control plus-btn" onclick=addLevel(this)><span class="glyphicon glyphicon-plus"></span></button>';
      r+='<select class="form-control plus-select input-sm selectlevel" multiple="multiple" >'+$('#'+key).html()+'</select>';
      r+='</div>';
      r+='<div class="copies">';
      r+='<button class="form-control minus-btn" onclick=delLevel(this)><span class="glyphicon glyphicon-minus"></span></button>';
      r+='<select id="charid'+key+'" name="'+key+'" class="form-control minus-select input-sm selectlevel" multiple="multiple" ></select>';
      r+='</div>';
      r+='</div>';
      var $r = $(r);
      $in.append($r);
      $r.find('select:first').dblclick(function(e){
        addLevel(e.currentTarget);
      }).keyup(function(e){
        if(e.which == 13)
          addLevel(e.currentTarget);
      });
      $r.find('select:last').dblclick(function(e){
        delLevel(e.currentTarget);
      }).keyup(function(e){
        if(e.which == 8)
          delLevel(e.currentTarget);
      });
      $r.find('input').focus(function(){console.log($r);$r.find('select:first').val([])});
      break;
  }
}

function bubble(n,e){
  //console.log(n,e);
  var $cont = $(e).parent().parent();
  if(n==0)
    $cont = $(e).parent();
  var $bubbles = $cont.find('.bubbles');
  var $bubblenumber = $cont.find('.bubblenumber');
  var nv = parseInt($bubblenumber.val())+n;
  if(n==0)
    nv=parseInt($bubblenumber.val());
  $bubblenumber.val(nv);
  var bubbs = '';
  for(var i=0; i<nv; i++)
    bubbs+='o';
  $bubbles.val(bubbs);
}

function addLevel(e){
  var $main = $(e).parent().parent();
  var $select = $(e).parent().find('select');
  var $select2 = $main.find('select:last');
  var toAdd = $select.val();
  var one = !$main.hasClass('list-string');
  //console.log(one);
  if(toAdd.length == 0){
    var $inp = $main.find('input');
    if($inp.val() != '')
      addLevelSelect($inp.val(),$select2,one);
  }
  for(var i = 0; i < toAdd.length; i++)
    addLevelSelect(toAdd[i],$select2,one);
}

function addLevelSelect(e,$s,one){
  var exists = false;
  $s.children().each(function(i,elm){
    if(one){
      var $elm = $(elm);
      if($elm.attr("value") == e){
        var nv = parseInt($elm.attr("level"))+1;
        $elm.attr("level",nv);
        $elm.text($elm.attr("value") + ' x' + nv);
        exists = true;
      }
    }
  });
  if(!exists)
    $s.append($("<option></option>")
                  .attr("level",1)
                  .attr("value",e)
                  .text(e));
}

function delLevel(e){
  var one = !$(e).parent().hasClass('list-string');
  var $select = $(e).parent().find('select');
  var toDel = $select.val();
  for(var i = 0; i < toDel.length; i++)
    delLevelSelect(toDel[i],$select,one);
}

function delLevelSelect(e,$s,one){
  var lim = Number.MAX_SAFE_INTEGER;
  var cnt = 0;
  if(one)
    lim = 1;
  $s.children().each(function(i,elm){
    var $elm = $(elm);
    if($elm.attr("value") == e){
      cnt++;
      if(cnt <= lim){
        var nv = parseInt($elm.attr("level"));
        if(nv == 1){
          $elm.remove();
        }
        else {
          nv--;
          $elm.attr("level",nv);
          if(nv == 1)
            $elm.text($elm.attr("value"));
          else
            $elm.text($elm.attr("value") + ' x' + nv);
        }
      }
    }
  });
}


function createElements(){
  Object.keys(generic).map(function(key, index) {
      var v = generic[key];
      var tab = $('#chartabs #tab' + v.cat);
      if(!tab.exists()){
        $('#chartabs').append('<li role="presentation" id="tab'+v.cat+
                              '"><a href="#panel'+v.cat+
                              '" aria-controls="panel'+v.cat+
                              '" role="tab" data-toggle="tab">'+cats[v.cat]+
                              '</a></li>');
        $('#charpanels').append('<div role="tabpanel" class="tab-pane fade panel-body" id="panel'+v.cat+
                                '"></div>');
      }
      createFormElement(key,v,$('#charpanels #panel'+v.cat));
  });
  Object.keys(vampire).map(function(key, index) {
      var v = vampire[key];
      var tab = $('#chartabs #tab' + v.cat);
      if(!tab.exists()){
        $('#chartabs').append('<li role="presentation" id="tab'+v.cat+
                              '"><a href="#panel'+v.cat+
                              '" aria-controls="panel'+v.cat+
                              '" role="tab" data-toggle="tab">'+cats[v.cat]+
                              '</a></li>');
        $('#charpanels').append('<div role="tabpanel" class="tab-pane fade panel-body" id="panel'+v.cat+
                                '"></div>');
      }
      createFormElement(key,v,$('#charpanels #panel'+v.cat));
  });
}

function createUI(type){
  createLists(generic);
  createLists(vampire,createElements);
}

function newchar(){
  $('.list-group-chars').find('a').removeClass('active');
  $('.panel-newchar').slideDown();
  clearCharForm();
  defaultCharForm();
}

function clearCharForm(){
  var $frm = $('#char-form');
  $frm.find('.minus-select').empty();
  $frm.find('.charstring').val('');
  $frm.find('.bubblenumber').val(2);
}

function defaultCharForm(){
  var $frm = $('#char-form');
  Object.keys(generic).map(function(key, index) {
    var df = generic[key].default;
    if(df)
      if(df.constructor === Array)
        for (var i = 0; i < df.length; i+=2)
          for (var j = 0; j < df[i+1]; j++)
            addLevelSelect(df[i],$frm.find('#charid'+key));
      else
        $frm.find('#charid'+key).val(df);
  });
  Object.keys(vampire).map(function(key, index) {
    var df = vampire[key].default;
    if(df)
      if(df.constructor === Array)
        for (var i = 0; i < df.length; i+=2)
          for (var j = 0; j < df[i+1]; j++)
            addLevelSelect(df[i],$frm.find('#charid'+key));
      else
        $frm.find('#charid'+key).val(df).trigger('onkeyup');
  });
}

function savechar(){
  var id = $('.list-group-chars .active').attr('uid');
  $.post("/api/char",{func:'savechar',chardata:formtocd(),id:id},
  function(data, status){
    if(data == 'success'){
      successmsg('.pane-chars','Success!','Character saved.');
      initChar(id);
    }
  });
}

function delchar(){
  var id = $('.list-group-chars .active').attr('uid');
  $.post("/api/char",{func:'delchar',id:id},
  function(data, status){
    if(data == 'success'){
      successmsg('.pane-chars','Success!','Character deleted.');
      initChar();
    }
  });
}

function cdtoform(cd){
  //if list add them all
  //if not add the one
  clearCharForm();
  var keys = Object.keys(cd);
  for (var i = 0; i < keys.length; i++) {
    var cur = cd[keys[i]];
    if(cur.constructor === Array){
      for (var j = 0; j < cur.length; j++) {
        var addnl = '';
        if(cur[j].level > 1)
          addnl = ' x' + cur[j].level;
        $("#charid"+keys[i]).append('<option level="'+cur[j].level+'" value="'+cur[j].name+'" >' +cur[j].name + addnl + '</option>');
      }
    }else {
      $("#charid"+keys[i]).val(cur).trigger('onkeyup');

    }
  }
}

function formtocd(){
  var cd = {};
  var $frm = $('#char-form');
  $frm.find('.minus-select').each(function(){
    var $sel = $(this);
    var key = $sel.attr('name');
    $sel.find('option').each(function(){
      var $opt = $(this);
      var obj = {name:$opt.attr('value'),
                level:$opt.attr('level')};
      if(cd[key])
        cd[key].push(obj);
      else
        cd[key] = [obj];
    });
  });
  $frm.find('.bubblenumber,.charstring').each(function(){
    var $num = $(this);
    var key = $num.attr('name');
    cd[key] = $num.val();
  });
  return cd;
}
