// table

app.post('/api/table', function(req, res) {
  var dic = req.body.table;
  var keys = Object.keys(dic);

  var rdic = {};
  var dones = [];

  function doneyet(k){
    //console.log(k,keys[k]);
    dones[k] = true;
    alldone = true;
    for(var j=0; j<keys.length; j++)
      if(!dones[j]){
        alldone = false;
        break;
      }
    //console.log(JSON.stringify(dones) + '\n');
    if(alldone)
      res.send(rdic);
  }

  //for(var k=0; k<keys.length; k++){
  keys.forEach(function(key, k){
    var table = dic[keys[k]]['table'];
    dones[k] = (table == 'none');
    if(table.startsWith('menu-')){
      table = table.replace('menu-','');
      //query lookupdb menu
      var menu = ldb.get('menu');
      menu.find({name:table},{}, function(e, docs){
        var strs = [];
        var subs = [];
        var subdone = {};
        var doc = docs[0];
        if(doc.item){
          for (var j = 0; j < doc.item.length; j++) {
            var cost = 1;
            if(doc.item[j]['@cost'])
              cost = doc.item[j]['@cost'];
            strs.push({name:doc.item[j]['@name'],cost:cost,submenu:'none'});
          }
        }
        if(doc.submenu){
          for (var j = 0; j < doc.submenu.length; j++){
            var name = doc.submenu[j]['@name'];
            if(doc.submenu[j]['@link'])
              name = doc.submenu[j]['@link'];
            strs.push({name:name,submenu:true});
            subs.push(name);
            subdone[name] = false;
          }
        }

        function subdonecall(sub){
          //console.log(JSON.stringify(subdone) + '\n');
          subdone[sub] = true;
          alldone = true;
          var keys = Object.keys(subdone);
          for(var j=0; j<keys.length; j++)
            if(!subdone[keys[j]]){
              alldone = false;
              break;
            }
            //if(alldone)
          //console.log(alldone);
          if(alldone){
            rdic[key]=strs;
            doneyet(k);
          }
        }
        function submenuquery(sub){
          menu.find({name:sub},{}, function(el, ds){
            if(ds){
              var doc = ds[0];
              if(doc.item){
                for (var j = 0; j < doc.item.length; j++) {
                  var cost = 1;
                  if(doc.item[j]['@cost'])
                    cost = doc.item[j]['@cost'];
                  strs.push({name:doc.item[j]['@name'],cost:cost,submenu:sub});
                }
              }
              if(doc.submenu){
                for (var j = 0; j < doc.submenu.length; j++){
                  var name = doc.submenu[j]['@name'];
                  if(doc.submenu[j]['@link'])
                    name = doc.submenu[j]['@link'];
                  //strs.push({name:name,submenu:sub});//?
                  subdone[name] = false;
                  //console.log(name);
                  submenuquery(name);
                }
              }
            }
            subdonecall(sub);
          });
        }
        subs.forEach(submenuquery);
        if(subs.length == 0){
          rdic[key]=strs;
          doneyet(k);
        }

      });
    }else if(table.startsWith('vamp-')) {
      table = table.replace('vamp-','');
      //query vamp
      var col = vdb.get(table);
      col.find({},{}, function(e, docs){
        var strs = [];
        if(docs)
        for (var i = 0; i < docs.length; i++) {
          strs.push({name:docs[i].name,cost:0});
        }
        rdic[key]=strs;
        doneyet(k);
      });
    }else if(table.startsWith('lookup-')){
      table = table.replace('lookup-','');
      var col = ldb.get(table);
      col.find({},{}, function(e, docs){
        var strs = [];
        if(docs)
        for (var i = 0; i < docs.length; i++) {
          strs.push({name:docs[i].name,cost:0});
        }
        rdic[key]=strs;
        doneyet(k);
      });}
    });
});
