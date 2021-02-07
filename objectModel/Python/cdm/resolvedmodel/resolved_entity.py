# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Iterable, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmEntityDefinition, SpewCatcher
    from cdm.resolvedmodel import ResolvedAttributeSet, ResolvedEntityReferenceSet, ResolvedTraitSet
    from cdm.utilities import ResolveOptions


class ResolvedEntity:
    def __init__(self, res_opt: 'ResolveOptions', ent_def: 'CdmEntityDefinition') -> None:
        self.entity = ent_def  # type: CdmEntityDefinition
        self.resolved_name = self.entity.entity_name  # type: str
        self.resolved_traits = self.entity._fetch_resolved_traits(res_opt)  # type: ResolvedTraitSet
        self.resolved_attributes = self.entity._fetch_resolved_attributes(res_opt)  # type: ResolvedAttributeSet
        self.resolved_entity_references = self.entity.fetch_resolved_entity_references(res_opt)  # type: ResolvedEntityReferenceSet

    @property
    def source_name(self) -> str:
        return self.entity.source_name

    @property
    def description(self) -> str:
        return self.entity.description

    @property
    def display_name(self) -> str:
        return self.entity.display_name

    @property
    def version(self) -> str:
        return self.entity.version

    @property
    def cdm_schemas(self) -> Iterable[str]:
        return self.entity.cdm_schemas

    def spew_properties(self, to: 'SpewCatcher', indent: str) -> None:
        if self.display_name:
            to.spew_line(indent + 'displayName: ' + self.display_name)
        if self.description:
            to.spew_line(indent + 'description: ' + self.description)
        if self.version:
            to.spew_line(indent + 'version: ' + self.version)
        if self.source_name:
            to.spew_line(indent + 'sourceName: ' + self.source_name)

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        to.spew_line(indent + '=====ENTITY=====')
        to.spew_line(indent + self.resolved_name)
        to.spew_line(indent + '================')
        to.spew_line(indent + 'properties:')
        self.spew_properties(to, indent + ' ')
        to.spew_line(indent + 'traits:')
        self.resolved_traits.spew(res_opt, to, indent + ' ', name_sort)
        to.spew_line('attributes:')
        if self.resolved_attributes is not None:
            self.resolved_attributes.spew(res_opt, to, indent + ' ', name_sort)
        to.spew_line('relationships:')
        self.resolved_entity_references.spew(res_opt, to, indent + ' ', name_sort)
