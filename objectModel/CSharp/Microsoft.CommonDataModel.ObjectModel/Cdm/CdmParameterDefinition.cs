// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class CdmParameterDefinition : CdmObjectDefinitionBase
    {
        private static readonly string Tag = nameof(CdmParameterDefinition);

        /// <summary>
        /// Gets or sets the parameter name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the parameter default value.
        /// </summary>
        public dynamic DefaultValue { get; set; }

        /// <summary>
        /// Gets or sets whether the parameter is required.
        /// </summary>
        public bool Required { get; set; }

        /// <summary>
        /// Gets or sets the parameter data type reference.
        /// </summary>
        public CdmDataTypeReference DataTypeRef { get; set; }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.Name;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        /// <summary>
        /// Constructs a CdmParameterDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The parameter name.</param>
        public CdmParameterDefinition(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.ObjectType = CdmObjectType.ParameterDef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ParameterDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmParameterDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmParameterDefinition copy;
            if (host == null)
            {
                copy = new CdmParameterDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmParameterDefinition;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
            }

            dynamic defVal = null;
            if (this.DefaultValue != null)
            {
                if (this.DefaultValue is string)
                    defVal = this.DefaultValue;
                else
                    defVal = ((CdmObject)this.DefaultValue).Copy(resOpt);
            }
            copy.Explanation = this.Explanation;
            copy.DefaultValue = defVal;
            copy.Required = this.Required;
            copy.DataTypeRef = this.DataTypeRef?.Copy(resOpt) as CdmDataTypeReference;
            return copy;
        }

        /// <summary>
        /// Checks if the trait argumnet value matchs the data type defined on the trait parameter
        /// </summary>
        /// <param name="resOpt"></param>
        /// <param name="wrtDoc"></param>
        /// <param name="argumentValue"></param>
        /// <returns></returns>
        internal dynamic ConstTypeCheck(ResolveOptions resOpt, CdmDocumentDefinition wrtDoc, dynamic argumentValue)
        {
            ResolveContext ctx = this.Ctx as ResolveContext;
            dynamic replacement = argumentValue;
            // if parameter type is entity, then the value should be an entity or ref to one
            // same is true of 'dataType' dataType
            if (this.DataTypeRef == null)
            {
                return replacement;
            }

            CdmDataTypeDefinition dt = this.DataTypeRef.FetchObjectDefinition<CdmDataTypeDefinition>(resOpt);
            if (dt == null)
            {
                Logger.Error(ctx, Tag, nameof(ConstTypeCheck), this.AtCorpusPath, CdmLogCode.ErrUnrecognizedDataType, this.Name);
                return null;
            }

            // compare with passed in value or default for parameter
            dynamic pValue = argumentValue;
            if (pValue == null)
            {
                pValue = this.DefaultValue;
                replacement = pValue;
            }
            if (pValue != null)
            {
                if (dt.IsDerivedFrom("cdmObject", resOpt))
                {
                    List<CdmObjectType> expectedTypes = new List<CdmObjectType>();
                    string expected = null;
                    if (dt.IsDerivedFrom("entity", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.ConstantEntityDef);
                        expectedTypes.Add(CdmObjectType.EntityRef);
                        expectedTypes.Add(CdmObjectType.EntityDef);
                        expectedTypes.Add(CdmObjectType.ProjectionDef);
                        expected = "entity";
                    }
                    else if (dt.IsDerivedFrom("attribute", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.AttributeRef);
                        expectedTypes.Add(CdmObjectType.TypeAttributeDef);
                        expectedTypes.Add(CdmObjectType.EntityAttributeDef);
                        expected = "attribute";
                    }
                    else if (dt.IsDerivedFrom("dataType", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.DataTypeRef);
                        expectedTypes.Add(CdmObjectType.DataTypeDef);
                        expected = "dataType";
                    }
                    else if (dt.IsDerivedFrom("purpose", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.PurposeRef);
                        expectedTypes.Add(CdmObjectType.PurposeDef);
                        expected = "purpose";
                    }
                    else if (dt.IsDerivedFrom("traitGroup", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.TraitGroupRef);
                        expectedTypes.Add(CdmObjectType.TraitGroupDef);
                        expected = "traitGroup";
                    }
                    else if (dt.IsDerivedFrom("trait", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.TraitRef);
                        expectedTypes.Add(CdmObjectType.TraitDef);
                        expected = "trait";
                    }
                    else if (dt.IsDerivedFrom("attributeGroup", resOpt))
                    {
                        expectedTypes.Add(CdmObjectType.AttributeGroupRef);
                        expectedTypes.Add(CdmObjectType.AttributeGroupDef);
                        expected = "attributeGroup";
                    }

                    if (expectedTypes.Count == 0)
                    {
                        Logger.Error(ctx, Tag, nameof(ConstTypeCheck), wrtDoc.FolderPath + wrtDoc.Name, CdmLogCode.ErrUnexpectedDataType, this.Name);
                    }

                    // if a string constant, resolve to an object ref.
                    CdmObjectType foundType = CdmObjectType.Error;
                    Type pValueType = pValue.GetType();

                    if (typeof(CdmObject).IsAssignableFrom(pValueType))
                        foundType = (pValue as CdmObject).ObjectType;
                    string foundDesc = ctx.RelativePath;
                    if (!(pValue is CdmObject))
                    {
                        // pValue is a string or JValue 
                        pValue = (string)pValue;
                        if (pValue == "this.attribute" && expected == "attribute")
                        {
                            // will get sorted out later when resolving traits
                            foundType = CdmObjectType.AttributeRef;
                        }
                        else
                        {
                            foundDesc = pValue;
                            int seekResAtt = CdmObjectReferenceBase.offsetAttributePromise(pValue);
                            if (seekResAtt >= 0)
                            {
                                // get an object there that will get resolved later after resolved attributes
                                replacement = new CdmAttributeReference(ctx, pValue, true);
                                (replacement as CdmAttributeReference).Ctx = ctx;
                                (replacement as CdmAttributeReference).InDocument = wrtDoc;
                                foundType = CdmObjectType.AttributeRef;
                            }
                            else
                            {
                                CdmObjectBase lu = ctx.Corpus.ResolveSymbolReference(resOpt, wrtDoc, pValue, CdmObjectType.Error, retry: true);
                                if (lu != null)
                                {
                                    if (expected == "attribute")
                                    {
                                        replacement = new CdmAttributeReference(ctx, pValue, true);
                                        (replacement as CdmAttributeReference).Ctx = ctx;
                                        (replacement as CdmAttributeReference).InDocument = wrtDoc;
                                        foundType = CdmObjectType.AttributeRef;
                                    }
                                    else
                                    {
                                        replacement = lu;
                                        foundType = (replacement as CdmObject).ObjectType;
                                    }
                                }
                            }
                        }
                    }
                    if (expectedTypes.IndexOf(foundType) == -1)
                    {
                        Logger.Error(ctx, Tag, nameof(ConstTypeCheck), wrtDoc.AtCorpusPath, CdmLogCode.ErrResolutionFailure, this.Name, expected, foundDesc, expected);
                    }
                    else
                    {
                        Logger.Info(ctx, Tag, nameof(ConstTypeCheck), wrtDoc.AtCorpusPath, $"resolved '{foundDesc}'");
                    }
                }
            }

            return replacement;
        }


        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
            {
                IEnumerable<string> missingFields = new List<string> { "Name" };
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));

                return false;
            }
            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.UpdateDeclaredPath(pathFrom);
            //trackVisits(path);

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;
            if (this.DefaultValue != null)
            {
                Type defaultValueType = this.DefaultValue.GetType();

                if ((this.DefaultValue is CdmObject) && (this.DefaultValue as CdmObject).Visit(path + "/defaultValue/", preChildren, postChildren))
                    return true;
            }

            if (this.DataTypeRef != null)
                if (this.DataTypeRef.Visit(path + "/dataType/", preChildren, postChildren))
                    return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }
    }

}
