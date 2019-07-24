import * as markdownWriter from "./markdownWriter";
import { docStrings } from "./configHelper";
import * as utils from "./utils"
import {
    ResolveOptions, IExplorerTrait, IExplorerParameter,
    ExplorerArgumentValueType, IExplorerArgumentValue, IConstantEntityArgumentValues
} from "entity-api";

export class TraitsDetailsGenerator {
    private static resOpt: ResolveOptions;
    private static currentEntityPath: string;

    public static setResOpt(opt: ResolveOptions) {
        TraitsDetailsGenerator.resOpt = opt;
    }

    public static createParamValue(param: IExplorerParameter, value: IExplorerArgumentValue): string {
        if (!value)
            return "";

        // if a string constant, call get value to turn into itself or a reference if that is what is held there
        if (value.type == ExplorerArgumentValueType.string)
            return value.argumentValue.toString();

        // if this is a constant table, then expand into an html table
        if (value.type == ExplorerArgumentValueType.constantEntity) {
            let argValue = value.argumentValue as IConstantEntityArgumentValues;
            let entValues = argValue.constantValues;
            if (!entValues && entValues.length == 0) {
                return docStrings.attTraitsEmpTable;
            }
            
            let valueTable = "";

            valueTable += markdownWriter.startHTMLTable();

            // Deal with special traits.
            if (argValue.attributeNames.includes("displayOrder")) {
                let iDisplayOrder = argValue.attributeNames.findIndex( (ele) => { return ele == "displayOrder"; });
                let keys = [].concat(argValue.attributeNames.slice(0, iDisplayOrder), argValue.attributeNames.slice(iDisplayOrder + 1));
                
                // If has attribute is displayOrder, display in order but do not show displayOrder itself.
                valueTable += markdownWriter.writeHTMLTableFirstRowWithArray(keys);
                entValues = entValues.sort(function(a, b) { return parseInt(a[iDisplayOrder]) - parseInt(b[iDisplayOrder]); });
                for (let r = 0; r < entValues.length; r++) {
                    let rowData = [].concat(entValues[r].slice(0, iDisplayOrder), entValues[r].slice(iDisplayOrder + 1));
                    if (rowData && rowData.length) {
                        valueTable += markdownWriter.writeHTMLTableRowWithArray(rowData);
                    }
                }
            } else if (argValue.attributeNames.length == 1 && argValue.attributeNames[0] == "attributeGroupReference") {
                // Wrap long attribute attributeGroupReference.
                valueTable += markdownWriter.writeHTMLTableFirstRow(argValue.attributeNames[0]);
                for (let r = 0; r < entValues.length; r++) {
                    let rowData = entValues[r];
                    if (rowData && rowData.length) {
                        let displayRow = rowData[0];
                        displayRow = utils.splitLongString(displayRow);
                        valueTable += markdownWriter.writeHTMLTableRow(displayRow);
                    }
                }
            } else if (argValue.attributeNames[0] == "entityReference" && argValue.attributeNames[1] == "attributeReference") {
                // Add link for entityReference and attributeReference.
                valueTable += markdownWriter.writeHTMLTableFirstRowWithArray(argValue.attributeNames);
                for (let r = 0; r < entValues.length; r++) {
                    let rowData = entValues[r];
                    if (rowData && rowData.length) {
                        let displayRowData = new Array<string>(2);
                        let relativePath = utils.generateRelativeMdPath(TraitsDetailsGenerator.currentEntityPath, rowData[0]);
                        displayRowData[0] = markdownWriter.createNewTabLink(rowData[0], relativePath);
                        displayRowData[1] = markdownWriter.createNewTabLink(rowData[1], relativePath + "#" + rowData[1]);
                        valueTable += markdownWriter.writeHTMLTableRowWithArray(displayRowData);
                    }
                }
            } else {
                // Other
                valueTable += markdownWriter.writeHTMLTableFirstRowWithArray(argValue.attributeNames);
                for (let r = 0; r < entValues.length; r++) {
                    let rowData = entValues[r];
                    if (rowData && rowData.length) {
                        valueTable += markdownWriter.writeHTMLTableRowWithArray(rowData);
                    }
                }
            }

            valueTable += markdownWriter.endHTMLTable();

            return valueTable;
        }
        else {
            // stick json in there
            let code = "";
            let json = JSON.stringify(value.copyData(TraitsDetailsGenerator.resOpt), null, 2);
            if (param.name == "attribute") {
                json = json.replace("_/", "/").replace(/"/g, '');
                let arr = json.split('/');
                code = markdownWriter.createLink(json, "#" + arr[arr.length - 1]);
            } else {
                code = json;
            }
            return code;
        }
    }

    public static createParamRow(param: IExplorerParameter, value: IExplorerArgumentValue): string {
        return markdownWriter.writeHTMLTableRow(
            param.name,
            TraitsDetailsGenerator.createParamValue(param, value),
            param.dataType.name,
            param.explanation ? param.explanation : "");
    }

    public static createTraitTable(rt: IExplorerTrait, p: string): string {
        TraitsDetailsGenerator.currentEntityPath = p;
        let traitTable = "";

        let args = rt.arguments;
        if (args && args.length) {

            traitTable += markdownWriter.startHTMLTable();
            traitTable += markdownWriter.writeHTMLTableFirstRow(
                docStrings.attTraitsParamCol,
                docStrings.attTraitsValueCol,
                docStrings.attTraitsDataTypeCol,
                docStrings.attTraitsExplanCol);

            // each param and value
            for (let i = 0; i < args.length; i++) {
                traitTable += TraitsDetailsGenerator.createParamRow(args[i].parameter, args[i].value);
            }
            traitTable += markdownWriter.endHTMLTable();
        }

        return traitTable;
    }
}