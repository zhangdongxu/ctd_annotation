# ctd_annotation

Install Node.js (https://nodejs.org/en/) on the server or your local machine

Set up configuration (you can enter any value you like or leave them blank):

```
npm init
```

Install express library to node.js:

```
npm install express
```

Install nedb library to node.js:

```
npm install nedb
```

Install nedb wrapper for promise function:

```
npm install nedb-promises
```

Modify the port number (currently set to 3000) in the script and the start the server:

```
node index.js
```

Visit localhost:3000 (if port=3000) via a browser. Currently we have two account code: apple / banana

If a new annotator joins, currently we need to stop the service, and run: `node add_new_user.js`. Then restart the service: `node index.js`

