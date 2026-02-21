# WandStore Secrets Documentation

This document provides comprehensive documentation for all GitHub Actions secrets used across the WandStore organization repositories.

## Overview

| Repository | Secrets Count | Last Updated |
|------------|---------------|--------------|
| `wandstore/storefront` | 5 | 2026-02-21 |
| `wandstore/infrastructure` | 4 | 2026-02-21 |
| `wandstore/docs` | 0 | 2026-02-21 |

---

## Secret Reference

### CLOUDFLARE_ACCOUNT_ID

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/storefront`, `wandstore/infrastructure` |
| **Purpose** | Identifies the Cloudflare account for API operations |
| **Where to Obtain** | [Cloudflare Dashboard](https://dash.cloudflare.com) → Overview (right sidebar) |
| **Rotation** | Not required (static account identifier) |
| **Security Notes** | This is not a sensitive secret per se, but treat it as internal information. Do not expose publicly. |

### CLOUDFLARE_API_TOKEN

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/storefront`, `wandstore/infrastructure` |
| **Purpose** | Authenticates API requests to Cloudflare services |
| **Where to Obtain** | [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens → Create Token |
| **Required Permissions** | Varies by use case. Typically: `Zone:Read`, `Zone:Edit`, `Page Rules:Edit`, `Workers Scripts:Edit` |
| **Rotation** | **Recommended: Every 90 days** |
| **Security Notes** | 
| | - Store in GitHub Secrets, never commit to code |
| | - Use minimal required permissions (principle of least privilege) |
| | - Monitor API token usage in Cloudflare dashboard |
| | - Revoke immediately if compromised |

### CLOUDFLARE_EMAIL

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/infrastructure` |
| **Purpose** | Email address associated with Cloudflare account (used for legacy auth or notifications) |
| **Where to Obtain** | Your Cloudflare account email |
| **Rotation** | Not applicable |
| **Security Notes** | Ensure this email is actively monitored for security alerts from Cloudflare. |

### SHOPIFY_CLIENT_ID

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/storefront` |
| **Purpose** | Identifies the Shopify app/custom integration for OAuth flows |
| **Where to Obtain** | [Shopify Partners Dashboard](https://partners.shopify.com) → Apps → [Your App] → App setup |
| **Rotation** | Rotate if app credentials are regenerated |
| **Security Notes** | 
| | - Keep confidential; used in OAuth handshake |
| | - Regenerate if you suspect unauthorized access |
| | - Different for development vs production apps |

### SHOPIFY_STORE

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/storefront` |
| **Purpose** | Identifies the specific Shopify store (e.g., `my-store.myshopify.com`) |
| **Where to Obtain** | Your Shopify admin URL (the subdomain before `.myshopify.com`) |
| **Rotation** | Not applicable |
| **Security Notes** | This is not highly sensitive, but avoid exposing it unnecessarily as it reveals store identity. |

### SHOPIFY_STOREFRONT_TOKEN

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/storefront` |
| **Purpose** | Access token for Storefront API (unauthenticated customer-facing data) |
| **Where to Obtain** | Shopify Admin → Settings → Apps and sales channels → Develop apps → [Your App] → API credentials |
| **Rotation** | **Recommended: Every 180 days** or if exposed |
| **Security Notes** | 
| | - Storefront tokens have limited scope (read-only, public data) |
| | - Still treat as sensitive to prevent abuse |
| | - Can be rotated without affecting admin operations |

### KIMI_API_KEY

| Attribute | Value |
|-----------|-------|
| **Used In** | `wandstore/infrastructure` |
| **Purpose** | Authenticates requests to Kimi AI services |
| **Where to Obtain** | [Kimi Platform](https://platform.moonshot.cn) → API Keys |
| **Rotation** | **Recommended: Every 90 days** |
| **Security Notes** | 
| | - High sensitivity — grants access to AI services and billing |
| | - Monitor usage for unexpected spikes |
| | - Use environment-specific keys if possible |
| | - Revoke immediately if leaked |

---

## Secret Rotation Checklist

When rotating secrets, follow this procedure:

1. **Generate new secret** at the provider's dashboard
2. **Update GitHub Secret** in repository settings
3. **Test** the new secret with a workflow run
4. **Delete old secret** at the provider (if applicable)
5. **Update this document** with rotation date
6. **Notify team** in #ops or equivalent channel

---

## Repository-Specific Notes

### wandstore/storefront

- All secrets are used for deployment and storefront operations
- Secrets are injected into GitHub Actions workflows for Cloudflare Pages deployment and Shopify integration
- **Critical**: Never log these secrets in workflow outputs

### wandstore/infrastructure

- Secrets used for Terraform/Cloudflare infrastructure management
- `KIMI_API_KEY` may be used for AI-powered infrastructure features
- **Critical**: Infrastructure secrets have elevated privileges — extra care required

### wandstore/docs

- No secrets currently documented
- Future secrets should be added to this document when implemented

---

## Security Best Practices

1. **Principle of Least Privilege**: Grant minimum necessary permissions to each secret
2. **Regular Rotation**: Follow rotation schedules listed above
3. **Audit Access**: Periodically review who has access to repository secrets
4. **No Hardcoding**: Never commit secrets to code; always use GitHub Secrets
5. **Monitoring**: Set up alerts for unusual API usage patterns
6. **Incident Response**: Have a plan for secret revocation if compromised

---

## Contact

For questions about secrets or to report a security concern:

- **Security Issues**: Contact the Security team immediately
- **General Questions**: Open an issue in this repository
- **Emergency**: Use the incident response procedure

---

*Last updated: 2026-02-21*
*Maintained by: WandStore Engineering*
