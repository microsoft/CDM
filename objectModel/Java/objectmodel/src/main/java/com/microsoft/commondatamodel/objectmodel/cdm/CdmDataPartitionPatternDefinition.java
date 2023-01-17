// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;

import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.CdmFileMetadata;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.FileStatusCheckOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StorageUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.TraitToPropertyMap;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import java.util.stream.Collectors;

public class CdmDataPartitionPatternDefinition extends CdmObjectDefinitionBase implements CdmFileStatus {
  private static final String TAG = CdmDataPartitionPatternDefinition.class.getSimpleName();

  private String name;
  private String rootLocation;
  private String globPattern;
  private String regularExpression;
  private List<String> parameters;
  private String specializedSchema;
  private OffsetDateTime lastFileStatusCheckTime;
  private OffsetDateTime lastFileModifiedTime;
  private TraitToPropertyMap t2pm;
  private OffsetDateTime lastChildFileModifiedTime;

  public CdmDataPartitionPatternDefinition(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.setObjectType(CdmObjectType.DataPartitionPatternDef);
    this.setName(name);
  }

  @Override
  public boolean validate() {
    if (StringUtils.isNullOrEmpty(getRootLocation())) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("rootLocation"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt Resolve Options
   * @param options Copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmDataPartitionPatternDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    CdmDataPartitionPatternDefinition copy;
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    if (host == null) {
      copy = new CdmDataPartitionPatternDefinition(getCtx(), getName());
    } else {
      copy = (CdmDataPartitionPatternDefinition) host;
      copy.setName(this.getName());
    }

    copy.setRootLocation(this.getRootLocation());
    copy.setGlobPattern(this.getGlobPattern());
    copy.setRegularExpression(this.getRegularExpression());
    copy.setParameters(
            this.getParameters() != null
                    ? new ArrayList<>(this.getParameters()) : null);
    copy.setLastFileStatusCheckTime(this.getLastFileStatusCheckTime());
    copy.setLastFileModifiedTime(this.getLastFileModifiedTime());

    if (this.getSpecializedSchema() != null) {
      copy.setSpecializedSchema(this.getSpecializedSchema());
    }

    this.copyDef(resOpt, copy);

    return copy;
  }

  private TraitToPropertyMap getTraitToPropertyMap() {
    if (this.t2pm == null) {
      this.t2pm = new TraitToPropertyMap(this);
    }

    return this.t2pm;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(
      final String pathFrom,
      final VisitCallback preChildren,
      final VisitCallback postChildren) {
    String path = this.fetchDeclaredPath(pathFrom);

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }

    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }

    if (postChildren != null && postChildren.invoke(this, path)) {
      return true;
    }

    return false;
  }

  @Deprecated
  public String fetchDeclaredPath(String pathFrom) {
    return pathFrom + (this.getName() == null ? "UNNAMED": this.getName());
  }

