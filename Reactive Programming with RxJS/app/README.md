# \<rxjs-demo\>

Demo app for ITrend talk "Reactive Programming with RxJS" 

## Prerequisites

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.
Then run `polymer serve` to serve your application locally.

You'll also need CouchDB - install it from your distro's repository or visit their [official website]

## Bootstrapping CouchDB

Create database and upload the bootstrap document:

```sh
export COUCHDB_URI=http://localhost:5984
curl -X PUT $COUCHDB_URI/rxdemo
curl -X POST -d @couchdb_bulk.json -H "content-type: application/json" $COUCHDB_URI/rxdemo/_bulk_docs
```

## Viewing Your Application

```
$ polymer serve
```

[official website]: https://couchdb.apache.org/
