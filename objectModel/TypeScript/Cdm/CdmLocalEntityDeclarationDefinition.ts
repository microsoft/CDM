// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCollection,
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmEntityDeclarationDefinition,
    CdmFileStatus,
    cdmIncrementalPartitionType,
    cdmLogCode,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmTraitCollection,
    CdmTraitReference,
    CdmTraitReferenceBase,
    constants,
    fileStatusCheckOptions,
    Logger,
    partitionFileStatusCheckType,
    resolveOptions,
    StorageAdapterBase,
    StorageAdapterCacheContext,
    VisitCallback
} from '../internal';
import * as timeUtils from '../Utilities/timeUtils';
import { StringUtils } from '../Utilities/StringUtils';

/**
 * The object model implementation for local entity declaration.
 */
export class CdmLocalEntityDeclarationDefinition extends CdmObjectDefinitionBase implements CdmFileStatus, CdmEntityDeclarationDefinition {
    private TAG: string = CdmLocalEntityDeclarationDefinition.name;

    /**
     * @inheritdoc
     */
    public entityName: string;

    /**
     * @inheritdoc
     */
    public entityPath: string;

    /**
     * @inheritdoc
     * Note: Use setLastFileModifiedTime() for setting the value.
     */
    public lastFileStatusCheckTime: Date;

    /**
     * @inheritdoc
     */
    public lastFileModifiedTime: Date;

    /**
     * @inheritdoc
     */
    public lastChildFileModifiedTime: Date;

    /**
     * @inheritdoc
     * Gets and sets this entity's virtual location, it's model.json file's location if entity is from a model.json file
     */
    public virtualLocation: string;

