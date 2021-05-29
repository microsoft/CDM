// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObject,
    cdmObjectSimple,
    cdmObjectType,
    CdmTypeAttributeDefinition,
    resolveOptions,
    VisitCallback
} from '../internal';

/**
 * @deprecated 
 * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
 */
export class CdmAttributeResolutionGuidance extends cdmObjectSimple implements CdmAttributeResolutionGuidance {
    public removeAttribute?: boolean;
    /**
     * A list of strings, one for each 'directive' that should be always imposed at this attribute definition
     */
    public imposedDirectives?: string[];
    /**
     * A list of strings, one for each 'directive' that should be removed if previously imposed
     */
    public removedDirectives?: string[];
    /**
     * The supplied attribute definition will be added to the Entity after this attribute definition with a trait indicating its supporting role on this.
     */
    public addSupportingAttribute?: CdmTypeAttributeDefinition;
    /**
     * If 'one' then there is a single instance of the attribute or entity used. 'many' indicates multiple instances and the 'expansion' properties will describe array enumeration to use when needed.
     */
    public cardinality?: string;
    /**
     * Format specifier for generated attribute names. May contain a single occurence of ('{a} or 'A'), ('{m}' or '{M}') and '{o}' for the base (a/A)ttribute name, any (m/M)ember attributes from entities and array (o)rdinal. examples: '{a}{o}.{m}' could produce 'address2.city', '{a}{o}' gives 'city1'. Using '{A}' or '{M}' will uppercase the first letter of the name portions.
     */
    public renameFormat?: string;
    public expansion?: {
        startingOrdinal?: number;
        /**
         * the greatest number of time that the attribute pattern should be repeated.
         */
        maximumExpansion?: number;
        /**
         * The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data.
         */
        countAttribute?: CdmTypeAttributeDefinition;
    };

    /**
     * Parameters that control the use of foreign keys to reference entity instances instead of imbedding the entity in a nested way.
     */
    public entityByReference?: {
        /**
         * explicitly, is a reference allowed?
         */
        allowReference?: boolean;
        /**
         * if true, a foreign key attribute will be added to the entity even when the entity attribute is imbedded in a nested way.
         */
        alwaysIncludeForeignKey?: boolean;
        /**
         * After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be imposed.
         */
        referenceOnlyAfterDepth?: number;
        /**
         * The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity.
         */
        foreignKeyAttribute?: CdmTypeAttributeDefinition;
    };

    /**
     * used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an entity. If the 'structured' directive is set, this trait causes resolved attributes to end up in groups rather than a flattend list.
     */
    public selectsSubAttribute?: {
        /**
         * used to indicate either 'one' or 'all' sub-attributes selected. 
         */
        selects?: string;
        /**
         * The supplied attribute definition will be added to the Entity to hold a description of the single attribute that was selected from the sub-entity when selects is 'one'
         */
        selectedTypeAttribute?: CdmTypeAttributeDefinition;
        selectsSomeTakeNames?: string[];
        selectsSomeAvoidNames?: string[];
    };

