// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Objects;
import java.util.function.Predicate;

/**
 * The CDM Definition for a collection that holds a set of CDM objects.
 */
public class CdmCollection<T extends CdmObject> implements Iterable<T> {
  final List<T> allItems;
  private final CdmCorpusContext ctx;
  private final CdmObjectType defaultType;
  private final CdmObject owner;

  public CdmCollection(
      final CdmCorpusContext ctx,
      final CdmObject owner,
      final CdmObjectType defaultType) {
    this.ctx = ctx;
    // Use a synchronized list here to make this thread-safe, as we can occasionally run into a scenario where multiple
    // threads add items to this list at the same time (before the list is able to resize), which causes an ArrayIndexOutOfBoundsException
    // to be thrown.
    this.allItems = Collections.synchronizedList(new ArrayList<>());
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
      final int lItem = this.getCount();
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
    return this.add(newObj);
  }

  /**
   * Adds an object to the collection. Also makes modifications to the object.
   * @param currObject The object to be added to the collection.
   * @return The object added to the collection.
   */
  public T add(final T currObject) {
    makeDocumentDirty();
    currObject.setOwner(this.getOwner());
    this.propagateInDocument(
        currObject,
        this.getOwner() == null
            ? null
            : this.getOwner().getInDocument());
    this.allItems.add(currObject);
    return currObject;
  }

  public boolean remove(final T currObject) {
    final boolean wasRemoved = this.allItems.remove(currObject);
    this.propagateInDocument(currObject, null);
    if (wasRemoved) {
      currObject.setOwner(null);
      makeDocumentDirty();
    }
    return wasRemoved;
  }

  /**
   * Removes an item from the given index.
   * @param index Index of the item to remove.
   */
  public void removeAt(int index) {
    if (index >= 0 && index < this.getCount()) {
      // This is different from C# to prevent calling this.remove() in a child class.
      T currObject = this.allItems.get(index);
      final boolean wasRemoved = this.allItems.remove(currObject);
      this.propagateInDocument(currObject, null);
      if (wasRemoved) {
        currObject.setOwner(null);
        makeDocumentDirty();
      }
    }
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
    this.allItems.forEach(item -> {
      item.setOwner(null);
      this.propagateInDocument(item, null);
    });
    makeDocumentDirty();
    this.allItems.clear();
  }

  public T get(final int index) {
    return this.allItems.get(index);
  }

  public T set(final int index, final T element) {
    return this.allItems.set(index, element);
  }

  /**
   * Inserts an {@link CdmObject} at the given index.
   * @param index Index of the {@link CdmObject}.
   * @param element The CdmObject to insert.
   */
  public void add(final int index, final T element) {
    element.setOwner(this.owner);
    this.propagateInDocument(element, this.getOwner().getInDocument());
    makeDocumentDirty();
    this.allItems.add(index, element);
  }

  /**
   * Creates a copy of the current CdmCollection.
   */
  public CdmCollection<T> copy(final ResolveOptions resOpt) {
    return copy(resOpt, null);
  }

  /**
   * Creates a copy of the current CdmCollection.
   */
  public CdmCollection<T> copy(final ResolveOptions resOpt, final CdmObject host) {
    final CdmCollection<T> copy =
        new CdmCollection<>(this.getCtx(), this.getOwner(), this.getDefaultType());
    this.allItems.forEach(element -> copy.add((T) element.copy(resOpt)));
    return copy;
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
   * Make the outermost document containing this collection dirty because the collection was changed.
   */
  void makeDocumentDirty() {
    if (!this.getCtx().getCorpus().isCurrentlyResolving) {
      CdmDocumentDefinition document = null;
      if (this.getOwner() != null && this.getOwner().getInDocument() != null) {
        document = this.getOwner().getInDocument();
      } else if (this.getOwner() instanceof CdmDocumentDefinition) {
        document = (CdmDocumentDefinition) this.getOwner();
      }

      if (document != null) {
        document.setDirty(true);
        document.setNeedsIndexing(true);
      }
    }
  }

  /**
   * Propagate document through all objects.
   * @param cdmObject The object.
   * @param document The document.
   */
  void propagateInDocument(CdmObject cdmObject, CdmDocumentDefinition document) {
    if (!this.getCtx().getCorpus().isCurrentlyResolving)  {
      this.getCtx().getCorpus().blockDeclaredPathChanges = true;
      cdmObject.visit("", (obj, path) -> {
        // If object's document is already the same as the one we're trying to set
        // then we're assuming that every sub-object is also set to it, so bail out.
        if (Objects.equals(obj.getInDocument(), document)) {
          return true;
        }

        obj.setInDocument(document);
        return false;
      }, null);
      this.getCtx().getCorpus().blockDeclaredPathChanges = false;
    }
  }
}
