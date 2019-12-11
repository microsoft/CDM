export enum cdmValidationStep {
    start,
    imports,
    integrity,
    declarations,
    references,
    parameters,
    traitAppliers,
    minimumForResolving,
    traits,
    attributes,
    entityReferences,
    finished,
    error
}
