"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_api_1 = require("../entity-api");
const cdm_objectmodel_1 = require("cdm.objectmodel");
const utils_1 = require("../entity-api/utils");
class Controller {
}
const statusRpt = (level, msg) => __awaiter(this, void 0, void 0, function* () {
    if (level === cdm_objectmodel_1.types.cdmStatusLevel.error || level === cdm_objectmodel_1.types.cdmStatusLevel.warning) {
        yield controller.mainContainer.messageHandlePing('statusMessage', level, msg);
    }
});
let controller = new Controller();
exports.controller = controller;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        controller.corpus = new cdm_objectmodel_1.types.CdmCorpusDefinition();
        controller.corpus.setEventCallback(statusRpt, cdm_objectmodel_1.types.cdmStatusLevel.progress);
        controller.entityContainer = new entity_api_1.EntityContainer(controller.corpus);
        // generic controls that all act the same way...
        var classSet = controller.document.getElementsByClassName('fixed_container');
        for (var i = 0; i < classSet.length; i++) {
            var classItem = classSet[i];
            classItem.messageHandlePing = messageHandlePingParent;
            classItem.messageHandle = messageHandleBroadcast;
        }
        var classSet = controller.document.getElementsByClassName('flex_container');
        for (var i = 0; i < classSet.length; i++) {
            var classItem = classSet[i];
            classItem.messageHandlePing = messageHandlePingParent;
            classItem.messageHandle = messageHandleBroadcast;
        }
        var classSet = controller.document.getElementsByClassName('parent_container');
        for (var i = 0; i < classSet.length; i++) {
            var classItem = classSet[i];
            classItem.messageHandlePing = messageHandlePingParent;
            classItem.messageHandle = messageHandleParentContainerBroadcast;
            classItem.messageHandleBroadcast = messageHandleBroadcast;
        }
        var classSet = controller.document.getElementsByClassName('detail_container');
        for (var i = 0; i < classSet.length; i++) {
            var classItem = classSet[i];
            classItem.messageHandlePing = messageHandlePingParent;
            classItem.messageHandle = messageHandleBroadcast;
        }
        var classSet = controller.document.getElementsByClassName('tab');
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
        controller.resolvedPane.messageHandle = messageHandleDetailResolved;
        controller.partitionsPane.messageHandlePing = messageHandlePingParent;
        controller.partitionsPane.messageHandle = messageHandleDetailPartitions;
        controller.paneListTitle.messageHandle = messageHandleListTitle;
        controller.paneDirectivesHost.messageHandle = undefined;
        controller.paneWait.messageHandlePing = null;
        controller.paneWait.messageHandle = messageHandleWaitBox;
        controller.paneManifestSelect.messageHandlePing = null;
        controller.paneManifestSelect.messageHandle = messageHandleManifestSelect;
        controller.DefinitionStack = new Array();
        controller.ResolvedStack = new Array();
        controller.entity2state = new Map();
    });
}
exports.init = init;
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
// loadEntitySuccess
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
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType == 'statusMessage') {
            yield controller.mainContainer.messageHandle(messageType, data1, data2);
            return;
        }
        if (controller.appState === 'navigateMode') {
            if (messageType === 'githubLoadRequest' || messageType === 'filesLoadRequest') {
                controller.pendingLoads = new Set();
                controller.loadFails = 0;
                yield init();
                yield controller.mainContainer.messageHandle('detailTabSelect', 'status_tab', null);
                if (messageType === 'githubLoadRequest') {
                    controller.corpus.storage.mount('cdm', new cdm_objectmodel_1.types.GithubAdapter());
                    controller.corpus.storage.defaultNamespace = 'cdm';
                    // skip selecting a manifest, we use root manifest for Github
                    yield controller.mainContainer.messageHandle('loadingFiles');
                    yield controller.mainContainer.messageHandlePing('loadManifest', '/standards.manifest.cdm.json', null);
                    yield controller.mainContainer.messageHandle('loadingFilesFinish');
                }
                else if (messageType === 'filesLoadRequest') {
                    const fileMap = getFilesFromBrowserDialog(data1);
                    yield controller.mainContainer.messageHandle('loadingFiles');
                    controller.corpus.storage.mount('local', new cdm_objectmodel_1.types.LocalBrowserAdapter({ fileMap: fileMap }));
                    controller.corpus.storage.mount('cdm', new cdm_objectmodel_1.types.GithubAdapter);
                    controller.corpus.storage.defaultNamespace = 'local';
                    const manifestFilePaths = new Set();
                    for (const filePath of fileMap.keys()) {
                        if (filePath.endsWith('.manifest.cdm.json') || filePath.endsWith('/model.json')) {
                            manifestFilePaths.add(filePath);
                        }
                    }
                    yield controller.mainContainer.messageHandle('loadingFilesFinish');
                    if (manifestFilePaths.size > 0) {
                        yield controller.mainContainer.messageHandle('creatingManifestWindow', manifestFilePaths);
                    }
                    else if (fileMap.size > 0) {
                        alert("No manifest or model.json files found. Please load a folder that contains at least one of these files.");
                    }
                }
            }
            else if (messageType === 'loadManifest' && data1) {
                controller.appState = 'loadMode';
                const entityInfoMap = new Map();
                try {
                    yield controller.mainContainer.messageHandle('loadingFiles');
                    yield controller.entityContainer.loadRootManifest(data1);
                    const entityFilePaths = controller.entityContainer.getAllEntityFilePaths();
                    for (const path of entityFilePaths) {
                        const filePath = path.slice(0, path.lastIndexOf('/'));
                        entityInfoMap.set(path, {
                            name: path.slice(path.lastIndexOf('/') + 1),
                            path: path,
                            file: {
                                name: filePath.slice(filePath.lastIndexOf('/') + 1),
                                path: filePath
                            }
                        });
                    }
                    yield controller.mainContainer.messageHandle('loadingFilesFinish');
                    controller.path2State = new Map();
                    controller.navData = entity_api_1.EntityFileLoader.GenerateNavigatorData(controller.path2State, entityInfoMap, controller.entityContainer);
                    clearLoadState(controller.navData.root);
                    // build a hierarchy from the built in data
                    controller.hier = controller.navData.root;
                    while (controller.navHost.lastChild)
                        controller.navHost.removeChild(controller.navHost.lastChild);
                    buildIndexes();
                    controller.navHost.appendChild(buildNavigation(controller.navData.root, false));
                }
                catch (e) {
                    // if there was any error when loading, give the option to try loading something else
                    controller.appState = 'navigateMode';
                    // remove loading wait window
                    messageHandleWaitBox('loadingFilesFinish', undefined, undefined);
                }
                yield controller.mainContainer.messageHandlePing('loadModeResult', messageType, null);
            }
            else if (messageType === 'navigateRelatedSelect' || messageType == 'navigateEntitySelect') {
                // if control held then add else replace
                if (!data2 || !controller.multiSelectEntityList)
                    controller.multiSelectEntityList = new Set();
                // load and resolve the selected entity if it hasn't been already
                const entState = controller.idLookup.get(data1.id);
                if (!entState || !entState.entity) {
                    yield loadEntity(entState);
                }
                // it can still be empty if the entity is currently being loaded, hold off doing anything
                if (entState && entState.entity) {
                    if (messageType == 'navigateEntitySelect') {
                        // single click on an entity or folder. add or remove single or all in folder
                        // request the selected things to report back, this will update the map
                        yield controller.mainContainer.messageHandle('reportSelection', data1, null);
                        yield controller.mainContainer.messageHandle('detailTabSelect', 'property_tab');
                    }
                    else {
                        // double click on an entity. go find all related and related related entities.
                        // loop over every entity and find ones that are currently NOT in the select list but are being pointed at by ones in the list.
                        // these get added to the list and we keep going
                        let entDataSelect = entityFromId(data1.id);
                        controller.multiSelectEntityList.add(entDataSelect);
                        if (entDataSelect.relsOut) {
                            for (const rel of entDataSelect.relsOut) {
                                const entStateRef = controller.entity2state.get(yield controller.entityContainer.getEntityByPath(rel.toEntity));
                                if (entStateRef && !controller.multiSelectEntityList.has(entStateRef)) {
                                    controller.multiSelectEntityList.add(entStateRef);
                                }
                            }
                        }
                    }
                    // there could be multiple versions of the same entity in this set,
                    // remove anything 'earlier' in the inheritence tree
                    var toRemove = new Array();
                    controller.multiSelectEntityList.forEach(e => {
                        var entity = e.entity;
                        while (entity) {
                            let base = entity.getBaseEntity(getResolutionOptions(entity.declaredIn));
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
                    yield repaint();
                }
            }
            else if (messageType === 'navigateManifestSelect') {
                if (!controller.multiSelectEntityList) {
                    controller.multiSelectEntityList = new Set();
                }
                else {
                    controller.multiSelectEntityList.clear();
                }
                // clicked on a manifest. add entities from manifest to multi select
                if (data1.entities) {
                    for (const ent of data1.entities) {
                        controller.multiSelectEntityList.add(ent);
                    }
                }
                // setup tabs for manifest
                yield controller.mainContainer.messageHandle(messageType, data1, data2);
                // repaint entities that are related to manifest
                yield repaint();
            }
            else if (messageType === 'reportSelection') {
                // add or remove
                if (controller.multiSelectEntityList.has(data1))
                    controller.multiSelectEntityList.delete(data1);
                else
                    controller.multiSelectEntityList.add(data1);
            }
            else if (messageType === 'search') {
                controller.searchTerm = data1;
                yield controller.mainContainer.messageHandle('applySearchTerm', controller.searchTerm);
            }
            else if (messageType === 'searchClear') {
                if (controller.searchTerm) {
                    controller.searchTerm = undefined;
                    yield controller.mainContainer.messageHandle('applySearchTerm', controller.searchTerm);
                }
            }
            else if (messageType === 'directiveAlter') {
                if (controller.multiSelectEntityList && controller.multiSelectEntityList.size) {
                    let singleSelected = controller.multiSelectEntityList.size == 1 ? controller.multiSelectEntityList.values().next().value : undefined;
                    yield controller.mainContainer.messageHandle('navigateEntitySelect', controller.multiSelectEntityList, singleSelected);
                }
            }
            else if (messageType === 'additionalValidationRequest') {
                controller.entityContainer.generateWarnings();
            }
            else if (messageType === 'computeRelationships') {
                // creating a resolved manifest will genereate relationships
                yield controller.mainContainer.messageHandle('computeRelationshipsStarting', controller.multiSelectEntityList);
                // generate the relationships 
                yield controller.entityContainer.calculateRelationships();
                // create entity state objects for each entity
                for (const entries of controller.idLookup.entries()) {
                    const id = entries[0];
                    const entState = entries[1];
                    if (entState.docName) {
                        yield populateEntityState(controller, entState.entPath, id);
                        entity_api_1.EntityFileLoader.addRelationshipsToState(entState, controller.entityContainer);
                    }
                }
                // after all relationships are calculated
                yield controller.mainContainer.messageHandle('computeRelationshipsFinish', controller.multiSelectEntityList);
                yield repaint();
            }
            else {
                yield controller.mainContainer.messageHandle(messageType, data1, data2);
            }
        }
        else if (controller.appState === 'loadMode') {
            if (messageType === 'loadModeResult') {
                if (controller.pendingLoads.size == 0) {
                    controller.appState = 'navigateMode';
                    if (controller.loadFails == 0) {
                        yield controller.mainContainer.messageHandle('loadResolveFinish', null, null);
                    }
                    else {
                        yield controller.mainContainer.messageHandle('statusMessage', entity_api_1.LoggingLevel.error, 'There was some trouble encountered during document load or resolution. Details should appear earlier in this log.');
                        yield controller.mainContainer.messageHandle('loadResolveFinish', null, null);
                    }
                }
            }
        }
    });
}
function loadEntity(entState) {
    return __awaiter(this, void 0, void 0, function* () {
        if (entState.loadState === entity_api_1.LoadState.notLoaded) {
            entState.loadState = entity_api_1.LoadState.loading;
            yield controller.mainContainer.messageHandle('resolvingEntity');
            yield populateEntityState(controller, entState.entPath, entState.id);
            yield controller.mainContainer.messageHandle('resolvingEntityFinish');
            entState.loadState = entity_api_1.LoadState.done;
        }
    });
}
function getFilesFromBrowserDialog(fileList) {
    // construct a nav hierarchy from the set of file paths selected by the user
    const fileMap = new Map();
    for (let iFile = 0; iFile < fileList.length; iFile++) {
        let file = fileList[iFile];
        // fileInfo.push(<IDOMFile>{
        let path = (file.webkitRelativePath && file.webkitRelativePath.length) ? file.webkitRelativePath : '';
        // root should be inside top level
        const i = path.indexOf('/');
        if (i > -1) {
            path = path.slice(i);
        }
        fileMap.set(path, {
            name: file.name,
            path: path,
            file: file
        });
    }
    return fileMap;
}
function buildNavigation(hier, alternate) {
    let pc = controller.document.createElement('span');
    pc.className = 'parent_container';
    pc.style.background = alternate ? 'var(--back-alternate1)' : 'var(--back-alternate2)';
    pc.messageHandlePing = messageHandlePingParentContainer;
    pc.messageHandle = messageHandleParentContainerBroadcast;
    pc.messageHandleBroadcast = messageHandleBroadcast;
    pc.folderState = hier;
    var titleBar = controller.document.createElement('span');
    pc.appendChild(titleBar);
    titleBar.className = 'group_title_bar';
    titleBar.messageHandlePing = messageHandlePingParent;
    var title = controller.document.createElement('span');
    titleBar.appendChild(title);
    title.className = 'group_title';
    title.id = hier.id;
    title.folderState = hier;
    title.appendChild(controller.document.createTextNode(hier.name));
    title.manifest = hier;
    title.onclick = controller.onclickManifestItem;
    var resizeUp = controller.document.createElement('span');
    titleBar.appendChild(resizeUp);
    resizeUp.className = 'group_title_size';
    resizeUp.appendChild(controller.document.createTextNode('+'));
    resizeUp.onclick = controller.onclickResizeUp;
    resizeUp.messageHandlePing = messageHandlePingParent;
    var resizeDown = controller.document.createElement('span');
    titleBar.appendChild(resizeDown);
    resizeDown.className = 'group_title_size';
    resizeDown.appendChild(controller.document.createTextNode('-'));
    resizeDown.onclick = controller.onclickResizeDown;
    resizeDown.messageHandlePing = messageHandlePingParent;
    if (hier.entities) {
        var detailCont = controller.document.createElement('span');
        detailCont.className = 'detail_container';
        detailCont.messageHandlePing = messageHandlePingParent;
        detailCont.messageHandle = messageHandleBroadcast;
        pc.appendChild(detailCont);
        hier.entities.forEach(e => {
            if (e.createUX) {
                var entItem = controller.document.createElement('span');
                entItem.style.background = 'var(--item-back-normal)';
                entItem.className = 'detail_item';
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
    if (hier.subManifests) {
        var subCont = controller.document.createElement('span');
        subCont.className = 'sub_container';
        subCont.messageHandlePing = messageHandlePingParent;
        subCont.messageHandle = messageHandleBroadcast;
        pc.appendChild(subCont);
        hier.subManifests.forEach(f => {
            subCont.appendChild(buildNavigation(f, !alternate));
        });
    }
    return pc;
}
function clearLoadState(hier) {
    if (hier.entities)
        hier.entities.forEach(e => { e.loadState = entity_api_1.LoadState.notLoaded; });
    if (hier.subManifests) {
        hier.subManifests.forEach(f => { clearLoadState(f); });
    }
}
function collectEnts(hier, idLookup, path2id) {
    idLookup.set(hier.id, hier);
    if (hier.entities) {
        hier.entities.forEach(e => {
            idLookup.set(e.id, e);
            path2id.set(e.entPath, e.id);
        });
    }
    ;
    if (hier.subManifests) {
        hier.subManifests.forEach(f => {
            collectEnts(f, idLookup, path2id);
        });
    }
}
function buildIndexes() {
    controller.idLookup = new Map();
    controller.path2id = new Map();
    collectEnts(controller.hier, controller.idLookup, controller.path2id);
}
function entityFromId(entId) {
    return controller.idLookup.get(entId);
}
function populateEntityState(controller, entPath, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return _populateEntityState(controller, entPath, id, new Set());
    });
}
function _populateEntityState(controller, entPath, id, visited) {
    return __awaiter(this, void 0, void 0, function* () {
        const entitiesToMap = [];
        controller.corpus.setEventCallback((level, message) => __awaiter(this, void 0, void 0, function* () {
            if (level === cdm_objectmodel_1.types.cdmStatusLevel.info) {
                let messageText;
                const messageArr = message.split('|');
                if (messageArr.length > 1) {
                    messageText = messageArr[1].trim();
                    if (messageText.startsWith('indexed: ')) {
                        const nsPath = controller.corpus.storage.createAbsoluteCorpusPath(messageText.replace('indexed: ', ''));
                        if (controller.entityContainer.getAllEntityFilePaths().has(nsPath)) {
                            entitiesToMap.push(nsPath);
                        }
                    }
                    else if (messageText.startsWith('read file: ')) {
                        yield controller.mainContainer.messageHandle('loadEntity', messageText.replace('read file: ', ''));
                    }
                }
            }
            else {
                statusRpt(level, message);
            }
        }), cdm_objectmodel_1.types.cdmStatusLevel.info);
        const entityExplorer = yield controller.entityContainer.getOrCreateExplorerEntity(entPath);
        controller.corpus.setEventCallback(statusRpt, cdm_objectmodel_1.types.cdmStatusLevel.progress);
        // now map the entities that were created when mapping this entity
        yield Promise.all(entitiesToMap.map((path) => __awaiter(this, void 0, void 0, function* () {
            if (controller.path2id.has(path) && !visited.has(path)) {
                visited.add(path);
                yield populateEntityState(controller, path, controller.path2id.get(path));
            }
        })));
        if (entityExplorer) {
            const currEntState = controller.idLookup.get(id);
            currEntState.entity = entityExplorer;
            currEntState.loadState = entity_api_1.LoadState.done;
            controller.entity2state.set(currEntState.entity, currEntState);
            return currEntState;
        }
        return null;
    });
}
function messageHandlePingParent(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.parentElement.messageHandlePing(messageType, data1, data2);
    });
}
function messageHandleBroadcast(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.children) {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].messageHandle)
                    yield this.children[i].messageHandle(messageType, data1, data2);
            }
        }
    });
}
function resizeParentContainer(pc, direction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (direction == 'down') {
            if (!pc.small || pc.small != true) {
                pc.small = true;
                yield pc.messageHandleBroadcast('resize', direction, null);
            }
        }
        else if (direction == 'up') {
            if (pc.small && pc.small == true) {
                pc.small = false;
                yield pc.messageHandleBroadcast('resize', direction, null);
            }
        }
    });
}
function messageHandlePingParentContainer(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType == 'resize') {
            yield resizeParentContainer(this, data1);
        }
        else {
            yield this.parentElement.messageHandlePing(messageType, data1, data2);
        }
    });
}
function messageHandleParentContainerBroadcast(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType === 'resize') {
            yield resizeParentContainer(this, data1);
            return;
        }
        else if (messageType === 'reportSelection') {
            // report for us or for null (folder above us)
            if (this.folderState === data1 || !data1) {
                data1 = null;
            }
        }
        yield this.messageHandleBroadcast(messageType, data1, data2);
    });
}
function isAttribute(obj) {
    return obj && 'isAttributeGroup' in obj;
}
function isEntity(obj) {
    return obj && obj.entity;
}
function getResolutionOptions(doc) {
    let directives = 0;
    if (controller.checkboxDirectiveRelational.checked)
        directives |= entity_api_1.DirectiveSet.ReferenceOnly;
    if (controller.checkboxDirectiveNormalized.checked)
        directives |= entity_api_1.DirectiveSet.Normalized;
    if (controller.checkboxDirectiveStructured.checked)
        directives |= entity_api_1.DirectiveSet.Structured;
    const resOpt = { wrtDoc: doc, directives: directives };
    return resOpt;
}
function selectBackground(flag1, flag3, color1, color2, color3) {
    if (flag1 && flag3)
        return 'linear-gradient(to right, ' + color1 + ', ' + color2 + ', ' + color3 + ')';
    if (flag1)
        return 'linear-gradient(to right, ' + color1 + ', ' + color2 + ', ' + color2 + ')';
    if (flag3)
        return 'linear-gradient(to right, ' + color2 + ', ' + color2 + ', ' + color3 + ')';
    return color2;
}
function messageHandleItem(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType == 'loadEntity' && data1.id == this.id) {
            var background;
            if (data1.loadState == entity_api_1.LoadState.loading)
                background = 'var(--item-back-loading)';
            else if (data1.loadState == entity_api_1.LoadState.done)
                background = 'var(--item-back-normal)';
            else if (data1.loadState == entity_api_1.LoadState.failed)
                background = 'var(--item-back-failed)';
            if (background)
                this.style.background = selectBackground(false, false, 'var(--item-back-referenced)', background, 'var(--item-back-referencing)');
            return;
        }
        else if (messageType == 'resize') {
            if (data1 == 'down')
                this.style.fontSize = 'var(--text-size-small)';
            else if (data1 == 'up')
                this.style.fontSize = 'var(--text-size-med)';
            return;
        }
        var entityStateThis = entityFromId(this.id);
        let searchFound = true;
        if (messageType === 'reportSelection') {
            // report for us or for null (folder above us)
            if (entityStateThis === data1 || !data1) {
                yield controller.mainContainer.messageHandlePing('reportSelection', entityStateThis);
            }
        }
        else if (messageType === 'navigateEntitySelect' || messageType == 'listItemSelect') {
            // handle the attribute select first
            if (messageType == 'listItemSelect' && isAttribute(data1)) {
                let cdmAttribute = data1;
                background = 'var(--item-back-normal)';
                // does the attribute point at this? yes if 
                const isReferencing = entityStateThis.relsIn != undefined && entityStateThis.relsIn.some((rel) => {
                    return rel.fromEntity === controller.corpus.storage.createAbsoluteCorpusPath(cdmAttribute.fromEntity.path)
                        && rel.fromEntityAttribute === cdmAttribute.name;
                });
                // does the attribute get pointed at by this?
                const isReferenced = entityStateThis.relsOut != undefined && entityStateThis.relsOut.some((rel) => {
                    return rel.toEntity === controller.corpus.storage.createAbsoluteCorpusPath(cdmAttribute.fromEntity.path)
                        && rel.toEntityAttribute === cdmAttribute.name;
                });
                this.style.background = selectBackground(isReferencing, isReferenced, 'var(--item-back-referenced)', background, 'var(--item-back-referencing)');
            }
            else {
                let entityStateSelected;
                if (messageType === 'navigateEntitySelect') {
                    let set = data1;
                    // selection is shown with a fat border
                    if (set.has(this.entityState)) {
                        this.style.borderWidth = 'var(--item-border-selected)';
                        this.style.margin = 'var(--item-margin-selected)';
                    }
                    else {
                        this.style.borderWidth = 'var(--item-border-normal)';
                        this.style.margin = 'var(--item-margin-normal)';
                    }
                    if (data2) // set by navigate for single entity
                        entityStateSelected = data2;
                }
                else {
                    // must be list select from multi entity 
                    entityStateSelected = data1;
                }
                controller.cdmDocSelected = undefined;
                if (entityStateSelected) { // will be null when list is sent, ok this keeps showing the last highlights which helps id relationships
                    // base and extensions are shown with background
                    // get info about any baseclass of this entity
                    if (!entityStateSelected.entity) {
                        yield loadEntity(entityStateSelected);
                    }
                    controller.cdmDocSelected = entityStateSelected.entity ? entityStateSelected.entity.declaredIn : undefined;
                    background = 'var(--item-back-normal)';
                    if (entityStateThis.entity && controller.cdmDocSelected) {
                        let baseThis = entityStateThis.entity.getBaseEntity(getResolutionOptions(controller.cdmDocSelected));
                        // selected base
                        let baseSelect = entityStateSelected.entity.getBaseEntity(getResolutionOptions(controller.cdmDocSelected));
                        if (entityStateThis.entity === baseSelect)
                            background = 'var(--item-back-base)';
                        if (baseThis === entityStateSelected.entity)
                            background = 'var(--item-back-extension)';
                    }
                    // does this entity point at the selection
                    const isReferencing = entityStateThis.relsOut != undefined && entityStateThis.relsOut.some((rel) => {
                        return rel.fromEntity === entityStateThis.entPath && rel.toEntity === entityStateSelected.entPath;
                    });
                    // does the selection point at this
                    const isReferenced = entityStateThis.relsIn != undefined && entityStateThis.relsIn.some((rel) => {
                        return rel.toEntity === entityStateThis.entPath && rel.fromEntity === entityStateSelected.entPath;
                    });
                    this.style.background = selectBackground(isReferenced, isReferencing, 'var(--item-back-referenced)', background, 'var(--item-back-referencing)');
                }
            }
        }
        else if (messageType === 'navigateManifestSelect') {
            // reset all selections and relationships for manifests
            this.style.borderWidth = 'var(--item-border-normal)';
            this.style.margin = 'var(--item-margin-normal)';
            this.style.background = selectBackground(false, false, 'var(--item-back-referenced)', 'var(--item-back-normal)', 'var(--item-back-referencing)');
        }
        if (messageType === 'applySearchTerm') {
            let searchTerm = data1;
            if (searchTerm) {
                searchFound = entityStateThis.name.toUpperCase().includes(searchTerm.toUpperCase());
            }
            this.style.filter = searchFound ? '' : 'brightness(0.7)';
        }
    });
}
function messageHandleListTitle(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType === 'navigateEntitySelect') {
            if (data2)
                this.getElementsByClassName('group_title')[0].innerHTML = 'Attributes for Selected';
            else
                this.getElementsByClassName('group_title')[0].innerHTML = 'Selected Entities';
        }
    });
}
function messageHandleList(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType === 'navigateEntitySelect') {
            // clear old att list and fill a new one
            while (this.lastChild)
                this.removeChild(this.lastChild);
            let set = data1;
            if (!data2) {
                set.forEach(e => {
                    var aSpan = controller.document.createElement('span');
                    aSpan.className = 'list_item';
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
                    const atts = yield entity.getAttributes(getResolutionOptions(entity.declaredIn));
                    if (atts) {
                        const addAtts = (rasSub, depth) => {
                            let l = rasSub.length;
                            for (var i = 0; i < l; i++) {
                                var att = rasSub[i];
                                if (att.isAttributeGroup) {
                                    addAtts(att.attributes, depth + 1);
                                }
                                else {
                                    // that's right, old school graphics, just like 1987
                                    let indent = '';
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
                                    var aSpan = controller.document.createElement('span');
                                    aSpan.className = 'list_item';
                                    aSpan.textContent = indent + att.name;
                                    aSpan.cdmObject = att;
                                    aSpan.cdmSource = entity;
                                    aSpan.onclick = controller.onclickListItem;
                                    aSpan.messageHandle = messageHandleListItem;
                                    aSpan.inherited = att.isInherited;
                                    this.appendChild(aSpan);
                                }
                            }
                        };
                        addAtts(atts, 0);
                    }
                }
            }
        }
        yield this.messageHandleBroadcast(messageType, data1, data2);
    });
}
function messageHandleListItem(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType === 'applySearchTerm') {
            let searchFound = true;
            let searchTerm = data1;
            if (searchTerm) {
                let searchAgainst;
                if (this.cdmObject) {
                    if (this.cdmObject.resolvedName)
                        searchAgainst = this.cdmObject.resolvedName;
                    else if (this.cdmObject.getName)
                        searchAgainst = this.cdmObject.getName();
                    if (searchAgainst)
                        searchFound = searchAgainst.toUpperCase().includes(searchTerm.toUpperCase());
                }
            }
            this.style.filter = searchFound ? '' : 'brightness(0.7)';
        }
        else if (messageType === 'navigateEntitySelect') {
            if (data2) {
                const entityState = data2;
                let background = 'var(--item-back-normal)';
                if (this.inherited)
                    background = 'var(--item-back-base)';
                const attributeEntState = controller.entity2state.get(this.cdmObject.fromEntity);
                // does this attribute point out?
                const isReferencing = entityState.relsOut != undefined
                    && attributeEntState != undefined
                    && entityState.relsOut.some((rel) => {
                        return rel.fromEntity === attributeEntState.entPath
                            && rel.fromEntityAttribute === this.cdmObject.name;
                    });
                // does the attribute get pointed at?
                const isReferenced = entityState.relsIn != undefined
                    && attributeEntState != undefined
                    && entityState.relsIn.some((rel) => {
                        return rel.toEntity === attributeEntState.entPath
                            && rel.toEntityAttribute === this.cdmObject.name;
                    });
                this.style.background = selectBackground(isReferenced, isReferencing, 'var(--item-back-referencing)', background, 'var(--item-back-referenced)');
            }
        }
        else if (messageType === 'listItemSelect') {
            if (this.cdmObject === data1) {
                this.style.borderWidth = 'var(--item-border-selected)';
                this.style.padding = 'var(--list-item-padding-selected)';
            }
            else {
                this.style.borderWidth = 'var(--item-border-normal)';
                this.style.padding = 'var(--list-item-padding-normal)';
            }
        }
    });
}
function messageHandleDetailTab(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType == 'detailTabSelect') {
            var background;
            if (data1 == this.id)
                background = 'var(--back-alternate2)';
            else
                background = 'var(--back-alternate1)';
            this.style.background = background;
        }
    });
}
function messageHandleDetailStatus(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        var addLine = function (to, line, errorInfo, warningInfo) {
            if (to.innerHTML && to.innerHTML.length > 256000)
                to.innerHTML = '';
            if (errorInfo || warningInfo) {
                to = to.appendChild(controller.document.createElement('span'));
                if (errorInfo) {
                    to.className = 'status-text-error';
                    if (typeof (errorInfo) != 'boolean') {
                        to.appendChild(controller.document.createTextNode(errorInfo));
                        to.appendChild(controller.document.createElement('br'));
                    }
                }
                else {
                    to.className = 'status-text-warning';
                }
            }
            to.appendChild(controller.document.createTextNode(line));
            to.appendChild(controller.document.createElement('br'));
            if (to.className === 'status_pane' && to.style.display != 'none') {
                controller.paneDetailHost.scrollTop = controller.paneDetailHost.scrollHeight;
            }
        };
        if (messageType == 'statusMessage') {
            addLine(this, data2, data1 === entity_api_1.LoggingLevel.error, data1 === entity_api_1.LoggingLevel.warning);
        }
        else if (messageType == 'loadEntity') {
            addLine(this, data1, data2, null);
        }
        else if (messageType == 'detailTabSelect') {
            this.style.display = (data1 != 'status_tab') ? 'none' : 'block';
        }
    });
}
function messageHandleDetailPartitions(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        let cdmObject;
        if (messageType === 'detailTabSelect') {
            this.style.display = (data1 != 'partitions_tab') ? 'none' : 'block';
        }
        else if (messageType === 'navigateEntitySelect') {
            if (data2) {
                cdmObject = data2.entity;
            }
        }
        else if (messageType == 'listItemSelect') {
            cdmObject = data1;
        }
        controller.partitionsPane.innerHTML = '';
        if (cdmObject) {
            if (cdmObject.partitions) {
                for (const partition of cdmObject.partitions) {
                    this.appendChild(controller.document.createTextNode(partition.location));
                    this.appendChild(controller.document.createElement('br'));
                }
            }
        }
    });
}
function applySearchTerm(html) {
    if (!controller.searchTerm)
        return html;
    let localTerm = controller.searchTerm.replace(/([^a-zA-Z0-9.])/g, '');
    if (localTerm.length > 0) {
        // only apply term to text not inside html
        // regex not supporting lookbehinds means do this the hard way
        const getNextSegment = (startAt) => {
            let end = html.indexOf('<', startAt);
            if (end == -1)
                return [startAt, html.length];
            if (end > startAt)
                return [startAt, end];
            // must start with a tag, so find end. assume there are no embedded tag ending inside this tag
            let newStartAt = html.indexOf('>', startAt);
            if (newStartAt == -1)
                return [html.length, html.length];
            end = html.indexOf('<', newStartAt);
            if (end == -1)
                return [newStartAt, html.length];
            if (end > startAt)
                return [newStartAt, end];
        };
        let search = new RegExp(`(${localTerm})`, 'g');
        let newHtml = '';
        let lastStart = 0;
        let sourceLen = html.length;
        do {
            let seg = getNextSegment(lastStart);
            let segStart = seg['0'];
            let segEnd = seg['1'];
            // add any html tag that got skipped
            if (segStart > lastStart)
                newHtml += html.slice(lastStart, segStart);
            // replace in the segment
            let segmentNew = html.slice(segStart, segEnd).replace(search, '<mark>$1</mark>');
            newHtml += segmentNew;
            lastStart = segEnd;
        } while (lastStart < sourceLen);
        html = newHtml;
    }
    return html;
}
function messageHandleDetailResolved(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        let cdmObject;
        if (messageType == 'detailTabSelect') {
            this.style.display = (data1 != 'resolved_tab') ? 'none' : 'block';
        }
        else if (messageType == 'navigateEntitySelect') {
            if (data2) {
                cdmObject = data2.entity;
            }
        }
        else if (messageType == 'listItemSelect') {
            if (isEntity(data1)) {
                cdmObject = data1.entity;
            }
        }
        else if (messageType == 'applySearchTerm') {
            drawResolvedStack();
        }
        if (cdmObject) {
            clearResolvedPane();
            const resolvedObject = yield cdmObject.getResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
            controller.cdmDocResolved = {
                name: resolvedObject.resolvedEntity.docCreatedIn.name,
                document: resolvedObject.resolvedEntity.docCreatedIn
            };
            pushResolvedPane({
                object: resolvedObject.resolvedEntity,
                scrollTop: 0,
                scrollLeft: 0
            });
        }
    });
}
function pushResolvedPane(tuple) {
    // save scroll position of current pane
    if (controller.ResolvedStack.length > 0) {
        const currentPane = controller.ResolvedStack[controller.ResolvedStack.length - 1];
        currentPane.scrollTop = controller.paneDetailHost.scrollTop;
        currentPane.scrollLeft = controller.paneDetailHost.scrollLeft;
    }
    controller.ResolvedStack.push(tuple);
    drawResolvedStack();
}
function popResolvedPane() {
    controller.ResolvedStack.pop();
    drawResolvedStack();
}
exports.popResolvedPane = popResolvedPane;
function detailResolvedJump(path) {
    return __awaiter(this, void 0, void 0, function* () {
        var cdmObject = yield controller.corpus.fetchObjectAsync(path);
        var detailObject = cdmObject;
        if (detailObject) {
            pushResolvedPane({
                object: detailObject,
                scrollTop: 0,
                scrollLeft: 0
            });
        }
    });
}
exports.detailResolvedJump = detailResolvedJump;
function createTextDivs(jsonText) {
    const jsonLines = jsonText.split('\n');
    // will split text into divs where each div contains at most this many lines
    const linesPerDiv = 200;
    return `${jsonLines.map((x, i) => {
        if (i % linesPerDiv === 0) {
            return `<pre class="code_div">${x}`;
        }
        else if (i % linesPerDiv === linesPerDiv - 1 || i === jsonLines.length - 1) {
            return `\n${x}</pre>`;
        }
        else {
            return `\n${x}`;
        }
    }).join('')}`;
}
function drawResolvedStack() {
    if (controller.ResolvedStack && controller.ResolvedStack.length) {
        const tuple = controller.ResolvedStack[controller.ResolvedStack.length - 1];
        const resOpt = utils_1.EntityApiUtils.convertOptions(getResolutionOptions(controller.cdmDocResolved));
        let json = tuple.object.copyData(resOpt, { stringRefs: true, removeSingleRowLocalizedTableTraits: true });
        let jsonText = JSON.stringify(json, null, 2);
        // string refs got exploded. turn them back into strings with links
        jsonText = jsonText.replace(/{[\s]+\"corpusPath\": \"([^ \"]+)\",\n[\s]+\"identifier\": \"([^\"]+)\"\n[\s]+}/gm, '<a id="link_text" onClick="detailResolvedJump(\'$1\')" title="$1">"$2"</a>');
        if (controller.ResolvedStack.length > 1)
            controller.backResolvedButton.style.display = 'inline-block';
        else
            controller.backResolvedButton.style.display = 'none';
        jsonText = applySearchTerm(jsonText);
        controller.resolvedPane.innerHTML = createTextDivs(jsonText);
        controller.paneDetailHost.scrollTop = tuple.scrollTop;
        controller.paneDetailHost.scrollLeft = tuple.scrollLeft;
    }
}
function messageHandleDetailDefinition(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        var cdmObject;
        if (messageType == 'detailTabSelect') {
            this.style.display = (data1 != 'definition_tab') ? 'none' : 'block';
        }
        else if (messageType == 'navigateEntitySelect') {
            if (data2 && data2.entity) {
                cdmObject = data2.entity.entity;
            }
        }
        else if (messageType == 'listItemSelect') {
            if (isAttribute(data1)) {
                cdmObject = data1.attribute;
            }
            else if (isEntity(data1)) {
                cdmObject = data1.entity.entity;
            }
        }
        else if (messageType === 'navigateManifestSelect') {
            if (data1 && data1.manifest) {
                cdmObject = data1.manifest.cdmManifest;
                controller.manifestClicked = data1.manifest;
                controller.cdmDocSelected = { name: data1.manifest.name, document: cdmObject };
                yield controller.mainContainer.messageHandle('detailTabSelect', 'definition_tab');
                // clear other panes
                clearPropertiesPane();
                clearTraitsPane();
                clearResolvedPane();
                clearPartitionsPane();
            }
        }
        else if (messageType == 'applySearchTerm') {
            drawDefinitionStack();
        }
        if (cdmObject) {
            clearDefinitionPane();
            controller.cdmDocDefinition = controller.cdmDocSelected;
            pushDefinitionPane({
                object: cdmObject,
                scrollTop: 0,
                scrollLeft: 0
            });
        }
    });
}
function pushDefinitionPane(tuple) {
    // save scroll position of current pane
    if (controller.DefinitionStack.length > 0) {
        const currentPane = controller.DefinitionStack[controller.DefinitionStack.length - 1];
        currentPane.scrollTop = controller.paneDetailHost.scrollTop;
        currentPane.scrollLeft = controller.paneDetailHost.scrollLeft;
    }
    controller.DefinitionStack.push(tuple);
    drawDefinitionStack();
}
function popDefinitionPane() {
    controller.DefinitionStack.pop();
    drawDefinitionStack();
}
exports.popDefinitionPane = popDefinitionPane;
function detailDefinitionJump(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const manifest = controller.manifestClicked ? controller.manifestClicked.cdmManifest : undefined;
        var cdmObject = yield controller.corpus.fetchObjectAsync(path, manifest);
        var detailObject = cdmObject;
        pushDefinitionPane({
            object: detailObject,
            scrollTop: 0,
            scrollLeft: 0
        });
    });
}
exports.detailDefinitionJump = detailDefinitionJump;
function entityJump(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const absPath = controller.corpus.storage.createAbsoluteCorpusPath(path, controller.manifestClicked.cdmManifest);
        const entityState = controller.path2State.get(absPath);
        if (entityState) {
            controller.mainContainer.messageHandlePing("navigateEntitySelect", entityState);
        }
    });
}
exports.entityJump = entityJump;
function drawDefinitionStack() {
    if (controller.DefinitionStack && controller.DefinitionStack.length) {
        const tuple = controller.DefinitionStack[controller.DefinitionStack.length - 1];
        const resOpt = utils_1.EntityApiUtils.convertOptions(getResolutionOptions(controller.cdmDocDefinition));
        const json = tuple.object.copyData(resOpt, { stringRefs: true });
        let jsonText = JSON.stringify(json, null, 2);
        // TODO: check if manifest
        jsonText = jsonText.replace(/([\n\s]+)\"(entityPath|toEntity|fromEntity)\":[\s]+\"([^\"]+)\"/gm, '$1"$2": <a id="link_text" onClick="entityJump(\'$3\')" title="$3">"$3"</a>');
        // string refs got exploded. turn them back into strings with links
        jsonText = jsonText.replace(/{[\s]+\"corpusPath\": \"([^ \"]+)\",\n[\s]+\"identifier\": \"([^\"]+)\"\n[\s]+}/gm, '<a id="link_text" onClick="detailDefinitionJump(\'$1\')" title="$1">"$2"</a>');
        if (controller.DefinitionStack.length > 1)
            controller.backDefinitionButton.style.display = 'inline-block';
        else
            controller.backDefinitionButton.style.display = 'none';
        jsonText = applySearchTerm(jsonText);
        controller.definitionPane.innerHTML = createTextDivs(jsonText);
        controller.paneDetailHost.scrollTop = tuple.scrollTop;
        controller.paneDetailHost.scrollLeft = tuple.scrollLeft;
    }
}
function repaint() {
    return __awaiter(this, void 0, void 0, function* () {
        if (controller.multiSelectEntityList) {
            const singleSelected = controller.multiSelectEntityList.size == 1 ? controller.multiSelectEntityList.values().next().value : undefined;
            yield controller.mainContainer.messageHandle('navigateEntitySelect', controller.multiSelectEntityList, singleSelected);
        }
    });
}
function makeParamValue(param, value) {
    if (!value)
        return controller.document.createTextNode('');
    // if a string constant, call get value to turn into itself or a reference if that is what is held there
    if (value.type == entity_api_1.ExplorerArgumentValueType.string)
        return controller.document.createTextNode(value.argumentValue);
    // if this is a constant table, then expand into an html table
    if (value.type == entity_api_1.ExplorerArgumentValueType.constantEntity) {
        var argValue = value.argumentValue;
        var entValues = argValue.constantValues;
        if (!entValues && entValues.length == 0)
            return controller.document.createTextNode('empty table');
        var valueTable = controller.document.createElement('table');
        valueTable.className = 'trait_param_value_table';
        var valueRow = controller.document.createElement('tr');
        valueRow.className = 'trait_param_value_table_header_row';
        var shapeAttNames = argValue.attributeNames;
        let l = shapeAttNames.length;
        for (var i = 0; i < l; i++) {
            var th = controller.document.createElement('th');
            th.className = 'trait_param_value_table_header_detail';
            th.appendChild(controller.document.createTextNode(shapeAttNames[i]));
            valueRow.appendChild(th);
        }
        valueTable.appendChild(valueRow);
        for (var r = 0; r < entValues.length; r++) {
            var valueRow = controller.document.createElement('tr');
            valueRow.className = 'trait_param_value_table_detail_row';
            valueTable.appendChild(valueRow);
            var rowData = entValues[r];
            if (rowData && rowData.length) {
                for (var c = 0; c < rowData.length; c++) {
                    var td = controller.document.createElement('td');
                    td.className = 'trait_param_value_table_detail_detail';
                    valueRow.appendChild(td);
                    var tvalue = rowData[c];
                    if (tvalue)
                        td.appendChild(controller.document.createTextNode(tvalue));
                }
            }
        }
        var divHolder = controller.document.createElement('div');
        divHolder.className = 'trait_param_value_table_host';
        divHolder.appendChild(valueTable);
        return divHolder;
    }
    else {
        // stick json in there
        var code = controller.document.createElement('code');
        var json = JSON.stringify(value.copyData(getResolutionOptions(controller.cdmDocSelected), undefined), null, 2);
        if (json.length > 67)
            json = json.slice(0, 50) + '...(see Definition tab)';
        code.appendChild(controller.document.createTextNode(json));
        return code;
    }
}
function makeParamRow(param, value) {
    var paramRow = controller.document.createElement('tr');
    paramRow.className = 'trait_parameter_table_detail_row';
    var td = controller.document.createElement('td');
    td.className = 'trait_parameter_table_detail_name';
    td.appendChild(controller.document.createTextNode(param.name));
    paramRow.appendChild(td);
    var td = controller.document.createElement('td');
    td.className = 'trait_parameter_table_detail_value';
    td.appendChild(makeParamValue(param, value));
    paramRow.appendChild(td);
    var td = controller.document.createElement('td');
    td.className = 'trait_parameter_table_detail_type';
    if (param.dataType && param.dataType.name)
        td.appendChild(controller.document.createTextNode(param.dataType.name));
    paramRow.appendChild(td);
    var td = controller.document.createElement('td');
    td.className = 'trait_parameter_table_detail_explanation';
    if (param.explanation)
        td.appendChild(controller.document.createTextNode(param.explanation));
    paramRow.appendChild(td);
    return paramRow;
}
function makeTraitRow(rt, alt) {
    var traitRow = controller.document.createElement('tr');
    traitRow.className = 'trait_table_row';
    var innerTable = controller.document.createElement('table');
    innerTable.className = 'trait_table_row_table';
    if (alt)
        innerTable.style = 'background-color: var(--table-back-alternate)';
    else
        innerTable.style = 'background-color: var(--back-alternate2)';
    traitRow.appendChild(innerTable);
    var innerRow = controller.document.createElement('tr');
    innerRow.className = 'trait_table_row_table_row';
    innerTable.appendChild(innerRow);
    var td = controller.document.createElement('td');
    td.className = 'trait_table_detail_name';
    td.appendChild(controller.document.createTextNode(rt.name));
    innerRow.appendChild(td);
    var td = controller.document.createElement('td');
    td.className = 'trait_table_detail_explanation';
    if (rt.explanation)
        td.appendChild(controller.document.createTextNode(rt.explanation));
    innerRow.appendChild(td);
    let args = rt.arguments;
    if (args && args.length) {
        var innerRow = controller.document.createElement('tr');
        innerRow.className = 'trait_table_row_table_row';
        innerTable.appendChild(innerRow);
        var td = controller.document.createElement('td');
        td.className = 'trait_parameter_table_holder';
        td.colSpan = 3;
        innerRow.appendChild(td);
        var pvTable = controller.document.createElement('table');
        pvTable.className = 'trait_parameter_table';
        td.appendChild(pvTable);
        var pvRow = controller.document.createElement('tr');
        pvRow.className = 'trait_parameter_table_header_row';
        var td = controller.document.createElement('th');
        td.className = 'trait_parameter_table_header_name';
        td.appendChild(controller.document.createTextNode('Parameter'));
        pvRow.appendChild(td);
        var td = controller.document.createElement('th');
        td.className = 'trait_parameter_table_header_value';
        td.appendChild(controller.document.createTextNode('Value'));
        pvRow.appendChild(td);
        var td = controller.document.createElement('th');
        td.className = 'trait_parameter_table_header_type';
        td.appendChild(controller.document.createTextNode('Data Type'));
        pvRow.appendChild(td);
        var td = controller.document.createElement('th');
        td.className = 'trait_parameter_table_header_explanation';
        td.appendChild(controller.document.createTextNode('Explanation'));
        pvRow.appendChild(td);
        pvTable.appendChild(pvRow);
        // each param and value
        let l = args.length;
        for (var i = 0; i < l; i++)
            pvTable.appendChild(makeParamRow(args[i].parameter, args[i].value));
    }
    return traitRow;
}
function messageHandleDetailTraits(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType == 'detailTabSelect') {
            this.style.display = (data1 != 'trait_tab') ? 'none' : 'block';
            return;
        }
        let cdmObject;
        let rts;
        if (messageType == 'navigateEntitySelect') {
            if (data2) {
                cdmObject = data2.entity;
                rts = yield cdmObject.getTraits(getResolutionOptions(controller.cdmDocSelected));
            }
        }
        else if (messageType == 'listItemSelect') {
            // check attribute
            if (isAttribute(data1)) {
                cdmObject = data1.attribute;
                rts = data1.traits;
            }
            else if (isEntity(data1)) {
                if (!data1.entity) {
                    yield loadEntity(data1);
                }
                cdmObject = data1.entity;
                rts = yield cdmObject.getTraits(getResolutionOptions(controller.cdmDocSelected));
            }
        }
        if (cdmObject) {
            clearTraitsPane();
            if (rts) {
                var traitTable = controller.document.createElement('table');
                traitTable.className = 'trait_table';
                var l = rts.length;
                let r = 0;
                for (let i = 0; i < l; i++) {
                    let rt = rts[i];
                    // only show the ugly traits to those who think they can withstand it.
                    if (!rt.isUgly) {
                        traitTable.appendChild(makeTraitRow(rt, r % 2 != 0));
                        r++;
                    }
                }
                this.appendChild(traitTable);
            }
        }
    });
}
function messageHandleDetailProperties(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType == 'detailTabSelect') {
            this.style.display = (data1 != 'property_tab') ? 'none' : 'block';
            return;
        }
        let resolvedObject;
        let isAtt = false;
        if (messageType == 'navigateEntitySelect') {
            if (data2) {
                resolvedObject = yield data2.entity.getResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
            }
        }
        else if (messageType == 'listItemSelect') {
            if (isAttribute(data1)) {
                resolvedObject = data1;
                isAtt = true;
            }
            else if (isEntity(data1)) {
                resolvedObject = yield data1.entity.getResolvedEntity(getResolutionOptions(controller.cdmDocSelected));
            }
        }
        if (resolvedObject) {
            clearPropertiesPane();
            let propertyTable = controller.document.createElement('table');
            propertyTable.className = 'property_table';
            let propertyRow = controller.document.createElement('tr');
            propertyRow.className = 'property_table_header';
            propertyTable.appendChild(propertyRow);
            let propertyLabel = controller.document.createElement('td');
            propertyLabel.className = 'property_table_header_label';
            propertyRow.appendChild(propertyLabel);
            let propertyValue = controller.document.createElement('td');
            propertyValue.className = 'property_table_header_value';
            propertyRow.appendChild(propertyValue);
            propertyLabel.appendChild(controller.document.createTextNode(isAtt ? 'Attribute' : 'Entity'));
            const entityName = resolvedObject.explorerEntity && resolvedObject.explorerEntity.name ? resolvedObject.explorerEntity.name : resolvedObject.sourceName;
            propertyValue.appendChild(controller.document.createTextNode(isAtt ? resolvedObject.name : entityName));
            const addRow = (propName) => {
                let val = resolvedObject[propName];
                if (val != undefined) {
                    propertyRow = controller.document.createElement('tr');
                    propertyRow.className = 'property_table_detail';
                    propertyTable.appendChild(propertyRow);
                    propertyLabel = controller.document.createElement('td');
                    propertyLabel.className = 'property_table_detail_label';
                    propertyRow.appendChild(propertyLabel);
                    propertyValue = controller.document.createElement('td');
                    propertyValue.className = 'property_table_detail_value';
                    propertyRow.appendChild(propertyValue);
                    propertyLabel.appendChild(controller.document.createTextNode(propName));
                    if (typeof (val) == 'string')
                        propertyValue.appendChild(controller.document.createTextNode(val));
                    else if (val instanceof Array) {
                        var pre = controller.document.createElement('pre');
                        var code = controller.document.createElement('code');
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
                addRow('displayName');
                addRow('description');
                addRow('isPrimaryKey');
                addRow('dataFormat');
                addRow('maximumLength');
                addRow('maximumValue');
                addRow('minimumValue');
                addRow('isReadOnly');
                addRow('isNullable');
                addRow('creationSequence');
                addRow('sourceName');
                addRow('valueConstrainedToList');
                addRow('defaultValue');
            }
            else {
                addRow('displayName');
                addRow('description');
                addRow('version');
                addRow('primaryKey');
                addRow('cdmSchemas');
                addRow('sourceName');
            }
            this.appendChild(propertyTable);
        }
    });
}
function copyActivePane() {
    var activePane;
    if (controller.statusPane.style.display != 'none')
        activePane = controller.statusPane;
    else if (controller.propertiesPane.style.display != 'none')
        activePane = controller.propertiesPane;
    else if (controller.traitsPane.style.display != 'none')
        activePane = controller.traitsPane;
    else if (controller.definitionPane.style.display != 'none')
        activePane = controller.definitionPane;
    else if (controller.resolvedPane.style.display != 'none')
        activePane = controller.resolvedPane;
    else if (controller.partitionsPane.style.display != 'none')
        activePane = controller.partitionsPane;
    if (activePane) {
        var range = controller.document.createRange();
        range.setStart(activePane.firstChild, 0);
        range.setEndAfter(activePane.lastChild);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        controller.document.execCommand('copy');
    }
}
exports.copyActivePane = copyActivePane;
function clearResolvedPane() {
    controller.ResolvedStack = new Array();
    controller.resolvedPane.innerHTML = '';
}
function clearDefinitionPane() {
    controller.DefinitionStack = new Array();
    controller.definitionPane.innerHTML = '';
    controller.backDefinitionButton.style.display = 'none';
}
function clearPropertiesPane() {
    while (controller.propertiesPane.childNodes.length > 0)
        controller.propertiesPane.removeChild(controller.propertiesPane.lastChild);
}
function clearTraitsPane() {
    while (controller.traitsPane.childNodes.length > 0)
        controller.traitsPane.removeChild(controller.traitsPane.lastChild);
}
function clearPartitionsPane() {
    controller.partitionsPane.innerHTML = '';
}
function messageHandleWaitBox(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (messageType) {
            case 'loadResolveStarting':
                createWaitBox('Loading and resolving entity documents, please wait...');
                break;
            case 'loadingFiles':
                createWaitBox('Loading files from source, please wait...');
                break;
            case 'resolvingEntity':
                createWaitBox('Loading and resolving the selected entity, please wait...');
                break;
            case 'computeRelationshipsStarting':
                createWaitBox('Recomputing entity relationships, please wait...');
                break;
            case 'loadResolveFinish':
            case 'loadingFilesFinish':
            case 'resolvingEntityFinish':
            case 'computeRelationshipsFinish':
                controller.paneWait.setAttribute('style', 'display:none');
                break;
        }
    });
}
function createWaitBox(message) {
    let width = 300;
    let height = 200;
    let left = (window.innerWidth - width) / 2;
    let top = (window.innerHeight - height) / 2;
    controller.paneWait.setAttribute('style', 'display:block;left:' + left + 'px; top:' + top + 'px; width:' + width + 'px; height:' + height + 'px;');
    controller.paneWait.innerHTML = `<span id=\"message_text\"><br/>${message}</span>`;
}
function messageHandleManifestSelect(messageType, data1, data2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (messageType === 'creatingManifestWindow') {
            let height = 200;
            let top = (window.innerHeight - height) / 2;
            const selectionArr = [];
            const sortedManifestList = Array.from(data1).sort((a, b) => {
                const aSlashOccurence = a.split('/').length;
                const bSlashOccurence = b.split('/').length;
                return aSlashOccurence != bSlashOccurence ? aSlashOccurence - bSlashOccurence : a.length - b.length;
            });
            selectionArr.push('<select id=\"selection\" size=\"10\" onchange=onclickManifestSelection()>');
            for (const manifestName of sortedManifestList) {
                selectionArr.push(`<option value='${manifestName}'>${manifestName}</option>`);
            }
            selectionArr.push('</select>');
            controller.paneManifestSelect.innerHTML = selectionArr.join('');
            controller.paneManifestSelect.setAttribute('style', `display:block;top:${top}px;`);
            const left = -1 * (controller.paneManifestSelect.offsetWidth / 2);
            controller.paneManifestSelect.setAttribute('style', `display:block;top:${top}px;margin-Left:${left.toString()}px;`);
        }
        else if (messageType === 'manifestSelected') {
            controller.paneManifestSelect.setAttribute('style', 'display:none');
            yield controller.mainContainer.messageHandlePing('loadManifest', data1, null);
        }
    });
}
//# sourceMappingURL=viz-controller.js.map