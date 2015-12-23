/**
 * Created by jason on 12/26/13.
 */
// process.js
"use strict";

var util = require('util');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var wikiMarkupParser = require('./wikimarkupparser.js');
var WaitFor = require('./waitfor.js');

var cTranslations;

var wf = new WaitFor();
var n = 0;

var validLangs = {'en':'en', 'nl':'nl', 'de':'de', 'fr':'fr', 'es':'es', 'sv':'sv', it:'it', pt:'pt'};

var activeLang = validLangs[process.argv[2]] || 'en';

function processDoc(err, doc) {
    if (err || doc === null) {
        // we are done.
        util.print('\n');
        //console.dir(setOfHeaders);
        wf.onReady(function(){process.exit(0);});
    }
    else {
        if (doc.revision && doc.revision.text && typeof (doc.revision.text) == 'string') {
            process.stderr.write(doc.title + '\n');
            var wiki = wikiMarkupParser(doc.revision.text, doc.lang, doc.title);
            var s = {lang:wiki.lang, title:wiki.title, structure:wiki.structure, translations:wiki.translations};
            if (s.translations && s.translations.length) {
                s.translations.forEach(function (t,i,a){
                    var query = {lang: t.lang, word: t.word, tlang: t.tlang, tword: t.tword, pos: t.pos, def: t.def};
                    var row = [t.lang, t.word, t.pos, t.def, t.tlang, t.tword, t.tgender];
                    row = row.map(function(e,i,a){ return e === null ? '' : e; });
                    var sRow = JSON.stringify(row);
                    util.print(sRow.replace(/(^\[)|(\]$)/g,''));
                    util.print("\n");
                });
            }
        }
    }
}


MongoClient.connect('mongodb://127.0.0.1:27017/wiktionary', function(err, db) {
    if (err) {
        throw err;
    }

    var cWikiWords = db.collection('pages');
    util.print("lang, word, pos, def, tlang, tword, tgender\n");

    // util.print(util.inspect(cTranslations, {colors: true, depth: 10}));
    var it = cWikiWords.find({lang: activeLang}); //.limit(100);
    it.each(processDoc);
});
