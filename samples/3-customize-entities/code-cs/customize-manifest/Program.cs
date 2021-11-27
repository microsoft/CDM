﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace customize_manifest
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------
     * This sample demonstrates how an existing entity loaded from some public standards can be customized.
     * The steps are:
     *      1. Load a manifest from local file-system
     *      2. Create a new entity named 'MobileCareTeam' which extends from a standard entity called 'CareTeam', and add an attribute named 'currentCity'
     *      3. Resolve and flatten this new local abstract description of 'CareTeam' entity, then add this customized version of 'CareTeam' entity to the manifest
     *      4. Save the new documents
     * ----------------------------------------------------------------------------------------------------------------------------------------
     */

    class Program
    {
        static async Task Main(string[] args)
        {
            // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
            var cdmCorpus = new CdmCorpusDefinition();
            // set callback to receive error and warning logs.
            cdmCorpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    Console.WriteLine(message);
                }
            }, CdmStatusLevel.Warning);

            Console.WriteLine("Configure storage adapters");
            
            // Configure storage adapters to point at the target local manifest location and at the fake public standards
            string pathFromExeToExampleRoot = "../../../../../../";

            // Mount it as local adapter.
            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "3-customize-entities/sample-data"));
            cdmCorpus.Storage.DefaultNamespace = "local"; // local is our default. so any paths that start out navigating without a device tag will assume local

            // Mount it as the 'cdm' adapter, not the default so must use "cdm:/folder" to get there
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter(pathFromExeToExampleRoot + "example-public-standards"));

            // Example how to mount to the ADLS.
            // cdmCorpus.Storage.Mount("adls",
            //    new ADLSAdapter(
            // "<ACCOUNT-NAME>.dfs.core.windows.net", // Hostname.
            // "/<FILESYSTEM-NAME>", // Root.
            // "72f988bf-86f1-41af-91ab-2d7cd011db47",  // Tenant ID.
            // "<CLIENT-ID>",  // Client ID.
            // "<CLIENT-SECRET>" // Client secret.
            // ));

            // Open the default manifest at the root, used later when done
            // This method turns relative corpus paths into absolute ones in case we are in some sub-folders and don't know it
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json");

            Console.WriteLine("Define new extension");

            // First we will make a new document right in the same folder as the manifest
            var docAbs = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "MobileCareTeam.cdm.json");

            // Import the cdm description of the original so the symbols will resolve
            docAbs.Imports.Add("cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CareTeam.cdm.json", null);

            // We will make a new trait to identify things that are known to be temporary, used later
            // In theory this would be defined somewhere central so it can be shared
            var traitTemp = docAbs.Definitions.Add(CdmObjectType.TraitDef, "means.temporary") as CdmTraitDefinition;
            // Extends the standard 'means' base trait
            traitTemp.ExtendsTrait = cdmCorpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "means", true);
            // Add a parameter for the expected duration in days
            var param = cdmCorpus.MakeObject<CdmParameterDefinition>(CdmObjectType.ParameterDef, "estimatedDays");
            // By not using "true" on the last arg, this becomes an real reference object in the json. go look at the difference from "means" when this is done
            param.DataTypeRef = cdmCorpus.MakeObject<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "integer");
            param.DefaultValue = "30";
            traitTemp.Parameters.Add(param);

            // Make an entity definition and add it to the list of definitions in the document.
            CdmEntityDefinition entAbs = docAbs.Definitions.Add(CdmObjectType.EntityDef, "MobileCareTeam") as CdmEntityDefinition;
            // This entity extends the standard
            // This function with 'true' will make a simple reference to the base
            entAbs.ExtendsEntity = cdmCorpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, "CareTeam", true);
            
            // and we will add an attribute
            CdmTypeAttributeDefinition attNew = cdmCorpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "currentCity");
            // The attribute is a type is 'City" this is one of the predefined semantic types in meanings.cdm.json
            attNew.DataType = cdmCorpus.MakeObject<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "city", true);
            attNew.Description = "The current city where the mobile care team is working.";

            // also apply our fancy new 'temporary' trait. they stay in a city for 90 days on average
            CdmTraitReference tr = cdmCorpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "means.temporary");
            tr.Arguments.Add("estimatedDays", "90");
            attNew.AppliedTraits.Add(tr);

            // Add attribute to the entity
            entAbs.Attributes.Add(attNew);

            // The entity abstract definition is done, add the document to the corpus in the root folder and then save that doc
            cdmCorpus.Storage.FetchRootFolder("local").Documents.Add(docAbs);

            // next step is to remove all of the guesswork out of decoding the entity shape by 'resolving' it to a relational by reference shape
            Console.WriteLine("Make a local 'resolved' copy");

            // Now resolve it
            // Made the entity and document have a different name to avoid conflicts in this folder
            var entFlat = await entAbs.CreateResolvedEntityAsync("LocalMobileCareTeam");
            // Now just add the pointer into our manifest.
            Console.WriteLine("Add to manifest");
            manifest.Entities.Add(entFlat);

            // This function will update all of the fileStatus times in the manifest
            // await manifest.RefreshAsync(null);

            // Save the manifest along with linked definition files.
            await manifest.SaveAsAsync("default-resolved.manifest.cdm.json", true);
        }
    }
}
