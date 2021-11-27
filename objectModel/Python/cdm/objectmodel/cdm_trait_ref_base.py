# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import abstractmethod

from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, VisitCallback
from cdm.objectmodel import CdmObjectReference

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmObjectDefinition


class CdmTraitReferenceBase(CdmObjectReference):
    """
    The CDM definition base for a generic reference to either a trait or a trait group.
    """
    def __init__(self, ctx: 'CdmCorpusContext', reference_to: Union[str, 'CdmObjectDefinition'], simple_named_reference: bool) -> None:
        super().__init__(ctx, reference_to, simple_named_reference)

    @property
    @abstractmethod
    def object_type(self) -> 'CdmObjectType':
        raise NotImplementedError('Please use derived classes of this base class.')

    @abstractmethod
    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmObjectDefinition'],
                         simple_reference: bool, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        raise NotImplementedError('Please use derived classes of this base class.')

    @abstractmethod
    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        raise NotImplementedError('Please use derived classes of this base class.')
