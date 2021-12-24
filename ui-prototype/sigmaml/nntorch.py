from collections import defaultdict
import json

d = {}
with open('modules.txt', 'r') as f:
    temp = f.read().splitlines()
    temp = [i.split(':') for i in temp]
    d = {i[0]: i[1] for i in temp}


def buildDict(l, label):
    if len(l) == 1:
        return {"name": label,
            "reference": l[0]}
    return {
        "name": l[0],
        "submodules": [buildDict(l[1:], label)]}

def editRes(li, l, label):
    if not(l[0] in [module["name"] for module in li]):
        li.append(buildDict(l, label))
    # if len(l) == 2:
    #     di[l[0]].append(
    #         {"name": label,
    #         "reference": l[1]})
    else:
        for i in range(len(li)):
            if li[i]["name"] == l[0]:
                li[i]["submodules"] = editRes(li[i]["submodules"], l[1:], label)

    return li

res = []
for label, location in [(k, d[k].split('.')[:-1] + [d[k]]) for k in d.keys()]:
    res = editRes(res, location, label)

with open('nnTree.json', 'w', encoding='utf-8') as f:
    json.dump(res, f, ensure_ascii=False, indent=4)