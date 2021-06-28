# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import List, Dict, Optional, Tuple, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.utilities import JObject, logger

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition, CdmImport, CdmTraitCollection, CdmTraitDefinition

cached_def_docs = {}  # type: Dict[Tuple[CdmCorpusContext, str], CdmDocumentDefinition]

convert_type_to_expected_string = {
    str: 'string',
    int: 'number',
    dict: 'object',
    OrderedDict: 'object',
    bool: 'boolean',
    list: 'object',
    type(None): 'object'
}

_TAG = 'ExtensionHelper'

EXTENSION_TRAIT_NAME_PREFIX = 'is.extension.'
EXTENSION_DOC_NAME = 'custom.extension.cdm.json'

# Set of extensions that are officially supported and have their definitions in the extensions folder.
SUPPORTED_EXTENSIONS = {"pbi"}


def add_import_docs_to_manifest(ctx: 'CdmCorpusContext', import_docs: List['CdmImport'], document: 'CdmManifestDefinition'):
    for import_doc in import_docs:
        if not list(filter(lambda import_present: import_present.corpus_path == import_doc.corpus_path, document.imports)):
            document.imports.append(import_doc)


async def fetch_def_doc(ctx: 'CdmCorpusContext', file_name: str) -> None:
    # Since the CachedDefDocs is a static property and there might be multiple corpus running,
    # we need to make sure that each corpus will have its own cached def document.
    # This is achieved by adding the context as part of the key to the document.
    key = (ctx, file_name)
    if key in cached_def_docs:
        return cached_def_docs[key]

    path = '/extensions/{}'.format(file_name)
    document = await ctx.corpus.fetch_object_async(path, ctx.corpus.storage.fetch_root_folder('cdm'))

    if document is not None:
        cached_def_docs[key] = document

    return document


async def standard_import_detection(ctx: 'CdmCorpusContext', extension_trait_def_list: List['CdmTraitDefinition'],
                                    local_extension_trait_def_list: List['CdmTraitDefinition']) -> Optional[List['CdmImport']]:
    imports_list = []
    trait_index = len(local_extension_trait_def_list) - 1
    has_custom_extension_import = False

    while trait_index >= 0:
        extension_trait_def = local_extension_trait_def_list[trait_index]

        if not extension_trait_def.trait_name or not extension_trait_def.trait_name.startswith(EXTENSION_TRAIT_NAME_PREFIX):
            logger.error(ctx, _TAG, standard_import_detection.__name__, extension_trait_def.at_corpus_path, CdmLogCode.ERR_PERSIST_INVALID_EXTENSION_TRAIT, extension_trait_def.trait_name, EXTENSION_TRAIT_NAME_PREFIX)
            return None

        extension_breakdown = extension_trait_def.trait_name[len(EXTENSION_TRAIT_NAME_PREFIX):].split(':')

        if len(extension_breakdown) > 1:
            extension_name = extension_breakdown[0]

            if extension_name not in SUPPORTED_EXTENSIONS:
                if not has_custom_extension_import:
                    import_object = ctx.corpus.make_object(CdmObjectType.IMPORT)
                    import_object.corpus_path = EXTENSION_DOC_NAME
                    imports_list.append(import_object)
                    has_custom_extension_import = True
                trait_index -= 1
                continue

            file_name = '{}.extension.cdm.json'.format(extension_name)
            file_corpus_path = 'cdm:/extensions/{}'.format(file_name)
            extension_doc = await fetch_def_doc(ctx, file_name)

            # if no document was found for that extensionName, the trait does not have a document with it's definition.
            # trait will be kept in extensionTraitDefList (a document with its definition will be created locally)
            if not extension_doc:
                trait_index -= 1
                continue

            # there is a document with extensionName, now we search for the trait in the document.
            # if we find it, we remove the trait from extensionTraitDefList and add the document to imports.
            matching_traits = [
                definition
                for definition in extension_doc.definitions
                if definition.object_type == CdmObjectType.TRAIT_DEF and definition.get_name() == extension_trait_def.trait_name
            ]

            if matching_traits:
                parameter_list = matching_traits[0].parameters

                if all(any(def_parameter.name == extension_parameter.name for def_parameter in parameter_list)
                       for extension_parameter in extension_trait_def.parameters):
                    extension_trait_def_list.remove(extension_trait_def)

                    if not any(import_doc.corpus_path == file_corpus_path for import_doc in imports_list):
                        import_object = ctx.corpus.make_object(CdmObjectType.IMPORT)
                        import_object.corpus_path = file_corpus_path
                        imports_list.append(import_object)

        trait_index -= 1

    return imports_list


