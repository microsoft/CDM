// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.CommonDataModelLoader;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.resolution.CdmEntityDefinitionResolutionTest;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmValidationStep;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.RetryTest;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.testng.Assert;
import org.testng.annotations.Ignore;
import org.testng.annotations.Test;

public class PerformanceTest {

  /**
   * The path of the SchemaDocs project.
   */
  private static final String SCHEMA_DOCS_ROOT = "../../../schemaDocuments";

  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File("cdm", "performance").toString();

  /**
   * Test the time taken to resolve the corpus
   */
  //@Test(retryAnalyzer = RetryTest.class)
  public void resolveCorpus() {
    Assert.assertTrue(
        (Files.isDirectory(
            Paths.get(SCHEMA_DOCS_ROOT))),
        "SchemaDocsRoot not found!!!");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    System.out.println("reading source files");

    final long startTime = System.currentTimeMillis();
    cdmCorpus.getStorage().mount("local", new LocalAdapter(SCHEMA_DOCS_ROOT));
    final CdmManifestDefinition manifest =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            TestHelper.CDM_STANDARDS_SCHEMA_PATH
        ).join();
    final AttributeResolutionDirectiveSet directives =
        new AttributeResolutionDirectiveSet(
            new HashSet<>(Arrays.asList("normalized", "referenceOnly")));
    CdmEntityDefinitionResolutionTest.listAllResolved(
        cdmCorpus,
        directives,
        manifest,
        new StringSpewCatcher()).join();
    final long stopTime = System.currentTimeMillis();
    //    TODO-BQ: 2019-10-18 Limit higher than C#'s test
    Assert.assertTrue(stopTime - startTime < 80000L);
  }

  /**
   * Test the time taken to resolve all the entities
   */
  @Test
  public void resolveEntities() throws InterruptedException {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    final String testInputPath = TestHelper.getInputFolderPath(
        TESTS_SUBPATH,
        "testResolveEntities");

    cdmCorpus.setRootPath(testInputPath);
    cdmCorpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    cdmCorpus.getStorage().setDefaultNamespace("local");
    final List<ImmutablePair<CdmEntityDefinition, CdmDocumentDefinition>> entities =
        this.getAllEntities(cdmCorpus);
    final List<ImmutablePair<String, Long>> entityResolutionTimes = new ArrayList<>();
    entities.forEach(data -> {
      final CdmEntityDefinition entity = data.getLeft();
      final CdmDocumentDefinition doc = data.getRight();
      final ResolveOptions resOpt = new ResolveOptions();
      resOpt.setWrtDoc(doc);
      final long startTime = System.currentTimeMillis();
      entity.createResolvedEntityAsync(entity.getName() + "_", resOpt).join();
      final long stopTime = System.currentTimeMillis();
      entityResolutionTimes.add(ImmutablePair.of(
          entity.getAtCorpusPath(),
          stopTime - startTime));
    });

    entityResolutionTimes.sort((lhs, rhs) -> {
      final long diff = rhs.getRight() - lhs.getRight();
      return diff == 0 ? 0 : diff < 0 ? -1 : 1;
    });

    entityResolutionTimes.forEach(
        data -> System.out.println(data.getLeft() + ":" + data.getRight()));

    Assert.assertTrue(entityResolutionTimes.get(0).getRight() < 1000);

    final Long total = entityResolutionTimes
        .parallelStream()
        .map(ImmutablePair::getRight)
        .reduce(0L, Long::sum);
    Assert.assertTrue(total < 2000L);
  }

  /**
   * Test the time taken to resolve an entity w.r.t. the entities it references.
   */
  @Test
  public void resolveEntitiesWrt() throws InterruptedException {
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    final String testInputPath = TestHelper.getInputFolderPath(
        TESTS_SUBPATH,
        "testResolveEntitiesWrt");

    cdmCorpus.setRootPath(testInputPath);
    ;
    cdmCorpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    cdmCorpus.getStorage().setDefaultNamespace("local");
    final List<ImmutablePair<CdmEntityDefinition, CdmDocumentDefinition>> entities =
        this.getAllEntities(cdmCorpus);
    final Map<CdmEntityDefinition, List<CdmEntityDefinition>> incomingReferences = new LinkedHashMap<>();
    entities.forEach(data -> {
      final CdmEntityDefinition entity = data.getLeft();
      incomingReferences.put(entity, new ArrayList<>());
    });

    // Start by populating all the incoming references to the entities
    entities.forEach(data -> {
      final CdmEntityDefinition entity = data.getLeft();
      final CdmDocumentDefinition doc = data.getRight();
      final ResolveOptions resOpt = new ResolveOptions();
      resOpt.setWrtDoc(doc);
      final CdmEntityDefinition resolvedEntity =
          entity.createResolvedEntityAsync(entity.getName() + "_", resOpt).join();
      final List<CdmEntityDefinition> references
          = this.getEntityReferencesAsync(resolvedEntity, resOpt, cdmCorpus).join();
      if (references.size() > 0) {
        references.forEach(reference -> incomingReferences.get(reference).add(entity));
      }
    });

    // Next resolve the entity with all of it's incoming references and save the times
    final List<ImmutablePair<String, Long>> entityResolutionTimes = new ArrayList<>();
    entities.forEach(data -> {
      final CdmEntityDefinition entity = data.getLeft();
      final CdmDocumentDefinition doc = data.getRight();
      final ResolveOptions resOpt = new ResolveOptions();
      resOpt.setWrtDoc(doc);
      final long startTime = System.currentTimeMillis();
      entity.createResolvedEntityAsync(entity.getName() + "_", resOpt).join();
      final long stopTime = System.currentTimeMillis();
      entityResolutionTimes.add(ImmutablePair.of(entity.getAtCorpusPath(), stopTime - startTime));
    });

    entityResolutionTimes.sort((lhs, rhs) -> {
      final long diff = rhs.getRight() - lhs.getRight();
      return diff == 0 ? 0 : diff < 0 ? -1 : 1;
    });

    entityResolutionTimes.forEach(data ->
        System.out.println(data.getLeft() + ":" + data.getRight()));

    Assert.assertTrue(entityResolutionTimes.get(0).getRight() < 1000);

    final Long total = entityResolutionTimes
        .parallelStream()
        .map(ImmutablePair::getRight)
        .reduce(0L, Long::sum);
    Assert.assertTrue(total < 3500L);
  }

  /**
   * Get the list of entities that the given entity references
   *
   * @param resolvedEntity The resolved version of the entity.
   * @param resOpt         The resolution options to use.
   * @param cdmCorpus      The instance of the CDM corpus.
   * @return The list of referenced entities.
   */
  private CompletableFuture<List<CdmEntityDefinition>> getEntityReferencesAsync(
      final CdmEntityDefinition resolvedEntity,
      final ResolveOptions resOpt,
      final CdmCorpusDefinition cdmCorpus) {
    return CompletableFuture.supplyAsync(() -> {
      final List<CdmTypeAttributeDefinition> atts = resolvedEntity
          .getAttributes()
          .getAllItems()
          .parallelStream()
          .map(att -> (CdmTypeAttributeDefinition) att)
          .collect(Collectors.toList());

      final List<CdmTraitReference> reqdTraits = atts
          .parallelStream()
          .map(att -> att
              .getAppliedTraits()
              .getAllItems()
              .parallelStream()
              .filter(trait -> trait
                  .fetchObjectDefinitionName()
                  .equals("is.linkedEntity.identifier"))
              .findFirst()
              .orElse(null))
          .filter(trait -> trait != null)
          .collect(Collectors.toList());
      final List<CdmEntityDefinition> references = new ArrayList<>();
      reqdTraits.forEach(trait -> {
        CdmConstantEntityDefinition constEnt = null;
        if (trait.fetchArgumentValue("entityReferences") != null) {
          constEnt =
              ((CdmEntityReference) trait.fetchArgumentValue("entityReferences"))
                  .fetchObjectDefinition(resOpt);
        }
        if (constEnt != null) {
          final List<CdmEntityDefinition> refs = new ArrayList<>();
          constEnt.getConstantValues().forEach(val ->
              refs.add(
                  cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(
                      cdmCorpus.getStorage().createAbsoluteCorpusPath(val.get(0))
                  ).join()));
          references.addAll(refs);
        }
      });

      return references;
    });
  }

  /**
   * Get all the entities that are present in the corpus.
   *
   * @param cdmCorpus The instance of the CDM corpus to use.
   * @return The list of entities present.
   */
  private List<ImmutablePair<CdmEntityDefinition, CdmDocumentDefinition>> getAllEntities(
      final CdmCorpusDefinition cdmCorpus) {
    System.out.println("reading source files");

    final CdmFolderDefinition rootFolder = cdmCorpus
        .getStorage()
        .fetchRootFolder("local");
    final List<File> directories = new ArrayList<>(
        Arrays.asList(new File(cdmCorpus.getRootPath()).listFiles(File::isDirectory))
    );

    final List<String> folders = directories
        .parallelStream()
        .map(File::getName)
        .collect(Collectors.toList());
    folders.forEach(folder ->
        CommonDataModelLoader.loadCorpusFolderAsync(
            cdmCorpus,
            rootFolder.getChildFolders().add(folder),
            Collections.singletonList("analyticalCommon"), "").join());

    CommonDataModelLoader.resolveLocalCorpusAsync(
        cdmCorpus,
        CdmValidationStep.MinimumForResolving).join();

    final List<ImmutablePair<CdmEntityDefinition, CdmDocumentDefinition>> entities =
        new ArrayList<>();

    seekEntities(rootFolder.getChildFolders().get(0), entities);
    return entities;
  }

  private void seekEntities(
      final CdmFolderDefinition folder,
      final List<ImmutablePair<CdmEntityDefinition, CdmDocumentDefinition>> entities) {
    if (folder.getDocuments() != null && folder.getDocuments().size() > 0) {
      folder.getDocuments().forEach(doc ->
          doc.getDefinitions().forEach(def -> {
            if (def.getObjectType() == CdmObjectType.EntityDef) {
              entities.add(ImmutablePair.of((CdmEntityDefinition) def, doc));
            }
          }));
    }

    if (folder.getChildFolders() != null) {
      folder.getChildFolders().getAllItems().forEach(f -> seekEntities(f, entities));
    }
  }
}
