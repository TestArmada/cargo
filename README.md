#### Data provider for testarmada
##### file format 
Provider should only support `.js`. `.js` support is to allow user generate some random data on the fly, like user registration scenario that requires fresh email account every time.

Each `.js` data file should return a json object.
##### supported files
```
   ${DPRO}.js          : main test data
   ${DPRO_INST}.js : (optional) extra data that only applies to certain instance
```
##### default file location
```bash
  ${REPO_ROOT}/config/data

  # file location can be changed by using
  ${DPRO_LOCATION}
```
##### file loading rules
###### basic
```bash
 # to only load from ${REPO_ROOT}/config/data/local.js
 DPRO=local ./node_modules/.bin/magellan --test xxxxx ......

 # to only load from ${REPO_ROOT}/config/data/prod-a.js
 DPRO=prod-a ./node_modules/.bin/magellan --test xxxxx ......
``` 
###### advantage
```bash
 # change file location to ${REPO_ROOT}/config/staging.js
 DPRO_LOCATION="./config/" DPRO=staging ./node_modules/.bin/magellan --test xxxxx ......

 # load both ${REPO_ROOT}/config/data/staging.js and ${REPO_ROOT}/config/data/staging-2.js
 # config in staging-2.js will be used if common config exists.
 DPRO=staging DPRO_INST=2 ./node_modules/.bin/magellan --test xxxxx ......
```

##### usage
```javascript
 /** data file
 *{
 * "beijing": {
 *     "name": "Beijing",
 *     "country": "China",
 *     "description": "It is the most populous city in the China"
 *   },
 *   "timestamp": function () {
 *     return new Date().getTime();
 *  }
 *}
 */
 var td = require("dpro");

 console.log(td.beijing, td.beijing.description);
 console.log(td.timestamp());
```