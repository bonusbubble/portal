const fs = require("fs");
const path = require("path");

const {
    readJSONFileSync,
    writeJSONFileSync
} = require("../../src/util");

const DIST_DIR = path.join(__dirname, "..", "..", "dist");

function main() {
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR);
    }

    const packageJSONPath = "package.json";

    const {
        name,
        description,
        version
    } = readJSONFileSync(
        packageJSONPath
    );

    const packageJSON = {
        name,
        version,
        description
    };

    writeJSONFileSync(
        packageJSONPath.replace(
            "package.json",
            path.join(
                "dist",
                "release.json"
            )
        ),
        packageJSON
    );
}


main();
