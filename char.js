// char

app.post('/api/char', function(req, res) {
  var sess = req.session;
  var todo = req.body.func;
  var char = vdb.get('char');
  switch(todo){
    case 'getchars':
      char.find({ 'username': sess.username },{}, function (err, chars) {
        if (err)
          res.send(err);
        else
          res.send(chars);
        });
      break;
    case 'delchar':
      char.remove({ 'username': sess.username, '_id':req.body.id },{}, function (err) {
        if (err)
          res.send(err);
          else
            res.send('success');
        });
      break;
    case 'savechar':
      if(req.body.id != undefined)
      char.update({ 'username': sess.username, '_id':req.body.id },
        {$set:{'chardata':req.body.chardata}},
        {upsert: true, safe: false},
        function (err) {
          if (err)
            res.send(err);
          else
            res.send('success');
          });
      else
      char.insert({ 'username': sess.username,'chardata':req.body.chardata },{},
        function (err) {
          if (err)
            res.send(err);
          else
            res.send('success');
          });
      break;
  }
});
