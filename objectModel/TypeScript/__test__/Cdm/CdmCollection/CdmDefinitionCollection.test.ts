import { cdmObjectType } from '../../../Enums/cdmObjectType';
import {
    CdmAttributeContext,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmTraitDefinition
} from '../../../internal';
import {generateManifest} from './CdmCollectionHelperFunctions';

describe('Cdm.CdmCollection.CdmDefinitionCollection', () => {
    it ('TestCdmDefinitionCollectionAdd', () => {
        const document: CdmManifestDefinition = generateManifest('c:\\Nothing');
        document.isDirty = false;

        const attribute: CdmAttributeContext = new CdmAttributeContext(document.ctx, 'the attribute');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(document.ctx, 'The folder');
        const trait: CdmTraitDefinition = new CdmTraitDefinition(document.ctx, 'the Trait');

        const addedAttribute: CdmObjectDefinition = document.definitions.push(attribute);
        const addedfolder: CdmObjectDefinition = document.definitions.push(folder);
        const addedTrait: CdmObjectDefinition = document.definitions.push(trait);

        expect(document.isDirty)
            .toBeTruthy();
        expect(document.definitions.length)
            .toEqual(3);
        expect(addedAttribute)
            .toEqual(attribute);
        expect(addedfolder)
            .toEqual(folder);
        expect(addedTrait)
            .toEqual(trait);
        expect(document.definitions.allItems[0])
            .toEqual(attribute);
        expect(document.definitions.allItems[1])
            .toEqual(folder);
        expect(document.definitions.allItems[2])
            .toEqual(trait);
        expect(attribute.inDocument)
            .toEqual(document);
        expect(trait.inDocument)
            .toEqual(document);
        expect(attribute.owner)
            .toEqual(document);
        expect(folder.owner)
            .toEqual(document);
        expect(trait.owner)
            .toEqual(document);
    });

    it ('TestCdmDefinitionCollectionInsert', () => {
        const document: CdmManifestDefinition = generateManifest('C:\\Nothing');

        const ent1: CdmObjectDefinition = document.definitions.push('ent1');
        const ent2: CdmObjectDefinition = document.definitions.push('ent2');

        document.isDirty = false;

        const attribute: CdmAttributeContext = new CdmAttributeContext(document.ctx, 'the attribute');

        document.definitions.insert(0, attribute);

        expect(document.definitions.length)
            .toEqual(3);
        expect(document.isDirty)
            .toEqual(true);
        expect(document.definitions.allItems[0])
            .toEqual(attribute);
        expect(attribute.inDocument)
            .toEqual(document);
        expect(attribute.owner)
            .toEqual(document);
        expect(document.definitions.allItems[1])
            .toEqual(ent1);
        expect(document.definitions.allItems[2])
            .toEqual(ent2);
    });

    it ('TestCdmDefinitionCollectionAddEntityByProvidingName', () => {
        const document: CdmManifestDefinition = generateManifest('C:\\Noting');
        document.isDirty = false;

        const entity: CdmObjectDefinition = document.definitions.push('TheNameOfTheEntity');
        expect(document.isDirty)
            .toBeTruthy();
        expect(document.definitions.allItems[0])
            .toEqual(entity);
        expect((entity as undefined as CdmObjectBase).inDocument)
            .toEqual(document);
        expect(entity.owner)
            .toEqual(document);
        expect((entity as CdmEntityDefinition).entityName)
            .toEqual('TheNameOfTheEntity');
    });

    it ('TestCdmDefinitionCollectionAddByProvidingTypeAndName', () => {
        const document: CdmManifestDefinition = generateManifest('C:\\Nothing');
        document.isDirty = false;

        const attribute: CdmObjectDefinition = document.definitions.push(cdmObjectType.attributeContextDef, 'attrctx');
        const trait: CdmObjectDefinition = document.definitions.push(cdmObjectType.traitDef, 'traitname');

        expect(document.isDirty)
            .toEqual(true);
        expect(document.definitions.allItems[0])
            .toEqual(attribute);
        expect(document.definitions.allItems[1])
            .toEqual(trait);
        expect((attribute as undefined as CdmObjectBase).inDocument)
            .toEqual(document);
        expect(attribute.owner)
            .toEqual(document);
        expect((trait as undefined as CdmObjectBase).inDocument)
            .toEqual(document);
    });

    it ('TestCdmDefinitionCollectionAddRange', () => {
        const document : CdmManifestDefinition = generateManifest('C:\\Nothing');
        document.isDirty = false;

        const attribute: CdmAttributeContext = new CdmAttributeContext(document.ctx, 'the attribute');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(document.ctx, 'The folder');
        const trait: CdmTraitDefinition = new CdmTraitDefinition(document.ctx, 'the Trait');

        const definitionsList: CdmObjectDefinition[] = [
            attribute,
            folder,
            trait
        ];

        document.definitions.concat(definitionsList);

        expect(document.isDirty)
            .toEqual(true);
        expect(document.definitions.length)
            .toEqual(3);
        expect(document.definitions.allItems[0])
            .toEqual(attribute);
        expect(document.definitions.allItems[1])
            .toEqual(folder);
        expect(document.definitions.allItems[2])
            .toEqual(trait);
        expect(attribute.inDocument)
            .toEqual(document);
        expect(trait.inDocument)
            .toEqual(document);
        expect(attribute.owner)
            .toEqual(document);
        expect(folder.owner)
            .toEqual(document);
        expect(trait.owner)
            .toEqual(document);
    });
});
