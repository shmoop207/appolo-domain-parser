"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDomain = void 0;
const parseResultType_1 = require("./common/enums/parseResultType");
const reserved_1 = require("./common/const/reserved");
function parseDomain(params) {
    let { host, icannOnly } = params;
    if (!host || typeof host != "string") {
        return prepareResult({ host, type: parseResultType_1.ParseResultType.Invalid });
    }
    host = host.trim().toLowerCase();
    let labels = host.split(".");
    if (host === "" || reserved_1.ReservedTopLevelDomains.includes(labels[labels.length - 1])) {
        return prepareResult({
            host,
            type: parseResultType_1.ParseResultType.Reserved,
            labels,
            domainResult: { tld: labels[labels.length - 1] }
        });
    }
    let publicTld = findTld(labels, require('./lib/publicList.json')), privateTld = !icannOnly ? findTld(labels, require('./lib/privateList.json')) : [];
    if (privateTld.length == 0 && publicTld.length == 0) {
        return prepareResult({ host, type: parseResultType_1.ParseResultType.NotListed, labels });
    }
    let domainIndex = labels.length - Math.max(privateTld.length, publicTld.length) - 1;
    let domainResult = prepareDomains(labels, domainIndex);
    return prepareResult({ host, type: parseResultType_1.ParseResultType.Listed, labels, domainResult });
}
exports.parseDomain = parseDomain;
function prepareResult(params) {
    let { type, host, labels, domainResult = {} } = params;
    let dto = {
        hostname: host,
        labels: labels || [],
        type: type,
        subDomain: domainResult.subDomain || "",
        domain: domainResult.domain || "",
        sld: domainResult.sld || "",
        tld: domainResult.tld || "",
    };
    return dto;
}
function findTld(labels, list) {
    let root = list, tld = [];
    for (let i = labels.length - 1; i >= 0; i--) {
        let part = labels[i], listPart = root[part];
        if (!listPart) {
            return tld;
        }
        tld.unshift(part);
        if (listPart == 1) {
            return tld;
        }
        root = listPart;
    }
    return tld;
}
function prepareDomains(labels, index) {
    let dto = {
        subDomain: labels.slice(0, Math.max(0, index)).join(".") || "",
        sld: labels[index] || "",
        tld: labels.slice(index + 1).join(".") || "",
    };
    if (dto.sld == "www") {
        dto.subDomain = dto.sld;
        let parts = dto.tld.split(".");
        dto.sld = parts[0];
        dto.tld = parts.slice(1).join(".");
    }
    dto.domain = dto.sld ? `${dto.sld}.${dto.tld}` : dto.tld;
    return dto;
}
//# sourceMappingURL=parseDomain.js.map