    private lastFileModifiedOldTime: Date;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.localEntityDeclarationDef;
    }

    public readonly dataPartitions: CdmCollection<CdmDataPartitionDefinition>;

    public readonly dataPartitionPatterns: CdmCollection<CdmDataPartitionPatternDefinition>;

    public readonly incrementalPartitions: CdmCollection<CdmDataPartitionDefinition>;

    public readonly incrementalPartitionPatterns: CdmCollection<CdmDataPartitionPatternDefinition>;

    /**
     * Initializes a new instance of the LocalEntityDeclarationImpl.
     * @param ctx The context.
     * @param entityName The entity name.
     */
    constructor(ctx: CdmCorpusContext, entityName: string) {
        super(ctx);
        this.objectType = cdmObjectType.localEntityDeclarationDef;
        this.entityName = entityName;
        this.dataPartitions = new CdmCollection<CdmDataPartitionDefinition>(this.ctx, this, cdmObjectType.dataPartitionDef);
        this.dataPartitionPatterns = new CdmCollection<CdmDataPartitionPatternDefinition>(this.ctx, this, cdmObjectType.dataPartitionDef);
        this.incrementalPartitions = new CdmCollection<CdmDataPartitionDefinition>(this.ctx, this, cdmObjectType.dataPartitionDef);
        this.incrementalPartitionPatterns = new CdmCollection<CdmDataPartitionPatternDefinition>(this.ctx, this, cdmObjectType.dataPartitionDef);
        this.lastFileModifiedTime = undefined;
        this.lastFileModifiedOldTime = undefined;
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.localEntityDeclarationDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        if (!this.entityName) {
            let missingFields: string[] = ['entityName'];
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmLocalEntityDeclarationDefinition {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        let copy: CdmLocalEntityDeclarationDefinition;
        if (!host) {
            copy = new CdmLocalEntityDeclarationDefinition(this.ctx, this.entityName);
        } else {
            copy = host as CdmLocalEntityDeclarationDefinition;
            copy.entityName = this.entityName;
            copy.dataPartitionPatterns.clear();
            copy.dataPartitions.clear();
            copy.incrementalPartitionPatterns.clear();
            copy.incrementalPartitions.clear();
        }
        copy.entityPath = this.entityPath;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.lastChildFileModifiedTime = this.lastChildFileModifiedTime;
        copy.virtualLocation = this.virtualLocation;

        for (const partition of this.dataPartitions) {
            copy.dataPartitions.push(partition.copy(resOpt) as CdmDataPartitionDefinition);
        }

        for (const pattern of this.dataPartitionPatterns) {
            copy.dataPartitionPatterns.push(pattern.copy(resOpt) as CdmDataPartitionPatternDefinition);
        }

        for (const partition of this.incrementalPartitions) {
            copy.incrementalPartitions.push(partition.copy(resOpt) as CdmDataPartitionDefinition);
        }

        for (const pattern of this.incrementalPartitionPatterns) {
            copy.incrementalPartitionPatterns.push(pattern.copy(resOpt) as CdmDataPartitionPatternDefinition);
        }
        this.copyDef(resOpt, copy);

        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return this.entityName;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        const path: string = this.fetchDeclaredPath(pathFrom);

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.dataPartitions) {
            if (this.dataPartitions.visitArray(`${path}/dataPartitions/`, preChildren, postChildren)) {
                return true;
            }
        }

        if (this.dataPartitionPatterns) {
            if (this.dataPartitionPatterns.visitArray(`${path}/dataPartitionPatterns/`, preChildren, postChildren)) {
                return true;
            }
        }

        if (this.incrementalPartitions) {
            if (this.incrementalPartitions.visitArray(`${path}/incrementalPartitions/`, preChildren, postChildren)) {
                return true;
            }
        }

        if (this.incrementalPartitionPatterns) {
            if (this.incrementalPartitionPatterns.visitArray(`${path}/incrementalPartitionPatterns/`, preChildren, postChildren)) {
                return true;
            }
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
     * @inheritdoc
     */
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        return false; // makes no sense
    }

    /**
     * @inheritdoc
     */
    public isVirtual(): boolean {
        return !StringUtils.isNullOrWhiteSpace(this.virtualLocation);
    }

    /**
     * @inheritdoc
     */
    public async fileStatusCheckAsync(
        partitionCheckType: partitionFileStatusCheckType = partitionFileStatusCheckType.Full,
        incrementalType: cdmIncrementalPartitionType = cdmIncrementalPartitionType.None,
        fileStatusCheckOptions: fileStatusCheckOptions = undefined
    ): Promise<void> {

        let adapter: StorageAdapterBase = this.ctx.corpus.storage.fetchAdapter(this.inDocument.namespace);
        let cacheContext: StorageAdapterCacheContext = (adapter !== undefined) ? adapter.createFileQueryCacheContext() : undefined;
        try {
            const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.entityPath, this.inDocument);
            const modifiedTime: Date = this.isVirtual() ? await this.ctx.corpus.getLastModifiedTimeFromObjectAsync(this)
                : await this.ctx.corpus.computeLastModifiedTimeAsync(fullPath, this);

            // check patterns first as this is a more performant way of querying file modification times 
            // from ADLS and we can cache the times for reuse in the individual partition checks below
            if (partitionCheckType === partitionFileStatusCheckType.Full || partitionCheckType === partitionFileStatusCheckType.FullAndIncremental) {
                for (const pattern of this.dataPartitionPatterns) {
                    if (pattern.isIncremental) {
                        Logger.error(pattern.ctx, this.TAG, this.fileStatusCheckAsync.name, pattern.atCorpusPath, cdmLogCode.ErrUnexpectedIncrementalPartitionTrait,
                            CdmDataPartitionPatternDefinition.name, pattern.fetchObjectDefinitionName(), constants.INCREMENTAL_TRAIT_NAME, 'dataPartitionPatterns');
                    } else {
                        await pattern.fileStatusCheckAsync(fileStatusCheckOptions);
                    }
                }

                for (const partition of this.dataPartitions) {
                    if (partition.isIncremental) {
                        Logger.error(partition.ctx, this.TAG, this.fileStatusCheckAsync.name, partition.atCorpusPath, cdmLogCode.ErrUnexpectedIncrementalPartitionTrait,
                            CdmDataPartitionDefinition.name, partition.fetchObjectDefinitionName(), constants.INCREMENTAL_TRAIT_NAME, 'dataPartitions');
                    } else {
                        await partition.fileStatusCheckAsync();
                    }
                }
            }

            if (partitionCheckType === partitionFileStatusCheckType.Incremental || partitionCheckType === partitionFileStatusCheckType.FullAndIncremental) {
                for (const pattern of this.incrementalPartitionPatterns) {
                    if (this.shouldCallFileStatusCheck(incrementalType, true, pattern)) {
                        await pattern.fileStatusCheckAsync();
                    }
                }

                for (const partition of this.incrementalPartitions) {
                    if (this.shouldCallFileStatusCheck(incrementalType, false, partition)) {
                        await partition.fileStatusCheckAsync();
                    }
                }
            }

            this.lastFileStatusCheckTime = new Date();
            this.setLastFileModifiedTime(timeUtils.maxTime(modifiedTime, this.lastFileModifiedTime));

            await this.reportMostRecentTimeAsync(this.lastFileModifiedTime);
        }
        finally {
            if (cacheContext !== undefined) {
                cacheContext.dispose()
            }
        }
    }

    /**
     * @internal
     * Determine if calling FileStatusCheckAsync on the given pattern or the given partition is needed.
     */
    public shouldCallFileStatusCheck(incrementalType: cdmIncrementalPartitionType, isPattern: boolean, patternOrPartitionObj: CdmObjectDefinitionBase): boolean {
        var update = true;

        var traitRef: CdmTraitReference = patternOrPartitionObj.exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference;
        if (traitRef === undefined) {
            Logger.error(patternOrPartitionObj.ctx, this.TAG, this.shouldCallFileStatusCheck.name, patternOrPartitionObj.atCorpusPath, cdmLogCode.ErrMissingIncrementalPartitionTrait,
                isPattern ? CdmDataPartitionPatternDefinition.name : CdmDataPartitionDefinition.name, patternOrPartitionObj.fetchObjectDefinitionName(),
                constants.INCREMENTAL_TRAIT_NAME, isPattern ? 'incrementalPartitionPatterns' : 'incrementalPartitions');
        } else {
            // None means update by default
            if (incrementalType == cdmIncrementalPartitionType.None) {
                return update;
            }
            var traitRefIncrementalTypeValue = traitRef.arguments?.fetchValue('type');
            if (traitRefIncrementalTypeValue === undefined) {
                update = false;
                Logger.error(patternOrPartitionObj.ctx, this.TAG, this.shouldCallFileStatusCheck.name, patternOrPartitionObj.atCorpusPath, cdmLogCode.ErrTraitArgumentMissing,
                    'type', constants.INCREMENTAL_TRAIT_NAME, patternOrPartitionObj.fetchObjectDefinitionName());
            } else if (typeof traitRefIncrementalTypeValue !== 'string') {
                update = false;
                Logger.error(patternOrPartitionObj.ctx, this.TAG, this.shouldCallFileStatusCheck.name, patternOrPartitionObj.atCorpusPath, cdmLogCode.ErrTraitInvalidArgumentValueType,
                    'type', constants.INCREMENTAL_TRAIT_NAME, patternOrPartitionObj.fetchObjectDefinitionName());
            } else {
                const traitRefIncrementalTypeValueStr = traitRefIncrementalTypeValue.toString()
                if (Object.values(cdmIncrementalPartitionType).includes(traitRefIncrementalTypeValueStr)) {
                    update = cdmIncrementalPartitionType[traitRefIncrementalTypeValueStr as unknown as keyof cdmIncrementalPartitionType] === incrementalType;
                } else {
                    update = false;
                    Logger.error(patternOrPartitionObj.ctx, this.TAG, this.shouldCallFileStatusCheck.name, patternOrPartitionObj.atCorpusPath, cdmLogCode.ErrEnumConversionFailure,
                        traitRefIncrementalTypeValue, 'cdmIncrementalPartitionType',
                        `'parameter 'type' of trait '${constants.INCREMENTAL_TRAIT_NAME}' from '${patternOrPartitionObj.fetchObjectDefinitionName()}'`);
                }
            }
        }

        return update;
    }

    /**
     * @inheritdoc
     */
    public async reportMostRecentTimeAsync(childTime: Date): Promise<void> {
        this.lastChildFileModifiedTime = childTime;

        const mostRecentAtThisLevel: Date = timeUtils.maxTime(childTime, this.lastFileModifiedTime);

        if ((this.owner as CdmFileStatus).reportMostRecentTimeAsync && mostRecentAtThisLevel) {
            await (this.owner as CdmFileStatus).reportMostRecentTimeAsync(mostRecentAtThisLevel);
        }
    }

    /**
     * @internal
     * Creates a data partition object using the input, should be called by DataPartitionPattern object
     * This function doesn't check if the data partition exists.
     */
    public createDataPartitionFromPattern(
        filePath: string,
        exhibitsTraits: CdmTraitCollection,
        args: Map<string, string[]>,
        schema: string,
        modifiedTime: Date,
        isIncrementalPartition: boolean = false,
        incrementPartitionPatternName: string = undefined): void {
        const newPartition: CdmDataPartitionDefinition = this.ctx.corpus.MakeObject(cdmObjectType.dataPartitionDef);
        newPartition.location = filePath;

        newPartition.specializedSchema = schema;
        newPartition.lastFileModifiedTime = modifiedTime;
        newPartition.lastFileStatusCheckTime = new Date();

        for (const trait of exhibitsTraits) {
            newPartition.exhibitsTraits.push(trait.copy() as CdmTraitReferenceBase);
        }

        newPartition.arguments = new Map(args);

        if (!isIncrementalPartition) {
            this.dataPartitions.push(newPartition);
        } else {
            if (!StringUtils.isNullOrWhiteSpace(incrementPartitionPatternName)) {
                (newPartition.exhibitsTraits.item(constants.INCREMENTAL_TRAIT_NAME) as CdmTraitReference).arguments.push(constants.INCREMENTAL_PATTERN_PARAMETER_NAME, incrementPartitionPatternName);
            }
            this.incrementalPartitions.push(newPartition)
        }

    }

    public setLastFileModifiedTime(value: Date): void {
        this.setLastFileModifiedOldTime(this.lastFileModifiedTime);
        this.lastFileModifiedTime = value;
    }

    public getlastFileModifiedTime(): Date {
        return this.lastFileModifiedTime;
    }

    private setLastFileModifiedOldTime(value: Date): void {
        this.lastFileModifiedOldTime = value;
    }

    public getlastFileModifiedOldTime(): Date {
        return this.lastFileModifiedOldTime;
    }

    public resetLastFileModifiedOldTime(): void {
        this.setLastFileModifiedOldTime(undefined);
    }
}
