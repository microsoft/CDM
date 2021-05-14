// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmArgumentDefinition,
    CdmAttributeGroupDefinition,
    CdmCollection,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmDataTypeDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmImport,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    CdmParameterDefinition,
    CdmPurposeDefinition,
    CdmTraitCollection,
    CdmTraitDefinition,
    CdmTraitReference,
    CdmTraitReferenceBase,
    Logger
} from '../../internal';
import { isCdmTraitDefinition } from '../../Utilities/cdmObjectTypeGuards';

/**
 * Dictionary used to cache documents with trait definitions by file name.
 */
const cachedDefDocs: { [key: string]: CdmDocumentDefinition } = {};

/**
 * Set of extensions that are officially supported and have their definitions in the extensions folder.
 */
const supportedExtensions: Set<string> = new Set(['pbi']);

/**
 * Constant used to store the prefix that is the mark of extension traits.
 */
const extensionTraitNamePrefix: string = 'is.extension.';

export const extensionDocName: string = 'custom.extension.cdm.json';

/**
 * Adds the list of documents with extensions schema definitions to the manifest.
 * @param ctx The context
 * @param importDocs The list of paths of documents with relevant schema definitions. 
 * @param document The manifest that needs to import the docs.
 */
export function addImportDocsToManifest(ctx: CdmCorpusContext, importDocs: CdmImport[], document: CdmDocumentDefinition): void {
    for (const importDoc of importDocs) {
        if (!document.imports.allItems.find((importPresent: CdmImport) => importPresent.corpusPath === importDoc.corpusPath)) {
            document.imports.push(importDoc);
        }
    }
}

/**
 * For all the definitions (name, type) we have found for extensions, search in CDM Standard Schema for definition files.
 * If we find a definition in a CDM Standard Schema file, we add that file to importsList.
 * At the same time, the found definition is removed from extensionTraitDefList.
 * When this function returns, extensionTraitDefList only contains definitions that are not present in any CDM Standard Schema file,
 * and a list of CDM Standard Schema files with relevant definitions is returned.
 * @param ctx  The context
 * @param extensionTraitDefList The list of all definitions for all found extensions.
 * Function modifies this list by removing definitions found in CDM Standard Schema files.
 * @param localExtensionTraitDefList The list of all definitions for all found extensions in local scope.
 * @returns A list of CDM Standard Schema files to import.
 */
export async function standardImportDetection(
    ctx: CdmCorpusContext,
    extensionTraitDefList: CdmTraitDefinition[],
    localExtensionTraitDefList: CdmTraitDefinition[]): Promise<CdmImport[]> {
    const importsList: CdmImport[] = [];
    let hasCustomExtensionImport: boolean = false;

    for (let traitIndex: number = localExtensionTraitDefList.length - 1; traitIndex >= 0; traitIndex--) {
        const extensionTraitDef: CdmTraitDefinition = localExtensionTraitDefList[traitIndex];
        if (!traitDefIsExtension(extensionTraitDef)) {
            Logger.error(this.ctx, this.TAG, this.standardImportDetection.name, null, cdmLogCode.ErrPersistInvalidExtensionTrait, extensionTraitDef.traitName, extensionTraitNamePrefix);
            return undefined;
        }

        const extensionBreakdown: string[] = removeExtensionTraitNamePrefix(extensionTraitDef.traitName)
            .split(':');
        if (extensionBreakdown.length > 1) {
            const extensionName: string = extensionBreakdown[0];

            if (!supportedExtensions.has(extensionName)) {
                if (!hasCustomExtensionImport) {
                    const importObject: CdmImport = ctx.corpus.MakeObject<CdmImport>(cdmObjectType.import);
                    importObject.corpusPath = extensionDocName;
                    importsList.push(importObject);
                    hasCustomExtensionImport = true;
                }
                continue;
            }
            const fileName: string = `${extensionName}.extension.cdm.json`;
            const fileCorpusPath: string = `cdm:/extensions/${fileName}`;
            const extensionDoc: CdmDocumentDefinition = await fetchDefDoc(ctx, fileName);

            /**
             * If no document was found for that extensionName, the trait does not have a document with it's definition.
             * Trait will be kept in extensionTraitDefList (a document with its definition will be created locally)
             */
            if (extensionDoc === undefined) {
                continue;
            }

            /**
             * There is a document with extensionName, now we search for the trait in this document.
             * If we find it, we remove the trait from extensionTraitDefList and add the document to imports
             */
            const matchingTrait: CdmTraitDefinition = extensionDoc.definitions.allItems.find(
                (
                    definition:
                        | CdmTraitDefinition
                        | CdmDataTypeDefinition
                        | CdmPurposeDefinition
                        | CdmAttributeGroupDefinition
                        | CdmEntityDefinition
                        | CdmConstantEntityDefinition
                ) => isCdmTraitDefinition(definition) && definition.getName() === extensionTraitDef.traitName
            ) as CdmTraitDefinition;
            if (matchingTrait) {
                const parameterList: CdmCollection<CdmParameterDefinition> = matchingTrait.parameters;
                if (
                    !extensionTraitDef.parameters.allItems.some(
                        (extensionParameter: CdmParameterDefinition): boolean =>
                            !parameterList.allItems.some(
                                (defParameter: CdmParameterDefinition): boolean => defParameter.name === extensionParameter.name
                            )
                    )
                ) {
                    extensionTraitDefList.splice(extensionTraitDefList.indexOf(extensionTraitDef), 1);

                    if (!importsList.some((importDoc: CdmImport) => importDoc.corpusPath === fileCorpusPath)) {
                        const importObject: CdmImport = ctx.corpus.MakeObject<CdmImport>(cdmObjectType.import);
                        importObject.corpusPath = fileCorpusPath;
                        importsList.push(importObject);
                    }
                }
            }
        }
    }

    return importsList;
}

