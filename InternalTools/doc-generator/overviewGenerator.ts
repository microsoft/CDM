import { writeFileSync, readdir, readFileSync } from "fs";
import * as markdownWriter from "./markdownWriter";
import { DocGenerator } from "./docGenerator";
import * as utils from "./utils";

export class OverviewGenerator {

    static MicrosoftDocsUrl = "https://review.docs.microsoft.com/en-us/common-data-model/schema/";

    static MicrosoftDocsGithubBranchExtension = "?branch=";

    public static run(rootFolderPath : string, descriptionLine : number, testRun : boolean, docsBranch : string): number {
        if (!testRun) {
            OverviewGenerator.MicrosoftDocsUrl = "https://docs.microsoft.com/en-us/common-data-model/schema/";
            OverviewGenerator.MicrosoftDocsGithubBranchExtension = "";
        } else {
            OverviewGenerator.MicrosoftDocsGithubBranchExtension += docsBranch;
        }

        this.recurseFolders(rootFolderPath, rootFolderPath, descriptionLine);
        return 0;
    }

    // Goes recursevely through all the folders and creates an overview file for each folder.
    private static recurseFolders(path : string, folder : string, descriptionLine : number) {
        var files = new Array() as Array<[string, string, string]>;
        var subfolders = new Array() as Array<string>;
        readdir(path, (err, items) => {
            items.forEach(item => {
                let itemArr = item.split('.');

                // Ignore possible yml files.
		        if (itemArr[1] == 'yml') {
				    return;
                }
                
                // The item is a folder.
                if (itemArr[1] != 'md') {
                    this.recurseFolders(path + '/' + item, item, descriptionLine);
                    subfolders.push(item);
                } else {
                    // Ignore if there is already overview.md file in the folder.
				    if (itemArr[0] != 'overview') {
                        // Read file line by line.
                        let data = readFileSync(path + '/' + item, 'utf8').split(/\r?\n/);
				        for (let i = 0; i < data.length; i++) {
                            // Description is at line defined in the parameter.
					        if (i == descriptionLine) {
						        files.push([itemArr[0], item, data[i]]);
						        break;
					        }
				        }
			        }
                }
            });

             // Create the overview file for the Microsoft Docs.
             this.createOverviewMdFile(path, folder, files, subfolders);

             // Create the README file for the Github.
             this.createReadmeGithubFile(path, folder, files, subfolders);
        });
    }


    // Creates the file from the extracted data.
    private static createOverviewMdFile(path : string, folder : string, files : Array<[string, string, string]>, subfolders : Array<string>) {
        let output = DocGenerator.generateMdHeaders(folder, null, false);

        if (folder == "applicationCommon") {
            output += markdownWriter.writeHeader("Entity Reference", 1);
        } else {
            output += markdownWriter.writeHeader(folder, 1);
        }
    
        output += this.buildTable(path, files, subfolders, true);

        writeFileSync(path + '/overview.md', output);
    }

    // Creates the file from the extracted data.
    private static createReadmeGithubFile(path : string, folder : string, files : Array<[string, string, string]>, subfolders : Array<string>) {
        let output = DocGenerator.generateMdHeaders(folder, null, false);

        output += markdownWriter.writeHeader(folder, 1);

        // Remove the top level folder.
        let tablePath = utils.removePathPrefix(path, 1).toLowerCase();
        
        output += this.buildTable(tablePath, files, subfolders, false);

        writeFileSync(path + '/readme.md', output);
    }

    private static buildTable(path : string, files : Array<[string, string, string]>, subfolders : Array<string>, isOverView : boolean) : string {
        let output = "";

        if (subfolders.length != 0) {
            output += markdownWriter.writeHeader("Sub-folders", 2);
            output += markdownWriter.writeTableFirstRow("Name");

		    subfolders.forEach( (item) => {
                if (isOverView) {
                    output += markdownWriter.writeTableRow('[' + item + '](' + item + '/overview.md)');
                } else {
                    output += markdownWriter.writeTableRow('[' + item + '](' + OverviewGenerator.MicrosoftDocsUrl + path + '/' + item 
                    + '/overview' + OverviewGenerator.MicrosoftDocsGithubBranchExtension + ')');
                }
            });

            output += "\n\n\n";
        }
        
	    if (files.length != 0) {
            output += markdownWriter.writeHeader("Entities", 2);
            output += markdownWriter.writeTableFirstRow("Name", "Description");

            files.forEach( (item) => {
                if (isOverView) {
                    output += markdownWriter.writeTableRow('[' + item[0] + '](' + item[1] + ')', item[2]);
                } else {
                    output += markdownWriter.writeTableRow('[' + item[0] + '](' + OverviewGenerator.MicrosoftDocsUrl + path + '/' + item[0] 
                        + OverviewGenerator.MicrosoftDocsGithubBranchExtension + ')', item[2]); 
                }
            });
        }
        
        return output;
    }
}