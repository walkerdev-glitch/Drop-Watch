
const { withSentryConfig } = require('@sentry/nextjs')
module.exports = withSentryConfig({ reactStrictMode: true }, { silent: true })
