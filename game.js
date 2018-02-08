// games
//var game = mongoose.model('game', { any: {} });
var game = vdb.get('game');

app.post('/api/game', function(req, res) {
  var todo = req.body.func;
  var sess = req.session;

  function dothings(isast){
    switch(todo){
      case 'savegame':
        if(req.body.id != undefined)
        game.update({'_id':req.body.id},{
            name: req.body.gamedata.name,
            storytellers: req.body.gamedata.sts,
            characters: req.body.gamedata.chars},
          {upsert: true, safe: false},
          function (err) {
            if (err)
              res.send(err);
            else
              res.send('success');
            });
          else
            game.insert({
                name: req.body.gamedata.name,
                storytellers: [sess.username],
                characters: []},{},
                function (err) {
                  if (err)
                    res.send(err);
                  else
                    res.send('success');
                  });
      break;
      case 'addst':
        if(isast)
        game.update( { _id : req.body.id },{ $push: { storytellers : req.body.username }},
        function (err, game) {
          if (err)
            res.send(err);
        });
      break;
      case 'delst':
        if(isast)
        game.update( { _id : req.body.id },{ $pull: { storytellers : req.body.username }},
        function (err, game) {
          if (err)
            res.send(err);
        });
      break;
      case 'getgames':
        game.find({ storytellers : sess.username }, function (err, games) {
          if (err)
            res.send(err);
          else{
            res.send(games);
          }
          });
        break;
      case 'delgame':
        game.remove({ 'username': sess.username, '_id':req.body.id },{}, function (err) {
          if (err)
            res.send(err);
            else
              res.send('success');
          });
        break;
    }
  }

  game.find({ _id: req.body.id, storytellers: sess.username },
    function (err, game){
      if (err)
        res.send(err);
      if(game.length >= 1)
        dothings(true);
      else
        dothings(false);
  });
});
