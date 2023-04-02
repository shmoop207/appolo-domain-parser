"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseResultType = void 0;
var ParseResultType;
(function (ParseResultType) {
    /**
     * This parse result is returned in case the given hostname does not adhere to [RFC 1034](https://tools.ietf.org/html/rfc1034).
     */
    ParseResultType["Invalid"] = "INVALID";
    /**
     * This parse result is returned if the given hostname was an IPv4 or IPv6.
     */
    ParseResultType["Ip"] = "IP";
    /**
     * This parse result is returned when the given hostname
     * - is the root domain (the empty string `""`)
     * - belongs to the top-level domain `localhost`, `local`, `example`, `invalid` or `test`
     */
    ParseResultType["Reserved"] = "RESERVED";
    /**
     * This parse result is returned when the given hostname is valid and does not belong to a reserved top-level domain, but is not listed in the public suffix list.
     */
    ParseResultType["NotListed"] = "NOT_LISTED";
    /**
     * This parse result is returned when the given hostname belongs to a top-level domain that is listed in the public suffix list.
     */
    ParseResultType["Listed"] = "LISTED";
})(ParseResultType = exports.ParseResultType || (exports.ParseResultType = {}));
//# sourceMappingURL=parseResultType.js.map