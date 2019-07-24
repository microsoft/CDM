import { IExplorerDocument, IExplorerEntity, EntityContainer, IExplorerResolvedEntity, ResolveOptions, DirectiveSet, IExplorerParameter, IExplorerTrait, IExplorerTypeAttribute, IExplorerAttributeBase, IExplorerAttributeGroup, IConstantEntityArgumentValues, IExplorerArgumentValue, ExplorerArgumentValueType, INavigatorData, IEntityState, IRelationship, LoggingLevel, IFolder, LoadStatus, IFileInfo, EntityFileLoader } from 'entity-api';


interface IDOMFile extends IFileInfo {
    file: File;
}

class Controller {
    public document: any;
    public entityContainer: EntityContainer;
    public mainContainer: any;
    public listContainer: any;
    public paneDetailHost: any;
    public statusPane: any;
    public traitsPane: any;
    public propertiesPane: any;
    public definitionPane: any;
    public resolvedPane: any;
    public paneListTitle: any;
    public paneWait: any;
    public paneDirectivesHost: any;
    public DefinitionStack: Array<IExplorerResolvedEntity>;
    public ResolvedStack: Array<IExplorerResolvedEntity>;
    public cdmDocSelected: IExplorerDocument;
    public cdmDocDefinition: IExplorerDocument;
    public cdmDocResolved: IExplorerDocument;
    public onclickDetailItem: any;
    public ondblclickDetailItem: any;
    public onclickFolderItem: any;
    public onclickListItem: any;
    public onclickResizeUp: any;
    public onclickResizeDown: any;

    public backDefinitionButton: any;
    public backResolvedButton: any;
    public checkboxUgly: any;
    public labelUgly: any;

    public checkboxDirectiveRelational: any;
    public checkboxDirectiveNormalized: any;
    public checkboxDirectiveStructured: any;

    public appState: string;
    public pendingLoads: Set<any>
    public loadFails: number;
    public navData: INavigatorData;
    public navDataGhExpected: INavigatorData;
    public hier: any;
    public navHost: any;
    public multiSelectEntityList: Set<IEntityState>;
    public entity2state: Map<IExplorerEntity, IEntityState>;
    public idLookup: Map<string, IEntityState>;
    public searchTerm: string;
}

