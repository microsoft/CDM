// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    class ImportPersistence
    {
        public static CdmImport FromData(CdmCorpusContext ctx, Import obj)
        {
            if (obj == null)
            {
                throw new System.ArgumentNullException(nameof(obj));
            }

            CdmImport import = ctx.Corpus.MakeObject<CdmImport>(CdmObjectType.Import);
            string corpusPath = obj.CorpusPath;
            if (string.IsNullOrEmpty(corpusPath))
            {
                corpusPath = obj.URI;
            }
            import.CorpusPath = corpusPath;
            import.Moniker = obj.Moniker;

            return import;
        }

        public static Import ToData(CdmImport instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new Import {
                Moniker = string.IsNullOrEmpty(instance.Moniker) ? null: instance.Moniker,
                CorpusPath = instance.CorpusPath
            };
        }
    }
}
