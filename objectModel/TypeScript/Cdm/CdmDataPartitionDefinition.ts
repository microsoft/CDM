// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmFileMetadata,
    CdmFileStatus,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    fileStatusCheckOptions,
    resolveOptions,
    traitToPropertyMap,
    VisitCallback
} from '../internal';
import * as timeUtils from '../Utilities/timeUtils';
import { using } from "using-statement";
import { enterScope } from '../Utilities/Logging/Logger';

/**
 *  The object model implementation for Data Partition.
 */
export class CdmDataPartitionDefinition extends CdmObjectDefinitionBase implements CdmDataPartitionDefinition, CdmFileStatus {
    /**
     * @inheritdoc
     */
    public name: string;

    /**
     * @inheritdoc
     */
    public location: string;

    /**
     * @inheritdoc
     */
    public inferred: boolean;

    /**
     * @inheritdoc
     */
    public refreshTime: Date;

    /**
     * @inheritdoc
     */
    public arguments?: Map<string, string[]>;

    /**
     * @inheritdoc
     */
    public lastFileStatusCheckTime: Date;

    /**
     * @inheritdoc
     */
    public lastFileModifiedTime: Date;

    /**
     * LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
     */
    public get lastChildFileModifiedTime(): Date {
        throw new Error('Not implemented');
    }

    /**
     * LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
     */
    public set lastChildFileModifiedTime(time: Date) {
        throw new Error('Not implemented');
    }

    public static get objectType(): cdmObjectType {
        return cdmObjectType.dataPartitionDef;
    }

    /**
     * @inheritdoc
     */
    public specializedSchema?: string;

    private readonly traitToPropertyMap: traitToPropertyMap;

    /**
     * Initializes a new instance of Data Partition.
     * @param ctx The context.
     */
    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.name = name;
        this.objectType = cdmObjectType.dataPartitionDef;
        this.arguments = new Map();
        this.inferred = false;
        this.traitToPropertyMap = new traitToPropertyMap(this);
    }

    public get description(): string {
        return this.traitToPropertyMap.fetchPropertyValue('description') as string;
    }

    public set description(val: string) {
        this.traitToPropertyMap.updatePropertyValue('description', val);
    }

    /**
     * Gets whether the data partition is incremental.
     */
    public get isIncremental(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('isIncremental') as boolean;
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.dataPartitionDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        return true;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmDataPartitionDefinition {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        let copy: CdmDataPartitionDefinition;
        if (!host) {
            copy = new CdmDataPartitionDefinition(this.ctx, this.name);
        } else {
            copy = host as CdmDataPartitionDefinition;
            copy.name = this.name;
        }

        copy.description = this.description;
        copy.location = this.location;
        copy.lastFileStatusCheckTime = this.lastFileStatusCheckTime;
        copy.lastFileModifiedTime = this.lastFileModifiedTime;
        copy.inferred = this.inferred;
        if (this.arguments) {
            // deep copy the content
            copy.arguments = new Map();
            for (const key of this.arguments.keys()) {
                copy.arguments.set(key, this.arguments.get(key).slice());
            }
        }
        copy.specializedSchema = this.specializedSchema;
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
        return await using(enterScope(CdmDataPartitionDefinition.name, this.ctx, this.fileStatusCheckAsync.name), async _ => {
            const fullPath: string = this.ctx.corpus.storage.createAbsoluteCorpusPath(this.location, this.inDocument);
            const partitionMetadata: CdmFileMetadata = await this.ctx.corpus.getFileMetadataFromPartitionPathAsync(fullPath);

            // update modified times
            this.lastFileStatusCheckTime = new Date();
            this.lastFileModifiedTime = (partitionMetadata?.lastModifiedTime !== undefined) ? timeUtils.maxTime(partitionMetadata.lastModifiedTime, this.lastFileModifiedTime)
                : this.lastFileModifiedTime;
            if (fileStatusCheckOptions?.includeDataPartitionSize == true && partitionMetadata?.fileSizeBytes != undefined) {
                this.exhibitsTraits.push('is.partition.size', [['value', partitionMetadata.fileSizeBytes]]);
            }

            await this.reportMostRecentTimeAsync(this.lastFileModifiedTime);
        });
    }

    /**
     * @inheritdoc
     */
    public async reportMostRecentTimeAsync(childTime: Date): Promise<void> {
        if (this.owner && (this.owner as CdmFileStatus).reportMostRecentTimeAsync && childTime) {
            await (this.owner as CdmFileStatus).reportMostRecentTimeAsync(childTime);
        }
    }
}
