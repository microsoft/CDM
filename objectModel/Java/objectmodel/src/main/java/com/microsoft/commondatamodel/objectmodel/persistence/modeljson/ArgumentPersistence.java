// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Annotation;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.concurrent.CompletableFuture;

public class ArgumentPersistence {

  public static CompletableFuture<CdmArgumentDefinition> fromData(final CdmCorpusContext ctx, final Annotation obj) {
    return CompletableFuture.supplyAsync(() -> {
      final CdmArgumentDefinition argument = ctx.getCorpus()
              .makeObject(CdmObjectType.ArgumentDef, null, false);

      argument.setName(obj.getName());
      argument.setValue(obj.getValue());

      return argument;
    });
  }

  public static CompletableFuture<Annotation> toData(final CdmArgumentDefinition instance, final ResolveOptions resOpt,
                                                     final CopyOptions options) {
    return CompletableFuture.supplyAsync(() -> {
      if (instance.getValue() instanceof String) {
        final Annotation annotation = new Annotation();
        annotation.setName(instance.getName());
        annotation.setValue((String) instance.getValue());

        return annotation;
      }

      return null;
    });
  }
}
