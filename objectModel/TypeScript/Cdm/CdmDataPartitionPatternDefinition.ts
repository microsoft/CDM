import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmFileStatus,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    resolveOptions,
    StorageAdapter,
    VisitCallback
} from '../internal';
import { KeyValPair } from '../Persistence/CdmFolder/types';
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
     * @inheritdoc
     */
    public rootLocation: string;

    /**
     * @inheritdoc
     */
    public regularExpression?: string;

    /**
     * @inheritdoc
     */
    public parameters?: string[];

    /**
     * @inheritdoc
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
        return !!this.name && !!this.rootLocation;
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

            const regexPattern: RegExp = new RegExp(this.regularExpression);

            if (isLocalEntityDeclarationDefinition(this.owner)) {
                for (const fi of fileInfoList) {
                    const m: RegExpExecArray = regexPattern.exec(fi);
                    if (m && m.length > 0 && m[0] === fi) {
                        // create a map of arguments out of capture groups
                        const args: KeyValPair[] = [];
                        // captures start after the string match at m[0]
                        for (let i: number = 1; i < m.length; i++) {
                            const iParam: number = i - 1;
                            if (this.parameters && iParam < this.parameters.length) {
                                const currentParam: string = this.parameters[iParam];
                                args.push({
                                    name: currentParam,
                                    value: m[i]
                                });
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
}
