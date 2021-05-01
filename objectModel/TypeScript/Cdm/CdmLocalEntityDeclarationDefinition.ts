// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCollection,
    CdmCorpusContext,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmEntityDeclarationDefinition,
    CdmFileStatus,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmTraitCollection,
    cdmLogCode,
    Logger,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../internal';
import {StorageAdapterBase , StorageAdapterCacheContext } from 'Storage/StorageAdapterBase';
import * as timeUtils from '../Utilities/timeUtils';

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

    public static get objectType(): cdmObjectType {
        return cdmObjectType.localEntityDeclarationDef;
    }

    public readonly dataPartitions: CdmCollection<CdmDataPartitionDefinition>;

    public readonly dataPartitionPatterns: CdmCollection<CdmDataPartitionPatternDefinition>;

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
            copy.ctx = this.ctx;
            copy.entityName = this.entityName;
            copy.dataPartitionPatterns.clear();
            copy.dataPartitions.clear();
        }
        copy.entityPath = this.entityPath;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.lastChildFileModifiedTime = this.lastChildFileModifiedTime;

        for (const partition of this.dataPartitions) {
            copy.dataPartitions.push(partition);
        }

        for (const pattern of this.dataPartitionPatterns) {
            copy.dataPartitionPatterns.push(pattern);
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
        let path: string = '';
        if (!this.ctx.corpus.blockDeclaredPathChanges) {
            path = this.declaredPath;
            if (!path) {
                path = `${pathFrom}${this.entityName}`;
                this.declaredPath = path;
            }
        }

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
    public async fileStatusCheckAsync(): Promise<void> {

        let adapter: StorageAdapterBase = this.ctx.corpus.storage.fetchAdapter(this.inDocument.namespace) as StorageAdapterBase;
        let cacheContext: StorageAdapterCacheContext = (adapter != null) ? adapter.createFileQueryCacheContext() : null;
        try {
            const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.entityPath, this.inDocument);
            const modifiedTime: Date = await this.ctx.corpus.computeLastModifiedTimeAsync(fullPath, this);

            for (const pattern of this.dataPartitionPatterns) {
                await pattern.fileStatusCheckAsync();
            }

            for (const partition of this.dataPartitions) {
                await partition.fileStatusCheckAsync();
            }

            this.lastFileStatusCheckTime = new Date();
            this.lastFileModifiedTime = timeUtils.maxTime(modifiedTime, this.lastFileModifiedTime);

            await this.reportMostRecentTimeAsync(this.lastFileModifiedTime);
        }
        finally {
            if(cacheContext != null) {
                cacheContext.dispose()
            }
        }
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
     */
    public createDataPartitionFromPattern(
        filePath: string,
        exhibitsTraits: CdmTraitCollection,
        args: Map<string, string[]>,
        schema: string,
        modifiedTime: Date): void {
        const existingPartition: CdmDataPartitionDefinition =
            this.dataPartitions.allItems.find((x: CdmDataPartitionDefinition) => x.location === filePath);

        if (!existingPartition) {
            const newPartition: CdmDataPartitionDefinition = this.ctx.corpus.MakeObject(cdmObjectType.dataPartitionDef);
            newPartition.location = filePath;
            newPartition.specializedSchema = schema;
            newPartition.lastFileModifiedTime = modifiedTime;
            newPartition.lastFileStatusCheckTime = new Date();

            for (const trait of exhibitsTraits) {
                newPartition.exhibitsTraits.push(trait);
            }

            newPartition.arguments = new Map(args);

            this.dataPartitions.push(newPartition);
        }
    }
}
