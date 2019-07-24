import * as cdm from "cdm.objectmodel"
import { ResolveOptions, DirectiveSet } from "./IExplorerEntity";
import { ExplorerDocument } from "./ExplorerDocument";

export class EntityApiUtils {
    public static convertOptions(resolutionOptions: ResolveOptions): cdm.types.resolveOptions {
        let directives = new cdm.types.TraitDirectiveSet();
        if (resolutionOptions.directives & DirectiveSet.ReferenceOnly)
            directives.add("referenceOnly");
        if (resolutionOptions.directives & DirectiveSet.Normalized)
            directives.add("normalized");
        if (resolutionOptions.directives & DirectiveSet.Structured)
            directives.add("structured");

        let resOpt: cdm.types.resolveOptions = { wrtDoc: (resolutionOptions.withRespectToDocument as ExplorerDocument).document, directives: directives };
        return resOpt;
    }
}