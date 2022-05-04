// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.LocalEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.function.Function;

public class LocalEntityDeclarationPersistence {
  private static final String TAG = LocalEntityDeclarationPersistence.class.getSimpleName();

  public static CdmEntityDeclarationDefinition fromData(final CdmCorpusContext ctx, final String prefixPath,
                                                        final LocalEntityDeclaration obj) {
    final CdmEntityDeclarationDefinition localDec = ctx.getCorpus()
            .makeObject(CdmObjectType.LocalEntityDeclarationDef, obj.getEntityName());
    localDec.setEntityPath(obj.getEntityPath());

    if (obj.getLastChildFileModifiedTime() != null) {
      localDec.setLastChildFileModifiedTime(obj.getLastChildFileModifiedTime());
    }

    if (obj.getLastFileModifiedTime() != null) {
      localDec.setLastFileModifiedTime(obj.getLastFileModifiedTime());
    }

    if (obj.getLastFileStatusCheckTime() != null) {
      localDec.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());
    }

    if (obj.getExplanation() != null) {
      localDec.setExplanation(obj.getExplanation());
    }

    Utils.addListToCdmCollection(
              localDec.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.getExhibitsTraits()));

    if (obj.getDataPartitions() != null) {
      obj.getDataPartitions().forEach(
        dataPartition -> {
          final CdmDataPartitionDefinition dataPartitionDef = DataPartitionPersistence.fromData(ctx, dataPartition);
          if (dataPartitionDef.isIncremental()) {
            errorMessage(ctx, "fromData", null, dataPartitionDef, true);
          } else {
            localDec.getDataPartitions().add(dataPartitionDef);
          }
        }
      );
    }

    if (obj.getDataPartitionPatterns() != null) {
      obj.getDataPartitionPatterns().forEach(
        pattern -> {
          final CdmDataPartitionPatternDefinition dataPartitionPatternDef = DataPartitionPatternPersistence.fromData(ctx, pattern);
          if (dataPartitionPatternDef.isIncremental()) {
            errorMessage(ctx, "fromData", null, dataPartitionPatternDef, true);
          } else {
            localDec.getDataPartitionPatterns().add(dataPartitionPatternDef);
          }
        }
      );
    }

    if (obj.getIncrementalPartitions() != null) {
      obj.getIncrementalPartitions().forEach(
        incrementalPartition -> {
          final CdmDataPartitionDefinition incrementalPartitionDef = DataPartitionPersistence.fromData(ctx, incrementalPartition);
          if (!incrementalPartitionDef.isIncremental()) {
            errorMessage(ctx, "fromData", null, incrementalPartitionDef, false);
          } else {
            localDec.getIncrementalPartitions().add(incrementalPartitionDef);
          }
        }
      );
    }

    if (obj.getIncrementalPartitionPatterns() != null) {
      obj.getIncrementalPartitionPatterns().forEach(
        incrementalPattern -> {
          final CdmDataPartitionPatternDefinition incrementalPartitionPatternDef = DataPartitionPatternPersistence.fromData(ctx, incrementalPattern);
          if (!incrementalPartitionPatternDef.isIncremental()) {
            errorMessage(ctx, "fromData", null, incrementalPartitionPatternDef, false);
          } else {
            localDec.getIncrementalPartitionPatterns().add(incrementalPartitionPatternDef);
          }
        }
      );
    }

      return localDec;
  }

  public static LocalEntityDeclaration toData(
      final CdmLocalEntityDeclarationDefinition instance,
      final ResolveOptions resOpt,
      final CopyOptions options) {
    final LocalEntityDeclaration result = new LocalEntityDeclaration();

    result.setType(EntityDeclaration.EntityDeclarationDefinitionType.LocalEntity);
    result.setEntityName(instance.getEntityName());
    result.setExplanation(instance.getExplanation());
    result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());
    result.setLastFileModifiedTime(instance.getLastFileModifiedTime());
    result.setLastChildFileModifiedTime(instance.getLastChildFileModifiedTime());
    result.setEntityPath(instance.getEntityPath());

    result.setExhibitsTraits(
            Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));
    result.setDataPartitions(Utils.listCopyDataAsCdmObject(instance.getDataPartitions(), resOpt, options, LocalEntityDeclarationPersistence.ensureNonIncremental(instance)));
    result.setDataPartitionPatterns(Utils.listCopyDataAsCdmObject(instance.getDataPartitionPatterns(), resOpt, options, LocalEntityDeclarationPersistence.ensureNonIncremental(instance)));
    result.setIncrementalPartitions(Utils.listCopyDataAsCdmObject(instance.getIncrementalPartitions(), resOpt, options, LocalEntityDeclarationPersistence.ensureIncremental(instance)));
    result.setIncrementalPartitionPatterns(Utils.listCopyDataAsCdmObject(instance.getIncrementalPartitionPatterns(), resOpt, options, LocalEntityDeclarationPersistence.ensureIncremental(instance)));

    return result;
  }

  private static void errorMessage(final CdmCorpusContext ctx, final String methodName, final String corpusPath, final CdmDataPartitionDefinition obj, final boolean isIncremental) {
    if (isIncremental) {
      Logger.error(ctx, TAG, methodName, corpusPath, CdmLogCode.ErrPersistIncrementalConversionError, obj.getName(), Constants.IncrementalTraitName, "dataPartitions");
    } else {
      Logger.error(ctx, TAG, methodName, corpusPath, CdmLogCode.ErrPersistNonIncrementalConversionError, obj.getName(), Constants.IncrementalTraitName, "incrementalPartitions");
    }
  }

  private static void errorMessage(final CdmCorpusContext ctx, final String methodName, final String corpusPath, final CdmDataPartitionPatternDefinition obj, final boolean isIncremental) {
    if (isIncremental) {
      Logger.error(ctx, TAG, methodName, corpusPath, CdmLogCode.ErrPersistIncrementalConversionError, obj.getName(), Constants.IncrementalTraitName, "dataPartitionPatterns");
    } else {
      Logger.error(ctx, TAG, methodName, corpusPath, CdmLogCode.ErrPersistNonIncrementalConversionError, obj.getName(), Constants.IncrementalTraitName, "incrementalPartitionPatterns");
    }
  }

  private static Function<Object, Boolean> ensureNonIncremental(final CdmLocalEntityDeclarationDefinition instance) {
    Function<Object, Boolean> compare = (obj) -> {
      if (obj instanceof CdmDataPartitionDefinition && ((CdmDataPartitionDefinition) obj).isIncremental()) {
        LocalEntityDeclarationPersistence.errorMessage(instance.getCtx(), "toData", instance.getAtCorpusPath(), (CdmDataPartitionDefinition) obj, true);
        return false;
      } else if (obj instanceof CdmDataPartitionPatternDefinition && ((CdmDataPartitionPatternDefinition) obj).isIncremental()) {
        LocalEntityDeclarationPersistence.errorMessage(instance.getCtx(), "toData", instance.getAtCorpusPath(), (CdmDataPartitionPatternDefinition) obj, true);
        return false;
      }
      return true;
    };
    return compare;
  }

  private static Function<Object, Boolean> ensureIncremental(final CdmLocalEntityDeclarationDefinition instance) {
    Function<Object, Boolean> compare = (obj) -> {
      if (obj instanceof CdmDataPartitionDefinition && !((CdmDataPartitionDefinition) obj).isIncremental()) {
        LocalEntityDeclarationPersistence.errorMessage(instance.getCtx(), "toData", instance.getAtCorpusPath(), (CdmDataPartitionDefinition) obj, false);
        return false;
      } else if (obj instanceof CdmDataPartitionPatternDefinition && !((CdmDataPartitionPatternDefinition) obj).isIncremental()) {
        LocalEntityDeclarationPersistence.errorMessage(instance.getCtx(), "toData", instance.getAtCorpusPath(), (CdmDataPartitionPatternDefinition) obj, false);
        return false;
      }
      return true;
    };
    return compare;
  }
}
