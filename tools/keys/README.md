# Sample Keys

The keys included here are for demonstration purposes only.
They will be used at runtime, by default, by the create-token and verify-token tools in the parent directory.
These keys are also embedded into the verify and generate API proxies .

## Creating a new Key Pair

To use openssl to create a keypair, follow these three steps. These steps require the openssl tool, which is available on Linux, OSX, and Windows.

### generate the key pair in RSA format (PKCS#1) without encryption
```
openssl genrsa -out private.pem 2048
```

### convert the above to PKCS#8 format

```
openssl pkcs8 -topk8 -inform pem -in private.pem -outform pem -nocrypt -out private-pkcs8.pem

```
### extract the public key from that:
```
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

After doing this, you will need to update the verify and generate API proxies to reference these new values,
and also load these values into the KVM.
