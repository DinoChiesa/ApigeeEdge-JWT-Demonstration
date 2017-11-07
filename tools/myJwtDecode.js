// myJwtDecode.js
// ------------------------------------------------------------------
//

function myJwtDecode(jwt) {
    var parts = jwt.split('.');
    function base64Decode(b64string) {
      return JSON.parse(Buffer.from(b64string, 'base64').toString('utf8'));
    }
    return { header: base64Decode(parts[0]), payload: base64Decode(parts[1]) };
}

module.exports = myJwtDecode;
