# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .types import Annotation

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentDefinition, CdmCorpusContext
    from cdm.utilities import CopyOptions, ResolveOptions


class ArgumentPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', obj: 'Annotation') -> 'CdmArgumentDefinition':
        arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, obj.name)
        arg.name = obj.name
        arg.value = obj.value

        return arg

    @staticmethod
    async def to_data(instance: 'CdmArgumentDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> Optional['Annotation']:
        if isinstance(instance.value, str):
            annotation = Annotation()
            annotation.name = instance.name
            annotation.value = instance.value

            return annotation
