const {
    readFileSync,
    writeFileSync
} = require("fs");


function readJSONFileSync (
    filePath
) {
    return JSON.parse(
        readFileSync(
            filePath,
            "utf-8"
        )
    );
}


function writeJSONFileSync (
    filePath,
    value
) {
    writeFileSync(
        filePath,
        JSON.stringify(
            value,
            null,
            2
        ) + "\n",
        "utf-8"
    );
}


module.exports = {
    readJSONFileSync,
    writeJSONFileSync
};
