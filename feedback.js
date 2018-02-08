// fb

app.post('/api/feedback', function(req, res) {
  var txt = req.body.text;
  var sess = req.session;
  var user = 'anon';
  if(sess.username)
    user = sess.username;

  var fb = vdb.get('feedback');
  fb.insert({text:txt,from:user},{}, function(err, docs){
    if (err)
      res.send('failure');
    else
      res.send('success');
  });
});
