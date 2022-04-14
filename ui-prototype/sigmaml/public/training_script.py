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
                "loss_vals": []
            }

            x = generate_graph(raw)
            net = NetFromGraph(x)
            net.to(device)

            summary(net, (1, 28, 28))

            dataloader = get_dataloader(datasets.MNIST, ppath, 5000)

            for j in tqdm(range(testingInfo["epochs"])):
                # add one train epoch run here:

                # lossPoint = 5 * random.random()

                # time.sleep(0.7)
                criterion = get_losses()[curSetting['loss']]
                optimizer = get_optimizers()[curSetting['optim']]

                # TODO: remove hard-coded dataset
                loss = train_fl(net, dataloader,
                                criterion, optimizer, curSetting['lr'], device)
                mostRecent["loss_vals"].append(round(loss, 2))

                with open(f"{ppath}/training_history/top_5.json", 'w') as top5json:
                    # historyjson.seek(0)
                    # historyjson.truncate()
                    json.dump(top5 + [mostRecent], top5json, indent=4)

            top5 = sorted(top5 + [mostRecent], key=lambda x: min(x['loss_vals']))[:5]

            with open(f"{ppath}/training_history/top_5.json", 'w') as top5json:
                json.dump(top5 + [mostRecent], top5json, indent=4)

    else:
        print("train config not found")
        sys.exit()
