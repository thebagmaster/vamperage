import xmltodict, json

with open('menu.xml', 'r') as content_file:
    content = content_file.read()
o = xmltodict.parse(content)

#print(o)


dict = {}
for m in o["grapevinemenus"]["menu"]:
    name = m.pop('@name', None)
    try:
        m.pop('#text',None)
    except:
        pass
    dict[name] = m

file = open("menu.js","w")
file.write('print("started");var db = connect("127.0.0.1:27017/lookup");\n');
file.write('print("bye old data");db.menu.remove();\n');
file.write("db.menu.insert({'menuname':'Vampire the Masquerade'});")
i = 0
for k in sorted(dict.keys()):
    file.write('print("menu #' + str(i) + '");' + 'db.menu.insert({"name":"' + k.replace('\'','') + '",' + json.dumps(dict[k])[1:-1] + "});\n")
    i+=1
file.close()
