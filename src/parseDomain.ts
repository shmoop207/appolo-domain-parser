import {
    IParseDomainResult,
    IParseResultDomains
} from "./common/interfaces/IParseDomainReault";
import {ParseResultType} from "./common/enums/parseResultType";
import {ReservedTopLevelDomains} from "./common/const/reserved";


export function parseDomain(params: { host: string, icannOnly?: boolean }): IParseDomainResult {
    let {host, icannOnly} = params;

    if (!host || typeof host != "string") {
        return prepareResult({host, type: ParseResultType.Invalid})
    }

    host = host.trim().toLowerCase();
    let labels = host.split(".");

    if (host === "" || ReservedTopLevelDomains.includes(labels[labels.length - 1])) {
        return prepareResult({host, type: ParseResultType.Reserved, labels,domainResult:{tld:labels[labels.length - 1]}})
    }

    let publicTld = findTld(labels, require('./lib/publicList.json')),
        privateTld = !icannOnly ? findTld(labels, require('./lib/privateList.json')) : [];

    if (privateTld.length == 0 && publicTld.length == 0) {
        return prepareResult({host, type: ParseResultType.NotListed, labels})
    }

    let domainIndex = labels.length - Math.max(privateTld.length, publicTld.length) - 1;

    let domainResult = prepareDomains(labels, domainIndex);

    return prepareResult({host, type: ParseResultType.Listed, labels, domainResult})
}

function prepareResult(params: { type: ParseResultType, domainResult?: Partial<IParseResultDomains>, host: string, labels?: string[] }): IParseDomainResult {

    let {type, host, labels, domainResult = {}} = params;

    let domainsDto: Partial<IParseResultDomains> = {
        subDomain: domainResult.subDomain || "",
        domain: domainResult.domain || "",
        sld: domainResult.sld || "",
        tld: domainResult.tld || "",
    }

    let dto: IParseDomainResult = {
        hostname: host,
        labels: labels || [],
        type: type,
        ...(domainsDto as IParseResultDomains),
    }

    return dto
}

function findTld(labels: string[], list: { [index: string]: any }): string[] {
    let root = list, tld: string[] = [];
    for (let i = labels.length - 1; i >= 0; i--) {
        let part = labels[i],
            listPart = root[part];

        if (!listPart) {
            return tld;
        }

        tld.unshift(part);

        if (listPart == 1) {
            return tld
        }

        root = listPart;
    }

    return tld
}

function prepareDomains(labels: string[], index: number): IParseResultDomains {
    let dto = <IParseResultDomains>{
        subDomain: labels.slice(0, Math.max(0, index)).join(".") || "",
        sld: labels[index] || "",
        tld: labels.slice(index + 1).join(".") || "",
    };

    dto.domain = `${dto.sld}.${dto.tld}`

    return dto
}