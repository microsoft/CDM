// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isBoolean, isNumber, isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObjectDefinition,
    cdmObjectType
} from '../internal';

export class CdmDefinitionCollection extends CdmCollection<CdmObjectDefinition> {
    protected get owner(): CdmDocumentDefinition {
        return super.owner as CdmDocumentDefinition;
    }

    protected set owner(value: CdmDocumentDefinition) {
        super.owner = value;
    }

    constructor(ctx: CdmCorpusContext, owner: CdmDocumentDefinition) {
        super(ctx, owner, cdmObjectType.entityDef);
    }

    /**
     * Adds to the collection either an existing element, a newly created element, or all the elements of a list.
     * @param parameter Either the name of a CdmEntityDefinition
     * or a type of a new element to be created,
     * or a cdmObjectDefinition to be added to the collection
     * or a list of cdmObjectDefinitions to be added to the collection.
     * @param nameorSimpleRef Only used if the first parameter is the type of the object to be created.
     * It is the name of the object to be created in this case.
     * Should never be boolean.
     */
    public push(parameter: string | cdmObjectType | CdmObjectDefinition, nameorSimpleRef?: string | boolean)
        : CdmObjectDefinition {
        if (isNumber(parameter)) {
            const createdObject: CdmObjectDefinition =
                this.ctx.corpus.MakeObject<CdmObjectDefinition>(parameter, nameorSimpleRef as string);

            return super.push(createdObject);
        } else if (isString(parameter)) {
            return super.push(parameter, isBoolean(nameorSimpleRef) ? nameorSimpleRef : false);
        } else {
            return super.push(parameter);
        }
    }
}
