package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;

public class AttributeResolutionApplier {
    public String matchName;
    public int priority;
    public boolean overridesBase;

  public BiFunction<ResolveOptions, CdmAttributeResolutionGuidance, Boolean> willAlterDirectives;
  public BiConsumer<ResolveOptions, CdmAttributeResolutionGuidance> doAlterDirectives;
    public Function<ApplierContext, Boolean> willCreateContext;
    public Consumer<ApplierContext> doCreateContext;
    public Function<ApplierContext, Boolean> willRemove;
    public Function<ApplierContext, Boolean> willAttributeModify;
    public Consumer<ApplierContext> doAttributeModify;
    public Function<ApplierContext, Boolean> willGroupAdd;
    public Consumer<ApplierContext> doGroupAdd;
    public Function<ApplierContext, Boolean> willRoundAdd;
    public Consumer<ApplierContext> doRoundAdd;
    public Function<ApplierContext, Boolean> willAttributeAdd;
    public Consumer<ApplierContext> doAttributeAdd;
}
