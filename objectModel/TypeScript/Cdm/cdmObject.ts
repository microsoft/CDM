// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObjectDefinition,
    CdmObjectReference,
    cdmObjectType,
    copyOptions,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    VisitCallback
} from '../internal';
import { CdmJsonType } from '../Persistence/CdmFolder/types';

export interface CdmObject {
    /**
     * the object id.
     */
    ID: number;

    /**
     * the object context.
     */
    ctx: CdmCorpusContext;

    /**
     * the declaration document of the object.
     */
    inDocument: CdmDocumentDefinition;

    /**
     * the object type.
     */
    objectType: cdmObjectType;

    /**
     * the object that owns or contains this object
     */
    owner: CdmObject;

    /**
     * the current corpus path of the object, if know
     */
    atCorpusPath: string;

    /**
     * returns the resolved object reference.
     */
    fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt?: resolveOptions): T;

    /**
     * Returns true if the object (or the referenced object) is an extension in some way from the specified symbol name
     */
    isDerivedFrom(baseDef: string, resOpt?: resolveOptions): boolean;

    /**
     * Runs the preChildren and postChildren input functions with this object as input, also calls recursively on any objects this one contains.
     */
    visit(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

    /**
     * Validates that the object is configured properly.
     */
    validate(): boolean;

    /**
     * @deprecated
     */
    getObjectType(): cdmObjectType;

    /**
     * Returns the name of the object if this is a defintion or the name of the referenced object if this is an object reference.
     */
    fetchObjectDefinitionName(): string;

    /**
     * @deprecated
     */
    copyData(resOpt?: resolveOptions, options?: copyOptions): CdmJsonType;

    /**
     * @deprecated
     */
    fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet;

    /**
     * @deprecated
     */
    fetchResolvedAttributes(resOpt?: resolveOptions, acpInContext?: AttributeContextParameters): ResolvedAttributeSet;

    /**
     * @param resOpt The resolve options
     * @param host For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.
     */
    copy(resOpt: resolveOptions, host?: CdmObject): CdmObject;

    /**
     * Takes an object definition and returns the object reference that points to the definition.
     * @resOpt For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.
     */
    createSimpleReference(resOpt?: resolveOptions): CdmObjectReference;
}
