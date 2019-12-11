import {
    CdmDocumentDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition
} from '../../../internal';
import {generateManifest} from './CdmCollectionHelperFunctions';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/CdmCollection/CdmDocumentCollection', () => {
    it ('TestDocumentCollectionAdd', () => {
        const manifest: CdmManifestDefinition = generateManifest('C:\Nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';
        const document: CdmDocumentDefinition = new CdmDocumentDefinition(manifest.ctx, 'documentName');

        expect(folder.documents.length)
            .toEqual(0);
        const addedDocument: CdmDocumentDefinition = folder.documents.push(document);
        expect(folder.documents.length)
            .toEqual(1);
        expect(folder.documents.allItems[0])
            .toEqual(document);
        expect(addedDocument)
            .toEqual(document);
        expect(document.folderPath)
            .toEqual('folderPath/');
        expect(document.namespace)
            .toEqual('namespace');
        expect(document.owner)
            .toEqual(folder);
        expect(document.needsIndexing)
            .toBeTruthy();
    });

    it ('TestDocumentCollectionInsert', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.inDocument = manifest;
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';
        const document: CdmDocumentDefinition = new CdmDocumentDefinition(manifest.ctx, 'DocumentName');

        const doc1: CdmDocumentDefinition = folder.documents.push('doc1');
        const doc2: CdmDocumentDefinition = folder.documents.push('doc2');

        manifest.isDirty = false;

        folder.documents.insert(2, document);
        expect(manifest.isDirty)
            .toEqual(true);
        expect(folder.documents.length)
            .toEqual(3);
        expect(folder.documents.allItems[0])
            .toEqual(doc1);
        expect(folder.documents.allItems[1])
            .toEqual(doc2);
        expect(folder.documents.allItems[2])
            .toEqual(document);

        expect(document.folderPath)
            .toEqual('folderPath/');
        expect(document.owner)
            .toEqual(folder);
        expect(document.namespace)
            .toEqual('namespace');
        expect(document.needsIndexing)
            .toEqual(true);
        expect(document.owner)
            .toEqual(folder);
        expect(folder.documentLookup.has(document.name))
            .toBeTruthy();
        expect(manifest.ctx.corpus.allDocuments[2][0])
            .toEqual(folder);
        expect(manifest.ctx.corpus.allDocuments[2][1])
            .toEqual(document);
    });

    it ('TestDocumentColectionAddWithDocumentName', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';

        expect(folder.documents.length)
            .toEqual(0);
        const document: CdmDocumentDefinition = folder.documents.push('documentName');
        expect(folder.documents.length)
            .toEqual(1);
        expect(document.name)
            .toEqual('documentName');
        expect(folder.documents.allItems[0])
            .toEqual(document);
        expect(document.folderPath)
            .toEqual('folderPath/');
        expect(document.owner)
            .toEqual(folder);
        expect(document.namespace)
            .toEqual('namespace');
        expect(document.needsIndexing)
            .toBeTruthy();
    });

    it ('TestDocumentCollectionAddRange', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';

        expect(folder.documents.length)
            .toEqual(0);

        const document: CdmDocumentDefinition = new CdmDocumentDefinition(manifest.ctx, 'documentName');
        const document2: CdmDocumentDefinition = new CdmDocumentDefinition(manifest.ctx, 'documentName2');

        const documentList: CdmDocumentDefinition[] = [document, document2];
        folder.documents.concat(documentList);

        expect(folder.documents.length)
            .toEqual(2);
        expect(folder.documents.allItems[0])
            .toEqual(document);
        expect(folder.documents.allItems[1])
            .toEqual(document2);
        expect(document.name)
            .toEqual('documentName');
        expect(document.folderPath)
            .toEqual(document.folderPath);
        expect(document.owner)
            .toEqual(folder);
        expect(document.namespace)
            .toEqual('namespace');
        expect(document.needsIndexing)
            .toBeTruthy();

        expect(document2.name)
            .toEqual('documentName2');
        expect(document2.folderPath)
            .toEqual('folderPath/');
        expect(document2.owner)
            .toEqual(folder);
        expect(document2.namespace)
            .toEqual('namespace');
        expect(document2.needsIndexing)
            .toBeTruthy();
    });

    it ('TestDocumentCollectionRemove', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';

        expect(folder.documents.length)
            .toEqual(0);

        const document: CdmDocumentDefinition = new CdmDocumentDefinition(manifest.ctx, 'documentName');
        const document2: CdmDocumentDefinition = new CdmDocumentDefinition(manifest.ctx, 'documentName2');

        const documentList: CdmDocumentDefinition[] = [document, document2];
        folder.documents.concat(documentList);

        expect(folder.documents.length)
            .toEqual(2);
        expect(folder.documents.allItems[0])
            .toEqual(document);
        expect(folder.documents.allItems[1])
            .toEqual(document2);

        let removed: boolean = folder.documents.remove(document);
        expect(removed)
            .toBeTruthy();
        expect(folder.documents.length)
            .toEqual(1);
        expect(folder.documents.allItems[0])
            .toEqual(document2);
        expect(document.owner)
            .toEqual(undefined);

        removed = folder.documents.remove(document);
        expect(removed)
            .toEqual(false);
        expect(folder.documents.length)
            .toEqual(1);
        expect(folder.documents.allItems[0])
            .toEqual(document2);

        folder.documents.push(document);
        expect(folder.documents.length)
            .toEqual(2);
        expect(document.owner)
            .toEqual(folder);
        removed = folder.documents.remove(document.name);
        expect(removed)
            .toBeTruthy();
        expect(folder.documents.length)
            .toEqual(1);
        expect(folder.documents.allItems[0])
            .toEqual(document2);
        expect(document.owner)
            .toEqual(undefined);
    });

    it ('TestDocumentCollectionRemoveAt', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';

        const document: CdmDocumentDefinition = folder.documents.push('documentName');
        const document2: CdmDocumentDefinition = folder.documents.push('documentName2');
        const document3: CdmDocumentDefinition = folder.documents.push('documentName3');

        expect(manifest.ctx.corpus.allDocuments.length)
            .toEqual(3);
        expect(manifest.ctx.corpus.allDocuments[0][0])
            .toEqual(folder);
        expect(manifest.ctx.corpus.allDocuments[0][1])
            .toEqual(document);
        expect(manifest.ctx.corpus.allDocuments[1][0])
            .toEqual(folder);
        expect(manifest.ctx.corpus.allDocuments[1][1])
            .toEqual(document2);
        expect(manifest.ctx.corpus.allDocuments[2][0])
            .toEqual(folder);
        expect(manifest.ctx.corpus.allDocuments[2][1])
            .toEqual(document3);

        expect(folder.documentLookup.size)
            .toEqual(3);
        expect(folder.documentLookup.has(document.name))
            .toBeTruthy();
        expect(folder.documentLookup.has(document2.name))
            .toBeTruthy();
        expect(folder.documentLookup.has(document3.name))
            .toBeTruthy();

        folder.documents.removeAt(1);
        folder.documents.remove('documentName');
        folder.documents.remove(document3);

        expect(manifest.ctx.corpus.allDocuments.length)
            .toEqual(0);

        expect(folder.documentLookup.keys.length)
            .toEqual(0);
        expect(folder.documentLookup.has(document.name))
            .toBeFalsy();
    });

    it ('TestDocumentCollectionClear', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const folder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'folder');
        folder.corpus = manifest.ctx.corpus;
        folder.folderPath = 'folderPath/';
        folder.namespace = 'namespace';

        const document: CdmDocumentDefinition = folder.documents.push('documentName');
        const document2: CdmDocumentDefinition = folder.documents.push('documentName2');
        const document3: CdmDocumentDefinition = folder.documents.push('documentName3');

        folder.documents.clear();

        expect(folder.documentLookup.size)
            .toEqual(0);
        expect(manifest.ctx.corpus.allDocuments.length)
            .toEqual(0);
        expect(folder.documents.length)
            .toEqual(0);
    });
});
