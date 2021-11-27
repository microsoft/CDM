// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    internal class ParameterValue
    {
        public CdmParameterDefinition Parameter { get; set; }
        public dynamic Value { get; set; }
        internal CdmCorpusContext Ctx { get; set; }

        public string Name
        {
            get
            {
                return this.Parameter.Name;
            }
        }

        public ParameterValue(CdmCorpusContext ctx, CdmParameterDefinition parameter, dynamic value)
        {
            this.Parameter = parameter;
            this.Value = value;
            this.Ctx = ctx;
        }

        public string FetchValueString(ResolveOptions resOpt)
        {
            if (this.Value == null)
            {
                return "";
            }

            if (this.Value is string || this.Value is JValue)
            {
                return (string)this.Value;
            }
            if (Value is CdmObject value)
            {
                CdmObjectDefinition def = value.FetchObjectDefinition<CdmObjectDefinition>(resOpt);
                if (value.ObjectType == CdmObjectType.EntityRef && def?.ObjectType == CdmObjectType.ConstantEntityDef)
                {
                    CdmEntityReference entShape = (def as CdmConstantEntityDefinition).EntityShape;
                    List<List<string>> entValues = (def as CdmConstantEntityDefinition).ConstantValues;
                    if (entValues == null || entValues?.Count == 0)
                    {
                        return "";
                    }
                    List<IDictionary<string, string>> rows = new List<IDictionary<string, string>>();
                    ResolvedAttributeSet shapeAtts = entShape.FetchResolvedAttributes(resOpt);
                    if (shapeAtts != null && shapeAtts.Set != null && shapeAtts.Set.Count > 0)
                    {
                        for (int r = 0; r < entValues.Count; r++)
                        {
                            List<string> rowData = entValues[r];
                            IDictionary<string, string> row = new SortedDictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                            if (rowData?.Count > 0)
                            {
                                for (int c = 0; c < rowData.Count; c++)
                                {
                                    string tvalue = rowData[c];
                                    ResolvedAttribute colAtt = shapeAtts.Set[c];
                                    if (colAtt != null)
                                        row.Add(colAtt.ResolvedName, tvalue);
                                }
                                rows.Add(row);
                            }
                        }
                    }
                    return JsonConvert.SerializeObject(rows, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
                }
                dynamic data = value.CopyData(resOpt, new CopyOptions { StringRefs = false });
                if (data is string)
                {
                    return (string)data;
                }

                return JsonConvert.SerializeObject(data, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }
            return "";
        }

        public void SetValue(ResolveOptions resOpt, dynamic newValue)
        {
            this.Value = ParameterValue.FetchReplacementValue(resOpt, this.Value, newValue, true);
        }

        public static dynamic FetchReplacementValue(ResolveOptions resOpt, dynamic oldValue, dynamic newValue, bool wasSet)
        {
            if (oldValue == null)
                return newValue;

            if (!wasSet)
            {
                // must explicitly set a value to override
                // if a new value is not set, then newValue holds nothing or the default.
                // in this case, if there was already a value in this argument then just keep using it.
                return oldValue;
            }

            if (oldValue is string)
            {
                return newValue;
            }
            CdmObject ov = oldValue as CdmObject;
            CdmObject nv = newValue as CdmObject;
            // replace an old table with a new table? actually just mash them together
            if (ov != null && ov.ObjectType == CdmObjectType.EntityRef &&
                nv != null && nv.GetType() != typeof(string) && nv.ObjectType == CdmObjectType.EntityRef)
            {
                var oldEnt = ov.FetchObjectDefinition<CdmConstantEntityDefinition>(resOpt);
                var newEnt = nv.FetchObjectDefinition<CdmConstantEntityDefinition>(resOpt);

                // check that the entities are the same shape
                if (newEnt == null)
                    return ov;

                // BUG
                CdmEntityDefinition entDefShape = null;
                if (oldEnt == null || ((entDefShape = oldEnt.EntityShape.FetchObjectDefinition<CdmEntityDefinition>(resOpt)) != newEnt.EntityShape.FetchObjectDefinition<CdmEntityDefinition>(resOpt)))
                    return nv;

                var oldCv = oldEnt.ConstantValues;
                var newCv = newEnt.ConstantValues;
                // rows in old?
                if (oldCv == null || oldCv.Count == 0)
                    return nv;
                // rows in new?
                if (newCv == null || newCv.Count == 0)
                    return ov;

                // make a set of rows in the old one and add the new ones. this will union the two
                // find rows in the new one that are not in the old one. slow, but these are small usually
                IDictionary<string, List<string>> unionedRows = new Dictionary<string, List<string>>();

                // see if any of the entity atts are the primary key, meaning, the only thing that causes us to merge dups unique.
                // i know this makes you think about a snake eating its own tail, but fetch the resolved attributes of the constant shape
                int pkAtt = -1;
                if (entDefShape != null)
                {
                    var resOptShape = new ResolveOptions(entDefShape.InDocument);
                    var resAttsShape = entDefShape.FetchResolvedAttributes(resOptShape);
                    if (resAttsShape != null)
                    {
                        pkAtt = resAttsShape.Set.FindIndex((ra) => ra.ResolvedTraits.Find(resOptShape, "is.identifiedBy") != null);
                    }
                }

                for (int i = 0; i < oldCv.Count; i++)
                {
                    List<string> row = oldCv[i];
                    string key;
                    // the entity might have a PK, if so, only look at that values as the key
                    if (pkAtt != -1)
                    {
                        key = row[pkAtt];
                    }
                    else 
                    {
                        key  = row.Aggregate((prev, curr) =>
                        {
                            return $"{(!string.IsNullOrEmpty(prev) ? prev : "")}::{curr}";
                        });
                    }
                    unionedRows[key] = row;
                }

                for (int i = 0; i < newCv.Count; i++)
                {
                    List<string> row = newCv[i];
                    string key;
                    // the entity might have a PK, if so, only look at that values as the key
                    if (pkAtt != -1)
                    {
                        key = row[pkAtt];
                    }
                    else 
                    {
                        key  = row.Aggregate((prev, curr) =>
                        {
                            return $"{(!string.IsNullOrEmpty(prev) ? prev : "")}::{curr}";
                        });
                    }
                    unionedRows[key] = row;
                }

                if (unionedRows.Count == oldCv.Count)
                    return ov;
                List<List<string>> allRows = unionedRows.Values.ToList();

                CdmConstantEntityDefinition replacementEnt = (CdmConstantEntityDefinition)oldEnt.Copy(resOpt);
                replacementEnt.ConstantValues = allRows;
                return resOpt.WrtDoc.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, replacementEnt, false);
            }

            return newValue;

        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent)
        {
            to.SpewLine($"{indent}{this.Name}:{this.FetchValueString(resOpt)}");
        }
    }
}
