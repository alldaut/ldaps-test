const LdapClient = require('ldapjs-client');
const fs = require('fs');

const url = process.env.AD_CURL;
const adUser = process.env.AD_USER;
const adUPwd = process.env.AD_PASS;
const adBase = process.env.AD_BASE;
const adCert = process.env.AD_CERT;
const adCertKey = process.env.AD_CERT_KEY;
const adCertCA = process.env.AD_CERT_CA;
const tlsType = process.env.AD_TLS_TYPE;

function getClient() {
    if (tlsType === '1') {
        tlsOptions = {
            cert: fs.readFileSync(adCert),
            key: fs.readFileSync(adCertKey)
        }
    } else if (tlsType === '2') {
        tlsOptions = {
            ca: [fs.readFileSync(adCertCA)]
        }
    } else if (tlsType === '3') {
        tlsOptions = {
            cert: fs.readFileSync(adCert),
            key: fs.readFileSync(adCertKey),
            checkServerIdentity: () => {
                return null;
            },
        }
    } else if (tlsType === '4') {
        tlsOptions = {
            rejectUnauthorized: true,
            ca: [fs.readFileSync(adCertCA)]
        }
    } else if (tlsType === '5') {
        tlsOptions = {
            checkServerIdentity: () => {
                return null;
            },
            ca: [fs.readFileSync(adCertCA)]
        }
    } else if (tlsType === '6') {
        tlsOptions = {
            requestCert: true,
            rejectUnauthorized: true,
            cert: fs.readFileSync(adCert),
            key: fs.readFileSync(adCertKey),
        }
    } else if (tlsType === '7') {
        tlsOptions = {
            cert: fs.readFileSync(adCert),
            key: fs.readFileSync(adCertKey),
            ca: [fs.readFileSync(adCertCA)],
            checkServerIdentity: () => {
                return null;
            },
        }
    } else if (tlsType === '0') {
        tlsOptions = {}
    }
    console.log('tlsOptions', tlsOptions)
    return new LdapClient({url, timeout: 1000, tlsOptions});
}

async function bindAd(connection, dn = adUser, pwd, group) {
    pwd = (dn === adUser) ? adUPwd : pwd;
    if (dn !== adUser) {
        dn = `cn=${dn}, o=${group}, ${adBase}`
    }
    const client = connection || getClient();
    try {
        await client.bind(dn, pwd);
        return true
    } finally {
        if (!connection) client.destroy();
    }
}

module.exports = {getClient, bindAd}