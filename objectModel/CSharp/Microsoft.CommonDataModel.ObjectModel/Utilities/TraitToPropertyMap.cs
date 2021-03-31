// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Runtime.CompilerServices;

#if INTERNAL_VSTS
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests" + Microsoft.CommonDataModel.AssemblyRef.TestPublicKey)]
#else
[assembly: InternalsVisibleTo("Microsoft.CommonDataModel.ObjectModel.Tests")]
#endif
namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;

    internal class TraitToPropertyMap
    {
        private static readonly string Tag = nameof(TraitToPropertyMap);

        private CdmObject Host { get; set; }
        private CdmTraitCollection Traits
        {
            get
            {
                if (this.Host is CdmObjectReference)
                {
                    return (this.Host as CdmObjectReference).AppliedTraits;
                }
                else if (this.Host is CdmAttribute)
                {
                    return (this.Host as CdmAttribute).AppliedTraits;
                }
                else
                {
                    return (this.Host as CdmObjectDefinition).ExhibitsTraits;
                }
            }
        }

        private CdmCorpusContext Ctx
        {
            get
            {
                return this.Host.Ctx;
            }
        }

        private IDictionary<string, List<string>> TraitToListOfProperties = new Dictionary<string, List<string>>()
        {
            { "is.CDM.entityVersion", new List<string> { "version" } },
            { "is.CDM.attributeGroup", new List<string> { "cdmSchemas" } },
            { "is.CDS.sourceNamed", new List<string> { "sourceName" } },
            { "is.localized.displayedAs", new List<string> { "displayName" } },
            { "is.localized.describedAs", new List<string> { "description" } },
            { "is.CDS.ordered", new List<string> { "sourceOrdering" } },
            { "is.readOnly", new List<string> { "isReadOnly" } },
            { "is.nullable", new List<string> { "isNullable" } },
            { "is.constrainedList", new List<string> { "valueConstrainedToList" } },
            { "is.constrained", new List<string> { "maximumValue", "minimumValue", "maximumLength" } }
        };

        private IList<string> DataFormatTraitNames = new List<string>()
        {
            "is.dataFormat.integer",
            "is.dataFormat.small",
            "is.dataFormat.big",
            "is.dataFormat.floatingPoint",
            "is.dataFormat.guid",
            "is.dataFormat.character",
            "is.dataFormat.array",
            "is.dataFormat.byte",
            "is.dataFormat.time",
            "is.dataFormat.date",
            "is.dataFormat.timeOffset",
            "is.dataFormat.boolean",
            "is.dataFormat.numeric.shaped",
            "means.content.text.JSON"
        };

        internal TraitToPropertyMap(CdmObject host)
        {
            this.Host = host;
        }

        internal void UpdatePropertyValue(string propertyName, dynamic newValue)
        {
            var traitName = this.MapTraitName(propertyName);
            this.TraitToListOfProperties.TryGetValue(traitName, out List<string> listOfProps);
            bool multipleProperties = listOfProps?.Count > 1;

            if (newValue == null && !multipleProperties)
            {
                this.RemoveTrait(traitName);
            }
            else
            {
                switch (propertyName)
                {
                    case "version":
                        this.UpdateTraitArgument("is.CDM.entityVersion", "versionNumber", newValue);
                        break;
                    case "cdmSchemas":
                        this.UpdateSingleAttributeTraitTable("is.CDM.attributeGroup", "groupList", "attributeGroupSet", newValue);
                        break;
                    case "sourceName":
                        this.UpdateTraitArgument("is.CDS.sourceNamed", "name", newValue);
                        break;
                    case "displayName":
                        this.ConstructLocalizedTraitTable("is.localized.displayedAs", newValue);
                        break;
                    case "description":
                        this.ConstructLocalizedTraitTable("is.localized.describedAs", newValue);
                        break;
                    case "sourceOrdering":
                        this.UpdateTraitArgument("is.CDS.ordered", "ordinal", newValue.ToString());
                        break;
                    case "isPrimaryKey":
                        this.UpdateTraitArgument("is.identifiedBy", "", newValue);
                        break;
                    case "isReadOnly":
                        this.MapBooleanTrait("is.readOnly", newValue);
                        break;
                    case "isNullable":
                        this.MapBooleanTrait("is.nullable", newValue);
                        break;
                    case "valueConstrainedToList":
                        this.MapBooleanTrait("is.constrainedList", newValue);
                        break;
                    case "maximumValue":
                        this.UpdateTraitArgument("is.constrained", "maximumValue", newValue);
                        break;
                    case "minimumValue":
                        this.UpdateTraitArgument("is.constrained", "minimumValue", newValue);
                        break;
                    case "maximumLength":
                        this.UpdateTraitArgument("is.constrained", "maximumLength", newValue != null ? newValue.ToString() : null);
                        break;
                    case "dataFormat":
                        this.DataFormatToTraits(newValue);
                        break;
                    case "defaultValue":
                        this.UpdateDefaultValue(newValue);
                        break;
                }
            }
        }

        internal dynamic FetchPropertyValue(string propertyName, bool onlyFromProperty = false)
        {
            switch (propertyName)
            {
                case "version":
                    return FetchTraitReferenceArgumentValue(this.FetchTraitReference("is.CDM.entityVersion", onlyFromProperty), "versionNumber");
                case "sourceName":
                    return FetchTraitReferenceArgumentValue(this.FetchTraitReference("is.CDS.sourceNamed", onlyFromProperty), "name");
                case "displayName":
                    return this.FetchLocalizedTraitTable("is.localized.displayedAs", onlyFromProperty);
                case "description":
                    return this.FetchLocalizedTraitTable("is.localized.describedAs", onlyFromProperty);
                case "cdmSchemas":
                    return this.FetchSingleAttTraitTable("is.CDM.attributeGroup", "groupList", onlyFromProperty);
                case "sourceOrdering":
                    return Convert.ToInt32(FetchTraitReferenceArgumentValue(this.FetchTraitReference("is.CDS.ordered"), "ordinal"));
                case "isPrimaryKey":
                    if (this.Host is CdmTypeAttributeDefinition)
                    {
                        CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition)this.Host;
                        if (!onlyFromProperty && typeAttribute.Purpose != null && typeAttribute.Purpose.NamedReference == "identifiedBy")
                        {
                            return true;
                        }
                    }
                    return this.FetchTraitReference("is.identifiedBy", onlyFromProperty) != null;
                case "isNullable":
                    return this.FetchTraitReference("is.nullable", onlyFromProperty) != null;
                case "isReadOnly":
                    return this.FetchTraitReference("is.readOnly", onlyFromProperty) != null;
                case "valueConstrainedToList":
                    return this.FetchTraitReference("is.constrainedList", onlyFromProperty) != null;
                case "maximumValue":
                    return FetchTraitReferenceArgumentValue(this.FetchTraitReference("is.constrained", onlyFromProperty), "maximumValue");
                case "minimumValue":
                    return FetchTraitReferenceArgumentValue(this.FetchTraitReference("is.constrained", onlyFromProperty), "minimumValue");
                case "maximumLength":
                    var temp = FetchTraitReferenceArgumentValue(this.FetchTraitReference("is.constrained", onlyFromProperty), "maximumLength");
                    if (temp != null)
                        return Convert.ToInt32(temp);
                    break;
                case "dataFormat":
                    return this.TraitsToDataFormat(onlyFromProperty);
                case "primaryKey":
                    CdmTypeAttributeDefinition attRef = FetchTraitReferenceArgumentValue(FetchTraitReference("is.identifiedBy", onlyFromProperty), "attribute");
                    if (attRef != null)
                        return attRef.FetchObjectDefinitionName();
                    break;
                case "defaultValue":
                    return this.FetchDefaultValue(onlyFromProperty);
            }
            return null;
        }

        /// <summary>
        /// Fetches a trait based on name from the array of traits.
        /// </summary>
        /// <param name="traitName">The name of the trait.</param>
        /// <param name="onlyFromProperty">Specifies do we want to fetch only from property.</param>
        internal CdmTraitReference FetchTraitReference(string traitName, bool onlyFromProperty = false)
        {
            int traitIndex = this.Traits != null ? this.Traits.IndexOf(traitName, onlyFromProperty) : -1;

            return (traitIndex == -1) ? null : this.Traits[traitIndex];
        }

        internal void RemoveTrait(string traitName)
        {
            this.Traits.Remove(traitName, true);
        }

        internal void MapBooleanTrait(string traitName, bool value)
        {
            if (value == true)
            {
                this.FetchOrCreateTrait(traitName, true);
            }
            else
            {
                this.RemoveTrait(traitName);
            }
        }

        internal void DataFormatToTraits(CdmDataFormat dataFormat)
        {
            // reset the current dataFormat
            foreach (var traitName in DataFormatTraitNames) {
                this.RemoveTrait(traitName);
            }
            switch (dataFormat)
            {
                case CdmDataFormat.Int16:
                    this.FetchOrCreateTrait("is.dataFormat.integer", true);
                    this.FetchOrCreateTrait("is.dataFormat.small", true);
                    break;
                case CdmDataFormat.Int32:
                    this.FetchOrCreateTrait("is.dataFormat.integer", true);
                    break;
                case CdmDataFormat.Int64:
                    this.FetchOrCreateTrait("is.dataFormat.integer", true);
                    this.FetchOrCreateTrait("is.dataFormat.big", true);
                    break;
                case CdmDataFormat.Float:
                    this.FetchOrCreateTrait("is.dataFormat.floatingPoint", true);
                    break;
                case CdmDataFormat.Double:
                    this.FetchOrCreateTrait("is.dataFormat.floatingPoint", true);
                    this.FetchOrCreateTrait("is.dataFormat.big", true);
                    break;
                case CdmDataFormat.Guid:
                    this.FetchOrCreateTrait("is.dataFormat.guid", true);
                    this.FetchOrCreateTrait("is.dataFormat.character", true);
                    this.FetchOrCreateTrait("is.dataFormat.array", true);
                    break;
                case CdmDataFormat.String:
                    this.FetchOrCreateTrait("is.dataFormat.character", true);
                    this.FetchOrCreateTrait("is.dataFormat.array", true);
                    break;
                case CdmDataFormat.Char:
                    this.FetchOrCreateTrait("is.dataFormat.character", true);
                    this.FetchOrCreateTrait("is.dataFormat.big", true);
                    break;
                case CdmDataFormat.Byte:
                    this.FetchOrCreateTrait("is.dataFormat.byte", true);
                    break;
                case CdmDataFormat.Binary:
                    this.FetchOrCreateTrait("is.dataFormat.byte", true);
                    this.FetchOrCreateTrait("is.dataFormat.array", true);
                    break;
                case CdmDataFormat.Time:
                    this.FetchOrCreateTrait("is.dataFormat.time", true);
                    break;
                case CdmDataFormat.Date:
                    this.FetchOrCreateTrait("is.dataFormat.date", true);
                    break;
                case CdmDataFormat.DateTime:
                    this.FetchOrCreateTrait("is.dataFormat.time", true);
                    this.FetchOrCreateTrait("is.dataFormat.date", true);
                    break;
                case CdmDataFormat.DateTimeOffset:
                    this.FetchOrCreateTrait("is.dataFormat.time", true);
                    this.FetchOrCreateTrait("is.dataFormat.date", true);
                    this.FetchOrCreateTrait("is.dataFormat.timeOffset", true);
                    break;
                case CdmDataFormat.Boolean:
                    this.FetchOrCreateTrait("is.dataFormat.boolean", true);
                    break;
                case CdmDataFormat.Decimal:
                    this.FetchOrCreateTrait("is.dataFormat.numeric.shaped", true);
                    break;
                case CdmDataFormat.Json:
                    this.FetchOrCreateTrait("is.dataFormat.array", true);
                    this.FetchOrCreateTrait("means.content.text.JSON", true);
                    break;
            }
        }

        internal string MapTraitName(string propertyName)
        {
            switch (propertyName)
            {
                case "version":
                    return "is.CDM.entityVersion";
                case "cdmSchemas":
                    return "is.CDM.attributeGroup";
                case "sourceName":
                    return "is.CDS.sourceNamed";
                case "displayName":
                    return "is.localized.displayedAs";
                case "description":
                    return "is.localized.describedAs";
                case "sourceOrdering":
                    return "is.CDS.ordered";
                case "isPrimaryKey":
                    return "is.identifiedBy";
                case "isReadOnly":
                    return "is.readOnly";
                case "isNullable":
                    return "is.nullable";
                case "valueConstrainedToList":
                    return "is.constrainedList";
                case "maximumValue":
                case "minimumValue":
                case "maximumLength":
                    return "is.constrained";
                default:
                    return propertyName;
            }
        }

        internal CdmDataFormat TraitsToDataFormat(bool onlyFromProperty)
        {
            bool isArray = false;
            bool isBig = false;
            bool isSmall = false;
            bool isInteger = false;
            bool probablyJson = false;

            CdmDataFormat baseType = CdmDataFormat.Unknown;
            if (this.Traits != null)
            {
                foreach (var trait in this.Traits)
                {
                    if (onlyFromProperty && !trait.IsFromProperty)
                    {
                        continue;
                    }

                    string traitName = trait.FetchObjectDefinitionName();
                    switch (traitName)
                    {
                        case "is.dataFormat.array":
                            isArray = true;
                            break;
                        case "is.dataFormat.big":
                            isBig = true;
                            break;
                        case "is.dataFormat.small":
                            isSmall = true;
                            break;
                        case "is.dataFormat.integer":
                            isInteger = true;
                            break;
                        case "is.dataFormat.floatingPoint":
                            baseType = CdmDataFormat.Float;
                            break;
                        case "is.dataFormat.character":
                            if (baseType != CdmDataFormat.Guid)
                                baseType = CdmDataFormat.Char;
                            break;
                        case "is.dataFormat.byte":
                            baseType = CdmDataFormat.Byte;
                            break;
                        case "is.dataFormat.date":
                            if (baseType == CdmDataFormat.Time)
                                baseType = CdmDataFormat.DateTime;
                            else
                                baseType = CdmDataFormat.Date;
                            break;
                        case "is.dataFormat.time":
                            if (baseType == CdmDataFormat.Date)
                                baseType = CdmDataFormat.DateTime;
                            else
                                baseType = CdmDataFormat.Time;
                            break;
                        case "is.dataFormat.timeOffset":
                            if (baseType == CdmDataFormat.DateTime)
                                baseType = CdmDataFormat.DateTimeOffset;
                            break;
                        case "is.dataFormat.boolean":
                            baseType = CdmDataFormat.Boolean;
                            break;
                        case "is.dataFormat.numeric.shaped":
                            baseType = CdmDataFormat.Decimal;
                            break;
                        case "is.dataFormat.guid":
                            baseType = CdmDataFormat.Guid;
                            break;
                        case "means.content.text.JSON":
                            baseType = isArray ? CdmDataFormat.Json : CdmDataFormat.Unknown;
                            probablyJson = true;
                            break;
                        default:
                            break;
                    }
                }

                if (isArray)
                {
                    if (probablyJson)
                        baseType = CdmDataFormat.Json;
                    else if (baseType == CdmDataFormat.Char)
                        baseType = CdmDataFormat.String;
                    else if (baseType == CdmDataFormat.Byte)
                        baseType = CdmDataFormat.Binary;
                    else if (baseType != CdmDataFormat.Guid)
                        baseType = CdmDataFormat.Unknown;
                }

                if (baseType == CdmDataFormat.Float && isBig)
                    baseType = CdmDataFormat.Double;
                if (isInteger && isBig)
                    baseType = CdmDataFormat.Int64;
                else if (isInteger && isSmall)
                    baseType = CdmDataFormat.Int16;
                else if (isInteger)
                    baseType = CdmDataFormat.Int32;
            }

            return baseType;
        }

        internal CdmTraitReference FetchOrCreateTrait(string traitName, bool simpleRef)
        {
            var trait = FetchTraitReference(traitName, true);
            if (trait == null)
            {
                trait = this.Ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, traitName, simpleRef);
                trait.IsFromProperty = true;
                this.Traits.Add(trait);
            }

            return trait;
        }

        internal void UpdateTraitArgument(string traitName, string argName, dynamic value)
        {
            CdmTraitReference trait;
            trait = this.FetchOrCreateTrait(traitName, false);

            var args = trait.Arguments;
            if (args == null || args.Count == 0)
            {
                if (value != null)
                {
                    trait.Arguments.Add(argName, value);
                    return;
                }
                else
                {
                    this.RemoveTrait(traitName);
                }
            }
            else
            {

                for (int iArg = 0; iArg < args.Count; iArg++)
                {
                    var arg = args.AllItems[iArg];
                    if (arg.Name == argName)
                    {
                        if (value == null)
                        {
                            args.Remove(arg);
                            if (trait?.Arguments.Count == 0)
                            {
                                this.RemoveTrait(traitName);
                            }
                        }
                        else
                        {
                            arg.Value = value;
                        }
                        return;
                    }
                }
            }

            if (value != null)
            {
                trait.Arguments.Add(argName, value);
            }
        }

        internal void UpdateTraitTable(string traitName, string argName, string entityName, Action<CdmConstantEntityDefinition, bool> action)
        {
            CdmTraitReference trait = this.FetchOrCreateTrait(traitName, false);
            if (trait.Arguments == null || trait.Arguments.Count == 0)
            {
                // make the argument nothing but a ref to a constant entity, safe since there is only one param for the trait and it looks cleaner
                var cEnt = this.Ctx.Corpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef, null, false);
                cEnt.EntityShape = this.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, entityName, true) as CdmEntityReference;
                action(cEnt, true);
                trait.Arguments.Add(argName, this.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, cEnt, false));
            }
            else
            {
                var locEntRef = FetchTraitReferenceArgumentValue(trait as CdmTraitReference, argName);
                if (locEntRef != null)
                {
                    var locEnt = locEntRef.FetchObjectDefinition<CdmConstantEntityDefinition>(null);
                    if (locEnt != null)
                        action(locEnt, false);
                }
            }
        }

        internal CdmConstantEntityDefinition FetchTraitTable(string traitName, string argName, bool onlyFromProperty)
        {
            CdmTraitReference trait;
            int traitIndex = this.Traits.IndexOf(traitName, onlyFromProperty);
            trait = (traitIndex == -1) ? null : this.Traits[traitIndex];

            var locEntRef = FetchTraitReferenceArgumentValue(trait, argName);
            if (locEntRef != null)
            {
                return locEntRef.FetchObjectDefinition<CdmConstantEntityDefinition>(null);
            }
            return null;
        }

        internal void ConstructLocalizedTraitTable(string traitName, string sourceText)
        {
            this.UpdateTraitTable(traitName, "localizedDisplayText", "localizedTable", (cEnt, created) =>
            {
                if (created)
                {
                    cEnt.ConstantValues = new List<List<string>> { new List<string> { "en", sourceText } };
                }
                else
                {
                    // search for a match
                    // -1 on order gets us the last row that matches. needed because inheritence
                    // chain with different descriptions stacks these up
                    // need to use ordinals because no binding done yet
                    cEnt.UpdateConstantValue(null, 1, sourceText, 0, "en", -1);  // need to use ordinals because no binding done yet
                }
            });
        }

        internal dynamic FetchLocalizedTraitTable(string traitName, bool onlyFromProperty)
        {
            var cEnt = this.FetchTraitTable(traitName, "localizedDisplayText", onlyFromProperty);
            if (cEnt != null)
            {
                // search for a match
                // -1 on order gets us the last row that matches. needed because inheritence
                // chain with different descriptions stacks these up
                // need to use ordinals because no binding done yet
                return cEnt.FetchConstantValue(null, 1, 0, "en", -1); // need to use ordinals because no binding done yet
            }
            return null;
        }

        internal void UpdateSingleAttributeTraitTable(string traitName, string argName, string entityName, List<string> sourceText)
        {
            Action<CdmConstantEntityDefinition, bool> action = (cEnt, created) =>
            {
                // turn array of strings into array of array of strings;
                List<List<string>> vals = new List<List<string>>();
                foreach (var v in sourceText)
                {
                    var r = new List<string>();
                    r.Add(v);
                    vals.Add(r);
                }
                cEnt.ConstantValues = vals;
            };
            this.UpdateTraitTable(traitName, argName, entityName, action);
        }

        internal List<string> FetchSingleAttTraitTable(string traitName, string argName, bool onlyFromProperty)
        {
            var cEnt = this.FetchTraitTable(traitName, argName, onlyFromProperty);
            if (cEnt != null)
            {
                // turn array of arrays into single array of strings
                var result = new List<string>();
                foreach (var v in cEnt.ConstantValues)
                {
                    result.Add(v[0]);
                }
                return result;
            }
            return null;
        }

        internal dynamic FetchDefaultValue(bool onlyFromProperty)
        {
            CdmTraitReference trait = this.FetchTraitReference("does.haveDefault", onlyFromProperty);
            if (trait != null)
            {
                var defVal = FetchTraitReferenceArgumentValue(trait as CdmTraitReference, "default");
                if (defVal != null)
                {
                    if (defVal is string)
                        return defVal;
                    if ((defVal as CdmObject).ObjectType == CdmObjectType.EntityRef)
                    {
                        var cEnt = (defVal as CdmObject).FetchObjectDefinition<CdmObjectDefinition>(null) as CdmConstantEntityDefinition;
                        if (cEnt != null)
                        {
                            string esName = cEnt.EntityShape.FetchObjectDefinitionName();
                            bool corr = esName == "listLookupCorrelatedValues";
                            bool lookup = esName == "listLookupValues";
                            if (esName == "localizedTable" || lookup || corr)
                            {
                                List<dynamic> result = new List<dynamic>();
                                List<List<string>> rawValues = cEnt.ConstantValues;
                                if (rawValues != null)
                                {
                                    for (int i = 0; i < rawValues.Count; i++)
                                    {
                                        Dictionary<string, string> row = new Dictionary<string, string>();
                                        List<string> rawRow = rawValues[i];
                                        if (rawRow.Count == 2 || (lookup && rawRow.Count == 4) || (corr && rawRow.Count == 5))
                                        {
                                            row["languageTag"] = rawRow[0];
                                            row["displayText"] = rawRow[1];
                                            if (lookup || corr)
                                            {
                                                row["attributeValue"] = rawRow[2];
                                                row["displayOrder"] = rawRow[3];
                                                if (corr)
                                                    row["correlatedValue"] = rawRow[4];
                                            }
                                        }
                                        result.Add(row);
                                    }
                                }
                                return result;
                            }
                            else
                            {
                                // an unknown entity shape. only thing to do is serialize the object
                                defVal = (defVal as CdmObject).CopyData(null, null);
                            }
                        }
                    }
                    else
                    {
                        // is it a cdm object?
                        if (defVal.getObjectType != null)
                            defVal = (defVal as CdmObject).CopyData(null, null);
                    }
                }
                return defVal;
            }
            return null;
        }

        internal void UpdateDefaultValue(dynamic newDefault)
        {
            if (newDefault is JArray)
            {
                JArray array = (JArray)newDefault;
                int l = array.Count;
                if (l > 0 && array[0]["languageTag"] != null && array[0]["displayText"] != null)
                {
                    // looks like something we understand
                    List<List<string>> tab = new List<List<string>>();
                    var corr = (array[0]["correlatedValue"] != null);
                    for (var i = 0; i < l; i++)
                    {
                        var row = new List<string>
                        {
                            (string)array[i]["languageTag"],
                            (string)array[i]["displayText"],
                            (string)array[i]["attributeValue"],
                            (string)array[i]["displayOrder"]
                        };
                        if (corr)
                            row.Add((string)array[i]["correlatedValue"]);
                        tab.Add(row);
                    }
                    CdmConstantEntityDefinition cEnt = this.Ctx.Corpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef, null, false);
                    cEnt.EntityShape = this.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, corr ? "listLookupCorrelatedValues" : "listLookupValues", true);
                    cEnt.ConstantValues = tab;

                    newDefault = this.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, cEnt, false);
                    this.UpdateTraitArgument("does.haveDefault", "default", newDefault);
                }
                else
                {
                    Logger.Error(this.Host.Ctx, Tag, null, nameof(UpdateDefaultValue), CdmLogCode.ErrValdnMissingLanguageTag);
                }
            }
            else
            {
                Logger.Error(this.Host.Ctx, Tag, null, nameof(UpdateDefaultValue), CdmLogCode.ErrUnsupportedType);
            }
        }

        private static dynamic FetchTraitReferenceArgumentValue(dynamic traitRef, string argName)
        {
            if (traitRef != null)
            {
                dynamic argumentValue;
                ResolvedModel.ResolvedTrait resolvedTrait = traitRef as ResolvedModel.ResolvedTrait;
                if (resolvedTrait?.ParameterValues != null)
                    argumentValue = resolvedTrait.ParameterValues.FetchParameterValueByName(argName).Value;
                else
                    argumentValue = (traitRef as CdmTraitReference).Arguments.FetchValue(argName);
                return argumentValue;
            }
            return null;
        }
    }
}
