import { readFileSync } from 'fs';
import { ArgumentPersistence } from '.';
import {
    CdmArgumentDefinition,
    CdmCollection,
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitCollection,
    CdmTraitReference,
    Logger
} from '../../internal';
import { TraitReferencePersistence } from '../CdmFolder';
import { CdmJsonType, TraitReference } from '../CdmFolder/types';
import { processExtensionTraitToObject, traitRefIsExtension } from './ExtensionHelper';
import { Annotation, AnnotationTraitMapping, CsvFormatSettings, MetadataObject } from './types';

const annotationToTraitMap: Map<string, string> = new Map([['version', 'is.CDM.entityVersion']]);

const ignoredTraits: Set<string> = new Set<string>().add('is.modelConversion.otherAnnotations')
    .add('is.propertyContent.multiTrait')
    .add('is.modelConversion.referenceModelMap')
    .add('is.modelConversion.modelVersion')
    .add('means.measurement.version')
    .add('is.partition.format.CSV');

export function shouldAnnotationGoIntoASingleTrait(name: string): boolean {
    return annotationToTraitMap.has(name);
}

export function convertAnnotationToTrait(name: string): string {
    return annotationToTraitMap.get(name);
}

export function readAnnotationToTrait(): void {
    const readFile: string = readFileSync('Configs/annotationToTrait.json')
        .toString();

    const fileObj: AnnotationTraitMapping[] = JSON.parse(readFile);

    fileObj.forEach((el: AnnotationTraitMapping) => {
        annotationToTraitMap.set(el.annotationName, el.traitValue);
    });
}

export function createCsvTrait(object: CsvFormatSettings, ctx: CdmCorpusContext): CdmTraitReference {
    const csvFormatTrait: CdmTraitReference = ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.partition.format.CSV');
    csvFormatTrait.simpleNamedReference = false;

    if (object.columnHeaders !== undefined) {
        const columnHeadersArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'columnHeaders');
        columnHeadersArg.value = object.columnHeaders ? 'true' : 'false';
        csvFormatTrait.arguments.push(columnHeadersArg);
    }

    if (object.csvStyle !== undefined) {
        const csvStyleArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'csvStyle');
        csvStyleArg.value = object.csvStyle;
        csvFormatTrait.arguments.push(csvStyleArg);
    }

    if (object.delimiter !== undefined) {
        const delimiterArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'delimiter');
        delimiterArg.value = object.delimiter;
        csvFormatTrait.arguments.push(delimiterArg);
    }

    if (object.quoteStyle !== undefined) {
        const quoteStyleArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'quoteStyle');
        quoteStyleArg.value = object.quoteStyle;
        csvFormatTrait.arguments.push(quoteStyleArg);
    }

    if (object.encoding !== undefined) {
        const encodingArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'encoding');
        encodingArg.value = object.encoding;
        csvFormatTrait.arguments.push(encodingArg);
    }

    return csvFormatTrait;
}

export function createCsvFormatSettings(csvFormatTrait: CdmTraitReference): CsvFormatSettings {
    const result: CsvFormatSettings = <CsvFormatSettings>{};

    for (const argument of csvFormatTrait.arguments.allItems) {
        if (argument.name === 'columnHeaders') {
            result.columnHeaders = argument.value === 'true';
        }

        if (argument.name === 'csvStyle') {
            result.csvStyle = argument.value as string;
        }

        if (argument.name === 'delimiter') {
            result.delimiter = argument.value as string;
        }

        if (argument.name === 'quoteStyle') {
            result.quoteStyle = argument.value as string;
        }

        if (argument.name === 'encoding') {
            result.encoding = argument.value as string;
        }
    }

    return result;
}

export async function processAnnotationsFromData(ctx: CdmCorpusContext, object: MetadataObject, traits: CdmTraitCollection)
    : Promise<void> {
    const multiTraitAnnotations: Annotation[] = [];

    if (object.annotations !== undefined) {
        for (const annotation of object.annotations) {
            if (!shouldAnnotationGoIntoASingleTrait(annotation.name)) {
                multiTraitAnnotations.push(annotation);
            } else {
                const innerTrait: CdmTraitReference =
                    ctx.corpus.MakeObject(cdmObjectType.traitRef, convertAnnotationToTrait(annotation.name));
                innerTrait.arguments.push(await ArgumentPersistence.fromData(ctx, annotation));
                traits.push(innerTrait);
            }
        }

        if (multiTraitAnnotations.length > 0) {
            const trait: CdmTraitReference =
                ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.modelConversion.otherAnnotations', false);
            trait.isFromProperty = true;

            const annotationsArguemnt: CdmArgumentDefinition = new CdmArgumentDefinition(ctx, 'annotations');
            annotationsArguemnt.value = multiTraitAnnotations;
            trait.arguments.push(annotationsArguemnt);
            traits.push(trait);
        }

        if (object['cdm:traits'] !== undefined) {
            object['cdm:traits'].forEach((trait: string | TraitReference) => {
                traits.push(TraitReferencePersistence.fromData(ctx, trait));
            });
        }
    }
}

export async function processAnnotationsToData(
    ctx: CdmCorpusContext,
    entityObject: MetadataObject,
    traits: CdmTraitCollection): Promise<void> {
    if (traits === undefined) {
        return;
    }

    const annotations: Annotation[] = [];

    const extensions: CdmJsonType[] = [];

    for (const trait of traits) {
        if (traitRefIsExtension(trait)) {
            processExtensionTraitToObject(trait, entityObject);

            continue;
        }

        if (trait.namedReference === 'is.modelConversion.otherAnnotations') {
            for (const annotation of (trait.arguments.allItems[0].value as any)) {
                if (typeof annotation === 'object') {
                    annotations.push(annotation);
                } else {
                    Logger.warning('Utils', ctx, 'Unsupported annotation type.');
                }
            }
        } else if (!trait.isFromProperty) {
            const annotationName: string = traitToAnnotationName(trait.namedReference);

            if (annotationName !== undefined && trait.arguments !== undefined && trait.arguments.allItems !== undefined
                && trait.arguments.length === 1) {
                const argument: Annotation = await ArgumentPersistence.toData(trait.arguments.allItems[0], undefined, undefined);

                if (argument !== undefined) {
                    argument.name = annotationName;
                    annotations.push(argument);
                }
            } else if (!ignoredTraits.has(trait.namedReference)) {
                const extension: CdmJsonType = TraitReferencePersistence.toData(trait, undefined, undefined);
                extensions.push(extension);
            }
        }

        if (annotations.length > 0) {
            entityObject.annotations = annotations;
        }

        if (extensions.length > 0) {
            entityObject['cdm:traits'] = extensions;
        }
    }
}

export function traitToAnnotationName(traitName: string): string {
    if (traitName === 'is.CDM.entityVersion') {
        return 'version';
    }

    return undefined;
}
