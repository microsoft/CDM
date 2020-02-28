// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestDeclaration;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class ManifestDeclarationPersistence {

  public static CdmManifestDeclarationDefinition fromData(final CdmCorpusContext ctx, final ManifestDeclaration obj) {
    final CdmManifestDeclarationDefinition newManifestDoc = ctx.getCorpus()
            .makeObject(CdmObjectType.ManifestDeclarationDef, obj.getManifestName());
    newManifestDoc.setDefinition(obj.getDefinition());

    if (obj.getLastFileStatusCheckTime() != null) {
      newManifestDoc.setLastFileStatusCheckTime(obj.getLastFileStatusCheckTime());
    }

    if (obj.getLastFileModifiedTime() != null) {
      newManifestDoc.setLastFileModifiedTime(obj.getLastFileModifiedTime());
    }

    if (obj.getExplanation() != null) {
      newManifestDoc.setExplanation(obj.getExplanation());
    }

    return newManifestDoc;
  }

  public static ManifestDeclaration toData(final CdmManifestDeclarationDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
    final ManifestDeclaration result = new ManifestDeclaration();

    result.setExplanation(instance.getExplanation());
    result.setManifestName(instance.getManifestName());
    result.setLastFileStatusCheckTime(instance.getLastFileStatusCheckTime());
    result.setLastFileModifiedTime(instance.getLastFileModifiedTime());
    result.setDefinition(instance.getDefinition());

    return result;
  }
}
