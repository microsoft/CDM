// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class CdmConstantEntityDefinition : CdmObjectDefinitionBase
    {
        private static readonly string Tag = nameof(CdmConstantEntityDefinition);

        /// <summary>
        /// Gets or sets the constant entity name.
        /// </summary>
        public string ConstantEntityName { get; set; }

        /// <summary>
        /// Gets or sets the constant entity shape.
        /// </summary>
        public CdmEntityReference EntityShape { get; set; }

        /// <summary>
        /// Gets or sets the constant entity's constant values.
        /// </summary>
        public List<List<string>> ConstantValues { get; set; }

        /// <summary>
        /// Constructs a CdmConstantEntityDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        public CdmConstantEntityDefinition(CdmCorpusContext ctx, string constantEntityName)
                   : base(ctx)
        {
            this.ObjectType = CdmObjectType.ConstantEntityDef;
            this.ConstantEntityName = constantEntityName;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmConstantEntityDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmConstantEntityDefinition copy;
            if (host == null)
            {
                copy = new CdmConstantEntityDefinition(this.Ctx, this.ConstantEntityName);
            }
            else
            {
                copy = host as CdmConstantEntityDefinition;
                copy.ConstantEntityName = this.ConstantEntityName;
            }

            copy.EntityShape = (CdmEntityReference)this.EntityShape.Copy(resOpt);
            if (this.ConstantValues != null)
            {
                // deep copy the content
                copy.ConstantValues = new List<List<string>>();
                foreach(var row in this.ConstantValues)
                {
                    copy.ConstantValues.Add(new List<string>(row));
                }
            }
            this.CopyDef(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (this.ConstantValues == null)
            {
                string[] pathSplit = this.DeclaredPath.Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
                string entityName = (pathSplit.Length > 0) ? pathSplit[0].ToString() : string.Empty;
                Logger.Warning(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.WarnValdnEntityNotDefined, entityName);
            }
            if (this.EntityShape == null)
            {
                IEnumerable<string> missingFields = new List<string> { "EntityShape" };
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));
                return false;
            }
            return true;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ConstantEntityDef;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <inheritdoc />
        public override string GetName()
        {
            // make up a name if one not given
            if (this.ConstantEntityName == null)
            {
                if (this.EntityShape != null)
                    return $"Constant{ this.EntityShape.FetchObjectDefinitionName()}";

                return "ConstantEntity";
            }
            return this.ConstantEntityName;
        }

        /// <summary>
        /// Returns constantValue.attReturn where constantValue.attSearch equals valueSearch.
        /// </summary>
        internal string FetchConstantValue(ResolveOptions resOpt, dynamic attReturn, dynamic attSearch, string valueSearch, int order)
        {
            string result = null;
            Func<string, string> action = found => { result = found; return found; };
            this.FindValue(resOpt, attReturn, attSearch, valueSearch, order, action);
            return result;
        }

        /// <summary>
        /// Sets constantValue.attReturn = newValue where constantValue.attSearch equals valueSearch.
        /// </summary>
        internal string UpdateConstantValue(ResolveOptions resOpt, dynamic attReturn, string newValue, dynamic attSearch, string valueSearch, int order)
        {
            string result = null;
            Func<string, string> action = found => { result = found; return found; };
            this.FindValue(resOpt, attReturn, attSearch, valueSearch, order, action);
            return result;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.UpdateDeclaredPath(pathFrom);
            //trackVisits(path);

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;
            if (this.EntityShape != null)
            {
                this.EntityShape.Owner = this;
                if (this.EntityShape.Visit(path + "/entityShape/", preChildren, postChildren))
                    return true;
            }
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        /// <inheritdoc />
        internal override string UpdateDeclaredPath(string pathFrom)
        {
            return pathFrom + (!string.IsNullOrEmpty(this.ConstantEntityName) ? this.ConstantEntityName : "(unspecified)");
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            return;
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            AttributeContextParameters acpEnt = null;
            if (under != null)
            {
                acpEnt = new AttributeContextParameters
                {
                    under = under,
                    type = CdmAttributeContextType.Entity,
                    Name = this.EntityShape.FetchObjectDefinitionName(),
                    Regarding = this.EntityShape,
                    IncludeTraits = true
                };
            }

            if (this.EntityShape != null)
                rasb.MergeAttributes(this.EntityShape.FetchResolvedAttributes(resOpt, acpEnt));

            // things that need to go away
            rasb.RemoveRequestedAtts();
            return rasb;
        }

        // the world's smallest complete query processor...
        internal void FindValue(ResolveOptions resOpt, dynamic attReturn, dynamic attSearch, string valueSearch, int order, Func<string, string> action)
        {
            int resultAtt = -1;
            int searchAtt = -1;

            if (attReturn is int)
                resultAtt = attReturn;
            if (attSearch is int)
                searchAtt = attSearch;

            if (resultAtt == -1 || searchAtt == -1)
            {
                // metadata library
                ResolvedAttributeSet ras = this.FetchResolvedAttributes(resOpt);
                // query validation and binding
                if (ras != null)
                {
                    int l = ras.Set.Count;
                    for (int i = 0; i < l; i++)
                    {
                        string name = ras.Set[i].ResolvedName;
                        if (resultAtt == -1 && name == attReturn)
                            resultAtt = i;
                        if (searchAtt == -1 && name == attSearch)
                            searchAtt = i;
                        if (resultAtt >= 0 && searchAtt >= 0)
                            break;
                    }
                }
            }

            // rowset processing
            if (resultAtt >= 0 && searchAtt >= 0)
            {
                if (this.ConstantValues != null && this.ConstantValues.Count > 0)
                {
                    int startAt = 0;
                    int endBefore = this.ConstantValues.Count;
                    int increment = 1;
                    if (order == -1)
                    {
                        increment = -1;
                        startAt = this.ConstantValues.Count - 1;
                        endBefore = -1;
                    }
                    for (int i = startAt; i != endBefore; i += increment)
                    {
                        if (this.ConstantValues[i][searchAtt] == valueSearch)
                        {
                            this.ConstantValues[i][resultAtt] = action(this.ConstantValues[i][resultAtt]);
                            return;
                        }
                    }
                }
            }
            return;
        }
    }
}
