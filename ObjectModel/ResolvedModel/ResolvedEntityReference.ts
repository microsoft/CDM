import { ResolvedEntityReferenceSide, resolveOptions, spewCatcher } from '../internal';

export class ResolvedEntityReference {
    public referencing: ResolvedEntityReferenceSide;
    public referenced: ResolvedEntityReferenceSide[];

    constructor() {
        // let bodyCode = () =>
        {
            this.referencing = new ResolvedEntityReferenceSide();
            this.referenced = [];
        }
        // return p.measure(bodyCode);
    }
    public copy(): ResolvedEntityReference {
        // let bodyCode = () =>
        {
            const result: ResolvedEntityReference = new ResolvedEntityReference();
            result.referencing.entity = this.referencing.entity;
            result.referencing.rasb = this.referencing.rasb;
            this.referenced.forEach((rers: ResolvedEntityReferenceSide)  => {
                result.referenced.push(new ResolvedEntityReferenceSide(rers.entity, rers.rasb));
            });

            return result;
        }
        // return p.measure(bodyCode);
    }

    public spew(resOpt: resolveOptions, to: spewCatcher, indent: string, nameSort: boolean): void {
        // let bodyCode = () =>
        {
            this.referencing.spew(resOpt, to, `${indent}(referencing)`, nameSort);
            let list: ResolvedEntityReferenceSide[] = this.referenced;
            if (nameSort) {
                list = list.sort((l: ResolvedEntityReferenceSide, r: ResolvedEntityReferenceSide) => l.entity.getName()
                    .localeCompare(r.entity.getName()));
            }
            for (let i: number = 0; i < this.referenced.length; i++) {
                list[i].spew(resOpt, to, `${indent}(referenced[${i}])`, nameSort);
            }
        }
        // return p.measure(bodyCode);
    }

}
