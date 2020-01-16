from datetime import datetime
from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import TraitReferencePersistence
from cdm.utilities import JObject, logger

from . import ArgumentPersistence, extension_helper
from .types import CsvFormatSettings

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentDefinition, CdmCorpusContext, CdmCollection, CdmTraitCollection, CdmTraitReference
    from .types import MetadataObject

annotation_to_trait_map = {
    'version': 'is.CDM.entityVersion'
}

ignored_traits = (
    'is.modelConversion.otherAnnotations',
    'is.propertyContent.multiTrait',
    'is.modelConversion.referenceModelMap',
    'is.modelConversion.modelVersion',
    'means.measurement.version',
    'is.partition.format.CSV'
)

_TAG = 'Utils'


def get_formatted_date_string(date: datetime):
    return date.isoformat() if date else None


def should_annotation_go_into_a_single_trait(name: str) -> bool:
    return name in annotation_to_trait_map


def convert_annotation_to_trait(name: str) -> str:
    return annotation_to_trait_map[name]


def create_csv_trait(obj: 'CsvFormatSettings', ctx: 'CdmCorpusContext') -> 'CdmTraitReference':
    csv_format_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.partition.format.CSV')
    csv_format_trait.simple_named_reference = False

    if obj.get('columnHeaders') is not None:
        column_headers_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'columnHeaders')
        column_headers_arg.value = str(obj.get('columnHeaders')).lower()
        csv_format_trait.arguments.append(column_headers_arg)

    if obj.get('csvStyle') is not None:
        csv_style_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'csvStyle')
        csv_style_arg.value = obj.csvStyle
        csv_format_trait.arguments.append(csv_style_arg)

    if obj.get('delimiter') is not None:
        delimiter_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'delimiter')
        delimiter_arg.value = obj.delimiter
        csv_format_trait.arguments.append(delimiter_arg)

    if obj.get('quoteStyle') is not None:
        quote_style_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'quoteStyle')
        quote_style_arg.value = obj.quoteStyle
        csv_format_trait.arguments.append(quote_style_arg)

    if obj.get('encoding') is not None:
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
                multi_trait_annotations.append(annotation)
            else:
                inner_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, convert_annotation_to_trait(annotation.name))
                inner_trait.arguments.append(await ArgumentPersistence.from_data(ctx, annotation))
                traits.append(inner_trait)

        if multi_trait_annotations:
            other_annotations_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.modelConversion.otherAnnotations', False)  # type: CdmTraitReference
            other_annotations_trait.is_from_property = True
            annotations_argument = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'annotations')  # type: CdmArgumentDefinition
            annotations_argument.value = multi_trait_annotations
            other_annotations_trait.arguments.append(annotations_argument)
            traits.append(other_annotations_trait)

        if obj.get('traits'):
            for trait in obj.get('traits'):
                traits.append(TraitReferencePersistence.from_data(ctx, trait))


async def process_annotations_to_data(ctx: 'CdmCorpusContext', entity_object: 'MetadataObject', traits: 'CdmTraitCollection'):
    if traits is None:
        return

    annotations = []
    extensions = []

    for trait in traits:
        if trait.named_reference.startswith('is.extension.'):
            extension_helper.process_extension_trait_to_object(trait, entity_object)
            continue

        if trait.named_reference == 'is.modelConversion.otherAnnotations':
            for annotation in trait.arguments[0].value:
                if isinstance(annotation, dict) and annotation.get('name'):
                    annotations.append(annotation)
                else:
                    logger.warning(_TAG, ctx, 'Unsupported annotation type.')

        elif not trait.is_from_property:
            annotation_name = trait_to_annotation_name(trait.named_reference)

            if annotation_name is not None and trait.arguments is not None \
               and isinstance(trait.arguments, list) and len(trait.arguments) == 1:
                argument = await ArgumentPersistence.to_data(trait.arguments[0], None, None)

                if argument is not None:
                    argument.name = annotation_name
                    annotations.append(argument)
            elif trait.named_reference not in ignored_traits:
                extension = TraitReferencePersistence.to_data(trait, None, None)
                extensions.append(extension)

        if annotations:
            entity_object.annotations = annotations

        if extensions:
            entity_object.traits = extensions


def trait_to_annotation_name(trait_name: str) -> str:
    if trait_name == 'is.CDM.entityVersion':
        return 'version'
    return None
