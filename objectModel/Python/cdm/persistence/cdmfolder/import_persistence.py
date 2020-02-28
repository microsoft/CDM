# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmImport
from cdm.utilities import ResolveOptions, CopyOptions

from .types import Import


class ImportPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, obj: Import) -> CdmImport:
        imp = ctx.corpus.make_object(CdmObjectType.IMPORT)
        corpus_path = obj.get('corpusPath')

        if not corpus_path:
            corpus_path = obj.uri

        imp.corpus_path = corpus_path
        imp.moniker = obj.get('moniker')

        return imp

    @staticmethod
    def to_data(instance: CdmImport, res_opt: ResolveOptions, options: CopyOptions) -> Import:
        result = Import()
        result.corpusPath = instance.corpus_path
        result.moniker = instance.moniker

        return result
