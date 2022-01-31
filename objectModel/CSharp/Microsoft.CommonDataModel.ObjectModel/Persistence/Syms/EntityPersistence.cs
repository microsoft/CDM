// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System.Collections.Generic;
    using System.Linq;

    class EntityPersistence
    {
        private static readonly string Tag = nameof(EntityPersistence);

        public static CdmEntityDefinition FromData(CdmCorpusContext ctx, string name, TableEntity table)
        {
            if (table == null)
            {
                return null;
            }
            TableProperties teProperties = ((JToken)table.Properties).ToObject<TableProperties>();
            var entity = ctx.Corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, name);

            entity.DisplayName = entity.EntityName;

            if (teProperties.Properties != null)
            {
                if (teProperties.Properties.ContainsKey("cdm:explanation"))
                {
                    entity.Explanation = teProperties.Properties["cdm:explanation"].ToObject<string>();
                }
                if (teProperties.Properties.ContainsKey("cdm:cdmSchemas"))
                {
                    entity.CdmSchemas = teProperties.Properties["cdm:cdmSchemas"].ToObject<List<string>>();
                }
                if (teProperties.Properties.ContainsKey("cdm:sourceName"))
                {
                    entity.SourceName = teProperties.Properties["cdm:sourceName"].ToObject<string>();
                }
                if (teProperties.Properties.ContainsKey("cdm:description"))
                {
                    entity.SourceName = teProperties.Properties["cdm:description"].ToObject<string>();
                }
                if (teProperties.Properties.ContainsKey("cdm:version"))
                {
                    entity.Version = teProperties.Properties["cdm:version"].ToObject<string>();
                }
                if (teProperties.Properties.ContainsKey("cdm:traits"))
                {
                    var traitList = Utils.CreateTraitReferenceList(ctx, teProperties.Properties["cdm:traits"]);
                    var traitDic = entity.ExhibitsTraits.ToDictionary(x => x.NamedReference, x => x);
                    foreach (var trait in traitList)
                    {
                        if (traitDic.ContainsKey(trait.NamedReference))
                        {
                            entity.ExhibitsTraits.Remove(trait.NamedReference);
                        }
                    }
                    Utils.AddListToCdmCollection(entity.ExhibitsTraits, traitList);
                }
            }

            if (teProperties.StorageDescriptor != null && teProperties.StorageDescriptor.Columns != null)
            {
                foreach (var attribute in teProperties.StorageDescriptor.Columns)
                {
                    var typeAttribute = TypeAttributePersistence.FromData(ctx, attribute, name);
                    if (typeAttribute != null)
                    {
                        entity.Attributes.Add(typeAttribute);
                    }
                    else
                    {
                        Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistSymsAttrConversionFailure, name, attribute.Name);
                        return null;
                    }
                }
            }
            else
            {
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistSymsAttrConversionError, name);
                return null;
            }
            return entity;
        }

        public static TableEntity ToData(CdmEntityDefinition instance, CdmCorpusContext ctx,ResolveOptions resOpt, CopyOptions options)
        {
            var properties = CreateTablePropertyBags(instance, resOpt, options);
            var columns = new List<DataColumn>();
            
            foreach (var attribute in instance.Attributes)
            {
                columns.Add(TypeAttributePersistence.ToData(attribute as CdmTypeAttributeDefinition, ctx, resOpt, options));
            }

            var storageDescriptor = new StorageDescriptor
            {
                Source = new DataSource(),
                Format = new FormatInfo(),
                Columns = columns
            };

            TableProperties teProperties = new TableProperties
            {
                Properties = properties,
                Partitioning = new TablePartitioning(),
                StorageDescriptor = storageDescriptor
            };

            return new TableEntity
            {
                Name = instance.EntityName,
                Type = SASEntityType.TABLE,
                Properties = teProperties
            };
        }

        private static Dictionary<string, JToken> CreateTablePropertyBags(CdmEntityDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var properties = new Dictionary<string, JToken>();

            if (instance.Explanation != null)
            {
                properties["cdm:explanation"] = JToken.FromObject(instance.Explanation);
            }

            if (instance.SourceName != null)
            {
                properties["cdm:sourceName"] = JToken.FromObject(instance.SourceName);
            }

            if (instance.DisplayName != null)
            {
                properties["cdm:displayName"] = JToken.FromObject(instance.DisplayName);
            }

            if (instance.Description != null)
            {
                properties["cdm:description"] = JToken.FromObject(instance.Description);
            }

            if (instance.ExhibitsTraits != null && instance.ExhibitsTraits.Count > 0)
            {
                properties["cdm:traits"] = JToken.FromObject(Utils.ListCopyData<TraitReferenceDefinition>(resOpt, instance.ExhibitsTraits, options),
                    new JsonSerializer { NullValueHandling = NullValueHandling.Ignore, ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }

            return properties;
        }
    }
}
