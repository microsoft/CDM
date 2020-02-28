// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataPartitionPattern;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class DataPartitionPatternPersistence {

  public static CdmDataPartitionPatternDefinition fromData(final CdmCorpusContext ctx, final DataPartitionPattern obj) {
    final CdmDataPartitionPatternDefinition newPattern = ctx.getCorpus().makeObject(
                CdmObjectType.DataPartitionPatternDef,
                obj.getName());

        newPattern.setRootLocation(obj.getRootLocation());

        if (obj.getRegularExpression() != null) {
            newPattern.setRegularExpression(obj.getRegularExpression());
        }

        if (obj.getParameters() != null) {
            newPattern.setParameters(obj.getParameters());
        }

        if (obj.getLastFileStatusCheckTime() != null) {
            newPattern.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());
        }

        if (obj.getLastFileModifiedTime() != null) {
            newPattern.setLastFileModifiedTime(obj.getLastFileModifiedTime());
        }

        if (obj.getExplanation() != null) {
            newPattern.setExplanation(obj.getExplanation());
        }

        if (obj.getSpecializedSchema() != null) {
            newPattern.setSpecializedSchema(obj.getSpecializedSchema());
        }

        if (obj.getExhibitsTraits() != null) {
            Utils.addListToCdmCollection(newPattern.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.getExhibitsTraits()));
        }

        return newPattern;
    }

  public static DataPartitionPattern toData(final CdmDataPartitionPatternDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
        final DataPartitionPattern result = new DataPartitionPattern();

        result.setName(instance.getName());
        result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());
        result.setLastFileModifiedTime(instance.getLastFileModifiedTime());
        result.setExplanation(instance.getExplanation());
        result.setRootLocation(instance.getRootLocation());
        result.setRegularExpression(instance.getRegularExpression());
        result.setParameters(instance.getParameters());
        result.setSpecializedSchema(instance.getSpecializedSchema());
        result.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));

        return result;
    }

}
