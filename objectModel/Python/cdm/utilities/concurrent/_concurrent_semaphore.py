# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from queue import Queue
from typing import Optional


class ConcurrentSemaphore:
    """Similar to the Semaphore but stops the execution on the coroutine level instead of the whole thread."""

    def __init__(self, permits: Optional[int] = None):
        self._permits = None
        # if permits is None, it means that the queue is unbounded.
        permits = 0 if permits is None else permits
        self.queue = Queue(maxsize=permits)

    @property
    def permits(self) -> Optional[int]:
        """Number of concurrent coroutine allowed to run at the same time."""
        return self._permits

    @permits.setter
    def permits(self, permits: Optional[int]) -> None:
        """Number of concurrent coroutine allowed to run at the same time."""
        self._permits = permits
        permits = 0 if permits is None else permits
        self.queue = Queue(maxsize=permits)

    def acquire(self):
        """Acquires a permit to keep the execution."""
        # Adds a number to occupy one position in the queue. 
        # If the queue gets full and another number is added,
        # the calling function will be blocked until a position is freeded up.
        self.queue.put(1)

    def release(self):
        """Releases a permit and allows other Promises to run."""
        # Release a position in the queue.
        self.queue.get()
