namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class AttributeContextReferencePersistence
    {
        public static CdmAttributeContextReference FromData(CdmCorpusContext ctx, dynamic obj)
        {
            if (!(obj is string || obj is JValue))
            {
                return null;
            }

            return ctx.Corpus.MakeObject<CdmAttributeContextReference>(CdmObjectType.AttributeContextRef, (string)obj);
        }

        public static dynamic ToData(CdmAttributeContextReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
