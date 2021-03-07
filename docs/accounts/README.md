
[Skip to API reference -->](#api-reference)

[See Examples in Code](/docs/accounts/examples.js)

Accounts
===
`accounts` is a core module to encapsulates the domain of open accounts in your Wealthsimple Trade account. With the `accounts` module, you can:

* Retrieve open account ids (TFSA, RRSP, etc) for use in other APIs
* Retrieve connected bank accounts and deposits
* Retrieve meta information about your Wealthsimple Trade account
* Retrieve positions in an open account (e.g., positions in TFSA)

##### Note: All operations in `accounts` module require talking to Wealthsimple Trade endpoints. So make sure you are authenticated through the [`auth`](/docs/auth/) module.
<a id="#api-reference"></a>

API Reference
---
* ### [accounts.`all`](#accounts-all)
* ### [accounts.`data`](#accounts-data)
* ### [accounts.`me`](#accounts-me)
* ### [accounts.`person`](#accounts-person)
* ### [accounts.`history`](#accounts-history)
* ### [accounts.`activities`](#accounts-activities)
* ### [accounts.`getBankAccounts`](#accounts-getBankAccounts)
* ### [accounts.`deposits`](#accounts-deposits)
* ### [accounts.`positions`](#accounts-positions)
---

<a id="accounts-all"></a>
### accounts.`all`

Retrieves an object containing the ids of all open accounts under your Wealthsimple Trade account. The returned object could include `tfsa`, `rrsp`, `crypto`, and `personal` ids.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.all() -> Promise<AccountList>
```
```javascript
{
  tfsa: 'tfsa-zzzzzzzz',
  rrsp: undefined,
  crypto: 'non-registered-crypto-zzzzzzz',
  personal: 'non-registered-zzzzzzzz'
}
```

---

<a id="accounts-data"></a>
### accounts.`data`

Returns a list of details about your open accounts, like account type, buying power, current balance for each account.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.data() -> Promise<Array<any>>
```
```javascript
* This is not the full returned object - it has been cut.
[
  {
    object: 'account',
    id: 'non-registered-zzzzzzzz',
    deleted_at: null,
    buying_power: { amount: 3000000, currency: 'CAD' },
    current_balance: { amount: 200000, currency: 'CAD' },
    withdrawn_earnings: { amount: 10000000, currency: 'CAD' },
    net_deposits: { amount: 1000000, currency: 'CAD' },
    available_to_withdraw: { amount: 1000000, currency: 'CAD' },
    ...
  },
  ...
]
```

---

<a id="accounts-me"></a>
### accounts.`me`

Retrieves some surface information about you like your name and email, account
signatures, and other metadata.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.me() -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  object: 'user',
  attempted_existing_bank_account_import: true,
  attempted_existing_document_import: true,
  first_name: 'Jane',
  last_name: 'Doe',
  feature_flags: [
    'balance_service',
    'tfsa',
    'edit_kyc',
    'sparkline_v2'
  ],
  email: 'jane@doe.ca',
  email_confirmed: true,
  unconfirmed_email: null,
  is_funded: true,
  can_create_referral: false
}
```

---

<a id="accounts-person"></a>
### accounts.`person`

Detailed information about you that you provided on signup, like residential and mailing addresses, employment, phone numbers, and so on.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.person() -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  email: 'jane@doe.ca',
  phone_numbers: [ ... ],
  residential_address: { ... },
  mailing_address: { ... },
  employment: { ... },
  citizenships: [ 'CA' ],
  date_of_birth: '1970-01-01',
  full_legal_name: { first_name: 'Jane', middle_names: null, last_name: 'Doe' }
}
```

---

<a id="accounts-history"></a>
### accounts.`history`

Query the history of the open account within the specified time  interval.
* Valid interval values: `1d`, `1w`, `1m`, `3m`, `1y`
* `accountId` should be one that is returned by accounts.`all`

[View examples](/docs/accounts/examples.js)

```javascript
accounts.history(interval, accountId) -> Promise<any>
```
```javascript
* This is not the full returned object - it has been cut.
{
  results: [
    {
      date: '2020-03-16',
      value: [Object],
      equity_value: [Object],
      net_deposits: [Object],
      withdrawn_earnings: [Object],
      relative_equity_earnings: [Object]
    },
    {
      date: '2020-03-17',
      value: [Object],
      equity_value: [Object],
      net_deposits: [Object],
      withdrawn_earnings: [Object],
      relative_equity_earnings: [Object]
    },
    ...
  ],
  start_earnings: { amount: 100000.00, currency: 'CAD' }
}
```

