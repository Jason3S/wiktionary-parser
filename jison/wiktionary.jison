/* lexical grammar */
%lex

WikiMarkupCharacters [|[\]*#:;<>='{}]
SPACE [ \t]
NL \n

%options flex

%%


\r                      /* Skip Line Feed */
^\n                     return 'EMPTY_LINE'
\n                      return 'NEWLINE'
.+                      return 'TEXT'
<<EOF>>                 return 'EOF'

/lex

/* operator associations and precedence */


%start wiki-page

%% /* language grammar */


wiki-page
    : article end-of-file
        { return {t: 'wiki-page', c:[$1]};}
    | end-of-file
        { return {t: 'wiki-page', c:[]};}
    ;

article
    : paragraphs
        { $$ = {t: 'article', c:[$1]};}
    ;

paragraphs
    : paragraph paragraphs
    | paragraph
    ;

paragraph
    : blank-line lines-of-text
        { $$ = {t: 'paragraph', c:[$1, $2]};}
    | lines-of-text
        { $$ = {t: 'paragraph', c:[$1]};}
    | blank-line
        { $$ = {t: 'paragraph', c:[$1]};}
    ;

lines-of-text
    : line-of-text lines-of-text
        { $$ = {t: 'lines-of-text', c:[$1, $2]}; }
    | line-of-text
        { $$ = {t: 'lines-of-text', c:[$1]}; }
    ;

line-of-text
    : text line-ending
        { $$ = {t: 'line-of-text', c:[$1, $2]}; }
    | text
        { $$ = {t: 'line-of-text', c:[$1]}; }
    ;

text
    : TEXT
        { $$ = {t: 'text', v: $1}; }
    ;

line-ending
    : NEWLINE
        { $$ = {t: 'line-end'};}
    ;

blank-lines
    : blank-line blank-lines
    | blank-line
    ;

blank-line
    : EMPTY_LINE
        { $$ = {t: 'blank-line'};}
    ;

end-of-file
    : EOF
        { $$ = {t: 'eof'};}
    ;