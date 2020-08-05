// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    /// <summary>
    /// The utility functions class.
    /// </summary>
    public static class Utils
    {
        private static readonly Dictionary<string, string> annotationToTraitMap = new Dictionary<string, string>
        {
            { "version", "is.CDM.entityVersion" }
        };

        internal static readonly HashSet<string> ignoredTraits = new HashSet<string>
        {
            "is.propertyContent.multiTrait",
            "is.modelConversion.referenceModelMap",
            "is.modelConversion.modelVersion",
            "means.measurement.version",
            "is.CDM.entityVersion",
            "is.partition.format.CSV",
            "is.partition.culture",
            "is.managedBy",
            "is.hidden"
        };

        // Traits to ignore if they come from properties.
        // These traits become properties on the model.json. To avoid persisting both a trait
        // and a property on the model.json, we filter these traits out.
        internal static readonly HashSet<string> modelJsonPropertyTraits = new HashSet<string>
        {
            "is.localized.describedAs"
        };

        internal static async Task ProcessAnnotationsFromData(CdmCorpusContext ctx, MetadataObject obj, CdmTraitCollection traits)
        {
            var multiTraitAnnotations = new List<Annotation>();

            if (obj.Annotations != null)
            {
                foreach (var element in obj.Annotations)
                {
                    if (!ShouldAnnotationGoIntoASingleTrait(element.Name))
                    {
                        multiTraitAnnotations.Add(element);
                    }
                    else
                    {
                        var innerTrait = ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, ConvertAnnotationToTrait(element.Name));
                        innerTrait.Arguments.Add(await ArgumentPersistence.FromData(ctx, element));
                        traits.Add(innerTrait);
                    }
                }

                if (multiTraitAnnotations.Count > 0)
                {
                    var trait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.modelConversion.otherAnnotations", false);
                    trait.IsFromProperty = false;
                    var annotationsArgument = new CdmArgumentDefinition(ctx, "annotations")
                    {
                        Value = multiTraitAnnotations
                    };
                    trait.Arguments.Add(annotationsArgument);
                    traits.Add(trait);
                }
            }

            if (obj.Traits != null)
            {
                foreach (var trait in obj.Traits)
                {
                    var traitInstance = CdmFolder.TraitReferencePersistence.FromData(ctx, JToken.FromObject(trait));
                    traits.Add(traitInstance);
                }
            }
        }

        internal static void ProcessTraitsAndAnnotationsToData(CdmCorpusContext ctx, MetadataObject obj, CdmTraitCollection traits)
        {
            if (traits == null)
            {
                return;
            }

            var annotations = new List<Annotation>();
            var extensions = new List<JToken>();

            foreach (var trait in traits)
            {
                if (ExtensionHelper.TraitRefIsExtension(trait))
                {
                    ExtensionHelper.ProcessExtensionTraitToObject(trait, obj);

                    continue;
                }
                if (trait.NamedReference == "is.modelConversion.otherAnnotations")
                {
                    foreach (var annotation in trait.Arguments[0].Value)
                    {

                        if (annotation is JObject jAnnotation)
                        {
                            annotations.Add(jAnnotation.ToObject<Annotation>());
                        }
                        else if (annotation is Annotation)
                        {
                            annotations.Add(annotation);
                        }
                        else
                        {
                            Logger.Warning(nameof(Utils), ctx, "Unsupported annotation type.");
                        }

                    }
                }
                else if (
                    !ignoredTraits.Contains(trait.NamedReference)
                    && !trait.NamedReference.StartsWith("is.dataFormat")
                    && !(modelJsonPropertyTraits.Contains(trait.NamedReference) && trait.IsFromProperty))
                {
                    var extension = CdmFolder.TraitReferencePersistence.ToData(trait, null, null);
                    extensions.Add(JToken.FromObject(extension, JsonSerializationUtil.JsonSerializer));
                }
            }

            if (annotations.Count > 0)
            {
                obj.Annotations = annotations;
            }

            if (extensions.Count > 0)
            {
                obj.Traits = extensions;
            }
        }

        internal static string TraitToAnnotationName(string traitName)
        {
            switch (traitName)
            {
                case "is.CDM.entityVersion":
                    return "version";
                default:
                    return null;
            }
        }

        internal static CdmTraitReference CreateCsvTrait(CsvFormatSettings obj, CdmCorpusContext ctx)
        {
            var csvFormatTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.partition.format.CSV", true);
            csvFormatTrait.SimpleNamedReference = false;

            if (obj.ColumnHeaders != null)
            {
                var columnHeadersArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "columnHeaders");
                columnHeadersArg.Value = obj.ColumnHeaders == true ? "true" : "false";
                csvFormatTrait.Arguments.Add(columnHeadersArg);
            }

            if (obj.CsvStyle != null)
            {
                var csvStyleArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "csvStyle");
                csvStyleArg.Value = obj.CsvStyle;
                csvFormatTrait.Arguments.Add(csvStyleArg);
            }

            if (obj.Delimiter != null)
            {
                var delimiterArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "delimiter");
                delimiterArg.Value = obj.Delimiter;
                csvFormatTrait.Arguments.Add(delimiterArg);
            }

            if (obj.QuoteStyle != null)
            {
                var quoteStyleArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "quoteStyle");
                quoteStyleArg.Value = obj.QuoteStyle;
                csvFormatTrait.Arguments.Add(quoteStyleArg);
            }

            if (obj.Encoding != null)
            {
                var encodingArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "encoding");
                encodingArg.Value = obj.Encoding;
                csvFormatTrait.Arguments.Add(encodingArg);
            }

            return csvFormatTrait;
        }

        internal static CsvFormatSettings CreateCsvFormatSettings(CdmTraitReference cdmTraitRef)
        {
            var result = new CsvFormatSettings();

            foreach (var argument in cdmTraitRef.Arguments)
            {
                switch (argument.Name)
                {
                    case "columnHeaders":
                        result.ColumnHeaders = argument.Value == "true";
                        break;
                    case "csvStyle":
                        result.CsvStyle = argument.Value;
                        break;
                    case "delimiter":
                        result.Delimiter = argument.Value;
                        break;
                    case "quoteStyle":
                        result.QuoteStyle = argument.Value;
                        break;
                    case "encoding":
                        result.Encoding = argument.Value;
                        break;
                }
            }

            return result;
        }

        private static bool ShouldAnnotationGoIntoASingleTrait(string name)
        {
            return annotationToTraitMap.ContainsKey(name);
        }

        private static string ConvertAnnotationToTrait(string name)
        {
            return annotationToTraitMap[name];
        }
    }
}
