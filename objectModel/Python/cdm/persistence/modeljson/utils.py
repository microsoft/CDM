# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime
from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmTraitReference, CdmTraitReferenceBase
from cdm.persistence.cdmfolder import TraitReferencePersistence, TraitGroupReferencePersistence
from cdm.utilities import logger

from . import ArgumentPersistence, extension_helper
from .types import CsvFormatSettings
from cdm.persistence.modeljson.types import Annotation
from cdm.utilities.namevaluepair import NameValuePair

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentDefinition, CdmCorpusContext, CdmTraitCollection, \
        CdmTraitReference, CdmTraitGroupReference
    from .types import MetadataObject

annotation_to_trait_map = {
    'version': 'is.CDM.entityVersion'
}

trait_to_annotation_map = {
    'is.CDM.entityVersion': 'version'
}

ignored_traits = {
    'is.propertyContent.multiTrait',
    'is.modelConversion.referenceModelMap',
    'is.modelConversion.modelVersion',
    'means.measurement.version',
    'is.CDM.entityVersion',
    'is.partition.culture',
    'is.managedBy',
    'is.hidden'
}

# Traits to ignore if they come from properties.
# These traits become properties on the model.json. To avoid persisting both a trait
# and a property on the model.json, we filter these traits out.
model_json_property_traits = {
    'is.localized.describedAs'
}

# Arguments natively supported by the fileFormatSettings property.
partition_settings_supported_arguments = {
    'columnHeaders', 'csvStyle', 'delimiter', 'quoteStyle', 'encoding'
}

_TAG = 'Utils'


def get_formatted_date_string(date: datetime):
    return date.isoformat() if date else None


def should_annotation_go_into_a_single_trait(name: str) -> bool:
    return name in annotation_to_trait_map


def convert_annotation_to_trait(name: str) -> str:
    return annotation_to_trait_map[name]


def convert_trait_to_annotation(name: str) -> str:
    return trait_to_annotation_map[name]

def should_persist_trait(trait_base: CdmTraitReferenceBase):
    if trait_base.object_type != CdmObjectType.TRAIT_REF:
        return True

    trait = trait_base  # type: CdmTraitReference

    if trait.named_reference == 'is.partition.format.CSV':
        argument_names = set([argument.name for argument in trait.arguments if argument.name is not None])

        # Checks if the trait contains arguments that are not supported natively by the model.json CsvFormatSettings property.
        return len(argument_names.difference(partition_settings_supported_arguments)) > 0

    return True


def create_csv_trait(obj: 'CsvFormatSettings', ctx: 'CdmCorpusContext', host: 'CdmTraitReference') -> 'CdmTraitReference':
    csv_format_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.partition.format.CSV', False) if not host else host
    argument_names = set([argument.name for argument in csv_format_trait.arguments if argument.name is not None])

    if obj.get('columnHeaders') is not None and 'columnHeaders' not in argument_names:
        column_headers_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'columnHeaders')
        column_headers_arg.value = str(obj.get('columnHeaders')).lower()
        csv_format_trait.arguments.append(column_headers_arg)

    if obj.get('csvStyle') is not None and 'csvStyle' not in argument_names:
        csv_style_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'csvStyle')
        csv_style_arg.value = obj.csvStyle
        csv_format_trait.arguments.append(csv_style_arg)

    if obj.get('delimiter') is not None and 'delimiter' not in argument_names:
        delimiter_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'delimiter')
        delimiter_arg.value = obj.delimiter
        csv_format_trait.arguments.append(delimiter_arg)

    if obj.get('quoteStyle') is not None and 'quoteStyle' not in argument_names:
        quote_style_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'quoteStyle')
        quote_style_arg.value = obj.quoteStyle
        csv_format_trait.arguments.append(quote_style_arg)

    if obj.get('encoding') is not None and 'encoding' not in argument_names:
        encoding_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'encoding')
        encoding_arg.value = obj.encoding
        csv_format_trait.arguments.append(encoding_arg)

    return csv_format_trait


