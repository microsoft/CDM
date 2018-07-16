"use strict";
class Controller {
}
let controller = new Controller();
function init() {
    // generic controls that all act the same way...
    var classSet = controller.document.getElementsByClassName("fixed_container");
    for (var i = 0; i < classSet.length; i++) {
        var classItem = classSet[i];
        classItem.messageHandlePing = messageHandlePingParent;
        classItem.messageHandle = messageHandleBroadcast;
    }
    var classSet = controller.document.getElementsByClassName("flex_container");
    for (var i = 0; i < classSet.length; i++) {
        var classItem = classSet[i];
        classItem.messageHandlePing = messageHandlePingParent;
        classItem.messageHandle = messageHandleBroadcast;
    }
    var classSet = controller.document.getElementsByClassName("parent_container");
    for (var i = 0; i < classSet.length; i++) {
        var classItem = classSet[i];
        classItem.messageHandlePing = messageHandlePingParent;
        classItem.messageHandle = messageHandleParentContainerBroadcast;
        classItem.messageHandleBroadcast = messageHandleBroadcast;
    }
    var classSet = controller.document.getElementsByClassName("detail_container");
    for (var i = 0; i < classSet.length; i++) {
        var classItem = classSet[i];
        classItem.messageHandlePing = messageHandlePingParent;
        classItem.messageHandle = messageHandleBroadcast;
    }
    var classSet = controller.document.getElementsByClassName("tab");
    for (var i = 0; i < classSet.length; i++) {
        var classItem = classSet[i];
        classItem.messageHandlePing = messageHandlePingParent;
        classItem.messageHandle = messageHandleDetailTab;
    }
    // specific controls 
    controller.mainContainer.messageHandlePing = messageHandlePingMainControl;
    controller.mainContainer.messageHandle = messageHandleBroadcast;
    controller.listContainer.messageHandlePing = messageHandlePingParent;
    controller.listContainer.messageHandle = messageHandleList;
    controller.listContainer.messageHandleBroadcast = messageHandleBroadcast; // special one so it can sit in the middle of messages
    controller.statusPane.messageHandlePing = messageHandlePingParent;
    controller.statusPane.messageHandle = messageHandleDetailStatus;
    controller.traitsPane.messageHandlePing = messageHandlePingParent;
    controller.traitsPane.messageHandle = messageHandleDetailTraits;
    controller.propertiesPane.messageHandlePing = messageHandlePingParent;
    controller.propertiesPane.messageHandle = messageHandleDetailProperties;
    controller.JsonPane.messageHandlePing = messageHandlePingParent;
    controller.JsonPane.messageHandle = messageHandleDetailJson;
    controller.DplxPane.messageHandlePing = messageHandlePingParent;
    controller.DplxPane.messageHandle = messageHandleDetailDPLX;
    controller.paneListTitle.messageHandle = messageHandleListTitle;
    controller.paneWait.messageHandlePing = null;
    ;
    controller.paneWait.messageHandle = messageHandleWaitBox;
    controller.JsonStack = new Array();
}
// appstate
// ------------------
// loadMode
// resolveMode
// navigateMode
// message types
// -------------------
// githubLoadRequest
// loadResolveStarting
// loadPending
// loadSuccess
// loadFail
// loadEntity
// loadModeResult
// loadFinished
// resolveStarting
// statusMessage
// resolveModeResult
// loadResolveFinish
// detailTabSelect
// entityHierarchySelect
// multiSelectEntityAdd
// entityListSelect
// folderHierarchySelect
// attributeListSelect
// loadState
// -----------
// 0 = unloaded
// 1 = ok
// 2 = error
function messageHandlePingMainControl(messageType, data1, data2) {
    if (messageType == "statusMessage") {
        controller.mainContainer.messageHandle(messageType, data1, data2);
        return;
    }
    if (controller.appState === "navigateMode") {
        if (messageType === "githubLoadRequest" || messageType === "filesLoadRequest") {
            controller.pendingLoads = new Set();
            controller.loadFails = 0;
            controller.appState = "loadMode";
            controller.mainContainer.messageHandle("detailTabSelect", "status_tab", null);
            if (messageType === "githubLoadRequest") {
                // use the expected shape and entities
                controller.navData = controller.navDataGhExpected;
            }
            if (messageType === "filesLoadRequest") {
                // construct a nav hierarchy from the set of file paths selected by the user
                controller.navData = fileListToNavData(data1);
            }
            clearLoadState(controller.navData.root);
            // build a hierarchy from the built in data
            controller.hier = controller.navData.root;
            while (controller.navHost.lastChild)
                controller.navHost.removeChild(controller.navHost.lastChild);
            controller.navHost.appendChild(buildNavigation(controller.navData.root, false));
            buildIndexes();
            controller.mainContainer.messageHandle("loadResolveStarting", null, null);
            loadDocuments(messageType);
        }
        else if (messageType == "navigateRelatedSelect" || messageType == "navigateEntitySelect") {
            // if control held then add else replace
            if (!data2 || !controller.multiSelectEntityList)
                controller.multiSelectEntityList = new Set();
            if (messageType == "navigateEntitySelect") {
                // single click on an entity or folder. add or remove single or all in folder
                // request the selected things to report back, this will update the map
                controller.mainContainer.messageHandle("reportSelection", data1, null);
            }
            else {
                // double click on an entity. go find all related and related related entities.
                // loop over every entity and find ones that are currently NOT in the select list but are being pointed at by ones in the list.
                // these get added to the list and we keep going
                let entDataSelect = entityFromId(data1.id);
                controller.multiSelectEntityList.add(entDataSelect);
                let added = 1;
                while (added > 0) {
                    added = 0;
                    let toAdd = new Array();
                    controller.idLookup.forEach((entStateOther, id) => {
                        if (entStateOther.relsIn) {
                            entStateOther.relsIn.forEach((r) => {
                                let entStateRef = controller.entity2state.get(r.referencingEntity);
                                if (entStateRef === entDataSelect) {
                                    if (!controller.multiSelectEntityList.has(entStateOther)) {
                                        toAdd.push(entStateOther);
                                        added++;
                                    }
                                }
                            });
                        }
                    });
                    if (added)
                        toAdd.forEach(e => { controller.multiSelectEntityList.add(e); });
                    // only go one level
                    added = 0;
                }
            }
            // there could be multiple versions of the same entity in this set,
            // remove anything 'earlier' in the inheritence tree
            var toRemove = new Array();
            controller.multiSelectEntityList.forEach(e => {
                var entity = e.entity;
                while (entity) {
                    var base = entity.getExtendsEntityRef();
                    if (base) {
                        base = base.getObjectDef(); // turn ref into def
                        if (entity.getName() == base.getName())
                            toRemove.push(base);
                        else
                            base = null;
                    }
                    entity = base;
                }
            });
            toRemove.forEach(e => {
                var baseState = controller.entity2state.get(e);
                if (baseState)
                    controller.multiSelectEntityList.delete(baseState);
            });
            // repaint that selection
            controller.mainContainer.messageHandle("navigateEntitySelect", controller.multiSelectEntityList, controller.multiSelectEntityList.size == 1 ? controller.multiSelectEntityList.values().next().value : undefined);
        }
        else if (messageType == "reportSelection") {
            // add or remove
            if (controller.multiSelectEntityList.has(data1))
                controller.multiSelectEntityList.delete(data1);
            else
                controller.multiSelectEntityList.add(data1);
        }
        else {
            controller.mainContainer.messageHandle(messageType, data1, data2);
        }
    }
    else if (controller.appState === "loadMode") {
        if (messageType === "loadPending") {
            let entState = data1;
            controller.pendingLoads.add(entState.path + entState.docName);
            entState.loadState = 0;
            controller.mainContainer.messageHandle("loadEntity", entState, data2);
        }
        if (messageType === "loadSuccess") {
            let entState = data1;
            entState.rawContent = data2;
            entState.loadState = 1;
            controller.pendingLoads.delete(entState.path + entState.docName);
            controller.mainContainer.messageHandle("loadEntity", entState, null);
        }
        if (messageType === "loadFail") {
            let entState = data1;
            controller.loadFails++;
            entState.rawContent = null;
            entState.loadState = 2;
            controller.pendingLoads.delete(entState.path + entState.docName);
            controller.mainContainer.messageHandle("loadEntity", entState, data2);
        }
        else if (messageType === "loadModeResult") {
            if (controller.pendingLoads.size == 0) {
                if (controller.loadFails == 0) {
                    controller.mainContainer.messageHandle("resolveStarting", null, null);
                    // now create corpus
                    controller.corpus = new cdm.Corpus(controller.navData.readRoot);
                    controller.corpus.statusLevel = cdm.cdmStatusLevel.progress;
                    buildCorpus(controller.corpus, controller.corpus, controller.hier);
                    // validate whole corpus
                    controller.appState = "resolveMode";
                    resolveCorpus(data1);
                }
                else {
                    controller.appState = "navigateMode";
                    controller.mainContainer.messageHandle("statusMessage", cdm.cdmStatusLevel.error, "There was some trouble ecountered during document load or resolution. Details should appear earlier in this log.");
                    controller.mainContainer.messageHandle("loadResolveFinish", null, null);
                }
            }
        }
    }
    else if (controller.appState === "resolveMode") {
        if (messageType === "resolveModeResult") {
            if (data1) {
                controller.mainContainer.messageHandle("detailTabSelect", "property_tab", null);
                // associate the resolved entity objects with the navigation id
                indexResolvedEntities();
            }
            controller.appState = "navigateMode";
            controller.mainContainer.messageHandle("loadResolveFinish", null, null);
        }
    }
}
function fileListToNavData(fileList) {
    let noUX = new Set();
    noUX.add("schema");
    noUX.add("primitives");
    noUX.add("foundations");
    noUX.add("meanings");
    noUX.add("dwConcepts");
    noUX.add("_allImports");
    noUX.add("cdsConcepts");
    noUX.add("wellKnownCDSAttributeGroups");
    let iFolder = 1;
    let root = { id: `Folder${iFolder}`, name: "", entities: null, folders: null };
    iFolder++;
    let iEnt = 1;
    let pathToFolder = (path, under) => {
        let iSub = path.indexOf("/");
        let subPath;
        if (iSub == -1)
            subPath = path;
        else
            subPath = path.slice(0, iSub);
        if (!under.folders)
            under.folders = new Array();
        let folderSub = under.folders.find(f => f.name === subPath);
        if (!folderSub) {
            folderSub = { id: `Folder${iFolder}`, name: subPath, entities: null, folders: null };
            iFolder++;
            under.folders.push(folderSub);
        }
        if (iSub == -1)
            return folderSub;
        return pathToFolder(path.slice(iSub + 1), folderSub);
    };
    for (let iFile = 0; iFile < fileList.length; iFile++) {
        let file = fileList[iFile];
        if (file.name.endsWith(".cdm.json")) {
            let entName = file.name.slice(0, file.name.indexOf("."));
            let makeUX = !noUX.has(entName);
            let f;
            let path = (file.webkitRelativePath && file.webkitRelativePath.length) ? file.webkitRelativePath : "";
            // the first dir name is this and path ends with file. so cleanup
            let startAt = path.indexOf("/") + 1;
            if (startAt) {
                path = path.slice(startAt, path.length - (file.name.length + 1));
            }
            if (path != "") {
                f = pathToFolder(path, root);
                path = "/" + path + "/";
            }
            else
                f = root;
            let ent = { id: `Entity${iEnt}`, createUX: makeUX, description: "", path: path, docName: file.name, name: entName,
                file: file, loadState: 0, folderId: f.id };
            iEnt++;
            if (!f.entities)
                f.entities = new Array();
            f.entities.push(ent);
        }
    }
    return { readRoot: "", sourceRoot: "", root: root };
}
function buildNavigation(hier, alternate) {
    let pc = controller.document.createElement("span");
    pc.className = "parent_container";
    pc.style.background = alternate ? "var(--back-alternate1)" : "var(--back-alternate2)";
    pc.messageHandlePing = messageHandlePingParent;
    pc.messageHandle = messageHandleParentContainerBroadcast;
    pc.messageHandleBroadcast = messageHandleBroadcast;
    pc.folderState = hier;
    var title = controller.document.createElement("span");
    pc.appendChild(title);
    title.className = "group_title";
    title.id = hier.id;
    title.folderState = hier;
    title.appendChild(controller.document.createTextNode(hier.name));
    title.onclick = controller.onclickFolderItem;
    if (hier.entities) {
        var detailCont = controller.document.createElement("span");
        detailCont.className = "detail_container";
        detailCont.messageHandlePing = messageHandlePingParent;
        detailCont.messageHandle = messageHandleBroadcast;
        pc.appendChild(detailCont);
        hier.entities.forEach(e => {
            if (e.createUX) {
                var entItem = controller.document.createElement("span");
                entItem.className = "detail_item";
                entItem.id = e.id;
                entItem.title = e.description;
                entItem.entityState = e;
                entItem.appendChild(controller.document.createTextNode(e.name));
                entItem.messageHandlePing = messageHandlePingParent;
                entItem.messageHandle = messageHandleItem;
                entItem.onclick = controller.onclickDetailItem;
                entItem.ondblclick = controller.ondblclickDetailItem;
                detailCont.appendChild(entItem);
            }
        });
    }
    ;
    if (hier.folders) {
        var subCont = controller.document.createElement("span");
        subCont.className = "sub_container";
        subCont.messageHandlePing = messageHandlePingParent;
        subCont.messageHandle = messageHandleBroadcast;
        pc.appendChild(subCont);
        hier.folders.forEach(f => {
            subCont.appendChild(buildNavigation(f, !alternate));
        });
    }
    return pc;
}
function clearLoadState(hier) {
    if (hier.entities)
        hier.entities.forEach(e => { e.loadState = 0; });
    if (hier.folders) {
        hier.folders.forEach(f => { clearLoadState(f); });
    }
}
function collectEnts(hier, idLookup) {
    idLookup.set(hier.id, hier);
    if (hier.entities) {
        hier.entities.forEach(e => {
            idLookup.set(e.id, e);
        });
    }
    ;
    if (hier.folders) {
        hier.folders.forEach(f => {
            collectEnts(f, idLookup);
        });
    }
}
function indexResolvedEntities() {
    controller.entity2state = new Map();
    controller.idLookup.forEach((entState, id) => {
        if (entState.loadState == 1) {
            // look up the entity from the path to the document. assumes 1:1
            var path = entState.path + entState.docName + '/' + entState.name;
            entState.entity = controller.corpus.getObjectFromCorpusPath(path);
            entState.relsOut = new Array();
            entState.relsIn = new Array();
            // make a lookup from entity to entityState
            controller.entity2state.set(entState.entity, entState);
        }
    });
    // now confident that lookup should work, cache all the relationship complexity
    controller.idLookup.forEach((entState, id) => {
        if (entState.loadState == 1 && entState.entity) {
            var rels = entState.entity.getResolvedEntityReferences();
            if (rels) {
                rels.set.forEach(resEntRef => {
                    var referencingEntity = resEntRef.referencing.entity;
                    var referencingAttribute = resEntRef.referencing.getFirstAttribute(); // assumes single column keys
                    resEntRef.referenced.forEach(resEntRefSideReferenced => {
                        var referencedEntity = resEntRefSideReferenced.entity;
                        var referencedAttribute = resEntRefSideReferenced.getFirstAttribute(); // assumes single column keys
                        entState.relsOut.push({
                            referencingEntity: referencingEntity, referencingAttribute: referencingAttribute,
                            referencedEntity: referencedEntity, referencedAttribute: referencedAttribute
                        });
                        // also go the other way
                        var entStateOther = controller.entity2state.get(referencedEntity);
                        if (entStateOther) {
                            entStateOther.relsIn.push({
                                referencingEntity: referencingEntity, referencingAttribute: referencingAttribute,
                                referencedEntity: referencedEntity, referencedAttribute: referencedAttribute
                            });
                        }
                    });
                });
            }
        }
    });
}
function buildIndexes() {
    controller.idLookup = new Map();
    collectEnts(controller.hier, controller.idLookup);
}
function entityFromId(entId) {
    return controller.idLookup.get(entId);
}
function folderFromId(fId) {
    return controller.idLookup.get(fId);
}
function buildCorpus(corpus, folder, hier) {
    if (hier.entities) {
        hier.entities.forEach(e => {
            corpus.addDocumentFromContent(folder.getRelativePath() + e.docName, e.rawContent);
        });
    }
    ;
    if (hier.folders) {
        hier.folders.forEach(f => {
            var fSub = folder.addFolder(f.name);
            buildCorpus(corpus, fSub, f);
        });
    }
}
function loadDocuments(messageType) {
    controller.idLookup.forEach((entState, id) => {
        if (entState.loadState != undefined && entState.loadState != 1)
            controller.mainContainer.messageHandlePing("loadPending", entState, null);
    });
    controller.idLookup.forEach((entState, id) => {
        if (entState.loadState != undefined && entState.loadState != 1) {
            if (messageType == "githubLoadRequest") {
                fetch(controller.navData.readRoot + entState.path + entState.docName).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    controller.mainContainer.messageHandlePing("loadSuccess", entState, data);
                }).catch(function (reason) {
                    controller.mainContainer.messageHandlePing("loadFail", entState, reason);
                }).then(function (done) {
                    controller.mainContainer.messageHandlePing("loadModeResult", messageType, null);
                });
            }
            if (messageType == "filesLoadRequest") {
                let reader = new FileReader();
                reader.onloadend = function (event) {
                    controller.mainContainer.messageHandlePing("loadSuccess", entState, JSON.parse(reader.result));
                    controller.mainContainer.messageHandlePing("loadModeResult", messageType, null);
                };
                reader.onerror = function (event) {
                    controller.mainContainer.messageHandlePing("loadFail", entState, reader.error);
                    controller.mainContainer.messageHandlePing("loadModeResult", messageType, null);
                };
                reader.readAsText(entState.file);
            }
        }
    });
}
function resolveCorpus(messageType) {
    let statusRpt = (level, msg, path) => {
        if (level != cdm.cdmStatusLevel.info)
            controller.mainContainer.messageHandlePing("statusMessage", level, msg);
    };
    controller.mainContainer.messageHandlePing("statusMessage", cdm.cdmStatusLevel.progress, "resolving imports...");
    // first resolve all of the imports to pull other docs into the namespace
    controller.corpus.resolveImports((uri) => {
        if (messageType == "githubLoadRequest") {
            return new Promise((resolve, reject) => {
                // super mixed up. 
                // resolve imports take a callback that askes for promise to do URI resolution.
                // so here we are, working on that promise
                fetch(controller.corpus.rootPath + uri).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    resolve([uri, data]);
                }).catch(function (reason) {
                    reject([uri, reason]);
                });
            });
        }
        else {
            controller.mainContainer.messageHandlePing("statusMessage", cdm.cdmStatusLevel.error, `can't resolve import of '${uri}' in local file mode. you must load the file directly.`);
        }
    }, statusRpt).then((r) => {
        // success resolving all imports
        controller.mainContainer.messageHandlePing("statusMessage", cdm.cdmStatusLevel.progress, "validating schemas...");
        if (r) {
            let validateStep = (currentStep) => {
                return controller.corpus.resolveReferencesAndValidate(currentStep, statusRpt, cdm.cdmStatusLevel.error).then((nextStep) => {
                    if (nextStep == cdm.cdmValidationStep.error) {
                        controller.mainContainer.messageHandlePing("statusMessage", cdm.cdmStatusLevel.error, "validating step failed.");
                        controller.mainContainer.messageHandlePing("resolveModeResult", false, null);
                    }
                    else if (nextStep == cdm.cdmValidationStep.finished) {
                        controller.mainContainer.messageHandlePing("statusMessage", cdm.cdmStatusLevel.progress, "validation finished.");
                        controller.mainContainer.messageHandlePing("resolveModeResult", true, null);
                    }
                    else {
                        // success resolving all imports
                        return validateStep(nextStep);
                    }
                }).catch((reason) => {
                    controller.mainContainer.messageHandlePing("statusMessage", cdm.cdmStatusLevel.error, "Oops! internal failure during validation, see browser debug output for details");
                    console.log('exception during validation');
                    console.log(reason);
                    controller.mainContainer.messageHandlePing("resolveModeResult", false, null);
                });
            };
            return validateStep(cdm.cdmValidationStep.start);
        }
    });
}
function messageHandlePingParent(messageType, data1, data2) {
    this.parentElement.messageHandlePing(messageType, data1, data2);
}
function messageHandleBroadcast(messageType, data1, data2) {
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].messageHandle)
                this.children[i].messageHandle(messageType, data1, data2);
        }
    }
}
function messageHandleParentContainerBroadcast(messageType, data1, data2) {
    if (messageType === "reportSelection") {
        // report for us or for null (folder above us)
        if (this.folderState === data1 || !data1) {
            data1 = null;
        }
    }
    this.messageHandleBroadcast(messageType, data1, data2);
}
function selectBackground(flag1, flag3, color1, color2, color3) {
    if (flag1 && flag3)
        return "linear-gradient(to right, " + color1 + ", " + color2 + ", " + color3 + ")";
    if (flag1)
        return "linear-gradient(to right, " + color1 + ", " + color2 + ", " + color2 + ")";
    if (flag3)
        return "linear-gradient(to right, " + color2 + ", " + color2 + ", " + color3 + ")";
    return color2;
}
function messageHandleItem(messageType, data1, data2) {
    if (messageType == "loadEntity" && data1.id == this.id) {
        var background;
        if (data1.loadState == 0)
            background = "var(--item-back-loading)";
        else if (data1.loadState == 1)
            background = "var(--item-back-normal)";
        else if (data1.loadState == 2)
            background = "var(--item-back-failed)";
        if (background)
            this.style.background = selectBackground(false, false, "var(--item-back-referenced)", background, "var(--item-back-referencing)");
        return;
    }
    var entityStateThis = entityFromId(this.id);
    if (entityStateThis.loadState == 1) {
        if (messageType === "reportSelection") {
            // report for us or for null (folder above us)
            if (entityStateThis === data1 || !data1)
                controller.mainContainer.messageHandlePing("reportSelection", entityStateThis);
        }
        if (messageType === "navigateEntitySelect" || messageType == "listItemSelect") {
            // handle the attribute select first
            if (messageType == "listItemSelect" && data1.resolvedName) {
                let cdmAttribute = data1.attribute;
                background = "var(--item-back-normal)";
                // does the attribute pointed at this?
                var isReferencing = (entityStateThis.relsIn.some((r) => { return r.referencingAttribute && r.referencingAttribute.attribute === cdmAttribute; }));
                // does the attribute get pointed at by this?
                var isReferenced = (entityStateThis.relsOut.some((r) => { return r.referencedAttribute && r.referencedAttribute.attribute === cdmAttribute; }));
                this.style.background = selectBackground(isReferencing, isReferenced, "var(--item-back-referenced)", background, "var(--item-back-referencing)");
            }
            else {
                var entitySelcted;
                if (messageType === "navigateEntitySelect") {
                    let set = data1;
                    // selection is shown with a fat border
                    if (set.has(this.entityState)) {
                        this.style.borderWidth = "var(--item-border-selected)";
                        this.style.margin = "var(--item-margin-selected)";
                    }
                    else {
                        this.style.borderWidth = "var(--item-border-normal)";
                        this.style.margin = "var(--item-margin-normal)";
                    }
                    if (data2)
                        entitySelcted = data2.entity;
                }
                else {
                    // must be list select from multi entity 
                    entitySelcted = data1.entity;
                }
                if (entitySelcted) {
                    // base and extensions are shown with background
                    // get info about any baseclass of this entity
                    if (entityStateThis.entity) {
                        var baseThis = entityStateThis.entity.getExtendsEntityRef();
                        if (baseThis)
                            baseThis = baseThis.getObjectDef(); // turn ref into def
                        // selected base
                        var baseSelect = entitySelcted.getExtendsEntityRef();
                        if (baseSelect)
                            baseSelect = baseSelect.getObjectDef();
                        background = "var(--item-back-normal)";
                        if (baseSelect === entityStateThis.entity)
                            background = "var(--item-back-base)";
                        if (baseThis === entitySelcted)
                            background = "var(--item-back-extension)";
                        // does this entity point at the selection
                        var isReferencing = (entityStateThis.relsOut.some((r) => { return r.referencedEntity === entitySelcted; }));
                        // does the selection point at this
                        var isReferenced = (entityStateThis.relsIn.some((r) => { return r.referencingEntity === entitySelcted; }));
                        this.style.background = selectBackground(isReferenced, isReferencing, "var(--item-back-referenced)", background, "var(--item-back-referencing)");
                    }
                }
            }
        }
    }
}
function messageHandleListTitle(messageType, data1, data2) {
    if (messageType === "navigateEntitySelect") {
        if (data2)
            this.getElementsByClassName("group_title")[0].innerHTML = "Attributes for Selected";
        else
            this.getElementsByClassName("group_title")[0].innerHTML = "Selected Entities";
    }
}
function messageHandleList(messageType, data1, data2) {
    if (messageType === "navigateEntitySelect") {
        // clear old att list and fill a new one
        while (this.lastChild)
            this.removeChild(this.lastChild);
        let set = data1;
        if (!data2) {
            set.forEach(e => {
                var aSpan = controller.document.createElement("span");
                aSpan.className = "list_item";
                aSpan.textContent = e.name;
                aSpan.cdmObject = e;
                aSpan.onclick = controller.onclickListItem;
                aSpan.messageHandle = messageHandleListItem;
                this.appendChild(aSpan);
            });
        }
        else {
            // use the resolved attributes from the entity
            let entity = data2.entity;
            if (data1 && entity) {
                let atts = entity.getResolvedAttributes();
                let inherited = entity.countInheritedAttributes();
                if (atts) {
                    atts.set = atts.set.sort(function (l, r) {
                        if ((l.insertOrder < inherited) == (r.insertOrder < inherited))
                            return l.resolvedName.localeCompare(r.resolvedName);
                        return (l.insertOrder < inherited) == true ? 1 : -1;
                    });
                    let l = atts.set.length;
                    for (var i = 0; i < l; i++) {
                        var aSpan = controller.document.createElement("span");
                        var att = atts.set[i];
                        aSpan.className = "list_item";
                        aSpan.textContent = att.resolvedName;
                        aSpan.cdmObject = att;
                        aSpan.onclick = controller.onclickListItem;
                        aSpan.messageHandle = messageHandleListItem;
                        aSpan.inherited = att.insertOrder < inherited;
                        this.appendChild(aSpan);
                    }
                }
            }
        }
    }
    this.messageHandleBroadcast(messageType, data1, data2);
}
function messageHandleListItem(messageType, data1, data2) {
    if (messageType === "navigateEntitySelect") {
        if (data2) {
            var entityState = data2;
            var background = "var(--item-back-normal)";
            if (this.inherited)
                background = "var(--item-back-base)";
            // use relationships from entity
            // does this attribute point out?
            var isReferencing = (entityState.relsOut.some((r) => { return r.referencingAttribute && r.referencingAttribute.attribute === this.cdmObject.attribute; }));
            // does the attribute get pointed at?
            var isReferenced = (entityState.relsIn.some((r) => { return r.referencedAttribute && r.referencedAttribute.attribute === this.cdmObject.attribute; }));
            this.style.background = selectBackground(isReferenced, isReferencing, "var(--item-back-referencing)", background, "var(--item-back-referenced)");
        }
    }
    else if (messageType === "listItemSelect") {
        if (this.cdmObject === data1) {
            this.style.borderWidth = "var(--item-border-selected)";
            this.style.padding = "var(--list-item-padding-selected)";
        }
        else {
            this.style.borderWidth = "var(--item-border-normal)";
            this.style.padding = "var(--list-item-padding-normal)";
        }
    }
}
function messageHandleDetailTab(messageType, data1, data2) {
    if (messageType == "detailTabSelect") {
        var background;
        if (data1 == this.id)
            background = "var(--back-alternate2)";
        else
            background = "var(--back-alternate1)";
        this.style.background = background;
    }
}
function messageHandleDetailStatus(messageType, data1, data2) {
    var addLine = function (to, line, errorInfo) {
        if (to.innerHTML && to.innerHTML.length > 256000)
            to.innerHTML = "";
        if (errorInfo) {
            to = to.appendChild(controller.document.createElement("span"));
            to.className = "status-text-error";
            if (typeof (errorInfo) != "boolean") {
                to.appendChild(controller.document.createTextNode(errorInfo));
                to.appendChild(controller.document.createElement("br"));
            }
        }
        to.appendChild(controller.document.createTextNode(line));
        to.appendChild(controller.document.createElement("br"));
        controller.paneDetailHost.scrollTop = controller.paneDetailHost.scrollHeight;
    };
    if (messageType == "statusMessage") {
        addLine(this, data2, data1 === cdm.cdmStatusLevel.error);
    }
    else if (messageType == "loadEntity") {
        addLine(this, data1.path + data1.docName, data2);
    }
    else if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "status_tab") ? "none" : "block";
    }
}
function messageHandleDetailDPLX(messageType, data1, data2) {
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "dplx_tab") ? "none" : "block";
        changeDPLX();
    }
    if (messageType == "navigateEntitySelect") {
        changeDPLX();
    }
}
function changeDPLX() {
    if (controller.DplxPane.style.display == "block") {
        var jsonText = "";
        if (controller.multiSelectEntityList && controller.multiSelectEntityList.size) {
            let converter = new cdm2dplx.Converter();
            converter.bindingType = "byol";
            converter.relationshipsType = "inclusive";
            converter.schemaUriBase = "";
            converter.partitionPattern = "https://[your storage account name].blob.core.windows.net/[your blob path]/$1.csv?test=1";
            let set = new Array();
            controller.multiSelectEntityList.forEach(entState => { if (entState.entity)
                set.push(entState.entity); });
            let dplx = converter.convertEntities(set, "exampleDataPoolForBYOD");
            jsonText = JSON.stringify(dplx, null, 2);
        }
        controller.DplxPane.innerHTML = "<pre><code>" + jsonText + "</code></pre>";
    }
}
function messageHandleDetailJson(messageType, data1, data2) {
    var cdmObject;
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "json_tab") ? "none" : "block";
    }
    if (messageType == "navigateEntitySelect") {
        if (data2)
            cdmObject = data2.entity;
    }
    if (messageType == "listItemSelect") {
        if (data1.resolvedName) {
            cdmObject = data1.attribute;
        }
        else {
            // assume entity
            cdmObject = data1.entity;
        }
    }
    if (cdmObject) {
        clearJsonPane();
        pushJsonPane(cdmObject);
    }
}
function clearJsonPane() {
    controller.JsonStack = new Array();
}
function pushJsonPane(cdmObject) {
    controller.JsonStack.push(cdmObject);
    drawJsonStack();
}
function popJsonPane() {
    controller.JsonStack.pop();
    drawJsonStack();
}
function detailJsonJump(path) {
    var detailObject = controller.corpus.getObjectFromCorpusPath(path);
    pushJsonPane(detailObject);
}
function drawJsonStack() {
    let cdmObject = controller.JsonStack[controller.JsonStack.length - 1];
    let json = cdmObject.copyData(true);
    let jsonText = JSON.stringify(json, null, 2);
    // string refs got exploded. turn them back into strings with links
    jsonText = jsonText.replace(/{[\s]+\"corpusPath": \"([^ \"]+)\",\n[\s]+\"identifier\": \"([^\"]+)\"\n[\s]+}/gm, "<a href=\"javascript:detailJsonJump('$1')\" title=\"$1\">\"$2\"</a>");
    if (controller.JsonStack.length > 1)
        controller.backButton.style.display = "inline-block";
    else
        controller.backButton.style.display = "none";
    controller.JsonPane.innerHTML = "<pre><code>" + jsonText + "</code></pre>";
}
function makeParamValue(param, value) {
    if (!value)
        return controller.document.createTextNode("");
    // if a string constant, call get value to turn into itself or a reference if that is what is held there
    if (value.getObjectType() == cdm.cdmObjectType.stringConstant)
        value = value.getValue();
    // if still  a string, it is just a string
    if (value.getObjectType() == cdm.cdmObjectType.stringConstant)
        return controller.document.createTextNode(value.getConstant());
    // if this is a constant table, then expand into an html table
    if (value.getObjectType() == cdm.cdmObjectType.entityRef && value.getObjectDef().getObjectType() == cdm.cdmObjectType.constantEntityDef) {
        var entShape = value.getObjectDef().getEntityShape();
        var entValues = value.getObjectDef().getConstantValues();
        if (!entValues && entValues.length == 0)
            return controller.document.createTextNode("empty table");
        var valueTable = controller.document.createElement("table");
        valueTable.className = "trait_param_value_table";
        var valueRow = controller.document.createElement("tr");
        valueRow.className = "trait_param_value_table_header_row";
        var shapeAtts = entShape.getResolvedAttributes();
        let l = shapeAtts.set.length;
        for (var i = 0; i < l; i++) {
            var th = controller.document.createElement("th");
            th.className = "trait_param_value_table_header_detail";
            th.appendChild(controller.document.createTextNode(shapeAtts.set[i].resolvedName));
            valueRow.appendChild(th);
        }
        valueTable.appendChild(valueRow);
        for (var r = 0; r < entValues.length; r++) {
            var valueRow = controller.document.createElement("tr");
            valueRow.className = "trait_param_value_table_detail_row";
            valueTable.appendChild(valueRow);
            var rowData = entValues[r];
            if (rowData && rowData.length) {
                for (var c = 0; c < rowData.length; c++) {
                    var td = controller.document.createElement("td");
                    td.className = "trait_param_value_table_detail_detail";
                    valueRow.appendChild(td);
                    var tvalue = rowData[c];
                    if (tvalue)
                        td.appendChild(controller.document.createTextNode(tvalue));
                }
            }
        }
        var divHolder = controller.document.createElement("div");
        divHolder.className = "trait_param_value_table_host";
        divHolder.appendChild(valueTable);
        return divHolder;
    }
    else {
        // stick json in there
        var code = controller.document.createElement("code");
        var json = JSON.stringify(value, null, 2);
        if (json.length > 67)
            json = json.slice(0, 50) + "...(see JSON tab)";
        code.appendChild(controller.document.createTextNode(json));
        return code;
    }
}
function makeParamRow(param, value) {
    var paramRow = controller.document.createElement("tr");
    paramRow.className = "trait_parameter_table_detail_row";
    var td = controller.document.createElement("td");
    td.className = "trait_parameter_table_detail_name";
    td.appendChild(controller.document.createTextNode(param.getName()));
    paramRow.appendChild(td);
    var td = controller.document.createElement("td");
    td.className = "trait_parameter_table_detail_value";
    td.appendChild(makeParamValue(param, value));
    paramRow.appendChild(td);
    var td = controller.document.createElement("td");
    td.className = "trait_parameter_table_detail_type";
    if (param.getDataTypeRef())
        td.appendChild(controller.document.createTextNode(param.getDataTypeRef().getObjectDef().getName()));
    paramRow.appendChild(td);
    var td = controller.document.createElement("td");
    td.className = "trait_parameter_table_detail_explanation";
    if (param.getExplanation())
        td.appendChild(controller.document.createTextNode(param.getExplanation()));
    paramRow.appendChild(td);
    return paramRow;
}
function makeTraitRow(rt, alt) {
    var traitRow = controller.document.createElement("tr");
    traitRow.className = "trait_table_row";
    var innerTable = controller.document.createElement("table");
    innerTable.className = "trait_table_row_table";
    if (alt)
        innerTable.style = "background-color: var(--table-back-alternate)";
    else
        innerTable.style = "background-color: var(--back-alternate2)";
    traitRow.appendChild(innerTable);
    var innerRow = controller.document.createElement("tr");
    innerRow.className = "trait_table_row_table_row";
    innerTable.appendChild(innerRow);
    var td = controller.document.createElement("td");
    td.className = "trait_table_detail_name";
    td.appendChild(controller.document.createTextNode(rt.trait.getName()));
    innerRow.appendChild(td);
    var td = controller.document.createElement("td");
    td.className = "trait_table_detail_explanation";
    if (rt.trait.getExplanation())
        td.appendChild(controller.document.createTextNode(rt.trait.getExplanation()));
    innerRow.appendChild(td);
    if (rt.parameterValues && rt.parameterValues.length) {
        var innerRow = controller.document.createElement("tr");
        innerRow.className = "trait_table_row_table_row";
        innerTable.appendChild(innerRow);
        var td = controller.document.createElement("td");
        td.className = "trait_parameter_table_holder";
        td.colSpan = 3;
        innerRow.appendChild(td);
        var pvTable = controller.document.createElement("table");
        pvTable.className = "trait_parameter_table";
        td.appendChild(pvTable);
        var pvRow = controller.document.createElement("tr");
        pvRow.className = "trait_parameter_table_header_row";
        var td = controller.document.createElement("th");
        td.className = "trait_parameter_table_header_name";
        td.appendChild(controller.document.createTextNode("Parameter"));
        pvRow.appendChild(td);
        var td = controller.document.createElement("th");
        td.className = "trait_parameter_table_header_value";
        td.appendChild(controller.document.createTextNode("Value"));
        pvRow.appendChild(td);
        var td = controller.document.createElement("th");
        td.className = "trait_parameter_table_header_type";
        td.appendChild(controller.document.createTextNode("Data Type"));
        pvRow.appendChild(td);
        var td = controller.document.createElement("th");
        td.className = "trait_parameter_table_header_explanation";
        td.appendChild(controller.document.createTextNode("Explanation"));
        pvRow.appendChild(td);
        pvTable.appendChild(pvRow);
        // each param and value
        let l = rt.parameterValues.length;
        for (var i = 0; i < l; i++)
            pvTable.appendChild(makeParamRow(rt.parameterValues.getParameter(i), rt.parameterValues.getValue(i)));
    }
    return traitRow;
}
function messageHandleDetailTraits(messageType, data1, data2) {
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "trait_tab") ? "none" : "block";
        return;
    }
    var cdmObject;
    if (messageType == "navigateEntitySelect") {
        if (data2)
            cdmObject = data2.entity;
    }
    if (messageType == "listItemSelect") {
        if (data1.resolvedName) {
            cdmObject = data1.attribute;
        }
        else {
            // assume entity
            cdmObject = data1.entity;
        }
    }
    if (cdmObject) {
        while (this.childNodes.length > 0)
            this.removeChild(this.lastChild);
        var rts = cdmObject.getResolvedTraits();
        if (rts) {
            var traitTable = controller.document.createElement("table");
            traitTable.className = "trait_table";
            var l = rts.size;
            for (let i = 0; i < l; i++)
                traitTable.appendChild(makeTraitRow(rts.set[i], i % 2 != 0));
            this.appendChild(traitTable);
        }
    }
}
function messageHandleDetailProperties(messageType, data1, data2) {
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "property_tab") ? "none" : "block";
        return;
    }
    let resolvedObject;
    let isAtt = false;
    if (messageType == "navigateEntitySelect") {
        if (data2) {
            resolvedObject = data2.entity.getResolvedEntity();
        }
    }
    if (messageType == "listItemSelect") {
        if (data1.resolvedName) {
            resolvedObject = data1;
            isAtt = true;
        }
        else {
            // assume entity
            resolvedObject = data1.entity.getResolvedEntity();
        }
    }
    if (resolvedObject) {
        while (this.childNodes.length > 0)
            this.removeChild(this.lastChild);
        let propertyTable = controller.document.createElement("table");
        propertyTable.className = "property_table";
        let propertyRow = controller.document.createElement("tr");
        propertyRow.className = "property_table_header";
        propertyTable.appendChild(propertyRow);
        let propertyLabel = controller.document.createElement("td");
        propertyLabel.className = "property_table_header_label";
        propertyRow.appendChild(propertyLabel);
        let propertyValue = controller.document.createElement("td");
        propertyValue.className = "property_table_header_value";
        propertyRow.appendChild(propertyValue);
        propertyLabel.appendChild(controller.document.createTextNode(isAtt ? "Attribute" : "Entity"));
        propertyValue.appendChild(controller.document.createTextNode(resolvedObject.resolvedName));
        let addRow = (propName) => {
            let val = resolvedObject[propName];
            if (val != undefined) {
                propertyRow = controller.document.createElement("tr");
                propertyRow.className = "property_table_detail";
                propertyTable.appendChild(propertyRow);
                propertyLabel = controller.document.createElement("td");
                propertyLabel.className = "property_table_detail_label";
                propertyRow.appendChild(propertyLabel);
                propertyValue = controller.document.createElement("td");
                propertyValue.className = "property_table_detail_value";
                propertyRow.appendChild(propertyValue);
                propertyLabel.appendChild(controller.document.createTextNode(propName));
                if (typeof (val) == "string")
                    propertyValue.appendChild(controller.document.createTextNode(val));
                else if (val instanceof Array) {
                    var pre = controller.document.createElement("pre");
                    var code = controller.document.createElement("code");
                    pre.appendChild(code);
                    var json = JSON.stringify(val, null, 2);
                    code.appendChild(controller.document.createTextNode(json));
                    propertyValue.appendChild(pre);
                }
                else
                    propertyValue.appendChild(controller.document.createTextNode(val.toString()));
            }
        };
        if (isAtt) {
            addRow("displayName");
            addRow("description");
            addRow("isPrimaryKey");
            addRow("dataFormat");
            addRow("maximumLength");
            addRow("maximumValue");
            addRow("minimumValue");
            addRow("isReadOnly");
            addRow("isNullable");
            addRow("creationSequence");
            addRow("sourceName");
            addRow("valueConstrainedToList");
            addRow("defaultValue");
        }
        else {
            addRow("displayName");
            addRow("description");
            addRow("version");
            addRow("primaryKey");
            addRow("cdmSchemas");
            addRow("sourceName");
        }
        this.appendChild(propertyTable);
    }
}
function messageHandleButton(messageType, data1, data2) {
}
function copyActivePane() {
    var activePane;
    if (controller.statusPane.style.display != "none")
        activePane = controller.statusPane;
    else if (controller.propertiesPane.style.display != "none")
        activePane = controller.propertiesPane;
    else if (controller.traitsPane.style.display != "none")
        activePane = controller.traitsPane;
    else if (controller.JsonPane.style.display != "none")
        activePane = controller.JsonPane;
    else if (controller.DplxPane.style.display != "none")
        activePane = controller.DplxPane;
    if (activePane) {
        var range = controller.document.createRange();
        range.setStart(activePane.firstChild, 0);
        range.setEndAfter(activePane.lastChild);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        controller.document.execCommand("copy");
    }
}
function messageHandleWaitBox(messageType, data1, data2) {
    if (messageType === "loadResolveStarting") {
        let width = 300;
        let height = 200;
        let left = (window.innerWidth - width) / 2;
        let top = (window.innerHeight - height) / 2;
        controller.paneWait.style = "display:block;left:" + left + "px; top:" + top + "px; width:" + width + "px; height:" + height + "px;";
    }
    if (messageType === "loadResolveFinish") {
        controller.paneWait.style = "display:none";
    }
}
