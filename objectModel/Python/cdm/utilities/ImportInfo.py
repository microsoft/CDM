# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.


class ImportInfo:
    """Contains information about an import in the imports priority map"""
    def __init__(self, priority,  is_moniker):
        # The priority that the import has with respect to the document where it is imported.
        self.priority = priority  # type: int

        # If the import has a moniker or not.
        self.is_moniker = is_moniker  # type: bool
