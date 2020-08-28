// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class TestUtils {
    /**
     * Resolves an entity
     */
    public static CompletableFuture<CdmEntityDefinition> getResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<String> resolutionOptions) {
        return getResolvedEntity(corpus, inputEntity, resolutionOptions, false);
    }

    /**
     * Resolves an entity
     * @param corpus The corpus
     * @param inputEntity The entity to resolve
     * @param resolutionOptions The resolution options
     * @param addResOptToName Whether to add the resolution options as part of the resolved entity name
     */
    public static CompletableFuture<CdmEntityDefinition> getResolvedEntity(
        CdmCorpusDefinition corpus,
        CdmEntityDefinition inputEntity,
        List<String> resolutionOptions,
        boolean addResOptToName
    ) {
        return CompletableFuture.supplyAsync(() -> {
            HashSet<String> roHashSet = new HashSet<>(resolutionOptions);

            String resolvedEntityName = "";
            if (addResOptToName) {
                String fileNameSuffix = getResolutionOptionNameSuffix(resolutionOptions);
                resolvedEntityName = "Resolved_" + inputEntity.getEntityName() + fileNameSuffix;
            } else {
                resolvedEntityName = "Resolved_" + inputEntity.getEntityName();
            }

            ResolveOptions ro = new ResolveOptions(inputEntity.getInDocument());
            ro.setDirectives(new AttributeResolutionDirectiveSet(roHashSet));

            CdmFolderDefinition resolvedFolder = corpus.getStorage().fetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder).join();

            return resolvedEntity;
        });
    }

    /**
     * Returns a suffix that contains the file name and resolution option used
     * @param resolutionOptions The resolution options
     */
    public static String getResolutionOptionNameSuffix(List<String> resolutionOptions) {
        String fileNamePrefix = "";

        for (int i = 0; i < resolutionOptions.size(); i++) {
            fileNamePrefix = fileNamePrefix + "_" + resolutionOptions.get(i);
        }

        if (StringUtils.isNullOrTrimEmpty(fileNamePrefix)) {
            fileNamePrefix = "_default";
        }

        return fileNamePrefix;
    }
}
