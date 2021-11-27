// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmParameterDefinition extends CdmObjectDefinitionBase {

  private static final String TAG = CdmParameterDefinition.class.getSimpleName();

  private String name;
  private Boolean isRequired;
  private CdmDataTypeReference dataTypeRef;
  private Object defaultValue;

  public CdmParameterDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setName(name);
    this.setObjectType(CdmObjectType.ParameterDef);
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = this.fetchDeclaredPath(pathFrom);

    //trackVisits(path);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.getDefaultValue() != null && this.getDefaultValue() instanceof CdmObject
            && ((CdmObject) this.getDefaultValue())
        .visit(path + "/defaultValue/", preChildren, postChildren)) {
      return true;
    }

    if (this.getDataTypeRef() != null && this.getDataTypeRef()
        .visit(path + "/dataType/", preChildren, postChildren)) {
      return true;
    }

    return postChildren != null && postChildren.invoke(this, path);
  }

  /**
   * Gets or sets the parameter name.
   */
  @Override
  public String getName() {
    return name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  /**
   * Gets or sets the parameter default value.
   * @return Object
   */
  public Object getDefaultValue() {
    return this.defaultValue;
  }

  public void setDefaultValue(final Object value) {
    this.defaultValue = value;
  }

  /**
   * Gets or sets if the parameter is required.
   * @return Boolean
   */
  public Boolean isRequired() {
    return isRequired;
  }

  public void setRequired(final boolean value) {
    this.isRequired = value;
  }

  /**
   * Gets or sets the parameter data type reference.
   * @return CDM Data type reference
   */
  public CdmDataTypeReference getDataTypeRef() {
    return dataTypeRef;
  }

  public void setDataTypeRef(final CdmDataTypeReference value) {
    this.dataTypeRef = value;
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.name)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("Name"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt resolved options
   * @param options Copy option
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmParameterDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    CdmParameterDefinition copy;
    if (host == null) {
      copy = new CdmParameterDefinition(this.getCtx(), this.getName());
    } else {
      copy = (CdmParameterDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setName(this.getName());
    }

    Object defVal = null;
    if (this.getDefaultValue() != null) {
      if (this.getDefaultValue() instanceof String) {
        defVal = this.getDefaultValue();
      } else {
        defVal = ((CdmObject) this.getDefaultValue()).copy(resOpt);
      }
    }
    copy.setExplanation(this.getExplanation());
    copy.setDefaultValue(defVal);
    copy.setRequired(this.isRequired());
    copy.setDataTypeRef(
            (CdmDataTypeReference) (this.getDataTypeRef() != null ? this.getDataTypeRef().copy(resOpt)
            : null));
    return copy;
  }

  Object constTypeCheck(
          final ResolveOptions resOpt,
          final CdmDocumentDefinition wrtDoc,
          final Object argumentValue) {
    final ResolveContext ctx = (ResolveContext) this.getCtx();
    Object replacement = argumentValue;

    // If parameter type is entity, then the value should be an entity or ref to one
    // same is true of 'dataType' data type.
    if (this.getDataTypeRef() == null) {
      return replacement;
    }

    CdmDataTypeDefinition dt = this.getDataTypeRef().fetchObjectDefinition(resOpt);
    if (null == dt) {
      Logger.error(ctx, TAG, "constTypeCheck", wrtDoc.getFolderPath() + wrtDoc.getName(), CdmLogCode.ErrUnrecognizedDataType, this.getName());
      return null;
    }

    // Compare with passed in value or default for parameter.
    Object pValue = argumentValue;
    if (null == pValue) {
      pValue = this.getDefaultValue();
      replacement = pValue;
    }

    if (null != pValue) {
      if (dt.isDerivedFrom("cdmObject", resOpt)) {
        final List<CdmObjectType> expectedTypes = new ArrayList<>();
        String expected = null;
        if (dt.isDerivedFrom("entity", resOpt)) {
          expectedTypes.add(CdmObjectType.ConstantEntityDef);
          expectedTypes.add(CdmObjectType.EntityRef);
          expectedTypes.add(CdmObjectType.EntityDef);
          expectedTypes.add(CdmObjectType.ProjectionDef);
          expected = "entity";
        } else if (dt.isDerivedFrom("attribute", resOpt)) {
          expectedTypes.add(CdmObjectType.AttributeRef);
          expectedTypes.add(CdmObjectType.TypeAttributeDef);
          expectedTypes.add(CdmObjectType.EntityAttributeDef);
          expected = "attribute";
        } else if (dt.isDerivedFrom("dataType", resOpt)) {
          expectedTypes.add(CdmObjectType.DataTypeRef);
          expectedTypes.add(CdmObjectType.DataTypeDef);
          expected = "dataType";
        } else if (dt.isDerivedFrom("purpose", resOpt)) {
          expectedTypes.add(CdmObjectType.PurposeRef);
          expectedTypes.add(CdmObjectType.PurposeDef);
          expected = "purpose";
        } else if (dt.isDerivedFrom("traitGroup", resOpt)) {
          expectedTypes.add(CdmObjectType.TraitGroupRef);
          expectedTypes.add(CdmObjectType.TraitGroupDef);
          expected = "traitGroup";
        } else if (dt.isDerivedFrom("trait", resOpt)) {
          expectedTypes.add(CdmObjectType.TraitRef);
          expectedTypes.add(CdmObjectType.TraitDef);
          expected = "trait";
        } else if (dt.isDerivedFrom("attributeGroup", resOpt)) {
          expectedTypes.add(CdmObjectType.AttributeGroupRef);
          expectedTypes.add(CdmObjectType.AttributeGroupDef);
          expected = "attributeGroup";
        }

        if (expectedTypes.size() == 0) {
          Logger.error(ctx, TAG,"constTypeCheck", wrtDoc.getFolderPath() + wrtDoc.getName(), CdmLogCode.ErrUnexpectedDataType, this.getName());
        }

        // If a string constant, resolve to an object ref.
        CdmObjectType foundType = CdmObjectType.Error;
        final Class pValueType = pValue.getClass();

        if (CdmObject.class.isAssignableFrom(pValueType)) {
          foundType = ((CdmObject) pValue).getObjectType();
        }

        String foundDesc = ctx.getRelativePath();

        String pValueAsString = "";
        if (!(pValue instanceof CdmObject)) {
          pValueAsString = (String) pValue;
        }

        if (!pValueAsString.isEmpty()) {
          if (pValueAsString.equalsIgnoreCase("this.attribute")
                  && expected.equalsIgnoreCase("attribute")) {
            // Will get sorted out later when resolving traits.
            foundType = CdmObjectType.AttributeRef;
          } else {
            foundDesc = pValueAsString;
            final int seekResAtt = CdmObjectReferenceBase.offsetAttributePromise(pValueAsString);
            if (seekResAtt >= 0) {
              // Get an object there that will get resolved later after resolved attributes.
              replacement = new CdmAttributeReference(ctx, pValueAsString, true);
              ((CdmAttributeReference) replacement).setCtx(ctx);
              ((CdmAttributeReference) replacement).setInDocument(wrtDoc);
              foundType = CdmObjectType.AttributeRef;
            } else {
              final CdmObjectBase lu = ctx.getCorpus()
                      .resolveSymbolReference(
                              resOpt,
                              wrtDoc,
                              pValueAsString,
                              CdmObjectType.Error,
                              true);
              if (null != lu) {
                if (expected.equalsIgnoreCase("attribute")) {
                  replacement = new CdmAttributeReference(ctx, pValueAsString, true);
                  ((CdmAttributeReference) replacement).setCtx(ctx);
                  ((CdmAttributeReference) replacement).setInDocument(wrtDoc);
                  foundType = CdmObjectType.AttributeRef;
                } else {
                  replacement = lu;
                  foundType = ((CdmObject) replacement).getObjectType();
                }
              }
            }
          }
        }

        if (expectedTypes.indexOf(foundType) == -1) {
          Logger.error(ctx, TAG, "constTypeCheck", wrtDoc.getAtCorpusPath(), CdmLogCode.ErrResolutionFailure, this.getName(), expected, foundDesc, expected);
        } else {
          Logger.info(ctx, TAG, "constTypeCheck", wrtDoc.getAtCorpusPath(), Logger.format("Resolved '{0}'", foundDesc));
        }
      }
    }

    return replacement;
  }
}
