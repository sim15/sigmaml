from collections import defaultdict
import json

d = {}
with open('modules.txt', 'r') as f:
    temp = f.read().splitlines()
    temp = [i.split(':') for i in temp]
    d = {i[0]: i[1].replace(".", '/') for i in temp}


argsinfo = {}
with open('args1.json', 'r') as f:
    argsinfo = json.load(f)
        

def buildDict(l, label, argsdata=argsinfo):
    print(l, l[-1].split('/')[:-len(l)+1])
    if len(l) == 1:
        return {"name": label,
            "path": l[0].replace('.', '/'),
            "args": argsinfo[label]}
    return {
        "name": l[0],
        "path": '/'.join(l[-1].split('/')[:-len(l)+1]),
        "children": [buildDict(l[1:], label)]}

def editRes(li, l, label):
    if not(l[0] in [module["name"] for module in li]):
        li.append(buildDict(l, label))
    else:
        for i in range(len(li)):
            if li[i]["name"] == l[0]:
                li[i]["children"] = editRes(li[i]["children"], l[1:], label)

    return li

res = []
for label, location in [(k, d[k].split('/')[:-1] + [d[k]]) for k in d.keys()]:
    res = editRes(res, location, label)




with open('nnTree.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=4)