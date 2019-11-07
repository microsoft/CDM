namespace customize_manifest
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;

    class Program
    {
        static async Task Main(string[] args)
        {
            // Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
            var cdmCorpus = new CdmCorpusDefinition();

            Console.WriteLine("configure storage adapters");
            
            // Configure storage adapters to point at the target local manifest location and at the fake public standards
            string pathFromExeToExampleRoot = "../../../../../../";

            // Mount is as a local device.
            cdmCorpus.Storage.Mount("local", new LocalAdapter(pathFromExeToExampleRoot + "3-customize-entities"));
            cdmCorpus.Storage.DefaultNamespace = "local"; // local is our default. so any paths that start out navigating without a device tag will assume local

            // Mount it as the 'cdm' device, not the default so must use "cdm:/folder" to get there
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

            // This sample will load an existing manifest and add to it a new entity that is a customized version of a standard
            // we will add the CareTeam entity but first we will add the 'currentCity' attribute and give the new entity a new name 'MobileCareTeam'
            // this new defintion becomes a local abstract description of an entity that is resolved and flattened before being added to the manifest

            // open the default manifest at the root, used later when done
            // this method turns relative corpus paths into absolute ones in case we are in some sub-folders and don't know it
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("default.folio.cdm.json");

            Console.WriteLine("define new extension");

            // First we will make a new document right in the same folder as the manifest.
            var docAbs = cdmCorpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "MobileCareTeam.cdm.json");
            
            // Import the cdm description of the original so the symbols will resolve.
            docAbs.Imports.Add("cdm:/core/applicationCommon/foundationCommon/crmCommon/accelerators/healthCare/electronicMedicalRecords/CareTeam.cdm.json", null);

            // we will make a new trait to identify things that are known to be temporary, used later. in theory this would be defined somewhere central so it can be shared
            var traitTemp = docAbs.Definitions.Add(CdmObjectType.TraitDef, "means.temporary") as CdmTraitDefinition;
            traitTemp.ExtendsTrait = cdmCorpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "means", true); // extends the standard 'means' base trait
            // has a parameter for the expected duration in days
            var param = cdmCorpus.MakeObject<CdmParameterDefinition>(CdmObjectType.ParameterDef, "estimatedDays");
            param.DataTypeRef = cdmCorpus.MakeObject<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "integer"); // by not using "true" on the last arg, this becomes an real reference object in the json. go look at the difference from "means" when this is done
            param.DefaultValue = "30";
            traitTemp.Parameters.Add(param);

            // Make an entity definition and add it to the list of definitions in the document.
            CdmEntityDefinition entAbs = docAbs.Definitions.Add(CdmObjectType.EntityDef, "MobileCareTeam") as CdmEntityDefinition;
            // this entity extends the standard
            entAbs.ExtendsEntity = cdmCorpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, "CareTeam", true); // this function with 'true' will make a simple reference to the base
            
            // and we will add an attribute
            CdmTypeAttributeDefinition attNew = cdmCorpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "currentCity");
            // the attribute is a type is 'City" this is one of the predefined semantic types in meanings.cdm.json
            attNew.DataType = cdmCorpus.MakeObject<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "city", true);
            attNew.Description = "The current city where the mobile care team is working";

            // also apply our fancy new 'temporary' trait. they stay in a city for 90 days on average
            CdmTraitReference tr = cdmCorpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "means.temporary");
            tr.Arguments.Add("estimatedDays", "90");
            attNew.AppliedTraits.Add(tr);

            // add attribute to the entity
            entAbs.Attributes.Add(attNew);

            // The entity abstract definition is done, add the document to the corpus in the root folder and then save that doc
            cdmCorpus.Storage.FetchRootFolder("local").Documents.Add(docAbs);

            // next step is to remove all of the guesswork out of decoding the entity shape by 'resolving' it to a relational by reference shape
            Console.WriteLine("make a local 'resolved' copy");

            // Now resolve it
            var entFlat = await entAbs.CreateResolvedEntityAsync("LocalMobileCareTeam"); // made the entity and document have a different name to avoid conflicts in this folder

            // Now just add the pointer into our manifest.
            Console.WriteLine("add to manifest");
            manifest.Entities.Add(entFlat);

            // This function will update all of the fileStatus times in the manifest.
            //await manifest.RefreshFileStatus();

            // and save the manifest along with linked definition files
            await manifest.SaveAsAsync("default.manifest.cdm.json", true);
        }
    }
}
