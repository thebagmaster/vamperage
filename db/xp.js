print("started");
db = connect("127.0.0.1:27017/lookup");
col = db.xp_mods;
print("bye old data"); col.drop();
print("start insert");
print("1"); col.insert({"name":"earn","func":"add","type":["earned","unspent"]});
print("2"); col.insert({"name":"spend","func":"sub","type":["unspent"]});
print("3"); col.insert({"name":"lose","func":"sub","type":["earned","unspent"]});
print("4"); col.insert({"name":"unspend","func":"add","type":["unspent"]});
print("5"); col.insert({"name":"set earned","func":"set","type":["earned"]});
print("6"); col.insert({"name":"set unspent","func":"set","type":["unspent"]});
print("7"); col.insert({"name":"comment","func":"none","type":"none"});
col = db.xp_reason;
print("bye old data"); col.drop();
print("start insert");
col.insert({"name":"Attendance"});
col.insert({"name":"Costuming"});
col.insert({"name":"Downtime Activities"});
col.insert({"name":"First Night"});
col.insert({"name":"Good Roleplaying"});
col.insert({"name":"Leadership"});
