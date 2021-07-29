// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Resources;
    using System.Text.RegularExpressions;

    public static class Utils
    {
        /// <summary>
        /// Create a copy of the reference object
        /// </summary>
        public static dynamic CopyIdentifierRef(CdmObjectReference objRef, ResolveOptions resOpt, CopyOptions options)
        {
            string identifier = objRef.NamedReference;
            if (options == null || options.StringRefs == null || options.StringRefs == false)
                return identifier;

            CdmObjectDefinition resolved = objRef.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
            if (resolved == null)
                return identifier;

            return new { AtCorpusPath = resolved.AtCorpusPath, Identifier = identifier };
        }

        /// <summary>
        /// Creates a JSON object in the correct shape given an instance of a CDM object
        /// </summary>
        public static dynamic JsonForm(dynamic instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
                return null;
            dynamic dataForm = instance.CopyData(resOpt, options);
            if (dataForm == null)
                return "serializationError";
            if (dataForm is string)
                return dataForm as string;
            return JToken.FromObject(dataForm, JsonSerializationUtil.JsonSerializer);
        }

        /// <summary>
        /// Converts a JSON object to an Attribute object
        /// </summary>
        public static CdmAttributeItem CreateAttribute(CdmCorpusContext ctx, dynamic obj, string entityName = null)
        {
            if (obj == null)
                return null;

            if (obj is JValue)
                return AttributeGroupReferencePersistence.FromData(ctx, obj);
            else
            {
                if (obj["attributeGroupReference"] != null)
                    return AttributeGroupReferencePersistence.FromData(ctx, obj, entityName);
                else if (obj["entity"] != null)
                    return EntityAttributePersistence.FromData(ctx, obj);
                else if (obj["name"] != null)
                    return TypeAttributePersistence.FromData(ctx, obj, entityName);
            }
            return null;
        }

        /// <summary>
        /// Creates a CDM object from a JSON object
        /// </summary>
        public static dynamic CreateConstant(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;
            if (obj is JValue)
            {
                return obj.Value;
            }
            else if (obj is JObject)
            {
                if (obj["purpose"] != null || obj["dataType"] != null || obj["entity"] != null)
                {
                    if (obj["dataType"] != null)
                        return TypeAttributePersistence.FromData(ctx, obj);
                    else if (obj["entity"] != null)
                        return EntityAttributePersistence.FromData(ctx, obj);
                    else
                        return null;
                }
                else if (obj["purposeReference"] != null)
                    return PurposeReferencePersistence.FromData(ctx, obj);
                else if (obj["traitReference"] != null)
                    return TraitReferencePersistence.FromData(ctx, obj);
                else if (obj["traitGroupReference"] != null)
                    return TraitGroupReferencePersistence.FromData(ctx, obj);
                else if (obj["dataTypeReference"] != null)
                    return DataTypeReferencePersistence.FromData(ctx, obj);
                else if (obj["entityReference"] != null)
                    return EntityReferencePersistence.FromData(ctx, obj);
                else if (obj["attributeGroupReference"] != null)
                    return AttributeGroupReferencePersistence.FromData(ctx, obj);
                else
                    return obj;
            }
            else
            {
                return obj;
            }
        }

        /// <summary>
        /// Converts a JSON object to a CdmCollection of TraitReferences and TraitGroupReferences
        /// </summary>
        public static List<CdmTraitReferenceBase> CreateTraitReferenceList(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
                return null;

            List<CdmTraitReferenceBase> result = new List<CdmTraitReferenceBase>();
            JArray traitRefObj = null;
            if (obj.GetType() == typeof(List<JToken>))
            {
                traitRefObj = JArray.FromObject(obj);
            }
            else if (obj.GetType() != typeof(JArray) && obj["value"] != null && obj["value"].GetType() == typeof(JArray))
            {
                traitRefObj = obj["value"];
            }
            else
            {
                traitRefObj = obj;
            }

            if (traitRefObj != null)
            {
                for (int i = 0; i < traitRefObj.Count; i++)
                {
                    dynamic tr = traitRefObj[i];

                    if (!(tr is JValue) && tr["traitGroupReference"] != null)
                    {
                        result.Add(TraitGroupReferencePersistence.FromData(ctx, tr));
                    }
                    else
                    {
                        result.Add(TraitReferencePersistence.FromData(ctx, tr));
                    }
                }
            }

            return result;
        }

        /// <summary>
        /// Adds all elements of a list to a CdmCollection
        /// </summary>
        public static void AddListToCdmCollection<T>(CdmCollection<T> cdmCollection, List<T> list) where T : CdmObject
        {
            if (cdmCollection != null && list != null)
            {
                foreach (var element in list)
                {
                    cdmCollection.Add(element);
                }
            }
        }

        /// <summary>
        /// Creates a list object that is a copy of the input IEnumerable object
        /// </summary>
        public static List<T> ListCopyData<T>(ResolveOptions resOpt, IEnumerable<dynamic> source, CopyOptions options)
        {
            if (source == null)
                return null;
            List<T> casted = new List<T>();
            foreach (var element in source)
            {
                T newElement = ((CdmObject)element)?.CopyData(resOpt, options);
                casted.Add(newElement);
            }
            if (casted.Count == 0)
                return null;
            return casted;
        }

        /// <summary>
        /// Converts dynamic input into a string for a property (ints are converted to string)
        /// </summary>
        /// <param name="value">The value that should be converted to a string.</param>
        internal static string PropertyFromDataToString(dynamic value)
        {
            string stringValue = (string)value;
            if (!string.IsNullOrWhiteSpace(stringValue))
            {
                return stringValue;
            }
            else if (value is int)
            {
                return value.ToString();
            }
            return null;
        }

        internal static CdmTraitReference CreateCsvTrait(IDictionary<string, JToken> obj, CdmCorpusContext ctx)
        {
            var csvFormatTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "is.partition.format.CSV", true);
            csvFormatTrait.SimpleNamedReference = false;

            if (obj != null)
            {
                if (obj.ContainsKey("header"))
                {
                    var columnHeadersArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "columnHeaders");
                    columnHeadersArg.Value = obj["header"];
                    csvFormatTrait.Arguments.Add(columnHeadersArg);
                }
                if (obj.ContainsKey("csvStyle"))
                {
                    var csvStyleArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "csvStyle");
                    csvStyleArg.Value = obj["csvStyle"];
                    csvFormatTrait.Arguments.Add(csvStyleArg);
                }
                if (obj.ContainsKey("field.delim"))
                {
                    var delimiterArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "delimiter");
                    delimiterArg.Value = obj["field.delim"];
                    csvFormatTrait.Arguments.Add(delimiterArg);
                }
                if (obj.ContainsKey("quoteStyle"))
                {
                    var quoteStyleArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "quoteStyle");
                    quoteStyleArg.Value = obj["quoteStyle"];
                    csvFormatTrait.Arguments.Add(quoteStyleArg);
                }
                if (obj.ContainsKey("quote"))
                {
                    var quoteArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "quote");
                    quoteArg.Value = obj["quote"];
                    csvFormatTrait.Arguments.Add(quoteArg);
                }
                if (obj.ContainsKey("encoding"))
                {
                    var encodingArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "encoding");
                    encodingArg.Value = obj["encoding"];
                    csvFormatTrait.Arguments.Add(encodingArg);
                }
                if (obj.ContainsKey("escape"))
                {
                    var escapeArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "escape");
                    escapeArg.Value = obj["escape"];
                    csvFormatTrait.Arguments.Add(escapeArg);
                }
                if (obj.ContainsKey("newline"))
                {
                    var newlineArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "newline");
                    newlineArg.Value = obj["newline"];
                    csvFormatTrait.Arguments.Add(newlineArg);
                }
                if (obj.ContainsKey("skipLines"))
                {
                    var skipLinesArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "skipLines");
                    skipLinesArg.Value = obj["skipLines"];
                    csvFormatTrait.Arguments.Add(skipLinesArg);
                }
                if (obj.ContainsKey("inferSchema"))
                {
                    var inferSchemaArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "inferSchema");
                    inferSchemaArg.Value = obj["inferSchema"];
                    csvFormatTrait.Arguments.Add(inferSchemaArg);
                }
                if (obj.ContainsKey("timestampFormat"))
                {
                    var timestampFormatArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "timestampFormat");
                    timestampFormatArg.Value = obj["timestampFormat"];
                    csvFormatTrait.Arguments.Add(timestampFormatArg);
                }
                if (obj.ContainsKey("ignoreTrailingWhiteSpace"))
                {
                    var ignoreTrailingWhiteSpaceArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "ignoreTrailingWhiteSpace ");
                    ignoreTrailingWhiteSpaceArg.Value = obj["ignoreTrailingWhiteSpace"];
                    csvFormatTrait.Arguments.Add(ignoreTrailingWhiteSpaceArg);
                }
                if (obj.ContainsKey("ignoreLeadingWhiteSpace"))
                {
                    var ignoreLeadingWhiteSpaceArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "ignoreLeadingWhiteSpace");
                    ignoreLeadingWhiteSpaceArg.Value = obj["ignoreLeadingWhiteSpace"];
                    csvFormatTrait.Arguments.Add(ignoreLeadingWhiteSpaceArg);
                }
                if (obj.ContainsKey("multiLine"))
                {
                    var multilineArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, "multiLine");
                    multilineArg.Value = obj["multiLine"];
                    csvFormatTrait.Arguments.Add(multilineArg);
                }
            }
            return csvFormatTrait;
        }

        /// <summary>
        /// Creates a JSON object of syms tables in the correct shape given an instance of a symsManifestContent object.
        /// </summary>
        internal static string GetTablesPayload(List<TableEntity> symsTables, DDLType dDLType)
        {
            string retValue;
            IList<DDLPayload> DDLs = new List<DDLPayload>();

            foreach (var entity in symsTables)
            {
                DDLPayload dDlPayloadEntity = new DDLPayload();
                dDlPayloadEntity.ActionType = dDLType;
                switch (dDLType)
                {
                    case DDLType.CREATE:
                        dDlPayloadEntity.NewEntity = entity;
                        break;
                    case DDLType.DROP:
                        dDlPayloadEntity.OldEntity = entity;
                        break;
                    default:
                        return null;
                }

                DDLs.Add(dDlPayloadEntity);
            }

            DDLBatch dDLBatch = new DDLBatch(DDLs);
            retValue = JsonConvert.SerializeObject(dDLBatch, Formatting.Indented,
               new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

            return retValue;
        }

        /// <summary>
        /// Creates a JSON object of syms relationship in the correct shape given an instance of a symsManifestContent object.
        /// </summary>
        internal static string GetRelationshipPayload(List<RelationshipEntity> relationshipEntities, DDLType dDLType)
        {
            string retValue;
            IList<DDLPayload> DDLs = new List<DDLPayload>();

            foreach (var entity in relationshipEntities)
            {
                DDLPayload dDlPayloadEntity = new DDLPayload();
                dDlPayloadEntity.ActionType = dDLType;
                switch (dDLType)
                {
                    case DDLType.CREATE:
                        dDlPayloadEntity.NewEntity = entity;
                        break;
                    case DDLType.DROP:
                        dDlPayloadEntity.OldEntity = entity;
                        break;
                    default:
                        return null;
                }

                DDLs.Add(dDlPayloadEntity);
            }

            DDLBatch dDLBatch = new DDLBatch(DDLs);
            retValue = JsonConvert.SerializeObject(dDLBatch, Formatting.Indented,
               new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

            return retValue;
        }

        /// <summary>
        /// Creates a JSON object of syms database in the correct shape given an instance of a symsManifestContent object.
        /// </summary>
        internal static string GetDBPayload(SymsManifestContent symsManifestContent, DDLType dDLType)
        {
            string retValue;
            IList<DDLPayload> DDLs = new List<DDLPayload>();
            DDLPayload dDlPayloadEntity = new DDLPayload();
            dDlPayloadEntity.ActionType = dDLType;
            switch (dDLType)
            {
                case DDLType.CREATE:
                    dDlPayloadEntity.NewEntity = symsManifestContent.Database;
                    break;
                case DDLType.DROP:
                    dDlPayloadEntity.OldEntity = symsManifestContent.Database;
                    break;
                default:
                    return null;
            }

            DDLs.Add(dDlPayloadEntity);
            DDLBatch dDLBatch = new DDLBatch(DDLs);

            retValue = JsonConvert.SerializeObject(dDLBatch, Formatting.Indented,
                new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
            return retValue;
        }

        /// <summary>
        /// check if adapter is syms.
        /// </summary>
        internal static bool CheckIfSymsAdapter(StorageAdapter adapter)
        {
            if (adapter.GetType().ToString().Equals("Microsoft.CommonDataModel.ObjectModel.Storage.SymsAdapter")
                || adapter.GetType().ToString().Equals("Microsoft.CommonDataModel.ObjectModel.Adapter.Syms"))
                return true;
            return false;
        }

        /// <summary>
        /// Get Syms database name from input path.
        /// </summary>
        internal static bool TryGetDBName(string path, out string DbName)
        {
            DbName = "";
            if (path.StartsWith("/"))
            {
                path = path.TrimStart('/');
            }
            string[] paths = path.Split('/');
            if (paths.Length > 1)
            {
                DbName = paths[0];
                return true;
            }
            return false;
        }

        /// <summary>
        /// Convert syms path to adls path.
        /// </summary>
        public static string SymsPathToAdlsAdapterPath(string symsPath)
        {
            if (!symsPath.StartsWith("abfss://") || Regex.Matches(symsPath, "abfss://").Count != 1)
                return null;

            symsPath = symsPath.TrimEnd('/');

            string[] stringSeparators = new string[] { "abfss://", "@", "/" };
            var paths = symsPath.Split(stringSeparators, StringSplitOptions.None);

            if (paths.Length > 2)
            {
                string retValue = $"https://{paths[2]}/{paths[1]}";
                for (int i = 3; i < paths.Length; i++)
                {
                    if (paths[i] == "")
                        return null;
                    retValue = $"{retValue}/{paths[i]}";
                }

                return retValue;
            }
            return null;
        }

        /// <summary>
        /// Convert adls adapter path to syms path.
        /// </summary>
        public static string AdlsAdapterPathToSymsPath(string adlsPath)
        {
            if (!adlsPath.StartsWith("https://") || Regex.Matches(adlsPath, "https://").Count != 1)
                return null;

            adlsPath = adlsPath.TrimEnd('/');

            string[] stringSeparators = new string[] { "https://", "/" };
            var paths = adlsPath.Split(stringSeparators, StringSplitOptions.None);

            if (paths.Length > 2)
            {
                string retValue = $"abfss://{paths[2]}@{paths[1]}";
                for (int i = 3; i < paths.Length; i++)
                {
                    if (paths[i] == "")
                        return null;
                    retValue = $"{retValue}/{paths[i]}";
                }
                return retValue;
            }

            return null;
        }

        /// <summary>
        /// Convert syms path to corpus path.
        /// </summary>
        public static string SymsPathToCorpusPath(string symsPath, StorageManager strgMgr)
        {
            var adlsPath = Utils.SymsPathToAdlsAdapterPath(symsPath);
            string corpusPath = strgMgr.AdapterPathToCorpusPath(adlsPath);
            if (corpusPath == null)
            {
                Tuple<string, string> pathTuple = Utils.CreateAndMountAdlsAdapterFromAdlsPath(strgMgr, adlsPath);
                if (pathTuple == null)
                {
                    throw new Exception($"Couldn't found adls adapter which can map to adls path : '{adlsPath}'. " +
                        $"Path recieved from syms : { symsPath }. Tried to generate new adls adapter but failed.");
                }

                //Try again
                corpusPath = strgMgr.AdapterPathToCorpusPath(adlsPath);
            }
            return corpusPath;
        }

        /// <summary>
        /// Convert corpus path to syms path.
        /// </summary>
        public static string CorpusPathToSymsPath(string corpusPath, StorageManager strgMgr)
        {
            Tuple<string, string> pathTuple = StorageUtils.SplitNamespacePath(corpusPath);
            if (pathTuple.Item1 != "")
            {
                var adlsPath = strgMgr.CorpusPathToAdapterPath(corpusPath);
                if (adlsPath != null)
                {
                    var symsPath = Utils.AdlsAdapterPathToSymsPath(adlsPath);
                    if (symsPath != null)
                    {
                        return symsPath;
                    }
                }
            }
            return null;
        }

        /// <summary>
        /// Create adls config using namespace, storage account name and container name.
        /// </summary>
        private static JObject AdlsConfig(string ns, string hostName, string containerName)
        {
            if (!hostName.EndsWith(".dfs.core.windows.net"))
                hostName = hostName + ".dfs.core.windows.net";

            string json = $"{{ 'adapters': [ {{ 'type': 'adls', 'namespace': '{ns}', 'config': {{ 'hostname': '{hostName}', 'root': '{containerName}' }} }}]}}";
            return JObject.Parse(json);
        }

        /// <summary>
        /// Get storage name and container name from adls path
        /// </summary>
        private static Tuple<string, string> SplitStorageNameFSFromAdlsPath(string path)
        {
            // validation
            if (!path.StartsWith("https://") || Regex.Matches(path, "https://").Count != 1)
                return null;

            path = path.TrimEnd('/');
            string[] stringSeparators = new string[] { "https://", "/" };

            var paths = path.Split(stringSeparators, StringSplitOptions.None);
            if (paths.Length > 2)
            {
                if (paths[1].EndsWith(".dfs.core.windows.net"))
                {
                    return new Tuple<string, string>(paths[1].Replace(".dfs.core.windows.net", ""), paths[2]);
                }
            }
            return null;
        }

        /// <summary>
        /// Get storage name and container name from syms path
        /// </summary>
        private static Tuple<string, string> SplitStorageNameFSFromSymsPath(string path)
        {
            // validation
            if (!path.StartsWith("abfss://") || Regex.Matches(path, "abfss://").Count != 1)
                return null;

            path = path.TrimEnd('/');
            string[] stringSeparators = new string[] { "abfss://", "@", "/" };

            var paths = path.Split(stringSeparators, StringSplitOptions.None);
            if (paths.Length > 2)
            {
                if (paths[2].EndsWith(".dfs.core.windows.net"))
                {
                    return new Tuple<string, string>(paths[2].Replace(".dfs.core.windows.net", ""), paths[1]);
                }
            }
            return null;
        }

        /// <summary>
        /// Create source trait for syms Rest call.
        /// </summary>
        public static CdmTraitReference CreateSourceTrait(CdmCorpusContext ctx, string traitName, string traitArgName, string traitArgValue = null)
        {
            if (traitArgValue == null)
                traitArgValue = "adlsadapter:/";

            var sourceTrait = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, traitName, true);
            sourceTrait.SimpleNamedReference = false;
            var prefixArg = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef, traitArgName);
            prefixArg.Value = traitArgValue;
            sourceTrait.Arguments.Add(prefixArg);

            return sourceTrait;
        }

        /// <summary>
        /// Create syms absolute path from syms root path, if path is relative.
        /// </summary>
        public static string CreateSymsAbsolutePath(string root, string path)
        {
            if (!root.StartsWith("abfss://"))
            {
                return null;
            }

            if (!path.StartsWith("abfss://"))
            {
                path = $"{root.TrimEnd('/')}/{path.TrimStart('/')}";
            }

            return path;
        }

        /// <summary>
        /// Try and create generate unique namesapce.
        /// </summary>
        private static string TryGetUniqueNs(StorageManager strgMgr)
        {
            if (strgMgr != null)
            {
                int count = 0;
                string ns;
                do
                {
                    ns = $"adls{new Random().Next(1, 100)}";
                    if (null == strgMgr.FetchAdapter(ns))
                        return ns; // lucky got it!!
                } while (++count < 10);
            }
            return null;
        }

        /// <summary>
        /// Create and mount adls adapter using adls path.
        /// </summary>
        public static Tuple<string, string> CreateAndMountAdlsAdapterFromAdlsPath(StorageManager strgMgr, string adlsPath)
        {
            string ns = Utils.TryGetUniqueNs(strgMgr);
            if (ns == null)
            {
                return null;
            }
            return CreateAndMountAdlsAdapterFromAdlsPath(strgMgr, adlsPath, ns);
        }

        /// <summary>
        /// Create and mount adls adapter using adls path and namespace.
        /// </summary>
        public static Tuple<string, string> CreateAndMountAdlsAdapterFromAdlsPath(StorageManager strgMgr, string adlsPath, string ns)
        {
            Tuple<string, string> pathTupleAdls = Utils.SplitStorageNameFSFromAdlsPath(adlsPath);
            var config = Utils.AdlsConfig(ns, pathTupleAdls.Item1, pathTupleAdls.Item2).ToString();
            List<string> error = strgMgr.MountFromConfig(config, true);
            if (error.Count > 0)
            {
                return null;
            }

            return new Tuple<string, string>(ns, adlsPath);
        }

        public static string ExtractTableNameFromEntityPath(string enitityPath)
        {
            string[] paths = enitityPath.Split('/');
            if (paths.Length > 0)
                if (!paths[paths.Length - 1].EndsWith(".cdm.json"))
                    return paths[paths.Length - 1];
            return null;
        }

        /// <summary>
        /// Convert syms data type to CDM data type.
        /// </summary>
        public static CdmDataFormat SymsDataTypeToCDMDataFormat(TypeInfo typeInfo)
        {
            switch (typeInfo.TypeName.ToLower())
            {
                case "byte":
                    return CdmDataFormat.Byte;
                case "binary":
                    return CdmDataFormat.Binary;
                case "float":
                    return CdmDataFormat.Float;
                case "string":
                    if (typeInfo.Length == 1)
                        return CdmDataFormat.Char;
                    else if (typeInfo.Length > 1)
                        return CdmDataFormat.Guid;
                    if (typeInfo.Properties.ContainsKey("json"))
                        return CdmDataFormat.Json;
                    else if (typeInfo.Properties.ContainsKey("dateTimeOffset"))
                        return CdmDataFormat.DateTimeOffset;
                    return CdmDataFormat.String;
                case "char":
                    return CdmDataFormat.String;
                case "long":
                    return CdmDataFormat.Int64;
                case "integer":
                    return CdmDataFormat.Int32;
                case "double":
                    return CdmDataFormat.Double;
                case "date":
                    return CdmDataFormat.Date;
                case "timestamp":
                    if (typeInfo.Properties.ContainsKey("dateTime"))
                        return CdmDataFormat.DateTime;
                    return CdmDataFormat.Time;
                case "decimal":
                    return CdmDataFormat.Decimal;
                case "boolean":
                    return CdmDataFormat.Boolean;
                default:
                    return CdmDataFormat.Unknown;
            }
        }

        /// <summary>
        /// Convert syms data type to CDM data type.
        /// </summary>
        public static TypeInfo CDMDataFormatToSymsDataType(CdmDataFormat cdmDataFormat, TypeInfo typeInfo)
        {
            switch (cdmDataFormat)
            {
                case CdmDataFormat.Byte:
                    typeInfo.TypeName = "byte";
                    break;
                case CdmDataFormat.Binary:
                    typeInfo.TypeName = "binary";
                    break;
                case CdmDataFormat.Float:
                     typeInfo.TypeName = "float";
                    break;
                case CdmDataFormat.Char:
                     typeInfo.TypeName = "string";
                     typeInfo.Length = 1;
                    break;
                case CdmDataFormat.String:
                     typeInfo.TypeName = "string";
                    break;
                case CdmDataFormat.Guid:
                     typeInfo.TypeName = "string";
                     typeInfo.Properties["guid"] = true;
                    break;
                case CdmDataFormat.Json:
                     typeInfo.TypeName = "string";
                     typeInfo.Properties["json"] = true;
                    break;
                case CdmDataFormat.DateTimeOffset:
                     typeInfo.TypeName = "string";
                     typeInfo.Properties["dateTimeOffset"] = true;
                    break;
                case CdmDataFormat.Int64:
                     typeInfo.TypeName = "long";
                    break;
                case CdmDataFormat.Int32:
                     typeInfo.TypeName = "integer";
                    break;
                case CdmDataFormat.Double:
                     typeInfo.TypeName = "double";
                    break;
                case CdmDataFormat.Date:
                     typeInfo.TypeName = "date";
                    break;
                case CdmDataFormat.DateTime:
                     typeInfo.TypeName = "timestamp";
                    typeInfo.Properties["dateTime"] = true;
                    break;
                case CdmDataFormat.Time:
                     typeInfo.TypeName = "timestamp";
                    break;
                case CdmDataFormat.Decimal:
                     typeInfo.TypeName = "decimal";
                    break;
                case CdmDataFormat.Boolean:
                     typeInfo.TypeName = "boolean";
                    break;
                default:
                    return null;
            }
            return typeInfo;
        }
    }
}