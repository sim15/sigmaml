import argparse
import torch
import json
from model import NetFromGraph, generate_graph
from trainers import *
from parse_torch import *
from dataset import get_dataloader
from torchvision import datasets


def clean_config(d):
    fl = [d['feature_head'], d['label_head']]
    epochs = int(d['epochs'])
    loss = get_losses()[d['losses']]
    optim = get_optimizers()[d['optim']]
    lr = float(d['lr'])
    return {'fl':fl, 'epochs':epochs, 'loss':loss, 'optim':optim, 'lr':lr}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="path to model json")
    parser.add_argument("filepath", type=str)
    parser.add_argument('config', type=str)
    args = parser.parse_args()

    with open(args.filepath, 'rb') as f:  # loads .json file of model graph
        raw = json.load(f)

    with open(args.config, 'rb') as f:
        cfg = json.load(f)
    
    x = generate_graph(raw)  # generate a graph structure from raw json
    net = NetFromGraph(x)  # generate pytorch model from graph

    # unpack hyperparameters
    if cfg['mode'] == 'train':
        train_fl(net, get_dataloader(datasets.MNIST, './', 100), *clean_config(cfg))

    f = 'model.pt'
    torch.save(net.state_dict(), f)