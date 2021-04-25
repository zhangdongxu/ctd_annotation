var username = 'dog';

const Datastore = require('nedb-promises');
let input_data = Datastore.create('data.db');
async function insertUser() {
  await input_data.insert({account_info: true, username: username, browsing_history: 0});
  const doc = await input_data.findOne({username: username});
  console.log(doc);
}

insertUser();
