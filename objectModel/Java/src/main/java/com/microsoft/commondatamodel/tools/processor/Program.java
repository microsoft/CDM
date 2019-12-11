package com.microsoft.commondatamodel.tools.processor;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntity;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterException;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionDirectiveSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

public class Program {

  public static void main(final String[] args) {
    final String pathToDocRoot;
    final String docGroup;
    final CdmManifestDefinition manifest;
    final String testEnt;

    final boolean testCorpus = false;
    final boolean resolveEnt = true;
    final boolean spewAll = false;
    final boolean rePersist = false;

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().setDefaultNamespace("local");

    if (testCorpus) {
      pathToDocRoot = "../../../../../../../../CDM.Tools.Internal/TestCorpus";
      //pathToDocRoot = "../perfTestCorpus";
      //docGroup = "E2EResolution";
      //docGroup = "POVResolution";
      //docGroup = "MiniDyn";
      //docGroup = "composites";
      //docGroup = "KnowledgeGraph";
      //docGroup = "overrides";
      docGroup = "webClicks";

      //testEnt = "/E2EResolution/E2EArrayOne.cdm.json/E2EArrayOne";
      //testEnt = "/MiniDyn/sub/Lead.cdm.json/Lead";
      // testEnt = "/POVResolution/sub1/Main.cdm.json/Main";
      testEnt = "local:/MiniDyn/Account.cdm.json/Account";
    } else {
      pathToDocRoot = "../CDM.SchemaDocuments";
      testEnt = "local:/core/applicationCommon/foundationCommon/crmCommon/Account.cdm.json/Account";
      docGroup = "standards";
    }

    final StorageAdapter localAdapter = new LocalAdapter(pathToDocRoot);
    cdmCorpus.getStorage().mount("local", localAdapter);
    manifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(String.format("local:/%s.manifest.cdm.json", docGroup)).join();

    System.out.println("reading source files");

    if (resolveEnt) {
      final CdmEntityDefinition ent = cdmCorpus.<CdmEntityDefinition>fetchObjectAsync(testEnt).join();
      final ResolveOptions resOpt = new ResolveOptions(ent);

      final CdmEntityDefinition x = ent.createResolvedEntityAsync("RESOLVED_KILL", resOpt).join();
      resOpt.setWrtDoc(x.getInDocument());
      final CopyOptions copyOptions = new CopyOptions();
      copyOptions.setIsStringRefs(false);
      copyOptions.setIsRemoveSingleRowLocalizedTableTraits(true);
      CommonDataModelLoader.persistDocument(cdmCorpus.getRootPath(), resOpt, copyOptions);
    }

    if (spewAll) {
      System.out.println("list all resolved");
      final Set<String> LinkedHashSet = new LinkedHashSet<>(Arrays.asList("normalized", "xstructured", "referenceOnly"));
      final AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(LinkedHashSet);
      listAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher()).join();
    }

    if (rePersist) {
      System.out.println("persist corpus");
      final Set<String> LinkedHashSet = new LinkedHashSet<>(Arrays.asList("normalized", "xstructured", "referenceOnly"));
      final AttributeResolutionDirectiveSet directives = new AttributeResolutionDirectiveSet(LinkedHashSet);
    }

