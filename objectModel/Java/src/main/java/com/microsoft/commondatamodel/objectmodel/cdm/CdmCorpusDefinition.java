package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmValidationStep;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ParameterCollection;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageManager;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.DocsResult;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.SymbolSet;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.apache.commons.lang3.mutable.MutableInt;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CdmCorpusDefinition {
  private static final Logger LOGGER = LoggerFactory.getLogger(CdmCorpusDefinition.class);
  private static final String cdmExtension = "cdm.json";

  private static AtomicInteger nextId = new AtomicInteger(0);
  private final StorageManager storage;
  private CdmCorpusContext ctx;
  final private Map<CdmEntityDefinition, ArrayList<CdmE2ERelationship>> outgoingRelationships;
  final private Map<CdmEntityDefinition, ArrayList<CdmE2ERelationship>> incomingRelationships;
  final private Map<String, List<CdmEntityDefinition>> symbol2EntityDefList;

  private String appId;
  private String rootPath;
  private List<Pair<CdmFolderDefinition, CdmDocumentDefinition>> allDocuments;
  private Map<CdmDocumentDefinition, CdmFolderDefinition> directory;
  private Map<String, Pair<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup;
  private Map<String, List<CdmDocumentDefinition>> symbolDefinitions;
  private Map<String, SymbolSet> definitionReferenceSymbols;
  private Map<String, String> definitionWrtTag;
  private Map<String, ResolvedTraitSet> emptyRts;

  private Map<String, CdmObject> objectCache;

  /**
   * Whether we are currently performing a resolution or not.
   * Used to stop making documents dirty during CdmCollections operations.
   */
  boolean isCurrentlyResolving = false;

  /**
   * Used by Visit functions of CdmObjects to skip calculating the declaredPath.
   */
  boolean blockDeclaredPathChanges = false;

  public CdmCorpusDefinition() {
    this.allDocuments = new ArrayList<>();
    this.pathLookup = new LinkedHashMap<>();
    this.directory = new LinkedHashMap<>();
    this.symbolDefinitions = new LinkedHashMap<>();
    this.definitionReferenceSymbols = new LinkedHashMap<>();
    this.definitionWrtTag = new LinkedHashMap<>();
    this.emptyRts = new LinkedHashMap<>();

    this.setCtx(new ResolveContext(this));
    this.storage = new StorageManager(this);

    this.outgoingRelationships = new LinkedHashMap<>();
    this.incomingRelationships = new LinkedHashMap<>();
    this.symbol2EntityDefList = new LinkedHashMap<>();
    this.objectCache = new LinkedHashMap<>();
  }

  public static CdmDocumentDefinition fetchPriorityDocument(final List<CdmDocumentDefinition> docs,
                                                            final Map<CdmDocumentDefinition, Integer> importPriority) {
    CdmDocumentDefinition docBest = null;
    int indexBest = Integer.MAX_VALUE;
    for (final CdmDocumentDefinition docDefined : docs) {
      // is this one of the imported docs?
      final boolean worked = importPriority.containsKey(docDefined);
      final int indexFound = importPriority.getOrDefault(docDefined, Integer.MAX_VALUE);

      if (worked && indexFound < indexBest) {
        indexBest = indexFound;
        docBest = docDefined;
        // hard to be better than the best
        if (indexBest == 0) {
          break;
        }
      }
    }
    return docBest;
  }

  public static String createCacheKeyFromObject(final CdmObject definition, final String kind) {
    return definition.getId() + "-" + kind;
  }

  private static String pathToSymbol(final String symbol, final CdmDocumentDefinition docFrom, final DocsResult docResultTo) {
    // If no destination is given, then there is no path to look for.
    if (docResultTo.getDocBest() == null) {
      return null;
    }

    // If there, return.
    if (docFrom == docResultTo.getDocBest()) {
      return docResultTo.getNewSymbol();
    }

    // If the to Doc is imported directly here...
    final Integer pri = docFrom.getImportPriorities().getImportPriority()
        .get(docResultTo.getDocBest());
    if (pri != null) {
      // If the imported version is the highest priority, we are good.
      if (docResultTo.getDocList() == null || docResultTo.getDocList().size() == 1) {
        return symbol;
      }

      // More than 1 symbol, see if highest pri.
      Integer maxPri = 0;
      for (final CdmDocumentDefinition docImpl : docResultTo.getDocList()) {
        final Optional<Entry<CdmDocumentDefinition, Integer>> maxEntry = docImpl.getImportPriorities()
            .getImportPriority().entrySet().parallelStream()
            .max(Comparator.comparing(Entry::getValue));

        maxPri = Math.max(maxPri, maxEntry.get().getValue());
      }

      if (maxPri != null && maxPri.equals(pri)) {
        return symbol;
      }
    }

    // Can't get there directly, check the monikers.
    if (null != docFrom.getImportPriorities().getMonikerPriorityMap()) {
      for (final Map.Entry<String, CdmDocumentDefinition> kv : docFrom.getImportPriorities()
          .getMonikerPriorityMap().entrySet()) {
        final String tryMoniker = pathToSymbol(symbol, kv.getValue(), docResultTo);
        if (tryMoniker != null) {
          return String.format("%s/%s", kv.getKey(), tryMoniker);
        }
      }
    }

    return null;
  }

  public static CdmObjectType mapReferenceType(final CdmObjectType ofType) {
    switch (ofType) {
      case ArgumentDef:
      case DocumentDef:
      case ManifestDef:
      case Import:
      case ParameterDef:
      default:
        return CdmObjectType.Error;

      case AttributeGroupRef:
      case AttributeGroupDef:
        return CdmObjectType.AttributeGroupRef;

      case ConstantEntityDef:
      case EntityDef:
      case EntityRef:
        return CdmObjectType.EntityRef;

      case DataTypeDef:
      case DataTypeRef:
        return CdmObjectType.DataTypeRef;

      case PurposeDef:
      case PurposeRef:
        return CdmObjectType.PurposeRef;

      case TraitDef:
      case TraitRef:
        return CdmObjectType.TraitRef;

      case EntityAttributeDef:
      case TypeAttributeDef:
      case AttributeRef:
        return CdmObjectType.AttributeRef;

      case AttributeContextDef:
      case AttributeContextRef:
        return CdmObjectType.AttributeContextRef;
    }
  }

  static int getNextId() {
    return nextId.incrementAndGet();
  }

  public boolean validate() {
    return false;
  }

  public String getRootPath() {
    return this.rootPath;
  }

  public void setRootPath(final String value) {
    this.rootPath = value;
  }

  public <T extends CdmObject> T makeObject(final CdmObjectType ofType, final String nameOrRef) {
    return this.makeObject(ofType, nameOrRef, false);
  }

  public <T extends CdmObject> T makeObject(final CdmObjectType ofType) {
    return this.makeObject(ofType, null, false);
  }

  private void checkPrimaryKeyAttributes(final CdmEntityDefinition resolvedEntity, final ResolveOptions resOpt) {
    if (resolvedEntity.fetchResolvedTraits(resOpt).find(resOpt, "is.identifiedBy") == null) {
      LOGGER.warn("There is a primary key missing for the entry '{}'.", resolvedEntity.getName());
    }
  }

  public String createDefinitionCacheTag(final ResolveOptions resOpt, final CdmObjectBase definition, final String kind) {
    return createDefinitionCacheTag(resOpt, definition, kind, "", false);
  }

  public CdmDocumentDefinition addDocumentObjects(final CdmFolderDefinition cdmFolderDefinition, final CdmDocumentDefinition docDef) {
    final CdmDocumentDefinition doc = docDef;
    final String path = this.storage.createAbsoluteCorpusPath(doc.getFolderPath() + doc.getName(), doc)
        .toLowerCase();
    if (!this.getPathLookup().containsKey(path)) {
      this.getAllDocuments().add(new ImmutablePair<>(cdmFolderDefinition, doc));
      this.getPathLookup().put(path, new ImmutablePair<>(cdmFolderDefinition, doc));
      this.getDirectory().put(doc, cdmFolderDefinition);
    }
    return doc;
  }

  public String createDefinitionCacheTag(final ResolveOptions resOpt, final CdmObjectBase definition, final String kind,
                                         final String extraTags) {
    return createDefinitionCacheTag(resOpt, definition, kind, extraTags, false);
  }

  public String createDefinitionCacheTag(final ResolveOptions resOpt, final CdmObjectBase definition, final String kind,
                                         final String extraTags, final boolean useNameNotId) {
    // construct a tag that is unique for a given object in a given context
    // context is:
    //   (1) the wrtDoc has a set of imports and definitions that may change what the object is point at
    //   (2) there are different kinds of things stored per object (resolved traits, atts, etc.)
    //   (3) the directives from the resolve Options might matter
    //   (4) sometimes the caller needs different caches (extraTags) even give 1-3 are the same
    // the hardest part is (1). To do this, see if the object has a set of reference documents registered.
    // if there is nothing registered, then there is only one possible way to resolve the object so don't include doc info in the tag.
    // if there IS something registered, then the object could be ambiguous. find the 'index' of each of the ref documents (potential definition of something referenced under this scope)
    // in the wrt document's list of imports. sort the ref docs by their index, the relative ordering of found documents makes a unique context.
    // the hope is that many, many different lists of imported files will result in identical reference sortings, so lots of re-use
    // since this is an expensive operation, actually cache the sorted list associated with this object and wrtDoc

    // easy stuff first
    final String thisId;
    final String thisName = definition.fetchObjectDefinitionName();
    if (useNameNotId) {
      thisId = thisName;
    } else {
      thisId = Integer.toString(definition.getId());
    }

    final StringBuilder tagSuffix = new StringBuilder();
    tagSuffix.append(String.format("-%s-%s", kind, thisId));
    tagSuffix.append(String
        .format("-(%s)", resOpt.getDirectives() != null ? resOpt.getDirectives().getTag() : ""));
    if (!Strings.isNullOrEmpty(extraTags)) {
      tagSuffix.append(String.format("-%s", extraTags));
    }

    // is there a registered set? (for the objectdef, not for a reference) of the many symbols involved in defining this thing (might be none)
    final CdmObjectDefinition objDef = definition.fetchObjectDefinition(resOpt);
    SymbolSet symbolsRef = null;
    if (objDef != null) {
      final String key = CdmCorpusDefinition.createCacheKeyFromObject(objDef, kind);
      symbolsRef = this.definitionReferenceSymbols.get(key);
    }

    if (symbolsRef == null && thisName != null) {
      // every symbol should depend on at least itself
      final SymbolSet symSetThis = new SymbolSet();
      symSetThis.add(thisName);
      this.registerDefinitionReferenceSymbols(definition, kind, symSetThis);
      symbolsRef = symSetThis;
    }

    if (symbolsRef != null && symbolsRef.getSize() > 0) {
      // each symbol may have definitions in many documents. use importPriority to figure out which one we want
      final CdmDocumentDefinition wrtDoc = resOpt.getWrtDoc();
      final LinkedHashSet<Integer> foundDocIds = new LinkedHashSet<>();

      if (wrtDoc.getImportPriorities() != null) {
        symbolsRef.forEach(symRef -> {
          // get the set of docs where defined
          final DocsResult docsRes = this
              .docsForSymbol(resOpt, wrtDoc, definition.getInDocument(), symRef);
          // we only add the best doc if there are multiple options
          if (docsRes != null && docsRes.getDocList() != null && docsRes.getDocList().size() > 1) {
            final CdmDocumentDefinition docBest = CdmCorpusDefinition.fetchPriorityDocument(docsRes.getDocList(),
                wrtDoc.getImportPriorities().getImportPriority());
            if (docBest != null) {
              foundDocIds.add(docBest.getId());
            }
          }
        });
      }

      final List<Integer> sortedList = new ArrayList<>(foundDocIds);
      Collections.sort(sortedList);

      final String tagPre = sortedList
          .stream().map(Object::toString)
          .collect(Collectors.joining("-"));

      return tagPre + tagSuffix;
    }
    return null;
  }

  CompletableFuture<Boolean> saveDocumentAsAsync(final CdmDocumentDefinition doc, final String newName) {
    return saveDocumentAsAsync(doc, newName, false);
  }

  CompletableFuture<Boolean> saveDocumentAsAsync(final CdmDocumentDefinition doc, final String newName, final boolean saveReferenced) {
    return saveDocumentAsAsync(doc, newName, saveReferenced, null);
  }

  public <T extends CdmObjectReference> T makeRef(final CdmObjectType ofType, final Object refObj,
                                                  final boolean simpleNameRef) {
    CdmObjectReference oRef = null;
    if (refObj != null) {
      if (refObj instanceof CdmObject) {
        if (refObj == ofType) {
          // forgive this mistake, return the ref passed in
          oRef = (CdmObjectReference) refObj;
        } else {
          oRef = makeObject(ofType, null, false);
          oRef.setExplicitReference((CdmObjectDefinition) refObj);
        }
      } else {
        oRef = this.makeObject(ofType, refObj.toString().replaceAll("^\"|\"$", ""), simpleNameRef); // TODO-BQ: Remove the regex replaceAll. Ideally, we should remove Object from the signature completely.
      }
    }
    return (T) oRef;
  }

  CompletableFuture<Boolean> saveDocumentAsAsync(
      final CdmDocumentDefinition doc,
      final String newName,
      final boolean saveReferenced,
      final CopyOptions options) {
    // find out if the storage adapter is able to write.
    return CompletableFuture.supplyAsync(() -> {
      String ns = doc.getNamespace();
      if (StringUtils.isNullOrTrimEmpty(ns)) {
        ns = this.getStorage().getDefaultNamespace();
      }
      final StorageAdapter adapter = this.storage.fetchAdapter(ns);

      if (adapter == null) {
        LOGGER.error("Couldn't find a storage adapter registered for the namespace '{}'", ns);
        return false;
      } else if (!adapter.canWrite()) {
        LOGGER.error("The storage adapter '{}' claims it is unable to write files.", ns);
        return false;
      } else {
        // what kind of document is requested?
        final String persistenceType =
            org.apache.commons.lang3.StringUtils.endsWithIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)
                ? "ModelJson"
                : "CdmFolder";

        // save the object into a json blob
        final ResolveOptions resOpt = new ResolveOptions(doc);
        final Object persistedDoc;

        if (org.apache.commons.lang3.StringUtils.endsWithIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)
            || org.apache.commons.lang3.StringUtils.endsWithIgnoreCase(newName, CdmConstants.FOLIO_EXTENSION)
            || org.apache.commons.lang3.StringUtils.endsWithIgnoreCase(newName, CdmConstants.MANIFEST_EXTENSION)) {
          if ("CdmFolder".equals(persistenceType)) {
            persistedDoc =
                ManifestPersistence.toData(((CdmManifestDefinition) doc), resOpt, options);
          } else {
            if (!org.apache.commons.lang3.StringUtils.equalsIgnoreCase(newName, CdmConstants.MODEL_JSON_EXTENSION)) {
              LOGGER.error("Failed to persist '{}', as it's not an acceptable filename. It must be model.json", newName);
              return false;
            }
            persistedDoc =
                com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ManifestPersistence
                .toData(((CdmManifestDefinition) doc), resOpt, options).join();
          }
        } else {
          persistedDoc = DocumentPersistence.toData(doc, resOpt, options);
        }

        if (persistedDoc == null) {
          LOGGER.error("Failed to persist '{}'", newName);
        }

        // turn the name into a path
        String newPath = doc.getFolderPath() + newName;
        newPath = this.storage.createAbsoluteCorpusPath(newPath, doc);
        if (newPath.startsWith(ns + ":")) {
          newPath = newPath.substring(ns.length() + 1);
        }
        // ask the adapter to make it happen
        try {
          adapter.writeAsync(newPath, JMapper.WRITER.writeValueAsString(persistedDoc)).join();

          if (options.isTopLevelDocument()) {
            this.storage.saveAdapterConfig("/config.json", adapter);
            // The next document won't be top level, so reset the flag.
            options.setTopLevelDocument(false);
          }
        } catch (final Exception e) {
          LOGGER.error("Failed to write to the file '{}' for reason '{}'", newName, e.getLocalizedMessage());
        }

        // if we also want to save referenced docs, then it depends on what kind of thing just got saved
        // if a model.json there are none. If a manifest or definition doc then ask the docs to do the right things
        // definition will save imports, manifests will save imports, schemas, sub manifests
        if (saveReferenced && "CdmFolder".equals(persistenceType)) {
          if (!doc.saveLinkedDocumentsAsync(options).join()) {
            LOGGER.error("Failed to save linked documents for file '{}'", newName);
            return false;
          }
        }
      }
      return true;
    });
  }

  CompletableFuture<Void> resolveImportsAsync(
      final CdmDocumentDefinition doc,
      final LinkedHashMap<CdmDocumentDefinition, Short> docsNotIndexed,
      final LinkedHashMap<String, Short> docsNotFound) {
    return CompletableFuture.runAsync(() -> {
      final LinkedHashMap<String, Short> missingSet = new LinkedHashMap<>();
      final LinkedHashMap<CdmDocumentDefinition, Short> importsNotIndexed = new LinkedHashMap<>();
      this.resolveDocumentImports(doc, missingSet, importsNotIndexed, docsNotFound);

      if (missingSet.size() > 0) {
        for (final Entry<String, Short> stringByteEntry : missingSet.entrySet()) {
          final String missing = stringByteEntry.getKey();

          if (!docsNotFound.containsKey(missing)) {
            final CdmDocumentDefinition newDoc = (CdmDocumentDefinition) this.loadFolderOrDocumentAsync(missing).join();
            if (newDoc != null) {
              LOGGER.info("resolved import for '{}'", newDoc.getName());
              this.resolveImportsAsync(newDoc, docsNotIndexed, docsNotFound).join();
              docsNotIndexed.put(newDoc, (short) 1);
            } else {
              LOGGER.warn("unable to resolve import for '{}'", missing);
              docsNotFound.put(missing, (short) 1);
            }
          }
        }

        // keep doing it until there is no longer anything missing
        this.resolveImportsAsync(doc, docsNotIndexed, docsNotFound).join();
      }

      if (importsNotIndexed.size() > 0) {
        for (final Entry<CdmDocumentDefinition, Short> documentByteEntry : importsNotIndexed.entrySet()) {
          final CdmDocumentDefinition imp = documentByteEntry.getKey();
          this.resolveImportsAsync(imp, docsNotIndexed, docsNotFound).join();
          docsNotIndexed.put(imp, (short) 1);
        }
      }
    });
  }

  public <T extends CdmObject> T makeObject(final CdmObjectType ofType, final String nameOrRef,
                                            final boolean simpleNameRef) {
    CdmObject newObj = null;
    switch (ofType) {
      case ArgumentDef:
        newObj = new CdmArgumentDefinition(this.ctx, nameOrRef);
        break;
      case AttributeContextDef:
        newObj = new CdmAttributeContext(this.ctx, nameOrRef);
        break;
      case AttributeContextRef:
        newObj = new CdmAttributeContextReference(this.ctx, nameOrRef);
        break;
      case AttributeGroupDef:
        newObj = new CdmAttributeGroupDefinition(this.ctx, nameOrRef);
        break;
      case AttributeGroupRef:
        newObj = new CdmAttributeGroupReference(this.ctx, nameOrRef, simpleNameRef);
        break;
      case AttributeRef:
        newObj = new CdmAttributeReference(this.ctx, nameOrRef, simpleNameRef);
        break;
      case AttributeResolutionGuidanceDef:
        newObj = new CdmAttributeResolutionGuidance(this.ctx);
        break;
      case ConstantEntityDef:
        final CdmConstantEntityDefinition constantEntity = new CdmConstantEntityDefinition(this.ctx);
        constantEntity.setConstantEntityName(nameOrRef);
        newObj = constantEntity;
        break;
      case DataPartitionDef:
        newObj = new CdmDataPartitionDefinition(this.ctx, nameOrRef);
        break;
      case DataPartitionPatternDef:
        newObj = new CdmDataPartitionPatternDefinition(this.ctx, nameOrRef);
        break;
      case DataTypeDef:
        newObj = new CdmDataTypeDefinition(this.ctx, nameOrRef, null);
        break;
      case DataTypeRef:
        newObj = new CdmDataTypeReference(this.ctx, nameOrRef, simpleNameRef);
        break;
      case DocumentDef:
        newObj = new CdmDocumentDefinition(this.ctx, nameOrRef);
        break;
      case EntityAttributeDef:
        newObj = new CdmEntityAttributeDefinition(this.ctx, nameOrRef);
        break;
      case EntityDef:
        newObj = new CdmEntityDefinition(this.ctx, nameOrRef, null);
        break;
      case EntityRef:
        newObj = new CdmEntityReference(this.ctx, nameOrRef, simpleNameRef);
        break;
      case FolderDef:
        newObj = new CdmFolderDefinition(this.ctx, nameOrRef);
        break;
      case ManifestDef:
        newObj = new CdmManifestDefinition(this.ctx, nameOrRef);
        break;
      case ManifestDeclarationDef:
        newObj = new CdmManifestDeclarationDefinition(this.ctx, nameOrRef);
        break;
      case Import:
        newObj = new CdmImport(this.ctx, nameOrRef, null);
        break;
      case LocalEntityDeclarationDef:
        newObj = new CdmLocalEntityDeclarationDefinition(this.ctx, nameOrRef);
        break;
      case ParameterDef:
        newObj = new CdmParameterDefinition(this.ctx, nameOrRef);
        break;
      case PurposeDef:
        newObj = new CdmPurposeDefinition(this.ctx, nameOrRef, null);
        break;
      case PurposeRef:
        newObj = new CdmPurposeReference(this.ctx, nameOrRef, simpleNameRef);
        break;
      case ReferencedEntityDeclarationDef:
        newObj = new CdmReferencedEntityDeclarationDefinition(this.ctx, nameOrRef);
        break;
      case TraitDef:
        newObj = new CdmTraitDefinition(this.ctx, nameOrRef, null);
        break;
      case TraitRef:
        newObj = new CdmTraitReference(this.ctx, nameOrRef, simpleNameRef, false);
        break;
      case TypeAttributeDef:
        newObj = new CdmTypeAttributeDefinition(this.ctx, nameOrRef);
        break;
      case E2ERelationshipDef:
        newObj = new CdmE2ERelationship(this.ctx, nameOrRef);
        break;
    }

    return (T) newObj;
  }

  private void registerSymbol(final String symbol, final CdmDocumentDefinition inDoc) {
    final List<CdmDocumentDefinition> docs = this.symbolDefinitions.computeIfAbsent(symbol, k -> new ArrayList<>());
    docs.add(inDoc);
  }

  void removeDocumentObjects(final CdmFolderDefinition cdmFolderDefinition, final CdmDocumentDefinition docDef) {
    final CdmDocumentDefinition doc = docDef;
    // don't worry about definitionWrtTag because it uses the doc ID that won't get re-used in this session unless there are more than 4 billion objects

    // every symbol defined in this document is pointing at the document, so remove from cache.
    // also remove the list of docs that it depends on
    this.removeObjectDefinitions(doc);

    // remove from path lookup, cdmFolderDefinition lookup and global list of documents
    final String path = this.storage.createAbsoluteCorpusPath(doc.getFolderPath() + doc.getName(), doc).toLowerCase();
    if (this.getPathLookup().containsKey(path)) {
      this.getPathLookup().remove(path);
      final int index = this.getAllDocuments().indexOf(ImmutablePair.of(cdmFolderDefinition, doc));
      this.getAllDocuments().remove(index);
    }
  }

  private void removeObjectDefinitions(final CdmDocumentDefinition doc) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    doc.visit("", new removeObjectCallBack(this, ctx, doc), null);
  }

  private void unRegisterSymbol(final String symbol, final CdmDocumentDefinition inDoc) {
    final List<CdmDocumentDefinition> docs = this.symbolDefinitions.get(symbol);
    if (docs != null) {
      final int index = docs.indexOf(inDoc);
      if (index != -1) {
        docs.remove(index);
      }
    }
  }

  private DocsResult docsForSymbol(final ResolveOptions resOpt, final CdmDocumentDefinition wrtDoc, final CdmDocumentDefinition fromDoc, final String symbol) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    final DocsResult result = new DocsResult();
    result.setNewSymbol(symbol);

    // first decision, is the symbol defined anywhere?
    final List<CdmDocumentDefinition> docList = this.symbolDefinitions.get(symbol);
    result.setDocList(docList);
    if (result.getDocList() == null || result.getDocList().size() == 0) {
      // this can happen when the symbol is disambiguated with a moniker for one of the imports used
      // in this situation, the 'wrt' needs to be ignored, the document where the reference is being made has a map of the 'one best' monikered import to search for each moniker

      int preEnd = 0;

      if (symbol != null) {
        preEnd = symbol.indexOf("/");
      }
      if (preEnd == 0) {
        // absolute reference
        LOGGER.error("no support for absolute references yet. fix '{}'", symbol);
        return null;
      }
      if (preEnd > 0) {
        final String prefix = StringUtils.slice(symbol, 0, preEnd);
        result.setNewSymbol(StringUtils.slice(symbol, preEnd + 1));
        final List<CdmDocumentDefinition> tempDocList = this.symbolDefinitions.get(result.getNewSymbol());
        result.setDocList(tempDocList);

        if (fromDoc.getImportPriorities().getMonikerPriorityMap().containsKey(prefix)) {
          final CdmDocumentDefinition tempMoniker = fromDoc.getImportPriorities().getMonikerPriorityMap()
              .get(prefix);
          // if more monikers, keep looking
          if (result.getNewSymbol().contains("/") && !this.symbolDefinitions
              .containsKey(result.getNewSymbol())) {
            return docsForSymbol(resOpt, wrtDoc, tempMoniker, result.getNewSymbol());
          }
          resOpt.setFromMoniker(prefix);
          result.setDocBest(tempMoniker);
        } else if (wrtDoc.getImportPriorities().getMonikerPriorityMap().containsKey(prefix)) {
          // if that didn't work, then see if the wrtDoc can find the moniker.

          final CdmDocumentDefinition tempMoniker = wrtDoc.getImportPriorities().getMonikerPriorityMap()
              .get(prefix);

          // if more monikers, keep looking
          if (result.getNewSymbol().contains("/")) {
            return docsForSymbol(resOpt, wrtDoc, tempMoniker, result.getNewSymbol());
          }
          resOpt.setFromMoniker(prefix);
          result.setDocBest(tempMoniker);
        } else {
          // moniker not recognized in either doc, fail with grace
          result.setNewSymbol(symbol);
          result.setDocList(null);
        }
      }
    }
    return result;
  }

  CdmObjectDefinitionBase resolveSymbolReference(
      final ResolveOptions resOpt,
      final CdmDocumentDefinition fromDoc,
      String symbolDef,
      final CdmObjectType expectedType,
      final boolean retry) {
    final ResolveContext ctx = (ResolveContext) this.ctx;

    // Given a symbolic name, find the 'highest priority' definition of the object from the point
    // of view of a given document (with respect to, wrtDoc) (meaning given a document and the
    // things it defines and the files it imports and the files they import, where is the 'last'
    // definition found).
    if ((resOpt == null || resOpt.getWrtDoc() == null)) {
      // No way to figure this out.
      return null;
    }

    CdmDocumentDefinition wrtDoc = resOpt.getWrtDoc();

    // Get the array of documents where the symbol is defined.
    final DocsResult symbolDocsResult = this.docsForSymbol(resOpt, wrtDoc, fromDoc, symbolDef);

    CdmDocumentDefinition docBest = symbolDocsResult.getDocBest();
    symbolDef = symbolDocsResult.getNewSymbol();
    final List<CdmDocumentDefinition> docs = symbolDocsResult.getDocList();
    if (null != docs) {
      // Add this symbol to the set being collected in resOpt, we will need this when caching.
      if (null == resOpt.getSymbolRefSet()) {
        resOpt.setSymbolRefSet(new SymbolSet());
      }

      resOpt.getSymbolRefSet().add(symbolDef);

      // For the given doc, there is a sorted list of imported docs (including the doc
      // itself as item 0). Find the lowest number imported document that has a definition
      // for this symbol.
      if (null == wrtDoc.getImportPriorities()) {
        return null;
      }

      final Map<CdmDocumentDefinition, Integer> importPriority =
          wrtDoc.getImportPriorities().getImportPriority();

      if (importPriority.size() == 0) {
        return null;
      }

      if (null == docBest) {
        docBest = CdmCorpusDefinition.fetchPriorityDocument(docs, importPriority);
      }
    }

    // Perhaps we have never heard of this symbol in the imports for this document?
    if (null == docBest) {
      return null;
    }

    // Return the definition found in the best document.
    CdmObjectDefinitionBase found = docBest.internalDeclarations.get(symbolDef);
    if (null == found && retry) {
      // Maybe just locatable from here not defined here.
      found = this.resolveSymbolReference(resOpt, docBest, symbolDef, expectedType, false);
    }

    if (null != found && expectedType != CdmObjectType.Error) {
      switch (expectedType) {
        case TraitRef: {
          if (found.getObjectType() != CdmObjectType.TraitDef) {
            LOGGER.error("Expected type trait: '{}'", symbolDef);
            found = null;
          }

          break;
        }

        case DataTypeRef: {
          if (found.getObjectType() != CdmObjectType.DataTypeDef) {
            LOGGER.error("Expected type dataType: '{}'", symbolDef);
            found = null;
          }

          break;
        }

        case EntityRef: {
          if (found.getObjectType() != CdmObjectType.EntityDef) {
            LOGGER.error("Expected type entity: '{}'", symbolDef);
            found = null;
          }

          break;
        }

        case ParameterDef: {
          if (found.getObjectType() != CdmObjectType.ParameterDef) {
            LOGGER.error("Expected type parameter: '{}'", symbolDef);
            found = null;
          }

          break;
        }

        case PurposeRef: {
          if (found.getObjectType() != CdmObjectType.PurposeDef) {
            LOGGER.error("Expected type purpose: '{}'", symbolDef);
            found = null;
          }

          break;
        }

        case AttributeGroupRef: {
          if (found.getObjectType() != CdmObjectType.AttributeGroupDef) {
            LOGGER.error("Expected type attributeGroup: '{}'", symbolDef);
            found = null;
          }

          break;
        }

        default: {
          break;
        }
      }
    }

    return found;
  }

  private void unRegisterDefinitionReferenceSymbols(final CdmObject definition, final String kind) {
    final String key = CdmCorpusDefinition.createCacheKeyFromObject(definition, kind);
    this.definitionReferenceSymbols.remove(key);
  }

  void registerDefinitionReferenceSymbols(final CdmObject definition, final String kind,
                                          final SymbolSet symbolRefSet) {
    final String key = CdmCorpusDefinition.createCacheKeyFromObject(definition, kind);
    final SymbolSet existingSymbols = this.definitionReferenceSymbols.get(key);
    if (existingSymbols == null) {
      // nothing set, just use it
      this.definitionReferenceSymbols.put(key, symbolRefSet);
    } else {
      // something there, need to merge
      existingSymbols.merge(symbolRefSet);
    }
  }

  public LinkedHashMap<String, Short> listMissingImports() {
    final LinkedHashMap<String, Short> missingSet = new LinkedHashMap<>();
    final LinkedHashMap<String, Short> docsNotFound = new LinkedHashMap<>();
    final LinkedHashMap<CdmDocumentDefinition, Short> importsNotIndexed = new LinkedHashMap<>();
    for (int i = 0; i < this.getAllDocuments().size(); i++) {
      final Pair<CdmFolderDefinition, CdmDocumentDefinition> fs = this.getAllDocuments().get(i);
      this.resolveDocumentImports(fs.getRight(), missingSet, importsNotIndexed, docsNotFound);
    }

    if (missingSet.size() == 0) {
      return null;
    }
    return missingSet;
  }

  private void resolveDocumentImports(final CdmDocumentDefinition doc, final LinkedHashMap<String, Short> missingSet,
                                      final LinkedHashMap<CdmDocumentDefinition, Short> importsNotIndexed,
                                      final LinkedHashMap<String, Short> docsNotFound) {
    if (doc.getImports() != null) {
      for (final CdmImport imp : doc.getImports()) {
        if (imp.getDoc() == null) {
          // no document set for this import, see if it is already loaded into the corpus
          final String path = this.storage.createAbsoluteCorpusPath(imp.getCorpusPath(), doc);
          if (!docsNotFound.containsKey(path)) {
            if (this.pathLookup.containsKey(path.toLowerCase())) {
              final Pair<CdmFolderDefinition, CdmDocumentDefinition> lookup = this.pathLookup.get(path.toLowerCase());

              if (!lookup.getRight().isImportsIndexed() && !lookup.getRight()
                  .isCurrentlyIndexing()) {
                lookup.getValue().setCurrentlyIndexing(true);
                importsNotIndexed.put(lookup.getRight(), (short) 1);
              }
              imp.setDoc(lookup.getRight());
            } else if (missingSet != null) {
              missingSet.put(path, (short) 1);
            }
          }
        }
      }
    }
  }

  boolean visit(final String path, final VisitCallback preChildren, final VisitCallback postChildren) {
    return false;
  }

  private CompletableFuture<CdmContainerDefinition> loadFolderOrDocumentAsync(final String objectPath) {
    return loadFolderOrDocumentAsync(objectPath, false);
  }

  boolean indexDocuments(
      final ResolveOptions resOpt,
      final CdmDocumentDefinition currentDoc,
      final LinkedHashMap<CdmDocumentDefinition, Short> docsJustAdded) {
    if (docsJustAdded.size() > 0) {
      // Index any imports.
      for (final Map.Entry<CdmDocumentDefinition, Short> iCdmDocumentDefByteEntry
          : docsJustAdded.entrySet()) {
        final CdmDocumentDefinition doc = iCdmDocumentDefByteEntry.getKey();
        if (doc.getNeedsIndexing()) {
          doc.clearCaches();
          doc.getImportPriorities();
        }
      }

      // Check basic integrity.
      for (final Map.Entry<CdmDocumentDefinition, Short> iCdmDocumentDefByteEntry
          : docsJustAdded.entrySet()) {
        final CdmDocumentDefinition doc = iCdmDocumentDefByteEntry.getKey();
        if (doc.getNeedsIndexing()) {
          if (!this.checkObjectIntegrity(doc)) {
            return false;
          }
        }
      }

      // Declare definitions in objects in this doc.
      for (final Map.Entry<CdmDocumentDefinition, Short> iCdmDocumentDefByteEntry
          : docsJustAdded.entrySet()) {
        final CdmDocumentDefinition doc = iCdmDocumentDefByteEntry.getKey();
        if (doc.getNeedsIndexing()) {
          this.declareObjectDefinitions(doc, "");
        }
      }

      // Make sure we can find everything that is named by reference.
      for (final Map.Entry<CdmDocumentDefinition, Short> iCdmDocumentDefByteEntry
          : docsJustAdded.entrySet()) {
        final CdmDocumentDefinition doc = iCdmDocumentDefByteEntry.getKey();
        if (doc.getNeedsIndexing()) {
          final ResolveOptions resOptLocal = CdmObjectBase.copyResolveOptions(resOpt);
          resOptLocal.setWrtDoc(doc);
          this.resolveObjectDefinitions(doc, resOptLocal);
        }
      }

      // Now resolve any trait arguments that are type object.
      for (final Map.Entry<CdmDocumentDefinition, Short> iCdmDocumentDefByteEntry
          : docsJustAdded.entrySet()) {
        final CdmDocumentDefinition doc = iCdmDocumentDefByteEntry.getKey();
        if (doc.getNeedsIndexing()) {
          final ResolveOptions resOptLocal = CdmObjectBase.copyResolveOptions(resOpt);
          resOptLocal.setWrtDoc(doc);
          this.resolveTraitArguments(resOptLocal, doc);
        }
      }

      // Finish up.
      for (final Map.Entry<CdmDocumentDefinition, Short> iCdmDocumentDefByteEntry
          : docsJustAdded.entrySet()) {
        final CdmDocumentDefinition doc = iCdmDocumentDefByteEntry.getKey();
        if (doc.getNeedsIndexing()) {
          this.finishDocumentResolve(doc);
        }
      }
    }

    return true;
  }

  private CompletableFuture<CdmContainerDefinition> loadFolderOrDocumentAsync(String objectPath,
                                                                              final boolean forceReload) {
    if (!StringUtils.isNullOrTrimEmpty(objectPath)) {
      // first check for namespace
      final Map.Entry<String, String> pathTuple = this.storage.splitNamespacePath(objectPath);
      final String nameSpace = !StringUtils.isNullOrTrimEmpty(pathTuple.getKey()) ? pathTuple.getKey()
          : this.getStorage().getDefaultNamespace();
      objectPath = pathTuple.getValue();

      if (objectPath.startsWith("/")) {
        final CdmFolderDefinition namespaceFolder = this.storage.fetchRootFolder(nameSpace);
        final StorageAdapter namespaceAdapter = this.storage.fetchAdapter(nameSpace);

        if (namespaceFolder == null || namespaceAdapter == null) {
          LOGGER.error("The namespace '{}' has not been registered, objectPath '{}'", nameSpace, objectPath);

          return CompletableFuture.completedFuture(null);
        }

        final CdmFolderDefinition lastFolder = namespaceFolder
            .fetchChildFolderFromPathAsync(objectPath, false).join();

        // don't create new folders, just go as far as possible
        if (lastFolder != null) {
          // maybe the search is for a folder?
          final String lastPath = lastFolder.getFolderPath();
          if (lastPath.equals(objectPath)) {
            return CompletableFuture.completedFuture(lastFolder);
          }

          // remove path to folder and then look in the folder
          final String newObjectPath = StringUtils.slice(objectPath, lastPath.length());

          return CompletableFuture.completedFuture(
              lastFolder.fetchDocumentFromFolderPathAsync(newObjectPath, namespaceAdapter, forceReload)
                  .join());
        }
      }
    }

    return CompletableFuture.completedFuture(null);
  }

  /**
   * Fetches an object by the path from the corpus.
   *
   * @param <T>        Type of the object to be fetched.
   * @param objectPath Object path, absolute or relative.
   * @return The object obtained from the provided path.
   * @see #fetchObjectAsync(String, CdmObject)
   */
  public <T extends CdmObject> CompletableFuture<T> fetchObjectAsync(final String objectPath) {
    return fetchObjectAsync(objectPath, null).thenApply(cdmObject -> (T) cdmObject);
  }

  /**
   * Fetches an object by the path from the corpus, with the CDM object specified.
   *
   * @param <T>        Type of the object to be fetched.
   * @param objectPath Object path, absolute or relative.
   * @param cdmObject  Optional parameter. When provided, it is used to obtain the FolderPath and
   *                   the Namespace needed to create the absolute path from a relative path.
   * @return The object obtained from the provided path.
   */
  public <T extends CdmObject> CompletableFuture<T> fetchObjectAsync(
      final String objectPath,
      final CdmObject cdmObject) {
    return
        fetchObjectAsync(objectPath, cdmObject, false)
            .thenApply(fetchedCdmObject -> (T) fetchedCdmObject);
  }

  CompletableFuture<CdmObject> fetchObjectAsync(
      final String objectPath,
      final CdmObject cdmObject,
      final boolean forceReload) {
    // isRootManifestPath is required to deal with the load of the initial root manifest.
    // In this case the the file name can be something different than a CDM CdmManifestDefinition,
    // e.g.: "model.json".

    final String absolutePath = this.storage.createAbsoluteCorpusPath(objectPath, cdmObject);

    String documentPath = absolutePath;
    int documentNameIndex = absolutePath.lastIndexOf(cdmExtension);

    if (documentNameIndex != -1) {
      // entity path has to have at least one slash with the entity name at the end
      documentNameIndex += cdmExtension.length();
      documentPath = absolutePath.substring(0, documentNameIndex);
    }

    final String finalDocumentPath = documentPath;
    final int finalDocumentNameIndex = documentNameIndex;
    return this.loadFolderOrDocumentAsync(finalDocumentPath, forceReload).thenCompose(loadedCdmObject -> {
      if (loadedCdmObject != null) {
        // get imports and index each document that is loaded
        if (loadedCdmObject instanceof CdmDocumentDefinition) {
          final ResolveOptions resOpt = new ResolveOptions();
          resOpt.setWrtDoc((CdmDocumentDefinition) loadedCdmObject);
          resOpt.setDirectives(new AttributeResolutionDirectiveSet());

          if (!((CdmDocumentDefinition) loadedCdmObject).indexIfNeededAsync(resOpt).join()) {
            return null;
          }
        }

        if (Objects.equals(finalDocumentPath, absolutePath)) {
          return CompletableFuture.completedFuture(loadedCdmObject);
        }

        if (finalDocumentNameIndex == -1) {
          return CompletableFuture.completedFuture(null);
        }

        // trim off the document path to get the object path in the doc
        final String remainingObjectPath = absolutePath.substring(finalDocumentNameIndex + 1);

        final CdmObject result = ((CdmDocumentDefinition) loadedCdmObject).fetchObjectFromDocumentPath(remainingObjectPath);
        if (null == result) {
          LOGGER.error("Could not find symbol '{}' in document[{}]", remainingObjectPath, loadedCdmObject.getAtCorpusPath());
        }

        return CompletableFuture.completedFuture(result);
      }

      return CompletableFuture.completedFuture(null);
    });
  }

  private CompletableFuture<Void> visitManifestTreeAsync(
      final CdmManifestDefinition manifest,
      final List<CdmEntityDefinition> entitiesInManifestTree) {
    return CompletableFuture.runAsync(() -> {
      final CdmEntityCollection entities = manifest.getEntities();
      if (entities != null) {
        for (final CdmEntityDeclarationDefinition entity : entities) {
          CdmObject currentFile = manifest;
          CdmEntityDeclarationDefinition currentEnt = entity;
          while ((currentEnt instanceof CdmReferencedEntityDeclarationDefinition)) {
            currentEnt = this.<CdmReferencedEntityDeclarationDefinition>fetchObjectAsync(
                currentEnt.getEntityPath(), currentFile).join();
            currentFile = currentEnt;
          }

          final CdmEntityDefinition entityDef = this.<CdmEntityDefinition>fetchObjectAsync(
              currentEnt.getEntityPath(), currentFile).join();
          entitiesInManifestTree.add(entityDef);
        }
      }

      final CdmCollection<CdmManifestDeclarationDefinition> subManifests = manifest.getSubManifests();
      if (subManifests == null) {
        return;
      }

      subManifests.forEach(subFolder -> {
        final CdmManifestDefinition childManifest =
            this.<CdmManifestDefinition>fetchObjectAsync(subFolder.getDefinition(), manifest).join();
        this.visitManifestTreeAsync(childManifest, entitiesInManifestTree).join();
      });
    });
  }


  public CompletableFuture<Void> generateWarningsForSingleDoc(
      final Pair<CdmFolderDefinition, CdmDocumentDefinition> fd,
      final ResolveOptions resOpt) {
    final CdmDocumentDefinition doc = fd.getRight();

    if (doc.getDefinitions() == null) {
      return CompletableFuture.completedFuture(null);
    }

    resOpt.setWrtDoc(doc);

    return CompletableFuture.runAsync(() ->
        doc.getDefinitions().getAllItems()
            .parallelStream()
            .map(element -> {
              if (element instanceof CdmEntityDefinition) {
                final CdmEntityDefinition entity = ((CdmEntityDefinition) element);
                if (entity.getAttributes().getCount() > 0) {
                  final CdmEntityDefinition resolvedEntity = entity.createResolvedEntityAsync(
                      entity.getName() + "_", resOpt)
                      .join();

                  // TODO: Add additional checks here.
                  this.checkPrimaryKeyAttributes(resolvedEntity, resOpt);
                }
                return entity;
              }
              return null;
            }));
  }

  /**
   * Returns a list of relationships where the input entity is the incoming entity.
   *
   * @param entity The input entity.
   */
  public ArrayList<CdmE2ERelationship> fetchIncomingRelationships(final CdmEntityDefinition entity) {
    if (this.incomingRelationships != null && this.incomingRelationships.containsKey(entity)) {
      return this.incomingRelationships.get(entity);
    }
    return new ArrayList<>();
  }

  /**
   * Returns a list of relationships where the input entity is the outgoing entity.
   *
   * @param entity The input entity.
   */
  public ArrayList<CdmE2ERelationship> fetchOutgoingRelationships(final CdmEntityDefinition entity) {
    if (this.outgoingRelationships != null && this.outgoingRelationships.containsKey(entity)) {
      return this.outgoingRelationships.get(entity);
    }
    return new ArrayList<>();
  }

  /**
   * Calculates the entity to entity relationships for all the entities present in the manifest and
   * its sub-manifests.
   *
   * @param currManifest The manifest (and any sub-manifests it contains) that we want to calculate
   *                     relationships for.
   * @return A {@link CompletableFuture<Void>} for the completion of entity graph calculation.
   */
  public CompletableFuture<Void> calculateEntityGraphAsync(final CdmManifestDefinition currManifest) {
    return calculateEntityGraphAsync(currManifest, null);
  }

  /**
   * Calculates the entity to entity relationships for all the entities present in the manifest and
   * its sub-manifests.
   *
   * @param currManifest The manifest (and any sub-manifests it contains) that we want to calculate
   *                     relationships for.
   * @return A {@link CompletableFuture<Void>} for the completion of entity graph calculation.
   */
  CompletableFuture<Void> calculateEntityGraphAsync(
      final CdmManifestDefinition currManifest,
      final Map<String, String> resEntMap) {
    return CompletableFuture.runAsync(() -> {
      if (currManifest.getEntities() != null) {
        for (final CdmEntityDeclarationDefinition entityDec : currManifest.getEntities()) {
          final String entityPath =
              currManifest.createEntityPathFromDeclarationAsync(entityDec, currManifest).join();
          // The path returned by GetEntityPathFromDeclaration is an absolute path.
          // No need to pass the manifest to FetchObjectAsync.
          final CdmEntityDefinition entity =
              this.<CdmEntityDefinition>fetchObjectAsync(entityPath).join();

          if (entity == null) {
            continue;
          }
          final CdmEntityDefinition resEntity;
          final ResolveOptions resOpt = new ResolveOptions(entity);
          final boolean isResolvedEntity = entity.getAttributeContext() != null;

          // only create a resolved entity if the entity passed in was not a resolved entity
          if (!isResolvedEntity) {
            // first get the resolved entity so that all of the references are present
            resEntity = entity.createResolvedEntityAsync("wrtSelf_" + entity.getEntityName(), resOpt).join();
          } else {
            resEntity = entity;
          }

          if (!this.symbol2EntityDefList.containsKey(entity.getEntityName())) {
            this.symbol2EntityDefList.put(
                entity.getEntityName(),
                new ArrayList<>());
          }

          this.symbol2EntityDefList.get(entity.getEntityName()).add(entity);

          // find outgoing entity relationships using attribute context
          final ArrayList<CdmE2ERelationship> outgoingRelationships =
              this.findOutgoingRelationships(resOpt, resEntity, resEntity.getAttributeContext());

          // if the entity is a resolved entity, change the relationships to point to the resolved versions
          if (isResolvedEntity && resEntMap != null) {
            for (final CdmE2ERelationship rel : outgoingRelationships) {
              if (resEntMap.containsKey(rel.getToEntity())) {
                rel.setToEntity(resEntMap.get(rel.getToEntity()));
              }
            }
          }

          this.outgoingRelationships.put(entity, outgoingRelationships);

          // flip outgoing entity relationships list to get incoming relationships map
          if (outgoingRelationships != null) {
            for (final CdmE2ERelationship outgoingRelationship : outgoingRelationships) {
              final CdmEntityDefinition targetEnt =
                  this.<CdmEntityDefinition>fetchObjectAsync(
                      outgoingRelationship.getToEntity(),
                      currManifest
                  ).join();
              if (targetEnt != null) {
                if (!this.incomingRelationships.containsKey(targetEnt)) {
                  this.incomingRelationships.put(
                      targetEnt,
                      new ArrayList<>()
                  );
                }

                this.incomingRelationships.get(targetEnt).add(outgoingRelationship);
              }
            }
          }

          // delete the resolved entity if we created one here
          if (!isResolvedEntity) {
            resEntity.getInDocument()
                .getFolder()
                .getDocuments()
                .remove(resEntity.getInDocument().getName());
          }
        }
      }

      if (currManifest.getSubManifests() != null) {
        for (final CdmManifestDeclarationDefinition subManifestDef : currManifest.getSubManifests()) {
          final CdmManifestDefinition subManifest =
              this.<CdmManifestDefinition>fetchObjectAsync(
                  subManifestDef.getDefinition(),
                  currManifest)
                  .join();
          if (subManifest != null) {
            this.calculateEntityGraphAsync(subManifest).join();
          }
        }
      }
    });
  }

  private ArrayList<CdmE2ERelationship> findOutgoingRelationships(
      final ResolveOptions resOpt,
      final CdmEntityDefinition resEntity,
      final CdmAttributeContext attCtx) {
    return findOutgoingRelationships(resOpt, resEntity, attCtx, null);
  }

  private ArrayList<CdmE2ERelationship> findOutgoingRelationships(
      final ResolveOptions resOpt,
      final CdmEntityDefinition resEntity,
      final CdmAttributeContext attCtx,
      CdmAttributeContext outerAttGroup) {
    final ArrayList<CdmE2ERelationship> outRels = new ArrayList<>();

    if (attCtx != null && attCtx.getContents() != null) {
      for (final Object subAttCtx : attCtx.getContents()) {
        // find entity references that identifies the 'this' entity
        final CdmAttributeContext child = subAttCtx instanceof CdmAttributeContext
            ? (CdmAttributeContext) subAttCtx
            : null;
        if (child != null
            && child.getDefinition() != null
            && child.getDefinition().getObjectType() == CdmObjectType.EntityRef) {
          final List<String> toAtt = (child.getExhibitsTraits().getAllItems())
              .parallelStream()
              .filter(x -> "is.identifiedBy".equals(x.fetchObjectDefinitionName())
                  && x.getArguments().getCount() > 0)
              .map(y -> {
                String namedRef =
                    ((CdmAttributeReference) y
                        .getArguments()
                        .getAllItems()
                        .get(0)
                        .getValue())
                        .getNamedReference();
                return namedRef.substring(namedRef.lastIndexOf("/") + 1);
              }).collect(Collectors.toList());

          final CdmEntityDefinition toEntity = child.getDefinition().fetchObjectDefinition(resOpt);

          // entity references should have the "is.identifiedBy" trait, and the entity ref should be valid
          if (toAtt.size() == 1 && toEntity != null) {
            // get the attribute name from the foreign key
            final String foreignKey = findAddedAttributeIdentity(outerAttGroup != null ? outerAttGroup : attCtx);

            if (!foreignKey.isEmpty()) {
              final String fromAtt = foreignKey
                  .substring(foreignKey.lastIndexOf("/") + 1)
                  .replace(child.getName() + "_", "");

              final CdmE2ERelationship newE2ERel = new CdmE2ERelationship(this.ctx, "");
              newE2ERel.setFromEntity(
                  this.storage.createAbsoluteCorpusPath(
                      resEntity
                          .getAtCorpusPath()
                          .replace("wrtSelf_", ""),
                      resEntity));
              newE2ERel.setFromEntityAttribute(fromAtt);
              newE2ERel.setToEntity(this.storage.createAbsoluteCorpusPath(
                  toEntity
                      .getAtCorpusPath()
                      .replace("wrtSelf_", ""),
                  toEntity));
              newE2ERel.setToEntityAttribute(toAtt.get(0));
              outRels.add(newE2ERel);
            }
          }
        } else if (child != null
            && child.getDefinition() != null
            && child.getDefinition().getObjectType() == CdmObjectType.AttributeGroupRef) {
          // if this is an attribute group, we need to search for foreign keys from this level
          outerAttGroup = child;
        }
        // repeat the process on the child node
        final ArrayList<CdmE2ERelationship>
            subOutRels = this.findOutgoingRelationships(resOpt, resEntity, child, outerAttGroup);
        outerAttGroup = null;
        outRels.addAll(subOutRels);
      }
    }
    return outRels;
  }

  private String findAddedAttributeIdentity(final CdmAttributeContext context) {
    if (context != null && context.getContents() != null) {
      for (final Object sub : context.getContents()) {
        if (sub instanceof CdmAttributeContext) {
          final CdmAttributeContext subCtx = (CdmAttributeContext) sub;
          if (subCtx.getType() == CdmAttributeContextType.Entity) {
            continue;
          }
          final String fk = findAddedAttributeIdentity(subCtx);
          if (!fk.isEmpty()) {
            return fk;
          } else if (subCtx.getType() == CdmAttributeContextType.AddedAttributeIdentity && subCtx.getContents().size() > 0) {
            // the foreign key is found in the first of the array of the "AddedAttributeIdentity" context type
            return ((CdmObjectReference)subCtx.getContents().get(0)).getNamedReference();
          }
        }
      }
    }
    return "";
  }

  /**
   * Resolves references according to the provided stages and validates.
   *
   * @return The validation step that follows the completed step.
   */
  public CompletableFuture<CdmValidationStep> resolveReferencesAndValidateAsync(
      final CdmValidationStep stage,
      final CdmValidationStep stageThrough) {
    return resolveReferencesAndValidateAsync(
        stage,
        stageThrough,
        null);
  }

  /**
   * Resolves references according to the provided stages and validates.
   *
   * @return The validation step that follows the completed step.
   */
  private CompletableFuture<CdmValidationStep> resolveReferencesAndValidateAsync(
      final CdmValidationStep stage,
      final CdmValidationStep stageThrough,
      final ResolveOptions resOpt) {
    return CompletableFuture.supplyAsync(() -> {
      // Use the provided directives or make a relational default.
      final AttributeResolutionDirectiveSet directives;
      if (null != resOpt) {
        directives = resOpt.getDirectives();
      } else {
        final Set<String> set = new LinkedHashSet<>();
        set.add("referenceOnly");
        set.add("normalized");

        directives = new AttributeResolutionDirectiveSet(set);
      }

      final ResolveOptions finalResolveOptions = new ResolveOptions();
      finalResolveOptions.setWrtDoc(null);
      finalResolveOptions.setDirectives(directives);
      finalResolveOptions.setRelationshipDepth(0);

      for (final Pair doc : this.allDocuments) {
        final Object documentImpl = doc.getRight();
        ((CdmDocumentDefinition) documentImpl).indexIfNeededAsync(resOpt).join();
      }

      final boolean finishResolve = stageThrough == stage;
      switch (stage) {
        case Start:
        case TraitAppliers: {
          return this.resolveReferencesStep(
              "Defining traits...",
              (CdmDocumentDefinition currentDoc, ResolveOptions resOptions, MutableInt entityNesting) -> {},
              finalResolveOptions,
              true,
              finishResolve || stageThrough == CdmValidationStep.MinimumForResolving,
              CdmValidationStep.Traits);
        }

        case Traits: {
          this.resolveReferencesStep(
              "Resolving traits...",
              this::resolveTraits,
              finalResolveOptions,
              false,
              finishResolve,
              CdmValidationStep.Traits);

          return this.resolveReferencesStep(
              "Checking required arguments...",
              this::resolveReferencesTraitsArguments,
              finalResolveOptions,
              true,
              finishResolve,
              CdmValidationStep.Attributes);
        }

        case Attributes: {
          return this.resolveReferencesStep(
              "Resolving attributes...",
              this::resolveAttributes,
              finalResolveOptions,
              true,
              finishResolve,
              CdmValidationStep.EntityReferences);
        }

        case EntityReferences:
          return this.resolveReferencesStep(
              "Resolving foreign key references...",
              this::resolveForeignKeyReferences,
              finalResolveOptions,
              true,
              true,
              CdmValidationStep.Finished);

        default: {
          break;
        }
      }

      // I'm the bad step.
      return CdmValidationStep.Error;
    });
  }

  Object constTypeCheck(
      final ResolveOptions resOpt,
      final CdmDocumentDefinition currentDoc,
      final CdmParameterDefinition paramDef,
      final Object aValue) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    Object replacement = aValue;

    // If parameter type is entity, then the value should be an entity or ref to one
    // same is true of 'dataType' data type.
    if (null != paramDef.getDataTypeRef()) {
      CdmDataTypeDefinition dt = paramDef.getDataTypeRef().fetchObjectDefinition(resOpt);
      if (null == dt) {
        dt = paramDef.getDataTypeRef().fetchObjectDefinition(resOpt);
      }

      // Compare with passed in value or default for parameter.
      Object pValue = aValue;
      if (null == pValue) {
        pValue = paramDef.getDefaultValue();
        replacement = pValue;
      }

      if (null != pValue) {
        if (dt.isDerivedFrom("cdmObject", resOpt)) {
          final List<CdmObjectType> expectedTypes = new ArrayList<>();
          String expected = null;
          if (dt.isDerivedFrom("entity", resOpt)) {
            expectedTypes.add(CdmObjectType.ConstantEntityDef);
            expectedTypes.add(CdmObjectType.EntityRef);
            expectedTypes.add(CdmObjectType.EntityDef);
            expected = "entity";
          } else if (dt.isDerivedFrom("attribute", resOpt)) {
            expectedTypes.add(CdmObjectType.AttributeRef);
            expectedTypes.add(CdmObjectType.TypeAttributeDef);
            expectedTypes.add(CdmObjectType.EntityAttributeDef);
            expected = "attribute";
          } else if (dt.isDerivedFrom("dataType", resOpt)) {
            expectedTypes.add(CdmObjectType.DataTypeRef);
            expectedTypes.add(CdmObjectType.DataTypeDef);
            expected = "dataType";
          } else if (dt.isDerivedFrom("purpose", resOpt)) {
            expectedTypes.add(CdmObjectType.PurposeRef);
            expectedTypes.add(CdmObjectType.PurposeDef);
            expected = "purpose";
          } else if (dt.isDerivedFrom("trait", resOpt)) {
            expectedTypes.add(CdmObjectType.TraitRef);
            expectedTypes.add(CdmObjectType.TraitDef);
            expected = "trait";
          } else if (dt.isDerivedFrom("attributeGroup", resOpt)) {
            expectedTypes.add(CdmObjectType.AttributeGroupRef);
            expectedTypes.add(CdmObjectType.AttributeGroupDef);
            expected = "attributeGroup";
          }

          if (expectedTypes.size() == 0) {
            LOGGER.error("CdmParameterDefinition '{}' has an unexpected data type.", paramDef.getName());
          }

          // If a string constant, resolve to an object ref.
          CdmObjectType foundType = CdmObjectType.Error;
          final Class pValueType = pValue.getClass();

          if (CdmObject.class.isAssignableFrom(pValueType)) {
            foundType = ((CdmObject) pValue).getObjectType();
          }

          String foundDesc = ctx.getRelativePath();

          String pValueAsString = "";
          if (!(pValue instanceof CdmObject)) {
            pValueAsString = (String) pValue;
          }

          if (!pValueAsString.isEmpty()) {
            if (pValueAsString.equalsIgnoreCase("this.attribute")
                && expected.equalsIgnoreCase("attribute")) {
              // Will get sorted out later when resolving traits.
              foundType = CdmObjectType.AttributeRef;
            } else {
              foundDesc = pValueAsString;
              final int seekResAtt = CdmObjectReferenceBase.offsetAttributePromise(pValueAsString);
              if (seekResAtt >= 0) {
                // Get an object there that will get resolved later after resolved attributes.
                replacement = new CdmAttributeReference(ctx, pValueAsString, true);
                ((CdmAttributeReference) replacement).setCtx(ctx);
                ((CdmAttributeReference) replacement).setInDocument(currentDoc);
                foundType = CdmObjectType.AttributeRef;
              } else {
                final CdmObjectDefinitionBase lu = ctx.getCorpus()
                    .resolveSymbolReference(
                        resOpt,
                        currentDoc,
                        pValueAsString,
                        CdmObjectType.Error,
                        true);
                if (null != lu) {
                  if (expected.equalsIgnoreCase("attribute")) {
                    replacement = new CdmAttributeReference(ctx, pValueAsString, true);
                    ((CdmAttributeReference) replacement).setCtx(ctx);
                    ((CdmAttributeReference) replacement).setInDocument(currentDoc);
                    foundType = CdmObjectType.AttributeRef;
                  } else {
                    replacement = lu;
                    foundType = ((CdmObject) replacement).getObjectType();
                  }
                }
              }
            }
          }

          if (expectedTypes.indexOf(foundType) == -1) {
            LOGGER.error("CdmParameterDefinition '{}' has the dataType of '{}' but the value '{}' doesn't resolve to a known '{}' reference", paramDef.getName(), expected, foundDesc, expected);
          } else {
            LOGGER.info("Resolved '{}'", foundDesc);
          }
        }
      }
    }

    return replacement;
  }

  private CdmValidationStep resolveReferencesStep(
      final String statusMessage,
      final ResolveAction resolveAction,
      final ResolveOptions resolveOpt,
      final boolean stageFinished,
      final boolean finishResolve,
      final CdmValidationStep nextStage) {
    final ResolveContext ctx = (ResolveContext) this.ctx;

    LOGGER.debug(statusMessage);

    final MutableInt entityNesting = new MutableInt(0);
    for (final Pair<CdmFolderDefinition, CdmDocumentDefinition> doc : this.allDocuments) {
      // Cache import documents.
      CdmDocumentDefinition currentDoc = doc.getRight();
      resolveOpt.setWrtDoc(currentDoc);
      resolveAction.invoke(currentDoc, resolveOpt, entityNesting);
    }

    if (stageFinished) {
      if (finishResolve) {
        this.finishResolve();
        return CdmValidationStep.Finished;
      }

      return nextStage;
    }

    return nextStage;
  }

  private boolean checkObjectIntegrity(final CdmDocumentDefinition currentDoc) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    final AtomicInteger errorCount = new AtomicInteger();
    final VisitCallback preChildren = (iObject, path) -> {
      if (!iObject.validate()) {
        LOGGER.error(
            "Integrity check failed for folderPath: '{}', path: '{}'",
            currentDoc.getFolderPath(),
            path);
        errorCount.getAndIncrement();
      } else {
        iObject.setCtx(ctx);
      }

      LOGGER.info("Checked, folderPath: '{}', path: '{}'", currentDoc.getFolderPath(), path);

      return false;
    };

    currentDoc.visit("", preChildren, null);
    return Objects.equals(errorCount.get(), 0);
  }

  private void declareObjectDefinitions(
      final CdmDocumentDefinition currentDoc,
      final String relativePath) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    final String corpusPathRoot = currentDoc.getFolderPath() + currentDoc.getName();
    currentDoc.visit(relativePath, (iObject, path) -> {
      if (path.indexOf("(unspecified)") > 0) {
        return true;
      }

      switch (iObject.getObjectType()) {
        case EntityDef:
        case ParameterDef:
        case TraitDef:
        case PurposeDef:
        case AttributeContextDef:
        case DataTypeDef:
        case TypeAttributeDef:
        case EntityAttributeDef:
        case AttributeGroupDef:
        case ConstantEntityDef:
        case LocalEntityDeclarationDef:
        case ReferencedEntityDeclarationDef: {
          ctx.setRelativePath(relativePath);
          final String corpusPath;
          if (corpusPathRoot.endsWith("/") || path.startsWith("/")) {
            corpusPath = corpusPathRoot + path;
          } else {
            corpusPath = corpusPathRoot + "/" + path;
          }
          if (currentDoc.internalDeclarations.containsKey(path)) {
            LOGGER.error("Duplicate declaration for item: '{}'", corpusPath);

            return false;
          }

          currentDoc.internalDeclarations.putIfAbsent(path, (CdmObjectDefinitionBase) iObject);

          this.registerSymbol(path, currentDoc);
          LOGGER.info("Declared: '{}'", corpusPath);
          break;
        }

        default: {
          LOGGER.debug("ObjectType not recognized: '{}'", iObject.getObjectType().name());
          break;
        }
      }

      return false;
    }, null);
  }

  private void resolveObjectDefinitions(
      final CdmDocumentDefinition currentDoc,
      final ResolveOptions resOpt) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    resOpt.setIndexingDoc(currentDoc);

    currentDoc.visit("", (iObject, path) -> {
      final CdmObjectType objectType = iObject.getObjectType();
      switch (objectType) {
        case AttributeRef:
        case AttributeGroupRef:
        case AttributeContextRef:
        case DataTypeRef:
        case EntityRef:
        case PurposeRef:
        case TraitRef: {
          ctx.setRelativePath(path);
          final CdmObjectReferenceBase objectRef = (CdmObjectReferenceBase) iObject;

          if (CdmObjectReferenceBase.offsetAttributePromise(objectRef.getNamedReference()) < 0) {
            final CdmObjectDefinition resNew = objectRef.fetchObjectDefinition(resOpt);

            if (null == resNew) {
              // It is 'ok' to not find entity refs sometimes.
              if (objectType == CdmObjectType.EntityRef) {
                LOGGER.warn("Unable to resolve the reference: '{}' to a known object, folderPath: '{}', path: '{}'", objectRef.getNamedReference(), currentDoc.getFolderPath(), path);
              } else {
                LOGGER.error("Unable to resolve the reference: '{}' to a known object, folderPath: '{}', path: '{}'", objectRef.getNamedReference(), currentDoc.getFolderPath(), path);
              }

              final CdmObjectDefinition debugRes = objectRef.fetchObjectDefinition(resOpt);
            } else {
              LOGGER.info("Resolved folderPath: '{}', path: '{}'", currentDoc.getFolderPath() , path);
            }
          }

          break;
        }

        default: {
          LOGGER.debug("ObjectType not recognized: '{}'", iObject.getObjectType().name());
          break;
        }
      }

      return false;
    }, (iObject, path) -> {
      final CdmObjectType objectType = iObject.getObjectType();
      switch (objectType) {
        case ParameterDef: {
          // When a parameter has a data type that is a cdm object, validate that any default value
          // is the right kind object.
          final CdmParameterDefinition parameterDef = (CdmParameterDefinition) iObject;
          this.constTypeCheck(resOpt, currentDoc, parameterDef, null);
          break;
        }

        default: {
          LOGGER.debug("ObjectType not recognized: '{}'", iObject.getObjectType().name());
          break;
        }
      }

      return false;
    });

    resOpt.setIndexingDoc(null);
  }

  private void finishDocumentResolve(final CdmDocumentDefinition doc) {
    doc.setCurrentlyIndexing(false);
    doc.setImportsIndexed(true);
    doc.setNeedsIndexing(false);

    doc.getDefinitions().getAllItems().forEach(def -> {
      if (def.getObjectType() == CdmObjectType.EntityDef) {
        LOGGER.info("indexed: '{}'", def.getAtCorpusPath());
      }
    });
  }

  private void resolveTraits(
      final CdmDocumentDefinition currentDoc,
      final ResolveOptions resOpt,
      final MutableInt entityNesting) {
    final MutableInt nesting = entityNesting;
    currentDoc.visit("", (iObject, path) -> {
      switch (iObject.getObjectType()) {
        case TraitDef:
        case PurposeDef:
        case DataTypeDef:
        case EntityDef:
        case AttributeGroupDef: {
          if (iObject.getObjectType() == CdmObjectType.EntityDef
              || iObject.getObjectType() == CdmObjectType.AttributeGroupDef) {
            nesting.increment();
            // Don't do this for entities and groups defined within entities since getting
            // traits already does that.
            if (nesting.getValue() > 1) {
              break;
            }
          }

          ((ResolveContext) this.ctx).setRelativePath(path);
          iObject.fetchResolvedTraits(resOpt);

          break;
        }
        case EntityAttributeDef:
        case TypeAttributeDef: {
          ((ResolveContext) this.ctx).setRelativePath(path);
          iObject.fetchResolvedTraits(resOpt);

          break;
        }
      }

      return false;
    }, (iObject, path) -> {
      if (iObject.getObjectType() == CdmObjectType.EntityDef
          || iObject.getObjectType() == CdmObjectType.AttributeGroupDef) {
        nesting.decrement();
      }

      return false;
    });

    entityNesting.setValue(nesting.getValue());
  }

  private void resolveForeignKeyReferences(
      final CdmDocumentDefinition currentDoc,
      final ResolveOptions resOpt,
      final MutableInt entityNesting) {
    final MutableInt nesting = entityNesting;
    currentDoc.visit("", (iObject, path) -> {
      final CdmObjectType ot = iObject.getObjectType();
      if (ot == CdmObjectType.AttributeGroupDef) {
        nesting.increment();
      }

      if (ot == CdmObjectType.EntityDef) {
        nesting.increment();
        if (nesting.getValue() == 1) {
          ((ResolveContext) this.ctx).setRelativePath(path);
          ((CdmEntityDefinition) iObject).fetchResolvedEntityReferences(resOpt);
        }
      }

      return false;
    }, (iObject, path) -> {
      if (iObject.getObjectType() == CdmObjectType.EntityDef
          || iObject.getObjectType() == CdmObjectType.AttributeGroupDef) {
        nesting.decrement();
      }

      return false;
    });

    entityNesting.setValue(nesting);
  }

  private void resolveAttributes(
      final CdmDocumentDefinition currentDoc,
      final ResolveOptions resOpt,
      final MutableInt entityNesting) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    final MutableInt nesting = entityNesting;
    currentDoc.visit("", (iObject, path) -> {
      final CdmObjectType ot = iObject.getObjectType();
      if (ot == CdmObjectType.EntityDef) {
        nesting.increment();
        if (nesting.getValue() == 1) {
          ctx.setRelativePath(path);
          iObject.fetchResolvedAttributes(resOpt);
        }
      }

      if (ot == CdmObjectType.AttributeGroupDef) {
        nesting.increment();
        if (nesting.getValue() == 1) {
          ctx.setRelativePath(path);
          iObject.fetchResolvedAttributes(resOpt);
        }
      }

      return false;
    }, (iObject, path) -> {
      if (iObject.getObjectType() == CdmObjectType.EntityDef
          || iObject.getObjectType() == CdmObjectType.AttributeGroupDef) {
        nesting.decrement();
      }

      return false;
    });

    entityNesting.setValue(nesting);
  }

  private void resolveReferencesTraitsArguments(
      final CdmDocumentDefinition currentDoc,
      final ResolveOptions resOpt,
      final MutableInt entityNesting) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    final Consumer<CdmObject> checkRequiredParamsOnResolvedTraits = obj -> {
      final ResolvedTraitSet rts = obj.fetchResolvedTraits(resOpt);
      if (rts != null) {
        for (int i = 0; i < rts.getSize(); i++) {
          final ResolvedTrait rt = rts.getSet().get(i);
          int found = 0;
          int resolved = 0;
          if (rt.getParameterValues() != null) {
            for (int iParam = 0; iParam < rt.getParameterValues().length(); iParam++) {
              if (rt.getParameterValues().fetchParameter(iParam).isRequired()) {
                found++;
                if (rt.getParameterValues().fetchValue(iParam) == null) {
                  LOGGER.error("no argument supplied for required parameter '{}' of trait '{}' on '{}'",
                      rt.getParameterValues().fetchParameter(iParam).getName(),
                      rt.getTraitName(),
                      obj.fetchObjectDefinition(resOpt).getName());
                } else {
                  resolved++;
                }
              }
            }
          }
          if (found > 0 && found == resolved) {
            LOGGER.info("found and resolved '{}' required parameters of trait '{}' on '{}'",
                found,
                rt.getTraitName(),
                obj.fetchObjectDefinition(resOpt).getName());
          }
        }
      }
    };

    currentDoc.visit("", null, (iObject, path) -> {
      final CdmObjectType ot = iObject.getObjectType();
      if (ot == CdmObjectType.EntityDef) {
        ctx.setRelativePath(path);
        // get the resolution of all parameters and values through inheritance and defaults and arguments, etc.
        checkRequiredParamsOnResolvedTraits.accept(iObject);
        final CdmCollection<CdmAttributeItem> hasAttributeDefs = ((CdmEntityDefinition) iObject).getAttributes();
        // do the same for all attributes
        if (hasAttributeDefs != null) {
          for (final CdmAttributeItem attDef : hasAttributeDefs) {
            checkRequiredParamsOnResolvedTraits.accept(attDef);
          }
        }
      }
      if (ot == CdmObjectType.AttributeGroupDef) {
        ctx.setRelativePath(path);
        // get the resolution of all parameters and values through inheritance and defaults and arguments, etc.
        checkRequiredParamsOnResolvedTraits.accept(iObject);
        final CdmCollection<CdmAttributeItem> memberAttributeDefs = ((CdmAttributeGroupDefinition) iObject).getMembers();
        // do the same for all attributes
        if (memberAttributeDefs != null) {
          for (final CdmAttributeItem attDef : memberAttributeDefs) {
            checkRequiredParamsOnResolvedTraits.accept(attDef);
          }
        }
      }
      return false;
    });
  }

  private void resolveTraitArguments(
      final ResolveOptions resOpt,
      final CdmDocumentDefinition currentDoc) {
    final ResolveContext ctx = (ResolveContext) this.ctx;
    currentDoc.visit("", (iObject, path) -> {
      final CdmObjectType objectType = iObject.getObjectType();
      switch (objectType) {
        case TraitRef: {
          ctx.pushScope(iObject.fetchObjectDefinition(resOpt));
          break;
        }

        case ArgumentDef: {
          try {
            if (null != ctx.getCurrentScope().getCurrentTrait()) {
              ctx.setRelativePath(path);
              final ParameterCollection parameterCollection =
                  ctx.getCurrentScope().getCurrentTrait().fetchAllParameters(resOpt);
              Object aValue;

              if (objectType == CdmObjectType.ArgumentDef) {
                final CdmParameterDefinition paramFound = parameterCollection
                    .resolveParameter(ctx.getCurrentScope().getCurrentParameter(),
                        ((CdmArgumentDefinition) iObject).getName());
                ((CdmArgumentDefinition) iObject).setResolvedParameter(paramFound);
                aValue = ((CdmArgumentDefinition) iObject).getValue();

                // If parameter type is entity, then the value should be an entity or ref to one
                // same is true of 'dataType' data type.
                aValue = this.constTypeCheck(resOpt, currentDoc, paramFound, aValue);
                ((CdmArgumentDefinition) iObject).setValue(aValue);
              }
            }
          } catch (final Exception e) {
            LOGGER.error(e.getLocalizedMessage());
            LOGGER.error("Failed to resolve parameter on trait '{}'", ctx.getCurrentScope().getCurrentTrait() != null ? ctx.getCurrentScope().getCurrentTrait().getName() : null);
          }

          ctx.getCurrentScope().setCurrentParameter(ctx.getCurrentScope().getCurrentParameter() + 1);
          break;
        }

        default: {
          LOGGER.debug("ObjectType not recognized: '{}'", iObject.getObjectType().name());
          break;
        }
      }

      return false;
    }, (iObject, path) -> {
      final CdmObjectType objectType = iObject.getObjectType();
      switch (objectType) {
        case TraitRef: {
          ((CdmTraitReference) iObject).resolvedArguments = true;
          ctx.popScope();
          break;
        }

        default: {
          LOGGER.debug("ObjectType not recognized: '{}'", iObject.getObjectType().name());
          break;
        }
      }

      return false;
    });
  }

  private void finishResolve() {
    final ResolveContext ctx = (ResolveContext) this.ctx;

    // Cleanup References.
    LOGGER.debug("Finishing...");

    // Turn elevated traits back on, they are off by default and should work fully now that
    // everything is resolved.
    final int documentCount = this.allDocuments.size();
    for (final Pair<CdmFolderDefinition, CdmDocumentDefinition> fd : this.allDocuments) {
      this.finishDocumentResolve(fd.getRight());
    }
  }

  private boolean containsUnsupportedPathFormat(final String path) {
    final String statusMessage;
    if (path.startsWith("./") || path.startsWith(".\\")) {
      statusMessage = "The path should not start with ./";
    } else if (path.contains("../") || path.contains("..\\")) {
      statusMessage = "The path should not contain ../";
    } else if (path.contains("/./") || path.contains("\\.\\")) {
      statusMessage = "The path should not contain /./";
    } else {
      return false;
    }

    LOGGER.error(statusMessage);
    return true;
  }

  public StorageManager getStorage() {
    return this.storage;
  }

  public CdmCorpusContext getCtx() {
    return ctx;
  }

  public void setCtx(CdmCorpusContext ctx) {
    this.ctx = ctx;
  }

  public String getAppId() {
    return appId;
  }

  public void setAppId(final String appId) {
    this.appId = appId;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public List<Pair<CdmFolderDefinition, CdmDocumentDefinition>> getAllDocuments() {
    return this.allDocuments;
  }

  public Map<String, Pair<CdmFolderDefinition, CdmDocumentDefinition>> getPathLookup() {
    return pathLookup;
  }

  public void setPathLookup(final Map<String, Pair<CdmFolderDefinition, CdmDocumentDefinition>> pathLookup) {
    this.pathLookup = pathLookup;
  }

  public Map<String, List<CdmDocumentDefinition>> getSymbolDefinitions() {
    return symbolDefinitions;
  }

  public void setSymbolDefinitions(final Map<String, List<CdmDocumentDefinition>> symbolDefinitions) {
    this.symbolDefinitions = symbolDefinitions;
  }

  Map<String, SymbolSet> getDefinitionReferenceSymbols() {
    return definitionReferenceSymbols;
  }

  public Map<CdmDocumentDefinition, CdmFolderDefinition> getDirectory() {
    return directory;
  }

  public void setDirectory(final Map<CdmDocumentDefinition, CdmFolderDefinition> directory) {
    this.directory = directory;
  }

  /**
   * Gets the last modified time of the object where it was readAsync from.
   */
  CompletableFuture<OffsetDateTime> computeLastModifiedTimeFromObjectAsync(
      final CdmObject currObject) {
    if (currObject instanceof CdmContainerDefinition) {
      final StorageAdapter adapter =
          this.storage.fetchAdapter(((CdmContainerDefinition) currObject).getNamespace());

      if (adapter == null) {
        LOGGER.error("Adapter not found for the Cdm object by ID " + currObject.getId() + ".");
        return null;
      }

      return adapter.computeLastModifiedTimeAsync(currObject.getAtCorpusPath());
    } else {
      return computeLastModifiedTimeFromObjectAsync(currObject.getInDocument());
    }
  }

  public Map<String, ResolvedTraitSet> getEmptyRts() {
    return emptyRts;
  }

  public void setEmptyRts(final Map<String, ResolvedTraitSet> emptyRts) {
    this.emptyRts = emptyRts;
  }

  /**
   * Gets the last modified time of the partition path without trying to read the file itself.
   *
   * @param corpusPath The corpus path
   * @return The last modified time
   */
  CompletableFuture<OffsetDateTime> computeLastModifiedTimeFromPartitionPathAsync(final String corpusPath) {
    // we do not want to load partitions from file, just check the modified times
    final Pair<String, String> pathTuple = this.storage.splitNamespacePath(corpusPath);
    final String nameSpace = pathTuple.getLeft();

    if (!StringUtils.isNullOrTrimEmpty(nameSpace)) {
      final StorageAdapter adapter = this.storage.fetchAdapter(nameSpace);
      final String adapterPath = adapter.createAdapterPath(corpusPath);
      return adapter.computeLastModifiedTimeAsync(adapterPath);
    }

    return CompletableFuture.completedFuture(null);
  }

  /**
   * Gets the last modified time of the object found at the input corpus path.
   * @param corpusPath The path to the object that you want to get the last modified time for
   * @return
   */
  CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(final String corpusPath) {
    return this.computeLastModifiedTimeAsync(corpusPath, null);
  }

  /**
   * Gets the last modified time of the object found at the input corpus path.
   * @param corpusPath The path to the object that you want to get the last modified time for
   * @param obj
   * @return
   */
  CompletableFuture<OffsetDateTime> computeLastModifiedTimeAsync(
      final String corpusPath,
      final CdmObject obj) {
    return fetchObjectAsync(corpusPath, obj).thenCompose(currObject -> {
      if (currObject != null) {
        return this.computeLastModifiedTimeFromObjectAsync(currObject);
      }
      return CompletableFuture.completedFuture(null);
    });
  }

  public Map<CdmEntityDefinition, ArrayList<CdmE2ERelationship>> getOutgoingRelationships() {
    return outgoingRelationships;
  }

  public Map<CdmEntityDefinition, ArrayList<CdmE2ERelationship>> getIncomingRelationships() {
    return incomingRelationships;
  }

  @FunctionalInterface
  public interface ResolveAction {
    void invoke(CdmDocumentDefinition currentDoc, ResolveOptions resOptions, MutableInt entityNesting);
  }

  private class removeObjectCallBack implements VisitCallback {
    private final CdmCorpusDefinition thiz;
    private final ResolveContext ctx;
    private final CdmDocumentDefinition doc;

    public removeObjectCallBack(final CdmCorpusDefinition thiz, final ResolveContext ctx, final CdmDocumentDefinition doc) {
      this.thiz = thiz;
      this.ctx = ctx;
      this.doc = doc;
    }

    @Override
    public boolean invoke(final CdmObject iObject, final String path) {
      if (path.indexOf("(unspecified") > 0) {
        return true;
      }
      switch (iObject.getObjectType()) {
        case EntityDef:
        case ParameterDef:
        case TraitDef:
        case PurposeDef:
        case DataTypeDef:
        case TypeAttributeDef:
        case EntityAttributeDef:
        case AttributeGroupDef:
        case ConstantEntityDef:
        case AttributeContextDef:
        case LocalEntityDeclarationDef:
        case ReferencedEntityDeclarationDef:
          thiz.unRegisterSymbol(path, doc);
          thiz.unRegisterDefinitionReferenceSymbols(iObject, "rasb");
          break;
      }
      return false;
    }
  }
}
