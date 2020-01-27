package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ConstantEntity;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.List;

public class ConstantEntityPersistence {

  public static CdmConstantEntityDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    final String constantEntityName = obj.get("constantEntityName") != null ? obj.get("constantEntityName").asText() : null;
    final CdmConstantEntityDefinition constantEntity = ctx.getCorpus().makeObject(CdmObjectType.ConstantEntityDef, constantEntityName);

    if (obj.get("explanation") != null) {
      constantEntity.setExplanation(obj.get("explanation").asText());
    }

    constantEntity.setConstantValues(JMapper.MAP.convertValue(obj.get("constantValues"), new TypeReference<List<List<String>>>(){}));
    constantEntity.setEntityShape(EntityReferencePersistence.fromData(ctx, obj.get("entityShape")));

    return constantEntity;
  }

  public static ConstantEntity toData(final CdmConstantEntityDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
    final ConstantEntity constantEntity = new ConstantEntity();

    constantEntity.setExplanation(instance.getExplanation());
    constantEntity.setConstantEntityName(instance.getConstantEntityName());
    constantEntity.setEntityShape(Utils.jsonForm(instance.getEntityShape(), resOpt, options));
    constantEntity.setConstantValues(instance.getConstantValues());

    return constantEntity;
  }
}
