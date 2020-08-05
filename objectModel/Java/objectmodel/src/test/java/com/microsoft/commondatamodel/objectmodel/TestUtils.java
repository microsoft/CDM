// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class TestUtils {
    /**
     * A function to resolve an entity
     */
    public static CompletableFuture<CdmEntityDefinition> getResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<String> resolutionOptions) {
        return CompletableFuture.supplyAsync(() -> {
            HashSet<String> roHashSet = new HashSet<>(resolutionOptions);

            String resolvedEntityName = "Resolved_" + inputEntity.getEntityName();

            ResolveOptions ro = new ResolveOptions(inputEntity.getInDocument());
            ro.setDirectives(new AttributeResolutionDirectiveSet(roHashSet));

            CdmFolderDefinition resolvedFolder = corpus.getStorage().fetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder).join();

            return resolvedEntity;
        });
    }
}
