# import json
# import os


# __location__ = os.path.realpath(
#     os.path.join(os.getcwd(), os.path.dirname(__file__)))

# with open(os.path.join(__location__, 'data.json')) as f:
#     data = json.load(f)

# with open('new_file.json', 'w') as f:
#     json.dump(data, f, indent=2)
#     print("New json file is created from data.json file")

# import argparse
# import json
import torch
import ast


def clean_raw(raw_dict):
    return raw_dict['drawflow']['Home']['data']


def generate_graph(d):
    d = clean_raw(d)
    l = []
    for n in d.values():
        name = str(n['id'])
        layer = n['name']
        inputs = n['inputs']
        outputs = n['outputs']
        kwargs = {k: auto_typecast(v) for k, v in n['data'].items()}
        l.append(Node([name, layer, kwargs], outputs))
    return l


def auto_typecast(v):
    try:
        return ast.literal_eval(v)
    except:
        return v


class Node:
    def __init__(self, v, outputs=None):  # args, kwargs must be empty iterable, map, respectively
        self.name, self.fn, self.kwargs = v
        self.outputs = outputs

    def parse(self, d):
        return d[self.fn](**self.kwargs)


class NetFromGraph(torch.nn.Module):
    def __init__(self, graph, demo=False):  # G = (V, E)
        super().__init__()
        self.graph = graph
        nn = dict([(name, cls) for name, cls in torch.nn.__dict__.items() if isinstance(cls, type)])
        self.d = torch.nn.ModuleDict({node.name: node.parse(nn) for node in graph[1:]})

    def forward(self, x):  #
        for layer in self.d.values():
            x = layer(x)
        return x


"""
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="path to model json")
    parser.add_argument("filepath", type=str)
    args = parser.parse_args()

    with open(args.filepath, 'rb') as f:  # loads .json file of model graph
        raw = json.load(f)


    x = generate_graph(raw)
    net = NetFromGraph(x)

    f = 'test.pt'
    torch.save(net.state_dict(), f)
"""
