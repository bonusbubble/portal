const { randomBytes } = require('crypto');
const { mkdirSync, readFileSync } = require('fs');
const { mkdir, readFile, rm, writeFile } = require('fs/promises');
const { getIdentityFilePath, identitiesdir } = require('./utils.js');

class PortalIdentity {
    static #identitiesdir

    static get identitiesdir() {
        if (this.#identitiesdir) return this.#identitiesdir;

        return this.#identitiesdir = identitiesdir();
    }

    constructor(opts) {
        if (typeof opts !== 'object') {
            opts = {};
        }

        this._publicKey =
            typeof opts.publicKey === 'object' &&
                opts.publicKey instanceof Buffer ?
            opts.publicKey :
            randomBytes(32);

        this._privateKey =
            typeof opts.privateKey === 'object' &&
                opts.privateKey instanceof Buffer ?
            opts.privateKey :
            randomBytes(64);
    }

    get keys() {
        return {
            secretKey: this._privateKey,
            publicKey: this._publicKey
        };
    }

    get json() {
        return {
            secretKey: this._privateKey.toString('hex'),
            publicKey: this._publicKey.toString('hex')
        };
    }

    get privateKey() {
        return this._privateKey;
    }

    get publicKey() {
        return this._publicKey;
    }

    async save(username, password) {
        // TODO: Hash the password.
        // TODO: Use the password hash to encrypt the data.
        // Determine the path of the identity JSON file.
        const identityFilePath = getIdentityFilePath(username);

        await mkdir(
            PortalIdentity.identitiesdir,
            {
                recursive: true
            }
        );

        await this.writeFile(identityFilePath);
    }

    saveSync(username, password) {
        // TODO: Hash the password.
        // TODO: Use the password hash to encrypt the data.
        // Determine the path of the identity JSON file.
        const identityFilePath = getIdentityFilePath(username);

            mkdirSync(
                PortalIdentity.identitiesdir,
                {
                    recursive: true
                }
            );

        this.writeFileSync(identityFilePath);
    }

    stringify() {
        return PortalIdentity.stringify(this);
    }

    async writeFile(path, cryptoKey='', algorithm='utf8') {
        // TODO: Add a switch statement to handle algorithms and encodings.
        const jsonString = this.stringify();

        await writeFile(path, jsonString, 'utf8');

        return PortalIdentity.parse(jsonString);
    }

    writeFileSync(path, cryptoKey='', algorithm='utf8') {
        // TODO: Add a switch statement to handle algorithms and encodings.
        const jsonString = this.stringify();

        writeFileSync(path, jsonString, 'utf8');

        return PortalIdentity.parse(jsonString);
    }

    static async create() {
        let privateKey = null;
        let publicKey = null;

        randomBytes(
            64,
            (error, buffer) => {
                if (error) throw error;

                privateKey = buffer.toString('hex');
            }
        );

        randomBytes(
            32,
            (error, buffer) => {
                if (error) throw error;

                publicKey = buffer.toString('hex');
            }
        );

        const identityJSON = {
            privateKey,
            publicKey
        };

        return PortalIdentity.fromJSON(identityJSON);
    }

    static createSync() {
        return new PortalIdentity();
    }

    static async delete(username='default') {
        // Determine the path of the identity JSON file.
        const identityFilePath = getIdentityFilePath(username);

        return await rm(identityFilePath);
    }

    static fromJSON(json) {
        let privateKey = null;
        let publicKey = null;

        // Private key
        if (json.hasOwnProperty('secretKey')) {
            privateKey =
                Buffer.from(
                    json.secretKey,
                    'hex'
                );
        }
        else if (json.hasOwnProperty('privateKey')) {
            privateKey =
                Buffer.from(
                    json.privateKey,
                    'hex'
                );
        }

        // Public key
        if (json.hasOwnProperty('publicKey')) {
            publicKey =
                Buffer.from(
                    json.publicKey,
                    'hex'
                );
        }

        return new PortalIdentity(
            {
                privateKey,
                publicKey
            }
        );
    }

    static parse(jsonString) {
        const json = JSON.parse(jsonString);

        return PortalIdentity.fromJSON(json);
    }

    static async readFile(path, cryptoKey='', algorithm='utf8') {
        // TODO: Add a switch statement to handle algorithms and encodings.
        const jsonString =
            await readFile(
                path,
                'utf8'
            );

        return PortalIdentity.parse(jsonString);
    }

    static readFileSync(path, cryptoKey='', algorithm='utf8') {
        // TODO: Add a switch statement to handle algorithms and encodings.
        const jsonString =
            readFileSync(
                path,
                'utf8'
            );

        return PortalIdentity.parse(jsonString);
    }

    static async load(username, password) {
        // Determine the path of the identity JSON file.
        const identityFilePath = getIdentityFilePath(username);

        return await PortalIdentity.readFile(
            identityFilePath,
            'utf8'
        );
    }

    static loadSync(username, password) {
        // Determine the path of the identity JSON file.
        const identityFilePath = getIdentityFilePath(username);

        return PortalIdentity.readFileSync(
            identityFilePath,
            'utf8'
        );
    }

    static stringify(identity) {
        return JSON.stringify(identity.json);
    }
}

module.exports = {
    PortalIdentity
};
