import { cdmAttributeContextType, ICdmAttributeContext, ICdmObject } from '../internal';

// the description of a new attribute context into which a set of resolved attributes should be placed.
export interface AttributeContextParameters {
    under: ICdmAttributeContext;
    type: cdmAttributeContextType;
    name?: string;
    regarding?: ICdmObject;
    includeTraits?: boolean;
}