export function processExtensionFromJson(
    ctx: CdmCorpusContext,
    sourceObject: object,
    baseProperties: string[],
    traitRefSet: CdmTraitCollection,
    extensionTraitDefList: CdmTraitDefinition[],
    localExtensionTraitDefList?: CdmTraitDefinition[]
): void {
    const extensionKeys: string[] = Object.keys(sourceObject);

    for (const baseKey of baseProperties) {
        const index: number = extensionKeys.indexOf(baseKey);
        if (index > -1) {
            extensionKeys.splice(index, 1);
        }
    }

    for (const extensionKey of extensionKeys) {
        const traitName: string = addExtensionTraitNamePrefix(extensionKey);
        let extensionTraitDef: CdmTraitDefinition =
            extensionTraitDefList.find((trait: CdmTraitDefinition) => trait.traitName === traitName);
        const traitExists: boolean = !!extensionTraitDef;
        if (!traitExists) {
            extensionTraitDef = ctx.corpus.MakeObject<CdmTraitDefinition>(cdmObjectType.traitDef, traitName);
            extensionTraitDef.extendsTrait = ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, 'is.extension', true);
        }
        const extensionTraitRef: CdmTraitReference = ctx.corpus.MakeObject<CdmTraitReference>(cdmObjectType.traitRef, traitName);
        const extensionValue = sourceObject[extensionKey];
        const isArray: boolean = Array.isArray(extensionValue);
        if (extensionValue !== null && typeof extensionValue === 'object' && !isArray) {
            const extVals = Object.keys(extensionValue)
                .filter((extension: string) => !extension.startsWith('_'));
            for (const extensionProperty of extVals) {
                const extensionPropertyValue: object = extensionValue[extensionProperty];
                const extensionArgument: CdmArgumentDefinition = ctx.corpus.MakeObject<CdmArgumentDefinition>(
                    cdmObjectType.argumentDef,
                    extensionProperty
                );
                let extensionParameter: CdmParameterDefinition = extensionTraitDef.parameters.allItems.find(
                    (parameter: CdmParameterDefinition) => parameter.name === extensionProperty
                );
                const parameterExists: boolean = !!extensionParameter;
                if (!parameterExists) {
                    extensionParameter = ctx.corpus.MakeObject<CdmParameterDefinition>(cdmObjectType.parameterDef, extensionProperty);
                    extensionParameter.dataTypeRef = ctx.corpus.MakeObject<CdmDataTypeReference>(
                        cdmObjectType.dataTypeRef,
                        convertObjectTypeToString(typeof extensionPropertyValue),
                        true
                    );
                }
                extensionArgument.value = extensionPropertyValue;
                extensionTraitRef.arguments.push(extensionArgument);
                if (!parameterExists) {
                    extensionTraitDef.parameters.push(extensionParameter);
                }
            }
        } else {
            const extensionArgument: CdmArgumentDefinition =
                ctx.corpus.MakeObject<CdmArgumentDefinition>(cdmObjectType.argumentDef, traitName);
            let extensionParameter: CdmParameterDefinition = extensionTraitDef.parameters.allItems.find(
                (parameter: CdmParameterDefinition) => parameter.name === traitName
            );
            const parameterExists: boolean = !!extensionParameter;
            if (!parameterExists) {
                extensionParameter = ctx.corpus.MakeObject<CdmParameterDefinition>(cdmObjectType.parameterDef, traitName);
                extensionParameter.dataTypeRef = ctx.corpus.MakeObject<CdmDataTypeReference>(
                    cdmObjectType.dataTypeRef,
                    convertObjectTypeToString(typeof extensionValue),
                    true
                );
            }

            extensionArgument.value = extensionValue;
            extensionTraitRef.arguments.push(extensionArgument);
            if (!parameterExists) {
                extensionTraitDef.parameters.push(extensionParameter);
            }
        }

        if (!traitExists) {
            extensionTraitDefList.push(extensionTraitDef);
        }

        if (localExtensionTraitDefList) {
            localExtensionTraitDefList.push(extensionTraitDef);
        }

        traitRefSet.push(extensionTraitRef);
    }
}

