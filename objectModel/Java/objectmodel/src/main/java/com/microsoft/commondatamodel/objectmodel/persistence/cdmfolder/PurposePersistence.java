package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmPurposeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Purpose;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

public class PurposePersistence {

  public static CdmPurposeDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    final CdmPurposeDefinition purpose = ctx.getCorpus().makeObject(CdmObjectType.PurposeDef, obj.get("purposeName").asText());
    purpose.setExtendsPurpose(PurposeReferencePersistence.fromData(ctx, obj.get("extendsPurpose")));
    if (obj.get("explanation") != null) {
      purpose.setExplanation(obj.get("explanation").asText());
    }
    Utils.addListToCdmCollection(purpose.getExhibitsTraits(),
            Utils.createTraitReferenceList(ctx, obj.get("exhibitsTraits")));
    return purpose;
  }

  public static Purpose toData(final CdmPurposeDefinition instance, final ResolveOptions resOpt,
                               final CopyOptions options) {
    final Purpose purpose = new Purpose();
    purpose.setExplanation(instance.getExplanation());
    purpose.setPurposeName(instance.getPurposeName());
    purpose.setExtendsPurpose(Utils.jsonForm(instance.getExtendsPurpose(), resOpt, options));
    purpose.setExhibitsTraits(Utils.listCopyDataAsArrayNode(instance.getExhibitsTraits(), resOpt, options));
    return purpose;
  }
}