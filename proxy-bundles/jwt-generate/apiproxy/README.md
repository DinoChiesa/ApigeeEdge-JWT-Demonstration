# JWT Generation

This API proxy generates and signs a JWT. The token can then be verified by any other tool with the correct key, including  [the example tool](../../tools/verify-token.js) included here.

This proxy will work on the Apigee Edge public cloud release.

## Deploying

Several notes:

* use a tool like [apigeetool](https://github.com/apigee/apigeetool-node) or [pushapi](https://github.com/carloseberhardt/apiploy) or
[importAndDeploy.js](https://github.com/DinoChiesa/apigee-edge-js/blob/master/examples/importAndDeploy.js)
to deploy the proxy.

* the tool used to create a token requires nodejs.  You should [install node](https://nodejs.org/en/download/) before trying to run the examples. On OSX you may want to `brew install node`.

## Invoking

### To create a token using the RS256 algorithm

```
curl -i -X POST https://ORG-ENV.apigee.net/jwt-generate/t1  -d 'subject=Subject&audience=A12345'
```

You will see the JWT emitted in output. It will look like this:

```
HTTP/1.1 200 OK
Date: Tue, 07 Nov 2017 23:07:52 GMT
Content-Length: 631
Connection: keep-alive

{
  "status" : "ok",
  "jwt" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJTdWJqZWN0IiwiYXVkIjoiQTEyMzQ1IiwiaXNzIjoidXJuOi8vYXBpZ2VlLWVkZ2UtSldULXBvbGljeS1kZW1vbnN0cmF0aW9uIiwiZXhwIjoxNTEwMDk5NjcyLCJpYXQiOjE1MTAwOTYwNzIsImp0aSI6Ijg5YjIyMDk4LWNmYzItNDVlZS04ZjBiLWI0ZjgzYzc3YzVmOSJ9.QHsz4rveyqc7xhenTkzSU1I0TS7tN6d2NM0d6VP51o0d57fJZ3ujT_wXy43bTjeqXWa4IkI-Gg-1N0eMzfR_nCT3VoKALKJvMvhVAwELt4Ve41verOsJAejlP4UeCBjCNGPddQ2ob0OY4F_59avYy-n81XV0BYyfPuTXkWU9yLprQEat6qp8K8lFHEZ9RH31XlFTXO4AQMYsQOFn4TzPmsfNa3a4kR7pZykeQZO-FsKUJqEzbHcpbvkx6IWPr4hCAXUsTL6_c3oJjYonH-ITIrEswIGlkgTtmOrU72b2K5XFWZDOXUxGa9ctqc0dqeGyrrbrUfbdDrypq_2oXgJZEA"
}
```

This token is signed with RS256, using [the private key included in this repo](../../../tools/keys/private-pkcs8.pem). _This private key is included for demonstration purposes only_!

To verify the token, use this tool:

```
  jwt='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzd....GyrrbrUfbdDrypq_2oXgJZEA'
  node <path-to-repo>/tools/verify-token.js -t $jwt -A RS256
```

You will see happy output like this:

```
Example JWT verifier tool, version: 20171106-1714
Node.js v7.7.1

decoded:
{
  "sub": "Subject",
  "aud": "A12345",
  "iss": "urn://apigee-edge-JWT-policy-demonstration",
  "exp": 1510099672,
  "iat": 1510096072,
  "jti": "89b22098-cfc2-45ee-8f0b-b4f83c77c5f9"
}
```

The result will confirm that the JWT is valid.  This validation uses [the public
key](../../../tools/keys/public.pem) that corresponds to the private key referenced
above, to verify the signature.

If you would like to use your own key pair, then you can generate one. [Follow the
instructions here](../../../tools/keys/). If you generate a new keypair, you will need
to replace the private key used in the GenerateJWT policies, in order for verification to
succeed.


### To create a token using the HS256 algorithm

```
curl -i -X POST https://ORG-ENV.apigee.net/jwt-generate/t2  -d 'subject=Subject&audience=A12345'
```

The result:

```
HTTP/1.1 200 OK
Date: Tue, 07 Nov 2017 23:15:09 GMT
Content-Length: 332
Connection: keep-alive

{
  "status" : "ok",
  "jwt" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJTdWJqZWN0IiwiYXVkIjoiQTEyMzQ1IiwiaXNzIjoidXJuOi8vYXBpZ2VlLWVkZ2UtSldULXBvbGljeS1kZW1vbnN0cmF0aW9uIiwiZXhwIjoxNTEwMTAwMTA5LCJpYXQiOjE1MTAwOTY1MDksImp0aSI6ImFhMWU2ZjM1LTQzOWMtNGFlYi05MTdmLTcxNDUzZTQxNmVkMSJ9.u2E4lx1GZP5qA3MNMrWt0Ljro94UMGz_OF7eDtzmnQs"
}

```

This token is signed with HS256, using the secret passed on the command line.

To verify the token, use the builtin tool;

```
  jwt='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdW....Ljro94UMGz_OF7eDtzmnQs'
  node <path-to-repo>/tools/verify-token.js -t $jwt -A HS256 -k Secret1234
```

You once again should see success.