    public static get objectType(): cdmObjectType {
        return cdmObjectType.attributeResolutionGuidanceDef;
    }

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeResolutionGuidanceDef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.attributeResolutionGuidanceDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }
            let copy: CdmAttributeResolutionGuidance;
            if (!host) {
                copy = new CdmAttributeResolutionGuidance(this.ctx);
            } else {
                copy = host as CdmAttributeResolutionGuidance;
                copy.ctx = this.ctx;
                // clear any values that may hvae been in host
                copy.expansion = undefined;
                copy.entityByReference = undefined;
                copy.selectsSubAttribute = undefined;
            }

            copy.removeAttribute = this.removeAttribute;
            if (this.imposedDirectives) {
                copy.imposedDirectives = this.imposedDirectives.slice();
            }
            if (this.removedDirectives) {
                copy.removedDirectives = this.removedDirectives.slice();
            }
            copy.addSupportingAttribute = this.addSupportingAttribute;
            copy.cardinality = this.cardinality;
            copy.renameFormat = this.renameFormat;

            if (this.expansion) {
                copy.expansion = {};
                copy.expansion.startingOrdinal = this.expansion.startingOrdinal;
                copy.expansion.maximumExpansion = this.expansion.maximumExpansion;
                copy.expansion.countAttribute = this.expansion.countAttribute;
            }
            if (this.entityByReference) {
                copy.entityByReference = {};
                copy.entityByReference.alwaysIncludeForeignKey = this.entityByReference.alwaysIncludeForeignKey;
                copy.entityByReference.referenceOnlyAfterDepth = this.entityByReference.referenceOnlyAfterDepth;
                copy.entityByReference.foreignKeyAttribute = this.entityByReference.foreignKeyAttribute;
                copy.entityByReference.allowReference = this.entityByReference.allowReference;
            }
            if (this.selectsSubAttribute) {
                copy.selectsSubAttribute = {};
                copy.selectsSubAttribute.selects = this.selectsSubAttribute.selects;
                copy.selectsSubAttribute.selectedTypeAttribute = this.selectsSubAttribute.selectedTypeAttribute;
                copy.selectsSubAttribute.selectsSomeTakeNames = this.selectsSubAttribute.selectsSomeTakeNames;
                copy.selectsSubAttribute.selectsSomeAvoidNames = this.selectsSubAttribute.selectsSomeAvoidNames;
            }

            return copy;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public updateAttributeDefaults(attName: string, owner: CdmObject): void {
        // handle the cardinality and expansion group.
        // default is one, but if there is some hint of an array, make it work
        if (this.cardinality === undefined) {
            if (this.expansion !== undefined) {
                this.cardinality = 'many';
            } else {
                this.cardinality = 'one';
            }
        }
        if (this.cardinality === 'many' && this.expansion === undefined) {
            this.expansion = {};
        }
        if (this.cardinality === 'many' && this.expansion !== undefined) {
            if (this.expansion.startingOrdinal === undefined) {
                this.expansion.startingOrdinal = 0;
            }
            if (this.expansion.maximumExpansion === undefined) {
                this.expansion.maximumExpansion = 5;
            }
            if (this.expansion.countAttribute === undefined) {
                this.expansion.countAttribute = this.ctx.corpus.fetchArtifactAttribute('count');
                this.expansion.countAttribute.owner = owner;
                this.expansion.countAttribute.inDocument = owner.inDocument;
            }
        }
        // entity by ref. anything mentioned?
        if (this.entityByReference) {
            if (this.entityByReference.allowReference === undefined) {
                this.entityByReference.allowReference = true;
            }
            if (this.entityByReference.allowReference) {
                if (this.entityByReference.alwaysIncludeForeignKey === undefined) {
                    this.entityByReference.alwaysIncludeForeignKey = false;
                }
                if (this.entityByReference.foreignKeyAttribute === undefined) {
                    // make up a fk
                    this.entityByReference.foreignKeyAttribute = this.ctx.corpus.fetchArtifactAttribute('id');
                    this.entityByReference.foreignKeyAttribute.owner = owner;
                    this.entityByReference.foreignKeyAttribute.inDocument = owner.inDocument;
                }
            }
        }
        // selects one>
        if (this.selectsSubAttribute) {
            if (this.selectsSubAttribute.selects === undefined) {
                this.selectsSubAttribute.selects = 'one';
            }
            if (this.selectsSubAttribute.selects === 'one') {
                if (this.selectsSubAttribute.selectedTypeAttribute === undefined) {
                    // make up a type indicator
                    this.selectsSubAttribute.selectedTypeAttribute = this.ctx.corpus.fetchArtifactAttribute('type');
                    this.selectsSubAttribute.selectedTypeAttribute.owner = owner;
                    this.selectsSubAttribute.selectedTypeAttribute.inDocument = owner.inDocument;
                }
            }
        }

        // only set a rename format if one is needed for arrays or added atts
        if (this.renameFormat === undefined) {
            if (attName === undefined) { // a type attribute, so no nesting
                if (this.cardinality === 'many') {
                    this.renameFormat = '{a}{o}';
                }
            } else {
                if (this.cardinality === 'many') {
                    this.renameFormat = '{a}{o}{M}';
                } else {
                    this.renameFormat = '{a}{M}';
                }
            }
        }

        if (this.renameFormat !== undefined) {
            // rename format is a lie. actually only supports sub-attribute name and ordinal as 'a' and 'o'
            if (attName !== undefined) {
                // replace the use of {a or A} with the outer attributeName
                let upper: boolean = false;
                let iA: number = this.renameFormat.indexOf('{a}');
                if (iA < 0) {
                    iA = this.renameFormat.indexOf('{A}');
                    upper = true;
                }
                if (iA >= 0) {
                    if (upper) {
                        attName = attName.charAt(0).toUpperCase() + attName.slice(1);
                    }
                    this.renameFormat = this.renameFormat.slice(0, iA) + attName + this.renameFormat.slice(iA + 3);
                }
                // now, use of {m/M} should be turned to {a/A}
                let iM = this.renameFormat.indexOf('{m}');
                if (iM >= 0) {
                    this.renameFormat = this.renameFormat.slice(0, iM) + '{a}' + this.renameFormat.slice(iM + 3);
                } else {
                    iM = this.renameFormat.indexOf('{M}');
                    if (iM >= 0) {
                        this.renameFormat = this.renameFormat.slice(0, iM) + '{A}' + this.renameFormat.slice(iM + 3);
                    }
                }
            }
        }
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            return true;
        }
        // return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (preChildren && preChildren(this, pathFrom)) {
                return false;
            }
            if (this.addSupportingAttribute) {
                if (this.addSupportingAttribute.visit(`${pathFrom}addSupportingAttribute/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.expansion && this.expansion.countAttribute) {
                if (this.expansion.countAttribute.visit(`${pathFrom}countAttribute/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.entityByReference && this.entityByReference.foreignKeyAttribute) {
                if (this.entityByReference.foreignKeyAttribute.visit(`${pathFrom}foreignKeyAttribute/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.selectsSubAttribute && this.selectsSubAttribute.selectedTypeAttribute) {
                if (this.selectsSubAttribute.selectedTypeAttribute.visit(`${pathFrom}selectedTypeAttribute/`, preChildren, postChildren)) {
                    return true;
                }
            }

            if (postChildren && postChildren(this, pathFrom)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public combineResolutionGuidance(addIn: CdmAttributeResolutionGuidance): CdmAttributeResolutionGuidance {
        const startWith: CdmAttributeResolutionGuidance = this;
        if (!addIn) {
            return startWith;
        }
        if (!startWith) {
            return addIn;
        }

        const result: CdmAttributeResolutionGuidance = new CdmAttributeResolutionGuidance(this.ctx);

        // can remove and then un-remove later
        if (startWith.removeAttribute === true) {
            if (addIn.removeAttribute === undefined || addIn.removeAttribute === true) {
                result.removeAttribute = true;
            }
        } else {
            if (addIn.removeAttribute !== undefined && addIn.removeAttribute === true) {
                result.removeAttribute = true;
            }
        }

        // copy and combine if needed
        if (addIn.imposedDirectives) {
            if (startWith.imposedDirectives) {
                result.imposedDirectives = startWith.imposedDirectives.slice();
            } else {
                result.imposedDirectives = [];
            }
            result.imposedDirectives.concat(addIn.imposedDirectives);
        } else {
            result.imposedDirectives = startWith.imposedDirectives;
        }

        if (addIn.removedDirectives) {
            if (startWith.removedDirectives) {
                result.removedDirectives = startWith.removedDirectives.slice();
            } else {
                result.removedDirectives = [];
            }
            result.removedDirectives.concat(addIn.removedDirectives);
        } else {
            result.removedDirectives = startWith.removedDirectives;
        }

        result.addSupportingAttribute = startWith.addSupportingAttribute;
        if (addIn.addSupportingAttribute) {
            result.addSupportingAttribute = addIn.addSupportingAttribute;
        }

        result.cardinality = startWith.cardinality;
        if (addIn.cardinality) {
            result.cardinality = addIn.cardinality;
        }

        result.renameFormat = startWith.renameFormat;
        if (addIn.renameFormat) {
            result.renameFormat = addIn.renameFormat;
        }

        // for these sub objects, ok to just use the same objects unless something is combined. assumption is that these are static during the resolution
        if (addIn.expansion) {
            if (startWith.expansion) {
                result.expansion = {};
                result.expansion.startingOrdinal = startWith.expansion.startingOrdinal;
                if (addIn.expansion.startingOrdinal !== undefined) {
                    result.expansion.startingOrdinal = addIn.expansion.startingOrdinal;
                }
                result.expansion.maximumExpansion = startWith.expansion.maximumExpansion;
                if (addIn.expansion.maximumExpansion !== undefined) {
                    result.expansion.maximumExpansion = addIn.expansion.maximumExpansion;
                }
                result.expansion.countAttribute = startWith.expansion.countAttribute;
                if (addIn.expansion.countAttribute !== undefined) {
                    result.expansion.countAttribute = addIn.expansion.countAttribute;
                }
            } else {
                result.expansion = addIn.expansion;
            }
        } else {
            result.expansion = startWith.expansion;
        }

        if (addIn.entityByReference) {
            if (startWith.entityByReference) {
                result.entityByReference = {};
                result.entityByReference.alwaysIncludeForeignKey = startWith.entityByReference.alwaysIncludeForeignKey;
                if (addIn.entityByReference.alwaysIncludeForeignKey !== undefined) {
                    result.entityByReference.alwaysIncludeForeignKey = addIn.entityByReference.alwaysIncludeForeignKey;
                }
                result.entityByReference.referenceOnlyAfterDepth = startWith.entityByReference.referenceOnlyAfterDepth;
                if (addIn.entityByReference.referenceOnlyAfterDepth !== undefined) {
                    result.entityByReference.referenceOnlyAfterDepth = addIn.entityByReference.referenceOnlyAfterDepth;
                }
                result.entityByReference.foreignKeyAttribute = startWith.entityByReference.foreignKeyAttribute;
                if (addIn.entityByReference.foreignKeyAttribute !== undefined) {
                    result.entityByReference.foreignKeyAttribute = addIn.entityByReference.foreignKeyAttribute;
                }
                result.entityByReference.allowReference = startWith.entityByReference.allowReference;
                if (addIn.entityByReference.allowReference !== undefined) {
                    result.entityByReference.allowReference = addIn.entityByReference.allowReference;
                }

            } else {
                result.entityByReference = addIn.entityByReference;
            }
        } else {
            result.entityByReference = startWith.entityByReference;
        }

        if (addIn.selectsSubAttribute) {
            if (startWith.selectsSubAttribute) {
                result.selectsSubAttribute = {};
                result.selectsSubAttribute.selectedTypeAttribute = startWith.selectsSubAttribute.selectedTypeAttribute;
                if (addIn.selectsSubAttribute.selectedTypeAttribute !== undefined) {
                    result.selectsSubAttribute.selectedTypeAttribute = addIn.selectsSubAttribute.selectedTypeAttribute;
                }
                result.selectsSubAttribute.selects = startWith.selectsSubAttribute.selects;
                if (addIn.selectsSubAttribute.selects !== undefined) {
                    result.selectsSubAttribute.selects = addIn.selectsSubAttribute.selects;
                }
                if (addIn.selectsSubAttribute.selectsSomeTakeNames) {
                    if (startWith.selectsSubAttribute.selectsSomeTakeNames) {
                        result.selectsSubAttribute.selectsSomeTakeNames = [...(startWith.selectsSubAttribute.selectsSomeTakeNames)];
                    }
                    else {
                        result.selectsSubAttribute.selectsSomeTakeNames = [];
                    }
                    result.selectsSubAttribute.selectsSomeTakeNames.concat(addIn.selectsSubAttribute.selectsSomeTakeNames);
                }
                if (addIn.selectsSubAttribute.selectsSomeAvoidNames) {
                    if (startWith.selectsSubAttribute.selectsSomeAvoidNames) {
                        result.selectsSubAttribute.selectsSomeAvoidNames = [...(startWith.selectsSubAttribute.selectsSomeAvoidNames)];
                    }
                    else {
                        result.selectsSubAttribute.selectsSomeAvoidNames = [];
                    }
                    result.selectsSubAttribute.selectsSomeAvoidNames.concat(addIn.selectsSubAttribute.selectsSomeAvoidNames);
                }
            } else {
                result.selectsSubAttribute = addIn.selectsSubAttribute;
            }
        } else {
            result.selectsSubAttribute = startWith.selectsSubAttribute;
        }

        return result;
    }

}
