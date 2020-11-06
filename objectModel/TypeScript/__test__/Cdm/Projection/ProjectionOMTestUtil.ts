// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmOperationCombineAttributes,
    CdmOperationIncludeAttributes,
    CdmProjection,
    CdmPurposeReference,
    CdmTypeAttributeDefinition
} from '../../../internal';
import { LocalAdapter } from '../../../Storage/LocalAdapter';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { TypeAttributeParam } from './TypeAttributeParam';

/**
 * Utility class to help create object model based tests
 */
export class ProjectionOMTestUtil {

    private foundationJsonPath: string = 'cdm:/foundations.cdm.json';

    private localOutputStorageNS: string = 'output';

    private manifestName: string = 'default';

    public manifestDocName: string = `${this.manifestName}.manifest.cdm.json`;

    private allImportsName: string = '_allImports';

    private allImportsDocName: string = `${this.allImportsName}.cdm.json`;

    /**
     * The path between TestDataPath and this.testName.
     */
    private testsSubpath: string;

    /**
     * ClassName property
     */
    private _className: string;

    public get className(): string {
        return this._className;
    }

    public set className(value: string) {
        this._className = value
    }

    /**
     * TestName property
     */
    private _testName: string;

    public get testName(): string {
        return this._testName;
    }

    public set testName(value: string) {
        this._testName = value
    }

    /**
     * Corpus property
     */
    private _corpus: CdmCorpusDefinition;

    public get corpus(): CdmCorpusDefinition {
        return this._corpus;
    }

    public set corpus(value: CdmCorpusDefinition) {
        this._corpus = value
    }

    /**
     * Test Folder Input Path
     */
    private _inputPath: string;

    public get inputPath(): string {
        return this._inputPath;
    }

    public set inputPath(value: string) {
        this._inputPath = value
    }

    /**
     * Test Folder Expected Output Path
     */
    private _expectedOutputPath: string;

    public get expectedOutputPath(): string {
        return this._expectedOutputPath;
    }

    public set expectedOutputPath(value: string) {
        this._expectedOutputPath = value
    }

    /**
     * Test Folder Actual Output Path
     */
    private _actualOutputPath: string;

    public get actualOutputPath(): string {
        return this._actualOutputPath;
    }

    public set actualOutputPath(value: string) {
        this._actualOutputPath = value
    }

    /**
     * Local storage root folder definition
     */
    private _localStorageRoot: CdmFolderDefinition;

    public get localStorageRoot(): CdmFolderDefinition {
        return this._localStorageRoot;
    }

    public set localStorageRoot(value: CdmFolderDefinition) {
        this._localStorageRoot = value
    }

    /**
     * Default manifest definition
     */
    private _defaultManifest: CdmManifestDefinition;

    public get defaultManifest(): CdmManifestDefinition {
        return this._defaultManifest;
    }

    public set defaultManifest(value: CdmManifestDefinition) {
        this._defaultManifest = value
    }

    /**
     * All imports files
     */
    private _allImports: CdmDocumentDefinition;

    public get allImports(): CdmDocumentDefinition {
        return this._allImports;
    }

    public set allImports(value: CdmDocumentDefinition) {
        this._allImports = value
    }

    /**
     * Utility class constructor
     */
    public constructor(className: string, testName: string) {
        this.className = className;
        this.testName = testName;

        this.testsSubpath = `Cdm/Projection/${this.className}`;

        this.inputPath = testHelper.getInputFolderPath(this.testsSubpath, this.testName);
        this.expectedOutputPath = testHelper.getExpectedOutputFolderPath(this.testsSubpath, this.testName);
        this.actualOutputPath = testHelper.getActualOutputFolderPath(this.testsSubpath, this.testName);

        this.corpus = testHelper.getLocalCorpus(this.testsSubpath, this.testName);
        this.corpus.storage.mount(this.localOutputStorageNS, new LocalAdapter(this.actualOutputPath));
        this.corpus.storage.defaultNamespace = this.localOutputStorageNS;

        this.localStorageRoot = this.corpus.storage.fetchRootFolder(this.localOutputStorageNS);

        this.defaultManifest = this.createDefaultManifest();

        this.allImports = this.createAndInitializeAllImportsFile();
    }

    public Dispose(): void {
        this.corpus = null;
    }

    /**
     * Create a default manifest
     */
    public createDefaultManifest(): CdmManifestDefinition {
        const manifestDefault: CdmManifestDefinition = this.corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, this.manifestName);
        this.localStorageRoot.documents.push(manifestDefault, this.manifestDocName);

