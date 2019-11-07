package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.LocalEntityDeclaration;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import java.util.ArrayList;

public class LocalEntityDeclarationPersistence {

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

    if (obj.getExhibitsTraits() != null) {
      Utils.addListToCdmCollection(
              localDec.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.getExhibitsTraits()));
    }

    if (obj.getDataPartitions() != null) {
      obj.getDataPartitions().forEach(dataPartition ->
              localDec.getDataPartitions().add(DataPartitionPersistence.fromData(ctx, dataPartition))
      );
    }

    if (obj.getDataPartitionPatterns() != null) {
      obj.getDataPartitionPatterns().forEach(pattern ->
              localDec.getDataPartitionPatterns().add(DataPartitionPatternPersistence.fromData(ctx, pattern))
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

    // TODO-BQ: Might be better to let TraitRefPersistence do conversion from proper object instead
    // of having exhibitsTraits be an ArrayNode?
    result.setExhibitsTraits(
            Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));

    if (instance.getDataPartitions().getCount() > 0) {
      result.setDataPartitions(new ArrayList<>());
      instance.getDataPartitions().forEach(partition ->
          result.getDataPartitions()
              .add(DataPartitionPersistence.toData(partition, resOpt, options)));
    }

    if (instance.getDataPartitionPatterns().getCount() > 0) {
      result.setDataPartitionPatterns(new ArrayList<>());
      instance.getDataPartitionPatterns().forEach(pattern ->
          result.getDataPartitionPatterns()
              .add(DataPartitionPatternPersistence.toData(pattern, resOpt, options)));
    }

    return result;
  }
}