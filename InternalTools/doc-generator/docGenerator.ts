import * as fs from "fs";
import * as path from "path";
import * as markdownWriter from "./markdownWriter";
import * as utils from "./utils";
import { docStrings, excludeAttributesList, excludeTraitsList, githubRootLink, loadStrings, loadExcludeLists } from "./configHelper";
import { InstancesMapper } from "./instancesMapper"
import {
    IExplorerEntity, ResolveOptions, IExplorerAttributeBase,
    IExplorerAttributeGroup, IExplorerTypeAttribute, IExplorerResolvedEntity, DirectiveSet
} from 'entity-api';
import { TraitsDetailsGenerator } from "./traitsDetailsGenerator";
import { createListItem } from "./markdownWriter";

export class DocGenerator {
    private static readonly entityNameHeaderLevel: number = 1;
    private static readonly entityInstancesHeaderLevel: number = 2;
    private static readonly entityTraitsHeaderLevel: number = 2;
    private static readonly attributesHeaderLevel: number = 2;
    private static readonly attributeDetailNameHeaderLevel: number = 3;
    private static readonly attributeDetailPropertyHeaderLevel: number = 4;
    private static readonly attributeDetailTraitsHeaderLevel: number = 4;

    private static readonly maxLineLengthGithub : number = 110;

    public static run(cdmObject: IExplorerEntity, path) {

        let resOpt: ResolveOptions = { withRespectToDocument: cdmObject.declaredIn, directives: DirectiveSet.ReferenceOnly | DirectiveSet.Normalized };
        TraitsDetailsGenerator.setResOpt(resOpt);
        let resolvedEntity = cdmObject.createResolvedEntity(resOpt);

        let output = "";

        // Markdown file headers
        output += DocGenerator.generateMdHeaders(resolvedEntity.name, resolvedEntity.description, true);

        // Markdown file title
        output += markdownWriter.writeHeader(
            resolvedEntity.displayName, DocGenerator.entityNameHeaderLevel);

        // Description for entity
        output += DocGenerator.generateIntro(resolvedEntity);

        // Section 1: Instances
        output += DocGenerator.generateInstances(cdmObject.path);

        // Section 2: Traits
        // TODO: uncomment for traits to be in the auto-generated docs.
        // output += DocGenerator.generateEntityTraits(resolvedEntity);

        // Section 3: Attribute summary
        let attributes = DocGenerator.getAttributes(resolvedEntity);
        output += DocGenerator.generateAttributesSummary(attributes);

        // Section 4: Attribute detail
        output += DocGenerator.generateAttributesDetails(attributes);

        DocGenerator.createMdFile(output, path);
    }

    /**
     * Loads constant strings and exclude attributes, traits lists.
     * @param language Defines which strings.json file to load. (default: en)
     */
    public static init(language: string) {
        loadStrings(language);
        loadExcludeLists();
    }

    
    public static generateMdHeaders(title: string, description : string, isEntity : boolean): string {

        if (description !== undefined && description !== null) {
            // Remove newline from description.
            description = description.replace(/(\r\n|\n|\r)/gm, "");
        }

        let output = "---\n";
        if (isEntity) {
            output += "title: " + title.substr(0, title.length - 1) + " - Common Data Model | Microsoft Docs\n";
            output += "description: " + ((description != undefined && description.length <= DocGenerator.maxLineLengthGithub) ? 
                description : "This describes the " + title.substr(0, title.length - 1) + " entitity." ) + "\n";
        } else {
            output += "title: overview - Common Data Model | Microsoft Docs\n";
            output += "description: " + title + " is a folder that contains standard entities related to the Common Data Model.\n";
        }

        output += "author: nenad1002\n";
        output += "ms.service: common-data-model\n";
        output += "ms.reviewer: anneta\n";
        output += "ms.topic: article\n";
        output += "ms.date: " + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCDate() + "/" + new Date().getUTCFullYear() + "\n";
        output += "ms.author: nebanfic\n";
        output += "---\n";

        return output;
    }

