"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
const NewLineRegex = /\r?\n/u;
const CommentRegex = /^\s*\/\//u;
const WhitespaceRegex = /^\s*$/u;
(async function build() {
    let response = await fetch("https://publicsuffix.org/list/public_suffix_list.dat");
    const content = await response.text();
    if (content.length < 200000) {
        throw new Error("invalid content length");
    }
    let publicList = parseContent(extractContent({
        content,
        start: "// ===BEGIN ICANN DOMAINS===",
        end: "// ===END ICANN DOMAINS==="
    }));
    let privateList = parseContent(extractContent({
        content,
        start: "// ===BEGIN PRIVATE DOMAINS===",
        end: "// ===END PRIVATE DOMAINS==="
    }));
    await Promise.all([
        fs.writeFile(`${__dirname}/../src/lib/publicList.json`, publicList),
        fs.writeFile(`${__dirname}/../src/lib/privateList.json`, privateList)
    ]);
})();
function extractContent(params) {
    let { start, end, content } = params, startIndex = content.indexOf(start), endIndex = content.indexOf(end);
    if (startIndex === -1 || endIndex == -1) {
        throw new Error(`failed to find start end indexes in list`);
    }
    return content.slice(startIndex, endIndex);
}
function parseContent(content) {
    let lines = content.split(NewLineRegex);
    let dto = {};
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (CommentRegex.test(line) || WhitespaceRegex.test(line)) {
            continue;
        }
        let host = new URL(`http://${line}`).hostname;
        let hostParts = host.split(".").reverse();
        let root = dto;
        for (let j = 0; j < hostParts.length; j++) {
            let part = hostParts[j];
            if (!root[part]) {
                root[part] = {};
            }
            root = root[part];
        }
    }
    let output = JSON.stringify(dto).replace(new RegExp("\{\}", "gm"), "1");
    return output;
}
//# sourceMappingURL=build.js.map