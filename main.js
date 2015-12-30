/**
 * Created by jasondent on 23/12/2015.
 */
var wiktionaryReader = require('./lib/wiktionary/wiktionary-reader');
var p = wiktionaryReader.fetchWord('en', 'walk');
p.then(function (response) {
    console.log(response);
    process.exit(0);
});
p.catch(function (err) {
    console.log(err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map