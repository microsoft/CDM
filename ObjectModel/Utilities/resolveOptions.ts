import { DocSetCollection, ICdmDocumentDef, TraitDirectiveSet } from '../internal';

export interface resolveOptions {
    wrtDoc?: ICdmDocumentDef; // the document to use as a point of reference when resolving relative paths and symbol names.
    directives?: TraitDirectiveSet; // a set of string flags that direct how attribute resolving traits behave
    relationshipDepth?: number; // tracks the number of entity attributes that have been traversed
                                // when collecting resolved traits or attributes. prevents run away loops
    saveResolutionsOnCopy?: boolean; // when references get copied, use previous resolution results if available (for use with copy method)
    documentRefSet?: DocSetCollection; // set of set of documents that the wrtDoc could depend on. use importPriority to find what is actually needed.
}
