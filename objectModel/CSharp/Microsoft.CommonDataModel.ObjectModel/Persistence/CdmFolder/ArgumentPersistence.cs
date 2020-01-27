namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class ArgumentPersistence
    {
        public static CdmArgumentDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var argument = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef);

            if (obj.GetType() == typeof(JObject) && obj["value"] != null)
            {
                argument.Value = Utils.CreateConstant(ctx, obj["value"]);
                if (obj["name"] != null)
                    argument.Name = (string)obj["name"];
                if (obj["explanation"] != null)
                    argument.Explanation = (string)obj["explanation"];
            }
            else
            {
                // not a structured argument, just a thing. try it
                argument.Value = Utils.CreateConstant(ctx, obj);
            }
            return argument;
        }
        public static dynamic ToData(CdmArgumentDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            dynamic val = null;
            if (instance.Value != null)
            {
                if (instance.Value is string || instance.Value is JValue)
                {
                    val = (string)instance.Value;
                }
                else if(instance.Value is CdmObject) 
                {
                    val = ((CdmObject)instance.Value).CopyData(resOpt, options);
                }
                else
                {
                    val = instance.Value;
                }
            }
            // skip the argument if just a value
            if (string.IsNullOrEmpty(instance.Name))
                return val;

            return new Argument {
                Explanation = instance.Explanation,
                Name = instance.Name,
                Value = JToken.FromObject(val, JsonSerializationUtil.JsonSerializer)
            };
        }
    }
}
