import torch
import torchvision
import re


def get_losses():
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and 'Loss' in name])


def get_optimizers():
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type)])


def get_nns(exclude='Loss'):  # exclude is a regex
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and not re.match(exclude, name)])


def get_vision_datasets(exclude=('ImageFolder', 'DatasetFolder', 'VisionDataset')):
    return dict([(name, cls) for name, cls in torchvision.datasets.__dict__.items()
                 if isinstance(cls, type) and name not in exclude])


if __name__ == '__main__':
    print(get_vision_datasets())