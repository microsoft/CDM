# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Tuple


class StorageUtils:
    """Class to contain storage-related utility methods"""

    # The namespace separator
    NAMESPACE_SEPARATOR = ':/'

    @staticmethod
    def split_namespace_path(object_path: str) -> Tuple[str, str]:
        """Splits the object path into the namespace and path."""
        if object_path is None:
            return None

        namespace = ''
        namespace_index = object_path.find(StorageUtils.NAMESPACE_SEPARATOR)

        if namespace_index != -1:
            namespace = object_path[0: namespace_index]
            object_path = object_path[namespace_index + 1:]

        return (namespace, object_path)
