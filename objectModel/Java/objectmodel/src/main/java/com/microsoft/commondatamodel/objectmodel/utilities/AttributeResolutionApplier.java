// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;

public class AttributeResolutionApplier {
  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public String matchName;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public int priority;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public boolean overridesBase;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public BiFunction<ResolveOptions, CdmAttributeResolutionGuidance, Boolean> willAlterDirectives;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public BiConsumer<ResolveOptions, CdmAttributeResolutionGuidance> doAlterDirectives;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Function<ApplierContext, Boolean> willCreateContext;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Consumer<ApplierContext> doCreateContext;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Function<ApplierContext, Boolean> willRemove;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Function<ApplierContext, Boolean> willAttributeModify;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Consumer<ApplierContext> doAttributeModify;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Function<ApplierContext, Boolean> willGroupAdd;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Consumer<ApplierContext> doGroupAdd;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Function<ApplierContext, Boolean> willRoundAdd;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Consumer<ApplierContext> doRoundAdd;

  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Function<ApplierContext, Boolean> willAttributeAdd;
  
  /**
   * @deprecated This field is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Consumer<ApplierContext> doAttributeAdd;
}
