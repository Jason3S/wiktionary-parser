%lex

PLUGIN_ID   					[A-Z]+
INLINE_PLUGIN_ID				[a-z]+
SMILE							[a-z]+

%s bold box center colortext italic header6 header5 header4 header3 header2 header1 header link strikethrough table titlebar underscore wikilink

    %{
     function myFunc() {}
    %}

%%

<header>/[\n]	    %{ this.popState(); return 'HEADER_END'; %}
<header>$           %{ this.popState(); return 'HEADER_END'; %}
[\n]("!")	        %{ this.begin('header'); return  'HEADER_START'; %}
<<EOF>>             return 'EOF'
(.)                 return 'TEXT'
(\n)                return 'TEXT'

/lex

%start wiki-page

%% /* language grammar */


wiki-page
    : page-content EOF
        {return $1;}
    ;

page-content
    : header
        {$$ = $1;}
    | content
        {$$ = $1;}
    | page-content header
        {$$ = [$1,$2].join('|');}
    | page-content header content
        {$$ = [$1,$2,$3].join('|');}
    ;

header
    : HEADER_START content HEADER_END
        {$$ = '[' + $2 + ']';}
    ;

content
    : TEXT
        {$$ = $1;}
    | content TEXT
        {$$ = $1 + $2;}
    ;
