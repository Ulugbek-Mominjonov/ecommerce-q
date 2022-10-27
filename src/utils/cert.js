import da from "quasar/lang/da";

const API_KEYS = [
  'localhost', '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
  '127.0.0.1', 'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
  'billing.hududgaz.uz', '46B149D68D5095EB9BB7343D9B7B321D8A8D80735710DD434803CCA05CC1BDDCCDCFF7F911D878BCD025B9899E9FF635658B7045A5CE3A9453502C729C2FB9BC',
];
var NEW_API = false;


const cert = {
  checkVersion: function (success, fail) {
    CAPIWS.version(function (event, data) {
      if (data.success === true) {
        if (data.major && data.minor) {
          var installedVersion = parseInt(data.major) * 100 + parseInt(data.minor);
          NEW_API = installedVersion >= 336;
          success(data.major, data.minor);
        } else {
          fail(null, 'E-IMZO Version is undefined');
        }
      } else {
        fail(null, data.reason);
      }
    }, function (e) {
      fail(e, null);
    });
  },
  installApiKeys: function (success, fail) {
    CAPIWS.apikey(API_KEYS, function (event, data) {
      if (data.success) {
        success();
      } else {
        fail(null, data.reason);
      }
    }, function (e) {
      fail(e, null);
    });
  },

  getCerts(callback, error) {
    const vue = this;
    CAPIWS.callFunction({
        plugin: "pfx",
        name: "list_all_certificates"
      },
      function (event, data) {
        callback(event, data);
      },
      function (msg) {
        error(msg);
      }
    );
  },

  createPkcs7(callback, error, requestArr) {
    CAPIWS.callFunction({
        plugin: "pkcs7",
        name: "create_pkcs7",
        arguments: requestArr
      },
      function (event, data) {
        if (data.success) {
          callback(event, data)
        } else {
          if (data.className) {
            error('Failed to connect to E-Imzo')
          } else {
            error(data.reason)
          }
        }
      },
      function (msg) {
        error(msg)
      }
    )
  },

  verifyPassword(callback, error, pfxId) {
    CAPIWS.callFunction({
        plugin: "pfx",
        name: "verify_password",
        arguments: [pfxId]
      },
      function (event, data) {
        if (data.success) {

          callback(event, data)
        } else {

          if (data.className) {
            error('Пароль введен неверно')
          } else {
            error(data.reason)
          }
        }
      },
      function (msg) {
        console.log('verifyPassword.error', msg);
        error(msg)
      }
    )
  },

  /**
   * sData: biror bir lyuboy data
   */
  loadPKey(callback, error, certificate) {
    CAPIWS.callFunction({
        plugin: "pfx",
        name: "load_key",
        arguments: [
          certificate.disk,
          certificate.path,
          certificate.name,
          certificate.alias,
        ]
      },
      function (event, data) {
        if (data.success) {
          certificate.keys = {
            keyId: data.keyId,
            type: data.type
          }
          cert.verifyPassword(callback, error, data.keyId);
        } else {
          if (data.className) {
            error('Failed to connect to E-Imzo')
          } else {
            error(data.reason)
          }
        }
      },
      function (msg) {
        console.log('loadPKey.error', msg);
        error(msg)
      })
  },

};


export default cert;
