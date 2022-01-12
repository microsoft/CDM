# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence import PersistenceLayer

from . import utils
from .types import Argument, CdmJsonType

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentDefinition, CdmCorpusContext
    from cdm.utilities import CopyOptions, ResolveOptions


class ArgumentPersistence:
    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: Union[str, Argument]) -> 'CdmArgumentDefinition':
        from cdm.utilities import JObject

        argument = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF)  # type: CdmArgumentDefinition

        if isinstance(data, JObject) and data.get('value') is not None:
            argument.value = utils.create_constant(ctx, data.value)

            if data.get('name'):
                argument.name = data.name

            if data.get('explanation'):
                argument.explanation = data.explanation
        else:
            # Not a structured argument, just a thing. Try it
            argument.value = utils.create_constant(ctx, data)

        return argument

    @staticmethod
    def to_data(instance: 'CdmArgumentDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> CdmJsonType:
        from cdm.objectmodel import CdmObject

        value = None

        if instance.value is not None:
            if isinstance(instance.value, CdmObject):
                value = PersistenceLayer.to_data(instance.value, res_opt, options, PersistenceLayer.CDM_FOLDER)
            else:
                value = instance.value

        # Skip the argument if just a value
        if not instance.name:
            return value

        arg = Argument()
        arg.explanation = instance.explanation
        arg.name = instance.name
        arg.value = value
        return arg
