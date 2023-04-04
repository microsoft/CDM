// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmConstants,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    cdmLogCode,
    CdmManifestDefinition,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    cdmStatusLevel,
    CdmTypeAttributeDefinition,
    resolveOptions,
    traitProfile,
    traitProfileCache
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';

describe('Cdm/Resolution/TraitProfile', () => {
    const testsSubPath: string = 'Cdm/Resolution/TraitProfileTest';
    const schemaDocsPath: string = testHelper.schemaDocumentsPath;

    const fixProfiles = (key: string,value)=> {
        if (key==='trId') {
            return undefined;
        } else {
            if(value instanceof Map) {
                let obj: object = {};
                (value as Map<string, string | object>).forEach((v,k)=>{
                    obj[k] = v;
                });
                return obj;
            }
            return value;
        }
    }
    const dumpAndValidateProfiles = async (consolidate: boolean, shareCache: boolean)=>{

        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubPath, 'ConsCache');

        const srcManifest = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/miniContact.manifest.cdm.json');
        const resManifest = await srcManifest.createResolvedManifestAsync('_miniContact', '_{n}.cdm.json');

        let profileCache: traitProfileCache = undefined;
        if (shareCache) {
            profileCache = new traitProfileCache();
        }

        let allProfiles = '{';
        for (const locEntDec of resManifest.entities) {
            const entDef: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>(locEntDec.entityPath, resManifest);
            const resOpt: resolveOptions = new resolveOptions(entDef);
            let entTraitInfos = entDef.fetchTraitProfiles(resOpt, profileCache);
            if (consolidate) {
                entTraitInfos = traitProfile.consolidateList(entTraitInfos, profileCache);
            }
            let entProfileDump = JSON.stringify(entTraitInfos, fixProfiles);
            let attProfiles = "";

            for (const att of entDef.attributes) {
                let attTraitInfos = (att as CdmTypeAttributeDefinition).fetchTraitProfiles(resOpt, profileCache);
                if (consolidate) {
                    attTraitInfos = traitProfile.consolidateList(attTraitInfos);
                }
                let attProfileDump = JSON.stringify(attTraitInfos, fixProfiles);
                attProfiles += `${(attProfiles == '' ? '' : ',')}\"${(att as CdmTypeAttributeDefinition).name}\":${attProfileDump}`;
            }

            allProfiles += `${(allProfiles == '{' ? '' : ',')}\"${entDef.entityName}\":{\"entityProfile\":${entProfileDump}, \"attProfiles\":{${attProfiles}}}`;
        }
        allProfiles += '}';

        const outName = `ProfileDump${(consolidate? 'Cons':'')}${(shareCache ? 'Cache' : '')}.json`;
        testHelper.writeActualOutputFileContent(testsSubPath, 'ConsCache', outName, allProfiles);

        const refProfiles = testHelper.getExpectedOutputFileContent(testsSubPath, 'ConsCache', outName);
        testHelper.assertSameObjectWasSerialized(allProfiles, refProfiles);
    }


    /**
     * get profiles for entities and attributes of entities in manifest.
     * leave profiles in 'deep' form
     * no shared cache
     **/
    it ('originalProfileNoCache', async ()=> {
        await dumpAndValidateProfiles(false, false);
    });

    /**
     * get profiles for entities and attributes of entities in manifest.
     * leave profiles in 'deep' form
     * use a shared cache of profile objects for all
     **/
    it ('consolidatedProfileNoCache', async ()=> {
        await dumpAndValidateProfiles(true, false);
    });
    /**
     * get profiles for entities and attributes of entities in manifest.
     * consolidate the profiles
     * no shared cache
     **/
    it ('originalProfileSharedCache', async ()=> {
        await dumpAndValidateProfiles(false, true);
    });
    /**
     * get profiles for entities and attributes of entities in manifest.
     * consolidate the profiles
     * use a shared cache of profile objects for all
     **/
    it ('consolidatedProfileSharedCache', async ()=> {
        await dumpAndValidateProfiles(true, true);
    });

});
