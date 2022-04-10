
def train_fl(model, dataloader, fl, epochs, loss_fn, optim, lr=0.001, momentum=0.9):
    """
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
    :rtype: list
    """
    criterion = loss_fn()
    optimizer = optim(model.parameters(), lr=lr, momentum=momentum)
    features, labels = fl
    losses = []
    for i in range(1, epochs+1):
        for batch in dataloader:
            optimizer.zero_grad()
            out = model(batch[features])
            loss = criterion(out, batch[labels])
            losses.append(loss.item())
            loss.backward()
            optimizer.step()
    return losses
