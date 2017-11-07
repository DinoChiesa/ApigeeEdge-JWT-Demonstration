# Example tools for JWT Demonstrations

This directory contains an example tools for the command-line. They can be used for creating JWT, or for verifying JWT.
The tools are implemented in nodejs, and require node to be installed on the workstation, in order to run them. 

## To use

1. `npm install`

2. `node ./create-token.js -A RS256 -s subject -i issuer -a audience`

3. `node ./verify-token.js -t token -A RS256`


## Example

```
$ node ../tools/verify-token.js -t eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJBYmJhRGFiYmEiLCJhdWQiOiJBMjk4MjkyOTIiLCJpc3MiOiJ1cm46Ly9hcGlnZWUtZWRnZS1KV1QtcG9saWN5LWRlbW9uc3RyYXRpb24iLCJleHAiOjE1MTAwMjg3MTEsImlhdCI6MTUxMDAyNTExMSwianRpIjoiY2M2NzAzZmItN2M4Yy00YmNhLWFmNTMtNjdmYzcxOGUxNTdkIn0.bnSLyzdQqJn5fHbjFyd4iNPX1q5TIZ5MwmeM7PHzVrwW-yShbx5IG81Lx0j6Pn_6qz4bSqLUJPuzEPNikKVeYV0zlUA3TO5_z412rzo0JkYmQ48l5SCgrPzDXLg6JsUv6FBfupGPnyrtMJT0DhnQXO4m_tkwG2lR_zJGMkI7G-rIOGEHD-RGNQ6Fzoat8V-xJiVQG07vp691UQOyDkq737mWDg_b4Sm_8ZdihR1aI0TfSWFvyi-66IOc00-FmZzOgEyhZBTTIQz4V4WEeaX2_YdnOCO_KvBgZUFNYcp94TcJW1PkBwJcWiAolJexd6PtnTVOnRhoDgmjedhAMrVU_w -A RS256 -s AbbaDabba -C jti:cc6703fb-7c8c-4bca-af53-67fc718e157d -C iss:urn://apigee-edge-JWT-policy-demonstration -a A29829292
Example JWT verifier tool, version: 20171106-1714
Node.js v7.7.1

decoded:
{
  "sub": "AbbaDabba",
  "aud": "A29829292",
  "iss": "urn://apigee-edge-JWT-policy-demonstration",
  "exp": 1510028711,
  "iat": 1510025111,
  "jti": "cc6703fb-7c8c-4bca-af53-67fc718e157d"
}

```

## License

This material is copyright 2017 Google Inc.
and is licensed under the [Apache 2.0 License](LICENSE).

