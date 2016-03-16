/**
 * This is a copy of Oliver W's gist: https://gist.github.com/oliverw/a3ba9d804d848417fac4
 * With some minor modifications to get it to work in typescript 1.8+
 *
 * How to use:
 * 1. Make sure it gets loaded via  <reference path="./rx-dom.d.ts" />
 * 2. So it gets loaded, you need to: import "rx-dom";  Example

 import * as Rx from "rx";  // Make sure Rx is loaded
 import "rx-dom";           // Make sure it gets loaded

 * you can then use it like:

 Rx.DOM.getJSON("url")....;

 */

/* tslint:disable */

declare module Rx {
    export module DOM {
        export interface AjaxSettings {
            async?: boolean;
            body?: string;
            // This options does not seem to be used in the code yet
            contentType?: string;
            crossDomain?: boolean;
            headers?: any;
            method?: string;
            password?: string;
            progressObserver?: Rx.Observer<any>;
            responseType?: string;
            url?: string;
            user?: string;
        }

        export interface AjaxSuccessResponse {
            response: any;
            status: number;
            responseType: string;
            xhr: XMLHttpRequest;
            originalEvent: Event;
        }

        export interface AjaxErrorResponse {
            type: string;
            status: number;
            xhr: XMLHttpRequest;
            originalEvent: Event;
        }

        export interface JsonpSettings {
            async?: boolean;
            jsonp?: string;
            jsonpCallback?: string;
            url?: string;
        }

        export interface JsonpSuccessResponse {
            response: any;
            status: number;
            responseType: string;
            originalEvent: Event;
        }

        export interface JsonpErrorResponse {
            type: string;
            status: number;
            originalEvent: Event;
        }

        export interface GeolocationOptions {
            enableHighAccuracy?: boolean;
            timeout?: number;
            maximumAge?: number;
        }

        // Events
        function fromEvent<T>(element:any, eventName:string, selector?:Function, useCapture?:boolean):Rx.Observable<T>;

        function ready():Rx.Observable<any>;

        // Event Shortcuts
        function blur(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<FocusEvent>;
        function change(element: Element, selector?:Function):Rx.Observable<Event>;
        function click(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function contextmenu(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function dblclick(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function error(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<Event>;
        function focus(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<FocusEvent>;
        function focusin(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function focusout(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function keydown(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<KeyboardEvent>;
        function keypress(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<KeyboardEvent>;
        function keyup(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<KeyboardEvent>;
        function load(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<UIEvent>;
        function mousedown(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function mouseenter(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function mouseleave(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function mousemove(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function mouseout(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function mouseover(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function mouseup(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<MouseEvent>;
        function resize(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<UIEvent>;
        function scroll(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<UIEvent>;
        function select(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<Event>;
        function submit(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<Event>;
        function unload(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<Event>;

        // Pointer Events
        function pointerdown(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;
        function pointerenter(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;
        function pointerleave(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;
        function pointermove(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;
        function pointerout(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;
        function pointerover(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;
        function pointerup(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<PointerEvent>;

        // Touch Events
        function touchcancel(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<TouchEvent>;
        function touchend(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<TouchEvent>;
        function touchmove(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<TouchEvent>;
        function touchstart(element: Element, selector?:Function, useCapture?:boolean):Rx.Observable<TouchEvent>;

        // Ajax
        function ajax(url:string):Rx.Observable<AjaxSuccessResponse | AjaxErrorResponse>;
        function ajax(settings:AjaxSettings):Rx.Observable<AjaxSuccessResponse | AjaxErrorResponse>;
        function get(url:string):Rx.Observable<AjaxSuccessResponse | AjaxErrorResponse>;
        function getJSON(url:string):Rx.Observable<string>;
        function post(url:string, body:any):Rx.Observable<AjaxSuccessResponse | AjaxErrorResponse>;
        function jsonpRequest(url:string):Rx.Observable<string>;
        function jsonpRequest(settings:JsonpSettings):Rx.Observable<JsonpSuccessResponse | JsonpErrorResponse>;

        // Server-Sent Events
        function fromEventSource<T>(url:string, openObservable?:Rx.Observer<T>):Rx.Observable<T>;

        // Web Sockets
        function fromWebSocket(url:string, protocol:string, openObserver?:Rx.Observer<Event>, closingObserver?:Rx.Observer<CloseEvent>):Rx.Subject<MessageEvent>;

        // Web Workers
        function fromWebWorker(url:string):Rx.Subject<string>;

        // Mutation Observers
        function fromMutationObserver(target:Node, options:MutationObserverInit):Rx.Observable<MutationEvent>;

        // Geolocation
        export module geolocation {
            function getCurrentPosition(geolocationOptions?:GeolocationOptions):Rx.Observable<Position>;
            function watchPosition(geolocationOptions?:GeolocationOptions):Rx.Observable<Position>;
        }
    }
}

declare module "rx.DOM" {
    export = Rx.DOM;
}

declare module "rx-dom" {
    export = Rx.DOM;
}
