import { IFolder, IEntityState, LoadStatus, INavigatorData, IFileInfo } from "./IEntityState";

export class EntityFileLoader {
    
    // Generate the navigation data from the file list
    public static GenerateNavigatorData(fileList: IFileInfo[]): INavigatorData {
        let noUX = new Set<string>();
        noUX.add("schema");
        noUX.add("primitives");
        noUX.add("foundations");
        noUX.add("meanings");
        noUX.add("dwConcepts");
        noUX.add("_allImports");
        noUX.add("cdsConcepts");
        noUX.add("wellKnownCDSAttributeGroups");

        let iFolder = 1;
        let root: IFolder = { id: `Folder${iFolder}`, name: "", entities: null, folders: null };
        iFolder++;
        let iEnt = 1;

        let pathToFolder = (path: string, under: IFolder): IFolder => {
            let iSub = path.indexOf("/");
            let subPath: string;
            if (iSub == -1)
                subPath = path;
            else
                subPath = path.slice(0, iSub);

            if (!under.folders)
                under.folders = new Array<IFolder>();
            let folderSub = under.folders.find(f => f.name === subPath);
            if (!folderSub) {
                folderSub = { id: `Folder${iFolder}`, name: subPath, entities: null, folders: null };
                iFolder++;
                under.folders.push(folderSub);
            }
            if (iSub == -1)
                return folderSub;
            return pathToFolder(path.slice(iSub + 1), folderSub);
        }

        for (let iFile = 0; iFile < fileList.length; iFile++) {
            let file: IFileInfo = fileList[iFile];
            if (file.name.endsWith(".cdm.json")) {
                let entName = file.name.slice(0, file.name.indexOf("."));
                let makeUX = !noUX.has(entName);
                let f: IFolder;
                let path = file.path;
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

                let ent: IEntityState = {
                    id: `Entity${iEnt}`, createUX: makeUX, description: "", path: path, docName: file.name, name: entName,
                    file: file, loadState: 0, folderId: f.id
                };
                iEnt++;
                if (!f.entities)
                    f.entities = new Array<IEntityState>();
                f.entities.push(ent);
            }

        }

        return { readRoot: "", sourceRoot: "", root: root };
    }
}