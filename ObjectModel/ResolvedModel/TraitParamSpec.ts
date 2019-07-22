export interface TraitParamSpec {
    traitBaseName: string;
    params: {
        paramName: string;
        paramValue: string;
    }[];
}

export type TraitSpec = (string | TraitParamSpec);
