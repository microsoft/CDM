import * as fs from "fs";
import * as path from "path";
import { EntityFileLoader, IFolder, IFileInfo } from "entity-api";

export class SchemaLoader {

    private rootPath:string;
    private getFileList(dir: string, fileList: IFileInfo[]) {
        fileList = fileList || [];

        let files = fs.readdirSync(dir);

        files.forEach(fileName => {
            let filePath = path.resolve(dir, fileName);
            filePath = filePath.replace(/\\/g, "/");
            if (fileName == ".git" || this.isVersionFile(fileName)) {
                return;
            } else if (fs.statSync(filePath).isDirectory()) {
                fileList = this.getFileList(filePath, fileList);
            } else {
                let file: IFileInfo = {
                    name: fileName,
                    path: filePath
                };

                fileList.push(file);
            }
        })
        return fileList;
    }

    private isVersionFile(path: string) {
        let arr = path.split('/');
        let fileName = arr.pop();
        return fileName.match(/\.[0-9]+\.cdm\./) != undefined;
    }

    private loadFiles(hier: IFolder) {
        if (hier.entities == null) {
            hier.entities = [];
        }
        hier.entities.forEach(entity => {
            let data = fs.readFileSync(this.rootPath + entity.file.path);
            try {
                // Remove UTF-8 BOM if present, json_decode() does not like it.
                if(data[0] == 0xEF && data[1] == 0xBB && data[2] == 0xBF) {
                    entity.rawContent = JSON.parse(data.toString().substr(1));
                } else {
                    entity.rawContent = JSON.parse(data.toString());
                }
            } catch {
                console.log("JSON.parse error: " + this.rootPath + entity.file.path);
            }
        });

        if (hier.folders == null) {
            hier.folders = [];
        }

        hier.folders.forEach(folder => {
            this.loadFiles(folder);
        });
    }

    private collectEnts(hier: IFolder, idLookup) {
        idLookup.set(hier.id, hier);
        if (hier.entities) {
            hier.entities.forEach(e => {
                idLookup.set(e.id, e);

            });
        };
        if (hier.folders) {
            hier.folders.forEach(f => {
                this.collectEnts(f, idLookup);
            });
        }
    }

    public run(dir:string) {
        let fileList: IFileInfo[] = this.getFileList(dir, []);
        
        // Remove preceding folders from fileList path, since entity-api need it to be /core/...
        dir = path.resolve(dir).replace(/\\/g, "/");
        this.rootPath = dir;
        fileList.forEach(file => file.path = file.path.substr(dir.length));

        let navData = EntityFileLoader.GenerateNavigatorData(fileList);
        let hier = navData.root;

        // Load and parse json files into hier
        this.loadFiles(hier);
        let idLookup = new Map();
        this.collectEnts(hier, idLookup);
        return {hier, idLookup};
    }
}