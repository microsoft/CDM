import { TypeAttribute } from '.';

export abstract class AttributeResolutionGuidance {
   /**
    * If true, this attribute definiton will be removed from the final resolved attribute list of an entity.
    */
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
    * The supplied attribute definition will be added to the Entity after this
    * attribute definition with a trait indicating its supporting role on this.
    */
   public addSupportingAttribute?: TypeAttribute;
   /**
    * If 'one' then there is a single instance of the attribute or entity used.
    * 'many' indicates multiple instances and the 'expansion' properties will describe array enumeration to use when needed.
    */
   public cardinality?: string;
   /**
    * format specifier for generated attribute names. May contain a single occurence of ('{a} or 'A'), ('{m}' or '{M}') and '{o}'
    * for the base (a/A)ttribute name, any (m/M)ember attributes from entities and array (o)rdinal. examples: '{a}{o}.{m}' could produce
    * 'address2.city', '{a}{o}' gives 'city1'. Using '{A}' or '{M}' will uppercase the first letter of the name portions.
    */
   public renameFormat?: string;
   /**
    * Parameters that control array expansion if inline repeating of attributes is needed.
    */
   public expansion?: {
      startingOrdinal?: number;
      /**
       * the greatest number of time that the attribute pattern should be repeated.
       */
      maximumExpansion?: number;
      /**
       * The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data.
       */
      countAttribute?: TypeAttribute;
   };
   /**
    * Parameters that control the use of foreign keys to reference entity instances instead of imbedding the entity in a nested way
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
       * After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be imposed
       */
      referenceOnlyAfterDepth?: number;
      /**
       * The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity..
       */
      foreignKeyAttribute?: TypeAttribute;
   };
   /**
    * used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an entity.
    * If the 'structured' directive is set, this trait causes resolved attributes to end up in groups rather than a flattend list
    */
   public selectsSubAttribute?: {
      /**
       * used to indicate either 'one' or 'all' sub-attributes selected.
       */
      selects?: string;
      /**
       * The supplied attribute definition will be added to the Entity to hold a description of the single attribute
       * that was selected from the sub-entity when selects is 'one'
       */
      selectedTypeAttribute?: TypeAttribute;
      selectsSomeTakeNames?: string[];
      selectsSomeAvoidNames?: string[];
   };
}
