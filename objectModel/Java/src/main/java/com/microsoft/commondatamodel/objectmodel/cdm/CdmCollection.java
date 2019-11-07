package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.function.Predicate;

/**
 * The CDM Definition for a collection that holds a set of CDM objects.
 */
public class CdmCollection<T extends CdmObject> implements Iterable<T> {
  final List<T> allItems;
  private final CdmCorpusContext ctx;
  private final CdmObjectType defaultType;
  private final CdmObject owner;

  /**
   * Outermost document containing this collection.
   * This document is to be made "dirty" if anything is changed in the collection.
   */
  private CdmDocumentDefinition outermostDocument;

  public CdmCollection(
      final CdmCorpusContext ctx,
      final CdmObject owner,
      final CdmObjectType defaultType) {
    this.ctx = ctx;
    this.allItems = new ArrayList<>();
    this.defaultType = defaultType;
    this.owner = owner;
  }

  public CdmCollection(final T cdmObject) {
    this(cdmObject.getCtx(), cdmObject.getOwner(), cdmObject.getObjectType());
  }

  public CdmCollection(final CdmCollection<T> original) {
    this(original.ctx, original.owner, original.defaultType);
    this.allItems.addAll(original.allItems);
  }

  public boolean visitList(
      final String path,
      final VisitCallback preChildren,
      final VisitCallback postChildren) {
    boolean result = false;
    if (this.getAllItems() != null) {
      final int lItem = this.getAllItems().size();
      for (int iItem = 0; iItem < lItem; iItem++) {
        final CdmObject element = this.getAllItems().get(iItem);
        if (element != null) {
          if (element.visit(path, preChildren, postChildren)) {
            result = true;
            break;
          }
        }
      }
    }
    return result;
  }

  public int size() {
    return this.allItems.size();
  }

  public boolean isEmpty() {
    return this.allItems.isEmpty();
  }

  public boolean contains(final Object o) {
    return this.allItems.contains(o);
  }

  public Iterator<T> iterator() {
    return this.allItems.iterator();
  }

  public Object[] toArray() {
    return this.allItems.toArray();
  }

  public <T1> T1[] toArray(final T1[] a) {
    return this.allItems.toArray(a);
  }

  public int getCount() {
    return this.allItems.size();
  }

  /**
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public List<T> getAllItems() {
    return this.allItems;
  }

  public CdmObject getOwner() {
    return owner;
  }

  public CdmCorpusContext getCtx() {
    return ctx;
  }

  public CdmObjectType getDefaultType() {
    return defaultType;
  }

  /**
   * Creates an object of the default type of the collection,
   * assigns it the name passed as parameter and adds it to the collection.
   * {@code simpleRef} defaults to {@code false}.
   *
   * @see CdmCollection#add(String, boolean)
   *
   * @param name      The name to be used for the newly created object.
   * @return The newly created object after it was added to the collection.
   */
  public T add(final String name) {
    return add(name, false);
  }

  /**
   * Creates an object of the default type of the collection,
   * assigns it the name passed as parameter and adds it to the collection.
   *
   * @param name      The name to be used for the newly created object.
   * @param simpleRef Only used for some types.
   *                  It is used to populate "simpleNamedReference"
   *                  property of the newly created object.
   * @return The newly created object after it was added to the collection.
   */
  public T add(final String name, final boolean simpleRef) {
    final T newObj = this.ctx.getCorpus().makeObject(this.defaultType, name, simpleRef);
    newObj.setOwner(this.owner);
    return this.add(newObj);
  }

  /**
   * Adds an object to the collection. Also makes modifications to the object.
   * @param currObject The object to be added to the collection.
   * @return The object added to the collection.
   */
  public T add(final T currObject) {
    makeDocumentDirty();
    currObject.setOwner(this.owner);
    this.allItems.add(currObject);
    return currObject;
  }

  public boolean remove(final T currObject) {
    final boolean wasRemoved = this.allItems.remove(currObject);
    if (wasRemoved) {
      currObject.setOwner(null);
      makeDocumentDirty();
    }
    return wasRemoved;
  }

  public T item(final String name) {
    return this.allItems.stream().filter((x) -> x.fetchObjectDefinitionName().equals(name)).findFirst().orElse(null);
  }

  public boolean remove(final Object o) {
    return this.allItems.remove(o);
  }

  public void addAll(final CdmCollection<T> cdmCollection) {
    for (final T t : cdmCollection) {
      this.add(t);
    }
  }

  public void addAll(final Collection<? extends T> c) {
    for (final T t : c) {
      this.add(t);
    }
  }

  public void addAll(final int index, final Collection<? extends T> c) {
    for (final T t : c) {
      this.add(index, t);
    }
  }

  public void clear() {
    this.allItems.forEach(item -> item.setOwner(null));
    makeDocumentDirty();
    this.allItems.clear();
  }

  public T get(final int index) {
    return this.allItems.get(index);
  }

  public T set(final int index, final T element) {
    return this.allItems.set(index, element);
  }

  public void add(final int index, final T element) {
    element.setOwner(this.owner);
    makeDocumentDirty();
    this.allItems.add(index, element);
  }

  public void removeAt(final int index) {
    if (index >= 0 && index < this.allItems.size()) {
      this.allItems.get(index).setOwner(null);
      makeDocumentDirty();
      this.allItems.remove(index);
    }
  }

  public int indexOf(final Object o) {
    return this.allItems.indexOf(o);
  }

  public ListIterator<T> listIterator() {
    return this.allItems.listIterator();
  }

  public ListIterator<T> listIterator(final int index) {
    return this.allItems.listIterator(index);
  }

  public CdmCollection<T> shallowCloneAndFilter(final Predicate<T> predicate) {
    final CdmCollection<T> clone = new CdmCollection<>(this.ctx, this.owner, this.defaultType);
    for (final T item : this.allItems) {
      if (predicate.test(item)) {
        clone.add(item);
      }
    }
    return clone;
  }

  public void sort(Comparator<? super T> c) {
    Object[] a = this.toArray();
    Arrays.sort(a, (Comparator) c);
    ListIterator<T> i = this.listIterator();
    for (Object e : a) {
      i.next();
      i.set((T) e);
    }
  }

  /**
   * Calculates the outermost document containing this collection.
   * @return The outermost document containing collection.
   */
  private CdmDocumentDefinition calculateOutermostDocument() {
    CdmDocumentDefinition document;
    if (this.owner != null && this.owner.getInDocument() != null) {
      document = this.owner.getInDocument();
    } else {
      document = this.owner instanceof CdmDocumentDefinition
          ? (CdmDocumentDefinition) this.owner
          : null;
    }
    while (document != null
        && document.getInDocument() != null
        && document != document.getInDocument()) {
      document = document.getInDocument();
    }
    return document;
  }

  /**
   * Make the outermost document containing this collection dirty because the collection was changed.
   */
  void makeDocumentDirty() {
    if (this.outermostDocument == null) {
      this.outermostDocument = this.calculateOutermostDocument();
    }
    if (this.outermostDocument != null) {
      this.outermostDocument.setDirty(true);
    }
  }
}
