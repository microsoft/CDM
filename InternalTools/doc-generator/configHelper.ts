import * as fs from "fs";
import { IDocStrings } from "./docStrings";

export var docStrings: IDocStrings;

export var excludeAttributesList: Array<string>;
export var excludeTraitsList: Array<string>;

export var githubRootLink: string;

export function loadStrings(loc: string) {
    if (!loc) {
        loc = "en";
    }

    let json = fs.readFileSync(`./resources/strings-en.json`, 'utf8');
    docStrings = <IDocStrings>JSON.parse(json);
}

export function loadExcludeLists() {
    let json = fs.readFileSync(`./config/config.json`, 'utf8');
    let obj = JSON.parse(json);
    excludeAttributesList = obj.excludeAttributesList;
    excludeTraitsList = obj.excludeTraitsList;
    githubRootLink = obj.githubRootLink;
}