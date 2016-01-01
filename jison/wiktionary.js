/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,21],$V1=[1,22],$V2=[1,23],$V3=[1,24],$V4=[1,25],$V5=[1,40],$V6=[1,41],$V7=[1,38],$V8=[1,27],$V9=[1,33],$Va=[1,34],$Vb=[1,5],$Vc=[49,50,51,58,59,65,71],$Vd=[16,22,26,30,34,71],$Ve=[16,22,26,30,34,49,50,51,58,59,65,71],$Vf=[16,71],$Vg=[16,22,71],$Vh=[16,22,26,71],$Vi=[16,22,26,30,71],$Vj=[16,22,26,30,34,58,71],$Vk=[16,22,26,30,34,49,50,51,56,58,59,61,63,65,71],$Vl=[16,18,22,26,30,34,49,50,51,56,58,59,61,63,65,67,69,71],$Vm=[61,63],$Vn=[67,69],$Vo=[1,119],$Vp=[49,50,51],$Vq=[1,133],$Vr=[49,50,51,56,59,61,63,65],$Vs=[2,84],$Vt=[1,151];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"wiki-page":3,"article":4,"end-of-file":5,"article-content":6,"sections":7,"paragraphs":8,"section1":9,"section2":10,"section3":11,"section4":12,"section5":13,"section1-title":14,"section1-content":15,"H1_BEG":16,"text":17,"H_END":18,"section1-content-item":19,"section2-title":20,"section2-content":21,"H2_BEG":22,"section2-content-item":23,"section3-title":24,"section3-content":25,"H3_BEG":26,"section3-content-item":27,"section4-title":28,"section4-content":29,"H4_BEG":30,"section4-content-item":31,"section5-title":32,"section5-content":33,"H5_BEG":34,"section5-content-item":35,"paragraph":36,"lines-of-text":37,"blank-line":38,"line-of-text":39,"text-content":40,"line-ending":41,"template":42,"link":43,"rich-text":44,"bold-text":45,"italic-text":46,"plain-text":47,"text-constant":48,"TEXT":49,"UNICODE":50,"S_QUOTE":51,"italic-text-inner-text":52,"bold-text-inner":53,"italic-text-inner":54,"bold-text-inner-text":55,"NEWLINE":56,"blank-lines":57,"EMPTY_LINE":58,"TEMPLATE_START":59,"template-name":60,"TEMPLATE_END":61,"template-params":62,"TEMPLATE_PARAM_SEPARATOR":63,"template-param":64,"LINK_START":65,"link-ref":66,"LINK_END":67,"link-params":68,"LINK_PARAM_SEPARATOR":69,"link-param":70,"EOF":71,"$accept":0,"$end":1},
terminals_: {2:"error",16:"H1_BEG",18:"H_END",22:"H2_BEG",26:"H3_BEG",30:"H4_BEG",34:"H5_BEG",49:"TEXT",50:"UNICODE",51:"S_QUOTE",56:"NEWLINE",58:"EMPTY_LINE",59:"TEMPLATE_START",61:"TEMPLATE_END",63:"TEMPLATE_PARAM_SEPARATOR",65:"LINK_START",67:"LINK_END",69:"LINK_PARAM_SEPARATOR",71:"EOF"},
productions_: [0,[3,2],[3,1],[4,1],[6,1],[6,1],[6,2],[6,2],[7,1],[7,1],[7,1],[7,1],[7,1],[7,2],[7,2],[7,2],[7,2],[7,2],[9,2],[9,1],[14,3],[15,1],[15,2],[19,1],[19,1],[19,1],[19,1],[19,1],[10,2],[10,1],[20,3],[21,1],[21,2],[23,1],[23,1],[23,1],[23,1],[11,2],[11,1],[24,3],[25,1],[25,2],[27,1],[27,1],[27,1],[12,2],[12,1],[28,3],[29,1],[29,2],[31,1],[31,1],[13,2],[13,1],[32,3],[33,1],[33,2],[35,1],[8,1],[8,2],[36,1],[36,1],[36,2],[37,2],[37,1],[39,2],[39,1],[40,1],[40,1],[40,1],[17,1],[17,2],[44,1],[44,1],[44,1],[47,1],[47,2],[48,1],[48,1],[46,5],[52,2],[52,2],[52,1],[52,1],[54,5],[45,7],[55,2],[55,2],[55,1],[55,1],[53,7],[41,1],[57,2],[57,1],[38,1],[42,3],[42,4],[60,1],[60,2],[60,2],[62,2],[62,1],[62,3],[62,2],[64,1],[64,1],[64,2],[64,2],[43,3],[43,4],[66,1],[68,2],[68,1],[68,3],[68,2],[70,1],[5,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return {t: 'wiki-page', c:[$$[$0-1], $$[$0]]};
break;
case 2:
 return {t: 'wiki-page', c:[$$[$0]]};
break;
case 3: case 97: case 98: case 110: case 115:
 this.$ = $$[$0]; 
break;
case 4: case 5:
 this.$ = {t: 'article', c:[$$[$0]]};
break;
case 6: case 7: case 13: case 14: case 15: case 16: case 17: case 22: case 32: case 41: case 49: case 56: case 59: case 63: case 71: case 80: case 81: case 86: case 87: case 92: case 106:
 $$[$0-1].c.push($$[$0]); this.$ = $$[$0-1]; 
break;
case 8: case 9: case 10: case 11: case 12:
 this.$ = {t: 'sections', c:[$$[$0]]}; 
break;
case 18:
 this.$ = {t: 'section1', c:[$$[$0-1], $$[$0]]}; 
break;
case 19:
 this.$ = {t: 'section1', c:[$$[$0]]}; 
break;
case 20:
 this.$ = {t: 'section1-title', c:[$$[$0-1]]}; 
break;
case 21:
 this.$ = {t: 'section1-content', c:[$$[$0]]}; 
break;
case 28:
 this.$ = {t: 'section2', c:[$$[$0-1], $$[$0]]}; 
break;
case 29:
 this.$ = {t: 'section2', c:[$$[$0]]}; 
break;
case 30:
 this.$ = {t: 'section2-title', c:[$$[$0-1]]}; 
break;
case 31:
 this.$ = {t: 'section2-content', c:[$$[$0]]}; 
break;
case 37:
 this.$ = {t: 'section3', c:[$$[$0-1], $$[$0]]}; 
break;
case 38:
 this.$ = {t: 'section3', c:[$$[$0]]}; 
break;
case 39:
 this.$ = {t: 'section3-title', c:[$$[$0-1]]}; 
break;
case 40:
 this.$ = {t: 'section3-content', c:[$$[$0]]}; 
break;
case 45:
 this.$ = {t: 'section4', c:[$$[$0-1], $$[$0]]}; 
break;
case 46:
 this.$ = {t: 'section4', c:[$$[$0]]}; 
break;
case 47:
 this.$ = {t: 'section4-title', c:[$$[$0-1]]}; 
break;
case 48:
 this.$ = {t: 'section4-content', c:[$$[$0]]}; 
break;
case 52:
 this.$ = {t: 'section5', c:[$$[$0-1], $$[$0]]}; 
break;
case 53:
 this.$ = {t: 'section5', c:[$$[$0]]}; 
break;
case 54:
 this.$ = {t: 'section5-title', c:[$$[$0-1]]}; 
break;
case 55:
 this.$ = {t: 'section5-content', c:[$$[$0]]}; 
break;
case 58:
 this.$ = {t: 'paragraphs', c:[$$[$0]]};
break;
case 60: case 61:
 this.$ = {t: 'paragraph', c:[$$[$0]]};
break;
case 62:
 this.$ = {t: 'paragraph', c:[$$[$0-1], $$[$0]]};
break;
case 64:
 this.$ = {t: 'lines-of-text', c:[$$[$0]]}; 
break;
case 65:
 this.$ = {t: 'line-of-text', c:[$$[$0-1], $$[$0]]}; 
break;
case 66:
 this.$ = {t: 'line-of-text', c:[$$[$0]]}; 
break;
case 70:
 this.$ = {t: 'text', c: $$[$0]}; 
break;
case 75:
 this.$ = {t: 'plain-text', v: $$[$0]}; 
break;
case 76:
 $$[$0-1].v += $$[$0]; this.$ = $$[$0-1]; 
break;
case 77:
 this.$ = $$[$0] 
break;
case 78:
 this.$ = JSON.parse('"'+$$[$0]+'"'); 
break;
case 79:
 this.$ = {t: 'italic-text', c: $$[$0-2].c}; 
break;
case 82: case 83:
 this.$ = {t: 'italic-text-inner', c: [$$[$0]]}; 
break;
case 84:
 this.$ = {t: 'italic-text', c: [$$[$0-2]]}; 
break;
case 85:
 this.$ = {t: 'bold-text', c: $$[$0-3].c}; 
break;
case 88: case 89:
 this.$ = {t: 'bold-text-inner', c: [$$[$0]]}; 
break;
case 90:
 this.$ = {t: 'bold-text', c: [$$[$0-3]]}; 
break;
case 91:
 this.$ = {t: 'line-end'};
break;
case 93:
 this.$ = {t: 'blank-lines', c: [$$[$0]]};
break;
case 94:
 this.$ = {t: 'blank-line'};
break;
case 95:
 this.$ = {t: 'template', name: $$[$0-1], params: [] }; 
break;
case 96:
 this.$ = {t: 'template', name: $$[$0-2], params: $$[$0-1] }; 
break;
case 99: case 107:
 this.$ = $$[$0-1]; 
break;
case 100: case 111:
 this.$ = [$$[$0]]; 
break;
case 101: case 112:
 this.$ = [null]; 
break;
case 102: case 113:
 $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 103: case 114:
 $$[$0-1].push(null); this.$ = $$[$0-1]; 
break;
case 104:
 this.$ = {t: 'template-param', c: [$$[$0]] }; 
break;
case 105:
 this.$ = {t: 'template-param', c: [] }; 
break;
case 108:
 this.$ = {t: 'link', c:[$$[$0-1]] }; 
break;
case 109:
 this.$ = {t: 'link', c: [$$[$0-2]].concat($$[$0-1]) }; 
break;
case 116:
 this.$ = {t: 'eof'};
break;
}
},
table: [{3:1,4:2,5:3,6:4,7:6,8:7,9:8,10:9,11:10,12:11,13:12,14:14,16:$V0,17:29,20:15,22:$V1,24:16,26:$V2,28:17,30:$V3,32:18,34:$V4,36:13,37:19,38:20,39:26,40:28,42:30,43:31,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va,71:$Vb},{1:[3]},{5:42,71:$Vb},{1:[2,2]},{7:44,8:43,9:8,10:9,11:10,12:11,13:12,14:14,16:$V0,17:29,20:15,22:$V1,24:16,26:$V2,28:17,30:$V3,32:18,34:$V4,36:13,37:19,38:20,39:26,40:28,42:30,43:31,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va,71:[2,3]},{1:[2,116]},o($Vc,[2,4],{14:14,20:15,24:16,28:17,32:18,9:45,10:46,11:47,12:48,13:49,16:$V0,22:$V1,26:$V2,30:$V3,34:$V4}),o($Vd,[2,5],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,8]),o($Ve,[2,9]),o($Ve,[2,10]),o($Ve,[2,11]),o($Ve,[2,12]),o($Ve,[2,58]),o($Vf,[2,19],{36:13,20:15,24:16,28:17,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,15:51,19:52,8:53,10:54,11:55,12:56,13:57,22:$V1,26:$V2,30:$V3,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Vg,[2,29],{36:13,24:16,28:17,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,21:58,23:59,8:60,11:61,12:62,13:63,26:$V2,30:$V3,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Vh,[2,38],{36:13,28:17,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,25:64,27:65,8:66,12:67,13:68,30:$V3,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Vi,[2,46],{36:13,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,29:69,31:70,8:71,13:72,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Vd,[2,53],{36:13,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,33:73,35:74,8:75,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Vj,[2,60],{40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,39:76,49:$V5,50:$V6,51:$V7,59:$V9,65:$Va}),o($Vj,[2,61],{39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,37:77,49:$V5,50:$V6,51:$V7,59:$V9,65:$Va}),{17:78,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{17:79,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{17:80,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{17:81,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{17:82,44:32,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},o($Ve,[2,64]),o($Ve,[2,94]),o($Ve,[2,66],{41:83,56:[1,84]}),o([16,22,26,30,34,56,58,59,61,63,65,71],[2,67],{45:35,46:36,47:37,48:39,44:85,49:$V5,50:$V6,51:$V7}),o($Vk,[2,68]),o($Vk,[2,69]),o($Vl,[2,70]),{47:87,48:39,49:$V5,50:$V6,56:[1,88],60:86},{47:90,48:39,49:$V5,50:$V6,66:89},o($Vl,[2,72]),o($Vl,[2,73]),o([16,18,22,26,30,34,51,56,58,59,61,63,65,67,69,71],[2,74],{48:91,49:$V5,50:$V6}),{51:[1,92]},o($Vl,[2,75]),o($Vl,[2,77]),o($Vl,[2,78]),{1:[2,1]},o($Vd,[2,6],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Vc,[2,7],{14:14,20:15,24:16,28:17,32:18,9:45,10:46,11:47,12:48,13:49,16:$V0,22:$V1,26:$V2,30:$V3,34:$V4}),o($Ve,[2,13]),o($Ve,[2,14]),o($Ve,[2,15]),o($Ve,[2,16]),o($Ve,[2,17]),o($Ve,[2,59]),o($Vf,[2,18],{36:13,20:15,24:16,28:17,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,8:53,10:54,11:55,12:56,13:57,19:93,22:$V1,26:$V2,30:$V3,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,21]),o($Vd,[2,23],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,24]),o($Ve,[2,25]),o($Ve,[2,26]),o($Ve,[2,27]),o($Vg,[2,28],{36:13,24:16,28:17,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,8:60,11:61,12:62,13:63,23:94,26:$V2,30:$V3,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,31]),o($Vd,[2,33],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,34]),o($Ve,[2,35]),o($Ve,[2,36]),o($Vh,[2,37],{36:13,28:17,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,8:66,12:67,13:68,27:95,30:$V3,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,40]),o($Vd,[2,42],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,43]),o($Ve,[2,44]),o($Vi,[2,45],{36:13,32:18,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,8:71,13:72,31:96,34:$V4,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,48]),o($Vd,[2,50],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,51]),o($Vd,[2,52],{36:13,37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,8:75,35:97,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,55]),o($Vd,[2,57],{37:19,38:20,39:26,40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,36:50,49:$V5,50:$V6,51:$V7,58:$V8,59:$V9,65:$Va}),o($Ve,[2,63]),o($Vj,[2,62],{40:28,17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,39:76,49:$V5,50:$V6,51:$V7,59:$V9,65:$Va}),{18:[1,98],44:85,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{18:[1,99],44:85,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{18:[1,100],44:85,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{18:[1,101],44:85,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},{18:[1,102],44:85,45:35,46:36,47:37,48:39,49:$V5,50:$V6,51:$V7},o($Ve,[2,65]),o($Ve,[2,91]),o($Vl,[2,71]),{61:[1,103],62:104,63:[1,105]},o($Vm,[2,97],{48:91,49:$V5,50:$V6,56:[1,106]}),{47:107,48:39,49:$V5,50:$V6},{67:[1,108],68:109,69:[1,110]},o($Vn,[2,110],{48:91,49:$V5,50:$V6}),o($Vl,[2,76]),{47:113,48:39,49:$V5,50:$V6,51:[1,111],52:112,53:114},o($Ve,[2,22]),o($Ve,[2,32]),o($Ve,[2,41]),o($Ve,[2,49]),o($Ve,[2,56]),o($Ve,[2,20]),o($Ve,[2,30]),o($Ve,[2,39]),o($Ve,[2,47]),o($Ve,[2,54]),o($Vk,[2,95]),{61:[1,115],63:[1,116]},o($Vm,[2,101],{17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,64:117,40:118,49:$V5,50:$V6,51:$V7,56:$Vo,59:$V9,65:$Va}),o($Vm,[2,99]),o($Vm,[2,98],{48:91,49:$V5,50:$V6}),o($Vk,[2,108]),{67:[1,120],69:[1,121]},o($Vn,[2,112],{44:32,45:35,46:36,47:37,48:39,70:122,17:123,49:$V5,50:$V6,51:$V7}),{47:126,48:39,49:$V5,50:$V6,51:[1,125],54:127,55:124},{47:129,48:39,49:$V5,50:$V6,51:[1,128],53:130},{48:91,49:$V5,50:$V6,51:[2,82]},o($Vp,[2,83]),o($Vk,[2,96]),o($Vm,[2,103],{17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,40:118,64:131,49:$V5,50:$V6,51:$V7,56:$Vo,59:$V9,65:$Va}),o($Vm,[2,100],{17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,40:132,49:$V5,50:$V6,51:$V7,56:$Vq,59:$V9,65:$Va}),o($Vr,[2,104]),o($Vr,[2,105]),o($Vk,[2,109]),o($Vn,[2,114],{44:32,45:35,46:36,47:37,48:39,17:123,70:134,49:$V5,50:$V6,51:$V7}),o($Vn,[2,111]),o($Vn,[2,115],{45:35,46:36,47:37,48:39,44:85,49:$V5,50:$V6,51:$V7}),{47:136,48:39,49:$V5,50:$V6,51:[1,135],54:137},{51:[1,138]},{48:91,49:$V5,50:$V6,51:[2,88]},o($Vp,[2,89]),{51:[1,139]},{48:91,49:$V5,50:$V6,51:[2,80]},o($Vp,[2,81]),o($Vm,[2,102],{17:29,42:30,43:31,44:32,45:35,46:36,47:37,48:39,40:132,49:$V5,50:$V6,51:$V7,56:$Vq,59:$V9,65:$Va}),o($Vr,[2,106]),o($Vr,[2,107]),o($Vn,[2,113]),{51:[1,140]},{48:91,49:$V5,50:$V6,51:[2,86]},o($Vp,[2,87]),{47:141,48:39,49:$V5,50:$V6},o([16,18,22,26,30,34,49,50,56,58,59,61,63,65,67,69,71],[2,79],{51:[1,142]}),{47:144,48:39,49:$V5,50:$V6,51:[1,143]},{48:91,49:$V5,50:$V6,51:[1,145]},{47:146,48:39,49:$V5,50:$V6},o($Vl,[2,85]),{48:91,49:$V5,50:$V6,51:[1,147]},{51:[1,148]},{48:91,49:$V5,50:$V6,51:[1,149]},{51:[1,150]},o([49,50],$Vs,{51:$Vt}),{51:[1,152]},o($Vp,$Vs),o($Vp,[2,90]),{51:$Vt}],
defaultActions: {3:[2,2],5:[2,116],42:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 18
break;
case 1:
                                        if (yy_.yylloc.first_column) {
                                            return 49               /* '=' anywhere but at the begging becomes just text */
                                        } else {
                                            return 'H'+yy_.yytext.trim().length+'_BEG';
                                        }
                                    
break;
case 2:
                                        if (yy_.yylloc.first_column)
                                            return 56
                                        else
                                            return 58;
                                    
break;
case 3:
                                        this.begin('template'); return 59;
                                    
break;
case 4:
                                        this.popState(); return 61;
                                    
break;
case 5:return 63
break;
case 6:
                                        this.begin('link'); return 65;
                                    
break;
case 7:
                                        this.popState(); return 67;
                                    
break;
case 8:return 69
break;
case 9:return 50
break;
case 10:return 71
break;
case 11:return 49
break;
case 12:return 49
break;
case 13:return 49
break;
}
},
rules: [/^(?:([ \t])*[=]+([ \t])*(\n|$))/,/^(?:([ \t])*[=]{1,5}([ \t])*)/,/^(?:(\r|\n|\n\r|\r\n))/,/^(?:[{][{])/,/^(?:[}][}])/,/^(?:[|])/,/^(?:[[][[])/,/^(?:[\]][\]])/,/^(?:[|])/,/^(?:\\u[0-9a-fA-F]{4})/,/^(?:$)/,/^(?:([^|[\]*#:;<>='{}\n])+)/,/^(?:['])/,/^(?:.)/],
conditions: {"template":{"rules":[0,1,2,3,4,5,6,9,10,11,12,13],"inclusive":true},"link":{"rules":[0,1,2,3,6,7,8,9,10,11,12,13],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,6,9,10,11,12,13],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}