import torch
import torchvision
import re
import inspect


def get_losses():
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and 'Loss' in name])


def get_optimizers():
    return dict([(name, cls) for name, cls in torch.optim.__dict__.items()
                 if isinstance(cls, type)])


def get_nns(exclude='Loss'):  # exclude is a regex
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and not re.match(exclude, name)])


def get_vision_datasets(exclude=('ImageFolder', 'DatasetFolder', 'VisionDataset')):
    return dict([(name, cls) for name, cls in torchvision.datasets.__dict__.items()
                 if isinstance(cls, type) and name not in exclude])


def get_vision_transforms(exclude=None):
    return dict([(name, cls) for name, cls in torchvision.transforms.__dict__.items()
                 if isinstance(cls, type) and name not in exclude])


def get_default_args(func):
    signature = inspect.signature(func)
    out = {}
    for k, v in signature.parameters.items():
        print(k,v)
        if v.default is not inspect.Parameter.empty:
            out.update({k:str(v.default)})
        else:
            out.update({k: ""})
    return out


if __name__ == '__main__':
    print(get_optimizers())