export function convertObjectTypeToString(objType: string): string {
    return objType === 'array' ? 'object' : objType;
}

export function processExtensionTraitToObject(extensionTraitRef: CdmTraitReference, destination: object): void {
    const originalPropName: string = extensionTraitRef.namedReference.substr(13);
    if (extensionTraitRef.arguments.length === 1 && extensionTraitRef.arguments.allItems[0].name === extensionTraitRef.namedReference) {
        destination[originalPropName] = extensionTraitRef.arguments.allItems[0].value;

        return;
    }

    const valueObject: object = {};

    for (const argument of extensionTraitRef.arguments) {
        valueObject[argument.name] = argument.value;
    }

    destination[originalPropName] = valueObject;
}

/**
 * Checks whether the trait reference base is an extension (by checking whether its name has the extension prefix)
 * @param trait The trait to be checked
 * @returns Whether the trait is an extension.
 */
export function traitRefIsExtension(trait: CdmTraitReferenceBase): boolean {
    return traitNameHasExtensionMark(trait.namedReference);
}

/**
 * Tries to fetch the document with definitions that corresponds to the provided fileName.
 * Caches results in a dictionary.
 * Returns null if no such document was found.
 * @param ctx The context
 * @param fileName The name of the file to be fetched or retrieved from the cache.
 * @returns The retrieved document or null if no such document was found.
 */
async function fetchDefDoc(ctx: CdmCorpusContext, fileName: string): Promise<CdmDocumentDefinition> {
    if (cachedDefDocs[fileName] !== undefined) {
        /**
         * We already loaded this document and it is in the cache (dictionary)
         */
        return cachedDefDocs[fileName];
    }

    /**
     * We retrieve the document and cache in the dictionary for future reference.
     */
    const path: string = `/extensions/${fileName}`;
    const absPath: string = ctx.corpus.storage.createAbsoluteCorpusPath(path, ctx.corpus.storage.fetchRootFolder('cdm'));
    const document: CdmObject = await ctx.corpus.fetchObjectAsync(absPath);
    if (document) {
        const extensionDoc: CdmDocumentDefinition = document as CdmDocumentDefinition;
        cachedDefDocs[fileName] = extensionDoc;

        return extensionDoc;
    }
}

/**
 * Checks whether a trait name has the specific mark of an extension.
 * @param traitName The name of the trait that is to be checked whether it has the extension mark.
 * @returns Whether the traitName has the mark of an extension.
 */
function traitNameHasExtensionMark(traitName: string): boolean {
    if (!traitName) {
        return false;
    }

    return traitName.startsWith(extensionTraitNamePrefix);
}

/**
 * Checks whether a trait definition is an extension.
 * @param trait The trait to be checked
 * @returns Whether the trait is an extension.
 */
function traitDefIsExtension(trait: CdmTraitDefinition): boolean {
    return traitNameHasExtensionMark(trait.traitName);
}

/**
 * Removes the prefix that was added to the traitName to mark it as an extension.
 * @param traitName The name of the trait that contains the  extension prefix.
 * @returns The name of the trait after the extension prefix was removed.
 */
function removeExtensionTraitNamePrefix(traitName: string): string {
    return traitName.substr(extensionTraitNamePrefix.length);
}

/**
 * Adds a prefix to a trait name to mark it as an extension.
 * @param traitName The name of the trait without extension prefix.
 * @returns The name of the trait after the extension prefix was added.
 */
function addExtensionTraitNamePrefix(traitName: string): string {
    return `${extensionTraitNamePrefix}${traitName}`;
}