        return manifestDefault;
    }

    /**
     * Create and initialize _allImports file
     */
    public createAndInitializeAllImportsFile(): CdmDocumentDefinition {
        const allImportsDoc: CdmDocumentDefinition = new CdmDocumentDefinition(this.corpus.ctx, this.allImportsName);

        const allImportsDocDef: CdmDocumentDefinition = this.localStorageRoot.documents.push(allImportsDoc, this.allImportsDocName);
        allImportsDocDef.imports.push(this.foundationJsonPath);

        return allImportsDocDef;
    }

    /**
     * Create a simple entity called 'TestSource' with a single attribute
     */
    public CreateBasicEntity(entityName: string, attributesParams: TypeAttributeParam[]): CdmEntityDefinition {
        const entity: CdmEntityDefinition = this.corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);

        for (const attributesParam of attributesParams) {
            const attribute: CdmTypeAttributeDefinition = this.corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributesParam.attributeName, false);
            attribute.dataType = this.corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, attributesParam.attributeDataType, true);
            attribute.purpose = this.corpus.MakeRef<CdmPurposeReference>(cdmObjectType.purposeRef, attributesParam.attributePurpose, true);
            attribute.displayName = attributesParam.attributeName;

            entity.attributes.push(attribute);
        }

        const entityDoc: CdmDocumentDefinition = this.corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        entityDoc.imports.push(this.allImportsDocName);
        entityDoc.definitions.push(entity);

        this.localStorageRoot.documents.push(entityDoc, entityDoc.name);
        this.defaultManifest.entities.push(entity);
        this.allImports.imports.push(entity.inDocument.name);

        return entity;
    }

    /**
     * Function to valid the entity
     */
    public validateBasicEntity(entity: CdmEntityDefinition, entityName: string, attributesParams: TypeAttributeParam[]): void {
        // Assert.IsNotNull(entity, $'ValidateBasicEntity: ${entityName} failed!');
        // Assert.AreEqual(entity.Attributes.Count, attributesParams.Count, $'ValidateBasicEntity: Attribute count for ${entityName} failed!');
    }

    /**
     * Create a simple projection object
     */
    public createProjection(projectionSourceName: string): CdmProjection {
        const projection: CdmProjection = this.corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);
        projection.source = this.corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, projectionSourceName, true);

        return projection;
    }

    /**
     * Create an inline entity reference for a projection
     */
    public createProjectionInlineEntityReference(projection: CdmProjection): CdmEntityReference {
        const projectionInlineEntityRef: CdmEntityReference = this.corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, null);
        projectionInlineEntityRef.explicitReference = projection;

        return projectionInlineEntityRef;
    }

    /**
     * Create an Input Attribute Operation
     */
    public createOperationInputAttribute(projection: CdmProjection, includeAttributes: string[]): CdmOperationIncludeAttributes {
        // IncludeAttributes Operation
        const includeAttributesOp: CdmOperationIncludeAttributes = new CdmOperationIncludeAttributes(this.corpus.ctx)
        {
            includeAttributes = []
        };

        for (const includeAttribute of includeAttributes) {
            includeAttributesOp.includeAttributes.push(includeAttribute);
        }

        projection.operations.push(includeAttributesOp);

        return includeAttributesOp;
    }

    /**
     * Create a Combine Attribute Operation
     */
    public createOperationCombineAttributes(projection: CdmProjection, selectedAttributes: string[], mergeIntoAttribute: CdmTypeAttributeDefinition): CdmOperationCombineAttributes {
        // CombineAttributes Operation
        const combineAttributesOp: CdmOperationCombineAttributes = new CdmOperationCombineAttributes(this.corpus.ctx);
        combineAttributesOp.select = selectedAttributes;
        combineAttributesOp.mergeInto = mergeIntoAttribute;

        projection.operations.push(combineAttributesOp);

        return combineAttributesOp;
    }

    /**
     * Create a Type Attribute
     */
    public createTypeAttribute(attributeName: string, dataType: string, purpose: string): CdmTypeAttributeDefinition {
        const dataTypeRef: CdmDataTypeReference = this.corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, dataType, false);

        const purposeRef: CdmPurposeReference = this.corpus.MakeRef<CdmPurposeReference>(cdmObjectType.purposeRef, purpose, false);

        const attribute: CdmTypeAttributeDefinition = this.corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName, false);
        attribute.dataType = dataTypeRef;
        attribute.purpose = purposeRef;

        return attribute;
    }

    /**
     * Create an entity attribute
     */
    public createEntityAttribute(entityAttributeName: string, projectionSourceEntityRef: CdmEntityReference): CdmEntityAttributeDefinition {
        const entityAttribute: CdmEntityAttributeDefinition = this.corpus.MakeObject<CdmEntityAttributeDefinition>(cdmObjectType.entityAttributeDef, entityAttributeName, false);
        entityAttribute.entity = projectionSourceEntityRef;

        return entityAttribute;
    }

    public async getAndValidateResolvedEntity(entity: CdmEntityDefinition, resOpts: string[]): Promise<CdmEntityDefinition> {
        const resolvedEntity = await projectionTestUtils.getResolvedEntity(this.corpus, entity, resOpts);

        expect(resolvedEntity)
            .toBeDefined();

        return resolvedEntity;
    }
}