    private static createMdFile(output: string, filePath: string) {
        filePath = path.resolve("./", filePath);

        let arr = filePath.split('\\');
        arr.pop();
        let folderPath = arr.join('\\');
        this.createFolderIfDoesntExist(folderPath);

        fs.writeFileSync(`${filePath}`, output);
        console.log(`${filePath} saved!`);
    }

    private static createFolderIfDoesntExist(folderPath: string) {
        // Split the path to create each folder separately.
        let folders = folderPath.split('\\');
        let tmpPath = '';

        folders.forEach((folder) => {
            if (folder != '') {
                tmpPath = tmpPath + folder + '\\';
                if (!fs.existsSync(tmpPath)) {
                    fs.mkdirSync(tmpPath);
                }
            }
        });
    }

    private static generateIntro(resolvedEntity: IExplorerResolvedEntity) {
        // Description for the entity.
        let output = "";

        if (resolvedEntity.description) {
            output += markdownWriter.writeParagraph(resolvedEntity.description);
        }

        output += "  \n"
        let githubLink = DocGenerator.getGithubLink(resolvedEntity);

        output += ` ${docStrings.introLatestVer} ${markdownWriter.createNewTabLink(docStrings.introGithub, githubLink)}.`;

        output += "  \n";

        return output;
    }

    private static getGithubLink(resolvedEntity: IExplorerResolvedEntity): string {
        let entityPath = resolvedEntity.explorerEntity.path;
        let arr = entityPath.split('/');
        arr.pop();
        entityPath = arr.join('/');
        return githubRootLink + entityPath;
    }

    private static getAttributes(resolvedEntity: IExplorerResolvedEntity): IExplorerTypeAttribute[] {
        let atts = resolvedEntity.attributes;
        if (atts) {
            let typeAttributes = [];
            let addAtts = (rasSub: IExplorerAttributeBase[], depth: number) => {
                let l = rasSub.length;
                for (let i = 0; i < l; i++) {
                    let att = rasSub[i];
                    if (att.isAttributeGroup) {
                        addAtts((att as IExplorerAttributeGroup).attributes, depth + 1);
                    }
                    else {
                        typeAttributes.push(att);
                    }
                }
            }
            addAtts(atts, 0);
            return typeAttributes;
        }
    }

    private static generateInstances(entityPath: string) {
        // Instances
        let output = "";
        output += markdownWriter.writeHeader(
            docStrings.instancesTitle,
            DocGenerator.entityInstancesHeaderLevel);

        output += `${docStrings.instancesIntro}  \n\n`;
        let instancePaths = InstancesMapper.getInstances(entityPath);
        instancePaths.forEach((instancePath) => {
            if (instancePath == entityPath) {
                output += markdownWriter.writeParagraph(markdownWriter.createListItem(
                    '/' + utils.removeSecondLastElement(utils.removePathPrefix(instancePath, 3))));
            } else {
                output += markdownWriter.writeParagraph(
                    markdownWriter.createListItem(markdownWriter.createLink(
                        '/' + utils.removeSecondLastElement(utils.removePathPrefix(instancePath, 3)),
                        utils.generateRelativeMdPath(entityPath, instancePath),
                        instancePath
                    )));
            }
        });
        return output;
    }

    private static generateEntityTraits(resolvedEntity: IExplorerResolvedEntity): string {
        let output = "";
        output += markdownWriter.writeHeader(
            docStrings.entityTraitTitle,
            DocGenerator.entityTraitsHeaderLevel);

        output += markdownWriter.startDetails();
        output += markdownWriter.writeSummary(`${docStrings.entityTraitIntro}  \n`);

        for (let trait of resolvedEntity.traits) {
            if (!trait.isUgly) {
                output += markdownWriter.createListItem(markdownWriter.makeBold(trait.name) + "  \n");
                if (trait.explanation || (trait.arguments && trait.arguments.length)) {
                    output += "  ";
                }
                if (trait.explanation) {
                    output += trait.explanation + "  ";
                }
                output += TraitsDetailsGenerator.createTraitTable(trait, resolvedEntity.explorerEntity.path);
                if (trait.explanation || (trait.arguments && trait.arguments.length)) {
                    output += "\n\n";
                }
            }
        }

        output += markdownWriter.endDetails();
        return output;
    }

