// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import java.util.List;
import java.util.Objects;

/**
 * {@link CdmCollection} customized for {@link CdmArgumentDefinition}
 */
public class CdmArgumentCollection extends CdmCollection<CdmArgumentDefinition> {

  /**
   * Constructs a CdmArgumentCollection
   *
   * @param ctx   The context.
   * @param owner The owner of the collection.
   *              Has to be a {@link CdmTraitReference}
   *              because this collection is optimized
   *              to handle adjustments to the trait when adding an argument.
   */
  public CdmArgumentCollection(final CdmCorpusContext ctx, final CdmTraitReference owner) {
    super(ctx, owner, CdmObjectType.ArgumentDef);
  }

  @Override
  public CdmTraitReference getOwner() {
    return (CdmTraitReference) super.getOwner();
  }

  @Override
  public CdmArgumentDefinition add(final CdmArgumentDefinition cdmArgumentDefinition) {
    this.getOwner().resolvedArguments = false;
    return super.add(cdmArgumentDefinition);
  }

  /**
   * Creates an argument based on the name and value provided and adds it to the collection.
   *
   * @param name  The name of the argument to be created and added to the collection.
   * @param value The value of the argument to be created and added to the collection.
   * @return The created argument.
   */
  public CdmArgumentDefinition add(final String name, final Object value) {
    final CdmArgumentDefinition argument = super.add(name);
    argument.setValue(value);
    this.getOwner().resolvedArguments = false;
    return argument;
  }

  @Override
  public void add(int index, CdmArgumentDefinition arg) {
    this.getOwner().setResolvedArguments(false);
    super.add(index, arg);
  }

  public void addAll(final List<CdmArgumentDefinition> argumentList) {
    argumentList.forEach(this::add);
  }

  /**
   * Retrieves the value of the argument with the provided name.
   *
   * @param name The name of the argument we should fetch the value for
   * @return The value of the argument.
   */
  public Object fetchValue(final String name) {
    for (final CdmArgumentDefinition argument : this.getAllItems()) {
      if (Objects.equals(argument.getName(), name)) {
        return argument.getValue();
      }
    }

    // Special case with only one argument and no name give,
    // make a big assumption that this is the one they want
    // right way is to look up parameter def and check name,
    // but this public interface is for working on an unresolved def
    if (this.getAllItems().size() == 1 && this.getAllItems().get(0).getName() == null) {
      return this.getAllItems().get(0).getValue();
    }

    return null;
  }

  /**
   * Updates the value of an existing argument, or,
   * in case no argument is found with the provided name, an argument is created and added.
   *
   * @param name  The name of the argument to be updated.
   * @param value The value to update the argument with.
   */
  public void updateArgument(final String name, final Object value) {
    this.makeDocumentDirty();
    for (final CdmArgumentDefinition argument : this.getAllItems()) {
      if (Objects.equals(argument.getName(), name)) {
        argument.setValue(value);
        return;
      }
    }

    this.add(name, value);
  }
}
