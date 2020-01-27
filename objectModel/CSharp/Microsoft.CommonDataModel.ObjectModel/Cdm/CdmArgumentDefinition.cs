//-----------------------------------------------------------------------
// <copyright file="CdmArgumentDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmArgumentDefinition : CdmObjectSimple
    {
        internal CdmParameterDefinition ResolvedParameter { get; set; }

        /// <summary>
        /// Gets or sets the argument explanation.
        /// </summary>
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the argument name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the argument value.
        /// </summary>
        public dynamic Value { get; set; }

        internal dynamic UnResolvedValue { get; set; }

        /// <summary>
        /// Constructs a CdmArgumentDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The argument name.</param>
        public CdmArgumentDefinition(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.ArgumentDef;
            this.Name = name;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ArgumentDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmArgumentDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmArgumentDefinition copy;
            if (host == null)
            {
                copy = new CdmArgumentDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmArgumentDefinition;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
            }

            if (this.Value != null)
            {
                if (this.Value is CdmObject)
                    copy.Value = ((CdmObject)this.Value).Copy(resOpt);
                else
                {
                    // Value is a string or JValue
                    copy.Value = (string)this.Value;
                }    
            }
            copy.ResolvedParameter = this.ResolvedParameter;
            copy.Explanation = this.Explanation;
            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            return this.Value != null ? true : false;
        }

        internal CdmParameterDefinition GetParameterDef()
        {
            return this.ResolvedParameter;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + (this.Value != null ? "value/" : "");
                    this.DeclaredPath = path;
                }
            }
            //trackVisits(path);

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;
            if (this.Value != null)
            {
                Type valueType = this.Value.GetType();
                if (this.Value is CdmObject valueAsJObject)
                {
                    if (valueAsJObject.Visit(path, preChildren, postChildren))
                        return true;
                }
            }
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        internal string CacheTag()
        {
            string tag = "";
            dynamic val = this.Value;
            if (val != null)
            { 
                if (this.Value is CdmObject)
                {
                    CdmObject valObj = val;
                    if (valObj.Id != null)
                        tag = (string)val.Id;
                    else
                        tag = (string)val;
                }
                else
                {
                    // val is a string or JValue
                    tag = (string)val;
                }
            }
            return tag;
        }
    }
}
