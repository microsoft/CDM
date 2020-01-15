package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.List;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedEntity {

  private CdmEntityDefinition entity;
  private String resolvedName;
  private ResolvedTraitSet resolvedTraits;
  private ResolvedAttributeSet resolvedAttributes;
  private ResolvedEntityReferenceSet resolvedEntityReferences;

  public ResolvedEntity(final CdmEntityDefinition entDef, final ResolveOptions resOpt) {
    this.entity = entDef;
    this.resolvedName = this.entity.getName();
    this.resolvedTraits = this.entity.fetchResolvedTraits(resOpt);
    this.resolvedAttributes = this.entity.fetchResolvedAttributes(resOpt);
    this.resolvedEntityReferences = this.entity.fetchResolvedEntityReferences(resOpt);
  }

  public String getSourceName() {
    return entity.getSourceName();
  }

  public String getDescription() {
    return entity.getDescription();
  }

  public String getDisplayName() {
    return entity.getDisplayName();
  }

  public String getVersion() {
    return entity.getVersion();
  }

  public List<String> getCdmSchemas() {
    return entity.getCdmSchemas();
  }

  public void spewProperties(final StringSpewCatcher to, final String indent) {
    if (getDisplayName() != null) {
      to.spewLine(indent + "displayName: " + getDisplayName());
    }
    if (getDescription() != null) {
      to.spewLine(indent + "description: " + getDescription());
    }
    if (getVersion() != null) {
      to.spewLine(indent + "version: " + getVersion());
    }
    if (getSourceName() != null) {
      to.spewLine(indent + "sourceName: " + getSourceName());
    }
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final boolean nameSort)
      throws IOException {
    to.spewLine(indent + "=====ENTITY=====");
    to.spewLine(indent + getResolvedName());
    to.spewLine(indent + "================");
    to.spewLine(indent + "properties:");
    spewProperties(to, indent + " ");
    to.spewLine(indent + "traits:");
    if (resolvedTraits != null) {
      resolvedTraits.spew(resOpt, to, indent + " ", nameSort);
    }
    to.spewLine("attributes:");
    if (resolvedAttributes != null) {
      resolvedAttributes.spew(resOpt, to, indent + " ", nameSort);
    }
    to.spewLine("relationships:");
    if (resolvedEntityReferences != null) {
      resolvedEntityReferences.spew(resOpt, to, indent + " ", nameSort);
    }
  }

  public CdmEntityDefinition getEntity() {
    return entity;
  }

  public void setEntity(final CdmEntityDefinition entity) {
    this.entity = entity;
  }

  public String getResolvedName() {
    return resolvedName;
  }

  public void setResolvedName(final String resolvedName) {
    this.resolvedName = resolvedName;
  }

  public ResolvedTraitSet fetchResolvedTraits() {
    return resolvedTraits;
  }

  public void setResolvedTraits(final ResolvedTraitSet resolvedTraits) {
    this.resolvedTraits = resolvedTraits;
  }

  public ResolvedAttributeSet getResolvedAttributes() {
    return resolvedAttributes;
  }

  public void setResolvedAttributes(final ResolvedAttributeSet resolvedAttributes) {
    this.resolvedAttributes = resolvedAttributes;
  }

  public ResolvedEntityReferenceSet getResolvedEntityReferences() {
    return resolvedEntityReferences;
  }

  public void setResolvedEntityReferences(final ResolvedEntityReferenceSet resolvedEntityReferences) {
    this.resolvedEntityReferences = resolvedEntityReferences;
  }
}