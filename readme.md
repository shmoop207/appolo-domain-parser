# Appolo Parse Domain

Domain parser from [Public Suffix List](https://publicsuffix.org )

## Installation

```typescript
npm i @appolo/parse-domain
```

## Usage

```typescript
import {parseDomain} from "@appolo/parse-domain";

let parsed = parseDomain("google.com")

console.log(parsed.tld); // 'com'
console.log(parsed.sld); // 'google'
console.log(parsed.domain); // 'google.com'
console.log(parsed.subdomain); // 'www'

```
