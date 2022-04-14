from torchvision import datasets
from torch.utils.data import DataLoader


def get_dataloader(dataset, data_root, batch_size, download=True):
    return DataLoader(dataset(root=data_root, train=True, download=download), batch_size=batch_size, shuffle=True)


if __name__ == '__main__':
    get_dataloader(datasets.MNIST, './', 100)
