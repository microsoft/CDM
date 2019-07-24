import * as cdm from "cdm.objectmodel";
import { writeFileSync, mkdirSync, existsSync, readdir, readFileSync } from "fs";

class Startup {
    public static main(): number {

        // TODO: Change the test folder and introduce parameters.
        const testFolder = 'githubDocs/common-data-model/schema';
        
        this.recurseFolders(testFolder, testFolder);

        return 0;
    }

    private static recurseFolders(path : string, folder : string) {
		console.log(path);
        var files = new Array() as Array<[string, string, string]>;
        var subfolders = new Array() as Array<string>;
        readdir(path, (err, items) => {
            items.forEach(item => {
                let itemArr = item.split('.');
				if (itemArr[1] == 'yml') {
					return;
				}
                if (itemArr[1] != 'md') {
                    this.recurseFolders(path + '/' + item, item);
                    subfolders.push(item);
                } else {
					if (itemArr[0] != 'overview') {
                        let data = readFileSync(path + '/' + item, 'utf8').split(/\r?\n/);
					    for (let i = 0; i < data.length; i++) {

                            // Description is at line 12.
						    if (i == 12) {
							    files.push([itemArr[0], item, data[i]]);
							    break;
						    }
					    }
				    }
                }
            });
            this.createOverviewMdFile(path, folder, files, subfolders);
          });
    }

   private static generateMdHeaders(title : string) : string {
        let output = "---\n";
        output += "title: " + title + "\n";
        output += "description: some description\n";
        output += "ms.service:: common-data-model\n";
        output += "ms.reviewer: anneta\n";
        output += "ms.topic: article\n";
        output += "ms.date: " + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate() + "/" + new Date().getUTCFullYear() + "\n";
        output += "ms.author: tpalmer\n";
        output += "---\n\n";

        return output;
   } 

    private static createOverviewMdFile(path : string, folder : string, files : Array<[string, string, string]>, subfolders : Array<string>) {
        let output = this.generateMdHeaders(folder);

        output += "# " + folder + "\n\n";
        
		if (subfolders.length != 0) {
            output += "## Sub-folders\n\n";

			 output += "|Name|\n|---|\n";

			subfolders.forEach( (item) => {
            output += '|[' + item + '](' + item + '/overview.md)|\n';
        });

        output += "\n\n\n";
        }
        
		if (files.length != 0) {
            output += "## Entities\n\n";
        output += "|Name|Description|\n|---|---|\n";

        files.forEach( (item) => {
            output += '|[' + item[0] + '](' + item[1] + ')|' + item[2] + '|\n';
        });
		}

        writeFileSync(path + '/overview.md', output);
    }
}

Startup.main();