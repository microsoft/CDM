using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    static class ExtensionHelper
    {
        /// <summary>
        /// Dictionary used to cache documents with trait definitions by file name.
        /// </summary>
        private static Dictionary<string, CdmDocumentDefinition> CachedDefDocs = new Dictionary<string, CdmDocumentDefinition>();

        /// <summary>
        /// Constant used to store the prefix that is the mark of extension traits.
        /// </summary>
        public const string ExtensionTraitNamePrefix = "is.extension.";

        /// <summary>
        /// For all the definitions (name, type) we have found for extensions, search in CDM Standard Schema for definition files.
        /// If we find a definition in a CDM Standard Schema file, we add that file to importsList.
        /// At the same time, the found definition is removed from extensionTraitDefList.
        /// When this function returns, extensionTraitDefList only contains definitions that are not present in any CDM Standard Schema file,
        /// and a list of CDM Standard Schema files with relevant definitions is returned.
        /// </summary>
        /// <param name="ctx"> The context</param>
        /// <param name="extensionTraitDefList"> The list of all definitions for all found extensions. Function modifies this list by removing definitions found in CDM Standard Schema files.</param>
        /// <returns> A list of CDM Standard Schema files to import.</returns>
        public static async Task<List<CdmImport>> StandardImportDetection(CdmCorpusContext ctx, CdmCollection<CdmTraitDefinition> extensionTraitDefList)
        {
            List<CdmImport> importsList = new List<CdmImport>();

            // have to go from end to start because I might remove elements
            for (int traitIndex = extensionTraitDefList.Count - 1; traitIndex >= 0; traitIndex--)
            {
                CdmTraitDefinition extensionTraitDef = extensionTraitDefList[traitIndex];
                if (!TraitDefIsExtension(extensionTraitDef))
                {
                    Logger.Error(nameof(ExtensionHelper), ctx, $"Invalid extension trait name {extensionTraitDef.TraitName}, expected prefix {ExtensionTraitNamePrefix}.");

                    return null;
                }

                string[] extensionBreakdown = RemoveExtensionTraitNamePrefix(extensionTraitDef.TraitName).Split(':');
                if (extensionBreakdown.Length > 1)
                {
                    string extensionName = extensionBreakdown[0];
                    string fileName = $"{extensionName}.extension.cdm.json";
                    string fileCorpusPath = $"cdm:/extensions/{fileName}";
                    CdmDocumentDefinition extensionDoc = await FetchDefDoc(ctx, fileName);

                    // If no document was found for that extensionName, the trait does not have a document with it's definition.
                    // Trait will be kept in extensionTraitDefList (a document with its definition will be created locally)
                    if (extensionDoc == null)
                    {
                        continue;
                    }

                    // There is a document with extensionName, now we search for the trait in the document.
                    // If we find it, we remove the trait from extensionTraitDefList and add the document to imports.
                    CdmTraitDefinition matchingTrait = extensionDoc.Definitions.AllItems.Find(
                        (definition) => definition.ObjectType == CdmObjectType.TraitDef && definition.GetName() == extensionTraitDef.TraitName)
                        as CdmTraitDefinition;
                    if (matchingTrait != null)
                    {
                        List<CdmParameterDefinition> parameterList = matchingTrait.Parameters.AllItems;
                        if (
                            extensionTraitDef.Parameters.AllItems.TrueForAll(
                                (CdmParameterDefinition extensionParameter) =>
                                parameterList.Exists(
                                    (CdmParameterDefinition defParameter) => defParameter.Name == extensionParameter.Name)
                                    )
                            )
                        {
                            extensionTraitDefList.Remove(extensionTraitDefList[traitIndex]);
                            if (!importsList.Exists((CdmImport importDoc) => importDoc.CorpusPath == fileCorpusPath))
                            {
                                CdmImport importObject = ctx.Corpus.MakeObject<CdmImport>(CdmObjectType.Import);
                                importObject.CorpusPath = fileCorpusPath;
                                importsList.Add(importObject);
                            }
                        }
                    }
                }
            }
            return importsList;
        }

        /// <summary>
        /// Processes extensions from an object which was obtained from a "model.json" file.
        /// From every extension found, it's value (name, value) is added to traitRefSet,
        /// and it's definition (name, type) is added to extensionTraitDefList.
        /// </summary>
        /// <param name="ctx"> The context </param>
        /// <param name="sourceObject"> The object obtained from "model.json" file.</param>
        /// <param name="traitRefSet"> The list of extensions found, in the form of (name & value).</param>
        /// <param name="extensionTraitDefList"> The list of definitions. For each extension, it's definition is added to this list (name & type).</param>
        public static void ProcessExtensionFromJson(
            CdmCorpusContext ctx,
            MetadataObject sourceObject,
            CdmTraitCollection traitRefSet,
            CdmCollection<CdmTraitDefinition> extensionTraitDefList)
        {
            var extensions = sourceObject.ExtensionFields;

            foreach (JProperty extensionAsJProperty in extensions.Children())
            {
                string traitName = AddExtensionTraitNamePrefix(extensionAsJProperty.Name);
                CdmTraitReference extensionTraitRef = ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, traitName);
                CdmTraitDefinition extensionTraitDef = extensionTraitDefList.AllItems.Find((CdmTraitDefinition trait) => trait.TraitName == traitName);
                bool traitExists = extensionTraitDef != null;
                if (!traitExists)
                {
                    extensionTraitDef = ctx.Corpus.MakeObject<CdmTraitDefinition>(CdmObjectType.TraitDef, traitName);
                    extensionTraitDef.ExtendsTrait = ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "is.extension", true);
                }

                var extensionValue = extensionAsJProperty.Value;
                var extensionType = extensionValue.Type;

                var shouldLookIntoProperties = extensionType == JTokenType.Object;

                if (shouldLookIntoProperties)
                {
                    var extensionValueAsJObject = extensionValue as JObject;
                    // extensionProperty.Name is here the equivalent of extensionProperty from TS project
                    foreach (JProperty extensionProperty in extensionValueAsJObject.Children())
                    {
                        // for every extensionProperty will have to save the (name, value) pair into extensionArgument,
                        // which will be saved in extensionTraitRef (the entity that will contain the data)
                        // (name, type) will be saved in extensionParameter,
                        // which will be saved in extensionTraitDef (the definition of the data, that can be saved in a schema file)
                        JToken extensionPropertyValue = extensionProperty.Value;

                        if (extensionPropertyValue == null)
                        {
                            continue;
                        }

                        CdmArgumentDefinition extensionArgument = ctx.Corpus.MakeObject<CdmArgumentDefinition>(
                            CdmObjectType.ArgumentDef,
                            extensionProperty.Name
                            );
                        CdmParameterDefinition extensionParameter = extensionTraitDef.Parameters.AllItems.Find(
                            (CdmParameterDefinition parameter) => parameter.Name == extensionProperty.Name);
                        bool parameterExists = extensionParameter != null;
                        if (!parameterExists)
                        {
                            extensionParameter = ctx.Corpus.MakeObject<CdmParameterDefinition>(CdmObjectType.ParameterDef, extensionProperty.Name);
                            extensionParameter.DataTypeRef = ctx.Corpus.MakeObject<CdmDataTypeReference>(CdmObjectType.DataTypeRef,
                                ConvertJTokenTypeToExpectedString(extensionPropertyValue.Type),
                                true);
                        }

                        if (extensionPropertyValue is JValue extensionPropertyValueAsJValue)
                        {
                            extensionArgument.Value = extensionPropertyValueAsJValue.Value;
                        }
                        else
                        {
                            extensionArgument.Value = extensionPropertyValue;
                        }

                        extensionTraitRef.Arguments.Add(extensionArgument);
                        if (!parameterExists)
                        {
                            extensionTraitDef.Parameters.Add(extensionParameter);
                        }
                    }
                }
                else
                {
                    CdmArgumentDefinition extensionArgument = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, traitName);
                    CdmParameterDefinition extensionParameter = extensionTraitDef.Parameters.AllItems.Find((CdmParameterDefinition parameter) => parameter.Name == traitName);
                    bool parameterExists = extensionParameter != null;
                    if (!parameterExists)
                    {
                        extensionParameter = ctx.Corpus.MakeObject<CdmParameterDefinition>(CdmObjectType.ParameterDef, traitName);
                        extensionParameter.DataTypeRef = ctx.Corpus.MakeObject<CdmDataTypeReference>(
                            CdmObjectType.DataTypeRef,
                            ConvertJTokenTypeToExpectedString(extensionType),
                            true);
                    }

                    extensionArgument.Value = extensionValue;
                    extensionTraitRef.Arguments.Add(extensionArgument);
                    if (!parameterExists)
                    {
                        extensionTraitDef.Parameters.Add(extensionParameter);
                    }
                }

                if (!traitExists)
                {
                    extensionTraitDefList.Add(extensionTraitDef);
                }

                traitRefSet.Add(extensionTraitRef);
            }
        }

        /// <summary>
        /// Used as helper for converting a Manifest to a Model.
        /// Adds an extension stored in "Manifest" format to the data structure representing a <see cref="Model"/>
        /// </summary>
        /// <param name="extensionTraitRef">
        /// The data structure containing the extension in the format used by the Manifest
        /// </param>
        /// <param name="destination">
        /// The data structure used by <see cref="Model"/> where the data will be added to.
        /// There are multiple data structures that can have extensions, and any of these can be used here (assuming they are used by Model.Json data format)
        /// </param>
        public static void ProcessExtensionTraitToObject(CdmTraitReference extensionTraitRef, MetadataObject destination)
        {
            if (destination.ExtensionFields == null)
            {
                destination.ExtensionFields = new JObject();
            }

            string originalExtensionName = RemoveExtensionTraitNamePrefix(extensionTraitRef.NamedReference);
            JToken extensionValue;

            if (extensionTraitRef.Arguments.Count == 1 && extensionTraitRef.Arguments[0].Name == extensionTraitRef.NamedReference)
            {
                extensionValue = new JValue(extensionTraitRef.Arguments[0].Value);
            }
            else
            {
                var extensionValueAsJObject = new JObject();
                foreach (CdmArgumentDefinition argument in extensionTraitRef.Arguments)
                {
                    var propertyName = argument.Name;
                    var propertyValue = argument.Value;
                    extensionValueAsJObject.Add(propertyName, propertyValue);
                }

                extensionValue = extensionValueAsJObject;
            }

            destination.ExtensionFields.Add(originalExtensionName, extensionValue);
        }

        /// <summary>
        /// Checks whether a trait name has the specific mark of an extension (begins with <see cref="ExtensionTraitNamePrefix"/>)
        /// </summary>
        /// <param name="traitName">The name of the trait to be checked.</param>
        /// <returns>Whether the trait is an extension.</returns>
        public static bool TraitNameHasExtensionMark(string traitName)
        {
            if (string.IsNullOrEmpty(traitName))
            {
                return false;
            }

            return traitName.StartsWith(ExtensionTraitNamePrefix);
        }

        /// <summary>
        /// Checks whether a <see cref="CdmTraitReference"/> is an extension.
        /// </summary>
        /// <param name="trait">The trait to be checked whether it is an extension.</param>
        /// <returns>Whether the trait is an extension.</returns>
        public static bool TraitRefIsExtension(CdmTraitReference trait)
        {
            return TraitNameHasExtensionMark(trait.NamedReference);
        }

        /// <summary>
        /// Checks whether a <see cref="CdmTraitDefinition"/> is an extension.
        /// </summary>
        /// <param name="trait">The trait to be checked whether it is an extension.</param>
        /// <return>Whether the trait is an extension.</return>
        public static bool TraitDefIsExtension(CdmTraitDefinition trait)
        {
            return TraitNameHasExtensionMark(trait.TraitName);
        }

        /// <summary>
        /// Tries to fetch the document with expected fileName.
        /// Caches results in <see cref="CachedDefDocs"/>.
        /// </summary>
        /// <param name="ctx">The context</param>
        /// <param name="fileName">The name of the file that needs to be retrieved.</param>
        /// <returns>The content of the definition file with the expected fileName, or null if no such file was found.</returns>
        private static async Task<CdmDocumentDefinition> FetchDefDoc(CdmCorpusContext ctx, string fileName)
        {
            if (CachedDefDocs.ContainsKey(fileName))
            {
                return CachedDefDocs[fileName];
            }

            string path = $"/extensions/{fileName}";
            var absPath = ctx.Corpus.Storage.CreateAbsoluteCorpusPath(path, ctx.Corpus.Storage.FetchRootFolder("cdm"));
            CdmObject document = await ctx.Corpus.FetchObjectAsync<CdmObject>(absPath);
            CdmDocumentDefinition extensionDoc = document as CdmDocumentDefinition;

            CachedDefDocs.Add(fileName, extensionDoc);
            return extensionDoc;
        }

        /// <summary>
        /// Converts JTokenType to a string representing the type as expected in a Manifest.
        /// </summary>
        /// <param name="type">
        /// The type of the extension in the format used to deserialize Model.Json (JToken)
        /// </param>
        /// <returns>
        /// One of the allowed strings representing a type in a Manifest.
        /// </returns>
        private static string ConvertJTokenTypeToExpectedString(JTokenType type)
        {
            return type.ToString().ToLower();
        }

        /// <summary>
        /// Context: To mark a trait as an extension, a prefix is added to the trait name.
        /// This function does the oposite; given a trait name with the extension prefix, it removes the prefix.
        /// </summary>
        /// <param name="traitName">The trait name with the extension prefix.</param>
        /// <returns>The trait name after the prefix was removed.</returns>
        private static string RemoveExtensionTraitNamePrefix(string traitName)
        {
            return traitName.Substring(ExtensionTraitNamePrefix.Length);
        }

        /// <summary>
        /// Adds a prefix to a trait name, marking it as an extension (<see cref="ExtensionTraitNamePrefix"/>)
        /// </summary>
        /// <param name="traitName">The name of the trait to be marked as extension.</param>
        /// <returns>The trait name with the prefix that marks an extension.</returns>
        private static string AddExtensionTraitNamePrefix(string traitName)
        {
            return $"{ExtensionTraitNamePrefix}{traitName}";
        }
    }
}
