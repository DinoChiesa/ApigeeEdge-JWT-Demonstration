# Code supporting the JWT Demonstrations

This repository contains code and configuration supporting the demonstrations of the JWT
policies in Apigee Edge. JSON Web Token, aka JWT, is defined in [IETF RFC
7519](https://tools.ietf.org/html/rfc7519). JWT is a compact, URL-safe format for
representing *claims* to be transferred between cooperating parties.  Apigee Edge
includes policies that generate and verify JWT issued by arbitrary parties.

## Disclaimer

The code in this repo is not an official Google product, nor is it part of an
official Google product. It's a demonstration of the JWT policies in the Apigee
Edge product.

## There's a Screencast

Check the [screencast](https://youtu.be/Ijm7iyDOVFY) accompanying this example code.

[![Screenshot](./images/screenshot-20180316-103908.png)](https://youtu.be/Ijm7iyDOVFY)

## Usefulness of JWT

JWT are used to encapsulate claims about a person or system in a standard way, so that
the claims can be transmitted to a cooperating system that can verify and rely on those claims.

A common example would be an identity provider - that is, a system that can authenticate
users. When a user provides the correct authentication, the identity provider may issue
a signed JWT, which includes statements about the user. If the signature uses an RSA
private key, this JWT can then be verified by any other system that has access to the
public key of the IdP. If the signature uses an HMAC signature, this JWT can then be
verified by any other system that has access to the shared secret key.

Let's call the system that examines and verifies a JWT, a "relying party". If the
relying party trusts the identity provider - in other words trusts that the public key
belongs to the IdP, or that the secret key has not been compromised - then the RP can
rely on the claims about the user, contained within the JWT. The RP can then make
decisions based on the value of those claims - decisions regarding authorization, request
routing, and so on.

## JWT One Level Deeper

"A claim" is nothing more than an asserted statement. For example, "the sky is
clear" is a claim. A JWT wraps up a set of one or more claims, with a digital
signature, a unique hash of the payload that can be used to verify that the
payload (the set of claims) has not changed since they were initially issued.

In JWT, there are some "standard" claim names with well-known meanings. The system or
participant that creates the JWT is called the _issuer_ (iss). JWT _can_ include an
assertion about the intended reader of the JWT, via the _audience_ claim (aud).  The
JWT specification also provides a way to designate the valid times for a token - the
issued-at time (iat), the not-before time (nbf), and the expiry time (exp). The times
are all expressed in seconds-since-epoch.

Typically, JWT are issued about a person or system, known as "the subject"
(sub). Accordingly, claims are most often about systems or people, rather than the
weather. For example, a typical claim as stated in English might be "the userid is
012345".

All the "standard claims" such as sub, aud, exp, as well as custom claims like "userid"
are optional. Each system that generates JWT can choose which claims to include; each
system that verifies JWT can include logic to check for specific values for specific
claims.

## The Construction of a JWT

> If you are building a JWT library that creates or manipulates JWT, you might want to
> know how JWT are constructed. If you simply want to use JWT, you don't need to know, but
> this information may be interesting for you anyway.

The signing base for the JWT consists of the base64-encoded version of the header,
followed by a dot, followed by the base64-encoded version of the payload.
`base64(header).base64(payload)`.

The JWT "header" is a JSON hash, which typically indicates some basic information such
as the algorithm used for signing. For example:

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

Each of those - the header and payload - must be serialized in compact form (no
newlines, no extra spaces), then UTF8 and base64-encoded. The dot-concatenation of those
two pieces forms the signing base for the JWT.

The creator of a JWT computes the digital signature of the signing base, and then
base64-encodes it, then dot-concatenates the signing base with _that_ . The result is
the JWT.  `base64(header).base64(payload).base64(signature)`.


This is what an actual JWT looks like:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1MTAwMjAzMDAsImlhdCI6MTUxMDAyMDMwMCwic3ViIjoiU3ViamVjdCIsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIiwiZXhwIjoxNTEwMDIzOTAwLCJjdXN0b21DbGFpbTEiOiJ2YWx1ZTEifQ.akW3MHTRAnWIPdrD14XYcQKFxDqQ7ztqqS1iLUZfQcQJusi805JhlhBmYZ7axQn2DFBvRsk-i_aCwBDiCzOHGIxufyreMUi7dlkVX6aby8shOIG1jwozes9xGR0pe7ekMD7a39FHKntIXfZEZXE0fxFTIjeG0F7Ui8gL8v8pMIX_SRmK6uEPv0gUStQI-x1nJQM7EtOPs4ZnnlA1hA7HAMEZjkv64yZqbEKXC3d_BFEV3-XhlQR8YG6kJyKoPsgxWMN1JeEUn7fn0YM4V0B8bTepVPUYSViqzz6C5vPvDrk0-PiqGGIry9XrxTXTgNvToL8cOFp2c4ZHyONZqsIk8Q
```

In the above, the header is:
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
```

The payload is:
```
eyJuYmYiOjE1MTAwMjAzMDAsImlhdCI6MTUxMDAyMDMwMCwic3ViIjoiU3ViamVjdCIsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIiwiZXhwIjoxNTEwMDIzOTAwLCJjdXN0b21DbGFpbTEiOiJ2YWx1ZTEifQ
```

If you base64-decode these things, you will get the JSON hashes shown above.

The signature is:
```
akW3MHTRAnWIPdrD14XYcQKFxDqQ7ztqqS1iLUZfQcQJusi805JhlhBmYZ7axQn2DFBvRsk-i_aCwBDiCzOHGIxufyreMUi7dlkVX6aby8shOIG1jwozes9xGR0pe7ekMD7a39FHKntIXfZEZXE0fxFTIjeG0F7Ui8gL8v8pMIX_SRmK6uEPv0gUStQI-x1nJQM7EtOPs4ZnnlA1hA7HAMEZjkv64yZqbEKXC3d_BFEV3-XhlQR8YG6kJyKoPsgxWMN1JeEUn7fn0YM4V0B8bTepVPUYSViqzz6C5vPvDrk0-PiqGGIry9XrxTXTgNvToL8cOFp2c4ZHyONZqsIk8Q
```

If you base64-decode _that_ you will get a byte stream, the digital signature. (Just a
set of bytes, it does not represent a string.) If you want to verify that digital
signature, you can use the [public key](./tools/keys) included in this repo.

There are a variety of libraries for various programming environments that can be used
to aid in creating or verifying JWT. [JWT.io](https://jwt.io) hosts a useful online form
that allows you to decode JWT interactively, and also lists a number of different
libraries.


## Verifying a JWT

Verification consists of verifying the digital signature, then evaluating the claims,
within the payload and header. If the signature is good, then each of the claims can be
trusted. It is up to the verifier to enforce expiry time, and the not-before time, and
to enforce any other required claims, such as issuer or audience.


## JWT within Apigee Edge

People configuring smart API proxies in [Apigee Edge](https://apigee.com) may want those
proxies to verify or generate JWT. For several years, people have been using [an
open-source Java callout](https://github.com/apigee/iloveapis2015-jwt-jwe-jws) for this
purpose. This works, but the callout was not supported as part of the Edge product by
Apigee.

In late 2017, Apigee added JWT policies into the Apigee Edge product to
enable these scenarios. Specifically, there are now policies in Apigee Edge that you can
use to generate or verify JWT using either HMAC or RSA signatures, in 256, 384, or
512-bit strength.  (HS256, HS384, HS512, RS256, RS384, RS512).

It is possible to use these Apigee Edge policies to:
- verify JWT that are generated by Apigee Edge, or by any identity provider (Google Sign-in, Salesforce.com, Ping, Azure AD, etc.)
- generate tokens that can be verified by Apigee Edge, or by third parties


## Contents of this Repo

* Two [API Proxy bundles](./proxy-bundles)
  - [jwt-verify](./proxy-bundles/verify) - an API Proxy bundle that verifies JWT
  - [jwt-generate](./proxy-bundles/generate) - an API Proxy bundle that generates JWT
* Various [helper tools](./tools)


## There are Helper Tools

There are several command-line tools in this repo that will aid in
importing and deploying API Proxies, and in generating or verifying JWT
from the command-line.  They're built with nodejs; To use them you will
need node (on MacOS, `brew install node`), and you will need the
pre-requisite libraries.  To get the latter, you must:

```
cd tools
npm install
cd ..
```

## Importing and Deploying the API Proxies

To use the API proxies, you will need to import and deploy them into an Apigee Edge organization and environment.
To do that you can use the [importAndDeploy.js](./tools/importAndDeploy.js) tool.

```
node ./tools/importAndDeploy -v -o ${ORG} -e ${ENV} -d ./proxy-bundles/jwt-verify
node ./tools/importAndDeploy -v -o ${ORG} -e ${ENV} -d ./proxy-bundles/jwt-verify-goog
node ./tools/importAndDeploy -v -o ${ORG} -e ${ENV} -d ./proxy-bundles/jwt-generate
```

Alternatively, you can "manually" zip up those directories and then use the Apigee Edge UI to import the proxy bundle.
The command-line tool is probably easier.

## Usign Apigee Edge to Verify a JWT

To use Apigee to verify an HS256 JWT, first create a JWT:

```
node tools/create-token.js  -A HS256 -a urn://Apigee -N -k Secret123

```

This creates an HS256-signed JWT. The secret key used for signing is `Secret123`.

Then verify it:
```
curl -i https://${ORG}-${ENV}.apigee.net/jwt-verify/hs256/1 -H "Authorization: Bearer ${JWT}"
```

The VerifyJWT policy used for this request is configured to use the same shared secret (hard coded).


To use Apigee to verify an RS256 JWT, first create the RS256-signed JWT:

```
node ./tools/create-token.js  -A RS256 -a urn://Apigee -N
```

The JWT will be printed on the console output. The private key used for signing is stored in the keys subdirectory.

Then verify it:
```
curl -i https://${ORG}-${ENV}.apigee.net/jwt-verify/rs256/1 -H "Authorization: Bearer ${JWT}"
```

The VerifyJWT policy used for *this* request is configured to use the public key corresponding to the private key
used by the `tools/create-token.js` script.


You can also try creating JWT with various other settings:

```
node ./tools/create-token.js -h
```

...and then send in the generated token to the same endpoint as above.


## Usign Apigee Edge to Verify a JWT generated by Google Signin

To get an ID Token from Google, you can use [this example signin
page](https://dinochiesa.github.io/openid-connect/goog-login.html).  Use
the form to build the link.  Click the link to kickoff the google signin
procedure. When it completes you will see a JWT. You can copy/paste that
into a command to verify that token , like this:

```
curl -i https://${ORG}-${ENV}.apigee.net/jwt-verify-goog/t1 -H "Authorization: Bearer ${JWT}"
```

The endpoint above is configured to use the public keys published by Google, that can be used to verify JWT generated by Google.


## Usign Apigee Edge to Generate a JWT

```
curl -i https://${ORG}-${ENV}.apigee.net/jwt-generate/rs256/1 -X POST -d 'subject=Subject&audience=A12345'
```

The GenerateJWT policy is configured to use  a self-generated private key. You should see as output, a JSON payload containing a JWT.


To verify the JWT, you can use this:

```
JWT=ey...that-large-string-from-the-output-of-the-above-command....9849473ndjfhfhjA
node ./tools/verify-token.js  -A RS256 -a A12345  -k tools/keys/public.pem  -t ${JWT}
```


## Note: The JWT Policies in Apigee Edge are Currently Beta

The JWT policies in Apigee Edge were first enabled in January 2018.
If you have JWT enabled, you will see the policies in the policy-chooser palette:
![JWT Policies in the Palette](./images/check-for-JWT-policies.gif "Policy Chooser")


If you don't see these policies, and you want to try them out, contact Apigee support.
If you have questions or comments on any of this, please post to [the Apigee community site](https://community.apigee.com).

## License

This material is Copyright 2017-2018 Google Inc.
and is licensed under the [Apache 2.0 License](LICENSE).

The demonstration code here is provided without warranty of any kind.