  /**
   * Gets or sets the data partition pattern name.
   * @return String
   */
  @Override
  public String getName() {
    return name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  /**
   * Gets or sets the starting location corpus path for searching for inferred data partitions.
   * @return String
   */
  public String getRootLocation() {
    return rootLocation;
  }

  public void setRootLocation(final String value) {
    this.rootLocation = value;
  }

  /**
   * Gets or sets the glob pattern used to search for partitions.
   * If both globPattern and regularExpression is set, globPattern will be used.
   * @return String
   */
  public String getGlobPattern() {
    return globPattern;
  }

  public void setGlobPattern(final String value) {
    this.globPattern = value;
  }

  /**
   * Gets or sets the regular expression string to use for searching partitions.
   * @return String
   */
  public String getRegularExpression() {
    return regularExpression;
  }

  public void setRegularExpression(final String value) {
    this.regularExpression = value;
  }

  /**
   * Gets or sets the names for replacement values from regular expression.
   * @return List of String
   */
  public List<String> getParameters() {
    return parameters;
  }

  public void setParameters(final List<String> value) {
    this.parameters = value;
  }

  /**
   * Gets or sets the corpus path for specialized schema to use for matched pattern partitions.
   * @return String
   */
  public String getSpecializedSchema() {
    return specializedSchema;
  }

  public void setSpecializedSchema(final String value) {
    this.specializedSchema = value;
  }

  /**
   * Gets whether the data partition is incremental.
   * @return boolean
   */
  public boolean isIncremental() {
    return (boolean) getTraitToPropertyMap().fetchPropertyValue(CdmPropertyName.IS_INCREMENTAL);
  }

  /**
   * Last time the modified times were updated.
   * @return Offset time
   */
  @Override
  public OffsetDateTime getLastFileStatusCheckTime() {
    return lastFileStatusCheckTime;
  }

  @Override
  public void setLastFileStatusCheckTime(final OffsetDateTime value) {
    this.lastFileStatusCheckTime = value;
  }

  /**
   * Last time this file was modified according to the OM.
   * @return Offset time
   */
  @Override
  public OffsetDateTime getLastFileModifiedTime() {
    return lastFileModifiedTime;
  }

  @Override
  public void setLastFileModifiedTime(final OffsetDateTime value) {
    this.lastFileModifiedTime = value;
  }

  /**
   * LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
   * @return Offset time
   */
  @Override
  public OffsetDateTime getLastChildFileModifiedTime() {
    throw new UnsupportedOperationException();
  }

  /**
   * LastChildFileModifiedTime is not valid for DataPartitions since they do not contain any children objects.
   * @param time offset time
   */
  @Override
  public void setLastChildFileModifiedTime(final OffsetDateTime time) {
    throw new UnsupportedOperationException();
  }

  /**
   * Updates the object and any children with changes made in the document file where it came from.
   * @param fileStatusCheckOptions The set of options used to determine what information should be set in found partitions
   * @return CompletableFuture
   */
  public CompletableFuture<Void> fileStatusCheckAsync(FileStatusCheckOptions fileStatusCheckOptions) {
    return CompletableFuture.runAsync(() -> {
      try (Logger.LoggerScope logScope = Logger.enterScope(CdmDataPartitionPatternDefinition.class.getSimpleName(), getCtx(), "fileStatusCheckAsync")) {
        String nameSpace = null;
        StorageAdapterBase adapter = null;

        // make sure the root is a good full corpus path
        String rootCleaned = getRootLocation() != null && getRootLocation().endsWith("/") ? getRootLocation().substring(0, getRootLocation().length() - 1) : getRootLocation();

        if (rootCleaned == null) {
          rootCleaned = "";
        }

        final String rootCorpus = getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(rootCleaned, getInDocument());

        HashMap<String, CdmFileMetadata> fileInfoList = null;
        try {
          // Remove namespace from path
          final Pair<String, String> pathTuple = StorageUtils.splitNamespacePath(rootCorpus);
          if (pathTuple == null) {
            Logger.error(this.getCtx(), TAG, "fileStatusCheckAsync", this.getAtCorpusPath(), CdmLogCode.ErrStorageNullCorpusPath);
            return;
          }

          nameSpace = pathTuple.getLeft();
          adapter = this.getCtx().getCorpus().getStorage().fetchAdapter(nameSpace);

          if (adapter == null) {
            Logger.error(this.getCtx(), TAG, "fileStatusCheckAsync", this.getAtCorpusPath(), CdmLogCode.ErrDocAdapterNotFound, this.getInDocument().getName());
            return;
          }

          // get a list of all corpusPaths under the root
          fileInfoList = adapter.fetchAllFilesMetadataAsync(pathTuple.getRight()).join();
        } catch (Exception e) {
          Logger.warning(this.getCtx(), TAG, "fileStatusCheckAsync", rootCorpus, CdmLogCode.WarnPartitionFileFetchFailed, rootCorpus, e.getMessage());
        }

        // update modified times
        setLastFileStatusCheckTime(OffsetDateTime.now(ZoneOffset.UTC));

        if (fileInfoList == null) {
          Logger.error(this.getCtx(), TAG, "fileStatusCheckAsync", rootCorpus, CdmLogCode.ErrFetchingFileMetadataNull, nameSpace);
          return;
        }

        if (nameSpace != null) {
          HashMap<String, CdmFileMetadata> cleanedFileList = new HashMap<String, CdmFileMetadata>();
          // remove root of the search from the beginning of all paths so anything in the root is not found by regex
          for (final Map.Entry<String, CdmFileMetadata> entry : fileInfoList.entrySet()) {
            cleanedFileList.put(StringUtils.slice(nameSpace + ":" + entry.getKey(), rootCorpus.length()), entry.getValue());
          }

          if (this.getOwner() instanceof CdmLocalEntityDeclarationDefinition) {
            final CdmLocalEntityDeclarationDefinition localEntDecDefOwner = (CdmLocalEntityDeclarationDefinition) this.getOwner();
            // if both are present log warning and use glob pattern, otherwise use regularExpression
            if (!StringUtils.isNullOrTrimEmpty(this.getGlobPattern()) && !StringUtils.isNullOrTrimEmpty(this.getRegularExpression())) {
              Logger.warning(this.getCtx(), TAG,
                      "fileStatusCheckAsync",
                      rootCorpus, CdmLogCode.WarnPartitionGlobAndRegexPresent,
                      this.getGlobPattern(), this.getRegularExpression());
            }
            String regularExpression = !StringUtils.isNullOrTrimEmpty(this.globPattern) ? this.globPatternToRegex(this.globPattern) : this.regularExpression;
            Pattern regexPattern = null;

            try {
              regexPattern = Pattern.compile(regularExpression);
            } catch (final PatternSyntaxException e) {
              Logger.error(this.getCtx(), TAG,
                      "fileStatusCheckAsync",
                      rootCorpus, CdmLogCode.ErrValdnInvalidExpression, !StringUtils.isNullOrTrimEmpty(this.globPattern) ? "glob pattern" : "regular expression",
                      !StringUtils.isNullOrTrimEmpty(this.globPattern) ? this.globPattern : this.regularExpression, e.getMessage());
            }

            if (regexPattern != null) {
              // a hashset to check if the data partition exists
              HashSet<String> dataPartitionPathHashSet = new HashSet<>();
              if (localEntDecDefOwner.getDataPartitions() != null) {
                for (final CdmDataPartitionDefinition dataPartition : localEntDecDefOwner.getDataPartitions()) {
                  final String fullPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(dataPartition.getLocation(), this.getInDocument());
                  dataPartitionPathHashSet.add(fullPath);
                }
              }

              HashSet<String> incrementalPartitionPathHashSet = new HashSet<>();
              if (localEntDecDefOwner.getIncrementalPartitions() != null) {
                for (final CdmDataPartitionDefinition incrementalPartition : localEntDecDefOwner.getIncrementalPartitions()) {
                  final String fullPath = this.getCtx().getCorpus().getStorage().createAbsoluteCorpusPath(incrementalPartition.getLocation(), this.getInDocument());
                  incrementalPartitionPathHashSet.add(fullPath);
                }
              }

              for (final Map.Entry<String, CdmFileMetadata> fi : cleanedFileList.entrySet()) {
                final String fileName = fi.getKey();
                final CdmFileMetadata partitionMetadata = fi.getValue();

                final Matcher m = regexPattern.matcher(fileName);

                if (m.matches() && m.group().equals(fileName)) {
                  // create a map of arguments out of capture groups
                  final Map<String, List<String>> args = new LinkedHashMap<>();

                  // For each capture group, save the matching substring into the parameter.
                  for (int i = 0; i < m.groupCount(); i++) {
                    if (this.getParameters() != null && i < this.getParameters().size()) {
                      final String currentParam = this.getParameters().get(i);

                      if (!args.containsKey(currentParam)) {
                        args.put(currentParam, new ArrayList<>());
                      }

                      args.get(currentParam).add(m.group(i + 1));
                    }
                  }

                  // put the original but cleaned up root back onto the matched doc as the location stored in the partition
                  final String locationCorpusPath = rootCleaned + fileName;
                  final String fullPath = rootCorpus + fileName;
                  // Remove namespace from path
                  final Pair<String, String> pathTuple = StorageUtils.splitNamespacePath(fullPath);
                  if (pathTuple == null) {
                    Logger.error(this.getCtx(), TAG, "fileStatusCheckAsync", rootCorpus, CdmLogCode.ErrStorageNullCorpusPath, this.getAtCorpusPath());
                    return;
                  }

                  CdmTraitCollection exhibitsTraits = this.getExhibitsTraits();
                  if (fileStatusCheckOptions != null && fileStatusCheckOptions.getIncludeDataPartitionSize() && partitionMetadata != null) {
                    exhibitsTraits = new CdmTraitCollection(this.getCtx(), this);
                    for (final CdmTraitReferenceBase trait : this.getExhibitsTraits()) {
                      exhibitsTraits.add(trait);
                    }
                    exhibitsTraits.add("is.partition.size", new ArrayList<>(Collections.singletonList(new ImmutablePair<>("value", partitionMetadata.getSize()))));
                  }

                  final OffsetDateTime lastModifiedTime =
                          adapter.computeLastModifiedTimeAsync(pathTuple.getRight()).join();

                  if (this.isIncremental() && !incrementalPartitionPathHashSet.contains(fullPath)) {
                    localEntDecDefOwner.createDataPartitionFromPattern(locationCorpusPath, exhibitsTraits, args, this.getSpecializedSchema(), lastModifiedTime, true, this.getName());
                    incrementalPartitionPathHashSet.add(fullPath);
                  } else if (!this.isIncremental() && !dataPartitionPathHashSet.contains(fullPath)) {
                    localEntDecDefOwner.createDataPartitionFromPattern(
                      locationCorpusPath, exhibitsTraits, args, getSpecializedSchema(), lastModifiedTime);
                    dataPartitionPathHashSet.add(fullPath);
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  @Override
  public CompletableFuture<Void> fileStatusCheckAsync() {
    return this.fileStatusCheckAsync(null);
  }

  /**
   * Report most recent modified time (of current or children objects) to the parent object.
   * @param childTime offset time
   * @return Completable future
   */
  @Override
  public CompletableFuture<Void> reportMostRecentTimeAsync(final OffsetDateTime childTime) {
    if (getOwner() instanceof CdmFileStatus && childTime != null) {
      return ((CdmFileStatus) getOwner()).reportMostRecentTimeAsync(childTime);
    }

    return CompletableFuture.completedFuture(null);
  }

  /**
   * Converts a glob pattern to a regular expression
   * @param pattern string
   * @return String
   */
  private String globPatternToRegex(String pattern) {
    ArrayList<String> newPattern = new ArrayList<String>();
    // all patterns should start with a slash
    newPattern.add("[/\\\\]");

    // if pattern starts with slash, skip the first character. We already added it above
    for (int i = (pattern.charAt(0) == '/' || pattern.charAt(0) == '\\' ? 1 : 0); i < pattern.length(); i++) {
      final char currChar = pattern.charAt(i);

      switch (currChar) {
        case '.':
          // escape '.' characters
          newPattern.add("\\.");
          break;
        case '\\':
          // convert backslash into slash
          newPattern.add("[/\\\\]");
          break;
        case '?':
          // question mark in glob matches any single character
          newPattern.add(".");
          break;
        case '*':
          Character nextChar = i + 1 < pattern.length() ? pattern.charAt(i + 1) : null;
          if (nextChar != null && nextChar.equals('*')) {
            Character prevChar = i - 1 >= 0 ? pattern.charAt(i - 1) : null;
            Character postChar = i + 2 < pattern.length() ? pattern.charAt(i + 2) : null;

            // globstar must be at beginning of pattern, end of pattern, or wrapped in separator characters
            if ((prevChar == null || prevChar == '/' || prevChar == '\\')
            && (postChar == null || postChar == '/' || postChar == '\\')) {
              newPattern.add(".*");

              // globstar can match zero or more subdirectories. If it matches zero, then there should not be
              // two consecutive '/' characters so make the second one optional
              if (prevChar != null && postChar != null &&
              (prevChar == '/' || prevChar == '\\') && (postChar == '/' || postChar == '\\')) {
                newPattern.add("/?");
                i++;
              }
            } else {
              // otherwise, treat the same as '*'
              newPattern.add("[^/\\\\]*");
            }
            i++;
          } else {
            // *
            newPattern.add("[^/\\\\]*");
          }
          break;
        default:
          newPattern.add(Character.toString(currChar));
      }
    }

    return String.join("", newPattern);
  }
}
