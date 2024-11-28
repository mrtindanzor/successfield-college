import Loki from "lokijs"
const db = new Loki('myDatabase.json', {
  autoload: true,
  autoloadCallback: loadHandler,
  persistenceMethod: 'fs',
});

db.on('load', function () {
  console.log('Database loaded successfully!');
});

db.on('error', function (err) {
  console.log('Error loading database:', err);
});

function loadHandler() {
  const certDb = [{"name":"Thomas Sichone","studentNumber":"608457/10/1","certificateCode":"gism-24-049","studentProgramme":"Doctor of Business Administration","dateCompleted":"4th July, 2024"},
    {"name":"Jacob Sichone","studentNumber":"608456/10/1","certificateCode":"gism-24-085","studentProgramme":"Doctor of Business Administration","dateCompleted":"4th July, 2024"}
    ]
  const loki1 = db.addCollection('users')
  // loki1.insert(certDb)
  db.saveDatabase()
  // db.saveDatabase((err, result) => {
  //   if(err) throw new Error('an error occured')
  //   return {msg: "data save successfully"}
  // })
  console.log('Database loaded!');
  // Further operations after loading
}
 