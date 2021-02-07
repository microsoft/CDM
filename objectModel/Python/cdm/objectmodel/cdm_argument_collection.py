# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_argument_def import CdmArgumentDefinition


class CdmArgumentCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmTraitReference'):
        super().__init__(ctx, owner, CdmObjectType.ARGUMENT_DEF)

    def append(self, argument: Union[str, 'CdmArgumentDefinition'], value: Any = None) -> 'CdmArgumentDefinition':
        """Creates an argument based on the name and value provided and adds it to the collection."""

        from .cdm_argument_def import CdmArgumentDefinition

        argument = CdmArgumentDefinition(self.ctx, argument) if isinstance(argument, (str, type(None))) else argument
        if value is not None:
            argument.value = value

        self.owner._resolved_arguments = False
        return super().append(argument)

    def fetch_value(self, name: str):
        """
        Retrieves the value of the argument with the provided name.
        If no argument with provided name is found and there is only one argument with null name, retrieves the value of this argument.
        """

        for argument in self:
            if argument.name == name:
                return argument.value

        # special case with only one argument and no name give, make a big assumption that this is the one they want
        # right way is to look up parameter def and check name, but this public interface is for working on an unresolved def
        if len(self) == 1 and self[0].name is None:
            return self[0].value

        return None

    def insert(self, index: int, obj: 'CdmArgumentDefinition') -> None:
        self.owner._resolved_arguments = False
        return super().insert(index, obj)

    def update_argument(self, name: str, value: Any):
        """Updates the value of an existing argument, or, in case no argument is found with the provided name, an argument is created and added."""
        self._make_document_dirty()

        for argument in self:
            if argument.name == name:
                argument.value = value
                return
        self.append(name, value)
