// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Linq;

    class AttributeContextPersistence
    {
        public static CdmAttributeContext FromData(CdmCorpusContext ctx, dynamic obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmAttributeContext attributeContext = ctx.Corpus.MakeObject<CdmAttributeContext>(CdmObjectType.AttributeContextDef, obj.Value<string>("name"), false);
            attributeContext.Type = MapTypeNameToEnum(obj.Value<string>("type"));
            if (obj.Value<string>("parent") != null)
                attributeContext.Parent = AttributeContextReferencePersistence.FromData(ctx, obj.Value<string>("parent"));
            string explanation = obj.Value<string>("explanation");
            if (!string.IsNullOrEmpty(explanation))
                attributeContext.Explanation = explanation;
            if (obj.Value<string>("definition") != null)
            {
                switch (attributeContext.Type)
                {
                    case CdmAttributeContextType.Entity:
                    case CdmAttributeContextType.EntityReferenceExtends:
                        attributeContext.Definition = EntityReferencePersistence.FromData(ctx, obj.Value<string>("definition"));
                        break;
                    case CdmAttributeContextType.AttributeGroup:
                        attributeContext.Definition = AttributeGroupReferencePersistence.FromData(ctx, obj.Value<string>("definition"));
                        break;
                    case CdmAttributeContextType.AddedAttributeSupporting:
                    case CdmAttributeContextType.AddedAttributeIdentity:
                    case CdmAttributeContextType.AddedAttributeExpansionTotal:
                    case CdmAttributeContextType.AddedAttributeSelectedType:
                    case CdmAttributeContextType.AttributeDefinition:
                        attributeContext.Definition = AttributeReferencePersistence.FromData(ctx, obj.Value<string>("definition"));
                        break;
                }
            }
            // i know the trait collection names look wrong. but I wanted to use the def baseclass
            Utils.AddListToCdmCollection(attributeContext.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj.Value<JToken>("appliedTraits")));
            if (obj.Value<JToken>("contents") != null)
            {
                for (int i = 0; i < obj.Value<JToken>("contents").Count; i++)
                {
                    JToken ct = obj.Value<JToken>("contents")[i];
                    if (ct is JValue)
                        attributeContext.Contents.Add(AttributeReferencePersistence.FromData(ctx, (string)ct));
                    else
                        attributeContext.Contents.Add(FromData(ctx, ct));
                }
            }
            if (obj.Value<JToken>("lineage") != null)
            {
                attributeContext.Lineage = new CdmCollection<CdmAttributeContextReference>(ctx, attributeContext, CdmObjectType.AttributeContextRef);
                for (int i = 0; i < obj.Value<JToken>("lineage").Count; i++)
                {
                    JToken ct = obj.Value<JToken>("lineage")[i];
                    attributeContext.Lineage.Add(AttributeContextReferencePersistence.FromData(ctx, ct));
                }
            }

            return attributeContext;
        }

        public static dynamic ToData(CdmAttributeContext instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new AttributeContext
            {
                Explanation = instance.Explanation,
                Name = instance.Name,
                Type = MapEnumToTypeName(instance.Type.Value),
                Parent = instance.Parent?.CopyData(resOpt, options) as string,
                Definition = instance.Definition?.CopyData(resOpt, options) as string,
                // i know the trait collection names look wrong. but I wanted to use the def baseclass
                AppliedTraits = Utils.ListCopyData<dynamic>(resOpt, instance.ExhibitsTraits?.Where(trait => !trait.IsFromProperty)?.ToList(), options)?.ConvertAll<JToken>(t => JToken.FromObject(t, JsonSerializationUtil.JsonSerializer)),
                Contents = Utils.ListCopyData<dynamic>(resOpt, instance.Contents, options)?.ConvertAll<JToken>(t => JToken.FromObject(t, JsonSerializationUtil.JsonSerializer)),
                Lineage = Utils.ListCopyData<dynamic>(resOpt, instance.Lineage, options)?.ConvertAll<JToken>(t => JToken.FromObject(t, JsonSerializationUtil.JsonSerializer))
            };
        }

        private static CdmAttributeContextType? MapTypeNameToEnum(string typeName)
        {
            switch (typeName)
            {
                case "entity":
                    return CdmAttributeContextType.Entity;
                case "entityReferenceExtends":
                    return CdmAttributeContextType.EntityReferenceExtends;
                case "attributeGroup":
                    return CdmAttributeContextType.AttributeGroup;
                case "attributeDefinition":
                    return CdmAttributeContextType.AttributeDefinition;
                case "addedAttributeSupporting":
                    return CdmAttributeContextType.AddedAttributeSupporting;
                case "addedAttributeIdentity":
                    return CdmAttributeContextType.AddedAttributeIdentity;
                case "addedAttributeExpansionTotal":
                    return CdmAttributeContextType.AddedAttributeExpansionTotal;
                case "addedAttributeSelectedType":
                    return CdmAttributeContextType.AddedAttributeSelectedType;
                case "generatedRound":
                    return CdmAttributeContextType.GeneratedRound;
                case "generatedSet":
                    return CdmAttributeContextType.GeneratedSet;
                case "projection":
                    return CdmAttributeContextType.Projection;
                case "source":
                    return CdmAttributeContextType.Source;
                case "operations":
                    return CdmAttributeContextType.Operations;
                case "operationAddCountAttribute":
                    return CdmAttributeContextType.OperationAddCountAttribute;
                case "operationAddSupportingAttribute":
                    return CdmAttributeContextType.OperationAddSupportingAttribute;
                case "operationAddTypeAttribute":
                    return CdmAttributeContextType.OperationAddTypeAttribute;
                case "operationExcludeAttributes":
                    return CdmAttributeContextType.OperationExcludeAttributes;
                case "operationArrayExpansion":
                    return CdmAttributeContextType.OperationArrayExpansion;
                case "operationCombineAttributes":
                    return CdmAttributeContextType.OperationCombineAttributes;
                case "operationRenameAttributes":
                    return CdmAttributeContextType.OperationRenameAttributes;
                case "operationReplaceAsForeignKey":
                    return CdmAttributeContextType.OperationReplaceAsForeignKey;
                case "operationIncludeAttributes":
                    return CdmAttributeContextType.OperationIncludeAttributes;
                case "operationAddAttributeGroup":
                    return CdmAttributeContextType.OperationAddAttributeGroup;
                default:
                    return CdmAttributeContextType.Unknown;
            }
        }

        private static string MapEnumToTypeName(CdmAttributeContextType enumVal)
        {
            switch (enumVal)
            {
                case CdmAttributeContextType.Entity:
                    return "entity";
                case CdmAttributeContextType.EntityReferenceExtends:
                    return "entityReferenceExtends";
                case CdmAttributeContextType.AttributeGroup:
                    return "attributeGroup";
                case CdmAttributeContextType.AttributeDefinition:
                    return "attributeDefinition";
                case CdmAttributeContextType.AddedAttributeSupporting:
                    return "addedAttributeSupporting";
                case CdmAttributeContextType.AddedAttributeIdentity:
                    return "addedAttributeIdentity";
                case CdmAttributeContextType.AddedAttributeExpansionTotal:
                    return "addedAttributeExpansionTotal";
                case CdmAttributeContextType.AddedAttributeSelectedType:
                    return "addedAttributeSelectedType";
                case CdmAttributeContextType.GeneratedRound:
                    return "generatedRound";
                case CdmAttributeContextType.GeneratedSet:
                    return "generatedSet";
                case CdmAttributeContextType.Projection:
                    return "projection";
                case CdmAttributeContextType.Source:
                    return "source";
                case CdmAttributeContextType.Operations:
                    return "operations";
                case CdmAttributeContextType.OperationAddCountAttribute:
                    return "operationAddCountAttribute";
                case CdmAttributeContextType.OperationAddSupportingAttribute:
                    return "operationAddSupportingAttribute";
                case CdmAttributeContextType.OperationAddTypeAttribute:
                    return "operationAddTypeAttribute";
                case CdmAttributeContextType.OperationExcludeAttributes:
                    return "operationExcludeAttributes";
                case CdmAttributeContextType.OperationArrayExpansion:
                    return "operationArrayExpansion";
                case CdmAttributeContextType.OperationCombineAttributes:
                    return "operationCombineAttributes";
                case CdmAttributeContextType.OperationRenameAttributes:
                    return "operationRenameAttributes";
                case CdmAttributeContextType.OperationReplaceAsForeignKey:
                    return "operationReplaceAsForeignKey";
                case CdmAttributeContextType.OperationIncludeAttributes:
                    return "operationIncludeAttributes";
                case CdmAttributeContextType.OperationAddAttributeGroup:
                    return "operationAddAttributeGroup";
                default:
                    return "unknown";
            }
        }

    }
}
