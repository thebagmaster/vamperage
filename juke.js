var request = require('request');
var mongodb = require('mongodb');
//var sanitize = require('mongo-sanitize');

function getYT(url,cb){
  request('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAMXqMsbmEv1PLIPxUg7jjT2z81_siyZZY&part=snippet&id=' + url, function (error, response, body) {
      var j = JSON.parse(body)['items'][0]['snippet']['title'];
      j = j.replace(/[^\w -]/g,'');
      //j = sanitize(j);
      cb(j);
  });
}

app.post('/juke', function(req, res) {
  var colj  = jdb.get(req.body.juke + '');  
  var colq = jdb.get(req.body.juke + '_q');  
  var coln = jdb.get(req.body.juke + '_n');  

  function incPlay(id){
    colj.update({_id:id},{ $inc: {'plays':1}, $inc:{'rng':1}});
  }

  function nowPlaying(id){
    coln.update({},{id:id});
  }

  switch(req.body.func){
    case 'fixdb':
      colj.find({},{},function(err,docs){
	docs.forEach(function(doc){
	  getYT(doc.url, function cb(title){ colj.update({_id:doc._id},{name:title,plays:doc.plays,url:doc.url}); });
	});          
      });
      return;
      break;
    case 'queue':
      console.log(req.body.qid);
      colq.insert({'qid':req.body.qid});
      break;
    case 'dequeue':
      colq.count({}, function (error, count) {
        if(count == undefined)
          return;
        if(count == 0)
	  colj.find({},{limit:1,sort:{rng:1}},function(err,mindoc){
	    var min = mindoc[0].rng;
            colj.find({'rng':min},function(err, docs) {
              var doc = docs[Math.floor(Math.random()*docs.length)];
              res.send(doc);
              incPlay(doc['_id']);
	      nowPlaying(doc['_id']);
            });         
	  });
        else
            colq.findOne({},function(e, doc){
		colj.find({'_id':doc['qid']},function(e, doc2){
              res.send(doc2[0]);
              incPlay(doc2['_id']);
              nowPlaying(doc['qid']);
            });
            colq.remove({'_id':doc['_id']});
          });
      });
      return;
      break;
  case 'getsongs':
      colj.find({},{sort:{name:1}},function(e, docs){res.send(docs);});
      return;
      break;
  case 'getqueue':
      coln.findOne({}, function(e, now){
        colq.find({}, function(e, docs){res.send({now:now,queue:docs});});
      });
      return;
      break;
  case 'add':
      function insertrow(name){
	colj.find({},{limit:1,sort:{rng:1}},function(err,mindoc){
		var min = mindoc[0].rng;
        	colj.insert({'url':req.body.url,'name':name,'plays':0,'rng':min});
        	res.send('Added Song '+name);
	});
      }
      getYT(req.body.url,insertrow);
      return;        
      break;
  case 'del':
      console.log(req.body.qid);
      colj.remove({ _id : req.body.qid });
      break;
  case 'getjukes':
      exec('mongo get_jukes.js',function(error, stdout, stderr) {
        res.send(stdout);
      });          
      return;          
      break;

  }

  res.send('success');  
});

app.get("/juke", function(req, res) {
  res.sendfile('public/juke.htm');
});
