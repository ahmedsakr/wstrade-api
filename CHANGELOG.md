v1.8.0
==
* Support concurrency with a `Session` API. The codebase has been refactored to allow for concurrent usage where you can manage several
Trade accounts!

v1.7.1
==
* Add `request` to package.json to force install it because `cloudscraper` requires it even though it's deprecated.

v1.7.0
==
* Integrated library (`cloudscraper`) that solves Cloudflare bot challenges for all WS endpoints.

v1.6.0
==
* Expanded support for the accounts.`activities` API, allowing for filtering of what activities to pull based on activity type (e.g., `buy`, `sell`) or open accounts (tfsa, rrsp, etc).