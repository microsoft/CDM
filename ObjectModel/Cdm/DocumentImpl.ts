import {
    AttributeGroup,
    AttributeGroupImpl,
    CdmCorpusContext,
    cdmObject,
    cdmObjectDef,
    cdmObjectSimple,
    cdmObjectType,
    ConstantEntity,
    ConstantEntityImpl,
    copyOptions,
    CorpusImpl,
    DataType,
    DataTypeImpl,
    DocumentContent,
    Entity,
    EntityImpl,
    FolderImpl,
    friendlyFormatNode,
    ICdmAttributeContext,
    ICdmAttributeGroupDef,
    ICdmConstantEntityDef,
    ICdmDataTypeDef,
    ICdmDocumentDef,
    ICdmEntityDef,
    ICdmFolderDef,
    ICdmImport,
    ICdmObject,
    ICdmObjectDef,
    ICdmRelationshipDef,
    ICdmTraitDef,
    Import,
    ImportImpl,
    Relationship,
    RelationshipImpl,
    resolveContext,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    Trait,
    TraitImpl,
    VisitCallback
} from '../internal';

export class DocumentImpl extends cdmObjectSimple implements ICdmDocumentDef {
    public name: string;
    public path: string;
    public schema: string;
    public jsonSchemaSemanticVersion: string;
    public imports: ImportImpl[];
    public definitions: (TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl)[];
    public importSetKey: string;
    public folder: FolderImpl;
    public internalDeclarations: Map<string, cdmObjectDef>;
    public importPriority: Map<DocumentImpl, number>;
    public monikerPriorityMap: Map<string, DocumentImpl>;
    public pathsToOtherDocuments: Map<DocumentImpl, string>;

    constructor(ctx: CdmCorpusContext, name: string, hasImports: boolean) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.documentDef;
            this.name = name;
            this.jsonSchemaSemanticVersion = '0.7.0';

