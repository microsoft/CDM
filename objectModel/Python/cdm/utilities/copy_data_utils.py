# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information

from typing import Union, List, Optional, TYPE_CHECKING, Callable

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmObject
    from cdm.utilities import ResolveOptions, CopyOptions


def _array_copy_data(res_opt: 'ResolveOptions', source: Union['CdmCollection', List['CdmObject']], options: 'CopyOptions', condition: Optional[Callable[['CdmObject'], bool]] = None) -> Optional[List]:
    """Creates a list object that is a copy of the input IEnumerable object"""
    if not source:
        return None

    casted = []

    for elem in source:
        if (elem and not condition) or (condition and condition(elem)):
            from cdm.persistence import PersistenceLayer
            data = PersistenceLayer.to_data(elem, res_opt, options, PersistenceLayer.CDM_FOLDER)
            casted.append(data)

    return casted