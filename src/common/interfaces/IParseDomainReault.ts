import {ParseResultType} from "../enums/parseResultType";

export interface IParseResultDomains {

    subDomain: string;
    sld: string | undefined;
    tld: string;
    domain: string
}

export interface IParseDomainResult extends IParseResultDomains {
    labels: string[]
    type: ParseResultType
    hostname: string
}

