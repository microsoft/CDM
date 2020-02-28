# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import abc
from typing import Optional, TYPE_CHECKING

from .cdm_file_status import CdmFileStatus
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmCorpusContext, CdmDataPartitionDefinition, CdmDataPartitionPatternDefinition


class CdmEntityDeclarationDefinition(CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # The entity name.
        self.entity_name = name  # type: str

        # The entity path.
        self.entity_path = None  # type: Optional[str]

    @property
    @abc.abstractmethod
    def data_partitions(self) -> Optional['CdmCollection[CdmDataPartitionDefinition]']:
        raise NotImplementedError()

    @property
    @abc.abstractmethod
    def data_partition_patterns(self) -> Optional['CdmCollection[CdmDataPartitionPatternDefinition]']:
        raise NotImplementedError()
