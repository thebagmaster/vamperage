print("started");
db = connect("127.0.0.1:27017/lookup");
col = db.creatures;
print("bye old data"); col.drop();
print("start insert");
print("1"); col.insert({'name':'Vampire', 'tablename': 'vampire'});
print("2"); col.insert({'name':'Mortal', 'tablename': 'mortal'});
print("3"); col.insert({'name':'Werewolf', 'tablename': 'werewolf'});
print("4"); col.insert({'name':'Fera', 'tablename': 'fera'});
print("5"); col.insert({'name':'Mage', 'tablename': 'Mage'});
print("6"); col.insert({'name':'Kuei-Jin', 'tablename': 'kuei-jin'});
print("7"); col.insert({'name':'Wraith', 'tablename': 'wraith'});
print("8"); col.insert({'name':'Mummy', 'tablename': 'mummy'});
print("9"); col.insert({'name':'Changeling', 'tablename': 'changeling'});
print("10"); col.insert({'name':'Demon', 'tablename': 'demon'});
print("11"); col.insert({'name':'Hunter', 'tablename': 'hunter'});
print("12"); col.insert({'name':'Various', 'tablename': 'various'});
