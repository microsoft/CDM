// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmFileMetadata,
    CdmFileStatus,
    CdmLocalEntityDeclarationDefinition,
    cdmLogCode,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmTraitCollection,
    fileStatusCheckOptions,
    resolveOptions,
    StorageAdapterBase,
    traitToPropertyMap,
    VisitCallback
} from '../internal';
import { isLocalEntityDeclarationDefinition } from '../Utilities/cdmObjectTypeGuards';
import { Logger, enterScope } from '../Utilities/Logging/Logger';
import { StorageUtils } from '../Utilities/StorageUtils';
import { using } from "using-statement";
import path = require('node:path');

/**
 * The object model implementation for Data Partition Pattern.
 */
export class CdmDataPartitionPatternDefinition extends CdmObjectDefinitionBase implements CdmFileStatus {
    private TAG: string = CdmDataPartitionPatternDefinition.name;

    /**
     * The name of the data partition pattern.
     */
    public name: string;

    /**
     * Gets or sets the starting location corpus path to use to search for inferred data partitions.
     */
    public rootLocation: string;

    /**
     * Gets or sets the glob pattern used to search for partitions.
     * If both globPattern and regularExpression is set, globPattern will be used.
     */
    public globPattern?: string;

    /**
     * Gets or sets the regular expression string to use to search for partitions.
     */
    public regularExpression?: string;

    /**
     * Gets or sets the names for replacement values from the regular expression.
     */
    public parameters?: string[];

    /**
     * Gets or sets the corpus path for the specialized schema to use for matched pattern partitions.
     */
    public specializedSchema?: string;

    /**
     * @inheritdoc
     */
    public lastFileStatusCheckTime: Date;

    /**
     * @inheritdoc
     */
    public lastFileModifiedTime: Date;

    /**
     * LastChildFileModifiedTime is not valid for DataPartitionPatterns since they do not contain any children objects.
     */
    public get lastChildFileModifiedTime(): Date {
        throw new Error('Not implemented');
    }

    /**
     * LastChildFileModifiedTime is not valid for DataPartitionPatterns since they do not contain any children objects.
     */
    public set lastChildFileModifiedTime(time: Date) {
        throw new Error('Not implemented');
    }

    public static get objectType(): cdmObjectType {
        return cdmObjectType.dataPartitionPatternDef;
    }

    private readonly traitToPropertyMap: traitToPropertyMap;

