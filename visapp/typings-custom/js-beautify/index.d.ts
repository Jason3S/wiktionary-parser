// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/56295f5058cac7ae458540423c50ac2dcf9fc711/js-beautify/js-beautify.d.ts
// Type definitions for js_beautify
// Project: https://github.com/beautify-web/js-beautify/
// Definitions by: Josh Goldberg <https://github.com/JoshuaKGoldberg/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Type definitions for js_beautify
// Project: https://github.com/beautify-web/js-beautify/
// Definitions by: Josh Goldberg <https://github.com/JoshuaKGoldberg/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'js-beautify' {
    interface JsBeautifyOptions {
        indent_size?: number;
        indent_char?: string;
        eol?: string;
        indent_level?: number;
        indent_with_tabs?: boolean;
        preserve_newlines?: boolean;
        max_preserve_newlines?: number;
        jslint_happy?: boolean;
        space_after_anon_function?: boolean;
        brace_style?: string;
        keep_array_indentation?: boolean;
        keep_function_indentation?: boolean;
        space_before_conditional?: boolean;
        break_chained_methods?: boolean;
        eval_code?: boolean;
        unescape_strings?: boolean;
        wrap_line_length?: number;
        wrap_attributes?: string;
        wrap_attributes_indent_size?: number;
        end_with_newline?: boolean;
    }

    type JsBeautify = (js_source_text: string, options?: JsBeautifyOptions) => string;

    const jsBeautify: JsBeautify;

    export = jsBeautify;
}
