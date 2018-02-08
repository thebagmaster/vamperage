// acct
var acct = mongoose.model('acct', {
  username: { type: String, required: true, index: { unique: true } },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  invites: { type: [{}], required: true, default: [] },
});

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        hash:value
    };
};
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};
function saltHashPassword(userpassword) {
    var salt = genRandomString(16);
    var p = sha512(userpassword, salt);
    return {
      hash:p.hash,
      salt:p.salt
    };
}

// app.post('/api/invite', function(req, res) {
//   var sess = req.session;
//   if(sess.username && req.body.acct) {
//     acct.update({ username:req.body.acct, 'invites.gid':{$ne: req.body.gid} },
//       {invites:{$push:{
//           from:sess.username,
//           gid:req.body.gid
//         }
//       }});
//   }
// });

// app.post('/api/friends', function(req, res) {
//   var sess = req.session;
//   if(sess.username) {
//     switch(req.body.func){
//       case 'add':
//       acct.update({ username:sess.username, 'friends.username':{$ne: req.body.username} },
//         {friends:{$push:{ username:req.body.username }}});
//         break;
//       case 'remove':
//       break;
//       case 'get':
//       break;
//     }
//   }
// });

app.post('/api/acct', function(req, res) {
  var sess = req.session;
  //console.log(req.body.username);
  if(req.body.logout) {
    //console.log('logout');
    sess.destroy();
    res.send("Success");
  } else if(sess.username && sess.username != '') {
    res.send(sess.username);
  } else if(req.body.username)
  acct.find({ 'username': req.body.username }, function (err, person) {
      if (err)
          res.send(err);
      if(person.length == 0 &&
        req.body.username != '' &&
        req.body.password != '') {
        //add acct
        var p = saltHashPassword(req.body.password);
        acct.create({
            username : req.body.username,
            hash : p.hash,
            salt : p.salt
        }, function(err, usr) {
            if (err)
                res.send(err);
            else
                res.send("Success");
        });
      } else {
        //login
        person = person[0];
        var sha = sha512(req.body.password,person.salt);
        if(sha.hash === person.hash){
          //success
          sess.username = person.username;
          acct.update({ username: person.username },{ $set: { loginAttempts: 0 }},{ $set: { lockUntil: 0 }});
          res.send("Success");
        } else {
          //no pw match
          sess.username = '';
          if(Date.now() > person.lockUntil){
              //not locked out
              if(person.loginAttempts >= MAX_LOGIN_ATTEMPTS){
                //now locked out
                var locked = Date.now() + LOCK_TIME;
                acct.update({ username: person.username },{ $set: { lockUntil: locked }});
                res.send("Locked Out Until " + (new Date(locked)));
              } else {
                //increment attempts
                acct.update({ username: person.username },{ $inc: { loginAttempts: 1 }});
                res.send("Failed Password Attempt, " +
                        (MAX_LOGIN_ATTEMPTS - person.loginAttempts) + " more tries.");
              }
          } else {
            res.send("Locked Out Until " + (new Date(person.lockUntil)));
          }
        }
      }
  });
  else{
    res.send("Failure");
  }

});
