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

/*
% options flex
*/

%%


{SPACE}*[=]+{SPACE}*(\n|$)          return 'H_END'
{SPACE}*[=]{1,5}{SPACE}*            %{
                                        if (yylloc.first_column) {
                                            return 'TEXT'               /* '=' anywhere but at the begging becomes just text */
                                        } else {
                                            return 'H'+yytext.trim().length+'_BEG';
                                        }
                                    %}
(\r|\n|\n\r|\r\n)                   %{
                                        if (yylloc.first_column)
                                            return 'NEWLINE'
                                        else
                                            return 'EMPTY_LINE';
                                    %}
<<EOF>>                             return 'EOF'
{PlaneText}+                        return 'TEXT'
[']                                 return 'TEXT'
.                                   return 'TEXT'

/lex

/* operator associations and precedence */
%left section1
%left section1-content
%left section2
%left section2-content
%left section3
%left section3-content
%left section4
%left section4-content
%left section5
%left section5-content


%start wiki-page

%% /* language grammar */


wiki-page
    : article end-of-file
        { return {t: 'wiki-page', c:[$1, $2]};}
    | end-of-file
        { return {t: 'wiki-page', c:[$1]};}
    ;

article
    : article-content
        { $$ = $1; }
    ;

article-content
    : sections
        { $$ = {t: 'article', c:[$1]};}
    | paragraphs
        { $$ = {t: 'article', c:[$1]};}
    | article-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | article-content sections
        { $1.c.push($2); $$ = $1; }
    ;

sections
    : section1
        { $$ = {t: 'sections', c:[$1]}; }
    | section2
        { $$ = {t: 'sections', c:[$1]}; }
    | section3
        { $$ = {t: 'sections', c:[$1]}; }
    | section4
        { $$ = {t: 'sections', c:[$1]}; }
    | section5
        { $$ = {t: 'sections', c:[$1]}; }
    | sections section1
        { $1.c.push($2); $$ = $1; }
    | sections section2
        { $1.c.push($2); $$ = $1; }
    | sections section3
        { $1.c.push($2); $$ = $1; }
    | sections section4
        { $1.c.push($2); $$ = $1; }
    | sections section5
        { $1.c.push($2); $$ = $1; }
    ;

section1
    : section1-title section1-content
        { $$ = {t: 'section1', c:[$1, $2]}; }
    | section1-title
        { $$ = {t: 'section1', c:[$1]}; }
    ;

section1-title
    : H1_BEG text H_END
        { $$ = {t: 'section1-title', c:[$2]}; }
    ;

section1-content
    : paragraphs
        { $$ = {t: 'section1-content', c:[$1]}; }
    | section2
        { $$ = {t: 'section1-content', c:[$1]}; }
    | section3
        { $$ = {t: 'section1-content', c:[$1]}; }
    | section4
        { $$ = {t: 'section1-content', c:[$1]}; }
    | section5
        { $$ = {t: 'section1-content', c:[$1]}; }
    | section1-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | section1-content section2
        { $1.c.push($2); $$ = $1; }
    | section1-content section3
        { $1.c.push($2); $$ = $1; }
    | section1-content section4
        { $1.c.push($2); $$ = $1; }
    | section1-content section5
        { $1.c.push($2); $$ = $1; }
    ;

section2
    : section2-title section2-content
        { $$ = {t: 'section2', c:[$1, $2]}; }
    | section2-title
        { $$ = {t: 'section2', c:[$1]}; }
    ;

section2-title
    : H2_BEG text H_END
        { $$ = {t: 'section2-title', c:[$2]}; }
    ;

section2-content
    : paragraphs
        { $$ = {t: 'section2-content', c:[$1]}; }
    | section3
        { $$ = {t: 'section2-content', c:[$1]}; }
    | section4
        { $$ = {t: 'section2-content', c:[$1]}; }
    | section5
        { $$ = {t: 'section2-content', c:[$1]}; }
    | section2-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | section2-content section3
        { $1.c.push($2); $$ = $1; }
    | section2-content section4
        { $1.c.push($2); $$ = $1; }
    | section2-content section5
        { $1.c.push($2); $$ = $1; }
    ;

section3
    : section3-title section3-content
        { $$ = {t: 'section3', c:[$1, $2]}; }
    | section3-title
        { $$ = {t: 'section3', c:[$1]}; }
    ;

section3-title
    : H3_BEG text H_END
        { $$ = {t: 'section3-title', c:[$2]}; }
    ;

section3-content
    : paragraphs
        { $$ = {t: 'section3-content', c:[$1]}; }
    | section4
        { $$ = {t: 'section3-content', c:[$1]}; }
    | section5
        { $$ = {t: 'section3-content', c:[$1]}; }
    | section3-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | section3-content section4
        { $1.c.push($2); $$ = $1; }
    | section3-content section5
        { $1.c.push($2); $$ = $1; }
    ;

section4
    : section4-title section4-content
        { $$ = {t: 'section4', c:[$1, $2]}; }
    | section4-title
        { $$ = {t: 'section4', c:[$1]}; }
    ;

section4-title
    : H4_BEG text H_END
        { $$ = {t: 'section4-title', c:[$2]}; }
    ;

section4-content
    : paragraphs
        { $$ = {t: 'section4-content', c:[$1]}; }
    | section5
        { $$ = {t: 'section4-content', c:[$1]}; }
    | section4-content paragraphs
        { $1.c.push($2); $$ = $1; }
    | section4-content section5
        { $1.c.push($2); $$ = $1; }
    ;

section5
    : section5-title section5-content
        { $$ = {t: 'section5', c:[$1, $2]}; }
    | section5-title
        { $$ = {t: 'section5', c:[$1]}; }
    ;

section5-title
    : H5_BEG text H_END
        { $$ = {t: 'section5-title', c:[$2]}; }
    ;

section5-content
    : paragraphs
        { $$ = {t: 'section5-content', c:[$1]}; }
    | section5-content paragraphs
        { $1.c.push($2); $$ = $1; }
    ;

paragraphs
    : paragraph
        { $$ = {t: 'paragraphs', c:[$1]};}
    | paragraphs paragraph
        { $1.c.push($2); $$ = $1; }
    ;

paragraph
    : lines-of-text
        { $$ = {t: 'paragraph', c:[$1]};}
    | blank-line
        { $$ = {t: 'paragraph', c:[$1]};}
    | blank-line lines-of-text
        { $$ = {t: 'paragraph', c:[$1, $2]};}
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
    : bold-text
        { $$ = {t: 'text', v: $1}; }
    | italic-text
        { $$ = {t: 'text', v: $1}; }
    | plain-text
        { $$ = {t: 'text', v: $1}; }
    | text bold-text
        { $1.c.push($2); $$ = $1; }
    | text italic-text
        { $1.c.push($2); $$ = $1; }
    | text plain-text
        { $1.c.push($2); $$ = $1; }
    ;

plain-text
    : TEXT
        { $$ = {t: 'plain-text', v: $1}; }
    | plain-text TEXT
        { $1.v += $2; $$ = $1; }
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

