// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmFileStatus,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    Errors,
    resolveOptions,
    StorageAdapter,
    VisitCallback
} from '../internal';
import { isLocalEntityDeclarationDefinition } from '../Utilities/cdmObjectTypeGuards';
import { Logger } from '../Utilities/Logging/Logger';

/**
 * The object model implementation for Data Partition Pattern.
 */
export class CdmDataPartitionPatternDefinition extends CdmObjectDefinitionBase implements CdmFileStatus {
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

    /**
     * Creates a new instance of Data Partition Pattern Impl.
     * @param ctx The context.
     * @param name The name.
     */
    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.objectType = cdmObjectType.dataPartitionPatternDef;
        this.name = name;
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
            Logger.error(
                CdmDataPartitionPatternDefinition.name,
                this.ctx,
                Errors.validateErrorString(this.atCorpusPath, ['rootLocation']),
                this.validate.name
            );

            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt: resolveOptions, host?: CdmObject): CdmDataPartitionPatternDefinition {
        let copy: CdmDataPartitionPatternDefinition;
        if (!host) {
            copy = new CdmDataPartitionPatternDefinition(this.ctx, this.name);
        } else {
            copy = host as CdmDataPartitionPatternDefinition;
            copy.ctx = this.ctx;
            copy.name = this.name;
        }
        copy.rootLocation = this.rootLocation;
        copy.globPattern = this.globPattern;
        copy.regularExpression = this.regularExpression;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.parameters = this.parameters;
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
        let path: string = '';
        if (this.ctx.corpus.blockDeclaredPathChanges === false) {
            path = this.declaredPath;
            if (!path) {
                let thisName: string = this.getName();
                if (!thisName) {
                    thisName = 'UNNAMED';
                }
                path = pathFrom + thisName;
                this.declaredPath = path;
            }
        }

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.visitDef(path, preChildren, postChildren)) {
            return true;
        }

        if (postChildren && postChildren(this, path)) {
            return false;
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(): Promise<void> {
        const namespace: string = this.inDocument.namespace;
        const adapter: StorageAdapter = this.ctx.corpus.storage.fetchAdapter(namespace);

        if (adapter === undefined) {
            Logger.error(
                CdmCorpusDefinition.name,
                this.ctx,
                `Adapter not found for the document '${this.inDocument.name}'.`,
                this.fileStatusCheckAsync.name
            );

            return;
        }

        // make sure the root is a good full corpus path
        let rootCleaned: string = this.rootLocation;
        if (rootCleaned === undefined) {
            rootCleaned = '';
        }
        if (rootCleaned.endsWith('/')) {
            rootCleaned = rootCleaned.slice(rootCleaned.length - 1);
        }
        const rootCorpus: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(rootCleaned, this.inDocument);

        let fileInfoList: string[];
        try {
            // get a list of all corpusPaths under the root
            fileInfoList = await adapter.fetchAllFilesAsync(rootCorpus);
        } catch (e) {
            Logger.warning(CdmDataPartitionPatternDefinition.name, this.ctx, `The folder location '${rootCorpus}' described by a partition pattern does not exist`, this.fileStatusCheckAsync.name);
        }

        if (fileInfoList !== undefined) {
            // remove root of the search from the beginning of all paths so anything in the root is not found by regex
            for (let i: number = 0; i < fileInfoList.length; i++) {
                fileInfoList[i] = `${namespace}:${fileInfoList[i]}`;
                fileInfoList[i] = fileInfoList[i].slice(rootCorpus.length);
            }

            if (isLocalEntityDeclarationDefinition(this.owner)) {
                // if both are present log warning and use glob pattern, otherwise use regularExpression
                if (this.globPattern && this.globPattern.trim() !== '' && this.regularExpression && this.regularExpression.trim() !== '') {
                    Logger.warning(
                        CdmDataPartitionPatternDefinition.name,
                        this.ctx,
                        `The Data Partition Pattern contains both a glob pattern (${this.globPattern}) and a regular expression (${this.regularExpression}) set, the glob pattern will be used.`,
                        this.fileStatusCheckAsync.name
                    );
                }
                const regularExpression: string =
                    this.globPattern && this.globPattern.trim() !== '' ? this.globPatternToRegex(this.globPattern) : this.regularExpression;
                let regexPattern: RegExp;

                try {
                    regexPattern = new RegExp(regularExpression);
                } catch (e) {
                    Logger.error(
                        CdmDataPartitionPatternDefinition.name,
                        this.ctx,
                        `The ${this.globPattern && this.globPattern.trim() !== '' ? 'glob pattern' : 'regular expression'} '${this.globPattern && this.globPattern.trim() !== '' ? this.globPattern : this.regularExpression}' could not form a valid regular expression. Reason: ${e}`,
                        this.fileStatusCheckAsync.name
                    );
                }

                if (regexPattern !== undefined) {
                    for (const fi of fileInfoList) {
                        const m: RegExpExecArray = regexPattern.exec(fi);
                        if (m && m.length > 0 && m[0] === fi) {
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
                            const locationCorpusPath: string = `${rootCleaned}${fi}`;
                            const fullPath: string = `${rootCorpus}${fi}`;
                            const lastModifiedTime: Date = await adapter.computeLastModifiedTimeAsync(fullPath);
                            (this.owner).createDataPartitionFromPattern(
                                locationCorpusPath, this.exhibitsTraits, args, this.specializedSchema, lastModifiedTime);
                        }
                    }
                }
            }
        }
        // update modified times
        this.lastFileStatusCheckTime = new Date();
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

        for (let i: number = 0; i < pattern.length; i++) {
            const currChar: string = pattern[i];

            switch (currChar) {
                case '.':
                    // escape '.' characters
                    newPattern.push('\\.');
                    break;
                case '\\':
                    // convert backslash into slash
                    newPattern.push('/');
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
