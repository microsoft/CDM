// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DataPartition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.KeyValuePair;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DataPartitionPersistence {
    public static CdmDataPartitionDefinition fromData(final CdmCorpusContext ctx, final DataPartition obj) {
        final CdmDataPartitionDefinition newPartition = ctx.getCorpus().makeObject(CdmObjectType.DataPartitionDef);

        newPartition.setLocation(obj.getLocation());

        if (obj.getName() != null) {
            newPartition.setName(obj.getName());
        }

        if (obj.getSpecializedSchema() != null) {
            newPartition.setSpecializedSchema(obj.getSpecializedSchema());
        }

        if (obj.getLastFileStatusCheckTime() != null) {
            newPartition.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());
        }

        if (obj.getLastFileModifiedTime() != null) {
            newPartition.setLastFileModifiedTime(obj.getLastFileModifiedTime());
        }

        if (obj.getExhibitsTraits() != null) {
            Utils.addListToCdmCollection(newPartition.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.getExhibitsTraits()));
        }

        if (obj.getArguments() == null) {
            return newPartition;
        }

        for (final KeyValuePair<String, String> arg : obj.getArguments()) {
            if (newPartition.getArguments().containsKey(arg.getName())) {
                newPartition.getArguments().get(arg.getName()).add(arg.getValue());
            } else {
                final List<String> newArgList = new ArrayList<>();
                newArgList.add(arg.getValue());
                newPartition.getArguments().put(arg.getName(), newArgList);
            }
        }

        return newPartition;
    }

    public static DataPartition toData(final CdmDataPartitionDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
        final List<KeyValuePair<String, String>> argumentsCopy = new ArrayList<>();

        if (instance.getArguments() != null) {
            for (final Map.Entry<String, List<String>> argumentList : instance.getArguments().entrySet()) {
                argumentList.getValue().forEach(
                        argumentValue -> argumentsCopy.add(new KeyValuePair<>(argumentList.getKey(), argumentValue))
                );
            }
        }

        final DataPartition result = new DataPartition();

        result.setName(instance.getName());
        result.setLocation(instance.getLocation());
        result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());
        result.setLastFileModifiedTime(instance.getLastFileModifiedTime());
        result.setExhibitsTraits(exhibitsTraitsToData(instance.getExhibitsTraits(), resOpt, options));
        result.setArguments(argumentsCopy.size() > 0 ? argumentsCopy : null);
        result.setSpecializedSchema(instance.getSpecializedSchema());

        return result;
    }

    /**
     * Converts an CdmCollection of trait references to ArrayNode, including only traits that are not from a property.
     *
     * @param traits Collection of trait refs
     * @return ArrayNode, or null if the param is null or all traits are from a property.
     */
    private static ArrayNode exhibitsTraitsToData(
        final CdmTraitCollection traits,
        final ResolveOptions resOpt,
        final CopyOptions options) {
        if (traits == null) {
            return null;
        }

        final List<CdmTraitReference> filteredTraits =
                traits.getAllItems().stream().filter(trait -> !trait.isFromProperty()).collect(Collectors.toList());

        if (filteredTraits == null || filteredTraits.isEmpty()) {
            return null;
        }

        return Utils.listCopyDataAsArrayNode(filteredTraits, resOpt, options);
    }
}
