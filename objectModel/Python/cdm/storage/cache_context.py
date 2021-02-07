# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

class StorageAdapterCacheContext():
    """This class is used to track requests to enable file query caching. Each time a request to enable        
    caching is made an instance of this class is created and added the the StorageAdapter's _activeCacheContexts
    set. When dispose is called, this object is removed from that set. Whenever any items are in the adapter's 
    _activeCacheContexts, caching is enabled."""

    def dispose(self) -> None:
        # body defined in StorageAdatperBase to avoid circular reference
        pass

