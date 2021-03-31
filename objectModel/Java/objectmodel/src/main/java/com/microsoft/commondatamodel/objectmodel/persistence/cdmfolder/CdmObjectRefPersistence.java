// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.AttributeGroupReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataTypeReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.PurposeReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TraitReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class CdmObjectRefPersistence {
  private static String tag = CdmObjectRefPersistence.class.getSimpleName();

  public static Object toData(final CdmObjectReference instance, final ResolveOptions resOpt, final CopyOptions options) {
    Object copy = null;

    if (!Strings.isNullOrEmpty(instance.getNamedReference())) {
      final Object identifier = Utils.copyIdentifierRef(instance, resOpt, options);

      if (instance.isSimpleNamedReference()) {
        if (identifier instanceof String) {
          return identifier;
        }

        return JMapper.MAP.valueToTree(identifier);
      }

      final Object replace = copyRefData(instance, copy, identifier, resOpt, options);

      if (replace != null) {
        copy = replace;
      }

    } else if (instance.getExplicitReference() != null) {
      final Object erCopy = instance.getExplicitReference().copyData(resOpt, options);
      final Object replace = copyRefData(instance, copy, erCopy, resOpt, options);
      if (replace != null) {
        copy = replace;
      }
    }

    if (null != copy && instance.getAppliedTraits().getCount() > 0) {
      try {
        final Method setAppliedTraitsMethod = copy.getClass().getMethod("setAppliedTraits", ArrayNode.class);
        setAppliedTraitsMethod.invoke(copy, Utils.listCopyDataAsArrayNode(instance.getAppliedTraits(), resOpt, options));
      } catch (final NoSuchMethodException ex) {
        // Fine, some objects like AttributeGroupRef do not have applied traits
      } catch (final IllegalAccessException | InvocationTargetException ex) {
        Logger.error(instance.getCtx(), tag, "toData", null, CdmLogCode.ErrPersistJsonObjectRefConversionError, ex.getLocalizedMessage());
      }
    }

    return copy;
  }

  private static Object copyRefData(
      final CdmObjectReference instance,
      Object copy,
      final Object refTo,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    switch (instance.getObjectType()) {
      case AttributeGroupRef:
        final AttributeGroupReferenceDefinition agrd = new AttributeGroupReferenceDefinition();
        agrd.setAttributeGroupReference(JMapper.MAP.valueToTree(refTo));
        return agrd;
      case AttributeRef:
        return refTo;
      case DataTypeRef:
        final DataTypeReferenceDefinition dtrd = new DataTypeReferenceDefinition();
        dtrd.setDataTypeReference(JMapper.MAP.valueToTree(refTo));
        return dtrd;
      case EntityRef:
        final EntityReferenceDefinition erd = new EntityReferenceDefinition();
        erd.setEntityReference(JMapper.MAP.valueToTree(refTo));
        return erd;
      case PurposeRef:
        final PurposeReferenceDefinition prd = new PurposeReferenceDefinition();
        prd.setPurposeReference(refTo);
        return prd;
      case TraitRef:
        copy = new TraitReferenceDefinition();
        ((TraitReferenceDefinition) copy).setTraitReference(refTo);
        ((TraitReferenceDefinition) copy).setArguments(
                Utils.listCopyDataAsArrayNode(((CdmTraitReference) instance).getArguments(), resOpt, options));
        return copy;
    }

    return null;
  }
}
