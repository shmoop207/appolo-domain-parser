"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const parseResultType_1 = require("../src/common/enums/parseResultType");
let should = require('chai').should();
chai.use(sinonChai);
describe("Parse domain", function () {
    it("Should get valid result", () => {
        (0, index_1.parseDomain)({ host: "aaa.github.io" }).should.be.deep.eq({
            "hostname": "aaa.github.io",
            "labels": ["aaa", "github", "io"],
            "type": "LISTED",
            "sld": "aaa",
            "subDomain": "",
            "tld": "github.io",
            "domain": "aaa.github.io",
        });
    });
    it("Should get listed public", () => {
        (0, index_1.parseDomain)({ host: "www.example.com" }).should.be.deep.eq({
            "sld": "example",
            "domain": "example.com",
            "hostname": "www.example.com",
            "labels": ["www", "example", "com",],
            "subDomain": "www",
            "tld": "com",
            "type": "LISTED"
        });
    });
    it("Should get listed public nested", () => {
        (0, index_1.parseDomain)({ host: "www.example.co.uk" }).should.be.deep.contain({
            "sld": "example",
            "tld": "co.uk",
            "subDomain": "www"
        });
        (0, index_1.parseDomain)({ host: "www.example.co" }).should.be.deep.contain({
            "sld": "example",
            "tld": "co",
            "subDomain": "www"
        });
        (0, index_1.parseDomain)({ host: "www.example.com.co" }).should.be.deep.contain({
            "sld": "example",
            "tld": "com.co",
            "subDomain": "www"
        });
    });
    it("Should get listed icann only", () => {
        (0, index_1.parseDomain)({ host: "www.example.cloudfront.net" }).should.be.deep.contain({
            "sld": "example",
            "tld": "cloudfront.net",
            "subDomain": "www"
        });
        (0, index_1.parseDomain)({ host: "www.example.cloudfront.net", icannOnly: true }).should.be.deep.contain({
            "sld": "cloudfront",
            "tld": "net",
            "subDomain": "www.example"
        });
    });
    it("Should get listed variations of common domains", () => {
        (0, index_1.parseDomain)({ host: "www.example.com" }).should.be.deep.contain({
            "sld": "example",
            "tld": "com",
            "subDomain": "www"
        });
        (0, index_1.parseDomain)({ host: "example.com" }).should.be.deep.contain({
            "sld": "example",
            "tld": "com",
            "subDomain": ""
        });
        (0, index_1.parseDomain)({ host: "com" }).should.be.deep.contain({
            "sld": "",
            "tld": "com",
            "subDomain": ""
        });
        (0, index_1.parseDomain)({ host: "com.co" }).should.be.deep.contain({
            "sld": "",
            "tld": "com.co",
            "subDomain": ""
        });
        (0, index_1.parseDomain)({ host: "www.some.local" }).should.be.deep.contain({
            "sld": "",
            "tld": "local",
            "subDomain": "",
            type: parseResultType_1.ParseResultType.Reserved
        });
        (0, index_1.parseDomain)({ host: "www.some.bbbb" }).should.be.deep.contain({
            "sld": "",
            "tld": "",
            "subDomain": "",
            type: parseResultType_1.ParseResultType.NotListed
        });
        (0, index_1.parseDomain)({ host: "a.b.c.d.foo.com" }).should.be.deep.contain({
            "sld": "foo",
            "tld": "com",
            "subDomain": "a.b.c.d",
            "domain": "foo.com",
            type: parseResultType_1.ParseResultType.Listed
        });
        (0, index_1.parseDomain)({ host: "data.gov.uk" }).should.be.deep.contain({
            "sld": "data",
            "tld": "gov.uk",
            "subDomain": "",
            "domain": "data.gov.uk",
            type: parseResultType_1.ParseResultType.Listed
        });
        (0, index_1.parseDomain)({ host: "foo.blogspot.co.uk" }).should.be.deep.contain({
            "sld": "foo",
            "tld": "blogspot.co.uk",
            "subDomain": "",
            "domain": "foo.blogspot.co.uk",
            type: parseResultType_1.ParseResultType.Listed
        });
        (0, index_1.parseDomain)({ host: "localhost" }).should.be.deep.contain({
            "sld": "",
            "tld": "localhost",
            "subDomain": "",
            "domain": ""
        });
    });
    it("Should remove www", () => {
        (0, index_1.parseDomain)({ host: "www.altoadige.it" }).should.be.deep.contain({
            "sld": "altoadige",
            "tld": "it",
            "subDomain": "www",
            "domain": "altoadige.it"
        });
        (0, index_1.parseDomain)({ host: "altoadige.it" }).should.be.deep.contain({
            "sld": "",
            "tld": "altoadige.it",
            "subDomain": "",
            "domain": "altoadige.it"
        });
    });
});
//# sourceMappingURL=spec.js.map