            this.definitions = [];
            if (hasImports) {
                this.imports = [];
            }
            this.clearCaches();
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, name: string, path: string, object: any): DocumentImpl {
        // let bodyCode = () =>
        {
            const doc: DocumentImpl = new DocumentImpl(ctx, name, object.imports);
            doc.path = path;
            // set this as the current doc of the context for this operation
            (ctx as resolveContext).currentDoc = doc;

            if (object.$schema) {
                doc.schema = object.$schema;
            }
            // support old model syntax
            if (object.schemaVersion) {
                doc.jsonSchemaSemanticVersion = object.schemaVersion;
            }
            if (object.jsonSchemaSemanticVersion) {
                doc.jsonSchemaSemanticVersion = object.jsonSchemaSemanticVersion;
            }
            if (doc.jsonSchemaSemanticVersion !== '0.7.0') {
                // tslint:disable-next-line:no-suspicious-comment
                // TODO: validate that this is a version we can understand with the OM
            }

            if (object.imports) {
                for (const importObj of object.imports) {
                    doc.imports.push(ImportImpl.instanceFromData(ctx, importObj));
                }
            }
            if (object.definitions && Array.isArray(object.definitions)) {
                for (const d of object.definitions) {
                    if (d.dataTypeName) {
                        doc.definitions.push(DataTypeImpl.instanceFromData(ctx, d));
                    } else if (d.relationshipName) {
                        doc.definitions.push(RelationshipImpl.instanceFromData(ctx, d));
                    } else if (d.attributeGroupName) {
                        doc.definitions.push(AttributeGroupImpl.instanceFromData(ctx, d));
                    } else if (d.traitName) {
                        doc.definitions.push(TraitImpl.instanceFromData(ctx, d));
                    } else if (d.entityShape) {
                        doc.definitions.push(ConstantEntityImpl.instanceFromData(ctx, d));
                    } else if (d.entityName) {
                        doc.definitions.push(EntityImpl.instanceFromData(ctx, d));
                    }
                }
            }
            (ctx as resolveContext).currentDoc = undefined;

            return doc;
        }
        // return p.measure(bodyCode);
    }
    public clearCaches(): void {
        this.internalDeclarations = new Map<string, cdmObjectDef>();
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.documentDef;
        }
        // return p.measure(bodyCode);
    }
    public getObjectDef<T= ICdmObjectDef>(resOpt: resolveOptions): T {
        return undefined;
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): DocumentContent {
        // let bodyCode = () =>
        {
            return {
                schema: this.schema,
                jsonSchemaSemanticVersion: this.jsonSchemaSemanticVersion,
                imports: cdmObject.arraycopyData<Import>(resOpt, this.imports, options),
                definitions: cdmObject.arraycopyData<Trait | DataType | Relationship | AttributeGroup | Entity | ConstantEntity>(
                    resOpt, this.definitions, options)
            };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ICdmObject {
        // let bodyCode = () =>
        {
            const c: DocumentImpl = new DocumentImpl(this.ctx, this.name, (this.imports && this.imports.length > 0));
            c.ctx = this.ctx;
            c.path = this.path;
            c.schema = this.schema;
            c.jsonSchemaSemanticVersion = this.jsonSchemaSemanticVersion;
            c.definitions
                = cdmObject.arrayCopy<TraitImpl | DataTypeImpl | RelationshipImpl | AttributeGroupImpl | EntityImpl | ConstantEntityImpl>(
                    resOpt,
                    this.definitions);
            c.imports = cdmObject.arrayCopy<ImportImpl>(resOpt, this.imports);

            return c;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.name ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.verticalMode = true;
            ff.indentChildren = false;
            ff.separator = '\n';

            const ffImp: friendlyFormatNode = new friendlyFormatNode();
            ffImp.indentChildren = false;
            ffImp.separator = ';';
            ffImp.terminator = ';';
            ffImp.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffImp, this.imports);
            ff.addChild(ffImp);

            const ffDef: friendlyFormatNode = new friendlyFormatNode();
            ffDef.indentChildren = false;
            ffDef.separator = ';\n';
            ffDef.terminator = ';';
            ffDef.verticalMode = true;
            cdmObject.arrayGetFriendlyFormat(ffDef, this.definitions);
            ff.addChild(ffDef);

            return ff;
        }
        // return p.measure(bodyCode);
    }

    public constructResolvedAttributes(resOpt: resolveOptions, under?: ICdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public addImport(corpusPath: string, moniker: string): void {
        // let bodyCode = () =>
        {
            if (!this.imports) {
                this.imports = [];
            }
            const i: ImportImpl = new ImportImpl(this.ctx, corpusPath, moniker);
            i.ctx = this.ctx;
            this.imports.push(i);

        }
        // return p.measure(bodyCode);
    }
    public getImports(): ICdmImport[] {
        // let bodyCode = () =>
        {
            return this.imports;
        }
        // return p.measure(bodyCode);
    }

    public addDefinition<T>(ofType: cdmObjectType, name: string): T {
        // let bodyCode = () =>
        {
            const newObj: any = this.ctx.corpus.MakeObject<ICdmObject>(ofType, name);
            if (newObj !== undefined) {
                this.definitions.push(newObj);
                (newObj as cdmObject).docCreatedIn = this;
            }

            return newObj;
        }
        // return p.measure(bodyCode);
    }

    public getSchema(): string {
        // let bodyCode = () =>
        {
            return this.schema;
        }
        // return p.measure(bodyCode);
    }
    public getName(): string {
        // let bodyCode = () =>
        {
            return this.name;
        }
        // return p.measure(bodyCode);
    }
    public setName(name: string): string {
        // let bodyCode = () =>
        {
            this.name = name;

            return this.name;
        }
        // return p.measure(bodyCode);
    }
    public getSchemaVersion(): string {
        // let bodyCode = () =>
        {
            return this.jsonSchemaSemanticVersion;
        }
        // return p.measure(bodyCode);
    }
    public getDefinitions()
        : (ICdmTraitDef | ICdmDataTypeDef | ICdmRelationshipDef | ICdmAttributeGroupDef | ICdmEntityDef | ICdmConstantEntityDef)[] {
        // let bodyCode = () =>
        {
            return this.definitions;
        }
        // return p.measure(bodyCode);
    }
    public getFolder(): ICdmFolderDef {
        return this.folder;
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (preChildren && preChildren(this, pathFrom)) {
                return false;
            }
            if (this.definitions) {
                if (cdmObject.visitArray(this.definitions, pathFrom, preChildren, postChildren)) {
                    return true;
                }
            }
            if (postChildren && postChildren(this, pathFrom)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    // remove any old document content from caches and re-declare and resolve with new content
    public refresh(resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // make the corpus internal machinery pay attention to this document for this call
            const corpus: CorpusImpl = this.folder.corpus;
            const oldDoc: DocumentImpl = (corpus.ctx as resolveContext).currentDoc;
            (corpus.ctx as resolveContext).currentDoc = this;
            // remove all of the cached paths and resolved pointers
            this.visit('', undefined, (iObject: ICdmObject, path: string) => {
                (iObject as cdmObject).declaredPath = undefined;

                return false;
            });
            // clear old cached things for this doc
            this.clearCaches();
            // this is the minimum set of steps needed to get an object to the point where references will resolve to objects in the corpus
            // index any imports
            corpus.resolveDocumentImports(this, undefined);
            this.prioritizeImports(undefined, 0, undefined);
            // check basic integrity
            corpus.checkObjectIntegrity();
            // declare definitions of objects in this doc
            corpus.declareObjectDefinitions('');
            // make sure we can find everything that is named by reference
            corpus.resolveObjectDefinitions(resOpt);
            // now resolve any trait arguments that are type object
            corpus.resolveTraitArguments(resOpt);
            // finish up
            corpus.finishDocumentResolve();
            // go back to what you had before
            (corpus.ctx as resolveContext).currentDoc = oldDoc;
        }
        // return p.measure(bodyCode);
    }

    public prioritizeImports(
        priorityMap: Map<DocumentImpl, number>,
        sequence: number,
        monikerMap: Map<string, DocumentImpl>,
        skipThis: boolean = false,
        skipMonikered: boolean = false)
        : number {
        // let bodyCode = () =>
        {
            // goal is to make a map from the reverse order of imports (depth first) to the sequence number in that list
            // since the 'last' definition for a duplicate symbol wins,
            // the lower in this list a document shows up, the higher priority its definitions are for resolving conflicts
            if (priorityMap === undefined) {
                this.importPriority = new Map<DocumentImpl, number>();
                priorityMap = this.importPriority;
            }
            if (monikerMap === undefined) {
                this.monikerPriorityMap = new Map<string, DocumentImpl>();
                monikerMap = this.monikerPriorityMap;
            }
            // if already in list, don't do this again
            if (priorityMap.has(this)) {
                return sequence;
            }
            if (skipThis === false) {
                // remember the sequence this way put in the list
                priorityMap.set(this, sequence);
                sequence++;
            }
            // may have avoided this level, but don't avoid deeper.
            // this flag is used to get the dependencies from moniker imports without getting the import itself
            skipThis = false;

            if (this.imports) {
                // reverse order
                for (const imp of this.imports.slice().reverse()) {
                    // don't add the moniker imports to the priority list, but do add the dependencies of them.
                    // when doing that, don't include the monikered imports of the dependencies in our map.
                    const isMoniker: boolean = !!imp.moniker;
                    if (imp.doc) {
                        sequence = imp.doc.prioritizeImports(priorityMap, sequence, monikerMap, isMoniker, isMoniker);
                    }
                }
                // skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies
                if (skipMonikered === false) {
                    // moniker imports are prioritized by the 'closest' use of the moniker to the starting doc.
                    // so last one found in this recursion
                    for (const imp of this.imports) {
                        if (imp.doc && imp.moniker) {
                            monikerMap.set(imp.moniker, imp.doc);
                        }
                    }
                }
            }

            return sequence;
        }
        // return p.measure(bodyCode);
    }

    public getObjectFromDocumentPath(objectPath: string): ICdmObject {
        // let bodyCode = () =>
        {
            // in current document?
            if (this.internalDeclarations.has(objectPath)) {
                return this.internalDeclarations.get(objectPath);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public getPathsToOtherDocuments(): Map<DocumentImpl, string> {
        // let bodyCode = () =>
        {
            if (!this.pathsToOtherDocuments) {
                this.pathsToOtherDocuments = new Map<DocumentImpl, string>();
                // found directly
                if (this.importPriority) {
                    for (const otherDoc of this.importPriority.keys()) {
                        this.pathsToOtherDocuments.set(otherDoc, '');
                    }
                }
                // found only through a moniker
                if (this.monikerPriorityMap) {
                    this.monikerPriorityMap.forEach((v: DocumentImpl, k: string) => {
                        if (!this.pathsToOtherDocuments.has(v)) {
                            // not seen this doc any other way
                            this.pathsToOtherDocuments.set(v, `${k}/`);
                            // look through the list of docs it knows about, and add ones here that we've never seen
                            const monikeredOthers: Map<DocumentImpl, string> = v.getPathsToOtherDocuments();
                            // need a way to make this fast
                            monikeredOthers.forEach((vo: string, ko: DocumentImpl) => {
                                // never seen?
                                if (!this.pathsToOtherDocuments.has(ko)) {
                                    this.pathsToOtherDocuments.set(ko, `${k}/${vo}`);
                                }
                            });
                        }
                    });
                }
            }

            return this.pathsToOtherDocuments;
        }
        // return p.measure(bodyCode);
    }

}
