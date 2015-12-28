/*
An attempt at describing the wiki media grammer for the purposes of parsing Wiktionary pages.
To build this grammar:
$ jison wiktionary.jison -m commonjs -p lalr
*/
/* lexical grammar */
%lex

WikiMarkupCharacters    [|[\]*#:;<>='{}]
PlaneText               [^|[\]*#:;<>='{}\n]
SPACE                   [ \t]
NL                      \n

%options flex

%%


(\r|\n|\n\r|\r\n)                   %{
                                        if (yylloc.first_column)
                                            return 'NEWLINE'
                                        else
                                            return 'EMPTY_LINE';
                                    %}
{PlaneText}+                        return 'TEXT'
{SPACE}*[=]+{SPACE}*(\n|$)          return 'H_END'
{SPACE}*[=]{1,6}{SPACE}*            %{
                                        if (yylloc.first_column) {
                                            return 'TEXT'               /* '=' anywhere but at the begging becomes just text */
                                        } else {
                                            return 'H'+yytext.trim().length+'_BEG';
                                        }
                                    %}
[']                                 return 'S_QUOTE'
<<EOF>>                             return 'EOF'
.                                   return 'INVALID'

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
    : paragraphs sections paragraphs
        { $$ = {t: 'article', c:[$1, $2, $3]};}
    | sections paragraphs
        { $$ = {t: 'article', c:[$1, $2]};}
    | sections
        { $$ = {t: 'article', c:[$1]};}
    | paragraphs
        { $$ = {t: 'article', c:[$1]};}
    ;

sections
    : sections section1
    | section1
    ;

section1
    : section1-title section1-content
        { $$ = {t: 'section1', c:[$1, $2]}; }
    | section1-title
        { $$ = {t: 'section1', c:[$1]}; }
    ;

section1-title
    : H1_BEG TEXT H_END
        { $$ = {t: 'section1-title', c:[$2]}; }
    ;

section1-content
    : section1-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | section1-content section2
        { $1.c.push($2); $$ = $1; }
    | section1-content section3
        { $1.c.push($2); $$ = $1; }
    | paragraphs
        { $$ = {t: 'section1-content', c:[$1]}; }
    ;

section2
    : section2-title section2-content
        { $$ = {t: 'section2', c:[$1, $2]}; }
    | section1-title
        { $$ = {t: 'section2', c:[$1]}; }
    ;

section2-title
    : H2_BEG TEXT H_END
        { $$ = {t: 'section2-title', c:[$2]}; }
    ;

section2-content
    : section2-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | section2-content section3
        { $1.c.push($2); $$ = $1; }
    | paragraphs
        { $$ = {t: 'section2-content', c:[$1]}; }
    ;

paragraphs
    : paragraphs paragraph
        { $1.c.push($2); $$ = $1; }
    | paragraph
        { $$ = {t: 'paragraphs', c:[$1]};}
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
    : lines-of-text line-of-text
        { $1.c.push($2); $$ = $1; }
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
    : text rich-text
        { $1.c.push($2); $$ = $1; }
    | rich-text
        { $$ = {t: 'text', c:[$1]}; }
    ;

plain-text
    : TEXT
        { $$ = {t: 'plain-text', v: $1}; }
    ;

rich-text
    : bold-text
        { $$ = {t: 'rich-text', v: $1}; }
    | italic-text
        { $$ = {t: 'rich-text', v: $1}; }
    | plain-text
        { $$ = {t: 'rich-text', v: $1}; }
    ;

italic-text
    : S_QUOTE S_QUOTE italic-text-inner-text S_QUOTE S_QUOTE
        { $$ = {t: 'italic-text', c: $3.c}; }
    ;

italic-text-inner-text
    : italic-text-inner-text plain-text
        { $1.c.push($2); $$ = $1; }
    | italic-text-inner-text bold-text-inner
        { $1.c.push($2); $$ = $1; }
    | plain-text
        { $$ = {t: 'italic-text-inner', c: [$1]}; }
    | bold-text-inner
        { $$ = {t: 'italic-text-inner', c: [$1]}; }
    ;

italic-text-inner
    : S_QUOTE S_QUOTE plain-text S_QUOTE S_QUOTE
        { $$ = {t: 'italic-text', c: [$3]}; }
    ;

bold-text
    : S_QUOTE S_QUOTE S_QUOTE bold-text-inner-text S_QUOTE S_QUOTE S_QUOTE
        { $$ = {t: 'bold-text', c: $4.c}; }
    ;

bold-text-inner-text
    : bold-text-inner-text plain-text
        { $1.c.push($2); $$ = $1; }
    | bold-text-inner-text italic-text-inner
        { $1.c.push($2); $$ = $1; }
    | plain-text
        { $$ = {t: 'bold-text-inner', c: [$1]}; }
    | italic-text-inner
        { $$ = {t: 'bold-text-inner', c: [$1]}; }
    ;

bold-text-inner
    : S_QUOTE S_QUOTE S_QUOTE plain-text S_QUOTE S_QUOTE S_QUOTE
        { $$ = {t: 'bold-text', c: [$4]}; }
    ;

line-ending
    : NEWLINE
        { $$ = {t: 'line-end'};}
    ;

blank-lines
    : blank-lines blank-line
        { $1.c.push($2); $$ = $1; }
    | blank-line
        { $$ = {t: 'blank-lines', c: [$1]};}
    ;

blank-line
    : EMPTY_LINE
        { $$ = {t: 'blank-line'};}
    ;

end-of-file
    : EOF
        { $$ = {t: 'eof'};}
    ;

