import json
import argparse
import sys
import os.path
import time
import random
import itertools

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="path to model json")
    parser.add_argument('projectpath', type=str)
    args = parser.parse_args()

    # print(args.projectpath)
    ppath = args.projectpath


    if not (os.path.exists(f"{ppath}/training_history")):
        os.mkdir(f"{ppath}/training_history")

    if (os.path.exists(f"{ppath}/temp_training_config.json")):
        with open(f"{ppath}/temp_training_config.json", 'r') as f:
            # print(f"{ppath}/temp_training_config.json")
            testingInfo = json.load(f)

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

            for j in range(testingInfo["epochs"]):

                # add one train epoch run here:




                lossPoint = 5 * random.random()


                time.sleep(0.7)
                mostRecent["loss_vals"].append(lossPoint)

                with open(f"{ppath}/training_history/top_5.json", 'w') as top5json:
                    # historyjson.seek(0)
                    # historyjson.truncate() 
                    json.dump(top5 + [mostRecent], top5json, indent=4)


            top5 = sorted(top5 + [mostRecent], key=lambda x: min(x['loss_vals']))[:5]

            with open(f"{ppath}/training_history/top_5.json", 'w') as top5json:
                json.dump(top5 + [mostRecent], top5json, indent=4)
        print(c)
    
    
    else:
        print("train config not found")
        sys.exit()


