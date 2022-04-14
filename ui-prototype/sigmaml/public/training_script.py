import json
import argparse
import sys
import os.path
import time
import random
import math
import itertools
from python_scripts.trainers import *
from python_scripts.model import *
from python_scripts.dataset import get_dataloader
from python_scripts.parse_torch import *
from torchvision import datasets
from torchsummary import summary
from tqdm import tqdm

def filterDictKey(aListDict, terms):
    return [{k: v for k,v in d.items() if not k in terms} for d in aListDict]


# net.state_dict()
# torch.save(net.state_dict(), PATH)

# model_scripted = torch.jit.script(net) 
# model_scripted.save('model_scripted.pt')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="path to model json")
    parser.add_argument('projectpath', type=str)
    args = parser.parse_args()

    # print(args.projectpath)
    ppath = args.projectpath

    if not os.path.exists(f"{ppath}/training_history"):
        os.mkdir(f"{ppath}/training_history")

    assert(os.path.exists(f'{ppath}/model.json'))

    if os.path.exists(f"{ppath}/temp_training_config.json"):
        with open(f"{ppath}/temp_training_config.json", 'r') as f:
            # print(f"{ppath}/temp_training_config.json")
            testingInfo = json.load(f)

        with open(f'{ppath}/model.json', 'r') as f:
            raw = json.load(f)

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # TODO: Fix to not clear entire file on each write? Datastreaming?
        top5 = []
        mostRecent = []

        params = {k: v for k, v in testingInfo.items() if type(v) == list}
        # Define the iterations
        keys, values = zip(*params.items())

        for settings in itertools.product(*values):
            curSetting = dict(zip(params.keys(), settings))
            mostRecent = {
                "hyper": curSetting,
                "loss_vals": [],
            }

            x = generate_graph(raw)
            net = NetFromGraph(x)
            net.to(device)

            summary(net, (1, 28, 28))

            dataloader = get_dataloader(datasets.MNIST, ppath, 5000)

            for j in tqdm(range(testingInfo["epochs"])):
                # add one train epoch run here:

                criterion = get_losses()[curSetting['loss']]
                optimizer = get_optimizers()[curSetting['optim']]

                # TODO: remove hard-coded dataset
                loss = train_fl(net, dataloader,
                                criterion, optimizer, curSetting['lr'], device)
                mostRecent["loss_vals"].append(round(loss, 2))


                with open(f"{ppath}/training_history/top_5.json", 'w') as top5json:
                    json.dump(filterDictKey(top5 + [mostRecent], "model_weights"), top5json, indent=4)

            mostRecent["model_weights"] = torch.jit.script(net)

        
            top5 = sorted(top5 + [mostRecent], key=lambda x: min(x['loss_vals']))[:5]

            with open(f"{ppath}/training_history/top_5.json", 'w') as top5json:
                json.dump(filterDictKey(top5 + [mostRecent], "model_weights"), top5json, indent=4)

        # TODO: Fix 
        for i in range(min(5, len(top5))):
            top5[i]["model_weights"].save(f"{ppath}/model_weights{i}.pt")
    
    else:
        print("train config not found")
        sys.exit()
