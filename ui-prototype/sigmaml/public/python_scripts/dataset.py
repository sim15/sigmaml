from torchvision import datasets
from torch.utils.data import DataLoader
from torchvision import transforms


def get_dataloader(dataset, data_root, batch_size, download=True):
    # TODO: remove hard-coding
    normalize = transforms.Normalize(mean=[.5], std=[.5])
    transform = transforms.Compose([transforms.ToTensor(), normalize])
    data = dataset(root=data_root, train=True, download=download, transform=transform)
    return DataLoader(data, batch_size=batch_size, shuffle=True)


if __name__ == '__main__':
    pass
