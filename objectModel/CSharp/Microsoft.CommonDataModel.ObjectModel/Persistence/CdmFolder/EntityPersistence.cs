// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    using System.Linq;

    class EntityPersistence
    {
        public static CdmEntityDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            var entity = ctx.Corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, (string)obj["entityName"]);
            entity.ExtendsEntity = EntityReferencePersistence.FromData(ctx, obj["extendsEntity"]);
            entity.ExtendsEntityResolutionGuidance = AttributeResolutionGuidancePersistence.FromData(ctx, obj["extendsEntityResolutionGuidance"]);

            entity.Explanation = Utils.PropertyFromDataToString(obj["explanation"]);

            Utils.AddListToCdmCollection(entity.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            if (obj["attributeContext"] != null)
                entity.AttributeContext = AttributeContextPersistence.FromData(ctx, obj["attributeContext"]);

            Utils.AddListToCdmCollection(entity.Attributes, Utils.CreateAttributeList(ctx, obj["hasAttributes"], entity.EntityName));
            entity.SourceName = Utils.PropertyFromDataToString(obj["sourceName"]);
            entity.DisplayName = Utils.PropertyFromDataToString(obj["displayName"]);
            entity.Description = Utils.PropertyFromDataToString(obj["description"]);
            entity.Version = Utils.PropertyFromDataToString(obj["version"]);
            entity.CdmSchemas = obj["cdmSchemas"]?.ToObject<List<string>>();

            return entity;
        }

        public static Entity ToData(CdmEntityDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            Entity obj = new Entity
            {
                Explanation = instance.Explanation,
                EntityName = instance.EntityName,
                ExtendsEntity = Utils.JsonForm(instance.ExtendsEntity, resOpt, options),
                ExtendsEntityResolutionGuidance = Utils.JsonForm(instance.ExtendsEntityResolutionGuidance, resOpt, options),
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits?.AllItems.Where(trait => !trait.IsFromProperty)?.ToList(), options)
            };


            obj.SourceName = instance.GetProperty("sourceName") as string;
            obj.DisplayName = instance.GetProperty("displayName") as string;
            obj.Description = instance.GetProperty("description") as string;
            obj.Version = instance.GetProperty("version") as string;
            obj.CdmSchemas = instance.GetProperty("cdmSchemas") as List<string>;

            // after the properties so they show up first in doc
            obj.HasAttributes = CopyDataUtils.ListCopyData(resOpt, instance.Attributes, options);
            obj.AttributeContext = Utils.JsonForm(instance.AttributeContext, resOpt, options);

            return obj;
        }
    }
}