def create_csv_format_settings(csv_format_trait: 'CdmTraitReference') -> 'CsvFormatSettings':
    result = CsvFormatSettings()

    for argument in csv_format_trait.arguments:
        if argument.name == 'columnHeaders':
            result.columnHeaders = argument.value if isinstance(argument.value, bool) else argument.value == 'true'

        if argument.name == 'csvStyle':
            result.csvStyle = argument.value

        if argument.name == 'delimiter':
            result.delimiter = argument.value

        if argument.name == 'quoteStyle':
            result.quoteStyle = argument.value

        if argument.name == 'encoding':
            result.encoding = argument.value

    return result


async def process_annotations_from_data(ctx: 'CdmCorpusContext', obj: 'MetadataObject', traits: 'CdmTraitCollection'):
    multi_trait_annotations = []

    if obj.get('annotations'):
        for annotation in obj.get('annotations'):
            if not should_annotation_go_into_a_single_trait(annotation.name):
                cdm_element = NameValuePair()
                cdm_element.name = annotation.name
                cdm_element.value = annotation.value
                multi_trait_annotations.append(cdm_element)
            else:
                inner_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, convert_annotation_to_trait(annotation.name))
                inner_trait.arguments.append(await ArgumentPersistence.from_data(ctx, annotation))
                traits.append(inner_trait)

        if multi_trait_annotations:
            other_annotations_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.modelConversion.otherAnnotations', False)  # type: CdmTraitReference
            other_annotations_trait.is_from_property = False
            annotations_argument = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'annotations')  # type: CdmArgumentDefinition
            annotations_argument.value = multi_trait_annotations
            other_annotations_trait.arguments.append(annotations_argument)
            traits.append(other_annotations_trait)

    if obj.get('traits'):
        for trait in obj.get('traits'):
            if not isinstance(trait, str) and trait.traitGroupReference is not None:
                traits.append(TraitGroupReferencePersistence.from_data(ctx, trait))
            else:
                traits.append(TraitReferencePersistence.from_data(ctx, trait))


async def process_traits_and_annotations_to_data(ctx: 'CdmCorpusContext', entity_object: 'MetadataObject', traits: 'CdmTraitCollection'):
    if traits is None:
        return

    annotations = []
    extensions = []

    for trait in traits:
        if trait.named_reference.startswith('is.extension.'):
            extension_helper.process_extension_trait_to_object(trait, entity_object)
        elif trait.named_reference == 'is.modelConversion.otherAnnotations':
            for annotation in trait.arguments[0].value:
                if isinstance(annotation, NameValuePair):
                    element = Annotation()
                    element.name = annotation.name
                    element.value = annotation.value
                    annotations.append(element)
                elif isinstance(annotation, dict) and annotation.get('name'):
                    annotations.append(annotation)
                else:
                    logger.warning(ctx, _TAG, process_traits_and_annotations_to_data.__name__, None,
                                   CdmLogCode.WARN_ANNOTATION_TYPE_NOT_SUPPORTED)
        elif isinstance(trait, CdmTraitReference) and trait.named_reference in trait_to_annotation_map:
            element = await ArgumentPersistence.to_data(trait.arguments[0], None, None)
            element.name = convert_trait_to_annotation(trait.named_reference)
            annotations.append(element)
        elif trait.named_reference not in ignored_traits and not trait.named_reference.startswith('is.dataFormat') \
                and not (trait.named_reference in model_json_property_traits \
                and trait.object_type == CdmObjectType.TRAIT_REF and trait.is_from_property) \
                and should_persist_trait(trait):
            if trait.object_type == CdmObjectType.TRAIT_GROUP_REF:
                extension = TraitGroupReferencePersistence.to_data(trait, None, None)
            else:
                extension = TraitReferencePersistence.to_data(trait, None, None)
            extensions.append(extension)

        if annotations:
            entity_object.annotations = annotations

        if extensions:
            entity_object.traits = extensions
