// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Trait;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.List;

public class TraitPersistence {

  public static CdmTraitDefinition fromData(final CdmCorpusContext ctx, final JsonNode obj) {
    final CdmTraitDefinition trait = ctx.getCorpus().makeObject(CdmObjectType.TraitDef, obj.get("traitName").asText());
    trait.setExtendsTrait(TraitReferencePersistence.fromData(ctx, obj.get("extendsTrait")));

    if (obj.get("explanation") != null)
      trait.setExplanation(obj.get("explanation").asText());

    if (obj.get("hasParameters") != null) {
      obj.get("hasParameters").forEach(ap ->
              trait.getParameters().add(ParameterPersistence.fromData(ctx, ap))
      );
    }

    if (obj.get("elevated") != null) {
      trait.setElevated(obj.get("elevated").asBoolean());
    }
    if (obj.get("ugly") != null) {
      trait.setUgly(obj.get("ugly").asBoolean());
    }
    if (obj.get("associatedProperties") != null) {
      trait.setAssociatedProperties(JMapper.MAP.convertValue(obj.get("associatedProperties"), new TypeReference<List<String>>() {
      }));
    }
    return trait;
  }

  public static Trait toData(final CdmTraitDefinition instance, final ResolveOptions resOpt, final CopyOptions options) {
    final Trait trait = new Trait();
    trait.setExplanation(instance.getExplanation());
    trait.setTraitName(instance.getTraitName());
    trait.setExtendsTrait(Utils.jsonForm(instance.getExtendsTrait(), resOpt, options));
    trait.setParameters(Utils.listCopyDataAsArrayNode(instance.getParameters(), resOpt, options));

    trait.setElevated(instance.getElevated() != null && instance.getElevated() ? true : null);
    trait.setUgly(instance.getUgly() != null && instance.getUgly() ? true : null);
    trait.setAssociatedProperties(instance.getAssociatedProperties());
    return trait;
  }
}
