# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDeclarationDefinition
from cdm.utilities import CopyOptions, ResolveOptions, time_utils

from .types import ManifestDeclaration


class ManifestDeclarationPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: ManifestDeclaration) -> CdmManifestDeclarationDefinition:

        manifest_name = data.manifestName if data.get('manifestName') else data.folioName
        manifest_declaration = ctx.corpus.make_object(CdmObjectType.MANIFEST_DECLARATION_DEF, manifest_name)
        manifest_declaration.definition = data.definition
        manifest_declaration.explanation = data.get('explanation')

        if data.get('lastFileStatusCheckTime'):
            manifest_declaration.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            manifest_declaration.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        return manifest_declaration

    @staticmethod
    def to_data(instance: CdmManifestDeclarationDefinition, res_opt: ResolveOptions, options: CopyOptions) -> ManifestDeclaration:
        data = ManifestDeclaration()

        data.manifestName = instance.manifest_name
        data.definition = instance.definition
        data.explanation = instance.explanation
        data.lastFileStatusCheckTime = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        data.lastFileModifiedTime = time_utils._get_formatted_date_string(instance.last_file_modified_time)

        return data
