// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmAttributeContext,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmObject,
    CdmObjectBase,
    DepthInfo,
    importsLoadStrategy,
    SymbolSet
} from '../internal';

export class resolveOptions {
    public wrtDoc?: CdmDocumentDefinition; // the document to use as a point of reference when resolving relative paths and symbol names.
    public directives?: AttributeResolutionDirectiveSet; // a set of string flags that direct how attribute resolving traits behave
    public shallowValidation?: boolean; // when enabled, errors regarding references that are unable to be resolved or loaded are logged as warnings instead
    public importsLoadStrategy: importsLoadStrategy = importsLoadStrategy.lazyLoad; // defines at which point the Object Model will try to load the imported documents.
    public resolvedAttributeLimit?: number = 4000; // the limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail
    public maxOrdinalForArrayExpansion: number = 20; // the maximum value for the end ordinal in an ArrayExpansion operation
    public maxDepth: number = 2; // the maximum depth that entity attributes will be resolved before giving up

    /**
     * @internal
     * Contains information about the depth that we are resolving at
     */
    public depthInfo: DepthInfo;

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

    /**
     * @internal
     */
    public mapOldCtxToNewCtx?: Map<CdmAttributeContext, CdmAttributeContext>; // moniker that was found on the ref

    /**
     * @internal
     */
    public currentlyResolvingEntities: Set<CdmEntityDefinition>; // moniker that was found on the ref

    /**
     * Indicates if resolution guidance was used at any point during resolution
     * @internal
     */
    public usedResolutionGuidance: boolean = false;

    /**
     * @deprecated please use importsLoadStrategy instead.
     * when enabled, all the imports will be loaded and the references checked otherwise will be delayed until the symbols are required.
     */
    public get strictValidation(): boolean | undefined {
        if (this.importsLoadStrategy === importsLoadStrategy.lazyLoad) {
            return undefined;
        }

        return this.importsLoadStrategy === importsLoadStrategy.load;
    }

    /**
     * @deprecated please use importsLoadStrategy instead.
     * when enabled, all the imports will be loaded and the references checked otherwise will be delayed until the symbols are required.
     */
    public set strictValidation(strictValidation: boolean | undefined) {
        if (strictValidation === undefined) {
            this.importsLoadStrategy = importsLoadStrategy.lazyLoad;
        } else if (strictValidation) {
            this.importsLoadStrategy = importsLoadStrategy.load;
        } else {
            this.importsLoadStrategy = importsLoadStrategy.doNotLoad;
        }
    }

    /**
     * @internal
     * Indicates whether we are resolving inside of a circular reference, resolution is different in that case
     */
    public inCircularReference: boolean;

    public constructor(parameter?: CdmDocumentDefinition | CdmObject, directives?: AttributeResolutionDirectiveSet) {
        this.symbolRefSet = new SymbolSet();
        this.depthInfo = new DepthInfo();
        this.inCircularReference = false;
        this.currentlyResolvingEntities = new Set();

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

    /**
     * @internal
     * Creates a copy of the resolve options object
     */
    public copy(): resolveOptions {
        const resOptCopy: resolveOptions = new resolveOptions();
        resOptCopy.wrtDoc = this.wrtDoc;
        if (this.depthInfo) {
            resOptCopy.depthInfo = this.depthInfo.copy();
        }
        if (this.directives) {
            resOptCopy.directives = this.directives.copy();
        }
        resOptCopy.depthInfo = this.depthInfo.copy();
        resOptCopy.inCircularReference = this.inCircularReference;
        resOptCopy.localizeReferencesFor = this.localizeReferencesFor;
        resOptCopy.indexingDoc = this.indexingDoc;
        resOptCopy.shallowValidation = this.shallowValidation;
        resOptCopy.resolvedAttributeLimit = this.resolvedAttributeLimit;
        resOptCopy.mapOldCtxToNewCtx = this.mapOldCtxToNewCtx; // ok to share this map
        resOptCopy.importsLoadStrategy = this.importsLoadStrategy;
        resOptCopy.saveResolutionsOnCopy = this.saveResolutionsOnCopy;
        resOptCopy.currentlyResolvingEntities = new Set(this.currentlyResolvingEntities);
        resOptCopy.usedResolutionGuidance = this.usedResolutionGuidance;

        return resOptCopy;
    }
}
