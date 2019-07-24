import * as cdm from "cdm.objectmodel";
import { IExplorerEntity } from "./IExplorerEntity";
import { ExplorerEntity } from "./ExplorerEntity";
import { IEntityContainer } from "./IEntityContainer";
import { IExplorerDocument } from "./IExplorerDocument";
import { ExplorerDocument } from "./ExplorerDocument";

export class EntityContainer implements IEntityContainer {
    private corpus: cdm.types.ICdmCorpusDef;
    private entityToExplorerEntity: Map<cdm.types.ICdmEntityDef, IExplorerEntity> = new Map<cdm.types.ICdmEntityDef, IExplorerEntity>();
    private documentToExplorerDocument: Map<cdm.types.ICdmDocumentDef, IExplorerDocument> = new Map<cdm.types.ICdmDocumentDef, IExplorerDocument>();
    private constEntityToAttributeNames: Map<cdm.types.ICdmConstantEntityDef, string[]> = new Map<cdm.types.ICdmConstantEntityDef, string[]>();

    public getEntity(entity: cdm.types.ICdmEntityDef): IExplorerEntity {
        if (!this.entityToExplorerEntity.has(entity)) {
            return null;
        }

        return this.entityToExplorerEntity.get(entity);
    }

    public getEntityByPath(entityPath: string): IExplorerEntity {
        let entity = <cdm.types.ICdmEntityDef>this.corpus.getObjectFromCorpusPath(entityPath);
        return this.getEntity(entity);
    }

    public getDocument(document: cdm.types.ICdmDocumentDef): IExplorerDocument {
        if (!this.documentToExplorerDocument.has(document)) {
            return null;
        }

        return this.documentToExplorerDocument.get(document);
    }

    public loadEntitiesFromDocuments(rootPath: string, documentHierarchy: any) {
        this.corpus = cdm.types.NewCorpus(rootPath);
        this.buildCorpus(this.corpus, this.corpus, documentHierarchy);
    }

    public generateWarnings(){
        // TODO: Fix this in the object model
        (this.corpus as any).generateWarnings();
    }

    public resolveEntities(messageType: string, statusCallback: (operation: string, level: any, message: string) => void) {

        let statusRpt = (level, msg, path) => {
            if (level != cdm.types.cdmStatusLevel.info)
                statusCallback("statusMessage", level, msg);
        };

        statusCallback("statusMessage", cdm.types.cdmStatusLevel.progress, "resolving imports...");

        // first resolve all of the imports to pull other docs into the namespace
        this.corpus.setResolutionCallback(statusRpt, cdm.types.cdmStatusLevel.progress, cdm.types.cdmStatusLevel.error);
        this.corpus.resolveImports((uri) => {
            // TODO: Seperate out the messages to enums
            if (messageType == "githubLoadRequest") {
                return new Promise((resolve, reject) => {
                    // super mixed up. 
                    // resolve imports take a callback that askes for promise to do URI resolution.
                    // so here we are, working on that promise
                    fetch(this.corpus.rootPath + uri).then(function (response) {
                        return response.json();
                    }).then(function (data) {
                        resolve([uri, data]);
                    }).catch(function (reason) {
                        reject([uri, reason]);
                    })
                });
            }
            else {
                statusCallback("statusMessage", cdm.types.cdmStatusLevel.error, `can't resolve import of '${uri}' in local file mode. you must load the file directly.`);
            }
        }).then((r) => {
            // success resolving all imports
            statusCallback("statusMessage", cdm.types.cdmStatusLevel.progress, "validating schemas...");
            if (r) {
                let validateStep = (currentStep) => {
                    return this.corpus.resolveReferencesAndValidate(currentStep, cdm.types.cdmValidationStep.minimumForResolving, undefined).then((nextStep) => {
                        if (nextStep == cdm.types.cdmValidationStep.error) {
                            statusCallback("statusMessage", cdm.types.cdmStatusLevel.error, "validating step failed.");
                            statusCallback("resolveModeResult", false, null);
                        }
                        else if (nextStep == cdm.types.cdmValidationStep.finished) {
                            statusCallback("statusMessage", cdm.types.cdmStatusLevel.progress, "validation finished.");
                            statusCallback("resolveModeResult", true, null);
                        }
                        else {
                            // success resolving all imports
                            return validateStep(nextStep);
                        }
                    }).catch((reason) => {
                        statusCallback("statusMessage", cdm.types.cdmStatusLevel.error, "Oops! internal failure during validation, see browser debug output for details");
                        console.log('exception during validation');
                        console.log(reason);
                        statusCallback("resolveModeResult", false, null);
                    });
                };
                return validateStep(cdm.types.cdmValidationStep.start);
            }
        });
    }

    public mapEntities(entityPaths: string[]): IExplorerEntity[] {
        let explorerEntities = new Array<IExplorerEntity>();
        entityPaths.forEach(path => {
            let entity = <cdm.types.ICdmEntityDef>this.corpus.getObjectFromCorpusPath(path);
            if (!entity) {
                explorerEntities.push(null);
                return;
            }
            if (entity.declaredInDocument) {
                let explorerDocument = new ExplorerDocument(entity.declaredInDocument);
                this.documentToExplorerDocument.set(entity.declaredInDocument, explorerDocument);
            }
            let explorerEntity = new ExplorerEntity(entity, this);
            this.entityToExplorerEntity.set(entity, explorerEntity);
            explorerEntities.push(explorerEntity);
        });

        explorerEntities.filter(explorerEntity => !!explorerEntity).forEach(explorerEntity => (explorerEntity as ExplorerEntity).populateReferences());
        return explorerEntities;
    }

    public getAttributeNamesForConstEntity(constEntDef: cdm.types.ICdmConstantEntityDef, resOpt: cdm.types.resolveOptions) {
        if (this.constEntityToAttributeNames.has(constEntDef)) {
            return this.constEntityToAttributeNames.get(constEntDef);
        }
        
        let entShape = constEntDef.getEntityShape().getObjectDef(resOpt) as cdm.types.ICdmEntityDef;
        let resolvedEntShape = entShape.createResolvedEntity(resOpt, entShape.getName() + "_");
        let shapeAttNames = resolvedEntShape.getHasAttributeDefs().map(att => (att as cdm.types.ICdmTypeAttributeDef).getName());
        this.constEntityToAttributeNames.set(constEntDef, shapeAttNames);
        return shapeAttNames;
    }

    private buildCorpus(corpus: cdm.types.ICdmCorpusDef, folder, hier) {
        if (hier.entities) {
            hier.entities.forEach(e => {
                corpus.addDocumentFromContent(folder.getRelativePath() + e.docName, e.rawContent);
            });
        };
        if (hier.folders) {
            hier.folders.forEach(f => {
                var fSub = folder.addFolder(f.name);
                this.buildCorpus(corpus, fSub, f);
            });
        }
    }
}