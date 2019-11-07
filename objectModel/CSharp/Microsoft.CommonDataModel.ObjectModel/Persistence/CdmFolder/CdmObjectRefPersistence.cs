namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class CdmObjectRefPersistence
    {
        public static dynamic ToData(CdmObjectReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            dynamic copy = null;
            if (!string.IsNullOrEmpty(instance.NamedReference))
            {
                dynamic identifier = Utils.CopyIdentifierRef(instance, resOpt, options);
                if (instance.SimpleNamedReference)
                    return identifier;
                dynamic replace = CopyRefData(instance, resOpt, copy, identifier, options);
                if (replace != null)
                    copy = replace;
            }
            else if (instance.ExplicitReference != null)
            {
                dynamic erCopy = instance.ExplicitReference.CopyData(resOpt, options);
                dynamic replace = CopyRefData(instance, resOpt, copy, erCopy, options);
                if (replace != null)
                    copy = replace;
            }
            if (instance.AppliedTraits.Count > 0)
                copy.AppliedTraits = Utils.ListCopyData(resOpt, instance.AppliedTraits, options);
            return copy;
        }

        private static dynamic CopyRefData(CdmObjectReference instance, ResolveOptions resOpt, dynamic copy, dynamic refTo, CopyOptions options)
        {
            switch(instance.ObjectType)
            {
                case CdmObjectType.AttributeGroupRef:
                    return new AttributeGroupReferenceDefinition { AttributeGroupReference = JToken.FromObject(refTo, JsonSerializationUtil.JsonSerializer) };
                case CdmObjectType.AttributeRef:
                    return refTo;
                case CdmObjectType.DataTypeRef:
                    return new DataTypeReferenceDefinition { DataTypeReference = refTo };
                case CdmObjectType.EntityRef:
                    return new EntityReferenceDefinition { EntityReference = JToken.FromObject(refTo, JsonSerializationUtil.JsonSerializer) };
                case CdmObjectType.PurposeRef:
                    return new PurposeReferenceDefinition { PurposeReference = refTo };
                case CdmObjectType.TraitRef:
                    copy = new TraitReferenceDefintion();
                    copy.TraitReference = refTo;
                    copy.Arguments = Utils.ListCopyData<dynamic>(resOpt, ((CdmTraitReference)instance).Arguments, options)?.ConvertAll<JToken>(a => JToken.FromObject(a, JsonSerializationUtil.JsonSerializer));
                    return copy;
            }

            return null;
        }
    }
}