    /**
     * Creates a new instance of Data Partition Pattern Impl.
     * @param ctx The context.
     * @param name The name.
     */
    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.objectType = cdmObjectType.dataPartitionPatternDef;
        this.name = name;
        this.traitToPropertyMap = new traitToPropertyMap(this);
    }

    /**
     * Gets whether the data partition pattern is incremental.
     */
    public get isIncremental(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('isIncremental') as boolean;
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.dataPartitionPatternDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        if (!this.rootLocation) {
            let missingFields: string[] = ['rootLocation'];
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt: resolveOptions, host?: CdmObject): CdmDataPartitionPatternDefinition {
        if (resOpt === undefined) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }
        let copy: CdmDataPartitionPatternDefinition;
        if (!host) {
            copy = new CdmDataPartitionPatternDefinition(this.ctx, this.name);
        } else {
            copy = host as CdmDataPartitionPatternDefinition;
            copy.name = this.name;
        }
        copy.rootLocation = this.rootLocation;
        copy.globPattern = this.globPattern;
        copy.regularExpression = this.regularExpression;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.parameters = this.parameters ? this.parameters.slice() : undefined;
        if (this.specializedSchema) {
            copy.specializedSchema = this.specializedSchema;
        }
        this.copyDef(resOpt, copy);

        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        const path: string = this.fetchDeclaredPath(pathFrom);

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.visitDef(path, preChildren, postChildren)) {
            return true;
        }

        if (postChildren && postChildren(this, path)) {
            return true;
        }

        return false;
    }

    /**
     * @internal
     */
    public fetchDeclaredPath(pathFrom: string): string {
        return pathFrom + (this.getName() || 'UNNAMED');
    }

    /**
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        return false;
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(fileStatusCheckOptions?: fileStatusCheckOptions): Promise<void> {
        return await using(enterScope(CdmDataPartitionPatternDefinition.name, this.ctx, this.fileStatusCheckAsync.name), async _ => {
            let namespace: string = undefined;
            let adapter: StorageAdapterBase = undefined;

            // make sure the root is a good full corpus path
            let rootCleaned: string = this.rootLocation && this.rootLocation.endsWith('/') ? this.rootLocation.substring(0, this.rootLocation.length - 1) : this.rootLocation;
            if (rootCleaned === undefined) {
                rootCleaned = '';
            }
            const rootCorpus: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(rootCleaned, this.inDocument);

            let fileInfoList: Map<string, CdmFileMetadata>;
            try {
                // Remove namespace from path
                const pathTuple: [string, string] = StorageUtils.splitNamespacePath(rootCorpus);
                if (!pathTuple) {
                    Logger.error(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.ErrStorageNullCorpusPath);
                    return;
                }

                namespace = pathTuple[0];
                adapter = this.ctx.corpus.storage.fetchAdapter(namespace);

                if (adapter === undefined) {
                    Logger.error(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.ErrDocAdapterNotFound, this.inDocument.name);
                    return;
                }

                // get a list of all corpusPaths under the root
                fileInfoList = await adapter.fetchAllFilesMetadataAsync(pathTuple[1]);
            } catch (e) {
                Logger.warning(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.WarnPartitionFileFetchFailed, rootCorpus, e.Message);
            }

            // update modified times
            this.lastFileStatusCheckTime = new Date();

            if (fileInfoList === undefined) {
                Logger.error(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.ErrFetchingFileMetadataNull, namespace);
                return;
            }

            if (namespace !== undefined) {
                // remove root of the search from the beginning of all paths so anything in the root is not found by regex
                const cleanedFileList: Map<string, CdmFileMetadata> = new Map<string, CdmFileMetadata>();

                for (const entry of fileInfoList) {
                    let newFileName: string = `${namespace}:${entry[0]}`;
                    newFileName = newFileName.slice(rootCorpus.length);
                    cleanedFileList.set(newFileName, entry[1]);
                }

                if (isLocalEntityDeclarationDefinition(this.owner)) {
                    const localEntDecDefOwner: CdmLocalEntityDeclarationDefinition = this.owner;
                    // if both are present log warning and use glob pattern, otherwise use regularExpression
                    if (this.globPattern && this.globPattern.trim() !== '' && this.regularExpression && this.regularExpression.trim() !== '') {
                        Logger.warning(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.WarnPartitionGlobAndRegexPresent, this.globPattern, this.regularExpression);
                    }
                    const regularExpression: string =
                        this.globPattern && this.globPattern.trim() !== '' ? this.globPatternToRegex(this.globPattern) : this.regularExpression;
                    let regexPattern: RegExp;

                    try {
                        regexPattern = new RegExp(regularExpression);
                    } catch (e) {
                        Logger.error(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.ErrValdnInvalidExpression, this.globPattern, this.regularExpression, e.message);
                    }

                    if (regexPattern !== undefined) {
                        const dataPartitionPathSet: Set<string> = new Set<string>();
                        if (localEntDecDefOwner.dataPartitions) {
                            for (const dataPartition of localEntDecDefOwner.dataPartitions) {
                                const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(dataPartition.location, this.inDocument);
                                dataPartitionPathSet.add(fullPath);
                            }
                        }

                        const incrementalPartitionPathHashSet: Set<string> = new Set<string>();
                        if (localEntDecDefOwner.incrementalPartitions) {
                            for (const incrementalPartition of localEntDecDefOwner.incrementalPartitions) {
                                const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(incrementalPartition.location, this.inDocument);
                                incrementalPartitionPathHashSet.add(fullPath);
                            }
                        }

                        for (const fi of cleanedFileList) {
                            const fileName: string = fi[0];
                            const partitionMetadata: CdmFileMetadata = fi[1];

                            const m: RegExpExecArray = regexPattern.exec(fileName);
                            if (m && m.length > 0 && m[0] === fileName) {
                                // create a map of arguments out of capture groups
                                const args: Map<string, string[]> = new Map();
                                // captures start after the string match at m[0]
                                for (let i: number = 1; i < m.length; i++) {
                                    const iParam: number = i - 1;
                                    if (this.parameters && iParam < this.parameters.length) {
                                        const currentParam: string = this.parameters[iParam];
                                        if (!args.has(currentParam)) {
                                            args.set(currentParam, []);
                                        }
                                        args.get(currentParam)
                                            .push(m[i]);
                                    }
                                }

                                // put the origial but cleaned up root back onto the matched doc as the location stored in the partition
                                const locationCorpusPath: string = `${rootCleaned}${fileName}`;
                                const fullPath: string = `${rootCorpus}${fileName}`;
                                // Remove namespace from path
                                const pathTuple: [string, string] = StorageUtils.splitNamespacePath(fullPath);
                                if (!pathTuple) {
                                    Logger.error(this.ctx, this.TAG, this.fileStatusCheckAsync.name, this.atCorpusPath, cdmLogCode.ErrStorageNullCorpusPath);
                                    return;
                                }

                                let exhibitsTraits: CdmTraitCollection = this.exhibitsTraits;
                                if (fileStatusCheckOptions?.includeDataPartitionSize && partitionMetadata?.fileSizeBytes != undefined) {
                                    exhibitsTraits = new CdmTraitCollection(this.ctx, this);
                                    for (const trait of this.exhibitsTraits) {
                                        exhibitsTraits.push(trait);
                                    }

                                    exhibitsTraits.push('is.partition.size', [['value', partitionMetadata.fileSizeBytes]]);
                                }

                                const lastModifiedTime: Date = await adapter.computeLastModifiedTimeAsync(pathTuple[1]);

                                if (this.isIncremental && !incrementalPartitionPathHashSet.has(fullPath)) {
                                    localEntDecDefOwner.createDataPartitionFromPattern(
                                        locationCorpusPath, exhibitsTraits, args, this.specializedSchema, lastModifiedTime, true, this.name);
                                    dataPartitionPathSet.add(fullPath);
                                } else if (!this.isIncremental && !dataPartitionPathSet.has(fullPath)) {
                                    localEntDecDefOwner.createDataPartitionFromPattern(
                                        locationCorpusPath, exhibitsTraits, args, this.specializedSchema, lastModifiedTime);
                                    dataPartitionPathSet.add(fullPath);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * @inheritdoc
     */
    public async reportMostRecentTimeAsync(childTime: Date): Promise<void> {
        if ((this.owner as CdmFileStatus).reportMostRecentTimeAsync && childTime) {
            await (this.owner as CdmFileStatus).reportMostRecentTimeAsync(childTime);
        }
    }

    /**
     * Converts a glob pattern to a regular expression
     */
    private globPatternToRegex(pattern: string): string {
        const newPattern: string[] = [];

        // all patterns should start with a slash
        newPattern.push("[/\\\\]");

        // if pattern starts with slash, skip the first character. We already added it above
        for (let i: number = (pattern[0] === '/' || pattern[0] === '\\' ? 1 : 0); i < pattern.length; i++) {
            const currChar: string = pattern[i];

            switch (currChar) {
                case '.':
                    // escape '.' characters
                    newPattern.push('\\.');
                    break;
                case '\\':
                    // convert backslash into slash
                    newPattern.push('[/\\\\]');
                    break;
                case '?':
                    // question mark in glob matches any single character
                    newPattern.push('.');
                    break;
                case '*':
                    const nextChar: string = i + 1 < pattern.length ? pattern[i + 1] : undefined;
                    if (nextChar === '*') {
                        const prevChar: string = i - 1 >= 0 ? pattern[i - 1] : undefined;
                        const postChar: string = i + 2 < pattern.length ? pattern[i + 2] : undefined;

                        // globstar must be at beginning of pattern, end of pattern, or wrapped in separator characters
                        if ((prevChar === undefined || prevChar === '/' || prevChar === '\\')
                            && (postChar === undefined || postChar === '/' || postChar === '\\')) {
                            newPattern.push('.*');

                            // globstar can match zero or more subdirectories. If it matches zero, then there should not be
                            // two consecutive '/' characters so make the second one optional
                            if ((prevChar === '/' || prevChar === '\\') && (postChar === '/' || postChar === '\\')) {
                                newPattern.push('/?');
                                i++;
                            }
                        } else {
                            // otherwise, treat the same as '*'
                            newPattern.push('[^\/\\\\]*');
                        }
                        i++;
                    } else {
                        // *
                        newPattern.push('[^\/\\\\]*');
                    }
                    break;
                default:
                    newPattern.push(currChar);
            }
        }

        return newPattern.join('');
    }
}
