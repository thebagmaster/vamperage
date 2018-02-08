print("started");
var db = connect("127.0.0.1:27017/lookup");
print("bye old data");
db.healthlevels.remove();
print("start insert");
db.healthlevels.insert({'Creature':'Vampire','Healthy':2,'Bruised':3,'Wounded':3,'Incapacitated':1,'Torpor':1});
