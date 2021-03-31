// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

public class E2ERelationshipPersistence {
  public static CdmE2ERelationship fromData(final CdmCorpusContext ctx, final E2ERelationship dataObj) {
    final CdmE2ERelationship relationship = ctx.getCorpus().makeObject(CdmObjectType.E2ERelationshipDef);
    if (!StringUtils.isNullOrTrimEmpty(dataObj.getName())) {
      relationship.setName(dataObj.getName());
    }
    relationship.setFromEntity(dataObj.getFromEntity());
    relationship.setFromEntityAttribute(dataObj.getFromEntityAttribute());
    relationship.setToEntity(dataObj.getToEntity());
    relationship.setToEntityAttribute(dataObj.getToEntityAttribute());
    Utils.addListToCdmCollection(relationship.getExhibitsTraits(), Utils.createTraitReferenceList(ctx, dataObj.getExhibitsTraits()));
    
    return relationship;
  }

  public static E2ERelationship toData(final CdmE2ERelationship instance, final ResolveOptions resOpt,
                                       final CopyOptions options) {
    final E2ERelationship e2ERelationship = new E2ERelationship();
    if (!StringUtils.isNullOrTrimEmpty(instance.getName())) {
      e2ERelationship.setName(instance.getName());
    }
    e2ERelationship.setFromEntity(instance.getFromEntity());
    e2ERelationship.setFromEntityAttribute(instance.getFromEntityAttribute());
    e2ERelationship.setToEntity(instance.getToEntity());
    e2ERelationship.setToEntityAttribute(instance.getToEntityAttribute());
    e2ERelationship.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));
    return e2ERelationship;
  }
}
