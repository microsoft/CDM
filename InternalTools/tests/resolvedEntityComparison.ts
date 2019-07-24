import Diff = require('text-diff');
import fs = require('fs');

let file1 = process.argv[2];
let file2 = process.argv[3];

// The class implementing the comparison between resolved entities.
class ResolvedEntityComparison {
    // Represents the maximum number of characters in a single line that can represent a modification.
    static readonly MaxModificationDifference : number = 20;
	
    // All the ending tags have the length of 6.
    static readonly EndTagsLength : number = 6;

    public static run() : boolean {
        // Do synchronous reading since the files itself shouldn't be too big at a granular level.
        let oldResolvedEntitiesText = fs.readFileSync(file1).toString().replace(/\r\n/g, "\n");
        let newResolvedEntitiesText = fs.readFileSync(file2).toString().replace(/\r\n/g, "\n");

        let diff = new Diff();

        // Produces diff array.
        let textDiff = diff.main(oldResolvedEntitiesText, newResolvedEntitiesText);
        let html = ResolvedEntityComparison.removeEmptyTags(diff.prettyHtml(textDiff));

        if (!ResolvedEntityComparison.isThereADifference(html)) {
            return false;
        }

        ResolvedEntityComparison.createHtmlDisplayAll(html);

        ResolvedEntityComparison.createHtmlDisplayDiff(html);

        return true;
    }

    // Checks was there any difference between two files.
    // Params: html (input html string text)
    private static isThereADifference(html : string) {
        return html.includes("<ins>") || html.includes("<del>");
    }
	
	// Removes empty tags from HTML string.
    // Params: html (input html string text)
    private static removeEmptyTags(html : string) : string {
        let beginTagsArray = ResolvedEntityComparison.findAllOccurencesOfKeyTags(html, true);
        let resHtml = "", lastIndex = 0;
        for (let i = 0; i < beginTagsArray.length; i++) {
            let afterTagChars = html.substr(beginTagsArray[i], this.EndTagsLength);

            // We found empty tags that need to be removed.
            if (afterTagChars == '</ins>' || afterTagChars == '</del>') {
                resHtml += html.substr(lastIndex, beginTagsArray[i] - lastIndex - this.EndTagsLength + 1);
                lastIndex = beginTagsArray[i] + this.EndTagsLength;
            }
        }

        resHtml += html.substr(lastIndex, html.length - lastIndex);

        return resHtml;
    }

    // Creates a diff file of two resolved entities.
    // Params: html (input html string text)
    private static createHtmlDisplayDiff(html : string) {
        let beginTagsArray = ResolvedEntityComparison.findAllOccurencesOfKeyTags(html, true);
        let endTagsArray = ResolvedEntityComparison.findAllOccurencesOfKeyTags(html, false);
    
        let result = '<table>';
    
        let possibleModification : boolean = false
        let lastModifiedItemIndex : number = -1;
    
        for (let i = 0; i < beginTagsArray.length; i++) {
            // It is possible modification happening here, we want to mark it.
            if (i < beginTagsArray.length - 1 && beginTagsArray[i+1] - ResolvedEntityComparison.MaxModificationDifference < endTagsArray[i]) {
                possibleModification = true;
                lastModifiedItemIndex = i;
            }
    
            // We want to highlight a possible modification.
            result += possibleModification ? '<tr class = "possibleModificationText">' : "<tr>";
    
            // Take few characters in the front and end of the tags.
            // TODO: Find a better way to fix edge case issues which might arrise here and create appropriate constants.
            let diffItem = html.substring(beginTagsArray[i] - 6 , endTagsArray[i] + 4);
            result += "<th>Character " + beginTagsArray[i] + ": </th><th>" + diffItem + "</th></tr>";
    
            if (lastModifiedItemIndex != i) {
                possibleModification = false;
            }
        }
    
        result += "</table>"
    
        // Highlight the ins and del tags.
        result = ResolvedEntityComparison.addStyleForInsAndDelTags(result);
    
        fs.writeFile('diffResolved.html', result,  function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("Diff output file successfully created!");
        });
    }
    
    // Function which uses regex to find the occurences of all tags.
    // Params: html (input html string text), begin (denoting do we want to find begin or end tags)
    private static findAllOccurencesOfKeyTags(html : string, begin : boolean) {
        let needle = begin ? '<ins>|<del>' : '</ins>|</del>';
        let re = new RegExp(needle, 'gi');
        let haystack = html;
    
        let results = new Array();
        while (re.exec(haystack)){
            results.push(re.lastIndex);
        }
    
        return results;
    }
       
    // Creates an HTML file which contains the whole new resolved entities with diffs highlighted.
    // Params: html (input html string text)
    private static createHtmlDisplayAll(html : string) {
        html = ResolvedEntityComparison.addStyleForInsAndDelTags(html);
       
        fs.writeFile('allResolved.html', html,  function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("All output file successfully created!");
        });
    }
    
    // Adds style and highlights to the ins and del tags in the HTML.
    // Params: html (input html string text)
    private static addStyleForInsAndDelTags(html : string) : string {
        let style = `
        <style>
            ins {
                color: green;
                font-weight: bold
                }
            del {
                color: red;
                font-weight: bold
                }
            td, th {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                }
            tr:nth-child(even) {
                background-color: #dddddd;
                }
            tr.possibleModificationText {
                background-color: #add8e6;
            }
        </style>`;

        return style + html;
    }
}

let areEntitiesDifferent : boolean = ResolvedEntityComparison.run();

// Do something with areEntitiesDifferent (use it in VSTS pipeline to report it back to a user).
console.log(areEntitiesDifferent);