# wiktionary-parser
Using Javascript to parse Wiktionary Files -- A work in progress


## Visualizer

### Dev Server
```
npm run webpack-dev-server
```

http://localhost:8088/


Fetching wiki markup source for Template:t
```
https://en.wiktionary.org/w/api.php?action=query&titles=Template:t&prop=revisions&rvprop=content&format=json
```
Fetching wiki markup source for "hello"
```
https://en.wiktionary.org/w/api.php?action=query&titles=hello&prop=revisions&rvprop=content&format=json
```
