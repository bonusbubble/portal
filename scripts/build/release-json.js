const path = require("path");

const {
    readJSONFileSync,
    writeJSONFileSync
} = require("../../src/util");


function main() {
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
