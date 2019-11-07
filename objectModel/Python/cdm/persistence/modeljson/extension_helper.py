from collections import OrderedDict
from typing import List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import JObject

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmCorpusContext, CdmDocumentDefinition, CdmImport, CdmParameterDefinition, CdmTraitCollection, CdmTraitDefinition

cached_def_docs = {}  # type: Dict[str, CdmDocumentDefinition]

# TODO: confirm this mapping
convert_type_to_expected_string = {
    str: 'string',
    int: 'number',
    dict: 'object',
    OrderedDict: 'object',
    bool: 'boolean',
    list: 'array',
    type(None): 'object'
}


async def fetch_def_doc(ctx: 'CdmCorpusContext', file_name: str) -> None:
    if file_name in cached_def_docs:
        return cached_def_docs[file_name]

    path = '/extensions/{}'.format(file_name)
    document = await ctx.corpus.fetch_object_async(path, ctx.corpus.storage.fetch_root_folder('cdm'))

    cached_def_docs[file_name] = document

    return document


async def standard_import_detection(ctx: 'CdmCorpusContext', extension_trait_def_list: List['CdmTraitDefinition']) -> Optional[List['CdmImport']]:
    imports_list = []
    trait_index = 0

    while trait_index < len(extension_trait_def_list):
        extension_trait_def = extension_trait_def_list[trait_index]

        if not extension_trait_def.trait_name.startswith('is.extension.'):
            ctx.logger.error('Invalid extension trait name %s', extension_trait_def.trait_name)
            return None

        # TODO: Magic number is?
        extension_breakdown = extension_trait_def.trait_name[13:].split(':')

        if len(extension_breakdown) > 1:
            extension_name = extension_breakdown[0]
            file_name = '{}.extension.cdm.json'.format(extension_name)
            file_corpus_path = 'cdm:/extensions/{}'.format(file_name)
            extension_doc = await fetch_def_doc(ctx, file_name)

            if not extension_doc:
                trait_index += 1
                continue

            matching_traits = [
                definition
                for definition in extension_doc.definitions
                if definition.object_type == CdmObjectType.TRAIT_DEF and definition.get_name() == extension_trait_def.trait_name
            ]

            if matching_traits:
                parameter_list = matching_traits[0].parameters

                # TODO: This needs some heavy testing
                if all(
                        any(def_parameter.name == extension_parameter.name for def_parameter in parameter_list)
                        for extension_parameter in extension_trait_def.parameters):
                    extension_trait_def_list.pop(trait_index)
                    trait_index -= 1

                    if not any(import_doc.corpus_path == file_corpus_path for import_doc in imports_list):
                        import_object = ctx.corpus.make_object(CdmObjectType.IMPORT)
                        import_object.corpus_path = file_corpus_path
                        imports_list.append(import_object)

        trait_index += 1

    return imports_list


async def process_extension_from_json(ctx: 'CdmCorpusContext', extensions: object, trait_ref_set: 'CdmTraitCollection',
                                      extension_trait_def_list: List['CdmTraitDefinition']):
    extension_keys = [extension for extension in extensions.keys() if extension.find(':') != -1]

    for extension_key in extension_keys:
        trait_name = 'is.extension.{}'.format(extension_key)
        extension_trait_ref = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, trait_name)
        extension_trait_defs = [trait for trait in extension_trait_def_list if trait.trait_name == trait_name]
        extension_trait_def = None
        trait_exists = bool(extension_trait_defs)

        if trait_exists:
            extension_trait_def = extension_trait_defs[0]
        else:
            extension_trait_def = ctx.corpus.make_object(CdmObjectType.TRAIT_DEF, trait_name)
            extension_trait_def.extends_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.extension', True)

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