    private static generateAttributesSummary(attributes: IExplorerTypeAttribute[]) {
        // Attribute - Summary
        let output = "";
        output += markdownWriter.writeHeader(
            docStrings.attTitle,
            DocGenerator.attributesHeaderLevel);

        output += markdownWriter.writeTableFirstRow(
            docStrings.attNameCol,
            docStrings.attDescrCol,
            docStrings.attInstancesCol);

        for (let entry of attributes) {
            let firstIncludedInstance = DocGenerator.getFirstIncludedInstance(entry);
            let shortName = utils.shortenEntityName(firstIncludedInstance);
            output += markdownWriter.writeTableRow(
                markdownWriter.createLink(entry.name, "#" + entry.name),
                entry.description ? entry.description : "",
                markdownWriter.createNewTabLink(
                    shortName,
                    utils.generateRelativeMdPath(
                        entry.resolvedEntity.explorerEntity.path,
                        firstIncludedInstance)
                )
            );
        }

        return output;
    }

    private static getFirstIncludedInstance(attribute: IExplorerTypeAttribute): string {
        let attributeName = attribute.name;
        while (true) {
            let obj = attribute.resolvedEntity.explorerEntity;

            if (attribute.isInherited == false) {
                return obj.path;
            }

            let resOpt: ResolveOptions = { withRespectToDocument: obj.declaredIn, directives: DirectiveSet.ReferenceOnly | DirectiveSet.Normalized };
            let baseObj = obj.getBaseEntity(resOpt);
            if (!baseObj) {
                return obj.path;
            } else {
                resOpt = { withRespectToDocument: baseObj.declaredIn, directives: DirectiveSet.ReferenceOnly | DirectiveSet.Normalized };
                let resObj = baseObj.createResolvedEntity(resOpt);
                let resAtts = DocGenerator.getAttributes(resObj);
                let resAtt = resAtts.find(ele => { return ele.name == attributeName });
                attribute = resAtt;
            }

        }
    }

    private static generateAttributesDetails(attributes: IExplorerTypeAttribute[]) {
        // Attributes - Details
        let output = "";

        for (let entry of attributes) {
            output += DocGenerator.generateDetailsForOneAttribute(entry);
        }
        return output;
    }

    private static generateDetailsForOneAttribute(entry: IExplorerTypeAttribute) {
        let output = "";
        output += markdownWriter.writeHeader(
            markdownWriter.createAnchor(entry.name, entry.name),
            DocGenerator.attributeDetailNameHeaderLevel);

        if (entry.description) {
            output += markdownWriter.writeParagraph(entry.description);
        }

        let firstIncludedInstance = DocGenerator.getFirstIncludedInstance(entry);
        let shortName = utils.shortenEntityName(firstIncludedInstance);
        let firstIncludedDisplay: string;
        if (firstIncludedInstance == entry.resolvedEntity.explorerEntity.path) {
            firstIncludedDisplay = `${shortName} ${docStrings.attThisEnt}`;
        } else {
            firstIncludedDisplay = markdownWriter.createNewTabLink(
                shortName,
                utils.generateRelativeMdPath(entry.resolvedEntity.explorerEntity.path, firstIncludedInstance)
            );
        }

        output += markdownWriter.writeParagraph(`${docStrings.attFirstIncluded} ${firstIncludedDisplay}`);

        // Properties
        output += markdownWriter.writeHeader(
            docStrings.attPropTitle,
            DocGenerator.attributeDetailPropertyHeaderLevel);

        output += DocGenerator.addAttributePropertyTable(entry);
        output += "\n";

        // Traits
        // TODO: uncomment for traits to be in the auto-generated docs.
        // output += markdownWriter.writeHeader(docStrings.attTraitsTitle,
        //     DocGenerator.attributeDetailTraitsHeaderLevel);
        // output += markdownWriter.startDetails();
        // output += markdownWriter.writeSummary(`${docStrings.attTraitsIntro1} ${entry.name} ${docStrings.attTraitsIntro2}`);

        // for (let trait of entry.traits) {
        //     if (!trait.isUgly && !excludeTraitsList.includes(trait.name)) {
        //         output += markdownWriter.createListItem(markdownWriter.writeParagraph(markdownWriter.makeBold(trait.name)));
        //         if (trait.explanation) {
        //             output += trait.explanation + "  ";
        //         }
        //         output += TraitsDetailsGenerator.createTraitTable(trait, entry.resolvedEntity.explorerEntity.path);
        //         if (trait.explanation || (trait.arguments && trait.arguments.length)) {
        //             output += "\n\n";
        //         }
        //     }
        // }

        // output += markdownWriter.endDetails();
        return output;
    }

