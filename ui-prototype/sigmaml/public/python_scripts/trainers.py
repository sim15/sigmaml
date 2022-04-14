
def train_fl(model, dataloader, loss_fn, optim, lr, device):
    """
    :param device:
    :type device:
    :param model: instantiated pytorch model
    :type model: torch.nn.Module
    :param dataloader: pytorch DataLoader or similarly structured iterable
    :type dataloader: torch.utils.data.DataLoader
    :param fl: [feature_name, label_name]
    :type fl: iterable
    :param epochs: number of epochs
    :type epochs: int
    :param lr: learning rate hyperparameter
    :type lr: float
    :param loss_fn: PyTorch loss function
    :type loss_fn: torch.nn.Module
    :param optim: PyTorch optimizer function
    :type optim: torch.optim.*
    :param momentum: momentum hyperparameter
    :type momentum: float
    :return: list of losses
    :rtype: float
    """
    criterion = loss_fn()
    optimizer = optim(model.parameters(), lr=lr)
    for i, o in dataloader:
        optimizer.zero_grad()
        i, o = i.to(device), o.to(device)
        out = model(i)
        loss = criterion(out, o)
        loss.backward()
        optimizer.step()
    return loss.item()
