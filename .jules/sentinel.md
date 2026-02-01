## 2024-05-22 - API Key Exposure in Logs
**Vulnerability:** API keys were being logged to the browser console via `console.log` in `js/llmIntegration.js`.
**Learning:** Developers often leave debug logs containing sensitive configuration objects during development, which can persist into production if not stripped.
**Prevention:** Implement linting rules to forbid `console.log` or use a dedicated logging utility that is disabled in production builds. Review all logging statements for sensitive variables before committing.
