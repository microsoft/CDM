import {
    AttributeResolutionDirectiveSet,
    CdmDocumentDefinition,
    CdmObject,
    CdmObjectBase,
    SymbolSet
} from '../internal';

export class resolveOptions {
    public wrtDoc?: CdmDocumentDefinition; // the document to use as a point of reference when resolving relative paths and symbol names.
    public directives?: AttributeResolutionDirectiveSet; // a set of string flags that direct how attribute resolving traits behave

    /**
     * @internal
     */
    public relationshipDepth?: number; // tracks the number of entity attributes that have been traversed

    /**
     * @internal
     * when collecting resolved traits or attributes. prevents run away loops.
     * when references get copied, use previous resolution results if available (for use with copy method)
     */
    public saveResolutionsOnCopy?: boolean;

    /**
     * @internal
     * set of set of symbol that the current chain of resolution depends upon.
     * used with importPriority to find what docs and versions of symbols to use
     */
    public symbolRefSet?: SymbolSet;

    /**
     * @internal
     * forces symbolic references to be re-written to precicely located from the wrtDoc 
     */
    public localizeReferencesFor?: CdmDocumentDefinition;

    /**
     * @internal
     * document currently being indexed
     */
    public indexingDoc?: CdmDocumentDefinition;

    /**
     * @internal
     */
    public fromMoniker?: string; // moniker that was found on the ref

    public constructor(parameter?: CdmDocumentDefinition | CdmObject) {
        if (!parameter) {
            return;
        }

        if (parameter instanceof CdmDocumentDefinition) {
            this.wrtDoc = parameter;
        } else if (parameter instanceof CdmObjectBase) {
            if (parameter && parameter.owner) {
                this.wrtDoc = parameter.owner.inDocument;
            }
        }
        const directivesSet: Set<string> = new Set<string>();
        directivesSet.add('normalized');
        directivesSet.add('referenceOnly');
        this.directives = new AttributeResolutionDirectiveSet(directivesSet);
        this.symbolRefSet = new SymbolSet();
    }
}
