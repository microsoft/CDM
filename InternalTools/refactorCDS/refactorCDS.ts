import * as cdm from "../../lib/cdm-types"
import * as loc from "../../lib/local-corpus";


class Startup {
    public static main(): number {

        let cdmCorpus : cdm.Corpus;
        let pathToDocRoot = "../../schemaDocuments";
        //let pathToDocRoot = "../../test";
        //pathToDocRoot = "/cdsa schemas/credandcollect";

        let version = "";
        //let version = ""; // explicitly use the explicit version docs to get versioned schema refs too
        cdmCorpus = new cdm.Corpus(pathToDocRoot);
        cdmCorpus.setResolutionCallback(loc.consoleStatusReport, cdm.cdmStatusLevel.progress, cdm.cdmStatusLevel.error);
        console.log('reading source files');
        loc.loadCorpusFolder(cdmCorpus, cdmCorpus.addFolder("core"), ["analyticalCommon"], version); 

        //this.refactorCdsStandard(cdmCorpus);
        this.fixStateStat(cdmCorpus);
        

        loc.resolveLocalCorpus(cdmCorpus, cdm.cdmValidationStep.finished).then((r:boolean) =>{
            //loc.persistCorpus(cdmCorpus);
            console.log('finished');
        }).catch();
        
        
        return 0;
    }

    public static refactorCdsStandard(folder : cdm.ICdmFolderDef) {

        let standards : Set<string> = new Set<string>();
        standards.add("createdBy");
        standards.add("createdOn");
        standards.add("createdOnBehalfBy");
        standards.add("modifiedBy");
        standards.add("modifiedOn");
        standards.add("modifiedOnBehalfBy");
        standards.add("overriddenCreatedOn");
        standards.add("importSequenceNumber");
        standards.add("ownerId");
        standards.add("owningBusinessUnit");
        standards.add("owningTeam");
        standards.add("owningUser");
        standards.add("timeZoneRuleVersionNumber");
        standards.add("UTCConversionTimeZoneCode");
        standards.add("versionNumber");

        if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length)
        {
            if (folder.getDocuments())
                folder.getDocuments().forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                let ent = def as cdm.ICdmEntityDef;
                                if (ent.getExtendsEntityRef().getObjectDefName() === "CdmObject")
                                {
                                    if (ent.getHasAttributeDefs() && ent.getHasAttributeDefs().length == 1)
                                    {
                                        let ag = ent.getHasAttributeDefs()[0].getObjectDef(doc) as cdm.ICdmAttributeGroupDef;
                                        if (ag && ag.getObjectType() == cdm.cdmObjectType.attributeGroupDef)
                                        {
                                            if (ag.getMembersAttributeDefs() && ag.getMembersAttributeDefs().length >= standards.size)
                                            {
                                                let found = new Map<string, cdm.ICdmAttributeDef>();
                                                ag.getMembersAttributeDefs().forEach(mem => {
                                                    if (mem.getObjectType() == cdm.cdmObjectType.typeAttributeDef)
                                                    {
                                                        let att = mem as cdm.ICdmTypeAttributeDef;
                                                        if (standards.has(att.getName()))
                                                        {
                                                            found.set(att.getName(), att);
                                                        }
                                                    }
                                                    else if (mem.getObjectType() == cdm.cdmObjectType.entityAttributeDef)
                                                    {
                                                        // many assumptions follow :)
                                                        let att = (mem as cdm.ICdmEntityAttributeDef).getRelationshipRef().getAppliedTraitRefs()[0].getArgumentDefs()[0].getValue() as cdm.ICdmTypeAttributeDef;
                                                        if (standards.has(att.getName()))
                                                        {
                                                            found.set(att.getName(), mem as cdm.ICdmAttributeDef);
                                                        }
                                                    }
                                                });

                                                if (found.size == standards.size) {
                                                    // make the change.
                                                    ent.setExtendsEntityRef(cdm.Corpus.MakeRef(cdm.cdmObjectType.entityRef, "CdsStandard", true));
                                                    found.forEach( (v, k) => {
                                                        ag.getMembersAttributeDefs().splice(ag.getMembersAttributeDefs().indexOf(v), 1);

                                                    });

                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        });
                    
                });
        }
        if (folder.getSubFolders()) {
            folder.getSubFolders().forEach(f => {
                this.refactorCdsStandard(f);
            });
        }
    }


    public static fixStateStat(folder : cdm.ICdmFolderDef) {

        let standards : Set<string> = new Set<string>();
        standards.add("stateCode");
        standards.add("statusCode");

        if (folder.getName() != "" && folder.getDocuments() && folder.getDocuments().length)
        {
            if (folder.getDocuments())
                folder.getDocuments().forEach(doc => {
                    if (doc.getDefinitions() && doc.getDefinitions().length)
                        doc.getDefinitions().forEach(def => {
                            if (def.getObjectType() == cdm.cdmObjectType.entityDef) {
                                let ent = def as cdm.ICdmEntityDef;
                                if (ent.getExtendsEntityRef().getObjectDefName() === "CdsStandard")
                                {
                                    if (ent.getHasAttributeDefs() && ent.getHasAttributeDefs().length == 1)
                                    {
                                        let ag = ent.getHasAttributeDefs()[0].getObjectDef(doc) as cdm.ICdmAttributeGroupDef;
                                        if (ag && ag.getObjectType() == cdm.cdmObjectType.attributeGroupDef)
                                        {
                                            if (ag.getMembersAttributeDefs() && ag.getMembersAttributeDefs().length >= standards.size)
                                            {
                                                let found = new Map<string, cdm.ICdmAttributeDef>();
                                                ag.getMembersAttributeDefs().forEach(mem => {
                                                    if (mem.getObjectType() == cdm.cdmObjectType.typeAttributeDef)
                                                    {
                                                        let att = mem as cdm.ICdmTypeAttributeDef;
                                                        if (standards.has(att.getName()))
                                                        {
                                                            found.set(att.getName(), att);
                                                        }
                                                    }
                                                    else if (mem.getObjectType() == cdm.cdmObjectType.entityAttributeDef)
                                                    {
                                                        // many assumptions follow :)
                                                        let att = (mem as cdm.ICdmEntityAttributeDef).getRelationshipRef().getAppliedTraitRefs()[0].getArgumentDefs()[0].getValue() as cdm.ICdmTypeAttributeDef;
                                                        if (standards.has(att.getName()))
                                                        {
                                                            found.set(att.getName(), mem as cdm.ICdmAttributeDef);
                                                        }
                                                    }
                                                });

                                                if (found.size == standards.size) {
                                                    // make the change.
                                                    found.forEach( (v, k) => {
                                                        ag.getMembersAttributeDefs().splice(ag.getMembersAttributeDefs().indexOf(v), 1);

                                                    });

                                                }
                                                else {
                                                    console.log(doc.getName());
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        });
                    
                });
        }
        if (folder.getSubFolders()) {
            folder.getSubFolders().forEach(f => {
                this.fixStateStat(f);
            });
        }
    }

}

Startup.main(); 