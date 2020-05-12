consul-values
---
Github action parse a mustache.js template using values from a consul key

## Example Usage

```yaml
jobs:
  parse:
    steps:
      - name: Consul Values
        uses: hexlyoss/consul-values@v1
        with:
          url: "consul.hexlyoss.io"
          port: "8501"
          secure: true
          datacenter: "dc1"
          token: ${{ secrets.CONSUL_TOKEN }}
          key: "staging/processor/"
          template: "./k8s/staging/deployment.yaml"
          extras: '{"project": "processor", "lane":"staging", "releaseSha": "abc123"}'
          ca: |
            -----BEGIN CERTIFICATE-----
            MIIDLzCCAhegAwIBAgIUVGKmsphw41gg4dxHQWBLckt8giYwDQYJKoZIhvcNAQEL
            BQAwFDESMBAGA1UEAxMJY2EuY29uc3VsMB4XDTE5MDMyNTE2MzQ1OVoXDTI4MTEx
            NzE2MzUyOVowFDESMBAGA1UEAxMJY2EuY29uc3VsMIIBIjANBgkqhkiG9w0BAQEF
            AAOCAQ8AMIIBCgKCAQEAzkUpLw0DOXsCaaQnifxK4Mt7TfwGOH09f7rZRJlYueXo
            iNfR0kLlqR34oITDSRP+dOxuMFDd5TkVxGK7TPRc2QjbQarho8Jn97joeuigRo/l
            DdXodryPDKgTiYj3ogZ4i/MVqZeAeMxSgQkmmNV97UFPqLGWbsCISkg2XkFM98Nk
            mMczmiNEMwT3Jp/qPCQ52MxojN3LsaNxIbqX0F60cbGjnYc8Vkik3C5cZgc7AlQI
            WKtu9AZ1md4fv3P6CSv0reiG8NFR7CmdjV1s3+V6wIRVYdmdNcICHMBmNLu6sSue
            q6FeBaoh7rESRF+TGNAmQQlhkEr2F3rlvy34GSmFvwIDAQABo3kwdzAOBgNVHQ8B
            Af8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUTze1cndYO46QuRt3
            g5zA4S0r41YwHwYDVR0jBBgwFoAUTze1cndYO46QuRt3g5zA4S0r41YwFAYDVR0R
            BA0wC4IJY2EuY29uc3VsMA0GCSqGSIb3DQEBCwUAA4IBAQCWdI12SrkmTjfGIDGZ
            LBTYBoqWZ/qObzlBcAqOzyeAOIq+92+AfqxPzpvwfI+PFhRg+hZ8ZXoV2LnnjxbN
            JHUG6CleMvYQIBPxVIrCDmTQ4dwL7bWmuWQaQD7MDsIcEOEm1qEQ1y3zfMIko0CE
            wq0tHETtC8bgI32mtkdRojdovVT55I8csNyJTMmjeirhAHUucr4O5DDzsFv3MliN
            XXlGqyv6afF860VtOmrCePP24SBK5bUs6vOge7T50fCHQ1h8ASyhrcREmaYf72CH
            c3s/pzsKYaZpWd867pIGN8JZBscRLDyvPhde4zxZirOWcdOIIbpUsv1VUi7OcEXL
            lPCJ
            -----END CERTIFICATE-----
```

## Input Values

### url

**Required** Consul agent address

### port

**Required** Consul agent port

### secure

Enable https connection to consul. Default `true`.

### ca

Custom CA certificate for consul service. Default `none`.

### datacenter

Consul datacenter to use. Default `dc1`.

### key

**Required** Key path to use - the root to look for keys under.

### token

Consul ACL token to use if required. Default `none`.

### template

**Required** Path to template file to parse.

### out

Path to write the parsed output to. Default `<input.template>.parsed`.

### extras

Additional values to be added to the consul values. Default `none`.

## Output

consul-values will parse the provided `template` file with the values from consul `key` and `extras` and write the output to `out`.