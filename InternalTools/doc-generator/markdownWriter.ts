export function writeTableFirstRow(...allParams: string[]) : string {
    let output = "|" + allParams.join("|") + "|\n";
    output += "|";
    for(let i in allParams) {
        output += "---|";
    }
    return output + "\n";
}

export function writeTableRow(...allParams: string[]) : string {
    return "|" + allParams.join("|") + "|\n";
}

export function writeHeader(header: string, level: number) : string {
    let output = "\n";
    for(let i = 0; i < level; i++) {
        output += "#";
    }
    return `${output} ${header}\n\n`;
}

export function writeParagraph(paragraph: string) : string {
    return paragraph + "  \n";
}

export function startHTMLTable() : string {
    return "<table>";
}

export function endHTMLTable() : string{
    return "</table>";
}

export function writeHTMLTableFirstRow(...allParams: string[]) : string {
    let output = "<tr>";
    for(let i in allParams) {
        output += `<th>${allParams[i]}</th>`;
    }
    return `${output}</tr>`;
}

export function writeHTMLTableRow(...allParams: string[]) : string {
    let output = "<tr>";
    for(let i in allParams) {
        output += `<td>${allParams[i]}</td>`;
    }
    return `${output}</tr>`;
}

export function writeHTMLTableFirstRowWithArray(params: string[]) : string {
    let output = "<tr>";
    for(let i in params) {
        output += `<th>${params[i]}</th>`;
    }
    return `${output}</tr>`;
}

export function writeHTMLTableRowWithArray(params: string[]) : string {
    let output = "<tr>";
    for(let i in params) {
        output += `<td>${params[i]}</td>`;
    }
    return `${output}</tr>`;
}

export function addCodeBlock(code: string, indent: number) : string{
    if(indent == undefined) {
        return "```\n" + code + "\n```\n";
    } else {
        code = "  " + code;
        code = code.replace(/\n/g, "\n  ");
        return "  ```\n" + code + "\n  ```\n";
    }
}

export function createLink(title: string, link: string, tooltip?: string) : string {
    if(tooltip) {
        return `[${title}](${link} \"${tooltip}\")`; 
    } else {
        return `[${title}](${link})`; 
    }
}

export function createAnchor(title: string, name: string, link?: string) : string {
    if(link) {
        return `<a href="${link}" name="${name}">${title}</a>`;
    } else {
        return `<a href=#${name} name="${name}">${title}</a>`;
    }
}

export function startDetails() : string {
    return "<details>\n"
}

export function endDetails() : string {
    return "</details>\n"
}

export function writeSummary(content: string) : string {
    return `<summary>${content}</summary>\n\n`;
}

export function createListItem(content: string) : string {
    return `- ${content}`;
}

export function createNewTabLink(title: string, link: string) : string {
    return `<a href="${link}" target="_blank">${title}</a>`; 
}

export function makeBold(content: string) : string {
    return `**${content}**`;
}