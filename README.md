# Code supporting the JWT Demonstrations

This repository contains code and configuration supporting the JWT demonstrations for
Apigee Edge. JWT is defined in [IETF RFC 7519](https://tools.ietf.org/html/rfc7519). It
is a compact, URL-safe format for representing *claims* to be transferred between
cooperating parties.

## Some Background

"A claim" is nothing more than an asserted statement. For example, "the sky is clear" is
a claim. A JWT wraps up a set of one or more claims, with a digital signature.

There are some "standard" claim names with well-known meanings.
The system or participant that creates the JWT is called "the issuer" (iss). JWT _can_
include an assertion about the intended reader of the JWT - via  "the
audience" claim (aud).  The JWT specification also provides a way to designate the valid times
for a token - the issued-at time (iat), the not-before time (nbf), and the expiry time
(exp). The times are all expressed in seconds-since-epoch.

Typically, JWT are issued about a person or system, known as "the subject"
(sub). Accordingly, claims are most often about systems or people, rather than the
weather. For example, a typical claim as stated in English might be "the userid is
012345".

All the "standard claims" such as sub, aud, exp, as well as custom claims like "userid"
are optional. Each system that generates JWT can stipulate which claims to include;
each system that verifies JWT can include logic to require specific values for specific claims.

## The Construction of a JWT

The signing base for the JWT consists of the base64-encoded version of the header, followed by a dot, followed by the base64-encoded version of the payload.
The form is `base64(header).base64(payload)`.

The JWT "header" is a hash, which typically indicates some basic information such as the algorithm used for signing. For example:

```json
{
    "alg": "RS256",
    "typ": "JWT"
}
```

The header may contain other claims, as well.

The payload is also represented as a JSON hash. For example:

```json
{
    "sub": "Subject",
    "iss": "Issuer",
    "aud": "Audience",
    "iat": 1510020300,
    "exp": 1510023900,
    "nbf": 1510020300,
    "customClaim1": "value1"
}
```


Each of those - the header and payload - must be serialized in compact form, then base64-encoded. The dot-concatenation of those two pieces forms the signing base for the JWT.

To create thw JWT, compute the digital signature of the signing base, and then base64-encode it. Then dot-concatenate that to the signing base. The result is the JWT.
The form is `base64(header).base64(payload).base64(signature)`.


This is what an actual JWT looks like:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1MTAwMjAzMDAsImlhdCI6MTUxMDAyMDMwMCwic3ViIjoiU3ViamVjdCIsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIiwiZXhwIjoxNTEwMDIzOTAwLCJjdXN0b21DbGFpbTEiOiJ2YWx1ZTEifQ.akW3MHTRAnWIPdrD14XYcQKFxDqQ7ztqqS1iLUZfQcQJusi805JhlhBmYZ7axQn2DFBvRsk-i_aCwBDiCzOHGIxufyreMUi7dlkVX6aby8shOIG1jwozes9xGR0pe7ekMD7a39FHKntIXfZEZXE0fxFTIjeG0F7Ui8gL8v8pMIX_SRmK6uEPv0gUStQI-x1nJQM7EtOPs4ZnnlA1hA7HAMEZjkv64yZqbEKXC3d_BFEV3-XhlQR8YG6kJyKoPsgxWMN1JeEUn7fn0YM4V0B8bTepVPUYSViqzz6C5vPvDrk0-PiqGGIry9XrxTXTgNvToL8cOFp2c4ZHyONZqsIk8Q
```
In the above, the header is:
`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9`

The payload is:
```
eyJuYmYiOjE1MTAwMjAzMDAsImlhdCI6MTUxMDAyMDMwMCwic3ViIjoiU3ViamVjdCIsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIiwiZXhwIjoxNTEwMDIzOTAwLCJjdXN0b21DbGFpbTEiOiJ2YWx1ZTEifQ
```

The signature is:
```
akW3MHTRAnWIPdrD14XYcQKFxDqQ7ztqqS1iLUZfQcQJusi805JhlhBmYZ7axQn2DFBvRsk-i_aCwBDiCzOHGIxufyreMUi7dlkVX6aby8shOIG1jwozes9xGR0pe7ekMD7a39FHKntIXfZEZXE0fxFTIjeG0F7Ui8gL8v8pMIX_SRmK6uEPv0gUStQI-x1nJQM7EtOPs4ZnnlA1hA7HAMEZjkv64yZqbEKXC3d_BFEV3-XhlQR8YG6kJyKoPsgxWMN1JeEUn7fn0YM4V0B8bTepVPUYSViqzz6C5vPvDrk0-PiqGGIry9XrxTXTgNvToL8cOFp2c4ZHyONZqsIk8Q
```



There are a variety of libraries for various programming environments that can be used to aid in creating or verifying JWT.

[JWT.io](https://jwt.io) hosts a useful online form that allows you to decode JWT interactively.

## Verifying a JWT

Verification consists of verifying the digital signature, then evaluating the claims,
within the payload and header. If the signature is good, then each of the claims can be
trusted. It is up to the verifier to enforce expiry time, and the not-before time, and
to enforce any other required claims, such as issuer or audience.


## Usefulness of JWT

JWT are useful for capturing claims about a person or system, and transmitting them in a
standard way, such that a cooperating system can verify and rely on those claims.

A common example would be an identity provider - that is, a system that can authenticate
users.  When a user provides the correct authentication, the identity provider may issue
a JWT, which includes statements about the user. This JWT can then be verified by any
other system that has access to the public key of the IdP. Let's call the system that
examines and verifies a JWT, a "relying party".  If the relying party trusts the
identity provider - in other words trusts that the public key belongs to the IdP - then
the RP can rely on the claims about the user, contained within the JWT. The RP can then
make decisions based on the value of those claims - decisions regarding authorization,
or routing, and so on.


## JWT within Apigee Edge

People configuring smart API proxies in Apigee Edge may want those proxies to verify or
generate JWT. In late 2017, Apigee added JWT policies into the Apigee Edge product to
enable these scenarios. Specifically, there are now policies in Apigee Edge that you can
use to generate or verify JWT using either Hmac or RSA signatures, in 256, 384, or
512-bit strength.  (HS256, HS384, HS512, RS256, RS384, RS512).

It is possible to use Apigee Edge policies to:
- verify JWT that are generated by Apigee Edge, or by external third parties (Azure AD, Google Sign-in, Salesforce.com, Ping, etc.)
- generate tokens that can be verified by Apigee Edge, or by third parties


## Contents of this Repo

* Two [API Proxy bundles](./proxy-bundles)
  - [jwt-verify](./proxy-bundles/verify) - an API Proxy bundle that verifies JWT
  - [jwt-generate](./proxy-bundles/generate) - an API Proxy bundle that generates JWT
* Various [helper tools](./tools)

To use the API proxies, you will need to import and deploy them into an Apigee Edge organization and environment. 


## License

This material is Copyright 2017 Google Inc.
and is licensed under the [Apache 2.0 License](LICENSE).

