/**
* Generate markdown file path.
* @param path entity path. e.g. "/core/applicationCommon/Account.cdm.json/Account"
* @returns Returns the md path. e.g. "/core/applicationCommon/Account.md"
*/
export function generateMdPath(path: string) : string {
    let arr = path.split('.');
    arr.pop();
    arr.pop();
    if(arr[0][0] == '/') {
        return (arr.join('.')).substr(1) + ".md";
    } else {
        return (arr.join('.'))+ ".md";
    }
}

/**
* Generate relative path.
* @param currentPath current entity path. e.g. "/core/applicationCommon/foundationCommon/Account.cdm.json/Account"
* @param targetPath target entity path. e.g. "/core/applicationCommon/Account.cdm.json/Account"
* @returns Returns the relative md path. e.g. "../Account.cdm.json/Account"
*/
export function generateRelativePath(currentPath: string, targetPath: string) : string {
    let currentArray = currentPath.split('/');
    let targetArray = targetPath.split('/');

    if(currentPath == targetPath) {
        return currentArray.slice(currentArray.length - 2, currentArray.length).join('/');
    }

    let i = 0;
    while(true) {
        if(i == currentArray.length - 1 || i == targetArray.length - 1 || currentArray[i] != targetArray[i]) {
            let res = "";
            for (let j = 0; j < currentArray.length - i - 2; j ++) {
                res += "../";
            }
            res += targetArray.slice(i).join('/');
            return res;
        } else {
            i ++;
        }
    }
}

/**
* Generate relative markdown file path.
* @param currentPath current entity path. e.g. "/core/applicationCommon/foundationCommon/Account.cdm.json/Account"
* @param targetPath target entity path. e.g. "/core/applicationCommon/Account.cdm.json/Account"
* @returns Returns the relative md path. e.g. "../Account.md"
*/
export function generateRelativeMdPath(currentPath: string, targetPath: string) : string {
    return generateMdPath(generateRelativePath(currentPath, targetPath));
}

/**
* Shorten entity name.
* @param entityPath Long entity path string. e.g. "/core/applicationCommon/foundationCommon/Account.cdm.json/Account"
* @returns Returns a short version of entityName. e.g. "foundationCommon/Account"
*/
export function shortenEntityName(entityPath: string) : string {
    let arr = entityPath.split('.')[0].split('/');
    arr = arr.slice(arr.length - 2);
    return arr.join('/');
}

/**
* Split long string (only at splitStr) to keep it shorter than maxLen.
* @param text Long string, e.g. entity path
* @param maxLen Max length for a line.
* @param splitStr Only break the line at the splitStr.
* @returns Returns a multi-line version of text.
*/
export function splitLongString(text: string, maxLen?: number, splitStr?: string) : string {
    maxLen = maxLen ? maxLen : 50;
    splitStr = splitStr ? splitStr : '/';
    if(text.length <= maxLen) {
        return text;
    }

    let arr = text.split(splitStr);
    let res = new Array<string>();
    let i = 0;
    while (i < arr.length) {
        let last = i;
        let charNum = 0;
        
        for (; i < arr.length; i++) {
            charNum += arr[i].length + 1;
            if (charNum > maxLen) {
                break;
            }
        }

        if(i == last) {
            res.push("/" + arr[i]);
        } else {
            if(last!=0){
                res.push("/" + arr.slice(last, i).join('/'));
            } else {
                res.push(arr.slice(last, i).join('/'));
            }
        }
    }

    return res.join('<br>');
}

/**
* Removes top level folders of a path.
* @param path Path to a certain folder.
* @param level The number of top level folders a function removes.
* @returns A new path without top level folders.
*/
export function removePathPrefix(path : string, level : number) : string {
    return path.split('/').slice(level).join('/');
}

/**
* Remove the second last element from the list.
* @param path Path to a certain folder.
* @returns A new path without the second last element.
*/
export function removeSecondLastElement(path : string) : string {
    let pathArr = path.split('/');
    let lastFolder = pathArr.pop();
    pathArr.pop();
    pathArr.push(lastFolder);
    return pathArr.join('/');
}