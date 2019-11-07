package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;

public class E2ERelationshipPersistence {
  public static CdmE2ERelationship fromData(final CdmCorpusContext ctx, final E2ERelationship dataObj) {
    final CdmE2ERelationship relationship = ctx.getCorpus().makeObject(CdmObjectType.E2ERelationshipDef);
    relationship.setFromEntity(dataObj.getFromEntity());
    relationship.setFromEntityAttribute(dataObj.getFromEntityAttribute());
    relationship.setToEntity(dataObj.getToEntity());
    relationship.setToEntityAttribute(dataObj.getFromEntityAttribute());
    return relationship;
  }

  public static E2ERelationship toData(final CdmE2ERelationship instance) {
    final E2ERelationship e2ERelationship = new E2ERelationship();
    e2ERelationship.setFromEntity(instance.getFromEntity());
    e2ERelationship.setFromEntityAttribute(instance.getFromEntityAttribute());
    e2ERelationship.setToEntity(instance.getToEntity());
    e2ERelationship.setToEntityAttribute(instance.getFromEntityAttribute());
    return e2ERelationship;
  }
}
