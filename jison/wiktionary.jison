/*
An attempt at describing the wiki media grammer for the purposes of parsing Wiktionary pages.
To build this grammar:
$ jison wiktionary.jison -m commonjs -p lalr
*/
/* lexical grammar */
%lex

WikiMarkupCharacters    [|[\]*#:;<>='{}]
PlainText               [^|[\]*#:;<>='{}\n]
SPACE                   [ \t]
NL                      \n
Italics                 "''"
Bold                    "'''"
BoldItalics             "'''''"

/*
% options flex
*/

%s template link
%x nowiki

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
[{][{]	                            %{
                                        this.begin('template'); return 'TEMPLATE_START';
                                    %}
<template>[}][}]                    %{
                                        this.popState(); return 'TEMPLATE_END';
                                    %}
<template>[|]                       return 'TEMPLATE_PARAM_SEPARATOR'
[[][[]	                            %{
                                        this.begin('link'); return 'LINK_START';
                                    %}
<link>[\]][\]]                      %{
                                        this.popState(); return 'LINK_END';
                                    %}
<link>[|]                           return 'LINK_PARAM_SEPARATOR'


[<]\s*"nowiki"\s*[>]	            %{  /* <nowiki> */
                                        this.begin('nowiki'); return 'NO_WIKI_START';
                                    %}
<nowiki>[<]\s*[/]"nowiki"\s*[>]     %{ /* </nowiki> */
                                        this.popState(); return 'NO_WIKI_END';
                                    %}
<nowiki>.                           return 'TEXT'

[']+/{BoldItalics}($|[^'])          return 'TEXT'
{BoldItalics}                       return 'BOLD_ITALICS'
[']/{Bold}                          return 'TEXT'
{Bold}                              return 'BOLD'
{Italics}                           return 'ITALICS'
[']                                 return 'TEXT'
"\\u"[0-9a-fA-F]{4}                 return 'UNICODE'
<<EOF>>                             return 'EOF'
{PlainText}+                        return 'TEXT'
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
%left italic-text bold-text
%left italic-text-inner bold-text-inner


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
    : section1-content-item
        { $$ = {t: 'section1-content', c:[$1]}; }
    | section1-content section1-content-item
        { $1.c.push($2); $$ = $1; }
    ;

section1-content-item
    : paragraphs
    | section2
    | section3
    | section4
    | section5
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
    : section2-content-item
        { $$ = {t: 'section2-content', c:[$1]}; }
    | section2-content section2-content-item
        { $1.c.push($2); $$ = $1; }
    ;

section2-content-item
    : paragraphs
    | section3
    | section4
    | section5
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
    : section3-content-item
        { $$ = {t: 'section3-content', c:[$1]}; }
    | section3-content section3-content-item
        { $1.c.push($2); $$ = $1; }
    ;

section3-content-item
    : paragraphs
    | section4
    | section5
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
    : section4-content-item
        { $$ = {t: 'section4-content', c:[$1]}; }
    | section4-content section4-content-item
        { $1.c.push($2); $$ = $1; }
    ;

section4-content-item
    : paragraphs
    | section5
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
    : section5-content-item
        { $$ = {t: 'section5-content', c:[$1]}; }
    | section5-content section5-content-item
        { $1.c.push($2); $$ = $1; }
    ;

section5-content-item
    : paragraphs
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
    : text-content line-ending
        { $$ = {t: 'line-of-text', c:[$1, $2]}; }
    | text-content
        { $$ = {t: 'line-of-text', c:[$1]}; }
    ;

text-content
    : text
    | template
    | link
    ;

text
    : rich-text
        { $$ = {t: 'text', c: [$1]}; }
    | text rich-text
        { $1.c.push($2); $$ = $1; }
    ;

rich-text
    : bold-italics-text
    | plain-text
    | no-wiki
    ;

plain-text
    : text-constant
        { $$ = {t: 'plain-text', v: $1}; }
    | plain-text text-constant
        { $1.v += $2; $$ = $1; }
    ;

text-constant
    : raw-text
        { $$ = $1 }
    | UNICODE
        { $$ = JSON.parse('"'+$1+'"'); }
    ;

raw-text
    : TEXT
        { $$ = $1 }
    | raw-text TEXT
        { $$ = $1 + $2; }
    ;

bold-italics-content
    : bold-italics-content-item
        { $$ = [$1] }
    | bold-italics-content bold-italics-content-item
        { $1.push($2); $$ = $1 }
    ;

bold-italics-content-item
    : plain-text
    | no-wiki
    | link
    | template
    ;

bold-content
    : bold-content-item
        { $$ = [$1] }
    | bold-content bold-content-item
        { $1.push($2); $$ = $1 }
    ;

bold-content-item
    : bold-italics-content-item
    | italic-text-nested
    ;

italics-content
    : italics-content-item
        { $$ = [$1] }
    | italics-content italics-content-item
        { $1.push($2); $$ = $1 }
    ;

italics-content-item
    : bold-italics-content-item
    | bold-text-nested
    ;

italic-text
    : ITALICS italics-content ITALICS
        { $$ = {t: 'italic-text', c: $2}; }
    ;

bold-text
    : BOLD bold-content BOLD
        { $$ = {t: 'bold-text', c: $2}; }
    ;

italic-text-nested
    : ITALICS bold-italics-content ITALICS
        { $$ = {t: 'italic-text', c: $2}; }
    ;

bold-text-nested
    : BOLD bold-italics-content BOLD
        { $$ = {t: 'bold-text', c: $2}; }
    ;

bold-italics-mix
    : BOLD_ITALICS bold-italics-content BOLD_ITALICS
        { $$ = {t: 'bold-text', c: [{t: 'italic-text', c: $2}]}; }
    | BOLD_ITALICS bold-italics-content ITALICS bold-content ITALICS bold-italics-content BOLD_ITALICS
        { $$ = {t: 'bold-text', c: [{t: 'italic-text', c: $2}].concat($4,[{t: 'italic-text', c: $6}])}; }
    | BOLD_ITALICS bold-italics-content BOLD italics-content BOLD bold-italics-content BOLD_ITALICS
        { $$ = {t: 'italic-text', c: [{t: 'bold-text', c: $2}].concat($4,[{t: 'bold-text', c: $6}])}; }
    | BOLD_ITALICS bold-italics-content ITALICS bold-content BOLD
        { $$ = {t: 'bold-text', c: [{t: 'italic-text', c: $2}].concat($4)}; }
    | BOLD_ITALICS bold-italics-content BOLD italics-content ITALICS
        { $$ = {t: 'italic-text', c: [{t: 'bold-text', c: $2}].concat($4)}; }
    ;

bold-italics-text
    : bold-italics-mix
    | italic-text
    | bold-text
    ;

no-wiki
    : NO_WIKI_START raw-text NO_WIKI_END
        { $$ = {t: 'no-wiki', c: [{t: 'plain-text', v: $2 }]}; }
    ;

line-ending
    : NEWLINE
        { $$ = {t: 'line-end', v: $1};}
    ;

blank-lines
    : blank-lines blank-line
        { $1.c.push($2); $$ = $1; }
    | blank-line
        { $$ = {t: 'blank-lines', c: [$1]};}
    ;

blank-line
    : EMPTY_LINE
        { $$ = {t: 'blank-line', v: $1};}
    ;

template
    : TEMPLATE_START template-name TEMPLATE_END
        { $$ = {t: 'template', c: [$2]}; }
    | TEMPLATE_START template-name template-params TEMPLATE_END
        { $$ = {t: 'template', c: [$2].concat($3) }; }
    ;

template-name
    : plain-text
        { $$ = {t: 'template-name', c: [$1] }; }
    | NEWLINE plain-text
        { $$ = {t: 'template-name', c: [$2] }; }
    | plain-text NEWLINE
        { $$ = {t: 'template-name', c: [$1] }; }
    ;

template-params
    : TEMPLATE_PARAM_SEPARATOR template-param
        { $$ = [$2]; }
    | TEMPLATE_PARAM_SEPARATOR
        { $$ = [null]; }
    | template-params TEMPLATE_PARAM_SEPARATOR template-param
        { $1.push($3); $$ = $1; }
    | template-params TEMPLATE_PARAM_SEPARATOR
        { $1.push(null); $$ = $1; }
    ;

template-param
    : template-param-content
        { $$ = {t: 'template-param', c: [$1] }; }
    | template-param template-param-content
        { $1.c.push($2); $$ = $1; }
    ;

template-param-content
    : text-content
    | line-ending
    | blank-line
    ;


link
    : LINK_START link-ref LINK_END
        { $$ = {t: 'link', c:[$2] }; }
    | LINK_START link-ref link-params LINK_END
        { $$ = {t: 'link', c: [$2].concat($3) }; }
    ;

link-ref
    : plain-text
        { $$ = $1; }
    ;

link-params
    : LINK_PARAM_SEPARATOR link-param
        { $$ = [$2]; }
    | LINK_PARAM_SEPARATOR
        { $$ = [null]; }
    | link-params LINK_PARAM_SEPARATOR link-param
        { $1.push($3); $$ = $1; }
    | link-params LINK_PARAM_SEPARATOR
        { $1.push(null); $$ = $1; }
    ;
link-param
    : text
        { $$ = $1; }
    ;

end-of-file
    : EOF
        { $$ = {t: 'eof'};}
    ;

