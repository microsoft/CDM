from abc import ABC, abstractmethod


class SpewCatcher(ABC):

    @abstractmethod
    def clear(self) -> None:
        raise NotImplementedError()

    def spew_line(self, spew: str) -> None:
        raise NotImplementedError()
