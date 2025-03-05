const fs = require("fs");
const path = require("path");
const { readJSONFileSync } = require("../../src/util");

const BIN_SCRIPT_NAME = "portal.js";
const BIN_SCRIPT_PATH = path.join("bin", BIN_SCRIPT_NAME);
const DIST_BIN_SCRIPT_PATH = path.join("dist", BIN_SCRIPT_NAME);

function loadBinScript() {
    return fs.readFileSync(BIN_SCRIPT_PATH, "utf-8");
}

function saveBinScript(sourceCode) {
    fs.writeFileSync(DIST_BIN_SCRIPT_PATH, sourceCode, "utf-8");
}

async function main() {
    let sourceCode = loadBinScript();
    const packageJSON = readJSONFileSync("package.json");
    const packageJSONString = JSON.stringify({
        name: packageJSON.name,
        version: packageJSON.version,
        description: packageJSON.description,
        dependencies: packageJSON.dependencies
    });
    sourceCode = sourceCode.replaceAll("{$__PACKAGE_JSON__$}", packageJSONString);
    saveBinScript(sourceCode);
}

main();
