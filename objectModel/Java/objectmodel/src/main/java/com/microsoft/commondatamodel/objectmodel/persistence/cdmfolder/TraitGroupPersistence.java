// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TraitGroup;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class TraitGroupPersistence {

  public static CdmTraitGroupDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    final CdmTraitGroupDefinition traitGroup = ctx.getCorpus().makeObject(CdmObjectType.TraitGroupDef, obj.get("traitGroupName").asText());

    if (obj.get("explanation") != null)
      traitGroup.setExplanation(obj.get("explanation").asText());

    Utils.addListToCdmCollection(traitGroup.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, obj.get("exhibitsTraits")));

    return traitGroup;
  }

  public static TraitGroup toData(final CdmTraitGroupDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
    final TraitGroup traitGroup = new TraitGroup();

    traitGroup.setExplanation(instance.getExplanation());
    traitGroup.setTraitGroupName(instance.getTraitGroupName());
    traitGroup.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));

    return traitGroup;
  }
}