    //listAllTraits(cdmCorpus);
    System.out.println("done");
  }

  private static CompletableFuture<Void> seekEntities(final CdmCorpusDefinition cdmCorpus,
                                                      final AttributeResolutionDirectiveSet directives,
                                                      final CdmManifestDefinition manifest, final StringSpewCatcher spew) {
    return CompletableFuture.runAsync(() -> {
      if (manifest.getEntities() != null) {
        if (spew != null) {
          spew.spewLine(manifest.getFolderPath());
        }
        for (final CdmEntityDeclarationDefinition entity : manifest.getEntities()) {
          CdmEntityDeclarationDefinition ent = entity;
          CdmObject currentFile = manifest;
          while (ent instanceof CdmReferencedEntityDeclarationDefinition) {
            ent = cdmCorpus
                .<CdmEntityDeclarationDefinition>fetchObjectAsync(
                    ent.getEntityPath(),
                    currentFile)
                .join();
            currentFile = ent;
          }
          final CdmEntityDefinition newEnt = cdmCorpus
              .<CdmEntityDefinition>fetchObjectAsync(
                  ent.getEntityPath(),
                  currentFile).join();
          final ResolveOptions resOpt = new ResolveOptions(newEnt);

          final ResolvedEntity resEnt = new ResolvedEntity(newEnt, resOpt);

          if (spew != null) {
            try {
              resEnt.spew(resOpt, spew, " ", true);
            } catch (final IOException e) {
              throw new StorageAdapterException(e.getMessage());
            }
          }
        }
      }

      if (manifest.getSubManifests() != null) {
        for (final CdmManifestDeclarationDefinition subManifest : manifest.getSubManifests()) {
          seekEntities(
              cdmCorpus,
              directives,
              cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
                  subManifest.getDefinition(),
                  manifest).join(),
              spew)
              .join();
        }
      }
    });
  }

  public static CompletableFuture<Void> listAllResolved(final CdmCorpusDefinition cdmCorpus,
                                                        final AttributeResolutionDirectiveSet directives,
                                                        final CdmManifestDefinition manifest, final StringSpewCatcher spew) {
    return CompletableFuture.runAsync(() -> {
      seekEntities(cdmCorpus, directives, manifest, spew).join();

      if (spew != null) {
        try {
          final File file = new File("src/main/java/com/microsoft/commondatamodel/tools/internal/allResolved.txt");
          file.createNewFile();
          final byte[] strToBytes = spew.getContent().getBytes();
          Files.write(file.toPath(), strToBytes);
        } catch (final IOException e) {
          throw new RuntimeException(e.getMessage());
        }
      }
    });
  }

  private static CompletableFuture<Void> seekTraits(final CdmFolderDefinition folder, final AttributeResolutionDirectiveSet directives) {
    final Set<String> seen = new LinkedHashSet<>();
    return CompletableFuture.runAsync(() -> {
      if (!Strings.isNullOrEmpty(folder.getName()) && folder.getDocuments() != null && folder.getDocuments().size() > 0) {
        if (folder.getDocuments() != null) {
          folder.getDocuments().forEach(doc -> {
            if (doc.getDefinitions() != null && doc.getDefinitions().getCount() > 0) {
              for (final CdmObjectDefinition def : doc.getDefinitions()) {
                if (def.getObjectType() == CdmObjectType.EntityDef) {
                  final ResolveOptions resOpt = new ResolveOptions();
                  resOpt.setWrtDoc(doc);
                  resOpt.setDirectives(directives);

                  final CdmEntityDefinition ent = ((CdmEntityDefinition) def);

                  final ResolvedTraitSet rtsEnt = ent.fetchResolvedTraits(resOpt);
                  rtsEnt.getSet().forEach(rt -> {
                    final String rtName = rt.getTraitName();
                    if (!seen.contains(rtName)) {
                      System.out.println(rtName);
                      seen.add(rtName);
                    }
                  });

                  final ResolvedAttributeSet ras = ent.fetchResolvedAttributes(resOpt);
                  ras.getSet().forEach(ra -> {
                    final ResolvedTraitSet rtsAtt = ra.fetchResolvedTraits();
                    rtsAtt.getSet().forEach(rt -> {
                      final String rtName = rt.getTraitName();
                      if (!seen.contains(rtName)) {
                        System.out.println(rtName);
                        seen.add(rtName);
                      }
                    });
                  });
                }
              }
            }
          });
        }
        if (folder.getChildFolders() != null) {
          folder.getChildFolders().forEach(manifest -> seekTraits(manifest, directives));
        }
      }
    });
  }
}