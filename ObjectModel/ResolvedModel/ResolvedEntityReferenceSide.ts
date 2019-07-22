import { ICdmEntityDef, ResolvedAttribute, ResolvedAttributeSetBuilder, resolveOptions, spewCatcher } from '../internal';

export class ResolvedEntityReferenceSide {
    public entity: ICdmEntityDef;
    public rasb: ResolvedAttributeSetBuilder;

    constructor(entity?: ICdmEntityDef, rasb?: ResolvedAttributeSetBuilder) {
        // let bodyCode = () =>
        {
            if (entity) {
                this.entity = entity;
            }
            if (rasb) {
                this.rasb = rasb;
            } else {
                this.rasb = new ResolvedAttributeSetBuilder();
            }
        }
        // return p.measure(bodyCode);
    }
    public getFirstAttribute(): ResolvedAttribute {
        // let bodyCode = () =>
        {
            if (this.rasb && this.rasb.ras && this.rasb.ras.set && this.rasb.ras.set.length) {
                return this.rasb.ras.set[0];
            }
        }
        // return p.measure(bodyCode);
    }
    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            to.spewLine(`${indent} ent=${this.entity.getName()}`);
            if (this.rasb && this.rasb.ras) {
                this.rasb.ras.spew(resOpt, to, `${indent}  atts:`, nameSort);
            }
        }
        // return p.measure(bodyCode);
    }

}
