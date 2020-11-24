# tyfon-client
An isomorphic http client for connecting to [TyFON](https://loreanvictor.github.io/tyfon) servers.

👉 [Read this for more information](https://loreanvictor.github.io/tyfon/advanced/custom-client).

<br>

## Installation

```bash
npm i tyfon-client
```

<br>

## Usage

```ts
import { invoke } from 'tyfon-client';

invoke('http://my-tyfon-server.cloud', 'methodName', 'arg1', { hellow: 'world' }, 42, ...)
  .then(console.log)
  .catch(err => { /* OOPS */ })
;
```


The address given **MUST** correspond to a TyFON server, where `methodName` is a remote function
served by the server. [tyfon-conventions](https://github.com/loreanvictor/tyfon-conventions) will be used
to turn the given method name into proper URL endpoint and HTTP method, and arguments will be JSON-serialized
and attached to request body or query parameters (based on resolved HTTP method).

👉 [Learn more about TyFON](https://loreanvictor.github.io/tyfon/)