let controller: Controller = new Controller();
export { controller };
export function init() {

    controller.entityContainer = new EntityContainer();
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
    controller.definitionPane.messageHandlePing = messageHandlePingParent;
    controller.definitionPane.messageHandle = messageHandleDetailDefinition;
    controller.resolvedPane.messageHandlePing = messageHandlePingParent;
    controller.resolvedPane.messageHandle = messageHandleDetailResolved

    controller.paneListTitle.messageHandle = messageHandleListTitle;
    controller.paneDirectivesHost.messageHandle = undefined;

    controller.paneWait.messageHandlePing = null;;
    controller.paneWait.messageHandle = messageHandleWaitBox;

    controller.DefinitionStack = new Array();
    controller.ResolvedStack = new Array();
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
                let fileInfo: IDOMFile[] = [];
                let fileList = (data1 as FileList);
                for (let iFile = 0; iFile < fileList.length; iFile++) {
                    let file = fileList[iFile];
                    fileInfo.push(<IDOMFile>{
                        name: file.name,
                        path: ((file as any).webkitRelativePath && (file as any).webkitRelativePath.length) ? (file as any).webkitRelativePath : "",
                        file: file
                    });
                }
                controller.navData = EntityFileLoader.GenerateNavigatorData(fileInfo);
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
                controller.multiSelectEntityList = new Set<IEntityState>();

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
                    let toAdd = new Array<IEntityState>();
                    controller.idLookup.forEach((entStateOther, id) => {
                        if (entStateOther.relsIn) {
                            entStateOther.relsIn.forEach((r: IRelationship) => {
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
                        toAdd.forEach(e => { controller.multiSelectEntityList.add(e) });

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
                    let base: IExplorerEntity = entity.getBaseEntity(getResolutionOptions(entity.declaredIn));
                    if (base) {
                        if (entity.name == base.name) // and the names must match. 
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
            let singleSelected = controller.multiSelectEntityList.size == 1 ? controller.multiSelectEntityList.values().next().value : undefined;
            controller.mainContainer.messageHandle("navigateEntitySelect", controller.multiSelectEntityList, singleSelected);
        }
        else if (messageType == "reportSelection") {
            // add or remove
            if (controller.multiSelectEntityList.has(data1))
                controller.multiSelectEntityList.delete(data1);
            else
                controller.multiSelectEntityList.add(data1);
        }
        else if (messageType == "searchAdd") {
            if (controller.searchTerm == undefined)
                controller.searchTerm = "";
            controller.searchTerm += data1;
            controller.mainContainer.messageHandle("applySearchTerm", controller.searchTerm);
        }
        else if (messageType == "searchRemove") {
            if (controller.searchTerm && controller.searchTerm.length > 0) {
                if (controller.searchTerm.length == 1)
                    controller.searchTerm = undefined;
                else
                    controller.searchTerm = controller.searchTerm.slice(0, controller.searchTerm.length - 1);
                controller.mainContainer.messageHandle("applySearchTerm", controller.searchTerm);
            }
        }
        else if (messageType == "searchClear") {
            if (controller.searchTerm) {
                controller.searchTerm = undefined;
                controller.mainContainer.messageHandle("applySearchTerm", controller.searchTerm);
            }
        } else if (messageType === "directiveAlter") {
            if (controller.multiSelectEntityList && controller.multiSelectEntityList.size) {
                let singleSelected = controller.multiSelectEntityList.size == 1 ? controller.multiSelectEntityList.values().next().value : undefined;
                controller.mainContainer.messageHandle("navigateEntitySelect", controller.multiSelectEntityList, singleSelected);
            }
        }
        else if (messageType == "additionalValidationRequest") {
            controller.entityContainer.generateWarnings();
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
            let waitPanel = document.getElementById("wait_pane");
            let errorContent = "Loading failed for file: '"+data1.docName+"'. This might be caused by ad blocking software. Please disable the ad blockers on this site and reload the page.";
            waitPanel.children[0].textContent = errorContent;
            waitPanel.style.background = "#FF6464";
            waitPanel.style.color = "#ffffff";
            throw new Error(errorContent);
        } else if (messageType === "loadModeResult") {
            if (controller.pendingLoads.size == 0) {
                if (controller.loadFails == 0) {
                    controller.mainContainer.messageHandle("resolveStarting", null, null);
                    controller.entityContainer.loadEntitiesFromDocuments(controller.navData.readRoot, controller.hier);
                    // validate whole corpus
                    controller.appState = "resolveMode"
                    controller.entityContainer.resolveEntities(data1, (operation: string, level: any, message: string) => controller.mainContainer.messageHandlePing(operation, level, message));
                }
                else {
                    controller.appState = "navigateMode"
                    controller.mainContainer.messageHandle("statusMessage", LoggingLevel.error, "There was some trouble ecountered during document load or resolution. Details should appear earlier in this log.");
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
                let entityStates = Array.from(controller.idLookup.values()).filter(entState => entState.loadState == 1)
                let entityPaths = entityStates.map(entState => entState.path + entState.docName + '/' + entState.name)
                let mappedEntities = controller.entityContainer.mapEntities(entityPaths);
                entityStates.forEach((entityState, idx) => {
                    entityState.entity = mappedEntities[idx];
                    entityState.relsIn = new Array<IRelationship>();
                    entityState.referencedEntityNames = new Set<string>();
                    entityState.referencedEntityCache = new Map<IExplorerEntity, boolean>();
                    if (entityState.entity) {
                        entityState.referencedEntityNames = new Set<string>(entityState.entity.entityReferences.filter(ref => ref.referencingEntity == entityState.entity).map(ref => ref.referencedEntity.name));
                    }
                });
                controller.entity2state = new Map<IExplorerEntity, IEntityState>();
                entityStates.forEach(entityState => controller.entity2state.set(entityState.entity, entityState));
            }
            controller.appState = "navigateMode"
            controller.mainContainer.messageHandle("loadResolveFinish", null, null);
        }
    }

}

function buildNavigation(hier: IFolder, alternate: boolean) {

    let pc = controller.document.createElement("span");
    pc.className = "parent_container";
    pc.style.background = alternate ? "var(--back-alternate1)" : "var(--back-alternate2)"
    pc.messageHandlePing = messageHandlePingParentContainer;
    pc.messageHandle = messageHandleParentContainerBroadcast;
    pc.messageHandleBroadcast = messageHandleBroadcast;
    pc.folderState = hier;
    var titleBar = controller.document.createElement("span");
    pc.appendChild(titleBar);
    titleBar.className = "group_title_bar";
    titleBar.messageHandlePing = messageHandlePingParent;
    var title = controller.document.createElement("span");
    titleBar.appendChild(title);
    title.className = "group_title";
    title.id = hier.id;
    title.folderState = hier;
    title.appendChild(controller.document.createTextNode(hier.name));
    title.onclick = controller.onclickFolderItem;
    var resizeUp = controller.document.createElement("span");
    titleBar.appendChild(resizeUp);
    resizeUp.className = "group_title_size";
    resizeUp.appendChild(controller.document.createTextNode("+"));
    resizeUp.onclick = controller.onclickResizeUp;
    resizeUp.messageHandlePing = messageHandlePingParent;
    var resizeDown = controller.document.createElement("span");
    titleBar.appendChild(resizeDown);
    resizeDown.className = "group_title_size";
    resizeDown.appendChild(controller.document.createTextNode("-"));
    resizeDown.onclick = controller.onclickResizeDown;
    resizeDown.messageHandlePing = messageHandlePingParent;

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
    };
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

function clearLoadState(hier: IFolder) {
    if (hier.entities)
        hier.entities.forEach(e => { e.loadState = 0; });
    if (hier.folders) {
        hier.folders.forEach(f => { clearLoadState(f) });
    }
}

function collectEnts(hier: IFolder, idLookup) {
    idLookup.set(hier.id, hier);
    if (hier.entities) {
        hier.entities.forEach(e => {
            idLookup.set(e.id, e);

        });
    };
    if (hier.folders) {
        hier.folders.forEach(f => {
            collectEnts(f, idLookup);
        });
    }
}

function buildIndexes() {
    controller.idLookup = new Map();
    collectEnts(controller.hier, controller.idLookup);
}
function entityFromId(entId) {
    return controller.idLookup.get(entId);
}

function loadDocuments(messageType : string) {
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
                reader.onloadend = function(event) {
                    controller.mainContainer.messageHandlePing("loadSuccess", entState, JSON.parse(reader.result.toString()));
                    controller.mainContainer.messageHandlePing("loadModeResult", messageType, null);
                }
                reader.onerror = function (event) {
                    controller.mainContainer.messageHandlePing("loadFail", entState, reader.error);
                    controller.mainContainer.messageHandlePing("loadModeResult", messageType, null);
                }
                reader.readAsText((entState.file as IDOMFile).file);
            }
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

function resizeParentContainer(pc: any, direction: string) {
    if (direction == "down") {
        if (!pc.small || pc.small != true) {
            pc.small = true;
            pc.messageHandleBroadcast("resize", direction, null);
        }
    }
    if (direction == "up") {
        if (pc.small && pc.small == true) {
            pc.small = false;
            pc.messageHandleBroadcast("resize", direction, null);
        }
    }
}

function messageHandlePingParentContainer(messageType, data1, data2) {
    if (messageType == "resize") {
        resizeParentContainer(this, data1);
    }
    else {
        this.parentElement.messageHandlePing(messageType, data1, data2);
    }
}

function messageHandleParentContainerBroadcast(messageType, data1, data2) {
    if (messageType === "resize") {
        resizeParentContainer(this, data1);
        return;
    }
    if (messageType === "reportSelection") {
        // report for us or for null (folder above us)
        if (this.folderState === data1 || !data1) {
            data1 = null;
        }
    }
    this.messageHandleBroadcast(messageType, data1, data2)
}

function getResolutionOptions(doc: IExplorerDocument): ResolveOptions {
    let directives: DirectiveSet = 0;
    if (controller.checkboxDirectiveRelational.checked)
        directives |= DirectiveSet.ReferenceOnly;
    if (controller.checkboxDirectiveNormalized.checked)
        directives |= DirectiveSet.Normalized;
    if (controller.checkboxDirectiveStructured.checked)
        directives |= DirectiveSet.Structured;

    let resOpt: ResolveOptions = { withRespectToDocument: doc, directives: directives };
    return resOpt;
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
    if (messageType == "resize") {
        if (data1 == "down")
            this.style.fontSize = "var(--text-size-small)";
        else if (data1 == "up")
            this.style.fontSize = "var(--text-size-med)";
        return;
    }

    var entityStateThis = entityFromId(this.id);
    let searchFound = true;
    if (entityStateThis.loadState == 1) {
        if (messageType === "reportSelection") {
            // report for us or for null (folder above us)
            if (entityStateThis === data1 || !data1)
                controller.mainContainer.messageHandlePing("reportSelection", entityStateThis);
        }
        if (messageType === "applySearchTerm") {
            let searchTerm: string = data1;
            if (searchTerm) {
                searchFound = entityStateThis.name.toUpperCase().includes(searchTerm.toUpperCase());
            }
            this.style.filter = searchFound ? "" : "brightness(0.7)";
        }
        if (messageType === "navigateEntitySelect" || messageType == "listItemSelect") {
            // handle the attribute select first
            if (messageType == "listItemSelect" && data1.resolvedName) {
                let cdmAttribute: IExplorerTypeAttribute = data1;
                background = "var(--item-back-normal)";
                let entity: IExplorerEntity = entityStateThis.entity;
                if (entity) {
                    // does the attribute pointed at this? yes if 
                    var isReferencing = entity.entityReferences.some(ref => { return ref.referencingEntity == cdmAttribute.resolvedEntity.explorerEntity && ref.referencingAttributeName === cdmAttribute.name && ref.referencedEntity == entityStateThis.entity });
                    // does the attribute get pointed at by this?
                    var isReferenced = entity.entityReferences.some(ref => { return ref.referencingEntity == entityStateThis.entity && ref.referencedEntity == cdmAttribute.resolvedEntity.explorerEntity && ref.referencedAttributeName === cdmAttribute.name });
                }
                this.style.background = selectBackground(isReferencing, isReferenced, "var(--item-back-referenced)", background, "var(--item-back-referencing)");
            }
            else {
                let entitySelcted: IExplorerEntity;
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
                    if (data2) // set by navigate for single entity
                        entitySelcted = data2.entity;
                } else {
                    // must be list select from multi entity 
                    entitySelcted = data1.entity;
                }

                controller.cdmDocSelected = undefined;
                if (entitySelcted) { // will be null when list is sent, ok this keeps showing the last highlights which helps id relationships
                    // base and extensions are shown with background
                    // get info about any baseclass of this entity
                    controller.cdmDocSelected = entitySelcted.declaredIn;
                    if (entityStateThis.entity) {
                        let baseThis: IExplorerEntity = entityStateThis.entity.getBaseEntity(getResolutionOptions(controller.cdmDocSelected));
                        // selected base
                        let baseSelect: IExplorerEntity = entitySelcted.getBaseEntity(getResolutionOptions(controller.cdmDocSelected));

                        background = "var(--item-back-normal)";
                        if (entityStateThis.entity === baseSelect)
                            background = "var(--item-back-base)";
                        if (baseThis === entitySelcted)
                            background = "var(--item-back-extension)";

                        // does this entity point at the selection
                        // first see if we cached the answer from the last time asked
                        var isReferencing = false;
                        if (entityStateThis.referencedEntityCache.has(entitySelcted))
                            isReferencing = entityStateThis.referencedEntityCache.get(entitySelcted);
                        else {
                            // need to figure the answer and then save it for next time
                            if (entityStateThis.referencedEntityNames.has(entitySelcted.name)) {
                                // yes, something with the same name, but to be specific we must resolve this entity's relationships from the POV of the selected document
                                isReferencing = false;
                                let directives = new Set<string>(["normalized", "referenceOnly"]);
                                var resolvedEntity = entityStateThis.entity.createResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
                                if (resolvedEntity && resolvedEntity.entityReferences) {
                                    isReferencing = resolvedEntity.entityReferences.some(ref => ref.referencingEntity == entityStateThis.entity && ref.referencedEntity === entitySelcted);
                                }
                            }
                            entityStateThis.referencedEntityCache.set(entitySelcted, isReferencing);
                        }

                        // does the selection point at this. already cached from that POV
                        var isReferenced = (entitySelcted.entityReferences.some((r) => { return r.referencingEntity == entitySelcted && r.referencedEntity === entityStateThis.entity }));

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
            let entity = data2.entity as IExplorerEntity;
            if (data1 && entity) {
                let resolutionOptions = getResolutionOptions(entity.declaredIn)
                let resolvedEntity = entity.createResolvedEntity(resolutionOptions);
                let atts = resolvedEntity.attributes;
                if (atts) {
                    // atts.set = atts.set.sort(function (l, r) {
                    //     if ((l.insertOrder < inherited) == (r.insertOrder < inherited))
                    //         return l.resolvedName.localeCompare(r.resolvedName);
                    //     return (l.insertOrder < inherited) == true ? 1 : -1
                    // });
                    let addAtts = (rasSub: IExplorerAttributeBase[], depth: number) => {
                        let l = rasSub.length;
                        for (var i = 0; i < l; i++) {
                            var att = rasSub[i];
                            if (att.isAttributeGroup) {
                                addAtts((att as IExplorerAttributeGroup).attributes, depth + 1);
                            }
                            else {
                                // that's right, old school graphics, just like 1987
                                let indent = "";
                                let indentCount = depth;
                                while (indentCount > 1) {
                                    indentCount--;
                                    indent += '│';
                                }
                                if (indentCount == 1) {
                                    if (l == 1)
                                        indent += '─';
                                    else if (i == 0)
                                        indent += '┌';
                                    else if (i == l - 1)
                                        indent += '└';
                                    else
                                        indent += '│';
                                }

                                var aSpan = controller.document.createElement("span");
                                aSpan.className = "list_item";
                                aSpan.textContent = indent + (att as IExplorerTypeAttribute).name;
                                aSpan.cdmObject = att;
                                aSpan.cdmSource = entity;
                                aSpan.onclick = controller.onclickListItem;
                                aSpan.messageHandle = messageHandleListItem;
                                aSpan.inherited = (att as IExplorerTypeAttribute).isInherited;
                                this.appendChild(aSpan);
                            }
                        }
                    }
                    addAtts(atts, 0);
                }
            }

        }

    }
    this.messageHandleBroadcast(messageType, data1, data2);
}

function messageHandleListItem(messageType, data1, data2) {
    if (messageType === "applySearchTerm") {
        let searchFound = true;
        let searchTerm: string = data1;
        if (searchTerm) {
            let searchAgainst: string;
            if (this.cdmObject) {
                if (this.cdmObject.resolvedName)
                    searchAgainst = this.cdmObject.resolvedName;
                else if (this.cdmObject.getName)
                    searchAgainst = this.cdmObject.getName();
                if (searchAgainst)
                    searchFound = searchAgainst.toUpperCase().includes(searchTerm.toUpperCase());
            }
        }
        this.style.filter = searchFound ? "" : "brightness(0.7)";
    }
    else if (messageType === "navigateEntitySelect") {
        if (data2) {
            var entityState = data2;
            var background = "var(--item-back-normal)"
            if (this.inherited)
                background = "var(--item-back-base)";

            let entity: IExplorerEntity = entityState.entity;
            if (entity) {
                // use relationships from entity
                // does this attribute point out?
                var isReferencing = entity.entityReferences.some(ref => ref.referencingEntity == this.cdmObject.resolvedEntity.explorerEntity && ref.referencingAttributeName === this.cdmObject.name);
                // does the attribute get pointed at?
                var isReferenced = entity.entityReferences.some(ref => ref.referencedEntity == this.cdmObject.resolvedEntity.explorerEntity && ref.referencedAttributeName === this.cdmObject.name);
            }
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

    var addLine = function (to, line, errorInfo, warningInfo) {
        if (to.innerHTML && to.innerHTML.length > 256000)
            to.innerHTML = "";

        if (errorInfo || warningInfo) {
            to = to.appendChild(controller.document.createElement("span"));
            if (errorInfo) {
                to.className = "status-text-error";
                if (typeof (errorInfo) != "boolean") {
                    to.appendChild(controller.document.createTextNode(errorInfo));
                    to.appendChild(controller.document.createElement("br"));
                }
            }
            else {
                to.className = "status-text-warning";
            }
        }

        to.appendChild(controller.document.createTextNode(line));
        to.appendChild(controller.document.createElement("br"));
        controller.paneDetailHost.scrollTop = controller.paneDetailHost.scrollHeight;
    };

    if (messageType == "statusMessage") {
        addLine(this, data2, data1 === LoggingLevel.error, data1 === LoggingLevel.warning);
    }
    else if (messageType == "loadEntity") {
        addLine(this, data1.path + data1.docName, data2, null);
    }
    else if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "status_tab") ? "none" : "block";
    }
}

function applySearchTerm(html: string) {
    if (!controller.searchTerm)
        return html;

    let localTerm = controller.searchTerm.replace(/([^a-zA-Z0-9.])/g, "");
    if (localTerm.length > 0) {
        // only apply term to text not inside html
        // regex not supporting lookbehinds means do this the hard way
        let getNextSegment = (startAt: number): [number, number] => {
            let end = html.indexOf("<", startAt);
            if (end == -1)
                return [startAt, html.length];
            if (end > startAt)
                return [startAt, end];
            // must start with a tag, so find end. assume there are no embedded tag ending inside this tag
            let newStartAt = html.indexOf(">", startAt);
            if (newStartAt == -1)
                return [html.length, html.length];
            end = html.indexOf("<", newStartAt);
            if (end == -1)
                return [newStartAt, html.length];
            if (end > startAt)
                return [newStartAt, end];
        }

        let search = new RegExp(`(${localTerm})`, "g");
        let newHtml = "";
        let lastStart = 0;
        let sourceLen = html.length;
        do {
            let seg = getNextSegment(lastStart);
            let segStart = seg["0"];
            let segEnd = seg["1"];
            // add any html tag that got skipped
            if (segStart > lastStart)
                newHtml += html.slice(lastStart, segStart);
            // replace in the segment
            let segmentNew = html.slice(segStart, segEnd).replace(search, "<mark>$1</mark>")
            newHtml += segmentNew;
            lastStart = segEnd;
        }
        while (lastStart < sourceLen);

        html = newHtml;
    }

    return html;
}

function messageHandleDetailResolved(messageType, data1, data2) {
    let cdmObject: IExplorerEntity;
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "resolved_tab") ? "none" : "block";
    }
    if (messageType == "navigateEntitySelect") {
        if (data2)
            cdmObject = data2.entity;
    }
    if (messageType == "listItemSelect") {
        if (data1.resolvedName) {
            clearResolvedPane();
        } else {
            // assume entity
            cdmObject = data1.entity;
        }
    }
    if (messageType == "applySearchTerm") {
        drawResolvedStack();
    }

    if (cdmObject) {
        clearResolvedPane();
        controller.cdmDocResolved = cdmObject.declaredIn
        let resolvedObject = cdmObject.createResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
        pushResolvedPane(resolvedObject);
    }
}
function clearResolvedPane() {
    controller.ResolvedStack = new Array();
}

function pushResolvedPane(cdmObject) {
    controller.ResolvedStack.push(cdmObject)
    drawResolvedStack();
}
function popResolvedPane() {
    controller.ResolvedStack.pop()
    drawResolvedStack();
}

function drawResolvedStack() {
    if (controller.ResolvedStack && controller.ResolvedStack.length) {
        let cdmObject = controller.ResolvedStack[controller.ResolvedStack.length - 1];
        let json = cdmObject.copyData(getResolutionOptions(controller.cdmDocResolved), { stringRefs: true, removeSingleRowLocalizedTableTraits: true });
        let jsonText = JSON.stringify(json, null, 2);
        // string refs got exploded. turn them back into strings with links
        jsonText = jsonText.replace(/{[\s]+\"corpusPath": \"([^ \"]+)\",\n[\s]+\"identifier\": \"([^\"]+)\"\n[\s]+}/gm,
            "<a href=\"javascript:detailResolvedJump('$1')\" title=\"$1\">\"$2\"</a>");
        if (controller.ResolvedStack.length > 1)
            controller.backResolvedButton.style.display = "inline-block";
        else
            controller.backResolvedButton.style.display = "none";

        jsonText = applySearchTerm(jsonText);

        controller.resolvedPane.innerHTML = "<pre><code>" + jsonText + "</code></pre>";
    }
}

function messageHandleDetailDefinition(messageType, data1, data2) {
    var cdmObject;
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "definition_tab") ? "none" : "block";
    }
    if (messageType == "navigateEntitySelect") {
        if (data2)
            cdmObject = data2.entity;
    }
    if (messageType == "listItemSelect") {
        cdmObject = data1;
    }
    if (messageType == "applySearchTerm") {
        drawDefinitionStack();
    }

    if (cdmObject) {
        clearDefinitionPane();
        controller.cdmDocDefinition = controller.cdmDocSelected;
        pushDefinitionPane(cdmObject);
    }
}

function clearDefinitionPane() {
    controller.DefinitionStack = new Array();
}

function pushDefinitionPane(cdmObject) {
    controller.DefinitionStack.push(cdmObject)
    drawDefinitionStack();
}

function popDefinitionPane() {
    controller.DefinitionStack.pop()
    drawDefinitionStack();
}

function drawDefinitionStack() {
    if (controller.DefinitionStack && controller.DefinitionStack.length) {
        let cdmObject = controller.DefinitionStack[controller.DefinitionStack.length - 1];
        let json = cdmObject.copyData(getResolutionOptions(controller.cdmDocDefinition), { stringRefs: true });
        let jsonText = JSON.stringify(json, null, 2);
        // string refs got exploded. turn them back into strings with links
        jsonText = jsonText.replace(/{[\s]+\"corpusPath": \"([^ \"]+)\",\n[\s]+\"identifier\": \"([^\"]+)\"\n[\s]+}/gm,
            "<a href=\"javascript:detailDefinitionJump('$1')\" title=\"$1\">\"$2\"</a>");
        if (controller.DefinitionStack.length > 1)
            controller.backDefinitionButton.style.display = "inline-block";
        else
            controller.backDefinitionButton.style.display = "none";

        jsonText = applySearchTerm(jsonText);

        controller.definitionPane.innerHTML = "<pre><code>" + jsonText + "</code></pre>";
    }
}

function makeParamValue(param: IExplorerParameter, value: IExplorerArgumentValue) {
    if (!value)
        return controller.document.createTextNode("");
    // if a string constant, call get value to turn into itself or a reference if that is what is held there
    if (value.type == ExplorerArgumentValueType.string)
        return controller.document.createTextNode(value.argumentValue);

    // if this is a constant table, then expand into an html table
    if (value.type == ExplorerArgumentValueType.constantEntity) {
        var argValue = value.argumentValue as IConstantEntityArgumentValues;
        var entValues = argValue.constantValues;
        if (!entValues && entValues.length == 0)
            return controller.document.createTextNode("empty table");

        var valueTable = controller.document.createElement("table"); valueTable.className = "trait_param_value_table";
        var valueRow = controller.document.createElement("tr"); valueRow.className = "trait_param_value_table_header_row";
        var shapeAttNames = argValue.attributeNames;
        let l = shapeAttNames.length;
        for (var i = 0; i < l; i++) {
            var th = controller.document.createElement("th"); th.className = "trait_param_value_table_header_detail";
            th.appendChild(controller.document.createTextNode(shapeAttNames[i]));
            valueRow.appendChild(th);
        }
        valueTable.appendChild(valueRow);
        for (var r = 0; r < entValues.length; r++) {
            var valueRow = controller.document.createElement("tr"); valueRow.className = "trait_param_value_table_detail_row";
            valueTable.appendChild(valueRow);

            var rowData = entValues[r];
            if (rowData && rowData.length) {
                for (var c = 0; c < rowData.length; c++) {
                    var td = controller.document.createElement("td"); td.className = "trait_param_value_table_detail_detail";
                    valueRow.appendChild(td);
                    var tvalue = rowData[c];
                    if (tvalue)
                        td.appendChild(controller.document.createTextNode(tvalue));
                }
            }
        }
        var divHolder = controller.document.createElement("div"); divHolder.className = "trait_param_value_table_host"
        divHolder.appendChild(valueTable);
        return divHolder;
    }
    else {
        // stick json in there
        var code = controller.document.createElement("code");
        var json = JSON.stringify(value.copyData(getResolutionOptions(controller.cdmDocSelected)), null, 2);
        if (json.length > 67)
            json = json.slice(0, 50) + "...(see Definition tab)";
        code.appendChild(controller.document.createTextNode(json));
        return code;
    }

}


function makeParamRow(param: IExplorerParameter, value: IExplorerArgumentValue) {
    var paramRow = controller.document.createElement("tr"); paramRow.className = "trait_parameter_table_detail_row";
    var td = controller.document.createElement("td"); td.className = "trait_parameter_table_detail_name";
    td.appendChild(controller.document.createTextNode(param.name));
    paramRow.appendChild(td);
    var td = controller.document.createElement("td"); td.className = "trait_parameter_table_detail_value";
    td.appendChild(makeParamValue(param, value));
    paramRow.appendChild(td);
    var td = controller.document.createElement("td"); td.className = "trait_parameter_table_detail_type";
    if (param.dataType && param.dataType.name)
        td.appendChild(controller.document.createTextNode(param.dataType.name));
    paramRow.appendChild(td)
    var td = controller.document.createElement("td"); td.className = "trait_parameter_table_detail_explanation";
    if (param.explanation)
        td.appendChild(controller.document.createTextNode(param.explanation));
    paramRow.appendChild(td)
    return paramRow;
}

function makeTraitRow(rt: IExplorerTrait, alt) {
    var traitRow = controller.document.createElement("tr"); traitRow.className = "trait_table_row";
    var innerTable = controller.document.createElement("table"); innerTable.className = "trait_table_row_table";
    if (alt)
        innerTable.style = "background-color: var(--table-back-alternate)";
    else
        innerTable.style = "background-color: var(--back-alternate2)";

    traitRow.appendChild(innerTable);
    var innerRow = controller.document.createElement("tr"); innerRow.className = "trait_table_row_table_row";
    innerTable.appendChild(innerRow);

    var td = controller.document.createElement("td"); td.className = "trait_table_detail_name";
    td.appendChild(controller.document.createTextNode(rt.name));
    innerRow.appendChild(td);
    var td = controller.document.createElement("td"); td.className = "trait_table_detail_explanation";
    if (rt.explanation)
        td.appendChild(controller.document.createTextNode(rt.explanation));
    innerRow.appendChild(td);

    let args = rt.arguments;
    if (args && args.length) {
        var innerRow = controller.document.createElement("tr"); innerRow.className = "trait_table_row_table_row";
        innerTable.appendChild(innerRow);

        var td = controller.document.createElement("td"); td.className = "trait_parameter_table_holder";
        td.colSpan = 3;
        innerRow.appendChild(td);

        var pvTable = controller.document.createElement("table"); pvTable.className = "trait_parameter_table";
        td.appendChild(pvTable);
        var pvRow = controller.document.createElement("tr"); pvRow.className = "trait_parameter_table_header_row";
        var td = controller.document.createElement("th"); td.className = "trait_parameter_table_header_name";
        td.appendChild(controller.document.createTextNode("Parameter"));
        pvRow.appendChild(td)
        var td = controller.document.createElement("th"); td.className = "trait_parameter_table_header_value";
        td.appendChild(controller.document.createTextNode("Value"));
        pvRow.appendChild(td)
        var td = controller.document.createElement("th"); td.className = "trait_parameter_table_header_type";
        td.appendChild(controller.document.createTextNode("Data Type"));
        pvRow.appendChild(td)
        var td = controller.document.createElement("th"); td.className = "trait_parameter_table_header_explanation";
        td.appendChild(controller.document.createTextNode("Explanation"));
        pvRow.appendChild(td)
        pvTable.appendChild(pvRow);
        // each param and value
        let l = args.length;
        for (var i = 0; i < l; i++)
            pvTable.appendChild(makeParamRow(args[i].parameter, args[i].value));

    }
    return traitRow;
}

function messageHandleDetailTraits(messageType, data1, data2) {
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "trait_tab") ? "none" : "block";
        controller.labelUgly.style.display = (data1 != "trait_tab") ? "none" : "inline-block";
        return;
    }

    let cdmObject: IExplorerEntity;
    let rts: IExplorerTrait[];

    if (messageType == "navigateEntitySelect") {
        if (data2) {
            cdmObject = data2.entity;
            let resolvedEntity = cdmObject.createResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
            rts = resolvedEntity.traits;
        }
    }
    if (messageType == "listItemSelect") {
        cdmObject = data1;
        rts = data1.traits;
    }


    if (cdmObject) {
        while (this.childNodes.length > 0)
            this.removeChild(this.lastChild);

        if (rts) {
            let showUgly = controller.checkboxUgly.checked;
            var traitTable = controller.document.createElement("table"); traitTable.className = "trait_table";
            var l = rts.length;
            let r = 0;
            for (let i = 0; i < l; i++) {
                let rt = rts[i];
                // only show the ugly traits to those who think they can withstand it.
                if (showUgly || !rt.isUgly) {
                    traitTable.appendChild(makeTraitRow(rt, r % 2 != 0));
                    r++;
                }
            }

            this.appendChild(traitTable);
        }
    }

}

function messageHandleDetailProperties(messageType, data1, data2) {
    if (messageType == "detailTabSelect") {
        this.style.display = (data1 != "property_tab") ? "none" : "block";
        return;
    }

    let resolvedObject: IExplorerResolvedEntity;
    let isAtt = false;

    if (messageType == "navigateEntitySelect") {
        if (data2) {
            resolvedObject = data2.entity.createResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
        }
    }
    if (messageType == "listItemSelect") {
        resolvedObject = data1;
        isAtt = true;
    }


    if (resolvedObject) {

        while (this.childNodes.length > 0)
            this.removeChild(this.lastChild);

        let propertyTable = controller.document.createElement("table"); propertyTable.className = "property_table";
        let propertyRow = controller.document.createElement("tr"); propertyRow.className = "property_table_header"; propertyTable.appendChild(propertyRow);
        let propertyLabel = controller.document.createElement("td"); propertyLabel.className = "property_table_header_label"; propertyRow.appendChild(propertyLabel);
        let propertyValue = controller.document.createElement("td"); propertyValue.className = "property_table_header_value"; propertyRow.appendChild(propertyValue);

        propertyLabel.appendChild(controller.document.createTextNode(isAtt ? "Attribute" : "Entity"));
        propertyValue.appendChild(controller.document.createTextNode(resolvedObject.name))

        let addRow = (propName: string) => {
            let val = resolvedObject[propName];
            if (val != undefined) {
                propertyRow = controller.document.createElement("tr"); propertyRow.className = "property_table_detail"; propertyTable.appendChild(propertyRow);
                propertyLabel = controller.document.createElement("td"); propertyLabel.className = "property_table_detail_label"; propertyRow.appendChild(propertyLabel);
                propertyValue = controller.document.createElement("td"); propertyValue.className = "property_table_detail_value"; propertyRow.appendChild(propertyValue);
                propertyLabel.appendChild(controller.document.createTextNode(propName));
                if (typeof (val) == "string")
                    propertyValue.appendChild(controller.document.createTextNode(val))
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
        }

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
    else if (controller.definitionPane.style.display != "none")
        activePane = controller.definitionPane;
    else if (controller.resolvedPane.style.display != "none")
        activePane = controller.resolvedPane;

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
