import torch
import re


def get_losses():
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and 'Loss' in name])


def get_optimizers():
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and 'Loss' in name])


def get_nns(exclude='Loss'):  # exclude is a regex
    return dict([(name, cls) for name, cls in torch.nn.__dict__.items()
                 if isinstance(cls, type) and not re.match(exclude, name)])
