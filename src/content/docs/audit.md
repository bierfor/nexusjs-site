# Audit

Run a security audit anytime.

## What it scans

- Known CVEs in dependencies (OSV database)
- Unused dependencies (bundle bloat)
- Outdated packages
- Secret leaks in source code
- Insecure configuration

## Run audit

```bash
nexus audit
```

## Override policy

Create `nexus-audit.json` to suppress false positives:

```json
{
  "ignore": {
    "CVE-2024-1234": "Not exploitable in our usage"
  }
}
```