See also: [accounts.`all`](#accounts-all)

---

<a id="accounts-activities"></a>
### accounts.`activities`

Fetches activities on your Wealthsimple Trade account. You can limit number of activities to fetch or refine what activities are fetched based on activity type (e.g., buy, sell), account (e.g., tfsa, rrsp).

* `filters.limit`:  The number of activities to fetch. The maximum value is `99`. However, if you wish to fetch all activities (which could be more than 99), leave `filters.limit` as undefined.
* `filters.type`: The type of activities to fetch. This must be specified as an array of strings. Valid activity types: `sell`, `buy`, `deposit`, `withdrawal`, `dividend`, `institutional_transfer`, `internal_transfer`, `refund`, `referral_bonus`, and `affiliate`.
* `filters.accounts`: The accounts to pull activities from. This must be specified as an array of account ids that you get from [accounts.`all`](#accounts-all)

**Note**: The filters parameter is optional. If you provide nothing, then all activities across all of your accounts will be fetched.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.activities([filters]) -> Promise<Array<any>>
```
```javascript
* This is not the full returned object - it has been cut.
[
  {
    id: 'funds_transfer-zzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
    bank_account_id: 'bank_account-zzzzzzzzzzzzzzzzzzzzzz',
    created_at: '1970-01-01T14:16:46.000Z',
    updated_at: '1970-01-01T23:16:32.185Z',
    rejected_at: null,
    cancelled_at: null,
    accepted_at: '1970-01-01T00:12:55.000Z',
    status: 'accepted',
    value: { amount: 100000, currency: 'CAD' },
    cancellable: false,
    object: 'withdrawal',
    withdrawal_reason: 'other',
    tax_withholding: 0,
    account_id: 'tfsa-zzzzzzzzz'
  },
  ...
]
```

See also: [accounts.`all`](#accounts-all)

---

<a id="accounts-getBankAccounts"></a>
### accounts.`getBankAccounts`

Retrieves all bank accounts linked to the Wealthsimple Trade account.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.getBankAccounts() -> Promise<Array<any>>
```
```javascript
* This is not the full returned object - it has been cut.
[
  {
    object: 'bank_account',
    id: 'bank_account-zzzzzzzzzzzzzzzzzzzzzzz',
    type: 'chequing',
    corporate: false,
    account_name: null,
    institution_name: 'RBC',
    institution_number: '003',
    transit_number: '***xx',
    account_number: '****xxx',
    jurisdiction: 'CA',
    created_at: '1970-01-01T18:56:08Z',
    updated_at: '1970-01-01T18:56:08Z',
    verifications: [ [Object] ]
  },
  ...
]
```

---

<a id="accounts-deposits"></a>
### accounts.`deposits`

Grab all deposit records on the Wealthsimple Trade account.

[View examples](/docs/accounts/examples.js)

```javascript
accounts.deposits() -> Promise<Array<any>>
```
```javascript
* This is not the full returned object - it has been cut.
[
  {
    id: 'funds_transfer-zzzzzzzzzzzzzzzzzzzzzz',
    bank_account_id: 'bank_account-zzzzzzzzzzzzzzzzz',
    created_at: '1970-01-01T00:17:12.000Z',
    updated_at: '1970-01-01T18:54:50.188Z',
    rejected_at: null,
    cancelled_at: null,
    accepted_at: '1970-01-01T04:00:00.000Z',
    status: 'accepted',
    value: { amount: 100000, currency: 'CAD' },
    cancellable: false,
    object: 'deposit',
    account_id: 'non-registered-zzzzzzzz'
  },
  ...
]
```

---

<a id="accounts-positions"></a>
### accounts.`positions`

Lists all positions in the specified open account under the Wealthsimple Trade Account.

* `accountId` should be one that is returned by accounts.`all`

[View examples](/docs/accounts/examples.js)

```javascript
accounts.positions(accountId) -> Promise<Array<any>>
```
```javascript
* This is not the full returned object - it has been cut.
[
  {
    // position 1
    ...
  },
  {
    // position 2
    ...
  },
  ...
]
```

See also: [accounts.`all`](#accounts-all)
