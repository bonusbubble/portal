const { homedir } = require("os");

function identitiesdir() {
    return `${homedir()}/.portal/identities`;
}

function getIdentityFilePath(username) {
    return `${identitiesdir()}/${username}.json`;
}

module.exports = {
    identitiesdir,
    getIdentityFilePath
};