def process_extension_from_json(ctx: 'CdmCorpusContext', extensions: object, trait_ref_set: 'CdmTraitCollection',
                                extension_trait_def_list: List['CdmTraitDefinition'],
                                local_extension_trait_def_list: Optional[List['CdmTraitDefinition']] = None) -> None:
    extension_keys = [extension for extension in extensions.keys() if extension.find(':') != -1]

    for extension_key in extension_keys:
        trait_name = 'is.extension.{}'.format(extension_key)
        extension_trait_defs = [trait for trait in extension_trait_def_list if trait.trait_name == trait_name]
        extension_trait_def = None
        trait_exists = bool(extension_trait_defs)

        if trait_exists:
            extension_trait_def = extension_trait_defs[0]
        else:
            extension_trait_def = ctx.corpus.make_object(CdmObjectType.TRAIT_DEF, trait_name)
            extension_trait_def.extends_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.extension', True)

        extension_trait_ref = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, trait_name)
        extension_value = extensions[extension_key]
        is_array = isinstance(extension_value, list)

        if extension_value and isinstance(extension_value, dict) and not is_array:
            extension_properties = [extension for extension in extension_value.keys() if not extension.startswith('_')]
            for extension_property in extension_properties:
                extension_property_value = extension_value[extension_property]
                extension_argument = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, extension_property)
                extension_parameters = [parameter for parameter in extension_trait_def.parameters if parameter.name == extension_property]
                extension_parameter = None
                parameter_exists = bool(extension_parameters)

                if parameter_exists:
                    extension_parameter = extension_parameters[0]
                else:
                    extension_parameter = ctx.corpus.make_object(CdmObjectType.PARAMETER_DEF, extension_property)
                    extension_parameter.data_type_ref = ctx.corpus.make_object(
                        CdmObjectType.DATA_TYPE_REF,
                        convert_type_to_expected_string[type(extension_property_value)],
                        True)

                extension_argument.value = extension_property_value
                extension_trait_ref.arguments.append(extension_argument)

                if not parameter_exists:
                    extension_trait_def.parameters.append(extension_parameter)
        else:
            extension_argument = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, trait_name)
            extension_parameters = [
                parameter for parameter in extension_trait_def.parameters if parameter.name == trait_name
            ]
            extension_parameter = None
            parameter_exists = bool(extension_parameters)

            if parameter_exists:
                extension_parameter = extension_parameters[0]
            else:
                extension_parameter = ctx.corpus.make_object(CdmObjectType.PARAMETER_DEF, trait_name)
                extension_parameter.data_type_ref = ctx.corpus.make_object(
                    CdmObjectType.DATA_TYPE_REF,
                    convert_type_to_expected_string[type(extension_value)],
                    True)

            extension_argument.value = extension_value
            extension_trait_ref.arguments.append(extension_argument)

            if not parameter_exists:
                extension_trait_def.parameters.append(extension_parameter)

        if not trait_exists:
            extension_trait_def_list.append(extension_trait_def)

        if local_extension_trait_def_list is not None:
            local_extension_trait_def_list.append(extension_trait_def)

        trait_ref_set.append(extension_trait_ref)


def process_extension_trait_to_object(extension_trait_ref: 'CdmTraitReference', add_property_to: 'JObject'):
    # TODO: Another magic number
    original_prop_name = extension_trait_ref.named_reference[13:]
    if len(extension_trait_ref.arguments) == 1 and \
            extension_trait_ref.arguments[0].name == extension_trait_ref.named_reference:

        add_property_to[original_prop_name] = extension_trait_ref.arguments[0].value
        return

    value_object = {}

    for argument in extension_trait_ref.arguments:
        value_object[argument.name] = argument.value

    add_property_to[original_prop_name] = value_object
