

[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/config/examples.js)

Config
===
`config` module allows you to disable or enable conditional features within `wstrade-api`. Here is a list of conditional features.

| Feature | Default | Description |
|--|--|--|
| `implicit_token_refresh` | Enabled | the tokens in the `auth` module are automatically refreshed when the `auth.tokens.expires` time is in the past. |

<a id="#api-reference"></a>

API Reference
---
* ### [`config`](#config)
---

<a id="config"></a>
### `config`

```javascript
config(feature) -> void
```

Enable or disable a conditional feature within `wstrade-api`.
* To **enable** a feature, specify the feature name shown in the table above
* To **disable** a feature, prefix `no_` before the feature name shown in the table above.

[View examples](/docs/config/examples.js)