    private static addAttributePropertyTable(entry: IExplorerTypeAttribute): string {
        let output = "";
        output += markdownWriter.startHTMLTable();
        output += markdownWriter.writeHTMLTableFirstRow(
            docStrings.attPropNameCol,
            docStrings.attPropValCol);

        let addAttributePropertyRow = (name, value) => {
            let text: string;
            if (value) {
                if (value instanceof Array) {
                    text = DocGenerator.createDefaultValueTable(value);
                } else {
                    text = value.toString();
                }
                return markdownWriter.writeHTMLTableRow(name, text);
            }
            return "";
        };

        if(entry.name == "accountCategoryCode") {
            console.log("as");
        }
        output += addAttributePropertyRow(docStrings.propDisplayName, entry.displayName);
        output += addAttributePropertyRow(docStrings.propDescription, entry.description);
        output += addAttributePropertyRow(docStrings.propIsPrimaryKey, entry.isPrimaryKey);
        output += addAttributePropertyRow(docStrings.propDataFormat, entry.dataFormat);
        output += addAttributePropertyRow(docStrings.propMaximumLength, entry.maximumLength);
        output += addAttributePropertyRow(docStrings.propMaximumValue, entry.maximumValue);
        output += addAttributePropertyRow(docStrings.propMinimumValue, entry.minimumValue);
        output += addAttributePropertyRow(docStrings.propIsReadOnly, entry.isReadOnly);
        output += addAttributePropertyRow(docStrings.propIsNullable, entry.isNullable);
        output += addAttributePropertyRow(docStrings.propSourceName, entry.sourceName);
        output += addAttributePropertyRow(docStrings.propValueConstrainedToList, entry.valueConstrainedToList);
        output += addAttributePropertyRow(docStrings.propDefaultValue, entry.defaultValue);

        output += markdownWriter.endHTMLTable();
        return output;
    }

    private static createDefaultValueTable(val: any[]): string {
        let output = "";
        if (val.length > 0) {
            output += markdownWriter.startHTMLTable();
            let keys = Object.keys(val[0]);
            let iDisplayOrder = keys.findIndex( (ele) => { return ele == "displayOrder"; });
            if (iDisplayOrder >= 0) {
                keys = [].concat(keys.slice(0,iDisplayOrder), keys.slice(iDisplayOrder+1));
                output += markdownWriter.writeHTMLTableFirstRowWithArray(keys);
                val = val.sort(function (a, b) { return parseInt(a["displayOrder"]) - parseInt(b["displayOrder"]); });
                for (let i = 0; i < val.length; i++) {
                    let row = new Array<string>();
                    keys.forEach( (key) => {
                        if(key == "displayOrder") {
                            return;
                        }
                        row.push(val[i][key]);
                    });
                    output += markdownWriter.writeHTMLTableRowWithArray(row);
                }
            } else {
                output += markdownWriter.writeHTMLTableFirstRowWithArray(keys);
                for (let i = 0; i < val.length; i++) {
                    output += markdownWriter.writeHTMLTableRowWithArray(val[i]);
                }
            }

            output += markdownWriter.endHTMLTable();
        }
        return output;
    }
}
