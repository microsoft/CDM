// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
    public shallowValidation?: boolean; // when enabled, errors regarding references that are unable to be resolved or loaded are logged as warnings instead
    public strictValidation: boolean = true; // when enabled, all the imports will be loaded and the references checked otherwise will be delayed until the symbols are required.
    public resolvedAttributeLimit?: number = 4000; // the limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail 

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
     * forces symbolic references to be re-written to be the precisely located reference based on the wrtDoc 
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

    public constructor(parameter?: CdmDocumentDefinition | CdmObject, directives?: AttributeResolutionDirectiveSet) {
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

        // provided or default to 'avoid one to many relationship nesting and to use foreign keys for many to one refs'.
        // this is for back compat with behavior before the corpus has a default directive property
        if (directives) {
            this.directives = directives.copy();
        } else {
            const directivesSet: Set<string> = new Set<string>();
            directivesSet.add('normalized');
            directivesSet.add('referenceOnly');
            this.directives = new AttributeResolutionDirectiveSet(directivesSet);
        }
        this.symbolRefSet = new SymbolSet();
    }

    /**
     * @internal
     */
    public checkAttributeCount(amount: number): boolean {
        if (this.resolvedAttributeLimit !== undefined) {
            if (amount > this.resolvedAttributeLimit) {
                return false;
            }
        }

        return true;
    }
}
