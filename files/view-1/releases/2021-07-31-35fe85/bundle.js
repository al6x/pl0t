
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function () {
    'use strict';

    // Ignore this schema, it's needed only if you would like to extend PL0T
    const plot_config = {
        blocks_limit: 100,
        narrow_width: 480,
        height_in_narrow_width_mode: 200,
        parsers: {},
        blocks_for_file_extensions: {
            md: 'text',
            markdown: 'text',
            text: 'text',
            txt: 'text'
        },
        blocks: {},
        apps: {}
    };
    window.plot_config = plot_config; // Also available globally

    const version = 0.1;
    const plot_api = { version };
    window.plot_api = plot_api; // Also available globally

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run$1(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run$1);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run$1).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function get_env(key, deflt) {
        var _a;
        const v = (_a = window) === null || _a === void 0 ? void 0 : _a.env[key];
        return v != undefined ? v : (deflt != undefined ? deflt : undefined);
    }

    // -------------------------------------------------------------------------------------------------
    // support -----------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------
    // deno, is_browser --------------------------------------------------------------------------------
    let deno = 'Deno' in window ? window.Deno : undefined;
    const is_browser = deno == undefined;
    // Test ---------------------------------------------------------------------
    const tests = [];
    let last_runned_test = 0, testing_in_progress = false;
    function run_tests() {
        if (testing_in_progress)
            return;
        testing_in_progress = true;
        setTimeout(async () => {
            while (last_runned_test < tests.length) {
                let { name, test } = tests[last_runned_test];
                last_runned_test += 1;
                try {
                    console.log(`  test | ${name}`);
                    let promise = test();
                    if (promise)
                        await promise;
                }
                catch (e) {
                    console.error(`  test | ${name} failed`);
                    console.error(e);
                    if (!is_browser)
                        throw e;
                }
            }
            // console.log(`  test | success`)
            testing_in_progress = false;
        }, 0);
    }
    let test_enabled_s;
    try {
        test_enabled_s = (get_env("test") || "").toLowerCase();
    }
    catch (_a) {
        test_enabled_s = "false";
    }
    let slow_test_enabled = test_enabled_s == "all";
    let test_enabled = slow_test_enabled || (test_enabled_s == "true");
    function test$1(name, test) {
        name = is_string(name) ? name : name.name;
        tests.push({ name, test });
        if (test_enabled || name.toLowerCase() == test_enabled_s)
            run_tests();
    }
    function slow_test(name, test) {
        name = is_string(name) ? name : name.name;
        tests.push({ name, test });
        if (slow_test_enabled || name.toLowerCase() == test_enabled_s)
            run_tests();
    }
    window.run_tests = run_tests;
    window.test = test$1;
    window.slow_test = slow_test;
    window.p = p;
    window.discard = function (v) { };
    window.is_number = function (v) {
        return (typeof v == 'number') && Number.isFinite(v); // also checking for NaN
    };
    window.is_array = function (v) { return Array.isArray(v); };
    window.is_string = function (v) { return typeof v == 'string'; };
    window.is_object = function (v) {
        return typeof v == 'object' && v !== null;
    };
    window.is_function = function (v) { return typeof v == 'function'; };
    window.is_undefined = function (v) { return v === undefined; };
    window.set_timeout = function (fn, delay_ms) { return setTimeout(fn, delay_ms); };
    window.clear_timeout = clearTimeout;
    window.set_interval = function (fn, delay_ms, immediate = false) {
        if (immediate)
            fn();
        return setInterval(fn, delay_ms);
    };
    window.clear_timeout = clearTimeout;
    window.to_json = to_json$1;
    window.from_json = from_json;
    window.ensure = function ensure(value, info) {
        if (value === undefined) {
            throw new Error(`value${info ? ' ' + info : ''} not defined`);
        }
        else if (is_object(value) && ('is_error' in value)) {
            if (value.is_error)
                throw new Error(value.message || `value${info ? ' ' + info : ''} not found`);
            else
                return value.value;
        }
        else {
            return value;
        }
    };
    window.ensure_error = ensure_error;
    function extend(prototype, functions) {
        for (const name in functions) {
            Object.defineProperty(prototype, name, { value: functions[name], configurable: false, writable: true });
        }
    }
    Object.size = function (o) {
        let i = 0;
        for (let k in o)
            if (o.hasOwnProperty(k))
                i++;
        return i;
    },
        Object.is_empty = function (o) {
            for (let k in o)
                if (o.hasOwnProperty(k))
                    return false;
            return true;
        };
    extend(Object.prototype, {
        is_equal: function (another) {
            return is_equal(this, another);
        },
        to_s: function () {
            return '' + this;
        },
        clone: function () {
            return Object.assign({}, this);
        },
        to_success: function () {
            return { is_error: false, value: this };
        }
    });
    extend(Array.prototype, {
        add: function (v) {
            this.push(v);
        },
        batch,
        size: function () {
            return this.length;
        },
        is_empty: function () {
            return this.length == 0;
        },
        clone: function () {
            return [...this];
        },
        has(finder) {
            const predicate = finder instanceof Function ? finder : (v) => v == finder;
            for (let i = 0; i < this.length; i++) {
                const v = this[i];
                if (predicate(v, i))
                    return true;
            }
            return false;
        },
        group_by(f) {
            const map = new Map();
            for (let i = 0; i < this.length; i++) {
                const v = this[i];
                const key = f(v, i);
                let group = map.get(key);
                if (!group) {
                    group = [];
                    map.set(key, group);
                }
                group.push(v);
            }
            return map;
        },
        index(finder) {
            const predicate = finder instanceof Function ? finder : (v) => v == finder;
            for (let i = 0; i < this.length; i++)
                if (predicate(this[i], i))
                    return i;
            return undefined;
        },
        take: function (n) {
            return this.slice(0, n);
        },
        filter_map(fn) {
            const filtered = [];
            for (let i = 0; i < this.length; i++) {
                const r = fn(this[i], i);
                if (r !== undefined)
                    filtered.push(r);
            }
            return filtered;
        },
        skip_undefined() {
            return this.filter_map((v) => v);
        },
        find(finder) {
            const predicate = finder instanceof Function ? finder : (v) => v == finder;
            for (let i = 0; i < this.length; i++) {
                const v = this[i];
                if (predicate(v, i))
                    return v;
            }
            return undefined;
        },
        first(n) {
            const l = this.length;
            if (n === undefined) {
                if (l < 1)
                    throw new Error(`can't get first elements from empty list`);
                return this[0];
            }
            else {
                if (l < n)
                    throw new Error(`can't get first ${n} elements from array of length ${l}`);
                else
                    return this.slice(0, n);
            }
        },
        last(n) {
            const l = this.length;
            if (n === undefined) {
                if (l < 1)
                    throw new Error(`can't get last elements from empty array`);
                return this[l - 1];
            }
            else {
                if (l < n)
                    throw new Error(`can't get last ${n} elements from array of length ${l}`);
                else
                    return this.slice(l - n, l);
            }
        },
        last_index(finder) {
            const predicate = finder instanceof Function ? finder : (v) => v == finder;
            for (let i = this.length - 1; i >= 0; i--)
                if (predicate(this[i], i))
                    return i;
            return undefined;
        },
        max_index(f) {
            if (this.length == 0)
                throw new Error(`can't find max_index for empty array`);
            f = f || ((v) => v);
            if (this.length == 0)
                return -1;
            let max = f(this[0]), max_i = 0;
            for (let i = 1; i < this.length; i++) {
                let m = f(this[i]);
                if (m > max) {
                    max = m;
                    max_i = i;
                }
            }
            return max_i;
        },
        median(is_sorted = false) {
            return this.quantile(.5, is_sorted);
        },
        min_index(f) {
            if (this.length == 0)
                throw new Error(`can't find min_index for empty array`);
            f = f || ((v) => v);
            if (this.length == 0)
                return -1;
            let min = f(this[0]), minI = 0;
            for (let i = 1; i < this.length; i++) {
                let m = f(this[i]);
                if (m < min) {
                    min = m;
                    minI = i;
                }
            }
            return minI;
        },
        quantile(q, is_sorted = false) {
            const sorted = is_sorted ? this : [...this].sort((a, b) => a - b);
            const pos = (sorted.length - 1) * q;
            const base = Math.floor(pos);
            const rest = pos - base;
            if (sorted[base + 1] !== undefined) {
                return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
            }
            else {
                return sorted[base];
            }
        },
        each(fn) {
            this.forEach(fn);
        },
        partition(splitter) {
            const selected = [], rejected = [];
            const f = splitter instanceof Function ? splitter : (_v, i) => splitter.includes(i);
            for (let i = 0; i < this.length; i++) {
                const v = this[i];
                if (f(v, i))
                    selected.push(v);
                else
                    rejected.push(v);
            }
            return [selected, rejected];
        },
        unique,
        shuffle(random) {
            if (random == undefined)
                random = () => Math.random();
            const list = [...this];
            for (let i = list.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [list[i], list[j]] = [list[j], list[i]];
            }
            return list;
        },
        sort_by,
        sum() {
            let sum = 0;
            for (const v of this)
                sum += v;
            return sum;
        }
    });
    function batch(n) {
        const result = [];
        let i = 0;
        while (true) {
            const group = [];
            if (i < this.length)
                result.push(group);
            for (let j = 0; j < n; j++) {
                if ((i + j) < this.length)
                    group.push(this[i + j]);
                else
                    return result;
            }
            i += n;
        }
    }
    test$1(batch, () => {
        assert.equal([1, 2, 3].batch(2), [[1, 2], [3]]);
        assert.equal([1, 2].batch(2), [[1, 2]]);
        assert.equal([1].batch(2), [[1]]);
        assert.equal([].batch(2), []);
    });
    window.Hash = class Hash {
        constructor(map) {
            if (is_undefined(map))
                this.m = new Map();
            else if (map instanceof Map)
                this.m = new Map(map);
            else if (map instanceof Hash)
                this.m = new Map(map.m);
            else
                throw "invalid usage";
        }
        map(f) {
            const h = new Hash();
            for (const [k, v] of this.m)
                h.set(k, f(v, k));
            return h;
        }
        each(f) {
            for (const [k, v] of this.m)
                f(v, k);
        }
        set(k, v) { this.m.set(k, v); }
        get(k) { return this.m.get(k); }
        size() { return this.m.size; }
        is_empty() { return this.m.size == 0; }
        values() {
            const values = [];
            for (const v of this.m.values())
                values.add(v);
            return values;
        }
        keys() {
            const keys = [];
            for (const k of this.m.keys())
                keys.add(k);
            return keys;
        }
        entries() {
            const entries = [];
            for (const [k, v] of this.m.entries())
                entries.add([v, k]);
            return entries;
        }
        del(k) { this.m.delete(k); }
        has(k) { return this.m.has(k); }
        clone() { return new Hash(this); }
        to_json_hook() {
            const h = {};
            for (const [k, v] of this.m)
                h['' + k] = v;
            return h;
        }
        toJSON() { return this.to_json_hook(); }
    };
    extend(String.prototype, {
        size: function () {
            return this.length;
        },
        is_empty: function () {
            return this == "";
        },
        clone: function () {
            return '' + this;
        },
        take: function (n) {
            return this.slice(0, n);
        },
        to_error: function () {
            return { is_error: true, message: this };
        },
        downcase: function () {
            return this.toLowerCase();
        },
        upcase: function () {
            return this.toUpperCase();
        },
        trim() {
            return this.replace(/^[\t\s\n]+|[\t\s\n]+$/g, '');
        },
        dedent,
        last(n) {
            const l = this.length;
            if (n === undefined) {
                if (l < 1)
                    throw new Error(`can't get last elements from empty string`);
                return this[l - 1];
            }
            else {
                if (l < n)
                    throw new Error(`can't get last ${n} elements from string of length ${l}`);
                else
                    return this.slice(l - n, l);
            }
        }
    });
    // dedent ------------------------------------------------------------------------------------------
    function dedent() {
        const text = this.replace(/^\s*\n|[\n\s]+$/, ""); // Replacing the first and last empty line
        const match = /^(\s+)/.parse(text);
        if (match.length == 0)
            return text;
        return text.split("\n").map((s) => s.startsWith(match[0]) ? s.replace(match[0], '') : s).join("\n");
        // return text.replace(new RegExp("^\\s{" + match[0].length + "}", "gm"), "")
    }
    test$1("dedent", () => {
        assert.equal(dedent.call("\n  a\n  b\n    c"), "a\nb\n  c");
    });
    extend(Number.prototype, {
        round,
        pow(y) { return Math.pow(this, y); }
    });
    function round(digits = 0) {
        return digits == 0 ?
            Math.round(this) :
            Math.round((this + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
    }
    test$1("round", () => {
        assert.equal(round.call(0.05860103881518906, 2), 0.06);
    });
    function to_safe() {
        const self = this;
        return function (...args) {
            try {
                return { is_error: false, value: self(...args) };
            }
            catch (e) {
                return { is_error: true, message: ensure_error(e).message };
            }
        };
    }
    function debounce(timeout, immediate = false) {
        let timer = undefined, self = this;
        return ((...args) => {
            if (immediate) {
                immediate = false;
                self(...args);
            }
            else {
                if (timer)
                    clearTimeout(timer);
                timer = setTimeout(() => self(...args), timeout);
            }
        });
    }
    function once(f) {
        let called = false, result = undefined;
        return function () {
            if (called)
                return result;
            result = f.apply(this, arguments);
            called = true;
            return result;
        };
    }
    extend(Function.prototype, { to_safe, debounce, once });
    extend(RegExp.prototype, { parse, parse_named, parse1, parse2, parse3 });
    // parse -------------------------------------------------------------------------------------------
    function parse(s) {
        const found = s.match(this);
        if (!found)
            return [];
        if (found.length == 1)
            return []; // matched but there's no capture groups
        return found.slice(1, found.length);
    }
    test$1("parse", () => {
        assert.equal(parse.call(/.+ (\d+) (\d+)/, "a 22 45"), ["22", "45"]);
        assert.equal(parse.call(/[^;]+;/, "drop table; create table;"), []);
    });
    // parse_named -------------------------------------------------------------------------------------
    function parse_named(s) {
        const found = s.match(this);
        return (found === null || found === void 0 ? void 0 : found.groups) || {};
    }
    test$1("parseNamed", () => {
        assert.equal(parse_named.call(/.+ (?<a>\d+) (?<b>\d+)/, "a 22 45"), { "a": "22", "b": "45" });
    });
    // parse1,2,3,4 ------------------------------------------------------------------------------------
    function parse1(s) {
        const found = this.parse(s);
        if (found.length != 1)
            throw new Error(`expected 1 match but found ${found.length}`);
        return found[0];
    }
    function parse2(s) {
        const found = this.parse(s);
        if (found.length != 2)
            throw new Error(`expected 2 matches but found ${found.length}`);
        return [found[0], found[1]];
    }
    function parse3(s) {
        const found = this.parse(s);
        if (found.length != 3)
            throw new Error(`expected 3 matches but found ${found.length}`);
        return [found[0], found[1], found[2]];
    }
    // -------------------------------------------------------------------------------------------------
    // Helpers -----------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------
    // p -----------------------------------------------------------------------------------------------
    function pretty_print(v, colors = false) {
        return deno && is_object(v) ? deno.inspect(v, { colors }) : v;
    }
    function p(...args) {
        if (is_browser)
            console.log(...args);
        else {
            const formatted = args.map((v) => pretty_print(v, true));
            // It won't printed properly for multiple arguments
            args.length == 1 ? console.log(...formatted) : console.log(...formatted);
        }
    }
    // assert ------------------------------------------------------------------------------------------
    const assert_impl = function (condition, message) {
        const messageString = message ? (message instanceof Function ? message() : message) : 'Assertion error!';
        if (!condition)
            throw new Error(messageString);
    };
    // assert.warn = (condition, message) => { if (!condition) log('warn', message || 'Assertion error!') }
    assert_impl.equal = (a, b, message) => {
        if (!is_equal(a, b)) {
            const messageString = message ?
                (message instanceof Function ? message() : message) :
                `Assertion error: ${to_json$1(a, true)} != ${to_json$1(b, true)}`;
            throw new Error(messageString);
        }
    };
    assert_impl.fail = (cb, message) => {
        let failed = false;
        try {
            cb();
        }
        catch (_a) {
            failed = true;
        }
        if (!failed) {
            const messageString = message ?
                (message instanceof Function ? message() : message) :
                `Assertion error: expected to fail but didn't`;
            throw new Error(messageString);
        }
    };
    assert_impl.aequal = (a, b, message, deltaRelative) => {
        deltaRelative = deltaRelative || 0.001;
        const average = (Math.abs(a) + Math.abs(b)) / 2;
        const deltaAbsolute = average * deltaRelative;
        if (Math.abs(a - b) > deltaAbsolute) {
            const messageString = message ? (message instanceof Function ? message() : message) :
                `Assertion error: ${to_json$1(a, true)} != ${to_json$1(b, true)}`;
            throw new Error(messageString);
        }
    };
    window.assert = assert_impl;
    // deep_clone_and_sort -----------------------------------------------------------------------------
    // Clone object with object and nested objects with properties sorted
    function deep_clone_and_sort(o) {
        if (is_array(o))
            return o.map(deep_clone_and_sort);
        else if (is_object(o)) {
            if ('dump' in o) {
                return deep_clone_and_sort(o.to_json_hook());
            }
            else {
                return Object.assign({}, ...Object.entries(o)
                    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    .map(([k, v]) => ({ [k]: deep_clone_and_sort(v) })));
            }
        }
        else
            return o;
    }
    // to_json -----------------------------------------------------------------------------------------
    // https://stackoverflow.com/questions/42491226/is-json-stringify-deterministic-in-v8
    // Stable JSON
    function to_json$1(obj, pretty = true) {
        return pretty ? JSON.stringify(deep_clone_and_sort(obj), null, 2) : JSON.stringify(deep_clone_and_sort(obj));
    }
    // from_json ---------------------------------------------------------------------------------------
    function from_json(s) {
        return JSON.parse(s);
    }
    // is_equal ----------------------------------------------------------------------------------------
    function is_equal(a, b) {
        return to_json$1(a) === to_json$1(b);
    }
    // ensure_error ------------------------------------------------------------------------------------
    function ensure_error(error, defaultMessage = "Unknown error") {
        if (is_object(error) && (error instanceof Error)) {
            if (!error.message)
                error.message = defaultMessage;
            return error;
        }
        else {
            return new Error('' + (error || defaultMessage));
        }
        // return '' + ((error && (typeof error == 'object') && error.message) || defaultMessage)
    }
    // unique ------------------------------------------------------------------------------------------
    function unique(by) {
        const set = new Set();
        const fn = by || ((v) => v);
        return this.filter((v) => {
            const key = fn(v);
            if (set.has(key))
                return false;
            else {
                set.add(key);
                return true;
            }
        });
    }
    // sort_by -----------------------------------------------------------------------------------------
    function sort_by(by, reverse) {
        if (this.length == 0)
            return this;
        else {
            const fn = by;
            const type = typeof by(this[0]);
            let comparator;
            if (type == 'number') {
                comparator = function (a, b) { return fn(a) - fn(b); };
            }
            else if (type == 'boolean') {
                comparator = function (a, b) { return (fn(a) ? 1 : 0) - (fn(b) ? 1 : 0); };
            }
            else if (type == 'string') {
                comparator = function (a, b) { return fn(a).localeCompare(fn(b)); };
            }
            else {
                throw new Error(`invalid return type for 'by' '${type}'`);
            }
            let sorted;
            sorted = [...this];
            sorted.sort(comparator);
            if (reverse)
                sorted.reverse();
            return sorted;
        }
    }
    test$1('sort_by', () => {
        assert.equal([{ v: true }, { v: false }].sort_by(({ v }) => v), [{ v: false }, { v: true }]);
        assert.equal([{ v: "b" }, { v: "" }, { v: "c" }].sort_by(({ v }) => v), [{ v: "" }, { v: "b" }, { v: "c" }]);
    });
    // buildUrl ----------------------------------------------------------------------------------------
    function build_url(url, query = {}) {
        const querystring = [];
        for (const key in query) {
            const value = query[key];
            if (key !== null && key !== undefined && value !== null && value !== undefined)
                querystring.push(`${encodeURIComponent(key)}=${encodeURIComponent('' + query[key])}`);
        }
        if (querystring.length > 0)
            return `${url}${url.includes('?') ? '&' : '?'}${querystring.join('&')}`;
        else
            return url;
    }
    // sleep -------------------------------------------------------------------------------------------
    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    // Promise -----------------------------------------------------------------------------------------
    // For better logging, by default promise would be logged as `{}`
    Promise.prototype.to_json_hook = function () { return 'Promise'; };
    Promise.prototype.toJSON = Promise.prototype.to_json_hook;
    Object.defineProperty(Promise.prototype, "cmap", { configurable: false, enumerable: false });
    // Error.to_json -----------------------------------------------------------------------------------
    // Otherwise JSON will be empty `{}`
    Error.prototype.to_json_hook = function () {
        return { message: this.message, stack: this.stack };
    };
    Error.prototype.to_json = Error.prototype.to_json_hook;
    // Map.toJSON ---------------------------------------------------------------------
    // Otherwise JSON will be empty `{}`
    Map.prototype.to_json_hook = function () {
        const json = {};
        for (const [k, v] of this)
            json[k] = v;
        return json;
    };
    Map.prototype.toJSON = Map.prototype.to_json_hook;
    // deep_map ----------------------------------------------------------------------------------------
    // export function deep_map(obj: any, map: (o: any) => any): any {
    //   obj = map(obj)
    //   if      (obj === null || !is_object(obj)) return obj
    //   else if ('map' in obj)                            return obj.map((v: any) => deep_map(v, map))
    //   else                                              return Object.assign({},
    //       ...Object.entries(obj)
    //         .map(([k, v]) => ({ [k]: deep_map(v, map) })
    //     ))
    // }
    // test("deepMap", () => {
    //   class Wrapper<T> {
    //     constructor(readonly v: T) {}
    //     toJSON() { return this.v }
    //   }
    //   const a = new Wrapper([1, 2])
    //   assert.equal(deep_map(a, (v) => v.to_json), [1, 2])
    //   const aL2 = new Wrapper([a, 3])
    //   assert.equal(deep_map(aL2, (v) => v.to_json), [[1, 2], 3])
    // })
    // export function logWithUser(
    //   level: LogLevel, user: string, message: string, short?: any, detailed?: any
    // ): string { return log(level, `${pad(user, 8)} ${message}`, short, detailed) }
    // cleanStack -------------------------------------------------------------------------------------
    // export let cleanStack: (stack: string) => string
    // {
    //   // const stack_skip_re = new RegExp([
    //   //   '/node_modules/',
    //   //   'internal/(modules|bootstrap|process)',
    //   //   'at new Promise \\(<anonymous>\\)',
    //   //   'at Object.next \\(',
    //   //   'at step \\(',
    //   //   'at __awaiter \\(',
    //   //   'at Object.exports.assert \\('
    //   // ].join('|'))
    //   cleanStack = (stack) => {
    //     // const lines = stack
    //     //   .split("\n")
    //     //   .filter((line) => {
    //     //     return !stack_skip_re.test(line)
    //     //   })
    //     //   .map((line, i) =>
    //     //     i == 0 ? line : line.replace(/([^\/]*).*(\/[^\/]+\/[^\/]+\/[^\/]+)/, (_match, s1, s2) => s1 + '...' + s2)
    //     //   )
    //     // return lines.join("\n")
    //     return stack
    //   }
    // }
    // uniglobal.process && uniglobal.process.on('uncaughtException', function(error: any) {
    //   error.stack = cleanStack(error.stack)
    //   console.log('')
    //   console.error(error)
    //   process.exit()
    // })
    // // CustomError --------------------------------------------------------------------
    // export class CustomError extends Error {
    //   constructor(message: string) {
    //     super(message)
    //     Object.setPrototypeOf(this, CustomError.prototype)
    //   }
    // }
    // sort ---------------------------------------------------------------------------
    // function sort(list: string[], comparator?: (a: string, b: string) => number): string[]
    // function sort(list: number[], comparator?: (a: number, b: number) => number): number[]
    // function sort<V>(list: V[], comparator?: (a: V, b: V) => number): V[] {
    //   if (list.length == 0) return list
    //   else {
    //     if (comparator) {
    //       list = [...list]
    //       list.sort(comparator)
    //       return list
    //     } else {
    //       if      (is_number(list[0]))
    //         comparator = function(a: number, b: number) { return a - b } as any
    //       else if (is_string(list[0]))
    //         comparator = function(a: string, b: string) { return a.localeCompare(b) } as any
    //       else
    //         throw new Error(`the 'comparator' required to sort a list of non numbers or strings`)
    //       list = [...list]
    //       list.sort(comparator)
    //       return list
    //     }
    //   }
    // }
    // export { sort }

    /* src/palette/Fail.svelte generated by Svelte v3.38.2 */

    const { Error: Error_1$1 } = globals;
    const file$q = "src/palette/Fail.svelte";

    // (9:2) {#if stack.length > 0}
    function create_if_block$h(ctx) {
    	let pre;
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			t = text(/*stack*/ ctx[1]);
    			attr_dev(pre, "class", "text-xs text-gray-600 mt-4");
    			add_location(pre, file$q, 9, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stack*/ 2) set_data_dev(t, /*stack*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(9:2) {#if stack.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let span;
    	let t1;
    	let t2_value = ensure_error(/*error*/ ctx[0]).message + "";
    	let t2;
    	let t3;
    	let if_block = /*stack*/ ctx[1].length > 0 && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Error";
    			t1 = text(" -\n  ");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "text-red-600 font-bold");
    			add_location(span, file$q, 6, 2, 185);
    			attr_dev(div, "class", "Fail");
    			add_location(div, file$q, 5, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*error*/ 1 && t2_value !== (t2_value = ensure_error(/*error*/ ctx[0]).message + "")) set_data_dev(t2, t2_value);

    			if (/*stack*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let stack;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Fail", slots, []);
    	let { error } = $$props;
    	const writable_props = ["error"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Fail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("error" in $$props) $$invalidate(0, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({ ensure_error, error, stack });

    	$$self.$inject_state = $$props => {
    		if ("error" in $$props) $$invalidate(0, error = $$props.error);
    		if ("stack" in $$props) $$invalidate(1, stack = $$props.stack);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*error*/ 1) {
    			$$invalidate(1, stack = (error && error instanceof Error ? error.stack : "") || "");
    		}
    	};

    	return [error, stack];
    }

    class Fail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, not_equal, { error: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fail",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*error*/ ctx[0] === undefined && !("error" in props)) {
    			console.warn("<Fail> was created without expected prop 'error'");
    		}
    	}

    	get error() {
    		throw new Error_1$1("<Fail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error_1$1("<Fail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/palette/Progress.svelte generated by Svelte v3.38.2 */
    const file$p = "src/palette/Progress.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(div, "class", "animate-pulse text-gray-500");
    			add_location(div, file$p, 5, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Progress", slots, []);
    	let { text = "Processing..." } = $$props;
    	discard(text);
    	const writable_props = ["text"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Progress> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Progress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Progress",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get text() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // import * as yaml_parser from "js-yaml"
    // NonReactiveVariable -----------------------------------------------------------------------------
    // To avoid Svelte reactivity
    class NonReactiveVariable {
        constructor(v) {
            this.v = v;
        }
        get() { return this.v; }
        set(v) { this.v = v; }
    }
    // get_extension -----------------------------------------------------------------------------------
    function get_extension(path) {
        const found = /\.([a-z0-9]+)$/i.parse(path);
        return found.length > 0 ? found[0] : undefined;
    }
    // get_base_url ------------------------------------------------------------------------------------
    function get_base_url() {
        const base_url = get_env("base_url");
        if (base_url === undefined)
            throw new Error("base_url not specified");
        return base_url;
    }
    function prepend_base_url_if_needed(url) {
        // prepending only if url is absolute
        return /\//.test(url) ? get_base_url() + url : url;
    }
    // ensure_loaded -----------------------------------------------------------------------------
    async function ensure_loaded(urls, mode) {
        if (mode == 'parallel') {
            const promises = urls.map(_ensure_loaded);
            for (const promise of promises)
                await promise;
        }
        else {
            for (const url of urls)
                await _ensure_loaded(url);
        }
    }
    const ensure_loaded_promises = {};
    async function _ensure_loaded(url) {
        if (!(url in ensure_loaded_promises)) {
            const full_url = prepend_base_url_if_needed(url);
            if (url.endsWith('.js'))
                ensure_loaded_promises[url] = load_script(full_url);
            else if (url.endsWith('.css'))
                ensure_loaded_promises[url] = load_style(full_url);
            else
                throw new Error(`should be script or style url '${url}'`);
        }
        return ensure_loaded_promises[url];
    }
    // load_style --------------------------------------------------------------------------------------
    // Non-bloking CSS loading
    function load_style(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.onerror = () => {
                link.remove();
                reject(new Error(`Cannot load ${url}`));
            };
            link.onload = () => { resolve(); };
            // link.setAttribute('reload', 'false')
            link.href = url;
            document.head.appendChild(link);
        });
    }
    // load_script -------------------------------------------------------------------------------------
    function load_script(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onerror = () => {
                script.remove();
                reject(new Error(`Cannot load ${url}`));
            };
            script.onload = () => {
                script.remove();
                resolve();
            };
            document.body.append(script);
        });
    }
    // load_data ---------------------------------------------------------------------------------------
    const cache = {};
    async function load_data(path) {
        if (!(path in cache)) {
            async function load() {
                let response = await fetch(build_url(path, { clearcache: Math.random() }));
                if (response.status == 404)
                    throw new Error(`File '${path}' not found`);
                if (response.status != 200)
                    throw new Error(`Can't load '${path}', response code ${response.status}`);
                return parse_data(await response.text(), get_extension(path), path);
            }
            cache[path] = load();
        }
        return cache[path];
    }
    // get_or_load_data --------------------------------------------------------------------------------
    async function get_or_load_data(data) {
        if (data === undefined)
            throw new Error(`nether data nor data url provided`);
        else if (typeof data == 'object' && 'url' in data)
            return await load_data(data.url);
        else
            return data;
    }
    // parse_data --------------------------------------------------------------------------------------
    // Parses data in JSON or YAML
    async function parse_data(data, extension, file_path) {
        if (extension) {
            const parse = plot_config.parsers[extension];
            if (parse) {
                try {
                    return await parse(data);
                }
                catch (e) {
                    throw new Error(`can't parse '${file_path || extension}', ${ensure_error(e).message}`);
                }
            }
        }
        return data;
    }
    plot_config.parsers.yml = from_yaml;
    plot_config.parsers.yaml = from_yaml;
    plot_config.parsers.json = async (data) => JSON.parse(data);
    plot_config.parsers.csv = from_csv;
    // from_yaml, to_yaml ------------------------------------------------------------------------------
    async function from_yaml(yaml) {
        const data = (await get_yaml()).load(yaml);
        if (data === undefined || data === null)
            throw new Error("YAML data is empty");
        return data;
    }
    async function to_yaml(data) {
        return (await get_yaml()).dump(data, { skipInvalid: true, noRefs: true });
    }
    async function get_yaml() {
        await ensure_loaded(['/vendor/js-yaml-4.1.0/js-yaml.min.js'], 'serial');
        const yaml = window.jsyaml;
        if (!yaml)
            throw new Error("can't load 'js-yaml' library");
        return yaml;
    }
    function is_csv_table(o) {
        return o && (typeof o == 'object') && o.type == 'csv_table';
    }
    async function from_csv(csv) {
        const { errors, data, meta: { fields } } = (await get_csv()).parse(csv, { header: true, dynamicTyping: true });
        if (errors.lenght > 0)
            throw new Error(ensure_error(errors[0]).message);
        return { type: 'csv_table', columns: fields, rows: data };
    }
    async function get_csv() {
        await ensure_loaded(['/vendor/papaparse-5.0.2/papaparse.min.js'], 'serial');
        const CSV = window.Papa;
        if (!CSV)
            throw new Error("can't load 'papaparse' library");
        return CSV;
    }
    // escapeHtml --------------------------------------------------------------------------------------
    const ESCAPE_HTML_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    function escape_html(html) {
        if (html === undefined || html === null)
            return '';
        return ('' + html).replace(/[&<>'"]/g, function (c) { return ESCAPE_HTML_MAP[c]; });
    }
    test("escapeHtml", () => {
        assert.equal(escape_html('<div>'), '&lt;div&gt;');
    });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var defaults$5 = createCommonjsModule(function (module) {
    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        xhtml: false
      };
    }

    function changeDefaults(newDefaults) {
      module.exports.defaults = newDefaults;
    }

    module.exports = {
      defaults: getDefaults(),
      getDefaults,
      changeDefaults
    };
    });

    /**
     * Helpers
     */
    const escapeTest = /[&<>"']/;
    const escapeReplace = /[&<>"']/g;
    const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape$5(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    function unescape$2(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;
    function edit$1(regex, opt) {
      regex = regex.source || regex;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl$1(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape$2(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim$1(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest$1 = { exec: function noopTest() {} };

    function merge$3(obj) {
      let i = 1,
        target,
        key;

      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }

      return obj;
    }

    function splitCells$1(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
    // /c*$/ is vulnerable to REDOS.
    // invert: Remove suffix of non-c chars instead. Default falsey.
    function rtrim$1(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.substr(0, l - suffLen);
    }

    function findClosingBracket$1(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    function checkSanitizeDeprecation$1(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
      }
    }

    var helpers$1 = {
      escape: escape$5,
      unescape: unescape$2,
      edit: edit$1,
      cleanUrl: cleanUrl$1,
      resolveUrl,
      noopTest: noopTest$1,
      merge: merge$3,
      splitCells: splitCells$1,
      rtrim: rtrim$1,
      findClosingBracket: findClosingBracket$1,
      checkSanitizeDeprecation: checkSanitizeDeprecation$1
    };

    const {
      noopTest,
      edit,
      merge: merge$2
    } = helpers$1;

    /**
     * Block-Level Grammar
     */
    const block$1 = {
      newline: /^\n+/,
      code: /^( {4}[^\n]+\n*)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
        + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
        + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
        + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: noopTest,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block$1.def = edit(block$1.def)
      .replace('label', block$1._label)
      .replace('title', block$1._title)
      .getRegex();

    block$1.bullet = /(?:[*+-]|\d{1,9}\.)/;
    block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
    block$1.item = edit(block$1.item, 'gm')
      .replace(/bull/g, block$1.bullet)
      .getRegex();

    block$1.list = edit(block$1.list)
      .replace(/bull/g, block$1.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block$1.def.source + ')')
      .getRegex();

    block$1._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block$1._comment = /<!--(?!-?>)[\s\S]*?-->/;
    block$1.html = edit(block$1.html, 'i')
      .replace('comment', block$1._comment)
      .replace('tag', block$1._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block$1.paragraph = edit(block$1._paragraph)
      .replace('hr', block$1.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
      .replace('tag', block$1._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block$1.blockquote = edit(block$1.blockquote)
      .replace('paragraph', block$1.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block$1.normal = merge$2({}, block$1);

    /**
     * GFM Block Grammar
     */

    block$1.gfm = merge$2({}, block$1.normal, {
      nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
        + ' *([-:]+ *\\|[-| :]*)' // Align
        + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)', // Cells
      table: '^ *\\|(.+)\\n' // Header
        + ' *\\|?( *[-:]+[-| :]*)' // Align
        + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    });

    block$1.gfm.nptable = edit(block$1.gfm.nptable)
      .replace('hr', block$1.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
      .replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    block$1.gfm.table = edit(block$1.gfm.table)
      .replace('hr', block$1.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
      .replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block$1.pedantic = merge$2({}, block$1.normal, {
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block$1._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
      fences: noopTest, // fences not supported
      paragraph: edit(block$1.normal._paragraph)
        .replace('hr', block$1.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block$1.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    });

    /**
     * Inline-Level Grammar
     */
    const inline$1 = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
      em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
    };

    // list of punctuation marks from common mark spec
    // without ` and ] to workaround Rule 17 (inline code blocks/links)
    inline$1._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
    inline$1.em = edit(inline$1.em).replace(/punctuation/g, inline$1._punctuation).getRegex();

    inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline$1.autolink = edit(inline$1.autolink)
      .replace('scheme', inline$1._scheme)
      .replace('email', inline$1._email)
      .getRegex();

    inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline$1.tag = edit(inline$1.tag)
      .replace('comment', block$1._comment)
      .replace('attribute', inline$1._attribute)
      .getRegex();

    inline$1._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline$1._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
    inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline$1.link = edit(inline$1.link)
      .replace('label', inline$1._label)
      .replace('href', inline$1._href)
      .replace('title', inline$1._title)
      .getRegex();

    inline$1.reflink = edit(inline$1.reflink)
      .replace('label', inline$1._label)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline$1.normal = merge$2({}, inline$1);

    /**
     * Pedantic Inline Grammar
     */

    inline$1.pedantic = merge$2({}, inline$1.normal, {
      strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline$1._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline$1._label)
        .getRegex()
    });

    /**
     * GFM Inline Grammar
     */

    inline$1.gfm = merge$2({}, inline$1.normal, {
      escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^~+(?=\S)([\s\S]*?\S)~+/,
      text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
    });

    inline$1.gfm.url = edit(inline$1.gfm.url, 'i')
      .replace('email', inline$1.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline$1.breaks = merge$2({}, inline$1.gfm, {
      br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
      text: edit(inline$1.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    });

    var rules = {
      block: block$1,
      inline: inline$1
    };

    const { defaults: defaults$4 } = defaults$5;
    const { block } = rules;
    const {
      rtrim,
      splitCells,
      escape: escape$4
    } = helpers$1;

    /**
     * Block Lexer
     */
    var Lexer_1 = class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults$4;
        this.rules = block.normal;

        if (this.options.pedantic) {
          this.rules = block.pedantic;
        } else if (this.options.gfm) {
          this.rules = block.gfm;
        }
      }

      /**
       * Expose Block Rules
       */
      static get rules() {
        return block;
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      };

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n')
          .replace(/\t/g, '    ');

        return this.token(src, true);
      };

      /**
       * Lexing
       */
      token(src, top) {
        src = src.replace(/^ +$/gm, '');
        let next,
          loose,
          cap,
          bull,
          b,
          item,
          listStart,
          listItems,
          t,
          space,
          i,
          tag,
          l,
          isordered,
          istask,
          ischecked;

        while (src) {
          // newline
          if (cap = this.rules.newline.exec(src)) {
            src = src.substring(cap[0].length);
            if (cap[0].length > 1) {
              this.tokens.push({
                type: 'space'
              });
            }
          }

          // code
          if (cap = this.rules.code.exec(src)) {
            const lastToken = this.tokens[this.tokens.length - 1];
            src = src.substring(cap[0].length);
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && lastToken.type === 'paragraph') {
              lastToken.text += '\n' + cap[0].trimRight();
            } else {
              cap = cap[0].replace(/^ {4}/gm, '');
              this.tokens.push({
                type: 'code',
                codeBlockStyle: 'indented',
                text: !this.options.pedantic
                  ? rtrim(cap, '\n')
                  : cap
              });
            }
            continue;
          }

          // fences
          if (cap = this.rules.fences.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'code',
              lang: cap[2] ? cap[2].trim() : cap[2],
              text: cap[3] || ''
            });
            continue;
          }

          // heading
          if (cap = this.rules.heading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'heading',
              depth: cap[1].length,
              text: cap[2]
            });
            continue;
          }

          // table no leading pipe (gfm)
          if (cap = this.rules.nptable.exec(src)) {
            item = {
              type: 'table',
              header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              src = src.substring(cap[0].length);

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = splitCells(item.cells[i], item.header.length);
              }

              this.tokens.push(item);

              continue;
            }
          }

          // hr
          if (cap = this.rules.hr.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'hr'
            });
            continue;
          }

          // blockquote
          if (cap = this.rules.blockquote.exec(src)) {
            src = src.substring(cap[0].length);

            this.tokens.push({
              type: 'blockquote_start'
            });

            cap = cap[0].replace(/^ *> ?/gm, '');

            // Pass `top` to keep the current
            // "toplevel" state. This is exactly
            // how markdown.pl works.
            this.token(cap, top);

            this.tokens.push({
              type: 'blockquote_end'
            });

            continue;
          }

          // list
          if (cap = this.rules.list.exec(src)) {
            src = src.substring(cap[0].length);
            bull = cap[2];
            isordered = bull.length > 1;

            listStart = {
              type: 'list_start',
              ordered: isordered,
              start: isordered ? +bull : '',
              loose: false
            };

            this.tokens.push(listStart);

            // Get each top-level item.
            cap = cap[0].match(this.rules.item);

            listItems = [];
            next = false;
            l = cap.length;
            i = 0;

            for (; i < l; i++) {
              item = cap[i];

              // Remove the list item's bullet
              // so it is seen as the next token.
              space = item.length;
              item = item.replace(/^ *([*+-]|\d+\.) */, '');

              // Outdent whatever the
              // list item contains. Hacky.
              if (~item.indexOf('\n ')) {
                space -= item.length;
                item = !this.options.pedantic
                  ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                  : item.replace(/^ {1,4}/gm, '');
              }

              // Determine whether the next list item belongs here.
              // Backpedal if it does not belong in this list.
              if (i !== l - 1) {
                b = block.bullet.exec(cap[i + 1])[0];
                if (bull.length > 1 ? b.length === 1
                  : (b.length > 1 || (this.options.smartLists && b !== bull))) {
                  src = cap.slice(i + 1).join('\n') + src;
                  i = l - 1;
                }
              }

              // Determine whether item is loose or not.
              // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
              // for discount behavior.
              loose = next || /\n\n(?!\s*$)/.test(item);
              if (i !== l - 1) {
                next = item.charAt(item.length - 1) === '\n';
                if (!loose) loose = next;
              }

              if (loose) {
                listStart.loose = true;
              }

              // Check for task list items
              istask = /^\[[ xX]\] /.test(item);
              ischecked = undefined;
              if (istask) {
                ischecked = item[1] !== ' ';
                item = item.replace(/^\[[ xX]\] +/, '');
              }

              t = {
                type: 'list_item_start',
                task: istask,
                checked: ischecked,
                loose: loose
              };

              listItems.push(t);
              this.tokens.push(t);

              // Recurse.
              this.token(item, false);

              this.tokens.push({
                type: 'list_item_end'
              });
            }

            if (listStart.loose) {
              l = listItems.length;
              i = 0;
              for (; i < l; i++) {
                listItems[i].loose = true;
              }
            }

            this.tokens.push({
              type: 'list_end'
            });

            continue;
          }

          // html
          if (cap = this.rules.html.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: this.options.sanitize
                ? 'paragraph'
                : 'html',
              pre: !this.options.sanitizer
                && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
              text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$4(cap[0])) : cap[0]
            });
            continue;
          }

          // def
          if (top && (cap = this.rules.def.exec(src))) {
            src = src.substring(cap[0].length);
            if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
            tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
            if (!this.tokens.links[tag]) {
              this.tokens.links[tag] = {
                href: cap[2],
                title: cap[3]
              };
            }
            continue;
          }

          // table (gfm)
          if (cap = this.rules.table.exec(src)) {
            item = {
              type: 'table',
              header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              src = src.substring(cap[0].length);

              for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = splitCells(
                  item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
                  item.header.length);
              }

              this.tokens.push(item);

              continue;
            }
          }

          // lheading
          if (cap = this.rules.lheading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'heading',
              depth: cap[2].charAt(0) === '=' ? 1 : 2,
              text: cap[1]
            });
            continue;
          }

          // top-level paragraph
          if (top && (cap = this.rules.paragraph.exec(src))) {
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'paragraph',
              text: cap[1].charAt(cap[1].length - 1) === '\n'
                ? cap[1].slice(0, -1)
                : cap[1]
            });
            continue;
          }

          // text
          if (cap = this.rules.text.exec(src)) {
            // Top-level should never reach here.
            src = src.substring(cap[0].length);
            this.tokens.push({
              type: 'text',
              text: cap[0]
            });
            continue;
          }

          if (src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
          }
        }

        return this.tokens;
      };
    };

    const { defaults: defaults$3 } = defaults$5;
    const {
      cleanUrl,
      escape: escape$3
    } = helpers$1;

    /**
     * Renderer
     */
    var Renderer_1 = class Renderer {
      constructor(options) {
        this.options = options || defaults$3;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape$3(code, true))
            + '</code></pre>';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape$3(lang, true)
          + '">'
          + (escaped ? code : escape$3(code, true))
          + '</code></pre>\n';
      };

      blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      };

      html(html) {
        return html;
      };

      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + slugger.slug(raw)
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
        }
        // ignore IDs
        return '<h' + level + '>' + text + '</h' + level + '>\n';
      };

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      };

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      };

      listitem(text) {
        return '<li>' + text + '</li>\n';
      };

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      };

      paragraph(text) {
        return '<p>' + text + '</p>\n';
      };

      table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      };

      tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      };

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? '<' + type + ' align="' + flags.align + '">'
          : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      };

      // span level renderer
      strong(text) {
        return '<strong>' + text + '</strong>';
      };

      em(text) {
        return '<em>' + text + '</em>';
      };

      codespan(text) {
        return '<code>' + text + '</code>';
      };

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      };

      del(text) {
        return '<del>' + text + '</del>';
      };

      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape$3(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      };

      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      };

      text(text) {
        return text;
      };
    };

    /**
     * Slugger generates header id
     */
    var Slugger_1 = class Slugger {
      constructor() {
        this.seen = {};
      }

      /**
       * Convert string to unique id
       */
      slug(value) {
        let slug = value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');

        if (this.seen.hasOwnProperty(slug)) {
          const originalSlug = slug;
          do {
            this.seen[originalSlug]++;
            slug = originalSlug + '-' + this.seen[originalSlug];
          } while (this.seen.hasOwnProperty(slug));
        }
        this.seen[slug] = 0;

        return slug;
      };
    };

    const { defaults: defaults$2 } = defaults$5;
    const { inline } = rules;
    const {
      findClosingBracket,
      escape: escape$2
    } = helpers$1;

    /**
     * Inline Lexer & Compiler
     */
    var InlineLexer_1 = class InlineLexer {
      constructor(links, options) {
        this.options = options || defaults$2;
        this.links = links;
        this.rules = inline.normal;
        this.options.renderer = this.options.renderer || new Renderer_1();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;

        if (!this.links) {
          throw new Error('Tokens array requires a `links` property.');
        }

        if (this.options.pedantic) {
          this.rules = inline.pedantic;
        } else if (this.options.gfm) {
          if (this.options.breaks) {
            this.rules = inline.breaks;
          } else {
            this.rules = inline.gfm;
          }
        }
      }

      /**
       * Expose Inline Rules
       */
      static get rules() {
        return inline;
      }

      /**
       * Static Lexing/Compiling Method
       */
      static output(src, links, options) {
        const inline = new InlineLexer(links, options);
        return inline.output(src);
      }

      /**
       * Lexing/Compiling
       */
      output(src) {
        let out = '',
          link,
          text,
          href,
          title,
          cap,
          prevCapZero;

        while (src) {
          // escape
          if (cap = this.rules.escape.exec(src)) {
            src = src.substring(cap[0].length);
            out += escape$2(cap[1]);
            continue;
          }

          // tag
          if (cap = this.rules.tag.exec(src)) {
            if (!this.inLink && /^<a /i.test(cap[0])) {
              this.inLink = true;
            } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
              this.inLink = false;
            }
            if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              this.inRawBlock = true;
            } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              this.inRawBlock = false;
            }

            src = src.substring(cap[0].length);
            out += this.renderer.html(this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape$2(cap[0]))
              : cap[0]);
            continue;
          }

          // link
          if (cap = this.rules.link.exec(src)) {
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
            src = src.substring(cap[0].length);
            this.inLink = true;
            href = cap[2];
            if (this.options.pedantic) {
              link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

              if (link) {
                href = link[1];
                title = link[3];
              } else {
                title = '';
              }
            } else {
              title = cap[3] ? cap[3].slice(1, -1) : '';
            }
            href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
            out += this.outputLink(cap, {
              href: InlineLexer.escapes(href),
              title: InlineLexer.escapes(title)
            });
            this.inLink = false;
            continue;
          }

          // reflink, nolink
          if ((cap = this.rules.reflink.exec(src))
              || (cap = this.rules.nolink.exec(src))) {
            src = src.substring(cap[0].length);
            link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
            link = this.links[link.toLowerCase()];
            if (!link || !link.href) {
              out += cap[0].charAt(0);
              src = cap[0].substring(1) + src;
              continue;
            }
            this.inLink = true;
            out += this.outputLink(cap, link);
            this.inLink = false;
            continue;
          }

          // strong
          if (cap = this.rules.strong.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
            continue;
          }

          // em
          if (cap = this.rules.em.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
            continue;
          }

          // code
          if (cap = this.rules.code.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.codespan(escape$2(cap[2].trim(), true));
            continue;
          }

          // br
          if (cap = this.rules.br.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.br();
            continue;
          }

          // del (gfm)
          if (cap = this.rules.del.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.del(this.output(cap[1]));
            continue;
          }

          // autolink
          if (cap = this.rules.autolink.exec(src)) {
            src = src.substring(cap[0].length);
            if (cap[2] === '@') {
              text = escape$2(this.mangle(cap[1]));
              href = 'mailto:' + text;
            } else {
              text = escape$2(cap[1]);
              href = text;
            }
            out += this.renderer.link(href, null, text);
            continue;
          }

          // url (gfm)
          if (!this.inLink && (cap = this.rules.url.exec(src))) {
            if (cap[2] === '@') {
              text = escape$2(cap[0]);
              href = 'mailto:' + text;
            } else {
              // do extended autolink path validation
              do {
                prevCapZero = cap[0];
                cap[0] = this.rules._backpedal.exec(cap[0])[0];
              } while (prevCapZero !== cap[0]);
              text = escape$2(cap[0]);
              if (cap[1] === 'www.') {
                href = 'http://' + text;
              } else {
                href = text;
              }
            }
            src = src.substring(cap[0].length);
            out += this.renderer.link(href, null, text);
            continue;
          }

          // text
          if (cap = this.rules.text.exec(src)) {
            src = src.substring(cap[0].length);
            if (this.inRawBlock) {
              out += this.renderer.text(this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$2(cap[0])) : cap[0]);
            } else {
              out += this.renderer.text(escape$2(this.smartypants(cap[0])));
            }
            continue;
          }

          if (src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
          }
        }

        return out;
      }

      static escapes(text) {
        return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
      }

      /**
       * Compile Link
       */
      outputLink(cap, link) {
        const href = link.href,
          title = link.title ? escape$2(link.title) : null;

        return cap[0].charAt(0) !== '!'
          ? this.renderer.link(href, title, this.output(cap[1]))
          : this.renderer.image(href, title, escape$2(cap[1]));
      }

      /**
       * Smartypants Transformations
       */
      smartypants(text) {
        if (!this.options.smartypants) return text;
        return text
          // em-dashes
          .replace(/---/g, '\u2014')
          // en-dashes
          .replace(/--/g, '\u2013')
          // opening singles
          .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
          // closing singles & apostrophes
          .replace(/'/g, '\u2019')
          // opening doubles
          .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
          // closing doubles
          .replace(/"/g, '\u201d')
          // ellipses
          .replace(/\.{3}/g, '\u2026');
      }

      /**
       * Mangle Links
       */
      mangle(text) {
        if (!this.options.mangle) return text;
        const l = text.length;
        let out = '',
          i = 0,
          ch;

        for (; i < l; i++) {
          ch = text.charCodeAt(i);
          if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16);
          }
          out += '&#' + ch + ';';
        }

        return out;
      }
    };

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    var TextRenderer_1 = class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    };

    const { defaults: defaults$1 } = defaults$5;
    const {
      merge: merge$1,
      unescape: unescape$1
    } = helpers$1;

    /**
     * Parsing & Compiling
     */
    var Parser_1 = class Parser {
      constructor(options) {
        this.tokens = [];
        this.token = null;
        this.options = options || defaults$1;
        this.options.renderer = this.options.renderer || new Renderer_1();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.slugger = new Slugger_1();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      };

      /**
       * Parse Loop
       */
      parse(tokens) {
        this.inline = new InlineLexer_1(tokens.links, this.options);
        // use an InlineLexer with a TextRenderer to extract pure text
        this.inlineText = new InlineLexer_1(
          tokens.links,
          merge$1({}, this.options, { renderer: new TextRenderer_1() })
        );
        this.tokens = tokens.reverse();

        let out = '';
        while (this.next()) {
          out += this.tok();
        }

        return out;
      };

      /**
       * Next Token
       */
      next() {
        this.token = this.tokens.pop();
        return this.token;
      };

      /**
       * Preview Next Token
       */
      peek() {
        return this.tokens[this.tokens.length - 1] || 0;
      };

      /**
       * Parse Text Tokens
       */
      parseText() {
        let body = this.token.text;

        while (this.peek().type === 'text') {
          body += '\n' + this.next().text;
        }

        return this.inline.output(body);
      };

      /**
       * Parse Current Token
       */
      tok() {
        let body = '';
        switch (this.token.type) {
          case 'space': {
            return '';
          }
          case 'hr': {
            return this.renderer.hr();
          }
          case 'heading': {
            return this.renderer.heading(
              this.inline.output(this.token.text),
              this.token.depth,
              unescape$1(this.inlineText.output(this.token.text)),
              this.slugger);
          }
          case 'code': {
            return this.renderer.code(this.token.text,
              this.token.lang,
              this.token.escaped);
          }
          case 'table': {
            let header = '',
              i,
              row,
              cell,
              j;

            // header
            cell = '';
            for (i = 0; i < this.token.header.length; i++) {
              cell += this.renderer.tablecell(
                this.inline.output(this.token.header[i]),
                { header: true, align: this.token.align[i] }
              );
            }
            header += this.renderer.tablerow(cell);

            for (i = 0; i < this.token.cells.length; i++) {
              row = this.token.cells[i];

              cell = '';
              for (j = 0; j < row.length; j++) {
                cell += this.renderer.tablecell(
                  this.inline.output(row[j]),
                  { header: false, align: this.token.align[j] }
                );
              }

              body += this.renderer.tablerow(cell);
            }
            return this.renderer.table(header, body);
          }
          case 'blockquote_start': {
            body = '';

            while (this.next().type !== 'blockquote_end') {
              body += this.tok();
            }

            return this.renderer.blockquote(body);
          }
          case 'list_start': {
            body = '';
            const ordered = this.token.ordered,
              start = this.token.start;

            while (this.next().type !== 'list_end') {
              body += this.tok();
            }

            return this.renderer.list(body, ordered, start);
          }
          case 'list_item_start': {
            body = '';
            const loose = this.token.loose;
            const checked = this.token.checked;
            const task = this.token.task;

            if (this.token.task) {
              if (loose) {
                if (this.peek().type === 'text') {
                  const nextToken = this.peek();
                  nextToken.text = this.renderer.checkbox(checked) + ' ' + nextToken.text;
                } else {
                  this.tokens.push({
                    type: 'text',
                    text: this.renderer.checkbox(checked)
                  });
                }
              } else {
                body += this.renderer.checkbox(checked);
              }
            }

            while (this.next().type !== 'list_item_end') {
              body += !loose && this.token.type === 'text'
                ? this.parseText()
                : this.tok();
            }
            return this.renderer.listitem(body, task, checked);
          }
          case 'html': {
            // TODO parse inline content if parameter markdown=1
            return this.renderer.html(this.token.text);
          }
          case 'paragraph': {
            return this.renderer.paragraph(this.inline.output(this.token.text));
          }
          case 'text': {
            return this.renderer.paragraph(this.parseText());
          }
          default: {
            const errMsg = 'Token with "' + this.token.type + '" type was not found.';
            if (this.options.silent) {
              console.log(errMsg);
            } else {
              throw new Error(errMsg);
            }
          }
        }
      };
    };

    const {
      merge,
      checkSanitizeDeprecation,
      escape: escape$1
    } = helpers$1;
    const {
      getDefaults,
      changeDefaults,
      defaults
    } = defaults$5;

    /**
     * Marked
     */
    function marked(src, opt, callback) {
      // throw error in case of non string input
      if (typeof src === 'undefined' || src === null) {
        throw new Error('marked(): input parameter is undefined or null');
      }
      if (typeof src !== 'string') {
        throw new Error('marked(): input parameter is of type '
          + Object.prototype.toString.call(src) + ', string expected');
      }

      if (callback || typeof opt === 'function') {
        if (!callback) {
          callback = opt;
          opt = null;
        }

        opt = merge({}, marked.defaults, opt || {});
        checkSanitizeDeprecation(opt);
        const highlight = opt.highlight;
        let tokens,
          pending,
          i = 0;

        try {
          tokens = Lexer_1.lex(src, opt);
        } catch (e) {
          return callback(e);
        }

        pending = tokens.length;

        const done = function(err) {
          if (err) {
            opt.highlight = highlight;
            return callback(err);
          }

          let out;

          try {
            out = Parser_1.parse(tokens, opt);
          } catch (e) {
            err = e;
          }

          opt.highlight = highlight;

          return err
            ? callback(err)
            : callback(null, out);
        };

        if (!highlight || highlight.length < 3) {
          return done();
        }

        delete opt.highlight;

        if (!pending) return done();

        for (; i < tokens.length; i++) {
          (function(token) {
            if (token.type !== 'code') {
              return --pending || done();
            }
            return highlight(token.text, token.lang, function(err, code) {
              if (err) return done(err);
              if (code == null || code === token.text) {
                return --pending || done();
              }
              token.text = code;
              token.escaped = true;
              --pending || done();
            });
          })(tokens[i]);
        }

        return;
      }
      try {
        opt = merge({}, marked.defaults, opt || {});
        checkSanitizeDeprecation(opt);
        return Parser_1.parse(Lexer_1.lex(src, opt), opt);
      } catch (e) {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';
        if ((opt || marked.defaults).silent) {
          return '<p>An error occurred:</p><pre>'
            + escape$1(e.message + '', true)
            + '</pre>';
        }
        throw e;
      }
    }

    /**
     * Options
     */

    marked.options =
    marked.setOptions = function(opt) {
      merge(marked.defaults, opt);
      changeDefaults(marked.defaults);
      return marked;
    };

    marked.getDefaults = getDefaults;

    marked.defaults = defaults;

    /**
     * Expose
     */

    marked.Parser = Parser_1;
    marked.parser = Parser_1.parse;

    marked.Renderer = Renderer_1;
    marked.TextRenderer = TextRenderer_1;

    marked.Lexer = Lexer_1;
    marked.lexer = Lexer_1.lex;

    marked.InlineLexer = InlineLexer_1;
    marked.inlineLexer = InlineLexer_1.output;

    marked.Slugger = Slugger_1;

    marked.parse = marked;

    var marked_1 = marked;

    let highlight_loaded = false; // Highlight library is too heavy loading only if it's needed
    // export async function ensure_marked_loaded(): Promise<void> {
    //   return ensure_loaded([
    //     '/vendor/marked-0.8.2/marked.min.js'
    //   ], 'serial')
    // }
    async function process_markdown(markdown) {
        await sleep(0); // Delaying markdown to avoid blocking CPU
        // Loading 'marked'
        // await ensure_marked_loaded()
        // const marked = (window as any).marked
        // if (!marked) throw new Error("can't load 'marked' library for markdown")
        // Adding support for KaTeX
        const renderer = new marked_1.Renderer();
        let i = 0;
        const next_id = () => `__special_katext_id_${i++}__`;
        const math_expressions = {};
        function unescape(text) {
            return text
                .replace("&gt;", ">")
                .replace("&lt;", ">")
                .replace("&quot;", "'");
        }
        function replace_math_with_ids(text) {
            // Allowing newlines inside of `$$...$$`
            text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, expression) => {
                const id = next_id();
                math_expressions[id] = { type: "block", expression: unescape(expression) };
                return id;
            });
            // Not allowing newlines or space inside of `$...$`
            text = text.replace(/\$([^\n\s]+?)\$/g, (_match, expression) => {
                const id = next_id();
                math_expressions[id] = { type: "inline", expression: unescape(expression) };
                return id;
            });
            return text;
        }
        const original_listitem = renderer.listitem;
        renderer.listitem = function (text, task, checked) {
            return original_listitem(replace_math_with_ids(text), task, checked);
        };
        const original_paragraph = renderer.paragraph;
        renderer.paragraph = function (text) {
            return original_paragraph(replace_math_with_ids(text));
        };
        const original_tablecell = renderer.tablecell;
        renderer.tablecell = function (content, flags) {
            return original_tablecell(replace_math_with_ids(content), flags);
        };
        // // Inline level, maybe unneded
        // const original_text = renderer.text
        // renderer.text = function(text: string) {
        //   return original_text(replace_math_with_ids(text))
        // }
        function set_marked_options(highlight) {
            marked_1.setOptions({
                renderer,
                highlight,
                pedantic: false,
                gfm: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: true
            });
        }
        // Setting marked options
        let html;
        if (!highlight_loaded) {
            // Highlight library is too heavy loading only if it's needed
            let has_code = false;
            set_marked_options((code, lang) => {
                if (lang)
                    has_code = true; // Without the lang there's no point to use highlight
                return code;
            });
            html = marked_1(markdown.dedent());
            if (has_code) {
                // Loading highlight.js and re-rendering with highlight enabled
                await ensure_loaded([
                    '/vendor/highlight.js-11.0.1/default.min.css',
                    '/vendor/highlight.js-11.0.1/highlight.min.js'
                ], 'parallel');
                highlight_loaded = true;
                return process_markdown(markdown);
            }
        }
        else {
            const highlightjs = window.hljs;
            if (!highlightjs)
                throw new Error("can't load 'highlightjs' library for markdown");
            set_marked_options((code, language) => {
                try {
                    return language ? highlightjs.highlight(code, { language }).value : code;
                }
                catch (e) {
                    return code;
                }
            });
            html = marked_1(markdown.dedent());
        }
        // KaTeX
        if (html.includes("__special_katext_id_")) {
            await ensure_loaded(['/vendor/katex-0.11.1/katex.min.js'], 'parallel');
            // Not waiting for KaTeX styles, as it slow and loads heavy fonts, will be loaded in background
            ensure_loaded(['/vendor/katex-0.11.1/katex.css'], 'parallel')
                .catch((error) => console.warn(`can't load styles for KaTeX, ${ensure_error(error).message}`));
            html = html.replace(/(__special_katext_id_\d+__)/g, (_match, capture) => {
                let { type, expression } = math_expressions[capture];
                // Fixing newlines, markdown replaces `\\` with `<br/>`, replacing it back
                expression = expression.replace(/<br\/>/g, "\\\\");
                return window.katex.renderToString(expression, {
                    output: "html",
                    displayMode: type == "block",
                    throwOnError: false
                });
            });
        }
        // Because Spectre CSS expect it in form `<pre class="code">...</pre>` not as `<pre><code>...</code></pre>`
        // html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/ig, "<pre class="code">$1</pre>")
        return html;
    }
    // import * as marked from "marked"
    // import * as highlightjs from "highlight.js"
    // import * as katex from "katex"
    // export function markdown_styles() {
    //   return {
    //     "markdown.css":                 fs.resolve(__dirname, "markdown.css"),
    //     "highlight-9.17.1-default.css": fs.resolve(__dirname, "..", "vendor", "highlight-9.17.1-default.css"),
    //     "katex-0.11.1.css":             fs.resolve(__dirname, "..", "vendor", "katex-0.11.1", "katex.css")
    //   }
    // }
    // uniglobal.process_markdown = process_markdown
    // let markdown_loading: Promise<void> | undefined = undefined
    // export async function after_markdown_loaded(): Promise<void> {
    //   async function load() {
    //     await ensure_style_loaded(`${base_url}/vendor/highlight-9.17.1-default.css`)
    //     await ensure_style_loaded(`${base_url}/vendor/katex-0.11.1/katex.css`)
    //   }
    //   if (!markdown_loading) markdown_loading = load()
    //   return markdown_loading
    // }

    /* src/palette/markdown/Markdown.svelte generated by Svelte v3.38.2 */
    const file$o = "src/palette/markdown/Markdown.svelte";

    // (27:2) {:else}
    function create_else_block$6(ctx) {
    	let html_tag;
    	let raw_value = /*state*/ ctx[0].html + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 1 && raw_value !== (raw_value = /*state*/ ctx[0].html + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(27:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:35) 
    function create_if_block_1$9(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: /*state*/ ctx[0].error },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fail_changes = {};
    			if (dirty & /*state*/ 1) fail_changes.error = /*state*/ ctx[0].error;
    			fail.$set(fail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(25:35) ",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if state.state == "empty"}
    function create_if_block$g(ctx) {
    	let progress;
    	let current;
    	progress = new Progress({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(progress.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progress, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progress, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(23:2) {#if state.state == \\\"empty\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$g, create_if_block_1$9, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[0].state == "empty") return 0;
    		if (/*state*/ ctx[0].state == "error") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "markdown");
    			add_location(div, file$o, 21, 0, 730);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Markdown", slots, []);
    	let { markdown } = $$props;
    	let state = { state: "empty" };
    	const writable_props = ["markdown"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Markdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("markdown" in $$props) $$invalidate(1, markdown = $$props.markdown);
    	};

    	$$self.$capture_state = () => ({
    		ensure_error,
    		process_markdown,
    		Fail,
    		Progress,
    		markdown,
    		state
    	});

    	$$self.$inject_state = $$props => {
    		if ("markdown" in $$props) $$invalidate(1, markdown = $$props.markdown);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*state, markdown*/ 3) {
    			{
    				if (state.state == "empty" || state.markdown != markdown) {
    					const current_markdown = markdown;

    					process_markdown(markdown).then(html => {
    						$$invalidate(0, state = {
    							state: "success",
    							markdown: current_markdown,
    							html
    						});
    					}).catch(e => {
    						const error = ensure_error(e, "Unknown error while processing markdown").message;

    						$$invalidate(0, state = {
    							state: "error",
    							markdown: current_markdown,
    							error
    						});
    					});
    				}
    			}
    		}
    	};

    	return [state, markdown];
    }

    class Markdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, not_equal, { markdown: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Markdown",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*markdown*/ ctx[1] === undefined && !("markdown" in props)) {
    			console.warn("<Markdown> was created without expected prop 'markdown'");
    		}
    	}

    	get markdown() {
    		throw new Error("<Markdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set markdown(value) {
    		throw new Error("<Markdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/palette/Brand.svelte generated by Svelte v3.38.2 */

    const file$n = "src/palette/Brand.svelte";

    // (12:0) {#if show}
    function create_if_block$f(ctx) {
    	let a;
    	let svg;
    	let text0;
    	let t0;
    	let text1;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			text0 = svg_element("text");
    			t0 = text("PL0T");
    			text1 = svg_element("text");
    			t1 = text("PL0T");
    			attr_dev(text0, "class", "svg_stroke svelte-oqy3sh");
    			attr_dev(text0, "x", "15");
    			attr_dev(text0, "y", "75");
    			add_location(text0, file$n, 14, 6, 344);
    			attr_dev(text1, "class", "svgText");
    			attr_dev(text1, "x", "15");
    			attr_dev(text1, "y", "75");
    			add_location(text1, file$n, 15, 6, 401);
    			attr_dev(svg, "viewBox", "0 0 200 100");
    			attr_dev(svg, "class", "svelte-oqy3sh");
    			add_location(svg, file$n, 13, 4, 310);
    			attr_dev(a, "href", "http://pl0t.com");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-oqy3sh");
    			add_location(a, file$n, 12, 2, 263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, text0);
    			append_dev(text0, t0);
    			append_dev(svg, text1);
    			append_dev(text1, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(12:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;
    	let if_block = /*show*/ ctx[0] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }
    let show_all = true;

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Brand", slots, []);
    	let { is_main = false } = $$props;
    	if (is_main) show_all = false;
    	let show = false;

    	set_interval(
    		() => {
    			$$invalidate(0, show = show_all || is_main);
    		},
    		1000
    	);

    	const writable_props = ["is_main"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Brand> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("is_main" in $$props) $$invalidate(1, is_main = $$props.is_main);
    	};

    	$$self.$capture_state = () => ({ show_all, is_main, show });

    	$$self.$inject_state = $$props => {
    		if ("is_main" in $$props) $$invalidate(1, is_main = $$props.is_main);
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, is_main];
    }

    class Brand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, not_equal, { is_main: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Brand",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get is_main() {
    		throw new Error("<Brand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_main(value) {
    		throw new Error("<Brand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/palette/Messages.svelte generated by Svelte v3.38.2 */

    const file$m = "src/palette/Messages.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (5:0) {#if messages.length > 0}
    function create_if_block$e(ctx) {
    	let div;
    	let each_value = /*messages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "text-sm mt-1 mx-1");
    			add_location(div, file$m, 5, 2, 80);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1) {
    				each_value = /*messages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(5:0) {#if messages.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (12:6) {:else}
    function create_else_block$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "unknown message type";
    			add_location(div, file$m, 12, 8, 420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(12:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:40) 
    function create_if_block_2$3(ctx) {
    	let div;
    	let span;
    	let t1;
    	let t2_value = /*message*/ ctx[1].message + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "error";
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(span, "class", "bg-red-400 px-2 rounded");
    			add_location(span, file$m, 10, 13, 323);
    			add_location(div, file$m, 10, 8, 318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t2_value !== (t2_value = /*message*/ ctx[1].message + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(10:40) ",
    		ctx
    	});

    	return block;
    }

    // (8:6) {#if message.type == "warn"}
    function create_if_block_1$8(ctx) {
    	let div;
    	let span;
    	let t1;
    	let t2_value = /*message*/ ctx[1].message + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "warn";
    			t1 = space();
    			t2 = text(t2_value);
    			attr_dev(span, "class", "bg-yellow-400 px-2 rounded");
    			add_location(span, file$m, 8, 13, 192);
    			add_location(div, file$m, 8, 8, 187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t2_value !== (t2_value = /*message*/ ctx[1].message + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(8:6) {#if message.type == \\\"warn\\\"}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#each messages as message}
    function create_each_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*message*/ ctx[1].type == "warn") return create_if_block_1$8;
    		if (/*message*/ ctx[1].type == "error") return create_if_block_2$3;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(7:4) {#each messages as message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let if_block_anchor;
    	let if_block = /*messages*/ ctx[0].length > 0 && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*messages*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Messages", slots, []);
    	
    	let { messages } = $$props;
    	const writable_props = ["messages"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Messages> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	$$self.$capture_state = () => ({ messages });

    	$$self.$inject_state = $$props => {
    		if ("messages" in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [messages];
    }

    class Messages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, not_equal, { messages: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*messages*/ ctx[0] === undefined && !("messages" in props)) {
    			console.warn("<Messages> was created without expected prop 'messages'");
    		}
    	}

    	get messages() {
    		throw new Error("<Messages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messages(value) {
    		throw new Error("<Messages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function normalize_messages(messages) {
        return messages
            .map((m) => typeof m == 'string' ? { type: 'warn', message: m } : m)
            .unique(({ message }) => message)
            .sort_by(({ type, message }) => `${type} ${message}`);
    }

    /* src/blocks/ImageBlockImpl.svelte generated by Svelte v3.38.2 */
    const file$l = "src/blocks/ImageBlockImpl.svelte";

    // (22:2) {:else}
    function create_else_block$4(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: "Data images not supported yet" },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(22:2) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (20:2) {#if typeof image == 'object' && 'url' in image}
    function create_if_block$d(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block_1 = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[1].url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*block*/ ctx[0].id);
    			add_location(img, file$l, 20, 4, 451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*image*/ 2 && img.src !== (img_src_value = /*image*/ ctx[1].url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*block*/ 1 && img_alt_value !== (img_alt_value = /*block*/ ctx[0].id)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(20:2) {#if typeof image == 'object' && 'url' in image}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (typeof /*image*/ ctx[1] == "object" && "url" in /*image*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "ImageBlockContent");
    			add_location(div, file$l, 18, 0, 364);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    const definition$4 = {
    	match_and_normalize: data => {
    		if (is_object(data) && "image" in data) return data;
    	}
    };

    function instance$l($$self, $$props, $$invalidate) {
    	let image;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ImageBlockImpl", slots, []);
    	
    	
    	let { block } = $$props;
    	let { is_narrow } = $$props;
    	discard(is_narrow);
    	const writable_props = ["block", "is_narrow"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ImageBlockImpl> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(2, is_narrow = $$props.is_narrow);
    	};

    	$$self.$capture_state = () => ({
    		definition: definition$4,
    		Fail,
    		block,
    		is_narrow,
    		image
    	});

    	$$self.$inject_state = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(2, is_narrow = $$props.is_narrow);
    		if ("image" in $$props) $$invalidate(1, image = $$props.image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*block*/ 1) {
    			$$invalidate(1, image = block.image);
    		}
    	};

    	return [block, image, is_narrow];
    }

    class ImageBlockImpl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, not_equal, { block: 0, is_narrow: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageBlockImpl",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !("block" in props)) {
    			console.warn("<ImageBlockImpl> was created without expected prop 'block'");
    		}

    		if (/*is_narrow*/ ctx[2] === undefined && !("is_narrow" in props)) {
    			console.warn("<ImageBlockImpl> was created without expected prop 'is_narrow'");
    		}
    	}

    	get block() {
    		throw new Error("<ImageBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<ImageBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_narrow() {
    		throw new Error("<ImageBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_narrow(value) {
    		throw new Error("<ImageBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ImageBlockImpl$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': ImageBlockImpl,
        definition: definition$4
    });

    /* src/blocks/TextBlockImpl/TextBlockImpl.svelte generated by Svelte v3.38.2 */
    const file$k = "src/blocks/TextBlockImpl/TextBlockImpl.svelte";

    // (26:2) {:catch error}
    function create_catch_block$3(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: /*error*/ ctx[3] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fail_changes = {};
    			if (dirty & /*block*/ 1) fail_changes.error = /*error*/ ctx[3];
    			fail.$set(fail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(26:2) {:catch error}",
    		ctx
    	});

    	return block_1;
    }

    // (24:2) {:then markdown}
    function create_then_block$3(ctx) {
    	let markdown;
    	let current;

    	markdown = new Markdown({
    			props: { markdown: /*markdown*/ ctx[2] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(markdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(markdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const markdown_changes = {};
    			if (dirty & /*block*/ 1) markdown_changes.markdown = /*markdown*/ ctx[2];
    			markdown.$set(markdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(markdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(24:2) {:then markdown}",
    		ctx
    	});

    	return block_1;
    }

    // (22:39)      <Progress/>   {:then markdown}
    function create_pending_block$3(ctx) {
    	let progress;
    	let current;
    	progress = new Progress({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			create_component(progress.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progress, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progress, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(22:39)      <Progress/>   {:then markdown}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 2,
    		error: 3,
    		blocks: [,,,]
    	};

    	handle_promise(promise = get_or_load_data(/*block*/ ctx[0].text), info);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			attr_dev(div, "class", "TextBlockContent");
    			add_location(div, file$k, 20, 0, 476);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*block*/ 1 && promise !== (promise = get_or_load_data(/*block*/ ctx[0].text)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    const definition$3 = {
    	match_and_normalize: data => {
    		if (is_string(data)) return { text: data }; else if (is_object(data) && "text" in data) return data;
    	}
    };

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextBlockImpl", slots, []);
    	
    	
    	let { block } = $$props;
    	let { is_narrow } = $$props;
    	discard(is_narrow);
    	const writable_props = ["block", "is_narrow"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextBlockImpl> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(1, is_narrow = $$props.is_narrow);
    	};

    	$$self.$capture_state = () => ({
    		definition: definition$3,
    		get_or_load_data,
    		Fail,
    		Progress,
    		Markdown,
    		block,
    		is_narrow
    	});

    	$$self.$inject_state = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(1, is_narrow = $$props.is_narrow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block, is_narrow];
    }

    class TextBlockImpl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, not_equal, { block: 0, is_narrow: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextBlockImpl",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !("block" in props)) {
    			console.warn("<TextBlockImpl> was created without expected prop 'block'");
    		}

    		if (/*is_narrow*/ ctx[1] === undefined && !("is_narrow" in props)) {
    			console.warn("<TextBlockImpl> was created without expected prop 'is_narrow'");
    		}
    	}

    	get block() {
    		throw new Error("<TextBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<TextBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_narrow() {
    		throw new Error("<TextBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_narrow(value) {
    		throw new Error("<TextBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TextBlockImpl$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': TextBlockImpl,
        definition: definition$3
    });

    // Properties --------------------------------------------------------------------------------------
    const PropertiesKeys = ['width', 'height', 'config'];
    function parse_properties(properties) {
        for (const key in properties)
            if (PropertiesKeys.indexOf(key) < 0)
                throw new Error(`invalid property '${key}'`);
        validate_type('width', properties.width, ['number', 'undefined']);
        validate_type('height', properties.height, ['number', 'undefined']);
        return properties;
    }
    // Interpolate -------------------------------------------------------------------------------------
    const InterpolateValues = [
        'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 'basis-open',
        'basis-closed', 'cardinal', 'cardinal-open', 'cardinal-closed', 'bundle', 'monotone'
    ];
    function parse_interpolate(value) {
        if (InterpolateValues.indexOf(value) < 0)
            throw new Error(`invalid interpolate '${value}', available are ${InterpolateValues.join(', ')}`);
        return value;
    }
    // Mark --------------------------------------------------------------------------------------------
    const MarkValues = [
        'point', 'circle', 'line', 'area', 'bar', 'rect', 'rule', 'square', 'text', 'tick', 'trail'
    ];
    function parse_mark(value) {
        if (MarkValues.indexOf(value) < 0)
            throw new Error(`invalid mark '${value}', available are ${MarkValues.join(', ')}`);
        return value;
    }
    // MarkSpec ----------------------------------------------------------------------------------------
    const MarkSpecKeys = ['mark', 'color', 'size', 'point', 'interpolate', 'opacity', 'thickness', 'vega'];
    function parse_mark_spec(spec) {
        for (const key in spec)
            if (MarkSpecKeys.indexOf(key) < 0)
                throw new Error(`unknown mark property '${key}', available are ${MarkSpecKeys.join(', ')}`);
        const { mark, color, size, point, interpolate, opacity, thickness, vega } = spec;
        validate_type('color', color, ['string', 'undefined']);
        validate_type('size', size, ['number', 'undefined']);
        validate_type('point', point, ['boolean', 'undefined']);
        if (interpolate)
            parse_interpolate(interpolate);
        validate_type('opacity', opacity, ['number', 'undefined']);
        validate_type('thickness', thickness, ['number', 'undefined']);
        validate_type('vega', vega, ['object', 'undefined']);
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: parse_mark(mark) }, (color !== undefined ? { color } : {})), (size !== undefined ? { size } : {})), (point !== undefined ? { point } : {})), (interpolate !== undefined ? { interpolate } : {})), (opacity !== undefined ? { opacity } : {})), (thickness !== undefined ? { thickness } : {})), (vega !== undefined ? vega : {}));
    }
    // FieldType ---------------------------------------------------------------------------------------
    const FieldTypeValues = [
        'nominal', 'ordinal', 'quantitative', 'temporal'
    ];
    function parse_field_type(value) {
        if (FieldTypeValues.indexOf(value) < 0)
            throw new Error(`invalid field type '${value}', available are ${FieldTypeValues.join(', ')}`);
        return value;
    }
    // Scale -------------------------------------------------------------------------------------------
    const ScaleTypeValues = [
        'linear', 'pow', 'sqrt', 'symlog', 'log', 'time', 'utc',
        'ordinal', 'band', 'point',
        'bin-ordinal', 'quantile', 'quantize', 'threshold'
    ];
    function parse_scale_type(value) {
        if (ScaleTypeValues.indexOf(value) < 0)
            throw new Error(`invalid scale type '${value}', available are ${ScaleTypeValues.join(', ')}`);
        return value;
    }
    // Aggregate ---------------------------------------------------------------------------------------
    const AggregateValues = [
        'count', 'valid', 'missing', 'distinct', 'sum', 'mean', 'average',
        'variance', 'variancep', 'stdev', 'stdevp', 'stderr', 'median', 'q1', 'q3', 'ci0', 'ci1',
        'min', 'max', 'argmin', 'argmax',
        'product'
    ];
    function parse_aggregate(value) {
        if (AggregateValues.indexOf(value) < 0)
            throw new Error(`invalid aggregate '${value}', available are ${AggregateValues.join(', ')}`);
        return value;
    }
    // Channel -----------------------------------------------------------------------------------------
    const ChannelValues = [
        'x', 'y', 'x2', 'y2', 'xError', 'yError', 'xError2', 'yError2',
        'longitude', 'latitude', 'longitude2', 'latitude2',
        'color', 'opacity', 'fillOpacity', 'strokeOpacity', 'shape', 'size', 'strokeWidth',
        'text', 'tooltip',
        'href',
        'detail',
        'key',
        'order'
    ];
    // ScaleDomain -------------------------------------------------------------------------------------
    function parse_scale_domain(values) {
        return values.map((v) => {
            validate_type('scale domain', v, ['number', 'string', 'boolean']);
            return v;
        });
    }
    // ScaleRange --------------------------------------------------------------------------------------
    function parse_scale_range(value) {
        if (typeof value == 'string') {
            validate_type('scale range', value, ['string']);
            return value;
        }
        else {
            return value.map((v) => {
                validate_type('scale domain', v, ['number', 'string']);
                return v;
            });
        }
    }
    // TimeUnit ----------------------------------------------------------------------------------------
    const TimeUnitValues = [
        'year', 'yearquarter', 'yearquartermonth', 'yearmonth', 'yearmonthdate',
        'yearmonthdatehours', 'yearmonthdatehoursminutes', 'yearmonthdatehoursminutesseconds', 'quarter',
        'quartermonth', 'month', 'monthdate', 'date', 'day', 'hours', 'hoursminutes', 'hoursminutesseconds',
        'minutes', 'minutesseconds', 'seconds', 'secondsmilliseconds', 'milliseconds'
    ];
    function parse_time_unit(value) {
        if (TimeUnitValues.indexOf(value) < 0)
            throw new Error(`invalid time unit '${value}', available are ${TimeUnitValues.join(', ')}`);
        return value;
    }
    // BinValue ----------------------------------------------------------------------------------------
    function parse_bin(value) {
        validate_type('bin', value, ['string', 'number', 'boolean', 'undefined']);
        if (typeof value == 'string' && value != 'binned')
            throw new Error(`bin should have type of "boolean | number | 'binned'"`);
        if (typeof value == 'boolean')
            return value;
        else if (typeof value == 'string')
            return value;
        else
            return { base: value, maxbins: value };
    }
    // Calculate ---------------------------------------------------------------------------------------
    const CalculateKeys = ['calculate', 'as'];
    function parse_calculate(calculate) {
        for (const key in calculate)
            if (CalculateKeys.indexOf(key) < 0)
                throw new Error(`unknown calculate property '${key}', available are ${CalculateKeys.join(', ')}`);
        return calculate;
    }
    // Filter ------------------------------------------------------------------------------------------
    const FilterKeys = ['filter'];
    function parse_filter(filter) {
        for (const key in filter)
            if (FilterKeys.indexOf(key) < 0)
                throw new Error(`unknown filter property '${key}', available are ${FilterKeys.join(', ')}`);
        return filter;
    }
    // Encoding ----------------------------------------------------------------------------------------
    const SharedEncodingKeys = [
        'type', 'aggregate', 'legend', 'title', 'labels', 'time_unit', 'timeUnit', 'bin', 'zero', 'domain', 'range',
        'scale', 'value', 'override_value', 'scheme', 'reverse', 'vega'
    ];
    function parse_encoding(encoding) {
        const channels = [];
        for (const key in encoding) {
            if (SharedEncodingKeys.indexOf(key) < 0) {
                if (ChannelValues.indexOf(key) < 0)
                    throw new Error(`unknown encoding property '${key}', available are ` +
                        `${ChannelValues.join(', ')}, ${SharedEncodingKeys.join(', ')}`);
                else
                    channels.push(key);
            }
        }
        if (channels.length == 0)
            throw new Error(`encoding channel not specified, please specify one of ${ChannelValues.join(', ')}`);
        if (channels.length > 1)
            throw new Error(`only one channel allowed in the same encoding, leave only one of ${channels.join(', ')}`);
        if (encoding.type)
            parse_field_type(encoding.type);
        if (encoding.aggregate)
            parse_aggregate(encoding.aggregate);
        validate_type('legend', encoding.legend, ['string', 'boolean', 'undefined']);
        validate_type('title', encoding.title, ['string', 'boolean', 'undefined']);
        validate_type('labels', encoding.labels, ['boolean', 'undefined']);
        if (encoding.time_unit)
            parse_time_unit(encoding.time_unit);
        if (encoding.timeUnit)
            parse_time_unit(encoding.timeUnit);
        if (encoding.bin)
            parse_bin(encoding.bin);
        validate_type('zero', encoding.zero, ['boolean', 'undefined']);
        if (encoding.scale)
            parse_scale_type(encoding.scale);
        if (encoding.domain)
            parse_scale_domain(encoding.domain);
        if (encoding.range)
            parse_scale_range(encoding.range);
        // validate_type('value', encoding.value, ['string', 'number', 'boolean', 'undefined'])
        validate_type('scheme', encoding.scheme, ['string', 'undefined']);
        validate_type('reverse', encoding.reverse, ['boolean', 'undefined']);
        validate_type('vega', encoding.vega, ['object', 'undefined']);
        // Parsing
        const { type, title, labels, aggregate, legend, timeUnit, time_unit, bin, zero, domain, range, scale, value, scheme, reverse, vega, override_value } = encoding;
        const channel = ChannelValues.find((channel) => channel in encoding);
        if (!channel)
            throw new Error(`Channel not found in ${JSON.stringify(encoding)}!`);
        const field = encoding[channel];
        const axis = Object.assign(Object.assign(Object.assign({}, ((vega !== undefined && 'axis' in vega) ? vega['axis'] : {})), ((title && (typeof title == 'string')) ? { title } : (title ? {} : { title: null }))), (labels !== undefined ? { labels } : {}));
        const vega_scale = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ((vega !== undefined && 'scale' in vega) ? vega['scale'] : {})), (scale !== undefined ? { type: scale } : {})), (domain !== undefined ? { nice: false } : {})), (zero !== undefined ? { zero } : {})), (domain !== undefined ? { domain } : {})), (range !== undefined ? { range } : {})), (scheme !== undefined ? { scheme } : {})), (reverse !== undefined ? { reverse } : {}));
        let vega_encoding = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (vega !== undefined ? vega : {})), (field !== "" ? { field } : {})), { type: type || 'quantitative' }), (aggregate !== undefined ? { aggregate } : {})), (legend !== undefined ? { legend } : { legend: false })), (timeUnit !== undefined ? { timeUnit } : {})), (time_unit !== undefined ? { timeUnit: time_unit } : {})), (Object.keys(axis).length > 0 ? { axis } : {})), (Object.keys(vega_scale).length > 0 ? { scale: vega_scale } : {})), (bin !== undefined ? { bin: parse_bin(bin) } : {}));
        let table_data = undefined;
        if (value) {
            const result = parse_and_add_encoding_value(value, channel, vega_encoding);
            vega_encoding = result[0];
            table_data = result[1];
        }
        return [channel, vega_encoding, table_data];
    }
    // EncodingValue -----------------------------------------------------------------------------------
    // Simple case
    //
    //   `value: 'red'`
    //
    // Conditional value
    //
    //   `value: ['datum.value > 0', 'red']`
    //   `value: ['datum.value > 0', 1, 2]`
    //
    // Explicit value value on `x` and `y` encoding channels will be transformed into data
    // needed to simplify rule definition.
    //
    //   value: 1
    //
    // will be transformed into
    //
    //   data: {
    //     values: {
    //       explicit_value: 1
    //     }
    //   }
    //
    //   { field: 'explicit_value' }
    //
    const explicit_value_channels = ['x', 'y'];
    function parse_and_add_encoding_value(value, channel, vega_encoding) {
        const parse_simple_value = (v) => {
            if (v === undefined)
                throw new Error(`encoding value shouldn't be undefined`);
            validate_type('encoding value', v, ['number', 'string', 'boolean']);
            return v;
        };
        if (Array.isArray(value)) {
            // Conditional value
            // `value: ['datum.value > 0', 'red']`
            // `value: ['datum.value > 0', 1, 2]`
            if ('condition' in vega_encoding)
                throw new Error(`Conditional value can't be used with condition!`);
            if (value.length == 2) {
                const [condition, v] = value;
                return [Object.assign(Object.assign({}, vega_encoding), { condition: {
                            test: condition,
                            value: parse_simple_value(v)
                        } }), undefined];
            }
            else if (value.length == 3) {
                const [condition, v, v2] = value;
                return [Object.assign(Object.assign({}, vega_encoding), { value: parse_simple_value(v2), condition: {
                            test: condition,
                            value: parse_simple_value(v)
                        } }), undefined];
            }
            else
                throw new Error(`encoding value should be a simple value or array with 2 ['datum.value > 0', 'green']` +
                    ` or 3 elements ['datum.value > 0', 1, -1]`);
        }
        if (explicit_value_channels.indexOf(channel) >= 0) {
            // Explicit value value
            //
            //   value: 1
            //
            // will be transformed into
            //
            //   data: {
            //     values: {
            //       explicit_value: 1
            //     }
            //   }
            //
            //   { field: 'explicit_value' }
            if (!(vega_encoding.field == '' || vega_encoding.field === undefined || vega_encoding.field === null))
                throw new Error(`value on ${explicit_value_channels.join(', ')} channels cannot be used with 'field'`);
            const table_data = [
                { explicit_value: parse_simple_value(value) }
            ];
            return [Object.assign(Object.assign({}, vega_encoding), { field: 'explicit_value' }), table_data];
        }
        else {
            return [Object.assign(Object.assign({}, vega_encoding), { value: parse_simple_value(value) }), undefined];
        }
    }
    function to_vega_facet(facets, spec, vega_props) {
        let facet = undefined;
        for (const f of facets)
            if ('facet' in f)
                facet = f;
        if (facet) {
            if (facets.length > 1)
                throw new Error(`Can't other facets with 'facet' keyword`);
            return Object.assign(Object.assign(Object.assign({ facet: {
                    field: facet.facet,
                    type: facet.type || 'ordinal',
                    header: { title: null }
                } }, (facet.columns !== undefined ? { columns: facet.columns } : {})), { spec }), vega_props);
        }
        else {
            const row_count = facets.filter((definition) => 'row' in definition).length;
            if (row_count > 1)
                throw new Error(`Facet can't have more than one row`);
            const column_count = facets.filter((definition) => 'column' in definition).length;
            if (column_count > 1)
                throw new Error(`Facet can't have more than one column`);
            let row = undefined, column = undefined;
            for (const facet of facets) {
                if ('row' in facet)
                    row = facet;
                if ('column' in facet)
                    column = facet;
            }
            return Object.assign({ facet: Object.assign(Object.assign({}, (row ? { row: {
                        field: row.row,
                        type: row.type || 'ordinal',
                        header: { title: null }
                    } } : {})), (column ? { column: {
                        field: column.column,
                        type: column.type || 'ordinal',
                        header: { title: null }
                    } } : {})), spec }, vega_props);
        }
    }
    // Concat ------------------------------------------------------------------------------------------
    const ConcatKeys = ['concat'];
    function parse_concat(concat) {
        for (const key in concat)
            if (ConcatKeys.indexOf(key) < 0)
                throw new Error(`unknown concat property '${key}', available are ${ConcatKeys.join(', ')}`);
        return concat;
    }
    // to_vega -----------------------------------------------------------------------------------------
    function to_vega(plot) {
        const top_level_marks = [];
        let top_level_vega_encodings = {};
        let transforms = [];
        let vega_layers = [], custom_vega = undefined;
        let properties = {};
        const facets = [], concats = [];
        for (const part of plot) {
            if (typeof part == 'string')
                top_level_marks.push(parse_mark(part));
            else if ('mark' in part)
                top_level_marks.push(parse_mark_spec(part));
            else if (Array.isArray(part))
                vega_layers = [...vega_layers, to_vega_layer(part)];
            else if ('calculate' in part)
                transforms.push(parse_calculate(part));
            else if ('filter' in part)
                transforms.push(parse_filter(part));
            else if ('facet' in part ||
                'row' in part ||
                'column' in part)
                facets.push(part);
            else if ('concat' in part)
                concats.push(parse_concat(part));
            else if ('height' in part ||
                'width' in part ||
                'config' in part)
                properties = Object.assign(Object.assign({}, properties), parse_properties(part));
            else if (ChannelValues.some((channel) => channel in part)) {
                const [channel, vega_encoding, table_data] = parse_encoding(part);
                if (channel in vega_encoding)
                    throw new Error(`Can't redefine channel ${channel}!`);
                if (table_data !== undefined)
                    throw new Error(`Explicit value for '${channel}' allowed only inside of a layer`);
                top_level_vega_encodings = Object.assign(Object.assign({}, top_level_vega_encodings), { [channel]: vega_encoding });
            }
            else if ('vega' in part)
                custom_vega = part.vega;
            else
                throw new Error(`unknown plot part ${JSON.stringify(part)}`);
        }
        if (top_level_marks.length > 1)
            throw new Error(`Multiple marks found ${top_level_marks.join(', ')}`);
        const vega_props = Object.assign(Object.assign(Object.assign({}, (transforms.length > 0 ? { transform: transforms } : {})), properties), (custom_vega ? custom_vega : {}));
        function top_level_spec() {
            return Object.assign(Object.assign(Object.assign({}, (top_level_marks.length > 0 ? { mark: top_level_marks[0] } : {})), (Object.keys(top_level_vega_encodings).length > 0 ? { encoding: top_level_vega_encodings } : {})), (vega_layers.length > 0 ? { layer: vega_layers } : {}));
        }
        if (facets.length > 0) {
            if (concats.length > 0)
                throw new Error(`concat can't be used with facet`);
            return to_vega_facet(facets, top_level_spec(), vega_props);
        }
        else if (concats.length > 0) {
            if (concats.length > 1)
                throw new Error(`there could be only one concat`);
            if (facets.length > 0)
                throw new Error(`concat can't be used with facet`);
            if (top_level_marks.length > 0)
                throw new Error(`top level mark can't be used with concat`);
            if (Object.keys(top_level_vega_encodings).length > 0)
                throw new Error(`top level encoding can't be used with concat`);
            if (vega_layers.length == 0)
                throw new Error(`concat requires at least one layer`);
            return Object.assign({ [concats[0].concat == 'vertical' ? 'vconcat' : 'hconcat']: vega_layers }, vega_props);
        }
        else {
            return Object.assign(Object.assign({}, top_level_spec()), vega_props);
        }
    }
    // to_vega_layer -----------------------------------------------------------------------------------
    function to_vega_layer(plot) {
        const marks = [], transforms = [];
        let vega_encodings = {};
        let vega = undefined, properties = {}, table_data;
        for (const part of plot) {
            if (typeof part == 'string')
                marks.push(parse_mark(part));
            else if ('mark' in part)
                marks.push(parse_mark_spec(part));
            else if ('calculate' in part)
                transforms.push(parse_calculate(part));
            else if ('filter' in part)
                transforms.push(parse_filter(part));
            else if ('height' in part || 'width' in part)
                properties = Object.assign(Object.assign({}, properties), parse_properties(part));
            else if (ChannelValues.some((channel) => channel in part)) {
                const [channel, vega_encoding, td] = parse_encoding(part);
                if (channel in vega_encoding)
                    throw new Error(`Can't redefine channel ${channel}!`);
                table_data = td;
                vega_encodings = Object.assign(Object.assign({}, vega_encodings), { [channel]: vega_encoding });
            }
            else if ('vega' in part)
                vega = part.vega;
            else
                throw new Error(`unknown plot layer part ${JSON.stringify(part)}`);
        }
        if (marks.length > 1)
            throw new Error(`Multiple marks found ${marks.join(', ')}`);
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (transforms.length > 0 ? { transform: transforms } : {})), (marks.length > 0 ? { mark: marks[0] } : {})), (Object.keys(vega_encodings).length > 0 ? { encoding: vega_encodings } : {})), properties), (table_data ? { data: { values: table_data } } : {})), (vega ? vega : {}));
    }
    // to_table_data -----------------------------------------------------------------------------------
    // Converting list of arrays to table if needed
    //
    //   {
    //     date:  ["2012", "2013"],
    //     price: [1000, 2000.2]
    //   }
    //
    // Into table
    //
    //   [
    //     { date: "2012", price: 1000 },
    //     { date: "2013", price: 2002.2 }
    //   ]
    //
    // null or undefined columsn will be created, so if all column values are undefined it will be
    // completelly erasesd. To avoid that its id will be returned in `columns`
    function to_tidy_data(data, columns, keep_undefined = false) {
        const clean_row = keep_undefined ? replace_nulls_with_undefined : clean_nulls_and_undefined;
        if (data instanceof Array) {
            if (data.length == 0)
                return [];
            if (Array.isArray(data[0])) { // data = [[1, 2], [2, 3]]
                return array_row_to_map_row(data, columns || abc_letters).map(clean_row);
            }
            else { // data = [{ x: 1, y: 2 }, { x: 2, y: 3 }]
                return data.map(clean_row);
            }
        }
        else { // data = { x: [1, 2], y: [1, 2] }
            if (!(data instanceof Object))
                throw new Error('Arrays data expected to be an Object');
            const keys = Object.keys(data);
            if (keys.length == 0)
                throw new Error('Empty arrays data!');
            const key1 = keys[0];
            const length1 = data[key1].length;
            // Ensuring arrays are of the same length
            for (const key2 of keys)
                if (data[key2].length != length1)
                    throw new Error(`Arrays data has arrays of different length ` +
                        `${key2} - ${data[key2].length} and ${key1} - ${length1}`);
            // Converting
            const table = [];
            for (let i = 0; i < length1; i++) {
                const row = {};
                for (const key of keys)
                    row[key] = data[key][i];
                table.push(row);
            }
            return table.map(clean_row);
        }
    }
    const abc_letters = "abcdefghijklmnopqrstuvwxyz".split("");
    function array_row_to_map_row(rows, columns) {
        return rows.map((row) => {
            const mrow = {};
            for (let i = 0; i < row.length; i++) {
                if (i < columns.length)
                    mrow[columns[i]] = row[i];
                else
                    throw new Error("there are more values in row than columns");
            }
            return mrow;
        });
    }
    function replace_nulls_with_undefined(row) {
        const drow = {};
        for (let k in row) {
            const v = row[k];
            drow[k] = v !== null ? v : undefined;
        }
        return drow;
    }
    function clean_nulls_and_undefined(row) {
        const drow = {};
        for (let k in row) {
            const v = row[k];
            if (v !== null && v !== undefined)
                drow[k] = v;
        }
        return drow;
    }
    // override_size_in_narrow_mode --------------------------------------------------------------------
    function override_size_in_narrow_mode(vega_spec, max_width, max_height) {
        if (!(vega_spec.width && vega_spec.width < max_width))
            vega_spec = Object.assign(Object.assign({}, vega_spec), { width: max_width });
        if (!(vega_spec.height && vega_spec.height < max_height))
            vega_spec = Object.assign(Object.assign({}, vega_spec), { height: max_height });
        return vega_spec;
    }
    // Utils -------------------------------------------------------------------------------------------
    function validate_type(key_name, value, allowed_types) {
        if (allowed_types.indexOf(typeof (value)) < 0)
            throw new Error(`invalid type for '${key_name}' allowed types ${allowed_types.join(', ')}`);
    }
    // function to_vega_concat(concats: Facet[]): VegaFacet {
    //   const row_count = facets.filter((definition) => 'row' in definition).length
    //   if (row_count > 1) throw new Error(`Facet can't have more than one row`)
    //   const column_count = facets.filter((definition) => 'column' in definition).length
    //   if (column_count > 1) throw new Error(`Facet can't have more than one column`)
    //   let row: RowFacet | undefined = undefined, column: ColumnFacet | undefined = undefined
    //   for (const facet of facets) {
    //     if ('row' in facet)    row = facet
    //     if ('column' in facet) column = facet
    //   }
    //   return {
    //     ...(row ? { row: {
    //       field:  row.row,
    //       type:   row.type || 'ordinal',
    //       header: { title: null }
    //     } } : {}),
    //     ...(column ? { column: {
    //       field:  column.column,
    //       type:   column.type || 'ordinal',
    //       header: { title: null }
    //     } } : {}),
    //   }
    // }
    // function truncate(s: string): string { return s.replace(/^[\s\n]+|[\s\n]+$/g, '') }
    // function parse_js_value(s: string): string | number | boolean {
    //   s = truncate(s)
    //   if      ('' + parseInt(s) == s)   return parseInt(s)
    //   else if ('' + parseFloat(s) == s) return parseFloat(s)
    //   else if (s == 'false')            return false
    //   else if (s == 'true')             return true
    //   else                              return s
    // }

    function destroy_vega(vega_view) {
        vega_view.finalize(); // Destroying old vega
    }
    async function embed_vega({ chart, data, vega_options, is_narrow, suggested_width_px, vega_view, container_el }) {
        await ensure_loaded([
            '/vendor/vega/vega-5.9.1.js',
            '/vendor/vega/vega-lite-4.0.2.js',
            '/vendor/vega/vega-embed-6.2.1.js'
        ], 'serial');
        if (vega_view)
            destroy_vega(vega_view);
        if (!container_el)
            return undefined; // view is not initialized yet
        function override_width(vega_spec) {
            return suggested_width_px !== undefined && is_narrow ?
                override_size_in_narrow_mode(vega_spec, suggested_width_px, plot_config.height_in_narrow_width_mode) :
                vega_spec;
        }
        let vega_spec = 'vega_spec' in chart ? override_width(chart.vega_spec) : override_width(to_vega(chart));
        if (data)
            vega_spec = Object.assign(Object.assign({}, vega_spec), { data: { values: to_tidy_data(data) } });
        vega_options = vega_options || {};
        // Rendering vega
        const result = await window.vegaEmbed(container_el, Object.assign(Object.assign({}, default_vega_spec({ suggested_width_px })), vega_spec), Object.assign(Object.assign({}, default_vega_options()), vega_options));
        return result.view;
    }
    function default_vega_spec({ suggested_width_px }) {
        return {
            // The format of url cannot be changed it expected to contain `schema/vega-lite/4.0.2.json` part.
            // $schema: `http://localhost:${port}/assets/vega/schema/vega-lite/v4.0.2.json`,
            autosize: {
                // type:     'fit-x',
                type: 'fit',
                contains: 'padding'
            },
            width: suggested_width_px,
            // height: 200,
        };
    }
    function default_vega_options() {
        return {
        // actions: false,
        // width:  300,
        // height: 200,
        };
    }
    // export function to_vega_props(
    //   chart:               Plot | VegaSpec,
    //   data:                Data,
    //   vega_options:        object | undefined,
    //   is_narrow:           boolean,
    //   suggested_width_px?: number
    // ): { vega_spec: Object, vega_options: Object, vega_data?: TidyData } {
    //   function override_width(vega_spec: VegaFullSpec) {
    //     return suggested_width_px !== undefined && is_narrow ?
    //       override_size_in_narrow_mode(vega_spec, suggested_width_px, height_in_narrow_width_mode) :
    //       vega_spec
    //   }
    //   const vega_spec = 'vega_spec' in chart ? override_width(chart.vega_spec) : override_width(to_vega(chart))
    //   const vega_data = to_tidy_data(data)
    //   return { vega_spec, vega_options: vega_options || {}, vega_data }
    //   // if ('vega_spec' in chart) {
    //   //   const vega_spec = override_width(chart.vega_spec)
    //   //   let vega_data: TidyData = []
    //   //   if (data) {
    //   //     // const table_data = to_table_data(vega_data)
    //   //     // vega_spec = { ...vega_spec, data: { values: table_data }}
    //   //     vega_data = to_tidy_data(data)
    //   //   }
    //   //   return { vega_spec, vega_options, vega_data }
    //   // } else {
    //   //   // const { chart: plot, data, vega_options } = block
    //   //   const vega_spec = override_width(to_vega(chart))
    //   //   const vega_data = to_tidy_data(data)
    //   //   // const vega_spec = { ...vega_spec_without_data, data: { values: table_data }}
    //   //   return { vega_spec, vega_options, vega_data }
    //   // }
    // }
    // let vega_loading: Promise<void> | undefined = undefined
    // export async function after_vega_loaded(): Promise<void> {
    //   const base_url = get_env("base_url")
    //   if (base_url === undefined) throw new Error("base_url not specified")
    //   async function load() {
    //     await ensure_script_loaded(`${base_url}/vendor/vega/vega-5.9.1.js`)
    //     await ensure_script_loaded(`${base_url}/vendor/vega/vega-lite-4.0.2.js`)
    //     await ensure_script_loaded(`${base_url}/vendor/vega/vega-embed-6.2.1.js`)
    //   }
    //   if (!vega_loading) vega_loading = load()
    //   return vega_loading
    // }

    /* src/blocks/ChartBlockImpl/Chart.svelte generated by Svelte v3.38.2 */
    const file$j = "src/blocks/ChartBlockImpl/Chart.svelte";

    // (43:35) 
    function create_if_block_1$7(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: /*state*/ ctx[2].error },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fail_changes = {};
    			if (dirty & /*state*/ 4) fail_changes.error = /*state*/ ctx[2].error;
    			fail.$set(fail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(43:35) ",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if state.state == "empty"}
    function create_if_block$c(ctx) {
    	let progress;
    	let current;
    	progress = new Progress({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(progress.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progress, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progress, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(41:2) {#if state.state == \\\"empty\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div3;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let t1;
    	let div2;
    	let div2_resize_listener;
    	let current;
    	const if_block_creators = [create_if_block$c, create_if_block_1$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2].state == "empty") return 0;
    		if (/*state*/ ctx[2].state == "error") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			set_style(div0, "padding-right", "0");
    			attr_dev(div0, "class", div0_class_value = /*state*/ ctx[2].state == "success" ? "" : "invisible");
    			add_location(div0, file$j, 48, 4, 1552);
    			add_location(div1, file$j, 47, 2, 1542);
    			set_style(div2, "height", "0");
    			set_style(div2, "width", "100%");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[9].call(div2));
    			add_location(div2, file$j, 56, 2, 1798);
    			attr_dev(div3, "class", "VegaChart");
    			add_location(div3, file$j, 39, 0, 1343);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div3, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[8](div0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[9].bind(div2));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div3, t0);
    				} else {
    					if_block = null;
    				}
    			}

    			if (!current || dirty & /*state*/ 4 && div0_class_value !== (div0_class_value = /*state*/ ctx[2].state == "success" ? "" : "invisible")) {
    				attr_dev(div0, "class", div0_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			/*div0_binding*/ ctx[8](null);
    			div2_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart", slots, []);
    	
    	
    	let { chart } = $$props;
    	let { data } = $$props;
    	let { vega_options = undefined } = $$props;
    	let { is_narrow = false } = $$props;
    	let state = { state: "empty" };
    	const vega_view = new NonReactiveVariable(undefined); // Otherwise there going to be infinite loop
    	let container_el, client_width;
    	let suggested_width_px;

    	const suggested_width_px_debounced = (width => {
    		if (width != suggested_width_px) $$invalidate(7, suggested_width_px = width);
    	}).debounce(100, true);

    	onDestroy(() => {
    		if (vega_view.get()) destroy_vega(vega_view.get());
    	});

    	const writable_props = ["chart", "data", "vega_options", "is_narrow"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container_el = $$value;
    			$$invalidate(0, container_el);
    		});
    	}

    	function div2_elementresize_handler() {
    		client_width = this.clientWidth;
    		$$invalidate(1, client_width);
    	}

    	$$self.$$set = $$props => {
    		if ("chart" in $$props) $$invalidate(3, chart = $$props.chart);
    		if ("data" in $$props) $$invalidate(4, data = $$props.data);
    		if ("vega_options" in $$props) $$invalidate(5, vega_options = $$props.vega_options);
    		if ("is_narrow" in $$props) $$invalidate(6, is_narrow = $$props.is_narrow);
    	};

    	$$self.$capture_state = () => ({
    		ensure_error,
    		destroy_vega,
    		embed_vega,
    		onDestroy,
    		NonReactiveVariable,
    		Fail,
    		Progress,
    		chart,
    		data,
    		vega_options,
    		is_narrow,
    		state,
    		vega_view,
    		container_el,
    		client_width,
    		suggested_width_px,
    		suggested_width_px_debounced
    	});

    	$$self.$inject_state = $$props => {
    		if ("chart" in $$props) $$invalidate(3, chart = $$props.chart);
    		if ("data" in $$props) $$invalidate(4, data = $$props.data);
    		if ("vega_options" in $$props) $$invalidate(5, vega_options = $$props.vega_options);
    		if ("is_narrow" in $$props) $$invalidate(6, is_narrow = $$props.is_narrow);
    		if ("state" in $$props) $$invalidate(2, state = $$props.state);
    		if ("container_el" in $$props) $$invalidate(0, container_el = $$props.container_el);
    		if ("client_width" in $$props) $$invalidate(1, client_width = $$props.client_width);
    		if ("suggested_width_px" in $$props) $$invalidate(7, suggested_width_px = $$props.suggested_width_px);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*client_width*/ 2) {
    			suggested_width_px_debounced(client_width);
    		}

    		if ($$self.$$.dirty & /*suggested_width_px, container_el, chart, data, vega_options, is_narrow*/ 249) {
    			{
    				if (suggested_width_px != undefined && container_el != undefined) {
    					embed_vega({
    						chart,
    						data,
    						vega_options,
    						is_narrow,
    						suggested_width_px,
    						vega_view: vega_view.get(),
    						container_el
    					}).then(view => {
    						vega_view.set(view);
    						$$invalidate(2, state = { state: "success" });
    					}).catch(e => {
    						const error = ensure_error(e, "Unknown error while processing vega lite");
    						$$invalidate(2, state = { state: "error", error });
    					});
    				}
    			}
    		}
    	};

    	return [
    		container_el,
    		client_width,
    		state,
    		chart,
    		data,
    		vega_options,
    		is_narrow,
    		suggested_width_px,
    		div0_binding,
    		div2_elementresize_handler
    	];
    }

    class Chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, not_equal, {
    			chart: 3,
    			data: 4,
    			vega_options: 5,
    			is_narrow: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*chart*/ ctx[3] === undefined && !("chart" in props)) {
    			console.warn("<Chart> was created without expected prop 'chart'");
    		}

    		if (/*data*/ ctx[4] === undefined && !("data" in props)) {
    			console.warn("<Chart> was created without expected prop 'data'");
    		}
    	}

    	get chart() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chart(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vega_options() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vega_options(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_narrow() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_narrow(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/blocks/ChartBlockImpl/ChartBlockImpl.svelte generated by Svelte v3.38.2 */
    const file$i = "src/blocks/ChartBlockImpl/ChartBlockImpl.svelte";

    // (29:2) {:catch error}
    function create_catch_block$2(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: /*error*/ ctx[4] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fail_changes = {};
    			if (dirty & /*f*/ 2) fail_changes.error = /*error*/ ctx[4];
    			fail.$set(fail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(29:2) {:catch error}",
    		ctx
    	});

    	return block_1;
    }

    // (27:2) {:then data}
    function create_then_block$2(ctx) {
    	let chart;
    	let current;

    	chart = new Chart({
    			props: {
    				chart: /*f*/ ctx[1].chart,
    				data: /*data*/ ctx[3],
    				vega_options: /*f*/ ctx[1].vega_options,
    				is_narrow: /*is_narrow*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(chart.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chart, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chart_changes = {};
    			if (dirty & /*f*/ 2) chart_changes.chart = /*f*/ ctx[1].chart;
    			if (dirty & /*f*/ 2) chart_changes.data = /*data*/ ctx[3];
    			if (dirty & /*f*/ 2) chart_changes.vega_options = /*f*/ ctx[1].vega_options;
    			if (dirty & /*is_narrow*/ 1) chart_changes.is_narrow = /*is_narrow*/ ctx[0];
    			chart.$set(chart_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chart, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(27:2) {:then data}",
    		ctx
    	});

    	return block_1;
    }

    // (25:35)      <Progress/>   {:then data}
    function create_pending_block$2(ctx) {
    	let progress;
    	let current;
    	progress = new Progress({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			create_component(progress.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progress, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progress, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(25:35)      <Progress/>   {:then data}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let promise;
    	let t;
    	let brand;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 3,
    		error: 4,
    		blocks: [,,,]
    	};

    	handle_promise(promise = get_or_load_data(/*f*/ ctx[1].data), info);
    	brand = new Brand({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			t = space();
    			create_component(brand.$$.fragment);
    			attr_dev(div, "class", "ChartBlockContent relative");
    			add_location(div, file$i, 23, 0, 559);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = t;
    			append_dev(div, t);
    			mount_component(brand, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*f*/ 2 && promise !== (promise = get_or_load_data(/*f*/ ctx[1].data)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(brand.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(brand.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(brand);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    const definition$2 = {
    	match_and_normalize: data => {
    		if (is_object(data) && "data" in data && "chart" in data) return data;
    	}
    };

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChartBlockImpl", slots, []);
    	
    	
    	let { block } = $$props;
    	let { is_narrow } = $$props;
    	discard(is_narrow);
    	let f = block;
    	const writable_props = ["block", "is_narrow"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChartBlockImpl> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("block" in $$props) $$invalidate(2, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(0, is_narrow = $$props.is_narrow);
    	};

    	$$self.$capture_state = () => ({
    		definition: definition$2,
    		get_or_load_data,
    		Fail,
    		Progress,
    		Brand,
    		Chart,
    		block,
    		is_narrow,
    		f
    	});

    	$$self.$inject_state = $$props => {
    		if ("block" in $$props) $$invalidate(2, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(0, is_narrow = $$props.is_narrow);
    		if ("f" in $$props) $$invalidate(1, f = $$props.f);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*f, block*/ 6) {
    			{
    				if (f.hash != block.hash) $$invalidate(1, f = block); // To avoid updating chart if hash is the same
    			}
    		}
    	};

    	return [is_narrow, f, block];
    }

    class ChartBlockImpl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, not_equal, { block: 2, is_narrow: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartBlockImpl",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[2] === undefined && !("block" in props)) {
    			console.warn("<ChartBlockImpl> was created without expected prop 'block'");
    		}

    		if (/*is_narrow*/ ctx[0] === undefined && !("is_narrow" in props)) {
    			console.warn("<ChartBlockImpl> was created without expected prop 'is_narrow'");
    		}
    	}

    	get block() {
    		throw new Error("<ChartBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<ChartBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_narrow() {
    		throw new Error("<ChartBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_narrow(value) {
    		throw new Error("<ChartBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChartBlockImpl$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': ChartBlockImpl,
        definition: definition$2
    });

    function twAlign(align) {
        switch (align) {
            case "left": return "text-left";
            case "center": return "text-center";
            case "right": return "text-right";
        }
    }

    /* src/formats/StringFormat.svelte generated by Svelte v3.38.2 */
    const file$h = "src/formats/StringFormat.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (23:32) 
    function create_if_block_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*value*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 2) set_data_dev(t, /*value*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(23:32) ",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if values !== undefined}
    function create_if_block$b(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*values*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*values*/ 4) {
    				each_value = /*values*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$6, each_1_anchor, get_each_context$6);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(16:2) {#if values !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (19:6) {#if i < (values.length - 1)}
    function create_if_block_1$6(ctx) {
    	let br;

    	const block = {
    		c: function create() {
    			br = element("br");
    			add_location(br, file$h, 19, 8, 688);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(19:6) {#if i < (values.length - 1)}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each values as part, i (i)}
    function create_each_block$6(key_1, ctx) {
    	let t0_value = /*part*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[6] < /*values*/ ctx[2].length - 1 && create_if_block_1$6(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = t0;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*values*/ 4 && t0_value !== (t0_value = /*part*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (/*i*/ ctx[6] < /*values*/ ctx[2].length - 1) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(17:4) {#each values as part, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let div_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*values*/ ctx[2] !== undefined) return create_if_block$b;
    		if (/*value*/ ctx[1] !== undefined) return create_if_block_2$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "" + (/*klass*/ ctx[3] + " " + (/*options*/ ctx[0].wrap && "text-wrap")));
    			add_location(div, file$h, 14, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (dirty & /*options*/ 1 && div_class_value !== (div_class_value = "" + (/*klass*/ ctx[3] + " " + (/*options*/ ctx[0].wrap && "text-wrap")))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }


    const compatibleTypes$6 = ["number", "boolean", "string"];

    function align$3(options, _stats) {
    	return options.align || "left";
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let values;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StringFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props;
    	const klass = twAlign(options.align || "left") + (options.small ? " text-xs" : "");
    	const writable_props = ["options", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StringFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("value" in $$props) $$invalidate(1, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		compatibleTypes: compatibleTypes$6,
    		align: align$3,
    		twAlign,
    		options,
    		value,
    		klass,
    		values
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("value" in $$props) $$invalidate(1, value = $$props.value);
    		if ("values" in $$props) $$invalidate(2, values = $$props.values);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, options*/ 3) {
    			// $: svalue = value === undefined ? '' : value
    			$$invalidate(2, values = value !== undefined && options.break
    			? value.split(options.break)
    			: undefined);
    		}
    	};

    	return [options, value, values, klass];
    }

    class StringFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, not_equal, { options: 0, value: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StringFormat",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !("options" in props)) {
    			console.warn("<StringFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[1] === undefined && !("value" in props)) {
    			console.warn("<StringFormat> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<StringFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<StringFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<StringFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<StringFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var StringFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': StringFormat,
        compatibleTypes: compatibleTypes$6,
        align: align$3
    });

    /* src/formats/BooleanFormat.svelte generated by Svelte v3.38.2 */

    const file$g = "src/formats/BooleanFormat.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let t_1_value = (/*value*/ ctx[0] ? /*t*/ ctx[1] : /*f*/ ctx[2]) + "";
    	let t_1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t_1 = text(t_1_value);
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$g, 10, 0, 222);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1 && t_1_value !== (t_1_value = (/*value*/ ctx[0] ? /*t*/ ctx[1] : /*f*/ ctx[2]) + "")) set_data_dev(t_1, t_1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const compatibleTypes$5 = ["boolean"];

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BooleanFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props;
    	const t = options.true || "✓";
    	const f = options.false || "✗";
    	const writable_props = ["options", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BooleanFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(3, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ compatibleTypes: compatibleTypes$5, options, value, t, f });

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(3, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, t, f, options];
    }

    class BooleanFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, not_equal, { options: 3, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BooleanFormat",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[3] === undefined && !("options" in props)) {
    			console.warn("<BooleanFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<BooleanFormat> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<BooleanFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<BooleanFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<BooleanFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<BooleanFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var BooleanFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': BooleanFormat,
        compatibleTypes: compatibleTypes$5
    });

    /* src/formats/NumberFormat.svelte generated by Svelte v3.38.2 */
    const file$f = "src/formats/NumberFormat.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*formatted*/ ctx[0]);
    			attr_dev(div, "class", /*klass*/ ctx[1]);
    			add_location(div, file$f, 17, 0, 544);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formatted*/ 1) set_data_dev(t, /*formatted*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }


    const compatibleTypes$4 = ["number"];

    function align$2(options, _stats) {
    	return options.align || "right";
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let formatted;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NumberFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props;
    	const roundn = "round" in options ? options.round : 2;
    	const klass = twAlign(options.align || "right") + (options.small ? " text-xs" : "");
    	const writable_props = ["options", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NumberFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("value" in $$props) $$invalidate(3, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		compatibleTypes: compatibleTypes$4,
    		align: align$2,
    		twAlign,
    		options,
    		value,
    		roundn,
    		klass,
    		formatted
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("value" in $$props) $$invalidate(3, value = $$props.value);
    		if ("formatted" in $$props) $$invalidate(0, formatted = $$props.formatted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 8) {
    			$$invalidate(0, formatted = value === undefined
    			? ""
    			: "" + (roundn !== undefined ? value.round(roundn) : value));
    		}
    	};

    	return [formatted, klass, options, value];
    }

    class NumberFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, not_equal, { options: 2, value: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NumberFormat",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[2] === undefined && !("options" in props)) {
    			console.warn("<NumberFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[3] === undefined && !("value" in props)) {
    			console.warn("<NumberFormat> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<NumberFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<NumberFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<NumberFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<NumberFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var NumberFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': NumberFormat,
        compatibleTypes: compatibleTypes$4,
        align: align$2
    });

    const convertColumn$1 = (column_id, domain, column, options) => {
        const warnings = [], scale = options.scale || "linear";
        if (options.log_unit) {
            if (options.scale != "log") {
                warnings.push(`column ${column_id} 'line.log_unit' could be used with log scale only`);
            }
            // Rounding values in [0..1] range to 1, usefull for displaying quantities, like money,
            // to avoid negative log noise for small values like $0.2.
            // Multiply needed to normalize values, like distance specified in km, like 0.05km and you want
            // to multiply it by 1000 to get methers before applying log_unit
            const multiply = is_number(options.log_unit) ? options.log_unit : 1;
            function log_unit(v) {
                if (v < 0) {
                    // Leaving negative numbers as is, so the warning will be shown
                    return v;
                }
                else {
                    v = v * multiply;
                    return v < 1 ? 1 : v;
                }
            }
            column = column.map((v) => v === undefined ? undefined : log_unit(v));
            domain = [log_unit(domain[0]), log_unit(domain[1])];
        }
        // Scaling and normalizing
        let converted = [];
        let nticks, ndomain;
        if (scale == "log") { // Log
            // Checking domain
            if (domain[0] <= 0) {
                warnings.push(`column ${column_id}, 'line.domain' can't be negative for log scale`);
                return { column: column.map((_v) => undefined), warnings, stats: undefined };
            }
            // Taking log and normalizing by log_abs_max value
            let logAbsMax = Math.max(...domain.map((v) => Math.log(Math.abs(v))));
            converted = column.map((v) => {
                if (v === undefined)
                    return undefined;
                else if (v > 0)
                    return Math.log(v) / logAbsMax;
                else {
                    warnings.push(`column ${column_id}, values can't be negative for log scale`);
                    return undefined;
                }
            });
            // Normalizing ticks
            nticks = (options.ticks || []).filter_map((v) => {
                if (v > 0)
                    return Math.log(v) / logAbsMax;
                else {
                    warnings.push(`column ${column_id}, ticks can't be negative for log scale`);
                    return undefined;
                }
            });
            // Normalizing domain
            ndomain = [Math.log(domain[0]) / logAbsMax, Math.log(domain[1]) / logAbsMax];
        }
        else if (scale == "linear") { // linear
            // Normalizing by abs max
            let absMax = Math.max(...domain.map((v) => Math.abs(v)));
            if (absMax == 0)
                absMax = 1; // Avoiding dividing by 0
            converted = column.map((v) => v === undefined ? undefined : v / absMax);
            // Normalizing ticks and domain
            nticks = (options.ticks || []).map((v) => v / absMax);
            ndomain = [domain[0] / absMax, domain[1] / absMax];
        }
        else {
            throw new Error(`unknown scale ${scale}`);
        }
        return { column: converted, warnings, stats: { domain, ndomain, nticks } };
    };
    // // Detecting range
    // let range: Range
    // if (options.range)       range = options.range
    // else if (domain[1] <= 0) range = "L"
    // else if (domain[0] >= 0) range = "R"
    // else                     range = "LR"
    // // Checking values, domains and ticks are in range
    // let actualRange = range
    // {
    //   const isInRange = buildIsInRangeCheck(scale, range)
    //   if (!present.every(isInRange)) {
    //     actualRange = "LR"
    //     warnings.add(`column ${column_id}, some values are outside of the 'line.range'`)
    //   }
    //   const ticks = options.ticks || []
    //   if (!ticks.every(isInRange)) {
    //     actualRange = "LR"
    //     warnings.add(`column ${column_id}, 'line.ticks' are outside of the 'line.range'`)
    //   }
    //   if (!domain.every(isInRange)) {
    //     actualRange = "LR"
    //     warnings.add(`column ${column_id}, 'line.domain' is outside of the 'line.range'`)
    //   }
    // }
    // export function buildIsInRangeCheck(
    //   scale: "linear" | "log", range: Range
    // ): (v: number | undefined) => boolean {
    //   let identityPoint: number
    //   if      (scale == "linear") identityPoint = 0
    //   else if (scale == "log")    identityPoint = Math.E
    //   else                        throw new Error(`unknown scale ${scale}`)
    //   if      (range == "L")  return function (v) { return v === undefined ? true : v <= identityPoint }
    //   else if (range == "R")  return function (v) { return v === undefined ? true : v >= identityPoint }
    //   else if (range == "LR") return function (v) { return true }
    //   else                    throw new Error(`unknown range ${range}`)
    // }
    // Getting non null values
    // const present = filterMap(column, (v) => v === undefined ? false : v)
    // if (present.length == 0) return { column: column, warnings: [], stats: undefined }
    // Calculating and validating domain
    // let domain: [number, number]
    // {
    //   let min = present[0], max = present[0]
    //   for (const v of [...present, ...(options.ticks || [])]) {
    //     if (v > max) max = v
    //     if (v < min) min = v
    //   }
    //   if (options.domain) {
    //     domain = options.domain
    //     if (min < domain[0]) {
    //       warnings.add(`column ${column_id} 'line.domain' min value is greather than actual min ${min}`)
    //       domain = [min, max]
    //     }
    //     if (max > domain[1]) {
    //       warnings.add(`column ${column_id} 'line.domain' max value is smaller than actual max ${max}`)
    //       domain = [min, max]
    //     }
    //   } else {
    //     domain = [min, max]
    //   }
    // }

    var helpers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        convertColumn: convertColumn$1
    });

    /* src/formats/LineFormat.svelte generated by Svelte v3.38.2 */
    const file$e = "src/formats/LineFormat.svelte";

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (76:0) {:else}
    function create_else_block_3(ctx) {
    	let svg;
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[4]);
    			add_location(title_1, file$e, 77, 4, 2780);
    			attr_dev(svg, "class", "plot-line-format text-center");
    			add_location(svg, file$e, 76, 2, 2733);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, title_1);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 16) set_data_dev(t, /*title*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(76:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:0) {#if stats && converted != undefined}
    function create_if_block$a(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*max*/ ctx[3] <= 0) return create_if_block_1$5;
    		if (/*min*/ ctx[2] >= 0) return create_if_block_2$1;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(35:0) {#if stats && converted != undefined}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {:else}
    function create_else_block$3(ctx) {
    	let svg;
    	let title_1;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let line;
    	let each_value_2 = /*stats*/ ctx[1].nticks;
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*v*/ ctx[7];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	function select_block_type_3(ctx, dirty) {
    		if (/*converted*/ ctx[0] > 0) return create_if_block_3$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[4]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			line = svg_element("line");
    			if_block.c();
    			add_location(title_1, file$e, 58, 6, 2030);
    			attr_dev(line, "x1", "50%");
    			attr_dev(line, "y1", "5%");
    			attr_dev(line, "x2", "50%");
    			attr_dev(line, "y2", "95%");
    			attr_dev(line, "stroke", tickColor);
    			attr_dev(line, "stroke-width", "1");
    			add_location(line, file$e, 66, 6, 2383);
    			attr_dev(svg, "class", "plot-line-format text-center");
    			add_location(svg, file$e, 57, 4, 1981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, title_1);
    			append_dev(title_1, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, line);
    			if_block.m(svg, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 16) set_data_dev(t, /*title*/ ctx[4]);

    			if (dirty & /*stats, tickColor*/ 2) {
    				each_value_2 = /*stats*/ ctx[1].nticks;
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, svg, destroy_block, create_each_block_2, line, get_each_context_2);
    			}

    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(56:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:21) 
    function create_if_block_2$1(ctx) {
    	let svg;
    	let title_1;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let rect;
    	let rect_width_value;
    	let each_value_1 = /*stats*/ ctx[1].nticks;
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*v*/ ctx[7];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[4]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			rect = svg_element("rect");
    			add_location(title_1, file$e, 48, 6, 1680);
    			attr_dev(rect, "x", "0%");
    			attr_dev(rect, "y", "25%");
    			attr_dev(rect, "width", rect_width_value = "" + (/*converted*/ ctx[0] * 100 + "%"));
    			attr_dev(rect, "height", "50%");
    			attr_dev(rect, "fill", color);
    			add_location(rect, file$e, 52, 6, 1860);
    			attr_dev(svg, "class", "plot-line-format text-center");
    			add_location(svg, file$e, 47, 4, 1631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, title_1);
    			append_dev(title_1, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, rect);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 16) set_data_dev(t, /*title*/ ctx[4]);

    			if (dirty & /*stats, tickColor*/ 2) {
    				each_value_1 = /*stats*/ ctx[1].nticks;
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, svg, destroy_block, create_each_block_1, rect, get_each_context_1);
    			}

    			if (dirty & /*converted*/ 1 && rect_width_value !== (rect_width_value = "" + (/*converted*/ ctx[0] * 100 + "%"))) {
    				attr_dev(rect, "width", rect_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(46:21) ",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#if max <= 0}
    function create_if_block_1$5(ctx) {
    	let svg;
    	let title_1;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let rect;
    	let rect_x_value;
    	let rect_width_value;
    	let each_value = /*stats*/ ctx[1].nticks;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*v*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[4]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			rect = svg_element("rect");
    			add_location(title_1, file$e, 38, 6, 1280);
    			attr_dev(rect, "x", rect_x_value = "" + (100 - /*converted*/ ctx[0] * -100 + "%"));
    			attr_dev(rect, "y", "25%");
    			attr_dev(rect, "width", rect_width_value = "" + (/*converted*/ ctx[0] * -100 + "%"));
    			attr_dev(rect, "height", "50%");
    			attr_dev(rect, "fill", color);
    			add_location(rect, file$e, 42, 6, 1474);
    			attr_dev(svg, "class", "plot-line-format text-center");
    			add_location(svg, file$e, 37, 4, 1231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, title_1);
    			append_dev(title_1, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}

    			append_dev(svg, rect);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 16) set_data_dev(t, /*title*/ ctx[4]);

    			if (dirty & /*stats, tickColor*/ 2) {
    				each_value = /*stats*/ ctx[1].nticks;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svg, destroy_block, create_each_block$5, rect, get_each_context$5);
    			}

    			if (dirty & /*converted*/ 1 && rect_x_value !== (rect_x_value = "" + (100 - /*converted*/ ctx[0] * -100 + "%"))) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*converted*/ 1 && rect_width_value !== (rect_width_value = "" + (/*converted*/ ctx[0] * -100 + "%"))) {
    				attr_dev(rect, "width", rect_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(36:2) {#if max <= 0}",
    		ctx
    	});

    	return block;
    }

    // (63:8) {:else}
    function create_else_block_2(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = "" + (50 - /*v*/ ctx[7] * -50 + "%"));
    			attr_dev(line, "y1", "5%");
    			attr_dev(line, "x2", line_x__value_1 = "" + (50 - /*v*/ ctx[7] * -50 + "%"));
    			attr_dev(line, "y2", "25%");
    			attr_dev(line, "stroke", tickColor);
    			attr_dev(line, "stroke-width", "1");
    			add_location(line, file$e, 63, 10, 2246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stats*/ 2 && line_x__value !== (line_x__value = "" + (50 - /*v*/ ctx[7] * -50 + "%"))) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*stats*/ 2 && line_x__value_1 !== (line_x__value_1 = "" + (50 - /*v*/ ctx[7] * -50 + "%"))) {
    				attr_dev(line, "x2", line_x__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(63:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#if v > 0}
    function create_if_block_4(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = "" + (50 + /*v*/ ctx[7] * 50 + "%"));
    			attr_dev(line, "y1", "5%");
    			attr_dev(line, "x2", line_x__value_1 = "" + (50 + /*v*/ ctx[7] * 50 + "%"));
    			attr_dev(line, "y2", "25%");
    			attr_dev(line, "stroke", tickColor);
    			attr_dev(line, "stroke-width", "1");
    			add_location(line, file$e, 61, 10, 2119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stats*/ 2 && line_x__value !== (line_x__value = "" + (50 + /*v*/ ctx[7] * 50 + "%"))) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*stats*/ 2 && line_x__value_1 !== (line_x__value_1 = "" + (50 + /*v*/ ctx[7] * 50 + "%"))) {
    				attr_dev(line, "x2", line_x__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(61:8) {#if v > 0}",
    		ctx
    	});

    	return block;
    }

    // (60:6) {#each stats.nticks as v (v)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*v*/ ctx[7] > 0) return create_if_block_4;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(60:6) {#each stats.nticks as v (v)}",
    		ctx
    	});

    	return block;
    }

    // (70:6) {:else}
    function create_else_block_1$1(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_width_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", rect_x_value = "" + (50 - /*converted*/ ctx[0] * -50 + "%"));
    			attr_dev(rect, "y", "25%");
    			attr_dev(rect, "width", rect_width_value = "" + (/*converted*/ ctx[0] * -50 + "%"));
    			attr_dev(rect, "height", "50%");
    			attr_dev(rect, "fill", color);
    			add_location(rect, file$e, 70, 8, 2594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*converted*/ 1 && rect_x_value !== (rect_x_value = "" + (50 - /*converted*/ ctx[0] * -50 + "%"))) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*converted*/ 1 && rect_width_value !== (rect_width_value = "" + (/*converted*/ ctx[0] * -50 + "%"))) {
    				attr_dev(rect, "width", rect_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(70:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (68:6) {#if converted > 0}
    function create_if_block_3$1(ctx) {
    	let rect;
    	let rect_width_value;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "x", "50%");
    			attr_dev(rect, "y", "25%");
    			attr_dev(rect, "width", rect_width_value = "" + (/*converted*/ ctx[0] * 50 + "%"));
    			attr_dev(rect, "height", "50%");
    			attr_dev(rect, "fill", color);
    			add_location(rect, file$e, 68, 8, 2496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*converted*/ 1 && rect_width_value !== (rect_width_value = "" + (/*converted*/ ctx[0] * 50 + "%"))) {
    				attr_dev(rect, "width", rect_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(68:6) {#if converted > 0}",
    		ctx
    	});

    	return block;
    }

    // (50:6) {#each stats.nticks as v (v)}
    function create_each_block_1(key_1, ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = "" + (/*v*/ ctx[7] * 100 + "%"));
    			attr_dev(line, "y1", "5%");
    			attr_dev(line, "x2", line_x__value_1 = "" + (/*v*/ ctx[7] * 100 + "%"));
    			attr_dev(line, "y2", "25%");
    			attr_dev(line, "stroke", tickColor);
    			attr_dev(line, "stroke-width", "1");
    			add_location(line, file$e, 50, 8, 1747);
    			this.first = line;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*stats*/ 2 && line_x__value !== (line_x__value = "" + (/*v*/ ctx[7] * 100 + "%"))) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*stats*/ 2 && line_x__value_1 !== (line_x__value_1 = "" + (/*v*/ ctx[7] * 100 + "%"))) {
    				attr_dev(line, "x2", line_x__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(50:6) {#each stats.nticks as v (v)}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#each stats.nticks as v (v)}
    function create_each_block$5(key_1, ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = "" + (100 - /*v*/ ctx[7] * -100 + "%"));
    			attr_dev(line, "y1", "5%");
    			attr_dev(line, "x2", line_x__value_1 = "" + (100 - /*v*/ ctx[7] * -100 + "%"));
    			attr_dev(line, "y2", "25%");
    			attr_dev(line, "stroke", tickColor);
    			attr_dev(line, "stroke-width", "1");
    			add_location(line, file$e, 40, 8, 1347);
    			this.first = line;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*stats*/ 2 && line_x__value !== (line_x__value = "" + (100 - /*v*/ ctx[7] * -100 + "%"))) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*stats*/ 2 && line_x__value_1 !== (line_x__value_1 = "" + (100 - /*v*/ ctx[7] * -100 + "%"))) {
    				attr_dev(line, "x2", line_x__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(40:6) {#each stats.nticks as v (v)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*stats*/ ctx[1] && /*converted*/ ctx[0] != undefined) return create_if_block$a;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }


    const compatibleTypes$3 = ["number"];
    const extraValues = ({ ticks }) => ticks || [];

    function align$1(options, stats) {
    	if (options.align) {
    		return options.align;
    	} else if (stats) {
    		const [min, max] = stats.ndomain;
    		return max <= 0 ? "right" : min >= 0 ? "left" : "center";
    	} else {
    		return "center";
    	}
    }

    const convertColumn = convertColumn$1;
    const color = "#111827", tickColor = "#111827"; // "#6B7280"

    function instance$e($$self, $$props, $$invalidate) {
    	let min;
    	let max;
    	let title;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LineFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props; // original value
    	let { converted } = $$props; // value normalized by `convertColumn`
    	let { stats } = $$props;
    	const writable_props = ["options", "value", "converted", "stats"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LineFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(5, options = $$props.options);
    		if ("value" in $$props) $$invalidate(6, value = $$props.value);
    		if ("converted" in $$props) $$invalidate(0, converted = $$props.converted);
    		if ("stats" in $$props) $$invalidate(1, stats = $$props.stats);
    	};

    	$$self.$capture_state = () => ({
    		helpers,
    		compatibleTypes: compatibleTypes$3,
    		extraValues,
    		align: align$1,
    		convertColumn,
    		options,
    		value,
    		converted,
    		stats,
    		color,
    		tickColor,
    		min,
    		max,
    		title
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(5, options = $$props.options);
    		if ("value" in $$props) $$invalidate(6, value = $$props.value);
    		if ("converted" in $$props) $$invalidate(0, converted = $$props.converted);
    		if ("stats" in $$props) $$invalidate(1, stats = $$props.stats);
    		if ("min" in $$props) $$invalidate(2, min = $$props.min);
    		if ("max" in $$props) $$invalidate(3, max = $$props.max);
    		if ("title" in $$props) $$invalidate(4, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*stats*/ 2) {
    			$$invalidate(2, [min, max] = stats ? stats.ndomain : [0, 0], min, ($$invalidate(3, max), $$invalidate(1, stats)));
    		}

    		if ($$self.$$.dirty & /*converted, value, stats, options*/ 99) {
    			$$invalidate(4, title = [
    				converted !== undefined ? `value: ${value}` : "missing",
    				((stats === null || stats === void 0
    				? void 0
    				: stats.nticks) || []).length > 0
    				? `, ticks: [${(options.ticks || []).join(", ")}]`
    				: "",
    				stats
    				? `domain: [${stats.domain[0]}, ${stats.domain[1]}]`
    				: "",
    				`scale: ${options.scale || "linear"}`
    			].join(", "));
    		}
    	};

    	return [converted, stats, min, max, title, options, value];
    }

    class LineFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, not_equal, {
    			options: 5,
    			value: 6,
    			converted: 0,
    			stats: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineFormat",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[5] === undefined && !("options" in props)) {
    			console.warn("<LineFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[6] === undefined && !("value" in props)) {
    			console.warn("<LineFormat> was created without expected prop 'value'");
    		}

    		if (/*converted*/ ctx[0] === undefined && !("converted" in props)) {
    			console.warn("<LineFormat> was created without expected prop 'converted'");
    		}

    		if (/*stats*/ ctx[1] === undefined && !("stats" in props)) {
    			console.warn("<LineFormat> was created without expected prop 'stats'");
    		}
    	}

    	get options() {
    		throw new Error("<LineFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<LineFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<LineFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<LineFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get converted() {
    		throw new Error("<LineFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set converted(value) {
    		throw new Error("<LineFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stats() {
    		throw new Error("<LineFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stats(value) {
    		throw new Error("<LineFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var LineFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': LineFormat,
        compatibleTypes: compatibleTypes$3,
        extraValues: extraValues,
        align: align$1,
        convertColumn: convertColumn
    });

    /* src/formats/UnknownFormat.svelte generated by Svelte v3.38.2 */
    const file$d = "src/formats/UnknownFormat.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*formatted*/ ctx[0]);
    			attr_dev(div, "class", /*klass*/ ctx[1]);
    			add_location(div, file$d, 13, 0, 449);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formatted*/ 1) set_data_dev(t, /*formatted*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }


    const compatibleTypes$2 = []; // unknown is a special type

    function align(options, _stats) {
    	return options.align || "left";
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let formatted;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("UnknownFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props;
    	const klass = twAlign(options.align || "left") + (options.small ? " text-xs" : "");
    	const writable_props = ["options", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<UnknownFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("value" in $$props) $$invalidate(3, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		compatibleTypes: compatibleTypes$2,
    		align,
    		twAlign,
    		options,
    		value,
    		klass,
    		formatted
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("value" in $$props) $$invalidate(3, value = $$props.value);
    		if ("formatted" in $$props) $$invalidate(0, formatted = $$props.formatted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 8) {
    			$$invalidate(0, formatted = value === null || value === undefined ? "" : "" + value);
    		}
    	};

    	return [formatted, klass, options, value];
    }

    class UnknownFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, not_equal, { options: 2, value: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UnknownFormat",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[2] === undefined && !("options" in props)) {
    			console.warn("<UnknownFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[3] === undefined && !("value" in props)) {
    			console.warn("<UnknownFormat> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<UnknownFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<UnknownFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<UnknownFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<UnknownFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var UnknownFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': UnknownFormat,
        compatibleTypes: compatibleTypes$2,
        align: align
    });

    const code = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`;
    const x_circle = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const scale = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>`;
    const filter = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>`;
    const chevron_right = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
    const chevron_down = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
    const chevron_left = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
    const external_link = (klass) => `<svg class="${klass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>`;

    var icons = /*#__PURE__*/Object.freeze({
        __proto__: null,
        code: code,
        x_circle: x_circle,
        scale: scale,
        filter: filter,
        chevron_right: chevron_right,
        chevron_down: chevron_down,
        chevron_left: chevron_left,
        external_link: external_link
    });

    /* src/formats/LinkFormat.svelte generated by Svelte v3.38.2 */
    const file$c = "src/formats/LinkFormat.svelte";

    // (12:2) {#if value}
    function create_if_block$9(ctx) {
    	let a;
    	let raw_value = external_link("h-5 w-5 p-0.5 text-gray-900") + "";

    	const block = {
    		c: function create() {
    			a = element("a");
    			attr_dev(a, "class", "inline-block");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", /*value*/ ctx[0]);
    			add_location(a, file$c, 13, 4, 306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			a.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1) {
    				attr_dev(a, "href", /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(12:2) {#if value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let if_block = /*value*/ ctx[0] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "text-center");
    			add_location(div, file$c, 10, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*value*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const compatibleTypes$1 = ["string"];

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LinkFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props;
    	discard(options);
    	const writable_props = ["options", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LinkFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ compatibleTypes: compatibleTypes$1, icons, options, value });

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, options];
    }

    class LinkFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, not_equal, { options: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkFormat",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[1] === undefined && !("options" in props)) {
    			console.warn("<LinkFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<LinkFormat> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<LinkFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<LinkFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<LinkFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<LinkFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var LinkFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': LinkFormat,
        compatibleTypes: compatibleTypes$1
    });

    /* src/formats/ImageFormat.svelte generated by Svelte v3.38.2 */

    const file$b = "src/formats/ImageFormat.svelte";

    // (11:2) {#if value}
    function create_if_block$8(ctx) {
    	let img;
    	let img_class_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", img_class_value = "" + (/*tw_height*/ ctx[1][1] + " block"));
    			if (img.src !== (img_src_value = /*value*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			add_location(img, file$b, 12, 4, 357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tw_height*/ 2 && img_class_value !== (img_class_value = "" + (/*tw_height*/ ctx[1][1] + " block"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*value*/ 1 && img.src !== (img_src_value = /*value*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(11:2) {#if value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let div_class_value;
    	let if_block = /*value*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "" + (/*tw_height*/ ctx[1][0] + " flex justify-center p-0.5"));
    			add_location(div, file$b, 9, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*value*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*tw_height*/ 2 && div_class_value !== (div_class_value = "" + (/*tw_height*/ ctx[1][0] + " flex justify-center p-0.5"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const compatibleTypes = ["string"];

    function instance$b($$self, $$props, $$invalidate) {
    	let tw_height;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ImageFormat", slots, []);
    	
    	let { options } = $$props;
    	let { value } = $$props;
    	const writable_props = ["options", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ImageFormat> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		compatibleTypes,
    		options,
    		value,
    		tw_height
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(2, options = $$props.options);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("tw_height" in $$props) $$invalidate(1, tw_height = $$props.tw_height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options*/ 4) {
    			$$invalidate(1, tw_height = options.small
    			? ["h-12", "max-h-12"]
    			: ["h-32", "max-h-32"]);
    		}
    	};

    	return [value, tw_height, options];
    }

    class ImageFormat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, not_equal, { options: 2, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageFormat",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[2] === undefined && !("options" in props)) {
    			console.warn("<ImageFormat> was created without expected prop 'options'");
    		}

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<ImageFormat> was created without expected prop 'value'");
    		}
    	}

    	get options() {
    		throw new Error("<ImageFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<ImageFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ImageFormat>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ImageFormat>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ImageFormat$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': ImageFormat,
        compatibleTypes: compatibleTypes
    });

    const formats = {
        string: StringFormat$1,
        boolean: BooleanFormat$1,
        number: NumberFormat$1,
        unknown: UnknownFormat$1,
        line: LineFormat$1,
        link: LinkFormat$1,
        image: ImageFormat$1
    }; // Rollup fails to properly type Svelte components
    function getFormat(format) {
        return (format in formats) ? { is_error: false, value: formats[format] } : `no '${format}' format`.to_error();
    }
    // // Currency symbols, if symbol goes before or after, if space needed
    // const currenciesFormatters: Record<string, (v: number) => string> = {
    //   "USD": (v) => "$" + v,
    //   "EUR": (v) => "€" + v,
    //   "JPY": (v) => "¥" + v,
    //   "AUD": (v) => "A$" + v,
    //   "KRW": (v) => "₩" + v, // South Korean won
    //   "RUB": (v) => "" + v + "₽",
    //   "CNY": (v) => "¥" + v // China
    // }
    // export const currencyFormatter: Formatter<[number, string]> = {
    //   format: ([v, currency]) => {
    //     const formatter = currenciesFormatters[currency]
    //     return formatter ? formatter(v) : `${v} ${currency}`
    //   },
    //   parseFromEdit: parseNumber,
    //   formatForEdit: (v) => "" + v
    // }
    // Utils -------------------------------------------------------------------------------------------
    // function parseNumber(s: string): number {
    //   const vint = parseInt(s)
    //   const n = ("" + vint) == s ? vint : parseFloat(s)
    //   if (!isFinite(n)) throw new Error(`invalid number '${s}'`)
    //   return n
    // }

    // sortTable ---------------------------------------------------------------------------------------
    // Undefined threaded as first
    const comparators = {
        string: function (a, b) { return a.localeCompare(b); },
        number: function (a, b) { return a - b; },
        boolean: function (a, b) { return a == b ? 0 : (a ? 1 : -1); },
        unknown: function (a, b) { return ("" + a).localeCompare("" + b); }
    };
    function buildComparator(columns, [column, direction]) {
        const reverse = direction == "desc";
        const type = ensure(columns.find(({ id }) => id == column)).type;
        if (!(type in comparators))
            throw new Error(`no comparator for '${type}' type, please register one`);
        const comparator = comparators[type];
        if (reverse) {
            return function (rb, ra) {
                const a = ra[column], b = rb[column];
                if (a === undefined) {
                    if (b === undefined)
                        return 0;
                    else
                        return -1;
                }
                else if (b === undefined) {
                    return 1;
                }
                else {
                    return comparator(a, b);
                }
            };
        }
        else {
            return function (ra, rb) {
                const a = ra[column], b = rb[column];
                if (a === undefined) {
                    if (b === undefined)
                        return 0;
                    else
                        return -1;
                }
                else if (b === undefined) {
                    return 1;
                }
                else {
                    return comparator(a, b);
                }
            };
        }
    }
    function sortTable$1(columns, rows, order) {
        if (order.length > 3)
            throw new Error("sort not supported for more than 3 columns");
        const [a, b, c] = order;
        if (a == undefined)
            assert(b == undefined);
        if (b == undefined)
            assert(c == undefined);
        if (rows.length == 0 || a == undefined)
            return rows;
        let acomparator = buildComparator(columns, a);
        let bcomparator = b ? buildComparator(columns, b) : undefined;
        let ccomparator = c ? buildComparator(columns, c) : undefined;
        let comparator;
        if (ccomparator) {
            comparator = function (ra, rb) {
                let result = acomparator(ra, rb);
                if (result != 0)
                    return result;
                result = bcomparator(ra, rb);
                if (result != 0)
                    return result;
                return ccomparator(ra, rb);
            };
        }
        else if (bcomparator) {
            comparator = function (ra, rb) {
                let result = acomparator(ra, rb);
                if (result != 0)
                    return result;
                return bcomparator(ra, rb);
            };
        }
        else {
            comparator = acomparator;
        }
        const sorted = [...rows];
        sorted.sort(comparator);
        return sorted;
    }
    test("sortTable", () => {
        const columns = [{ id: "name", type: "string" }, { id: "age", type: "number" }];
        const rows = [
            { name: "Artanis", age: 200 },
            { name: "Sarah", age: 30 },
            { name: "Jim", age: 30 },
            { name: "Amon", age: undefined }
        ];
        let sort = (order) => sortTable$1(columns, rows, order).map(({ name }) => name);
        assert.equal(sort([["name", "asc"]]), ["Amon", "Artanis", "Jim", "Sarah"]);
        assert.equal(sort([["age", "asc"]])[0], "Amon"); // Undefined should go first
        assert.equal(sort([["age", "asc"], ["name", "asc"]]), ["Amon", "Jim", "Sarah", "Artanis"]);
    });
    // wsortTable --------------------------------------------------------------------------------------
    // Smart weighted, ranked sorting, instead of normal sorting.
    //
    // Applies only when multiple columns are sorted. It works similar to how humans normally compare products
    // with many attributes to find the best one.
    // Example: find countries with highest salaries, lowest taxes and lowest real estate prices - ordinary
    // sorting would be useless, while weighted sorting would sort the countries in a 'smart' way, similar
    // to how human would do.
    // Missing values threated as average, like if we don't have tax rate for country, we guess that it
    // probably should be somewhat average. For non number comparable elements sort rank used as weight.
    // ifferent range of values for different columns normalised into [-1..1] range as
    // `nw = (w - median(w)) / 0.9-quantile(variance(w))*1.11` and limiting min/max outliers by [-1..1].
    //
    // - Undefined values threated as average
    // - Rank for same values should be the same, like ["a", "a", "b"] should be [0, 0, 1], not [0, 1, 2]
    // - Different range of values for different columns normalised into [-1..1] range as
    //   nw = (w - median(w)) / 0.9-quantile(variance(w))*1.11 and limiting min/max outliers by [-1..1].
    //
    function wsortTable(columns, theRows, weights) {
        const rows = [...theRows];
        // Calculating weights
        for (const row of rows) {
            row._weights = {};
            row._nweights = {}; // keeping both original and normalised weights for easier debugging
        }
        for (const column_id in weights) {
            const { type, min_max } = ensure(columns.find(({ id }) => id == column_id));
            // Separating defined and undefined
            let [defined, undef] = rows.partition((row) => row[column_id] !== undefined);
            if (defined.length == 0) {
                for (const row of rows) {
                    row._weights[column_id] = 0;
                    row._nweights[column_id] = 0;
                }
                continue;
            }
            // Calculating weights
            if (type == "number") {
                // Weight for number is the number itself
                const actualType = typeof rows[0][column_id];
                if (actualType != "number") { // Check, just in case
                    throw new Error(`wrong type for '${column_id}' column, wsort expects number but found '${actualType}'`);
                }
                for (const row of defined)
                    row._weights[column_id] = row[column_id];
            }
            else {
                // Calculating weights for comparable values, as rank
                // Building comparator
                if (!(type in comparators))
                    throw new Error(`no comparator for '${type}' type, please register one`);
                const comparator = comparators[type];
                defined.sort((a, b) => comparator(a[column_id], b[column_id]));
                // Detecting same values, so ["a", "a", "b"] will be [0, 0, 1], not [0, 1, 2]
                let sameCount = 0, lastValue = undefined;
                for (let i = 0; i < defined.length; i++) {
                    const row = defined[i];
                    if (row[column_id] == lastValue) {
                        sameCount += 1;
                    }
                    else {
                        lastValue = row[column_id];
                    }
                    row._weights[column_id] = i - sameCount;
                }
            }
            {
                let min, max;
                if (min_max) {
                    if (type != "number")
                        throw new Error("can't use min_max for non number type");
                    min = min_max[0];
                    max = min_max[1];
                }
                else {
                    const values = defined.map((row) => row._weights[column_id]);
                    min = Math.min(...values);
                    max = Math.max(...values);
                }
                const avg = (max + min) / 2;
                let variance = (max - min) / 2;
                // p(column, avg, variance)
                assert(variance >= 0);
                variance = variance == 0 ? 1 : variance; // to avoid dividing by 0
                for (const row of defined) {
                    const w = row._weights[column_id];
                    let nw = (w - avg) / variance;
                    row._nweights[column_id] = nw;
                }
            }
            // Using median for missing values
            // p(column, defined.map((row) => row[column]))
            let missingNw = defined.map((row) => row._nweights[column_id]).median();
            for (const row of undef)
                row._nweights[column_id] = missingNw;
            // // Reversing
            // if (direction == "desc") {
            //   for (const row of rows) row._nweights[column] = -1 * row._nweights[column]
            // }
        }
        // Sorting
        for (const row of rows) {
            let w = 0;
            for (const column_id in weights)
                w += weights[column_id] * row._nweights[column_id];
            row._w = w;
        }
        rows.sort((a, b) => a._w - b._w).reverse();
        // p(rows)
        return rows;
    }
    test("wsortTable", () => {
        const wsort = (columns, rows, weights) => wsortTable(columns, rows, weights).map(({ id }) => id);
        {
            const columns = [{ id: "a", type: "number" }, { id: "b", type: "number" }];
            const rows = [
                { id: "a", a: 0, b: 3 },
                { id: "b", a: 1, b: 3 },
                { id: "c", a: 2, b: undefined },
                { id: "d", a: -2, b: 200 }
            ];
            assert.equal(wsort(columns, rows, { a: 1, b: -1 }), ["c", "b", "a", "d"]);
        }
        { // Unknown should be threated as median values
            const columns = [{ id: "a", type: "number" }];
            const rows = [
                { id: "a", a: 0 },
                { id: "b", a: 1 },
                { id: "c", a: undefined },
            ];
            assert.equal(wsort(columns, rows, { a: 1 }), ["b", "c", "a"]);
        }
        { // Same values should have same weights
            const columns = [{ id: "a", type: "string" }];
            const rows = [
                { id: "a", a: "a" },
                { id: "b", a: "a" },
                { id: "c", a: "b" },
            ];
            const sorted = wsortTable(columns, rows, { a: 1 });
            assert.equal(sorted[0].id, "c");
            assert.equal(sorted.map((row) => row._weights["a"]), [1, 0, 0]); // Weights for a and be should be same - 0
        }
        // {
        //   const columns = [{ id: "a", type: "number" }, { id: "b", type: "number" }]
        //   const rows    = [
        //     { id: "a", a: 0, b: 1 },
        //     { id: "b", a: 2, b: 0 },
        //     // { id: "c", a: 2, b: 0 },
        //   ]
        //   const sorted = wsortTable(columns, rows, [["a", "desc"], ["b", "desc"]])
        //   p(toJson(sorted))
        //   // assert.equal(sorted[2].id, "c")
        //   // assert.equal(sorted.map((row) => row._weights["a"]), [0, 0, 1]) // Weights for a and be should be same - 0
        // }
    });

    // parse_column_filters ----------------------------------------------------------------------------
    function parse_column_filters(columns, filters) {
        if (!filters)
            return;
        const parsed = {};
        for (const column of columns) {
            const raw = filters[column.id];
            if (!raw)
                continue;
            const v = parseColumnValue(column, '' + raw[1]);
            if (v === undefined)
                continue;
            parsed[column.id] = [parseColumnFilterCondition(raw[0]), v];
        }
        return parsed;
    }
    // parseColumnFilterCondition ----------------------------------------------------------------------
    const FilterCondition_ = ['<=', '<', '=', '!=', '>', '>=', '~'];
    function parseColumnFilterCondition(condition) {
        return FilterCondition_.includes(condition) ? condition : '=';
    }
    // parseColumnValue --------------------------------------------------------------------------------
    function parseColumnValue({ type }, value) {
        switch (type) {
            case 'string':
                return value;
            case 'boolean':
                try {
                    return ['true', 't', '1'].includes(value.downcase());
                }
                catch (_a) {
                    return undefined;
                }
            case 'number':
                try {
                    let v = parseFloat(value);
                    return Number.isFinite(v) ? v : undefined;
                }
                catch (_b) {
                    return undefined;
                }
            default:
                return value;
        }
    }
    // sortTable ---------------------------------------------------------------------------------------
    function sortTable(columns, rows, { sort, wsort }) {
        if (sort && !sort.is_empty())
            return sortTable$1(columns, rows, sort);
        else if (wsort && !Object.is_empty(wsort))
            return wsortTable(columns, rows, wsort);
        else
            return rows;
    }
    // Converting Array-Rows to TidyData
    function to_row_ext(columns, data, _messages_m) {
        let rows = [];
        // try {
        rows = to_tidy_data(data, columns === null || columns === void 0 ? void 0 : columns.map(({ id }) => id), true);
        // } catch (e) {
        //   messages_m.push('row size is larger than columns available')
        //   return []
        // }
        rows.each((row, i) => {
            row._i = i;
            row._converted = {};
        });
        return rows;
    }
    // extractColumnsIfNeededM -------------------------------------------------------------------------
    // If there's no columns, extracting columns from rows
    function extractColumnsIfNeededM(columns, rows, messages_m) {
        if (columns)
            return columns;
        const ids = new Map(), undefinedIds = new Set();
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            for (const id in row) {
                if (id == '_i' || id == '_converted')
                    continue;
                let v = row[id];
                if (is_undefined(v)) {
                    undefinedIds.add(id);
                }
                else {
                    let type = typeof v;
                    if (type == 'object') {
                        messages_m.push(`unknown type for column '${id}' - '${type}'`);
                        ids.set(id, 'unknown');
                    }
                    else {
                        if (ids.has(id)) {
                            if (ids.get(id) != type) {
                                messages_m.push(`unstable types for column '${id}', ${[ids.get(id), type].sort().join(', ')}`);
                                ids.set(id, 'unknown');
                            }
                        }
                        else {
                            ids.set(id, type);
                        }
                    }
                }
            }
        }
        for (const id of undefinedIds) {
            if (!ids.has(id))
                ids.set(id, 'unknown');
        }
        const list = Array.from(ids, ([id, type]) => ({ id, type }));
        return list.sort_by(({ id }) => id);
    }
    // validateColumnTypesM -------------------------------------------------------------------------
    function validateAndFixColumnTypesM(untyped_columns, rows, messages_m) {
        let columns = untyped_columns.map((c) => c.clone());
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            for (const column of columns) {
                const { id, type } = column;
                if (id == '_i')
                    continue;
                let v = row[id];
                if (v === undefined)
                    continue;
                const actualType = typeof v;
                if (actualType != type) {
                    if (type === undefined) {
                        column.type = get_column_type(v);
                    }
                    else if (type != 'unknown' && TableTypeValues.includes(type)) {
                        // allowing only unknown or custom type for objects
                        messages_m.push(`wrong type for column '${id}', specified as '${type}' but '${typeof v}' found`);
                        column.type = 'unknown';
                    }
                }
            }
        }
        return columns.map((c) => (Object.assign(Object.assign({}, c), { type: c.type || 'unknown' })));
    }
    const TableTypeValues = ['string', 'number', 'boolean', 'unknown'];
    function get_column_type(v) {
        switch (typeof v) {
            case 'boolean': return 'boolean';
            case 'number': return 'number';
            case 'string': return 'string';
            default: return 'unknown';
        }
    }
    // calculateAndCheckDomainM ------------------------------------------------------------------------
    function calculateAndCheckDomainM(columns, formats, rows, messages_m) {
        const domains = {};
        for (let i = 0; i < columns.length; i++) {
            const { id, type, domain: specified } = columns[i];
            const [formatter, foptions] = formats[i];
            if (type != 'number') {
                if (specified)
                    messages_m.push(`non number column '${id}' can't have domain`);
                continue;
            }
            // Formatter may have extra values affecting domain, like line ticks.
            const extraValues = (formatter.extraValues ? formatter.extraValues(foptions) : []).skip_undefined();
            const values = rows.filter_map((row) => {
                const v = row[id];
                return v;
            });
            values.push(...extraValues);
            if (values.length == 0) {
                if (specified)
                    domains[id] = specified;
                continue;
            }
            let min = values[0], max = values[0];
            for (const v of values) {
                if (v > max)
                    max = v;
                else if (v < min)
                    min = v;
            }
            const domain = specified || [min, max];
            if (min < domain[0]) {
                messages_m.push(`column ${id} 'domain' min value is greather than actual min ${min}`);
                domain[0] = min;
            }
            if (max > domain[1]) {
                messages_m.push(`column ${id} 'line.domain' max value is smaller than actual max ${max}`);
                domain[1] = max;
            }
            domains[id] = domain;
        }
        return domains;
    }
    // getColumnFormatsM -------------------------------------------------------------------------------
    function getColumnFormatsM(columns, messages_m) {
        // Getting formats
        const unknownFormat = getFormat('unknown');
        if (unknownFormat.is_error)
            throw "can't get 'unknown' formatter";
        let formats = [];
        for (const column of columns) {
            const foptions = column.format || { type: column.type };
            const fcomponent = getFormat(foptions.type);
            if (fcomponent.is_error) {
                messages_m.push(fcomponent.message);
                formats.push([unknownFormat.value, foptions]);
            }
            else if (!fcomponent.value.compatibleTypes.includes(column.type)) {
                messages_m.push(`column ${column.id} has wrong format,` +
                    ` format ${column.format} is not compatible with '${column.type}' type`);
                formats.push([unknownFormat.value, foptions]);
            }
            else {
                formats.push([fcomponent.value, foptions]);
            }
        }
        return formats;
    }
    // applyFormatConvertersM --------------------------------------------------------------------------
    function applyFormatConvertersM(columns, domains, formats, rowsM, messages_m) {
        // Converting to custom format values if needed
        const formatStats = {};
        for (let i = 0; i < columns.length; i++) {
            const [{ id }, [formatter, formatterOptions]] = [columns[i], formats[i]];
            if (formatter.convertColumn) {
                const columnValues = rowsM.map((row) => row[id]);
                const domain = domains[id];
                if (domain) { // Domain could be empty if all values are nulls
                    const { column: converted, warnings, stats } = formatter
                        .convertColumn(id, domain, columnValues, formatterOptions);
                    formatStats[id] = stats;
                    warnings.forEach((msg) => messages_m.push(msg));
                    for (let i = 0; i < rowsM.length; i++) {
                        rowsM[i]._converted[id] = converted[i];
                    }
                }
            }
        }
        return formatStats;
    }
    // autoDetectIntegerFormatM --------------------------------------------------------------------------
    // Auto-detecting integer for number columns, to avoid default 2 round and displaying integers as '1.00'
    function autoDetectIntegerFormatM(columns, rows, formats, messages_m) {
        return formats.map((format, i) => {
            const { id, type } = columns[i], [formatter, foptions] = format;
            if (foptions.type == 'number' && foptions.round === undefined) {
                if (type == 'number') {
                    const allIntegers = rows.every((row) => {
                        const v = row[id];
                        return v === undefined || Number.isInteger(v);
                    });
                    if (allIntegers)
                        return [formatter, Object.assign(Object.assign({}, foptions), { round: 0 })];
                }
                else {
                    messages_m.push(`column ${id} is non number and can't use number formatter`);
                }
            }
            return format;
        });
    }
    // normalizeInputsSlow -----------------------------------------------------------------------------
    // Validates and normalises input, _i - if row indices should be shown
    // - If columns not provided, it will be extracted from the rows
    // - If rows are Arrays instead of TidyData, it will be converted to TidyData
    // - Nulls and undefined allowed
    function normalize_table_options_slow(options, data) {
        const messages = [];
        // Converting rows to Tidy Data format
        const rows = to_row_ext(options.columns, data);
        // Empty table
        if (rows.length == 0) {
            messages.push(`table is empty`);
            return { columns: [], rows: [], messages: normalize_messages(messages) };
        }
        // Extracting columns if columns not provided
        let untyped_columns = extractColumnsIfNeededM(options.columns, rows, messages);
        // Altering columns if needed
        if (options.alter_columns) {
            const alteredIds = options.alter_columns.map(({ id }) => id);
            untyped_columns = [...options.alter_columns, ...untyped_columns.filter(({ id }) => !alteredIds.includes(id))];
        }
        // Column ids should be unique
        const nonUniqueColumnsLength = untyped_columns.length;
        if (untyped_columns.length != nonUniqueColumnsLength)
            messages.push(`not unique column ids`);
        // Ensuring column types are correct
        let columns = validateAndFixColumnTypesM(untyped_columns, rows, messages);
        // Getting column formats
        let formats = getColumnFormatsM(columns, messages);
        // Calculating or validating domain
        const domains = calculateAndCheckDomainM(columns, formats, rows, messages);
        // Adding _id column
        // if (_i) columns.unshift({ id: '_i', type: 'number' })
        // If all numbers are inters using integer format
        formats = autoDetectIntegerFormatM(columns, rows, formats, messages);
        const widthsAsPercentage = calculateColumnWidths(columns, rows);
        // Applying format converters and calculating stats
        const formatStats = applyFormatConvertersM(columns, domains, formats, rows, messages);
        const columnsExt = columns.map((c, i) => ({
            id: c.id,
            type: c.type,
            title: c.title,
            desc: c.desc,
            delimiter: c.delimiter,
            format: formats[i][1],
            formatStats: formatStats[c.id],
            formatter: formats[i][0],
            widthP: widthsAsPercentage[i],
            domain: domains[c.id]
        }));
        return { columns: columnsExt, rows, messages: normalize_messages(messages) };
    }
    test('normalize_table_options_slow', () => {
        const idtype = (columns) => columns.map(({ id, type }) => ({ id, type }));
        { // convert array to tidy data and extract columns, replace nulls
            const { columns, rows } = normalize_table_options_slow({}, [['v', null]]);
            assert.equal(idtype(columns), [{ id: 'a', type: 'string' }, { id: 'b', type: 'unknown' }]);
            assert.equal(toTidyRows(rows), [{ a: 'v' }]);
        }
        { // accept tidy data, extract columns, replace nulls
            const { columns, rows } = normalize_table_options_slow({}, [{ k: 'v', k2: null }]);
            assert.equal(idtype(columns), [{ id: 'k', type: 'string' }, { id: 'k2', type: 'unknown' }]);
            assert.equal(toTidyRows(rows), [{ k: 'v' }]);
        }
        { // unstable types
            const { columns, rows } = normalize_table_options_slow({}, [{ k: 'v' }, { k: 0 }]);
            assert.equal(idtype(columns), [{ id: 'k', type: 'unknown' }]);
            assert.equal(toTidyRows(rows), [{ k: 'v' }, { k: 0 }]);
        }
        { // detect integer format
            const { columns } = normalize_table_options_slow({}, [{ v: 1 }]);
            assert.equal(columns[0].format, { type: 'number', round: 0 });
        }
    });
    // calculateColumnWidths ---------------------------------------------------------------------------
    // HTML Table can't calculate column widths properly, using heuristics and examining data to guess column widths.
    // Returns % for each column.
    function calculateColumnWidths(columns, rows) {
        let weights;
        if (columns.some(({ width }) => width != undefined)) { // If at least one width specified, using it
            weights = columns.map(({ width }) => width || 1);
        }
        else { // Examining rows to guess widths
            const lengths = new Hash();
            for (const row of rows) { // Calculating median length for each column
                for (const { id, type } of columns) {
                    let l, v = row[id];
                    if (v === undefined)
                        continue;
                    else if (type == 'string')
                        l = row[id].length;
                    else if (type == 'number')
                        l = ('' + row[id]).length;
                    else if (type == 'boolean')
                        l = 1;
                    else
                        continue;
                    let list = lengths.get(id);
                    if (is_undefined(list)) {
                        list = [];
                        lengths.set(id, list);
                    }
                    list.push(l);
                }
            }
            const avgs = lengths.map((list) => list.quantile(.7));
            const avgsAvg = avgs.values().median();
            // Sorting weights into 3 buckets
            const edge = 1.618;
            const guessed = avgs.map((avg) => (avg > avgsAvg * edge) ? edge : ((avg < avgsAvg / edge) ? 1 / edge : 1));
            // Using avg for columns of unknown type
            const unknownLength = 1; // median(values(guessed))
            weights = columns.map(({ id }) => guessed.get(id) || unknownLength);
        }
        // Converting weights to percentages
        return weightsToPercents(weights);
    }
    test('calculateColumnWidths', () => {
        const columns = [{ id: 'name', type: 'string' }, { id: 'age', type: 'number' }];
        assert.equal(calculateColumnWidths(columns, [{ name: 'Jim Raynor', age: 30 }, { name: 'Kate', age: 25 }]), [62, 38]);
    });
    // weightsToPercents -------------------------------------------------------------------------------
    // HTML Table can't calculate column widths properly, using `table-layout: fixed` and calculating column widths
    // in percentages. Returns column widths in %.
    function weightsToPercents(weights) {
        if (weights.length == 0)
            return [];
        const weightInPercents = 100 / weights.sum();
        let percents = weights.map((w) => (w * weightInPercents).round());
        // Rounding to 100% exactly
        while (true) {
            const tp = percents.sum();
            if (tp > 100)
                percents[percents.max_index()] -= 1;
            else if (tp < 100)
                percents[percents.min_index()] += 1;
            else
                break;
        }
        return percents;
    }
    test('weightsToPercents', () => {
        assert.equal(weightsToPercents([2, 2]), [50, 50]);
        assert.equal(weightsToPercents([3, 3, 3]).sort(), [33, 33, 34]);
    });
    // filterRows -------------------------------------------------------------------------------------
    // Filtering for `term` or `column=term`
    function filterRows(columns, rows, state) {
        rows = filterByFilter(columns, rows, state.filter);
        rows = filterByColumnFilters(columns, rows, state.filters);
        return rows;
    }
    // filterByFilter ----------------------------------------------------------------------------------
    function filterByFilter(columns, rows, filter) {
        filter = filter.trim();
        if (!filter)
            return rows;
        // const re = /^([^=\s]+)=(.+)$/i
        // if (re.test(filter)) {
        //   const [column, term] = parse2(re, filter)
        //   const lcterm = term.downcase()
        //   // Filtering `column=term`
        //   return rows.filter((row) => {
        //     return ('' + row[column]).downcase().includes(lcterm)
        //   })
        // } else {
        const lcterm = filter.downcase();
        // Filtering `term`
        return rows.filter((row) => {
            for (const { id } of columns) {
                if (('' + row[id]).downcase().includes(lcterm))
                    return true;
            }
            return false;
        });
        // }
    }
    // filterByColumnFilters ---------------------------------------------------------------------------
    function buildFilterFunction(type, [condition, rawValue]) {
        switch (type) {
            case 'string':
                if (typeof rawValue != 'string')
                    throw new Error('string filter value expected');
                const svalue = rawValue, svaluelc = rawValue.downcase();
                switch (condition) {
                    case '<=': return (v) => v === undefined ? false : v <= svalue;
                    case '<': return (v) => v === undefined ? false : v < svalue;
                    case '=': return (v) => v === undefined ? false : v == svalue;
                    case '!=': return (v) => v === undefined ? false : v != svalue;
                    case '>': return (v) => v === undefined ? false : v > svalue;
                    case '>=': return (v) => v === undefined ? false : v >= svalue;
                    case '~': return (v) => v === undefined ? false : v.downcase().includes(svaluelc);
                }
            case 'boolean':
                if (typeof rawValue != 'boolean')
                    throw new Error('boolean filter value expected');
                const bvalue = rawValue;
                switch (condition) {
                    case '<=': return (v) => v === undefined ? false : v <= bvalue;
                    case '<': return (v) => v === undefined ? false : v < bvalue;
                    case '=': return (v) => v === undefined ? false : v == bvalue;
                    case '!=': return (v) => v === undefined ? false : v != bvalue;
                    case '>': return (v) => v === undefined ? false : v > bvalue;
                    case '>=': return (v) => v === undefined ? false : v >= bvalue;
                    case '~': return (v) => v === undefined ? false : v == bvalue;
                }
            case 'number':
                if (typeof rawValue != 'number')
                    throw new Error('number filter value expected');
                const nvalue = rawValue;
                switch (condition) {
                    case '<=': return (v) => v === undefined ? false : v <= nvalue;
                    case '<': return (v) => v === undefined ? false : v < nvalue;
                    case '=': return (v) => v === undefined ? false : v == nvalue;
                    case '!=': return (v) => v === undefined ? false : v != nvalue;
                    case '>': return (v) => v === undefined ? false : v > nvalue;
                    case '>=': return (v) => v === undefined ? false : v >= nvalue;
                    case '~': return (v) => v === undefined ? false : v == nvalue;
                }
            default:
                const uvalue = '' + rawValue;
                switch (condition) {
                    case '<=': return (v) => v === undefined ? false : ('' + v) <= uvalue;
                    case '<': return (v) => v === undefined ? false : ('' + v) < uvalue;
                    case '=': return (v) => v === undefined ? false : ('' + v) == uvalue;
                    case '!=': return (v) => v === undefined ? false : ('' + v) != uvalue;
                    case '>': return (v) => v === undefined ? false : ('' + v) > uvalue;
                    case '>=': return (v) => v === undefined ? false : ('' + v) >= uvalue;
                    case '~': return (v) => v === undefined ? false : ('' + v) == uvalue;
                }
        }
        throw new Error(`unknown filter ${type} ${condition}`);
    }
    function filterByColumnFilters(columns, rows, filters) {
        if (!filters)
            return rows;
        for (const { id, type } of columns) {
            const filter = filters[id];
            if (!filter)
                continue;
            const [condition, value] = filter;
            if (value === undefined || value === '')
                continue;
            const filterFn = buildFilterFunction(type, [condition, value]);
            rows = rows.filter((row) => filterFn(row[id]));
        }
        return rows;
    }
    // selectRows --------------------------------------------------------------------------------------
    function selectRows(e, i, selected, update) {
        // if (options?.selectable == false) return
        const updated = new Set(selected);
        if (e.metaKey) {
            // Adding or removing to set of selected rows
            if (updated.has(i))
                updated.delete(i);
            else
                updated.add(i);
        }
        else {
            // Selecting/deselecting single row, or switching from set of selected rows to single row
            const containsOnlyClicked = updated.has(i) && updated.size == 1;
            updated.clear();
            if (!containsOnlyClicked)
                updated.add(i);
        }
        update(updated);
    }
    function toTidyRows(rows) {
        return rows.map((row) => {
            let trow = Object.assign({}, row);
            delete trow._i;
            delete trow._converted;
            return trow;
        });
    }
    // parseOrderOption ---------------------------------------------------------------------------------
    function csv_table_to_table_block_data(csv) {
        // Extracting column types, getting type first non null value
        const types = [];
        for (const id of csv.columns) {
            let type = 'unknown';
            for (const row of csv.rows) {
                const v = row[id];
                if (v !== undefined && v !== null) {
                    type = typeof v; // Don't validating type, because `columns` will be validated later anyway
                    break;
                }
            }
            types.push(type);
        }
        const columns = csv.columns.map((id, i) => ({ id, type: types[i] }));
        return { data: csv.rows, table: { columns } };
    }
    // parseOrderOption ---------------------------------------------------------------------------------
    // export function parseOrderOption(order: ColumnOrder | ColumnOrder[] | undefined): ColumnOrder[] {
    //   if (!order) return []
    //   if (!Array.isArray(order)) return [order]
    //   if (order.length > 3) throw new Error(`sort can't use more than 3 columns`)
    //   return order
    // }
    // test('sortTableBy', () => {
    //   assert.equal(sortBy([{ v: true }, { v: false }], ({v}) => v), [{ v: false }, { v: true }])
    //   assert.equal(
    //     sortBy([{ v: 'b' }, { v: '' }, { v: 'c' }], ({v}) => v, { allowMissing: true }),
    //     [{ v: '' }, { v: 'b' }, { v: 'c'}]
    //   )
    // })
    // // const rows: RowExt[] = []
    // for (let i = 0; i < rawRows.length; i++) {
    //   const rawRow = rawRows[i]
    //   if (Array.isArray(rawRow)) {
    //     const row: RowExt = { _i: i, _converted: {} }
    //     if (columns) {
    //       for (let i = 0; i < rawRow.length; i++) {
    //         if (i < columns.length) row[columns[i].id] = rawRow[i]
    //         else messages_m.push('row size is larger than columns available')
    //       }
    //     } else {
    //       for (let i = 0; i < rawRow.length; i++) {
    //         if (i < abcLetters.length) row[abcLetters[i]] = rawRow[i]
    //         else messages_m.push('row size is larger than columns available')
    //       }
    //     }
    //     rows.push(row)
    //   } else {
    //     rows.push({ ...rawRow, _i: i, _converted: {} })
    //   }
    // }
    // // Replacing nulls with undefined
    // for (let i = 0; i < rows.length; i++) {
    //   const row = rows[i]
    //   for (const id in row) {
    //     if (row[id] === null) row[id] = undefined
    //   }
    // }

    /* src/table/ColumnWeight.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1$4 } = globals;
    const file$a = "src/table/ColumnWeight.svelte";

    // (23:0) {#if !hidden}
    function create_if_block$7(ctx) {
    	let div;
    	let span1;
    	let span0;
    	let t1;
    	let input;
    	let input_value_value;
    	let span1_class_value;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span1 = element("span");
    			span0 = element("span");
    			span0.textContent = "w =";
    			t1 = space();
    			input = element("input");
    			attr_dev(span0, "class", "w-5 inline-block");
    			add_location(span0, file$a, 25, 6, 890);
    			attr_dev(input, "class", "w-10 outline-none pl-1 text-xs border border-gray-200 focus:text-gray-900  svelte-1an48ji");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "step", "0.1");
    			input.value = input_value_value = /*weight*/ ctx[1].toFixed(1);
    			add_location(input, file$a, 26, 6, 938);

    			attr_dev(span1, "class", span1_class_value = /*isUsed*/ ctx[2]
    			? "text-gray-900"
    			: "plot-table-controls-color");

    			add_location(span1, file$a, 24, 4, 814);
    			attr_dev(div, "class", div_class_value = "" + (/*align*/ ctx[0] + " my-1 text-xs " + (!/*visible*/ ctx[3] && "invisible")));
    			add_location(div, file$a, 23, 2, 749);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span1);
    			append_dev(span1, span0);
    			append_dev(span1, t1);
    			append_dev(span1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*onChange*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*weight*/ 2 && input_value_value !== (input_value_value = /*weight*/ ctx[1].toFixed(1))) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*isUsed*/ 4 && span1_class_value !== (span1_class_value = /*isUsed*/ ctx[2]
    			? "text-gray-900"
    			: "plot-table-controls-color")) {
    				attr_dev(span1, "class", span1_class_value);
    			}

    			if (dirty & /*align, visible*/ 9 && div_class_value !== (div_class_value = "" + (/*align*/ ctx[0] + " my-1 text-xs " + (!/*visible*/ ctx[3] && "invisible")))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(23:0) {#if !hidden}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let if_block = !/*hidden*/ ctx[4] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*hidden*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let weight;
    	let isUsed;
    	let visible;
    	let hidden;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColumnWeight", slots, []);
    	
    	
    	let { column } = $$props;
    	let { align } = $$props;
    	let { state } = $$props;

    	const setWeightDebounced = (weight => {
    		if (state.wsort) $$invalidate(6, state = Object.assign(Object.assign({}, state), {
    			wsort: Object.assign(Object.assign({}, state.wsort), { [column.id]: weight })
    		}));
    	}).debounce(200);

    	// Bind can't be used because value needs to be formatted as "1.0"
    	const onChange = ({ target: { value } }) => {
    		$$invalidate(1, weight = parseFloat(value));
    		setWeightDebounced(weight);
    	};

    	const writable_props = ["column", "align", "state"];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColumnWeight> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("column" in $$props) $$invalidate(7, column = $$props.column);
    		if ("align" in $$props) $$invalidate(0, align = $$props.align);
    		if ("state" in $$props) $$invalidate(6, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		column,
    		align,
    		state,
    		setWeightDebounced,
    		onChange,
    		weight,
    		isUsed,
    		visible,
    		hidden
    	});

    	$$self.$inject_state = $$props => {
    		if ("column" in $$props) $$invalidate(7, column = $$props.column);
    		if ("align" in $$props) $$invalidate(0, align = $$props.align);
    		if ("state" in $$props) $$invalidate(6, state = $$props.state);
    		if ("weight" in $$props) $$invalidate(1, weight = $$props.weight);
    		if ("isUsed" in $$props) $$invalidate(2, isUsed = $$props.isUsed);
    		if ("visible" in $$props) $$invalidate(3, visible = $$props.visible);
    		if ("hidden" in $$props) $$invalidate(4, hidden = $$props.hidden);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*state, column*/ 192) {
    			$$invalidate(1, weight = (state.wsort || {})[column.id] || 0);
    		}

    		if ($$self.$$.dirty & /*weight*/ 2) {
    			$$invalidate(2, isUsed = weight != 0);
    		}

    		if ($$self.$$.dirty & /*state, isUsed*/ 68) {
    			$$invalidate(3, visible = state.show_controls || isUsed);
    		}

    		if ($$self.$$.dirty & /*state, column*/ 192) {
    			// Hidding for image and link
    			$$invalidate(4, hidden = !state.wsort || ["image", "link"].includes(column.format.type));
    		}
    	};

    	return [align, weight, isUsed, visible, hidden, onChange, state, column];
    }

    class ColumnWeight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, not_equal, { column: 7, align: 0, state: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColumnWeight",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*column*/ ctx[7] === undefined && !("column" in props)) {
    			console.warn("<ColumnWeight> was created without expected prop 'column'");
    		}

    		if (/*align*/ ctx[0] === undefined && !("align" in props)) {
    			console.warn("<ColumnWeight> was created without expected prop 'align'");
    		}

    		if (/*state*/ ctx[6] === undefined && !("state" in props)) {
    			console.warn("<ColumnWeight> was created without expected prop 'state'");
    		}
    	}

    	get column() {
    		throw new Error("<ColumnWeight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set column(value) {
    		throw new Error("<ColumnWeight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<ColumnWeight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<ColumnWeight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<ColumnWeight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<ColumnWeight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/table/ColumnFilter.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1$3 } = globals;
    const file$9 = "src/table/ColumnFilter.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (31:0) {#if state.filters && !hidden}
    function create_if_block$6(ctx) {
    	let div;
    	let span;
    	let select;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let select_value_value;
    	let t;
    	let input;
    	let input_value_value;
    	let span_class_value;
    	let div_class_value;
    	let mounted;
    	let dispose;
    	let each_value = FilterCondition_;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*c*/ ctx[10];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			input = element("input");
    			attr_dev(select, "class", "outline-none w-5 inline-block svelte-sedpkf");
    			add_location(select, file$9, 34, 6, 1303);
    			attr_dev(input, "class", "w-10 outline-none pl-1 text-xs border border-gray-200 focus:text-gray-900");
    			attr_dev(input, "type", "text");

    			input.value = input_value_value = /*filter*/ ctx[2][1] === undefined
    			? ""
    			: "" + /*filter*/ ctx[2][1];

    			add_location(input, file$9, 43, 6, 1550);

    			attr_dev(span, "class", span_class_value = /*isUsed*/ ctx[3]
    			? "text-gray-900"
    			: "plot-table-controls-color");

    			add_location(span, file$9, 32, 4, 1181);
    			attr_dev(div, "class", div_class_value = "" + (/*align*/ ctx[1] + " my-1 text-xs " + (!/*visible*/ ctx[4] && "invisible")));
    			add_location(div, file$9, 31, 2, 1116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*filter*/ ctx[2][0]);
    			append_dev(span, t);
    			append_dev(span, input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*onConditionChange*/ ctx[6], false, false, false),
    					listen_dev(input, "keyup", /*onValueChange*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*FilterCondition_*/ 0) {
    				each_value = FilterCondition_;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block$4, null, get_each_context$4);
    			}

    			if (dirty & /*filter, FilterCondition_*/ 4 && select_value_value !== (select_value_value = /*filter*/ ctx[2][0])) {
    				select_option(select, /*filter*/ ctx[2][0]);
    			}

    			if (dirty & /*filter, FilterCondition_*/ 4 && input_value_value !== (input_value_value = /*filter*/ ctx[2][1] === undefined
    			? ""
    			: "" + /*filter*/ ctx[2][1]) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*isUsed*/ 8 && span_class_value !== (span_class_value = /*isUsed*/ ctx[3]
    			? "text-gray-900"
    			: "plot-table-controls-color")) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*align, visible*/ 18 && div_class_value !== (div_class_value = "" + (/*align*/ ctx[1] + " my-1 text-xs " + (!/*visible*/ ctx[4] && "invisible")))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(31:0) {#if state.filters && !hidden}",
    		ctx
    	});

    	return block;
    }

    // (40:8) {#each FilterCondition_ as c (c)}
    function create_each_block$4(key_1, ctx) {
    	let option;
    	let t_value = /*c*/ ctx[10] + "";
    	let t;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*c*/ ctx[10];
    			option.value = option.__value;
    			add_location(option, file$9, 40, 10, 1481);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(40:8) {#each FilterCondition_ as c (c)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let if_block = /*state*/ ctx[0].filters && !/*hidden*/ ctx[5] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*state*/ ctx[0].filters && !/*hidden*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let isUsed;
    	let visible;
    	let hidden;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ColumnFilter", slots, []);
    	
    	
    	let { column } = $$props;
    	let { align } = $$props;
    	let { state } = $$props;
    	let filter;

    	const setFilterDebounced = (filter => {
    		if (state.filters) $$invalidate(0, state = Object.assign(Object.assign({}, state), {
    			filters: Object.assign(Object.assign({}, state.filters), { [column.id]: filter })
    		}));
    	}).debounce(200);

    	const onConditionChange = ({ target: { value } }) => {
    		$$invalidate(2, filter = [parseColumnFilterCondition(value), filter[1]]);
    		setFilterDebounced(filter);
    	};

    	const onValueChange = ({ target: { value } }) => {
    		$$invalidate(2, filter = [filter[0], parseColumnValue(column, value)]);
    		setFilterDebounced(filter);
    	};

    	const writable_props = ["column", "align", "state"];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ColumnFilter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("column" in $$props) $$invalidate(8, column = $$props.column);
    		if ("align" in $$props) $$invalidate(1, align = $$props.align);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		parseColumnFilterCondition,
    		parseColumnValue,
    		FilterCondition_,
    		column,
    		align,
    		state,
    		filter,
    		setFilterDebounced,
    		onConditionChange,
    		onValueChange,
    		isUsed,
    		visible,
    		hidden
    	});

    	$$self.$inject_state = $$props => {
    		if ("column" in $$props) $$invalidate(8, column = $$props.column);
    		if ("align" in $$props) $$invalidate(1, align = $$props.align);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("filter" in $$props) $$invalidate(2, filter = $$props.filter);
    		if ("isUsed" in $$props) $$invalidate(3, isUsed = $$props.isUsed);
    		if ("visible" in $$props) $$invalidate(4, visible = $$props.visible);
    		if ("hidden" in $$props) $$invalidate(5, hidden = $$props.hidden);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*state, column*/ 257) {
    			$$invalidate(2, filter = state.filters && column.id in state.filters
    			? state.filters[column.id]
    			: ["=", undefined]);
    		}

    		if ($$self.$$.dirty & /*filter*/ 4) {
    			$$invalidate(3, isUsed = filter[1] != undefined && filter[1] !== "");
    		}

    		if ($$self.$$.dirty & /*isUsed, state*/ 9) {
    			$$invalidate(4, visible = isUsed || state.show_controls);
    		}

    		if ($$self.$$.dirty & /*state, column*/ 257) {
    			// Hidding for image and link
    			$$invalidate(5, hidden = state.wsort && ["image", "link"].includes(column.format.type));
    		}
    	};

    	return [
    		state,
    		align,
    		filter,
    		isUsed,
    		visible,
    		hidden,
    		onConditionChange,
    		onValueChange,
    		column
    	];
    }

    class ColumnFilter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, not_equal, { column: 8, align: 1, state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColumnFilter",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*column*/ ctx[8] === undefined && !("column" in props)) {
    			console.warn("<ColumnFilter> was created without expected prop 'column'");
    		}

    		if (/*align*/ ctx[1] === undefined && !("align" in props)) {
    			console.warn("<ColumnFilter> was created without expected prop 'align'");
    		}

    		if (/*state*/ ctx[0] === undefined && !("state" in props)) {
    			console.warn("<ColumnFilter> was created without expected prop 'state'");
    		}
    	}

    	get column() {
    		throw new Error("<ColumnFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set column(value) {
    		throw new Error("<ColumnFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<ColumnFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<ColumnFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<ColumnFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<ColumnFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/table/HeaderColumn.svelte generated by Svelte v3.38.2 */

    const { Error: Error_1, Object: Object_1$2 } = globals;
    const file$8 = "src/table/HeaderColumn.svelte";

    // (136:0) {:else}
    function create_else_block$2(ctx) {
    	let th;
    	let a;
    	let span0;
    	let t0_value = /*csymbol*/ ctx[3].symbol + "";
    	let t0;
    	let span0_class_value;
    	let t1;
    	let span1;
    	let t2;
    	let a_title_value;
    	let t3;
    	let columnweight;
    	let updating_state;
    	let t4;
    	let columnfilter;
    	let updating_state_1;
    	let th_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function columnweight_state_binding_2(value) {
    		/*columnweight_state_binding_2*/ ctx[12](value);
    	}

    	let columnweight_props = {
    		column: /*column*/ ctx[1],
    		align: "text-right"
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		columnweight_props.state = /*state*/ ctx[0];
    	}

    	columnweight = new ColumnWeight({
    			props: columnweight_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(columnweight, "state", columnweight_state_binding_2));

    	function columnfilter_state_binding_2(value) {
    		/*columnfilter_state_binding_2*/ ctx[13](value);
    	}

    	let columnfilter_props = {
    		column: /*column*/ ctx[1],
    		align: "text-right"
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		columnfilter_props.state = /*state*/ ctx[0];
    	}

    	columnfilter = new ColumnFilter({
    			props: columnfilter_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(columnfilter, "state", columnfilter_state_binding_2));

    	const block = {
    		c: function create() {
    			th = element("th");
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*title*/ ctx[2]);
    			t3 = space();
    			create_component(columnweight.$$.fragment);
    			t4 = space();
    			create_component(columnfilter.$$.fragment);
    			attr_dev(span0, "class", span0_class_value = "" + (/*csymbol*/ ctx[3].klass + " mr-0.5"));
    			add_location(span0, file$8, 138, 6, 5418);
    			add_location(span1, file$8, 139, 6, 5485);
    			attr_dev(a, "class", "flex justify-between");
    			attr_dev(a, "href", "#");
    			attr_dev(a, "title", a_title_value = /*column*/ ctx[1].desc);
    			add_location(a, file$8, 137, 4, 5314);
    			attr_dev(th, "class", th_class_value = "text-right " + /*css_class*/ ctx[4]);
    			set_style(th, "width", /*column*/ ctx[1].widthP + "%");
    			add_location(th, file$8, 136, 2, 5242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, a);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(a, t1);
    			append_dev(a, span1);
    			append_dev(span1, t2);
    			append_dev(th, t3);
    			mount_component(columnweight, th, null);
    			append_dev(th, t4);
    			mount_component(columnfilter, th, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(/*onclick*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*csymbol*/ 8) && t0_value !== (t0_value = /*csymbol*/ ctx[3].symbol + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*csymbol*/ 8 && span0_class_value !== (span0_class_value = "" + (/*csymbol*/ ctx[3].klass + " mr-0.5"))) {
    				attr_dev(span0, "class", span0_class_value);
    			}

    			if (!current || dirty & /*title*/ 4) set_data_dev(t2, /*title*/ ctx[2]);

    			if (!current || dirty & /*column*/ 2 && a_title_value !== (a_title_value = /*column*/ ctx[1].desc)) {
    				attr_dev(a, "title", a_title_value);
    			}

    			const columnweight_changes = {};
    			if (dirty & /*column*/ 2) columnweight_changes.column = /*column*/ ctx[1];

    			if (!updating_state && dirty & /*state*/ 1) {
    				updating_state = true;
    				columnweight_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			columnweight.$set(columnweight_changes);
    			const columnfilter_changes = {};
    			if (dirty & /*column*/ 2) columnfilter_changes.column = /*column*/ ctx[1];

    			if (!updating_state_1 && dirty & /*state*/ 1) {
    				updating_state_1 = true;
    				columnfilter_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state_1 = false);
    			}

    			columnfilter.$set(columnfilter_changes);

    			if (!current || dirty & /*css_class*/ 16 && th_class_value !== (th_class_value = "text-right " + /*css_class*/ ctx[4])) {
    				attr_dev(th, "class", th_class_value);
    			}

    			if (!current || dirty & /*column*/ 2) {
    				set_style(th, "width", /*column*/ ctx[1].widthP + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(columnweight.$$.fragment, local);
    			transition_in(columnfilter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(columnweight.$$.fragment, local);
    			transition_out(columnfilter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_component(columnweight);
    			destroy_component(columnfilter);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(136:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (126:28) 
    function create_if_block_1$4(ctx) {
    	let th;
    	let a;
    	let span0;
    	let t0_value = /*csymbol*/ ctx[3].symbol + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let span2;
    	let t4_value = /*csymbol*/ ctx[3].symbol + "";
    	let t4;
    	let span2_class_value;
    	let span2_title_value;
    	let a_title_value;
    	let t5;
    	let columnweight;
    	let updating_state;
    	let t6;
    	let columnfilter;
    	let updating_state_1;
    	let current;
    	let mounted;
    	let dispose;

    	function columnweight_state_binding_1(value) {
    		/*columnweight_state_binding_1*/ ctx[10](value);
    	}

    	let columnweight_props = {
    		column: /*column*/ ctx[1],
    		align: "text-center"
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		columnweight_props.state = /*state*/ ctx[0];
    	}

    	columnweight = new ColumnWeight({
    			props: columnweight_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(columnweight, "state", columnweight_state_binding_1));

    	function columnfilter_state_binding_1(value) {
    		/*columnfilter_state_binding_1*/ ctx[11](value);
    	}

    	let columnfilter_props = {
    		column: /*column*/ ctx[1],
    		align: "text-center"
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		columnfilter_props.state = /*state*/ ctx[0];
    	}

    	columnfilter = new ColumnFilter({
    			props: columnfilter_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(columnfilter, "state", columnfilter_state_binding_1));

    	const block = {
    		c: function create() {
    			th = element("th");
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*title*/ ctx[2]);
    			t3 = space();
    			span2 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			create_component(columnweight.$$.fragment);
    			t6 = space();
    			create_component(columnfilter.$$.fragment);
    			attr_dev(span0, "class", "invisible mr-0.5");
    			add_location(span0, file$8, 128, 6, 4908);
    			add_location(span1, file$8, 129, 6, 4969);
    			attr_dev(span2, "class", span2_class_value = "" + (/*csymbol*/ ctx[3].klass + " ml-0.5"));
    			attr_dev(span2, "title", span2_title_value = /*csymbol*/ ctx[3].title);
    			add_location(span2, file$8, 130, 6, 4996);
    			attr_dev(a, "class", "flex justify-between");
    			attr_dev(a, "href", "#");
    			attr_dev(a, "title", a_title_value = /*column*/ ctx[1].desc);
    			add_location(a, file$8, 127, 4, 4804);
    			attr_dev(th, "class", /*css_class*/ ctx[4]);
    			set_style(th, "width", /*column*/ ctx[1].widthP + "%");
    			add_location(th, file$8, 126, 2, 4745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, a);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(a, t1);
    			append_dev(a, span1);
    			append_dev(span1, t2);
    			append_dev(a, t3);
    			append_dev(a, span2);
    			append_dev(span2, t4);
    			append_dev(th, t5);
    			mount_component(columnweight, th, null);
    			append_dev(th, t6);
    			mount_component(columnfilter, th, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(/*onclick*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*csymbol*/ 8) && t0_value !== (t0_value = /*csymbol*/ ctx[3].symbol + "")) set_data_dev(t0, t0_value);
    			if (!current || dirty & /*title*/ 4) set_data_dev(t2, /*title*/ ctx[2]);
    			if ((!current || dirty & /*csymbol*/ 8) && t4_value !== (t4_value = /*csymbol*/ ctx[3].symbol + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*csymbol*/ 8 && span2_class_value !== (span2_class_value = "" + (/*csymbol*/ ctx[3].klass + " ml-0.5"))) {
    				attr_dev(span2, "class", span2_class_value);
    			}

    			if (!current || dirty & /*csymbol*/ 8 && span2_title_value !== (span2_title_value = /*csymbol*/ ctx[3].title)) {
    				attr_dev(span2, "title", span2_title_value);
    			}

    			if (!current || dirty & /*column*/ 2 && a_title_value !== (a_title_value = /*column*/ ctx[1].desc)) {
    				attr_dev(a, "title", a_title_value);
    			}

    			const columnweight_changes = {};
    			if (dirty & /*column*/ 2) columnweight_changes.column = /*column*/ ctx[1];

    			if (!updating_state && dirty & /*state*/ 1) {
    				updating_state = true;
    				columnweight_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			columnweight.$set(columnweight_changes);
    			const columnfilter_changes = {};
    			if (dirty & /*column*/ 2) columnfilter_changes.column = /*column*/ ctx[1];

    			if (!updating_state_1 && dirty & /*state*/ 1) {
    				updating_state_1 = true;
    				columnfilter_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state_1 = false);
    			}

    			columnfilter.$set(columnfilter_changes);

    			if (!current || dirty & /*css_class*/ 16) {
    				attr_dev(th, "class", /*css_class*/ ctx[4]);
    			}

    			if (!current || dirty & /*column*/ 2) {
    				set_style(th, "width", /*column*/ ctx[1].widthP + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(columnweight.$$.fragment, local);
    			transition_in(columnfilter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(columnweight.$$.fragment, local);
    			transition_out(columnfilter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_component(columnweight);
    			destroy_component(columnfilter);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(126:28) ",
    		ctx
    	});

    	return block;
    }

    // (117:0) {#if align == "left"}
    function create_if_block$5(ctx) {
    	let th;
    	let a;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2_value = /*csymbol*/ ctx[3].symbol + "";
    	let t2;
    	let span1_class_value;
    	let span1_title_value;
    	let a_title_value;
    	let t3;
    	let columnweight;
    	let updating_state;
    	let t4;
    	let columnfilter;
    	let updating_state_1;
    	let current;
    	let mounted;
    	let dispose;

    	function columnweight_state_binding(value) {
    		/*columnweight_state_binding*/ ctx[8](value);
    	}

    	let columnweight_props = {
    		column: /*column*/ ctx[1],
    		align: "text-left"
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		columnweight_props.state = /*state*/ ctx[0];
    	}

    	columnweight = new ColumnWeight({
    			props: columnweight_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(columnweight, "state", columnweight_state_binding));

    	function columnfilter_state_binding(value) {
    		/*columnfilter_state_binding*/ ctx[9](value);
    	}

    	let columnfilter_props = {
    		column: /*column*/ ctx[1],
    		align: "text-left"
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		columnfilter_props.state = /*state*/ ctx[0];
    	}

    	columnfilter = new ColumnFilter({
    			props: columnfilter_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(columnfilter, "state", columnfilter_state_binding));

    	const block = {
    		c: function create() {
    			th = element("th");
    			a = element("a");
    			span0 = element("span");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(columnweight.$$.fragment);
    			t4 = space();
    			create_component(columnfilter.$$.fragment);
    			add_location(span0, file$8, 119, 6, 4455);
    			attr_dev(span1, "class", span1_class_value = "" + (/*csymbol*/ ctx[3].klass + " ml-0.5"));
    			attr_dev(span1, "title", span1_title_value = /*csymbol*/ ctx[3].title);
    			add_location(span1, file$8, 120, 6, 4482);
    			attr_dev(a, "class", "flex justify-between");
    			attr_dev(a, "href", "#");
    			attr_dev(a, "title", a_title_value = /*column*/ ctx[1].desc);
    			add_location(a, file$8, 118, 4, 4351);
    			attr_dev(th, "class", /*css_class*/ ctx[4]);
    			set_style(th, "width", /*column*/ ctx[1].widthP + "%");
    			add_location(th, file$8, 117, 2, 4292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, a);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(a, t1);
    			append_dev(a, span1);
    			append_dev(span1, t2);
    			append_dev(th, t3);
    			mount_component(columnweight, th, null);
    			append_dev(th, t4);
    			mount_component(columnfilter, th, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(/*onclick*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);
    			if ((!current || dirty & /*csymbol*/ 8) && t2_value !== (t2_value = /*csymbol*/ ctx[3].symbol + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*csymbol*/ 8 && span1_class_value !== (span1_class_value = "" + (/*csymbol*/ ctx[3].klass + " ml-0.5"))) {
    				attr_dev(span1, "class", span1_class_value);
    			}

    			if (!current || dirty & /*csymbol*/ 8 && span1_title_value !== (span1_title_value = /*csymbol*/ ctx[3].title)) {
    				attr_dev(span1, "title", span1_title_value);
    			}

    			if (!current || dirty & /*column*/ 2 && a_title_value !== (a_title_value = /*column*/ ctx[1].desc)) {
    				attr_dev(a, "title", a_title_value);
    			}

    			const columnweight_changes = {};
    			if (dirty & /*column*/ 2) columnweight_changes.column = /*column*/ ctx[1];

    			if (!updating_state && dirty & /*state*/ 1) {
    				updating_state = true;
    				columnweight_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			columnweight.$set(columnweight_changes);
    			const columnfilter_changes = {};
    			if (dirty & /*column*/ 2) columnfilter_changes.column = /*column*/ ctx[1];

    			if (!updating_state_1 && dirty & /*state*/ 1) {
    				updating_state_1 = true;
    				columnfilter_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state_1 = false);
    			}

    			columnfilter.$set(columnfilter_changes);

    			if (!current || dirty & /*css_class*/ 16) {
    				attr_dev(th, "class", /*css_class*/ ctx[4]);
    			}

    			if (!current || dirty & /*column*/ 2) {
    				set_style(th, "width", /*column*/ ctx[1].widthP + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(columnweight.$$.fragment, local);
    			transition_in(columnfilter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(columnweight.$$.fragment, local);
    			transition_out(columnfilter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_component(columnweight);
    			destroy_component(columnfilter);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(117:0) {#if align == \\\"left\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*align*/ ctx[5] == "left") return 0;
    		if (/*align*/ ctx[5] == "center") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let title;
    	let csymbol;
    	let css_class;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderColumn", slots, []);
    	
    	
    	
    	let { column } = $$props;
    	let { state } = $$props;
    	let { sortable } = $$props;
    	let column_id = column.id;
    	const align_fn = column.formatter.align;

    	const align = align_fn
    	? align_fn(column.format, column.formatStats)
    	: "center";

    	function getColumnSymbol(column, state) {
    		const hidden = {
    			symbol: "↓",
    			klass: "invisible",
    			title: ""
    		}; // To avoid table jumping when it's sorted

    		if (state.wsort) {
    			const weight = state.wsort[column.id];
    			const title = "wsort: " + Object.entries(state.wsort).map(([column, weight]) => `${column}: ${weight}`).join(", ");

    			if (weight === undefined || weight == 0) return hidden; else if (weight >= 0) return {
    				symbol: "↑",
    				klass: "text-gray-900",
    				title
    			}; else return {
    				symbol: "↓",
    				klass: "text-gray-900",
    				title
    			};
    		} else if (state.sort) {
    			let corder = undefined;

    			for (let i = 0; i < state.sort.length; i++) {
    				const [column, direction] = state.sort[i];
    				if (column == column_id) corder = [direction, i];
    			}

    			if (!corder) return hidden;
    			const title = "sort: " + state.sort.map(([column, direction]) => `${column}: ${direction}`).join(", ");
    			const [direction, i] = corder;
    			const symbol = direction == "asc" ? "↓" : "↑";
    			let klass;
    			if (i == 0) klass = "text-gray-900"; else if (i == 1) klass = "text-gray-400"; else if (i == 2) klass = "text-gray-300"; else throw new Error("color for more than 3 sort oders isn't supported");
    			return { symbol, klass, title };
    		} else {
    			return hidden;
    		}
    	}

    	function onclick(e) {
    		if (!sortable) return;

    		if (state.wsort) {
    			let wsort = state.wsort;

    			if (e.metaKey) {
    				if (column.id in wsort) {
    					// Switching direction for this column
    					wsort[column.id] = -1 * wsort[column.id];
    				} else {
    					// Adding this column to existing sorting order
    					wsort[column.id] = 1;
    				}
    			} else {
    				if (Object.size(wsort) > 1) {
    					// If multiple columns, clearing and setting this column as new sorting order
    					wsort = { [column_id]: 1 };
    				} else {
    					if (column.id in wsort) {
    						// Switching direction for this column
    						wsort[column.id] = -1 * wsort[column.id];
    					} else {
    						// Adding this column as the last one to existing sorting order
    						wsort = { [column_id]: 1 };
    					}
    				}
    			}

    			$$invalidate(0, state = Object.assign(Object.assign({}, state), { wsort }));
    		} else {
    			let sort = state.sort || [];
    			const i = sort.index(([column_id, _direction]) => column_id == column.id);

    			if (e.metaKey) {
    				if (!is_undefined(i)) {
    					// Switching direction for this column
    					sort[i][1] = sort[i][1] == "asc" ? "desc" : "asc";
    				} else {
    					// Adding this column as the last one to existing sorting order
    					sort.push([column_id, "asc"]);
    				}
    			} else {
    				if (sort.length > 1) {
    					// If multiple columns, clearing and setting this column as new sorting order
    					sort = [[column_id, "asc"]];
    				} else {
    					if (!is_undefined(i)) {
    						// Switching direction for this column
    						assert(sort.length == 1);

    						sort[i][1] = sort[i][1] == "asc" ? "desc" : "asc";
    					} else {
    						// Adding this column as the last one to existing sorting order
    						sort = [[column_id, "asc"]];
    					}
    				}
    			}

    			$$invalidate(0, state = Object.assign(Object.assign({}, state), { sort }));
    		}
    	}

    	const writable_props = ["column", "state", "sortable"];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HeaderColumn> was created with unknown prop '${key}'`);
    	});

    	function columnweight_state_binding(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	function columnfilter_state_binding(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	function columnweight_state_binding_1(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	function columnfilter_state_binding_1(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	function columnweight_state_binding_2(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	function columnfilter_state_binding_2(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	$$self.$$set = $$props => {
    		if ("column" in $$props) $$invalidate(1, column = $$props.column);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("sortable" in $$props) $$invalidate(7, sortable = $$props.sortable);
    	};

    	$$self.$capture_state = () => ({
    		ColumnWeight,
    		ColumnFilter,
    		column,
    		state,
    		sortable,
    		column_id,
    		align_fn,
    		align,
    		getColumnSymbol,
    		onclick,
    		title,
    		csymbol,
    		css_class
    	});

    	$$self.$inject_state = $$props => {
    		if ("column" in $$props) $$invalidate(1, column = $$props.column);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("sortable" in $$props) $$invalidate(7, sortable = $$props.sortable);
    		if ("column_id" in $$props) column_id = $$props.column_id;
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    		if ("csymbol" in $$props) $$invalidate(3, csymbol = $$props.csymbol);
    		if ("css_class" in $$props) $$invalidate(4, css_class = $$props.css_class);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*column*/ 2) {
    			$$invalidate(2, title = column.title == undefined ? column.id : column.title);
    		}

    		if ($$self.$$.dirty & /*column, state*/ 3) {
    			$$invalidate(3, csymbol = getColumnSymbol(column, state));
    		}

    		if ($$self.$$.dirty & /*column*/ 2) {
    			$$invalidate(4, css_class = column.delimiter ? "plot-delimiter-right" : "");
    		}
    	};

    	return [
    		state,
    		column,
    		title,
    		csymbol,
    		css_class,
    		align,
    		onclick,
    		sortable,
    		columnweight_state_binding,
    		columnfilter_state_binding,
    		columnweight_state_binding_1,
    		columnfilter_state_binding_1,
    		columnweight_state_binding_2,
    		columnfilter_state_binding_2
    	];
    }

    class HeaderColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, not_equal, { column: 1, state: 0, sortable: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderColumn",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*column*/ ctx[1] === undefined && !("column" in props)) {
    			console.warn("<HeaderColumn> was created without expected prop 'column'");
    		}

    		if (/*state*/ ctx[0] === undefined && !("state" in props)) {
    			console.warn("<HeaderColumn> was created without expected prop 'state'");
    		}

    		if (/*sortable*/ ctx[7] === undefined && !("sortable" in props)) {
    			console.warn("<HeaderColumn> was created without expected prop 'sortable'");
    		}
    	}

    	get column() {
    		throw new Error_1("<HeaderColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set column(value) {
    		throw new Error_1("<HeaderColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error_1("<HeaderColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error_1("<HeaderColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortable() {
    		throw new Error_1("<HeaderColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error_1("<HeaderColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/table/Header.svelte generated by Svelte v3.38.2 */
    const file$7 = "src/table/Header.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (10:2) {#each columns as column (column.id)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let headercolumn;
    	let updating_state;
    	let current;

    	function headercolumn_state_binding(value) {
    		/*headercolumn_state_binding*/ ctx[3](value);
    	}

    	let headercolumn_props = {
    		column: /*column*/ ctx[4],
    		sortable: /*sortable*/ ctx[2]
    	};

    	if (/*state*/ ctx[0] !== void 0) {
    		headercolumn_props.state = /*state*/ ctx[0];
    	}

    	headercolumn = new HeaderColumn({
    			props: headercolumn_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(headercolumn, "state", headercolumn_state_binding));

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(headercolumn.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(headercolumn, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const headercolumn_changes = {};
    			if (dirty & /*columns*/ 2) headercolumn_changes.column = /*column*/ ctx[4];
    			if (dirty & /*sortable*/ 4) headercolumn_changes.sortable = /*sortable*/ ctx[2];

    			if (!updating_state && dirty & /*state*/ 1) {
    				updating_state = true;
    				headercolumn_changes.state = /*state*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			headercolumn.$set(headercolumn_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headercolumn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headercolumn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(headercolumn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(10:2) {#each columns as column (column.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let tr;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*columns*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*column*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$7, 8, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*columns, sortable, state*/ 7) {
    				each_value = /*columns*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tr, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	
    	
    	let { columns } = $$props;
    	let { state } = $$props;
    	let { sortable } = $$props;
    	const writable_props = ["columns", "state", "sortable"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function headercolumn_state_binding(value) {
    		state = value;
    		$$invalidate(0, state);
    	}

    	$$self.$$set = $$props => {
    		if ("columns" in $$props) $$invalidate(1, columns = $$props.columns);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("sortable" in $$props) $$invalidate(2, sortable = $$props.sortable);
    	};

    	$$self.$capture_state = () => ({ HeaderColumn, columns, state, sortable });

    	$$self.$inject_state = $$props => {
    		if ("columns" in $$props) $$invalidate(1, columns = $$props.columns);
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("sortable" in $$props) $$invalidate(2, sortable = $$props.sortable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, columns, sortable, headercolumn_state_binding];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, not_equal, { columns: 1, state: 0, sortable: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*columns*/ ctx[1] === undefined && !("columns" in props)) {
    			console.warn("<Header> was created without expected prop 'columns'");
    		}

    		if (/*state*/ ctx[0] === undefined && !("state" in props)) {
    			console.warn("<Header> was created without expected prop 'state'");
    		}

    		if (/*sortable*/ ctx[2] === undefined && !("sortable" in props)) {
    			console.warn("<Header> was created without expected prop 'sortable'");
    		}
    	}

    	get columns() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortable() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/table/Row.svelte generated by Svelte v3.38.2 */

    const file$6 = "src/table/Row.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (19:6) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*column*/ ctx[4].formatter.default;

    	function switch_props(ctx) {
    		return {
    			props: {
    				options: /*column*/ ctx[4].format,
    				value: /*row*/ ctx[1][/*column*/ ctx[4].id]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*columns*/ 1) switch_instance_changes.options = /*column*/ ctx[4].format;
    			if (dirty & /*row, columns*/ 3) switch_instance_changes.value = /*row*/ ctx[1][/*column*/ ctx[4].id];

    			if (switch_value !== (switch_value = /*column*/ ctx[4].formatter.default)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(19:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:6) {#if '_converted' in row && column.id in row._converted}
    function create_if_block$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*column*/ ctx[4].formatter.default;

    	function switch_props(ctx) {
    		return {
    			props: {
    				options: /*column*/ ctx[4].format,
    				value: /*row*/ ctx[1][/*column*/ ctx[4].id],
    				converted: /*row*/ ctx[1]._converted[/*column*/ ctx[4].id],
    				stats: /*column*/ ctx[4].formatStats
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*columns*/ 1) switch_instance_changes.options = /*column*/ ctx[4].format;
    			if (dirty & /*row, columns*/ 3) switch_instance_changes.value = /*row*/ ctx[1][/*column*/ ctx[4].id];
    			if (dirty & /*row, columns*/ 3) switch_instance_changes.converted = /*row*/ ctx[1]._converted[/*column*/ ctx[4].id];
    			if (dirty & /*columns*/ 1) switch_instance_changes.stats = /*column*/ ctx[4].formatStats;

    			if (switch_value !== (switch_value = /*column*/ ctx[4].formatter.default)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(11:6) {#if '_converted' in row && column.id in row._converted}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#each columns as column, i (column.id)}
    function create_each_block$2(key_1, ctx) {
    	let td;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let td_class_value;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if ("_converted" in /*row*/ ctx[1] && /*column*/ ctx[4].id in /*row*/ ctx[1]._converted) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			td = element("td");
    			if_block.c();
    			t = space();

    			attr_dev(td, "class", td_class_value = /*column*/ ctx[4].delimiter
    			? "plot-delimiter-right"
    			: "");

    			add_location(td, file$6, 9, 4, 219);
    			this.first = td;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if_blocks[current_block_type_index].m(td, null);
    			append_dev(td, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(td, t);
    			}

    			if (!current || dirty & /*columns*/ 1 && td_class_value !== (td_class_value = /*column*/ ctx[4].delimiter
    			? "plot-delimiter-right"
    			: "")) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(9:2) {#each columns as column, i (column.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let tr;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let tr_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*columns*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*column*/ ctx[4].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr, "class", tr_class_value = /*selected*/ ctx[2] ? "bg-gray-100" : "");
    			add_location(tr, file$6, 7, 0, 109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					tr,
    					"click",
    					function () {
    						if (is_function(/*onSelect*/ ctx[3])) /*onSelect*/ ctx[3].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*columns, row*/ 3) {
    				each_value = /*columns*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tr, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}

    			if (!current || dirty & /*selected*/ 4 && tr_class_value !== (tr_class_value = /*selected*/ ctx[2] ? "bg-gray-100" : "")) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Row", slots, []);
    	
    	let { columns } = $$props;
    	let { row } = $$props;
    	let { selected } = $$props;
    	let { onSelect } = $$props;
    	const writable_props = ["columns", "row", "selected", "onSelect"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
    		if ("row" in $$props) $$invalidate(1, row = $$props.row);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    		if ("onSelect" in $$props) $$invalidate(3, onSelect = $$props.onSelect);
    	};

    	$$self.$capture_state = () => ({ columns, row, selected, onSelect });

    	$$self.$inject_state = $$props => {
    		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
    		if ("row" in $$props) $$invalidate(1, row = $$props.row);
    		if ("selected" in $$props) $$invalidate(2, selected = $$props.selected);
    		if ("onSelect" in $$props) $$invalidate(3, onSelect = $$props.onSelect);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [columns, row, selected, onSelect];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, not_equal, {
    			columns: 0,
    			row: 1,
    			selected: 2,
    			onSelect: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*columns*/ ctx[0] === undefined && !("columns" in props)) {
    			console.warn("<Row> was created without expected prop 'columns'");
    		}

    		if (/*row*/ ctx[1] === undefined && !("row" in props)) {
    			console.warn("<Row> was created without expected prop 'row'");
    		}

    		if (/*selected*/ ctx[2] === undefined && !("selected" in props)) {
    			console.warn("<Row> was created without expected prop 'selected'");
    		}

    		if (/*onSelect*/ ctx[3] === undefined && !("onSelect" in props)) {
    			console.warn("<Row> was created without expected prop 'onSelect'");
    		}
    	}

    	get columns() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/table/Toolbar.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1$1 } = globals;
    const file$5 = "src/table/Toolbar.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let input;
    	let t1;
    	let button0;
    	let t2;
    	let button0_class_value;
    	let t3;
    	let button1;
    	let raw_value = filter(bicon$1(!!/*state*/ ctx[0].filters)) + "";
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			button0 = element("button");
    			t2 = text("W");
    			t3 = space();
    			button1 = element("button");
    			attr_dev(div0, "class", "flex items-center");
    			add_location(div0, file$5, 40, 2, 2404);
    			attr_dev(input, "class", "rounded border border-gray-300 text-sm outline-none py-1 px-1 leading-4");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Filter");
    			add_location(input, file$5, 48, 4, 2541);
    			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty(bletter(!!/*state*/ ctx[0].wsort)) + " svelte-r8arpq"));
    			attr_dev(button0, "title", /*wsortHelp*/ ctx[4]);
    			add_location(button0, file$5, 54, 4, 2753);
    			attr_dev(button1, "class", "focus:outline-none");
    			add_location(button1, file$5, 61, 4, 2892);
    			attr_dev(div1, "class", "flex items-center space-x-2");
    			add_location(div1, file$5, 45, 2, 2474);
    			attr_dev(div2, "class", "flex items-center justify-between my-1");
    			add_location(div2, file$5, 38, 0, 2325);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*filterInputValue*/ ctx[1]);
    			append_dev(div1, t1);
    			append_dev(div1, button0);
    			append_dev(button0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, button1);
    			button1.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "keyup", /*onChange*/ ctx[2], false, false, false),
    					listen_dev(button0, "click", /*switchWSort*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*filterInputValue*/ 2 && input.value !== /*filterInputValue*/ ctx[1]) {
    				set_input_value(input, /*filterInputValue*/ ctx[1]);
    			}

    			if (dirty & /*state*/ 1 && button0_class_value !== (button0_class_value = "" + (null_to_empty(bletter(!!/*state*/ ctx[0].wsort)) + " svelte-r8arpq"))) {
    				attr_dev(button0, "class", button0_class_value);
    			}

    			if (dirty & /*state*/ 1 && raw_value !== (raw_value = filter(bicon$1(!!/*state*/ ctx[0].filters)) + "")) button1.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bicon$1(enabled) {
    	// return "h-5 w-5 p-0.5 border rounded text-gray-900 " + (enabled ? "border-gray-300" : "border-white")
    	const color = enabled ? "text-gray-900" : "plot-table-controls-color";

    	return `h-5 w-5 p-0.5 border border-white rounded ${color}`;
    }

    function bletter(enabled) {
    	// return "letter_button focus:outline-none border rounded " + (enabled ? "border-gray-300" : "border-white")
    	const color = enabled ? "text-gray-900" : "plot-table-controls-color";

    	return `letter_button focus:outline-none border border-white rounded ${color}`;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Toolbar", slots, []);
    	
    	let { state } = $$props;
    	let filterInputValue = state.filter;

    	const onChange = (() => {
    		$$invalidate(0, state = Object.assign(Object.assign({}, state), { filter: filterInputValue }));
    	}).debounce(200);

    	function switchWSort() {
    		$$invalidate(0, state = state.wsort
    		? Object.assign(Object.assign({}, state), { wsort: undefined, sort: undefined })
    		: Object.assign(Object.assign({}, state), { wsort: {}, sort: undefined }));
    	}

    	const wsortHelp = [
    		`Weighted sorting. "Smart", weighted, ranked sorting, instead of normal sorting.`,
    		"It works similar to how humans compare products with many attributes, to find the best one.",
    		"Example: find countries with highest salaries, lowest taxes and lowest real estate prices - ordinary" + " sorting would be useless, while weighted sorting would sort the countries in a 'smart' way, similar" + " to how human would do.",
    		"Missing values threated as average, like if we don't have tax rate for country, we guess that it" + " probably should be somewhat average. For non number comparable elements sort rank used as weight." + " ifferent range of values for different columns normalised into [-1..1] range as" + " 'nw = (w - median(w)) / 0.9-quantile(variance(w))*1.11' and limiting min/max outliers by [-1..1].",
    		"- Undefined values threated as average\n" + `- Rank for same values should be the same, like ["a", "a", "b"] should be [0, 0, 1], not [0, 1, 2]\n` + `- Different range of values for different columns normalised into [-1..1] range as
      nw = (w - median(w)) / 0.9-quantile(variance(w))*1.11 and limiting min/max outliers by [-1..1].`
    	].join("\n\n");

    	const writable_props = ["state"];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Toolbar> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		filterInputValue = this.value;
    		$$invalidate(1, filterInputValue);
    	}

    	const click_handler = () => $$invalidate(0, state = {
    		...state,
    		filters: state.filters ? undefined : {}
    	});

    	$$self.$$set = $$props => {
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({
    		icons,
    		state,
    		filterInputValue,
    		onChange,
    		switchWSort,
    		bicon: bicon$1,
    		bletter,
    		wsortHelp
    	});

    	$$self.$inject_state = $$props => {
    		if ("state" in $$props) $$invalidate(0, state = $$props.state);
    		if ("filterInputValue" in $$props) $$invalidate(1, filterInputValue = $$props.filterInputValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		state,
    		filterInputValue,
    		onChange,
    		switchWSort,
    		wsortHelp,
    		input_input_handler,
    		click_handler
    	];
    }

    class Toolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toolbar",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*state*/ ctx[0] === undefined && !("state" in props)) {
    			console.warn("<Toolbar> was created without expected prop 'state'");
    		}
    	}

    	get state() {
    		throw new Error("<Toolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Toolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/table/Table.svelte generated by Svelte v3.38.2 */
    const file$4 = "src/table/Table.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (52:0) {#if options.desc}
    function create_if_block_1$3(ctx) {
    	let div;
    	let t_value = /*options*/ ctx[0].desc + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$4, 52, 2, 1597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 1 && t_value !== (t_value = /*options*/ ctx[0].desc + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(52:0) {#if options.desc}",
    		ctx
    	});

    	return block;
    }

    // (63:2) {#each sorted as row (row._i)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let row;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[16](/*row*/ ctx[18], ...args);
    	}

    	row = new Row({
    			props: {
    				columns: /*columns*/ ctx[3],
    				row: /*row*/ ctx[18],
    				selected: /*selected*/ ctx[4].has(/*row*/ ctx[18]._i),
    				onSelect: func
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(row.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const row_changes = {};
    			if (dirty & /*columns*/ 8) row_changes.columns = /*columns*/ ctx[3];
    			if (dirty & /*sorted*/ 128) row_changes.row = /*row*/ ctx[18];
    			if (dirty & /*selected, sorted*/ 144) row_changes.selected = /*selected*/ ctx[4].has(/*row*/ ctx[18]._i);
    			if (dirty & /*sorted*/ 128) row_changes.onSelect = func;
    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(63:2) {#each sorted as row (row._i)}",
    		ctx
    	});

    	return block;
    }

    // (74:0) {#if options.debug}
    function create_if_block$3(ctx) {
    	let div;
    	let t1;
    	let promise;
    	let t2;
    	let await_block1_anchor;
    	let promise_1;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block_1,
    		then: create_then_block_1,
    		catch: create_catch_block_1,
    		value: 1
    	};

    	handle_promise(
    		promise = to_yaml({
    			.../*state*/ ctx[2],
    			selected: /*selected*/ ctx[4]
    		}),
    		info
    	);

    	let info_1 = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 1
    	};

    	handle_promise(promise_1 = to_yaml(/*columns*/ ctx[3]), info_1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Debug:";
    			t1 = space();
    			info.block.c();
    			t2 = space();
    			await_block1_anchor = empty();
    			info_1.block.c();
    			attr_dev(div, "class", "mt-3");
    			add_location(div, file$4, 74, 2, 2150);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => t2.parentNode;
    			info.anchor = t2;
    			insert_dev(target, t2, anchor);
    			insert_dev(target, await_block1_anchor, anchor);
    			info_1.block.m(target, info_1.anchor = anchor);
    			info_1.mount = () => await_block1_anchor.parentNode;
    			info_1.anchor = await_block1_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*state, selected*/ 20 && promise !== (promise = to_yaml({
    				.../*state*/ ctx[2],
    				selected: /*selected*/ ctx[4]
    			})) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			info_1.ctx = ctx;

    			if (dirty & /*columns*/ 8 && promise_1 !== (promise_1 = to_yaml(/*columns*/ ctx[3])) && handle_promise(promise_1, info_1)) ; else {
    				update_await_block_branch(info_1, ctx, dirty);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(await_block1_anchor);
    			info_1.block.d(detaching);
    			info_1.token = null;
    			info_1 = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(74:0) {#if options.debug}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">// import "./table.css" ; import { filterRows, selectRows, normalize_table_options_slow, sortTable, parse_column_filters }
    function create_catch_block_1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block_1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">// import \\\"./table.css\\\" ; import { filterRows, selectRows, normalize_table_options_slow, sortTable, parse_column_filters }",
    		ctx
    	});

    	return block;
    }

    // (78:2) {:then data}
    function create_then_block_1(ctx) {
    	let textarea;
    	let textarea_value_value;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "block focus:outline-none rounded border border-gray-200 text-xs overflow-scroll mt-4");
    			textarea.readOnly = true;
    			set_style(textarea, "resize", "none");
    			set_style(textarea, "width", "30rem");
    			set_style(textarea, "height", "5rem");
    			textarea.value = textarea_value_value = /*data*/ ctx[1];
    			add_location(textarea, file$4, 78, 4, 2258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state, selected*/ 20 && textarea_value_value !== (textarea_value_value = /*data*/ ctx[1])) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block_1.name,
    		type: "then",
    		source: "(78:2) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (76:42)      Waiting...   {:then data}
    function create_pending_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Waiting...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block_1.name,
    		type: "pending",
    		source: "(76:42)      Waiting...   {:then data}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">// import "./table.css" ; import { filterRows, selectRows, normalize_table_options_slow, sortTable, parse_column_filters }
    function create_catch_block$1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">// import \\\"./table.css\\\" ; import { filterRows, selectRows, normalize_table_options_slow, sortTable, parse_column_filters }",
    		ctx
    	});

    	return block;
    }

    // (87:2) {:then data}
    function create_then_block$1(ctx) {
    	let textarea;
    	let textarea_value_value;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "class", "block focus:outline-none rounded border border-gray-200 text-xs overflow-scroll mt-4");
    			textarea.readOnly = true;
    			set_style(textarea, "resize", "none");
    			set_style(textarea, "width", "30rem");
    			set_style(textarea, "height", "10rem");
    			textarea.value = textarea_value_value = /*data*/ ctx[1];
    			add_location(textarea, file$4, 87, 4, 2541);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columns*/ 8 && textarea_value_value !== (textarea_value_value = /*data*/ ctx[1])) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(87:2) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (85:27)      Waiting...   {:then data}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Waiting...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(85:27)      Waiting...   {:then data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t0;
    	let table;
    	let tr;
    	let td;
    	let toolbar;
    	let updating_state;
    	let td_colspan_value;
    	let tr_class_value;
    	let t1;
    	let header;
    	let updating_state_1;
    	let t2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t3;
    	let messagesimpl;
    	let t4;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*options*/ ctx[0].desc && create_if_block_1$3(ctx);

    	function toolbar_state_binding(value) {
    		/*toolbar_state_binding*/ ctx[14](value);
    	}

    	let toolbar_props = {};

    	if (/*state*/ ctx[2] !== void 0) {
    		toolbar_props.state = /*state*/ ctx[2];
    	}

    	toolbar = new Toolbar({ props: toolbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(toolbar, "state", toolbar_state_binding));

    	function header_state_binding(value) {
    		/*header_state_binding*/ ctx[15](value);
    	}

    	let header_props = {
    		columns: /*columns*/ ctx[3],
    		sortable: /*sortable*/ ctx[6]
    	};

    	if (/*state*/ ctx[2] !== void 0) {
    		header_props.state = /*state*/ ctx[2];
    	}

    	header = new Header({ props: header_props, $$inline: true });
    	binding_callbacks.push(() => bind(header, "state", header_state_binding));
    	let each_value = /*sorted*/ ctx[7];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[18]._i;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	messagesimpl = new Messages({
    			props: { messages: /*messages*/ ctx[5] },
    			$$inline: true
    		});

    	let if_block1 = /*options*/ ctx[0].debug && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			table = element("table");
    			tr = element("tr");
    			td = element("td");
    			create_component(toolbar.$$.fragment);
    			t1 = space();
    			create_component(header.$$.fragment);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			create_component(messagesimpl.$$.fragment);
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(td, "colspan", td_colspan_value = /*columns*/ ctx[3].length);
    			add_location(td, file$4, 57, 4, 1793);
    			attr_dev(tr, "class", tr_class_value = "plot-table-toolbar " + (!/*show_toolbar*/ ctx[8] && "hidden"));
    			add_location(tr, file$4, 56, 2, 1729);
    			attr_dev(table, "class", "plot-table font-mono");
    			add_location(table, file$4, 55, 0, 1630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, td);
    			mount_component(toolbar, td, null);
    			append_dev(table, t1);
    			mount_component(header, table, null);
    			append_dev(table, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			insert_dev(target, t3, anchor);
    			mount_component(messagesimpl, target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(table, "click", /*click_handler*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*options*/ ctx[0].desc) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const toolbar_changes = {};

    			if (!updating_state && dirty & /*state*/ 4) {
    				updating_state = true;
    				toolbar_changes.state = /*state*/ ctx[2];
    				add_flush_callback(() => updating_state = false);
    			}

    			toolbar.$set(toolbar_changes);

    			if (!current || dirty & /*columns*/ 8 && td_colspan_value !== (td_colspan_value = /*columns*/ ctx[3].length)) {
    				attr_dev(td, "colspan", td_colspan_value);
    			}

    			if (!current || dirty & /*show_toolbar*/ 256 && tr_class_value !== (tr_class_value = "plot-table-toolbar " + (!/*show_toolbar*/ ctx[8] && "hidden"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}

    			const header_changes = {};
    			if (dirty & /*columns*/ 8) header_changes.columns = /*columns*/ ctx[3];
    			if (dirty & /*sortable*/ 64) header_changes.sortable = /*sortable*/ ctx[6];

    			if (!updating_state_1 && dirty & /*state*/ 4) {
    				updating_state_1 = true;
    				header_changes.state = /*state*/ ctx[2];
    				add_flush_callback(() => updating_state_1 = false);
    			}

    			header.$set(header_changes);

    			if (dirty & /*columns, sorted, selected, select*/ 664) {
    				each_value = /*sorted*/ ctx[7];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, table, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}

    			const messagesimpl_changes = {};
    			if (dirty & /*messages*/ 32) messagesimpl_changes.messages = /*messages*/ ctx[5];
    			messagesimpl.$set(messagesimpl_changes);

    			if (/*options*/ ctx[0].debug) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toolbar.$$.fragment, local);
    			transition_in(header.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(messagesimpl.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toolbar.$$.fragment, local);
    			transition_out(header.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(messagesimpl.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(table);
    			destroy_component(toolbar);
    			destroy_component(header);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach_dev(t3);
    			destroy_component(messagesimpl, detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let noptions;
    	let columns;
    	let rows;
    	let messages;
    	let sortable;
    	let filtered;
    	let sorted;
    	let show_toolbar;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, []);
    	
    	
    	
    	let { options } = $$props;
    	let { data } = $$props;

    	let state = {
    		filter: options.filter || "",
    		// filters:       parse_column_filters(columns, options.filters),
    		// sortable:      options.sortable != false,
    		sort: options.sort,
    		wsort: options.wsort,
    		// show_json:     false,
    		show_controls: !!options.show_controls
    	};

    	let state_initialized = false;

    	// Selection
    	let selected = new Set(options.selected || []);

    	function select(e, i) {
    		selectRows(e, i, selected, updated => $$invalidate(4, selected = updated));
    	}

    	const writable_props = ["options", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	function toolbar_state_binding(value) {
    		state = value;
    		((((($$invalidate(2, state), $$invalidate(10, state_initialized)), $$invalidate(3, columns)), $$invalidate(0, options)), $$invalidate(11, noptions)), $$invalidate(1, data));
    	}

    	function header_state_binding(value) {
    		state = value;
    		((((($$invalidate(2, state), $$invalidate(10, state_initialized)), $$invalidate(3, columns)), $$invalidate(0, options)), $$invalidate(11, noptions)), $$invalidate(1, data));
    	}

    	const func = (row, e) => select(e, row._i);
    	const click_handler = () => $$invalidate(2, state = { ...state, show_controls: true });

    	$$self.$$set = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		filterRows,
    		selectRows,
    		normalize_table_options_slow,
    		sortTable,
    		parse_column_filters,
    		Header,
    		Row,
    		Toolbar,
    		MessagesImpl: Messages,
    		Brand,
    		to_yaml,
    		options,
    		data,
    		state,
    		state_initialized,
    		selected,
    		select,
    		noptions,
    		columns,
    		rows,
    		messages,
    		sortable,
    		filtered,
    		sorted,
    		show_toolbar
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("state" in $$props) $$invalidate(2, state = $$props.state);
    		if ("state_initialized" in $$props) $$invalidate(10, state_initialized = $$props.state_initialized);
    		if ("selected" in $$props) $$invalidate(4, selected = $$props.selected);
    		if ("noptions" in $$props) $$invalidate(11, noptions = $$props.noptions);
    		if ("columns" in $$props) $$invalidate(3, columns = $$props.columns);
    		if ("rows" in $$props) $$invalidate(12, rows = $$props.rows);
    		if ("messages" in $$props) $$invalidate(5, messages = $$props.messages);
    		if ("sortable" in $$props) $$invalidate(6, sortable = $$props.sortable);
    		if ("filtered" in $$props) $$invalidate(13, filtered = $$props.filtered);
    		if ("sorted" in $$props) $$invalidate(7, sorted = $$props.sorted);
    		if ("show_toolbar" in $$props) $$invalidate(8, show_toolbar = $$props.show_toolbar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options, data*/ 3) {
    			// Normalising
    			$$invalidate(11, noptions = normalize_table_options_slow(options, data));
    		}

    		if ($$self.$$.dirty & /*noptions*/ 2048) {
    			$$invalidate(3, columns = noptions.columns);
    		}

    		if ($$self.$$.dirty & /*noptions*/ 2048) {
    			$$invalidate(12, rows = noptions.rows);
    		}

    		if ($$self.$$.dirty & /*noptions*/ 2048) {
    			$$invalidate(5, messages = noptions.messages);
    		}

    		if ($$self.$$.dirty & /*state_initialized, columns, options*/ 1033) {
    			{
    				if (!state_initialized) {
    					$$invalidate(2, state.filters = parse_column_filters(columns, options.filters), state);
    					$$invalidate(10, state_initialized = true);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*options*/ 1) {
    			$$invalidate(6, sortable = options.sortable != false);
    		}

    		if ($$self.$$.dirty & /*columns, rows, state*/ 4108) {
    			// Filtering
    			$$invalidate(13, filtered = filterRows(columns, rows, state));
    		}

    		if ($$self.$$.dirty & /*columns, filtered, state*/ 8204) {
    			// Sorting
    			$$invalidate(7, sorted = sortTable(columns, filtered, state));
    		}

    		if ($$self.$$.dirty & /*state*/ 4) {
    			// Focused
    			// let showToolbar = !!options.toolbar // != false
    			// Edit
    			// $: edit = options.editable || false
    			$$invalidate(8, show_toolbar = state.show_controls || state.sort || state.wsort || state.filter || state.filters);
    		}
    	};

    	return [
    		options,
    		data,
    		state,
    		columns,
    		selected,
    		messages,
    		sortable,
    		sorted,
    		show_toolbar,
    		select,
    		state_initialized,
    		noptions,
    		rows,
    		filtered,
    		toolbar_state_binding,
    		header_state_binding,
    		func,
    		click_handler
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, not_equal, { options: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !("options" in props)) {
    			console.warn("<Table> was created without expected prop 'options'");
    		}

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Table> was created without expected prop 'data'");
    		}
    	}

    	get options() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/blocks/TableBlockImpl.svelte generated by Svelte v3.38.2 */
    const file$3 = "src/blocks/TableBlockImpl.svelte";

    // (36:2) {:catch error}
    function create_catch_block(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: /*error*/ ctx[3] },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fail_changes = {};
    			if (dirty & /*block*/ 1) fail_changes.error = /*error*/ ctx[3];
    			fail.$set(fail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(36:2) {:catch error}",
    		ctx
    	});

    	return block_1;
    }

    // (34:2) {:then data}
    function create_then_block(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				options: /*block*/ ctx[0].table || {},
    				data: /*data*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty & /*block*/ 1) table_changes.options = /*block*/ ctx[0].table || {};
    			if (dirty & /*block*/ 1) table_changes.data = /*data*/ ctx[2];
    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_then_block.name,
    		type: "then",
    		source: "(34:2) {:then data}",
    		ctx
    	});

    	return block_1;
    }

    // (32:39)      <Progress/>   {:then data}
    function create_pending_block(ctx) {
    	let progress;
    	let current;
    	progress = new Progress({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			create_component(progress.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progress, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progress.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progress.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progress, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(32:39)      <Progress/>   {:then data}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let promise;
    	let t;
    	let brand;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 2,
    		error: 3,
    		blocks: [,,,]
    	};

    	handle_promise(promise = get_or_load_data(/*block*/ ctx[0].data), info);
    	brand = new Brand({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			t = space();
    			create_component(brand.$$.fragment);
    			attr_dev(div, "class", "TableBlockContent relative");
    			add_location(div, file$3, 30, 0, 844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = t;
    			append_dev(div, t);
    			mount_component(brand, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*block*/ 1 && promise !== (promise = get_or_load_data(/*block*/ ctx[0].data)) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(brand.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(brand.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(brand);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    const definition$1 = {
    	match_and_normalize: data => {
    		if (is_object(data) && "table" in data) {
    			if (is_array(data.table)) return { data: data.table, table: {} }; else return data;
    		} else if (is_array(data)) {
    			return { data, table: {} };
    		} else if (is_csv_table(data)) {
    			return csv_table_to_table_block_data(data);
    		}
    	}
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TableBlockImpl", slots, []);
    	
    	
    	let { block } = $$props;
    	let { is_narrow } = $$props;
    	discard(is_narrow);
    	const writable_props = ["block", "is_narrow"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TableBlockImpl> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(1, is_narrow = $$props.is_narrow);
    	};

    	$$self.$capture_state = () => ({
    		definition: definition$1,
    		get_or_load_data,
    		is_csv_table,
    		csv_table_to_table_block_data,
    		Fail,
    		Progress,
    		Brand,
    		Table,
    		block,
    		is_narrow
    	});

    	$$self.$inject_state = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_narrow" in $$props) $$invalidate(1, is_narrow = $$props.is_narrow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [block, is_narrow];
    }

    class TableBlockImpl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, not_equal, { block: 0, is_narrow: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableBlockImpl",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !("block" in props)) {
    			console.warn("<TableBlockImpl> was created without expected prop 'block'");
    		}

    		if (/*is_narrow*/ ctx[1] === undefined && !("is_narrow" in props)) {
    			console.warn("<TableBlockImpl> was created without expected prop 'is_narrow'");
    		}
    	}

    	get block() {
    		throw new Error("<TableBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<TableBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_narrow() {
    		throw new Error("<TableBlockImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_narrow(value) {
    		throw new Error("<TableBlockImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TableBlockImpl$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': TableBlockImpl,
        definition: definition$1
    });

    // Any otherwise rollup complains
    plot_config.blocks.image = ImageBlockImpl$1;
    plot_config.blocks.text = TextBlockImpl$1;
    plot_config.blocks.chart = ChartBlockImpl$1;
    plot_config.blocks.table = TableBlockImpl$1;
    // get_block ---------------------------------------------------------------------------------------
    function get_block(block, extension) {
        if (block === null || block === undefined)
            return;
        if (is_object(block)) {
            const data = block;
            // Checking explicit block and version if specified
            if (data.block) {
                if (!(is_array(data.block) && data.block.length == 2)) {
                    throw `invalid block, it should be \`block: [block_name, ${version}]\``;
                }
                const name = data.block[0];
                const { definition, default: klass } = plot_config.blocks[name];
                const ndata = definition.match_and_normalize(data);
                if (!ndata)
                    throw `Data not matching '${name}' block`;
                return { name, klass, ndata };
            }
            // Infering block from data
            for (const name in plot_config.blocks) {
                const { definition, default: klass } = plot_config.blocks[name];
                const ndata = definition.match_and_normalize(data);
                if (ndata)
                    return { name, klass, ndata };
            }
        }
        // Inferring block from extension if specified
        if (extension) {
            const name = plot_config.blocks_for_file_extensions[extension];
            const found = plot_config.blocks[name];
            if (found) {
                const { definition, default: klass } = found;
                const ndata = definition.match_and_normalize(block);
                if (!ndata)
                    throw `Data not matching '${name}' block, registered for extension ${extension}`;
                return { name, klass, ndata };
            }
        }
        // Using table block for arrays and objects by default
        if (is_array(block)) {
            const name = 'table';
            const { definition, default: klass } = plot_config.blocks[name];
            const ndata = definition.match_and_normalize(block);
            if (!ndata)
                throw 'internal error, data not matching table block';
            return { name, klass, ndata };
        }
        if (is_string(block)) {
            const name = 'table';
            const { definition, default: klass } = plot_config.blocks[name];
            const ndata = definition.match_and_normalize(block);
            if (!ndata)
                throw 'internal error, data not matching text block';
            return { name, klass, ndata };
        }
    }

    /* src/apps/single/SingleImpl.svelte generated by Svelte v3.38.2 */
    const file$2 = "src/apps/single/SingleImpl.svelte";

    // (15:2) {#if data.title}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t_value = /*data*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "plot-title");
    			add_location(div, file$2, 15, 4, 424);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = /*data*/ ctx[1].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(15:2) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if data.desc}
    function create_if_block$2(ctx) {
    	let markdown;
    	let current;

    	markdown = new Markdown({
    			props: { markdown: /*data*/ ctx[1].desc },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(markdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(markdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const markdown_changes = {};
    			if (dirty & /*data*/ 2) markdown_changes.markdown = /*data*/ ctx[1].desc;
    			markdown.$set(markdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(markdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(18:2) {#if data.desc}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let switch_instance;
    	let t2;
    	let brand;
    	let div1_class_value;
    	let current;
    	let if_block0 = /*data*/ ctx[1].title && create_if_block_1$2(ctx);
    	let if_block1 = /*data*/ ctx[1].desc && create_if_block$2(ctx);
    	var switch_value = /*block_impl*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: { block: /*data*/ ctx[1], is_narrow: false },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	brand = new Brand({ props: { is_main: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t2 = space();
    			create_component(brand.$$.fragment);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file$2, 20, 2, 540);
    			attr_dev(div1, "class", div1_class_value = "plot-single plot-single-" + /*block_name*/ ctx[0] + " plot-style-" + /*style*/ ctx[3]);
    			add_location(div1, file$2, 13, 0, 331);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			append_dev(div1, t2);
    			mount_component(brand, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[1].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*data*/ ctx[1].desc) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*data*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const switch_instance_changes = {};
    			if (dirty & /*data*/ 2) switch_instance_changes.block = /*data*/ ctx[1];

    			if (switch_value !== (switch_value = /*block_impl*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (!current || dirty & /*block_name, style*/ 9 && div1_class_value !== (div1_class_value = "plot-single plot-single-" + /*block_name*/ ctx[0] + " plot-style-" + /*style*/ ctx[3])) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(brand.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(brand.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (switch_instance) destroy_component(switch_instance);
    			destroy_component(brand);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let style;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SingleImpl", slots, []);
    	let { default_title } = $$props;
    	let { block_name } = $$props;
    	let { data } = $$props;
    	let { block_impl } = $$props;
    	const writable_props = ["default_title", "block_name", "data", "block_impl"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SingleImpl> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("default_title" in $$props) $$invalidate(4, default_title = $$props.default_title);
    		if ("block_name" in $$props) $$invalidate(0, block_name = $$props.block_name);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("block_impl" in $$props) $$invalidate(2, block_impl = $$props.block_impl);
    	};

    	$$self.$capture_state = () => ({
    		Markdown,
    		Brand,
    		default_title,
    		block_name,
    		data,
    		block_impl,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ("default_title" in $$props) $$invalidate(4, default_title = $$props.default_title);
    		if ("block_name" in $$props) $$invalidate(0, block_name = $$props.block_name);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("block_impl" in $$props) $$invalidate(2, block_impl = $$props.block_impl);
    		if ("style" in $$props) $$invalidate(3, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, default_title*/ 18) {
    			{
    				document.title = is_object(data) && data.title || "id" in data && "" + data.id || default_title || "PLOT";
    			}
    		}

    		if ($$self.$$.dirty & /*data*/ 2) {
    			$$invalidate(3, style = data.style || "normal");
    		}
    	};

    	return [block_name, data, block_impl, style, default_title];
    }

    class SingleImpl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, not_equal, {
    			default_title: 4,
    			block_name: 0,
    			data: 1,
    			block_impl: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SingleImpl",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*default_title*/ ctx[4] === undefined && !("default_title" in props)) {
    			console.warn("<SingleImpl> was created without expected prop 'default_title'");
    		}

    		if (/*block_name*/ ctx[0] === undefined && !("block_name" in props)) {
    			console.warn("<SingleImpl> was created without expected prop 'block_name'");
    		}

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<SingleImpl> was created without expected prop 'data'");
    		}

    		if (/*block_impl*/ ctx[2] === undefined && !("block_impl" in props)) {
    			console.warn("<SingleImpl> was created without expected prop 'block_impl'");
    		}
    	}

    	get default_title() {
    		throw new Error("<SingleImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set default_title(value) {
    		throw new Error("<SingleImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block_name() {
    		throw new Error("<SingleImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block_name(value) {
    		throw new Error("<SingleImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<SingleImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<SingleImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block_impl() {
    		throw new Error("<SingleImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block_impl(value) {
    		throw new Error("<SingleImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // https://gist.github.com/diafygi/90a3e80ca1c2793220e5/
    const base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    function encodeBase58(B, //Uint8Array raw byte input
    A = base58 //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
    ) {
        var d = [], //the array for storing the stream of base58 digits
        s = "", //the result string variable that will be returned
        i, //the iterator variable for the byte input
        j, //the iterator variable for the base58 digit array (d)
        c, //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
        n; //a temporary placeholder variable for the current base58 digit
        for (i in B) { //loop through each byte in the input stream
            j = 0, //reset the base58 digit iterator
                c = B[i]; //set the initial carry amount equal to the current byte amount
            s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
            while (j in d || c) { //start looping through the digits until there are no more digits and no carry amount
                n = d[j]; //set the placeholder for the current base58 digit
                n = n ? n * 256 + c : c; //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
                c = n / 58 | 0; //find the new carry amount (floored integer of current digit divided by 58)
                d[j] = n % 58; //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
                j++; //iterate to the next base58 digit
            }
        }
        while (j--) //since the base58 digits are backwards, loop through them in reverse order
            s += A[d[j]]; //lookup the character associated with each base58 digit
        return s; //return the final base58 string
    }

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    var core = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory();
    	}
    }(commonjsGlobal, function () {

    	/*globals window, global, require*/

    	/**
    	 * CryptoJS core components.
    	 */
    	var CryptoJS = CryptoJS || (function (Math, undefined$1) {

    	    var crypto;

    	    // Native crypto from window (Browser)
    	    if (typeof window !== 'undefined' && window.crypto) {
    	        crypto = window.crypto;
    	    }

    	    // Native crypto in web worker (Browser)
    	    if (typeof self !== 'undefined' && self.crypto) {
    	        crypto = self.crypto;
    	    }

    	    // Native crypto from worker
    	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    	        crypto = globalThis.crypto;
    	    }

    	    // Native (experimental IE 11) crypto from window (Browser)
    	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
    	        crypto = window.msCrypto;
    	    }

    	    // Native crypto from global (NodeJS)
    	    if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
    	        crypto = commonjsGlobal.crypto;
    	    }

    	    // Native crypto import via require (NodeJS)
    	    if (!crypto && typeof commonjsRequire === 'function') {
    	        try {
    	            crypto = require$$0;
    	        } catch (err) {}
    	    }

    	    /*
    	     * Cryptographically secure pseudorandom number generator
    	     *
    	     * As Math.random() is cryptographically not safe to use
    	     */
    	    var cryptoSecureRandomInt = function () {
    	        if (crypto) {
    	            // Use getRandomValues method (Browser)
    	            if (typeof crypto.getRandomValues === 'function') {
    	                try {
    	                    return crypto.getRandomValues(new Uint32Array(1))[0];
    	                } catch (err) {}
    	            }

    	            // Use randomBytes method (NodeJS)
    	            if (typeof crypto.randomBytes === 'function') {
    	                try {
    	                    return crypto.randomBytes(4).readInt32LE();
    	                } catch (err) {}
    	            }
    	        }

    	        throw new Error('Native crypto module could not be used to get secure random number.');
    	    };

    	    /*
    	     * Local polyfill of Object.create

    	     */
    	    var create = Object.create || (function () {
    	        function F() {}

    	        return function (obj) {
    	            var subtype;

    	            F.prototype = obj;

    	            subtype = new F();

    	            F.prototype = null;

    	            return subtype;
    	        };
    	    }());

    	    /**
    	     * CryptoJS namespace.
    	     */
    	    var C = {};

    	    /**
    	     * Library namespace.
    	     */
    	    var C_lib = C.lib = {};

    	    /**
    	     * Base object for prototypal inheritance.
    	     */
    	    var Base = C_lib.Base = (function () {


    	        return {
    	            /**
    	             * Creates a new object that inherits from this object.
    	             *
    	             * @param {Object} overrides Properties to copy into the new object.
    	             *
    	             * @return {Object} The new object.
    	             *
    	             * @static
    	             *
    	             * @example
    	             *
    	             *     var MyType = CryptoJS.lib.Base.extend({
    	             *         field: 'value',
    	             *
    	             *         method: function () {
    	             *         }
    	             *     });
    	             */
    	            extend: function (overrides) {
    	                // Spawn
    	                var subtype = create(this);

    	                // Augment
    	                if (overrides) {
    	                    subtype.mixIn(overrides);
    	                }

    	                // Create default initializer
    	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
    	                    subtype.init = function () {
    	                        subtype.$super.init.apply(this, arguments);
    	                    };
    	                }

    	                // Initializer's prototype is the subtype object
    	                subtype.init.prototype = subtype;

    	                // Reference supertype
    	                subtype.$super = this;

    	                return subtype;
    	            },

    	            /**
    	             * Extends this object and runs the init method.
    	             * Arguments to create() will be passed to init().
    	             *
    	             * @return {Object} The new object.
    	             *
    	             * @static
    	             *
    	             * @example
    	             *
    	             *     var instance = MyType.create();
    	             */
    	            create: function () {
    	                var instance = this.extend();
    	                instance.init.apply(instance, arguments);

    	                return instance;
    	            },

    	            /**
    	             * Initializes a newly created object.
    	             * Override this method to add some logic when your objects are created.
    	             *
    	             * @example
    	             *
    	             *     var MyType = CryptoJS.lib.Base.extend({
    	             *         init: function () {
    	             *             // ...
    	             *         }
    	             *     });
    	             */
    	            init: function () {
    	            },

    	            /**
    	             * Copies properties into this object.
    	             *
    	             * @param {Object} properties The properties to mix in.
    	             *
    	             * @example
    	             *
    	             *     MyType.mixIn({
    	             *         field: 'value'
    	             *     });
    	             */
    	            mixIn: function (properties) {
    	                for (var propertyName in properties) {
    	                    if (properties.hasOwnProperty(propertyName)) {
    	                        this[propertyName] = properties[propertyName];
    	                    }
    	                }

    	                // IE won't copy toString using the loop above
    	                if (properties.hasOwnProperty('toString')) {
    	                    this.toString = properties.toString;
    	                }
    	            },

    	            /**
    	             * Creates a copy of this object.
    	             *
    	             * @return {Object} The clone.
    	             *
    	             * @example
    	             *
    	             *     var clone = instance.clone();
    	             */
    	            clone: function () {
    	                return this.init.prototype.extend(this);
    	            }
    	        };
    	    }());

    	    /**
    	     * An array of 32-bit words.
    	     *
    	     * @property {Array} words The array of 32-bit words.
    	     * @property {number} sigBytes The number of significant bytes in this word array.
    	     */
    	    var WordArray = C_lib.WordArray = Base.extend({
    	        /**
    	         * Initializes a newly created word array.
    	         *
    	         * @param {Array} words (Optional) An array of 32-bit words.
    	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.lib.WordArray.create();
    	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
    	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
    	         */
    	        init: function (words, sigBytes) {
    	            words = this.words = words || [];

    	            if (sigBytes != undefined$1) {
    	                this.sigBytes = sigBytes;
    	            } else {
    	                this.sigBytes = words.length * 4;
    	            }
    	        },

    	        /**
    	         * Converts this word array to a string.
    	         *
    	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
    	         *
    	         * @return {string} The stringified word array.
    	         *
    	         * @example
    	         *
    	         *     var string = wordArray + '';
    	         *     var string = wordArray.toString();
    	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
    	         */
    	        toString: function (encoder) {
    	            return (encoder || Hex).stringify(this);
    	        },

    	        /**
    	         * Concatenates a word array to this word array.
    	         *
    	         * @param {WordArray} wordArray The word array to append.
    	         *
    	         * @return {WordArray} This word array.
    	         *
    	         * @example
    	         *
    	         *     wordArray1.concat(wordArray2);
    	         */
    	        concat: function (wordArray) {
    	            // Shortcuts
    	            var thisWords = this.words;
    	            var thatWords = wordArray.words;
    	            var thisSigBytes = this.sigBytes;
    	            var thatSigBytes = wordArray.sigBytes;

    	            // Clamp excess bits
    	            this.clamp();

    	            // Concat
    	            if (thisSigBytes % 4) {
    	                // Copy one byte at a time
    	                for (var i = 0; i < thatSigBytes; i++) {
    	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
    	                }
    	            } else {
    	                // Copy one word at a time
    	                for (var j = 0; j < thatSigBytes; j += 4) {
    	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
    	                }
    	            }
    	            this.sigBytes += thatSigBytes;

    	            // Chainable
    	            return this;
    	        },

    	        /**
    	         * Removes insignificant bits.
    	         *
    	         * @example
    	         *
    	         *     wordArray.clamp();
    	         */
    	        clamp: function () {
    	            // Shortcuts
    	            var words = this.words;
    	            var sigBytes = this.sigBytes;

    	            // Clamp
    	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
    	            words.length = Math.ceil(sigBytes / 4);
    	        },

    	        /**
    	         * Creates a copy of this word array.
    	         *
    	         * @return {WordArray} The clone.
    	         *
    	         * @example
    	         *
    	         *     var clone = wordArray.clone();
    	         */
    	        clone: function () {
    	            var clone = Base.clone.call(this);
    	            clone.words = this.words.slice(0);

    	            return clone;
    	        },

    	        /**
    	         * Creates a word array filled with random bytes.
    	         *
    	         * @param {number} nBytes The number of random bytes to generate.
    	         *
    	         * @return {WordArray} The random word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
    	         */
    	        random: function (nBytes) {
    	            var words = [];

    	            for (var i = 0; i < nBytes; i += 4) {
    	                words.push(cryptoSecureRandomInt());
    	            }

    	            return new WordArray.init(words, nBytes);
    	        }
    	    });

    	    /**
    	     * Encoder namespace.
    	     */
    	    var C_enc = C.enc = {};

    	    /**
    	     * Hex encoding strategy.
    	     */
    	    var Hex = C_enc.Hex = {
    	        /**
    	         * Converts a word array to a hex string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The hex string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;

    	            // Convert
    	            var hexChars = [];
    	            for (var i = 0; i < sigBytes; i++) {
    	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    	                hexChars.push((bite >>> 4).toString(16));
    	                hexChars.push((bite & 0x0f).toString(16));
    	            }

    	            return hexChars.join('');
    	        },

    	        /**
    	         * Converts a hex string to a word array.
    	         *
    	         * @param {string} hexStr The hex string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
    	         */
    	        parse: function (hexStr) {
    	            // Shortcut
    	            var hexStrLength = hexStr.length;

    	            // Convert
    	            var words = [];
    	            for (var i = 0; i < hexStrLength; i += 2) {
    	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
    	            }

    	            return new WordArray.init(words, hexStrLength / 2);
    	        }
    	    };

    	    /**
    	     * Latin1 encoding strategy.
    	     */
    	    var Latin1 = C_enc.Latin1 = {
    	        /**
    	         * Converts a word array to a Latin1 string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The Latin1 string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;

    	            // Convert
    	            var latin1Chars = [];
    	            for (var i = 0; i < sigBytes; i++) {
    	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    	                latin1Chars.push(String.fromCharCode(bite));
    	            }

    	            return latin1Chars.join('');
    	        },

    	        /**
    	         * Converts a Latin1 string to a word array.
    	         *
    	         * @param {string} latin1Str The Latin1 string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
    	         */
    	        parse: function (latin1Str) {
    	            // Shortcut
    	            var latin1StrLength = latin1Str.length;

    	            // Convert
    	            var words = [];
    	            for (var i = 0; i < latin1StrLength; i++) {
    	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    	            }

    	            return new WordArray.init(words, latin1StrLength);
    	        }
    	    };

    	    /**
    	     * UTF-8 encoding strategy.
    	     */
    	    var Utf8 = C_enc.Utf8 = {
    	        /**
    	         * Converts a word array to a UTF-8 string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The UTF-8 string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            try {
    	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
    	            } catch (e) {
    	                throw new Error('Malformed UTF-8 data');
    	            }
    	        },

    	        /**
    	         * Converts a UTF-8 string to a word array.
    	         *
    	         * @param {string} utf8Str The UTF-8 string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
    	         */
    	        parse: function (utf8Str) {
    	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
    	        }
    	    };

    	    /**
    	     * Abstract buffered block algorithm template.
    	     *
    	     * The property blockSize must be implemented in a concrete subtype.
    	     *
    	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
    	     */
    	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
    	        /**
    	         * Resets this block algorithm's data buffer to its initial state.
    	         *
    	         * @example
    	         *
    	         *     bufferedBlockAlgorithm.reset();
    	         */
    	        reset: function () {
    	            // Initial values
    	            this._data = new WordArray.init();
    	            this._nDataBytes = 0;
    	        },

    	        /**
    	         * Adds new data to this block algorithm's buffer.
    	         *
    	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
    	         *
    	         * @example
    	         *
    	         *     bufferedBlockAlgorithm._append('data');
    	         *     bufferedBlockAlgorithm._append(wordArray);
    	         */
    	        _append: function (data) {
    	            // Convert string to WordArray, else assume WordArray already
    	            if (typeof data == 'string') {
    	                data = Utf8.parse(data);
    	            }

    	            // Append
    	            this._data.concat(data);
    	            this._nDataBytes += data.sigBytes;
    	        },

    	        /**
    	         * Processes available data blocks.
    	         *
    	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
    	         *
    	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
    	         *
    	         * @return {WordArray} The processed data.
    	         *
    	         * @example
    	         *
    	         *     var processedData = bufferedBlockAlgorithm._process();
    	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
    	         */
    	        _process: function (doFlush) {
    	            var processedWords;

    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;
    	            var dataSigBytes = data.sigBytes;
    	            var blockSize = this.blockSize;
    	            var blockSizeBytes = blockSize * 4;

    	            // Count blocks ready
    	            var nBlocksReady = dataSigBytes / blockSizeBytes;
    	            if (doFlush) {
    	                // Round up to include partial blocks
    	                nBlocksReady = Math.ceil(nBlocksReady);
    	            } else {
    	                // Round down to include only full blocks,
    	                // less the number of blocks that must remain in the buffer
    	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    	            }

    	            // Count words ready
    	            var nWordsReady = nBlocksReady * blockSize;

    	            // Count bytes ready
    	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

    	            // Process blocks
    	            if (nWordsReady) {
    	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
    	                    // Perform concrete-algorithm logic
    	                    this._doProcessBlock(dataWords, offset);
    	                }

    	                // Remove processed words
    	                processedWords = dataWords.splice(0, nWordsReady);
    	                data.sigBytes -= nBytesReady;
    	            }

    	            // Return processed words
    	            return new WordArray.init(processedWords, nBytesReady);
    	        },

    	        /**
    	         * Creates a copy of this object.
    	         *
    	         * @return {Object} The clone.
    	         *
    	         * @example
    	         *
    	         *     var clone = bufferedBlockAlgorithm.clone();
    	         */
    	        clone: function () {
    	            var clone = Base.clone.call(this);
    	            clone._data = this._data.clone();

    	            return clone;
    	        },

    	        _minBufferSize: 0
    	    });

    	    /**
    	     * Abstract hasher template.
    	     *
    	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
    	     */
    	    C_lib.Hasher = BufferedBlockAlgorithm.extend({
    	        /**
    	         * Configuration options.
    	         */
    	        cfg: Base.extend(),

    	        /**
    	         * Initializes a newly created hasher.
    	         *
    	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
    	         *
    	         * @example
    	         *
    	         *     var hasher = CryptoJS.algo.SHA256.create();
    	         */
    	        init: function (cfg) {
    	            // Apply config defaults
    	            this.cfg = this.cfg.extend(cfg);

    	            // Set initial values
    	            this.reset();
    	        },

    	        /**
    	         * Resets this hasher to its initial state.
    	         *
    	         * @example
    	         *
    	         *     hasher.reset();
    	         */
    	        reset: function () {
    	            // Reset data buffer
    	            BufferedBlockAlgorithm.reset.call(this);

    	            // Perform concrete-hasher logic
    	            this._doReset();
    	        },

    	        /**
    	         * Updates this hasher with a message.
    	         *
    	         * @param {WordArray|string} messageUpdate The message to append.
    	         *
    	         * @return {Hasher} This hasher.
    	         *
    	         * @example
    	         *
    	         *     hasher.update('message');
    	         *     hasher.update(wordArray);
    	         */
    	        update: function (messageUpdate) {
    	            // Append
    	            this._append(messageUpdate);

    	            // Update the hash
    	            this._process();

    	            // Chainable
    	            return this;
    	        },

    	        /**
    	         * Finalizes the hash computation.
    	         * Note that the finalize operation is effectively a destructive, read-once operation.
    	         *
    	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
    	         *
    	         * @return {WordArray} The hash.
    	         *
    	         * @example
    	         *
    	         *     var hash = hasher.finalize();
    	         *     var hash = hasher.finalize('message');
    	         *     var hash = hasher.finalize(wordArray);
    	         */
    	        finalize: function (messageUpdate) {
    	            // Final message update
    	            if (messageUpdate) {
    	                this._append(messageUpdate);
    	            }

    	            // Perform concrete-hasher logic
    	            var hash = this._doFinalize();

    	            return hash;
    	        },

    	        blockSize: 512/32,

    	        /**
    	         * Creates a shortcut function to a hasher's object interface.
    	         *
    	         * @param {Hasher} hasher The hasher to create a helper for.
    	         *
    	         * @return {Function} The shortcut function.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
    	         */
    	        _createHelper: function (hasher) {
    	            return function (message, cfg) {
    	                return new hasher.init(cfg).finalize(message);
    	            };
    	        },

    	        /**
    	         * Creates a shortcut function to the HMAC's object interface.
    	         *
    	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
    	         *
    	         * @return {Function} The shortcut function.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
    	         */
    	        _createHmacHelper: function (hasher) {
    	            return function (message, key) {
    	                return new C_algo.HMAC.init(hasher, key).finalize(message);
    	            };
    	        }
    	    });

    	    /**
    	     * Algorithm namespace.
    	     */
    	    var C_algo = C.algo = {};

    	    return C;
    	}(Math));


    	return CryptoJS;

    }));
    });

    var md5 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (Math) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_algo = C.algo;

    	    // Constants table
    	    var T = [];

    	    // Compute constants
    	    (function () {
    	        for (var i = 0; i < 64; i++) {
    	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
    	        }
    	    }());

    	    /**
    	     * MD5 hash algorithm.
    	     */
    	    var MD5 = C_algo.MD5 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash = new WordArray.init([
    	                0x67452301, 0xefcdab89,
    	                0x98badcfe, 0x10325476
    	            ]);
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Swap endian
    	            for (var i = 0; i < 16; i++) {
    	                // Shortcuts
    	                var offset_i = offset + i;
    	                var M_offset_i = M[offset_i];

    	                M[offset_i] = (
    	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
    	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
    	                );
    	            }

    	            // Shortcuts
    	            var H = this._hash.words;

    	            var M_offset_0  = M[offset + 0];
    	            var M_offset_1  = M[offset + 1];
    	            var M_offset_2  = M[offset + 2];
    	            var M_offset_3  = M[offset + 3];
    	            var M_offset_4  = M[offset + 4];
    	            var M_offset_5  = M[offset + 5];
    	            var M_offset_6  = M[offset + 6];
    	            var M_offset_7  = M[offset + 7];
    	            var M_offset_8  = M[offset + 8];
    	            var M_offset_9  = M[offset + 9];
    	            var M_offset_10 = M[offset + 10];
    	            var M_offset_11 = M[offset + 11];
    	            var M_offset_12 = M[offset + 12];
    	            var M_offset_13 = M[offset + 13];
    	            var M_offset_14 = M[offset + 14];
    	            var M_offset_15 = M[offset + 15];

    	            // Working varialbes
    	            var a = H[0];
    	            var b = H[1];
    	            var c = H[2];
    	            var d = H[3];

    	            // Computation
    	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
    	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
    	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
    	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
    	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
    	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
    	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
    	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
    	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
    	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
    	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
    	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
    	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
    	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
    	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
    	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

    	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
    	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
    	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
    	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
    	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
    	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
    	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
    	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
    	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
    	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
    	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
    	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
    	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
    	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
    	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
    	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

    	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
    	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
    	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
    	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
    	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
    	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
    	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
    	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
    	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
    	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
    	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
    	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
    	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
    	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
    	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
    	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

    	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
    	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
    	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
    	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
    	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
    	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
    	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
    	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
    	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
    	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
    	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
    	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
    	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
    	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
    	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
    	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

    	            // Intermediate hash value
    	            H[0] = (H[0] + a) | 0;
    	            H[1] = (H[1] + b) | 0;
    	            H[2] = (H[2] + c) | 0;
    	            H[3] = (H[3] + d) | 0;
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

    	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
    	            var nBitsTotalL = nBitsTotal;
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
    	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
    	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
    	            );
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
    	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
    	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
    	            );

    	            data.sigBytes = (dataWords.length + 1) * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Shortcuts
    	            var hash = this._hash;
    	            var H = hash.words;

    	            // Swap endian
    	            for (var i = 0; i < 4; i++) {
    	                // Shortcut
    	                var H_i = H[i];

    	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
    	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
    	            }

    	            // Return final computed hash
    	            return hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        }
    	    });

    	    function FF(a, b, c, d, x, s, t) {
    	        var n = a + ((b & c) | (~b & d)) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    function GG(a, b, c, d, x, s, t) {
    	        var n = a + ((b & d) | (c & ~d)) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    function HH(a, b, c, d, x, s, t) {
    	        var n = a + (b ^ c ^ d) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    function II(a, b, c, d, x, s, t) {
    	        var n = a + (c ^ (b | ~d)) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.MD5('message');
    	     *     var hash = CryptoJS.MD5(wordArray);
    	     */
    	    C.MD5 = Hasher._createHelper(MD5);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacMD5(message, key);
    	     */
    	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
    	}(Math));


    	return CryptoJS.MD5;

    }));
    });

    var sha256 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (Math) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_algo = C.algo;

    	    // Initialization and round constants tables
    	    var H = [];
    	    var K = [];

    	    // Compute constants
    	    (function () {
    	        function isPrime(n) {
    	            var sqrtN = Math.sqrt(n);
    	            for (var factor = 2; factor <= sqrtN; factor++) {
    	                if (!(n % factor)) {
    	                    return false;
    	                }
    	            }

    	            return true;
    	        }

    	        function getFractionalBits(n) {
    	            return ((n - (n | 0)) * 0x100000000) | 0;
    	        }

    	        var n = 2;
    	        var nPrime = 0;
    	        while (nPrime < 64) {
    	            if (isPrime(n)) {
    	                if (nPrime < 8) {
    	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
    	                }
    	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

    	                nPrime++;
    	            }

    	            n++;
    	        }
    	    }());

    	    // Reusable object
    	    var W = [];

    	    /**
    	     * SHA-256 hash algorithm.
    	     */
    	    var SHA256 = C_algo.SHA256 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash = new WordArray.init(H.slice(0));
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcut
    	            var H = this._hash.words;

    	            // Working variables
    	            var a = H[0];
    	            var b = H[1];
    	            var c = H[2];
    	            var d = H[3];
    	            var e = H[4];
    	            var f = H[5];
    	            var g = H[6];
    	            var h = H[7];

    	            // Computation
    	            for (var i = 0; i < 64; i++) {
    	                if (i < 16) {
    	                    W[i] = M[offset + i] | 0;
    	                } else {
    	                    var gamma0x = W[i - 15];
    	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
    	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
    	                                   (gamma0x >>> 3);

    	                    var gamma1x = W[i - 2];
    	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
    	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
    	                                   (gamma1x >>> 10);

    	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    	                }

    	                var ch  = (e & f) ^ (~e & g);
    	                var maj = (a & b) ^ (a & c) ^ (b & c);

    	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    	                var t1 = h + sigma1 + ch + K[i] + W[i];
    	                var t2 = sigma0 + maj;

    	                h = g;
    	                g = f;
    	                f = e;
    	                e = (d + t1) | 0;
    	                d = c;
    	                c = b;
    	                b = a;
    	                a = (t1 + t2) | 0;
    	            }

    	            // Intermediate hash value
    	            H[0] = (H[0] + a) | 0;
    	            H[1] = (H[1] + b) | 0;
    	            H[2] = (H[2] + c) | 0;
    	            H[3] = (H[3] + d) | 0;
    	            H[4] = (H[4] + e) | 0;
    	            H[5] = (H[5] + f) | 0;
    	            H[6] = (H[6] + g) | 0;
    	            H[7] = (H[7] + h) | 0;
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    	            data.sigBytes = dataWords.length * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Return final computed hash
    	            return this._hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        }
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA256('message');
    	     *     var hash = CryptoJS.SHA256(wordArray);
    	     */
    	    C.SHA256 = Hasher._createHelper(SHA256);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA256(message, key);
    	     */
    	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
    	}(Math));


    	return CryptoJS.SHA256;

    }));
    });

    function hash(data, algo = 'md5', encoding = 'base58') {
        if (typeof data == "number")
            data = '' + data;
        let hash;
        if (algo == 'md5')
            hash = md5(data);
        else if (algo == 'sha256')
            hash = sha256(data);
        else
            throw 'unknown hash algo';
        if (encoding == 'base58')
            return encodeBase58(convert_word_array_to_uint8Array(hash));
        else
            throw 'unknown encoding';
    }
    test(hash, () => {
        assert.equal(hash('some'), 'UTqN8G7jWovoR1rVejd8M');
    });
    function convert_word_array_to_uint8Array(wordArray) {
        var len = wordArray.words.length, u8_array = new Uint8Array(len << 2), offset = 0, word, i;
        for (i = 0; i < len; i++) {
            word = wordArray.words[i];
            u8_array[offset++] = word >> 24;
            u8_array[offset++] = (word >> 16) & 0xff;
            u8_array[offset++] = (word >> 8) & 0xff;
            u8_array[offset++] = word & 0xff;
        }
        return u8_array;
    }

    function normalize_blocks_slow(blocks) {
        const messages = [];
        const nblocks = [], ids_map = new Set();
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (!is_object(block)) {
                nblocks.add({ is_error: true, id: `error_${i}`, message: `Invalid block data` });
                continue;
            }
            const hash$1 = block.hash ||
                hash(to_json(block), 'md5').take(4);
            let id = (block.id !== undefined && ('' + block.id)) ||
                (block.title && hash(block.title, 'md5')) || hash$1;
            if (ids_map.has(id)) {
                nblocks.add({ is_error: true, id: `error_${i}`, message: `Duplicate block id '${id}'` });
                continue;
            }
            ids_map.add(id);
            nblocks.push({ id, is_error: false, value: Object.assign(Object.assign({}, block), { id, hash: hash$1 }) });
        }
        return { blocks: nblocks, messages: normalize_messages(messages) };
    }
    // normalize_blocks_slow ---------------------------------------------------------------------------
    // export type EBlockExt = E<BlockExt> & { id: string }
    // export function normalize_blocks_slow(blocks: Block[]): {
    //   blocks:   EBlockExt[],
    //   messages: Message[]
    // } {
    //   const messages: Messages = []
    //   const nblocks: EBlockExt[] = [], ids_map = new Set<string>()
    //   for (let i = 0; i < blocks.length; i++) {
    //     const block = blocks[i]
    //     const hash: string = block.hash || crypto.hash(to_json(block), 'md5')
    //     let id: string =
    //       (block.id !== undefined && ('' + block.id)) ||
    //       (block.title && crypto.hash(block.title, 'md5')) || hash
    //     if (ids_map.has(id)) {
    //       const fixed_id = id + i
    //       nblocks.add({ id: fixed_id, ...`Duplicate block id '${id}'`.to_error() })
    //       continue
    //     }
    //     ids_map.add(id)
    //     const found = get_block.to_safe()(block, undefined)
    //     if (found.is_error) {
    //       nblocks.add({ id, ...found })
    //       continue
    //     }
    //     if (!found.value) {
    //       nblocks.add({ id, ...`Can't find block definition`.to_error() })
    //       continue
    //     }
    //     const { name, klass, ndata } = found.value
    //     const block_ext: BlockExt = { ...block, id, hash, block_name: name, klass, ndata }
    //     nblocks.push({ id, ...block_ext.to_success() })
    //   }
    //   return { blocks: nblocks, messages: normalize_messages(messages) }
    // }
    // import { IpcRenderer, IpcMain, BrowserWindow, ipcMain } from 'electron'
    // import { port } from './config'
    // import * as node_crypto from 'crypto'
    // // flash -------------------------------------------------------------------------------------------
    // const flashUpdateTimeouts: { [key: string]: any } = {}
    // export function flash(el: HTMLElement): void {
    //   const timeout = 1500 // should be same as in CSS animation
    //   const id = el.id
    //   if (id) {
    //     // ID used when flash repeatedly triggered on the same element, before the previous flash has
    //     // been finished. Without ID such fast flashes won't work properly.
    //     // Example - frequent updates from the server changing counter.
    //     if (id in flashUpdateTimeouts) {
    //       clearTimeout(flashUpdateTimeouts[id])
    //       el.classList.remove('flash')
    //       void el.offsetWidth
    //     }
    //     el.classList.add('flash')
    //     flashUpdateTimeouts[id] = setTimeout(() => {
    //       el.classList.remove('flash')
    //       delete flashUpdateTimeouts[id]
    //     }, timeout)
    //   } else {
    //     el.classList.add('flash')
    //     setTimeout(() => el.classList.remove('flash'), timeout)
    //   }
    // }
    // binary_url ---------------------------------------------------------------------
    // export function binary_url(hash: string) { return `http://localhost:${port}/v1/binaries/${hash}` }

    /* src/apps/page/BlockContainer.svelte generated by Svelte v3.38.2 */
    const file$1 = "src/apps/page/BlockContainer.svelte";

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let div;
    	let t0_value = (/*nblock*/ ctx[2].block.title || /*nblock*/ ctx[2].block.id) + "";
    	let t0;
    	let t1;
    	let button;
    	let button_title_value;
    	let div_title_value;
    	let t2;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*is_collapsed*/ ctx[1]) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = !/*is_collapsed*/ ctx[1] && create_if_block_1$1(ctx);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(button, "class", "\n          plot-ec\n          absolute top-0 right-0\n          plot-page-controls-color focus:outline-none\n        ");
    			attr_dev(button, "title", button_title_value = /*is_collapsed*/ ctx[1] ? "Expand" : "Collapse");
    			add_location(button, file$1, 54, 6, 1393);
    			attr_dev(div, "class", "\n        plot-title font-bold\n        relative cursor-pointer\n      ");

    			attr_dev(div, "title", div_title_value = /*is_collapsed*/ ctx[1]
    			? "Click to Expand"
    			: "Click to collapse");

    			add_location(div, file$1, 44, 4, 1154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			if_block0.m(button, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*on_ec*/ ctx[3], false, false, false),
    					listen_dev(div, "click", /*on_ec*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*nblock*/ 4) && t0_value !== (t0_value = (/*nblock*/ ctx[2].block.title || /*nblock*/ ctx[2].block.id) + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			}

    			if (!current || dirty & /*is_collapsed*/ 2 && button_title_value !== (button_title_value = /*is_collapsed*/ ctx[1] ? "Expand" : "Collapse")) {
    				attr_dev(button, "title", button_title_value);
    			}

    			if (!current || dirty & /*is_collapsed*/ 2 && div_title_value !== (div_title_value = /*is_collapsed*/ ctx[1]
    			? "Click to Expand"
    			: "Click to collapse")) {
    				attr_dev(div, "title", div_title_value);
    			}

    			if (!/*is_collapsed*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*is_collapsed*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (41:2) {#if nblock.is_error}
    function create_if_block$1(ctx) {
    	let fail;
    	let current;

    	fail = new Fail({
    			props: { error: /*nblock*/ ctx[2].message },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(fail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fail_changes = {};
    			if (dirty & /*nblock*/ 4) fail_changes.error = /*nblock*/ ctx[2].message;
    			fail.$set(fail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(41:2) {#if nblock.is_error}",
    		ctx
    	});

    	return block_1;
    }

    // (66:8) {:else}
    function create_else_block_1(ctx) {
    	let html_tag;
    	let raw_value = chevron_down(bicon()) + "";
    	let html_anchor;

    	const block_1 = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(66:8) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (64:8) {#if is_collapsed}
    function create_if_block_3(ctx) {
    	let html_tag;
    	let raw_value = chevron_left(bicon()) + "";
    	let html_anchor;

    	const block_1 = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(64:8) {#if is_collapsed}",
    		ctx
    	});

    	return block_1;
    }

    // (72:4) {#if !is_collapsed}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	let if_block = /*nblock*/ ctx[2].block.desc && create_if_block_2(ctx);
    	var switch_value = /*nblock*/ ctx[2].klass;

    	function switch_props(ctx) {
    		return {
    			props: {
    				block: /*nblock*/ ctx[2].ndata,
    				is_narrow: false
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			attr_dev(div, "class", "plot-desc");
    			add_location(div, file$1, 72, 6, 1825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			insert_dev(target, t, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*nblock*/ ctx[2].block.desc) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*nblock*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const switch_instance_changes = {};
    			if (dirty & /*nblock*/ 4) switch_instance_changes.block = /*nblock*/ ctx[2].ndata;

    			if (switch_value !== (switch_value = /*nblock*/ ctx[2].klass)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(72:4) {#if !is_collapsed}",
    		ctx
    	});

    	return block_1;
    }

    // (74:8) {#if nblock.block.desc}
    function create_if_block_2(ctx) {
    	let markdown;
    	let current;

    	markdown = new Markdown({
    			props: { markdown: /*nblock*/ ctx[2].block.desc },
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(markdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(markdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const markdown_changes = {};
    			if (dirty & /*nblock*/ 4) markdown_changes.markdown = /*nblock*/ ctx[2].block.desc;
    			markdown.$set(markdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(markdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(74:8) {#if nblock.block.desc}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_id_value;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nblock*/ ctx[2].is_error) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "id", div_id_value = "block_" + /*block*/ ctx[0].id);
    			attr_dev(div, "class", "plot-block-container");
    			add_location(div, file$1, 39, 0, 1023);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*block*/ 1 && div_id_value !== (div_id_value = "block_" + /*block*/ ctx[0].id)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function bicon() {
    	return "h-5 w-5 p-0.5";
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BlockContainer", slots, []);
    	
    	
    	let { block } = $$props;
    	let { is_collapsed } = $$props;
    	let { switch_collapsed } = $$props;

    	function on_ec(event) {
    		event.preventDefault();
    		event.stopPropagation();
    		switch_collapsed(block.id);
    	}

    	let nblock;
    	const writable_props = ["block", "is_collapsed", "switch_collapsed"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BlockContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_collapsed" in $$props) $$invalidate(1, is_collapsed = $$props.is_collapsed);
    		if ("switch_collapsed" in $$props) $$invalidate(4, switch_collapsed = $$props.switch_collapsed);
    	};

    	$$self.$capture_state = () => ({
    		icons,
    		Fail,
    		Markdown,
    		get_block,
    		block,
    		is_collapsed,
    		switch_collapsed,
    		on_ec,
    		nblock,
    		bicon
    	});

    	$$self.$inject_state = $$props => {
    		if ("block" in $$props) $$invalidate(0, block = $$props.block);
    		if ("is_collapsed" in $$props) $$invalidate(1, is_collapsed = $$props.is_collapsed);
    		if ("switch_collapsed" in $$props) $$invalidate(4, switch_collapsed = $$props.switch_collapsed);
    		if ("nblock" in $$props) $$invalidate(2, nblock = $$props.nblock);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*block*/ 1) {
    			// Getting block impl and normalizing data
    			{
    				if (block.is_error) {
    					$$invalidate(2, nblock = block);
    				} else {
    					const found = get_block.to_safe()(block.value, undefined);

    					if (found.is_error) {
    						$$invalidate(2, nblock = found);
    					} else {
    						if (!found.value) {
    							$$invalidate(2, nblock = {
    								is_error: true,
    								message: "Can't find block definition"
    							});
    						} else {
    							const { name, klass, ndata } = found.value;

    							$$invalidate(2, nblock = {
    								is_error: false,
    								block: block.value,
    								ndata,
    								block_name: name,
    								klass
    							});
    						}
    					}
    				}
    			}
    		}
    	};

    	return [block, is_collapsed, nblock, on_ec, switch_collapsed];
    }

    class BlockContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, not_equal, {
    			block: 0,
    			is_collapsed: 1,
    			switch_collapsed: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlockContainer",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*block*/ ctx[0] === undefined && !("block" in props)) {
    			console.warn("<BlockContainer> was created without expected prop 'block'");
    		}

    		if (/*is_collapsed*/ ctx[1] === undefined && !("is_collapsed" in props)) {
    			console.warn("<BlockContainer> was created without expected prop 'is_collapsed'");
    		}

    		if (/*switch_collapsed*/ ctx[4] === undefined && !("switch_collapsed" in props)) {
    			console.warn("<BlockContainer> was created without expected prop 'switch_collapsed'");
    		}
    	}

    	get block() {
    		throw new Error("<BlockContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<BlockContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is_collapsed() {
    		throw new Error("<BlockContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is_collapsed(value) {
    		throw new Error("<BlockContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get switch_collapsed() {
    		throw new Error("<BlockContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set switch_collapsed(value) {
    		throw new Error("<BlockContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/apps/page/PageImpl.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1 } = globals;
    const file = "src/apps/page/PageImpl.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (37:2) {#if data.title}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*data*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "plot-title");
    			add_location(div, file, 37, 4, 1095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t_value !== (t_value = /*data*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(37:2) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if data.desc}
    function create_if_block(ctx) {
    	let div;
    	let markdown;
    	let current;

    	markdown = new Markdown({
    			props: { markdown: /*data*/ ctx[0].desc },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(markdown.$$.fragment);
    			attr_dev(div, "class", "plot-desc");
    			add_location(div, file, 40, 4, 1168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(markdown, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const markdown_changes = {};
    			if (dirty & /*data*/ 1) markdown_changes.markdown = /*data*/ ctx[0].desc;
    			markdown.$set(markdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(markdown);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:2) {#if data.desc}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#each blocks as block (block.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let blockcontainer;
    	let current;

    	blockcontainer = new BlockContainer({
    			props: {
    				block: /*block*/ ctx[9],
    				is_collapsed: /*state*/ ctx[1].collapsed[/*block*/ ctx[9].id],
    				switch_collapsed: /*switch_collapsed*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(blockcontainer.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(blockcontainer, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const blockcontainer_changes = {};
    			if (dirty & /*blocks*/ 4) blockcontainer_changes.block = /*block*/ ctx[9];
    			if (dirty & /*state, blocks*/ 6) blockcontainer_changes.is_collapsed = /*state*/ ctx[1].collapsed[/*block*/ ctx[9].id];
    			blockcontainer.$set(blockcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blockcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blockcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(blockcontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(46:4) {#each blocks as block (block.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let messagesimpl;
    	let t3;
    	let brand;
    	let div1_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*data*/ ctx[0].title && create_if_block_1(ctx);
    	let if_block1 = /*data*/ ctx[0].desc && create_if_block(ctx);
    	let each_value = /*blocks*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*block*/ ctx[9].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	messagesimpl = new Messages({
    			props: { messages: /*messages*/ ctx[3] },
    			$$inline: true
    		});

    	brand = new Brand({ props: { is_main: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(messagesimpl.$$.fragment);
    			t3 = space();
    			create_component(brand.$$.fragment);
    			attr_dev(div0, "class", "blocks");
    			add_location(div0, file, 44, 2, 1252);
    			attr_dev(div1, "class", div1_class_value = "plot-page plot-style-" + /*style*/ ctx[4]);
    			add_location(div1, file, 35, 0, 969);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t2);
    			mount_component(messagesimpl, div1, null);
    			append_dev(div1, t3);
    			mount_component(brand, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*data*/ ctx[0].desc) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*data*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*blocks, state, switch_collapsed*/ 38) {
    				each_value = /*blocks*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}

    			const messagesimpl_changes = {};
    			if (dirty & /*messages*/ 8) messagesimpl_changes.messages = /*messages*/ ctx[3];
    			messagesimpl.$set(messagesimpl_changes);

    			if (!current || dirty & /*style*/ 16 && div1_class_value !== (div1_class_value = "plot-page plot-style-" + /*style*/ ctx[4])) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(messagesimpl.$$.fragment, local);
    			transition_in(brand.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(messagesimpl.$$.fragment, local);
    			transition_out(brand.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(messagesimpl);
    			destroy_component(brand);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const definition = {
    	match_and_normalize: data => {
    		if (is_object(data) && "page" in data) return data;
    	}
    };

    function instance($$self, $$props, $$invalidate) {
    	let noptions;
    	let blocks;
    	let messages;
    	let style;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PageImpl", slots, []);
    	
    	
    	
    	let { default_title } = $$props;
    	let { data } = $$props;
    	let state = { collapsed: {}, show_controls: false };

    	function switch_collapsed(block_id) {
    		if (block_id in state.collapsed) delete state.collapsed[block_id]; else $$invalidate(1, state.collapsed[block_id] = true, state);
    		$$invalidate(1, state = Object.assign({}, state));
    	}

    	const writable_props = ["default_title", "data"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PageImpl> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, state = { ...state, show_controls: true });

    	$$self.$$set = $$props => {
    		if ("default_title" in $$props) $$invalidate(6, default_title = $$props.default_title);
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		definition,
    		normalize_blocks_slow,
    		Markdown,
    		Brand,
    		MessagesImpl: Messages,
    		Fail,
    		BlockContainer,
    		default_title,
    		data,
    		state,
    		switch_collapsed,
    		noptions,
    		blocks,
    		messages,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ("default_title" in $$props) $$invalidate(6, default_title = $$props.default_title);
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("state" in $$props) $$invalidate(1, state = $$props.state);
    		if ("noptions" in $$props) $$invalidate(7, noptions = $$props.noptions);
    		if ("blocks" in $$props) $$invalidate(2, blocks = $$props.blocks);
    		if ("messages" in $$props) $$invalidate(3, messages = $$props.messages);
    		if ("style" in $$props) $$invalidate(4, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 1) {
    			// Normalising
    			$$invalidate(7, noptions = normalize_blocks_slow(data.page));
    		}

    		if ($$self.$$.dirty & /*noptions*/ 128) {
    			$$invalidate(2, blocks = noptions.blocks);
    		}

    		if ($$self.$$.dirty & /*noptions*/ 128) {
    			$$invalidate(3, messages = noptions.messages);
    		}

    		if ($$self.$$.dirty & /*data, default_title*/ 65) {
    			{
    				document.title = data.title || "id" in data && "" + data.id || default_title || "PLOT";
    			}
    		}

    		if ($$self.$$.dirty & /*data*/ 1) {
    			$$invalidate(4, style = data.style || "normal");
    		}
    	};

    	return [
    		data,
    		state,
    		blocks,
    		messages,
    		style,
    		switch_collapsed,
    		default_title,
    		noptions,
    		click_handler
    	];
    }

    class PageImpl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, not_equal, { default_title: 6, data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageImpl",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*default_title*/ ctx[6] === undefined && !("default_title" in props)) {
    			console.warn("<PageImpl> was created without expected prop 'default_title'");
    		}

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<PageImpl> was created without expected prop 'data'");
    		}
    	}

    	get default_title() {
    		throw new Error("<PageImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set default_title(value) {
    		throw new Error("<PageImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<PageImpl>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<PageImpl>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var PageImpl$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': PageImpl,
        definition: definition
    });

    // Any otherwise rollup complains
    plot_config.apps.page = PageImpl$1;
    // plot_api ----------------------------------------------------------------------------------------
    plot_api.run = run;
    // run ---------------------------------------------------------------------------------------------
    async function run(args) {
        try {
            let data, extension = undefined, default_title = undefined;
            let data_el = document.getElementById('data');
            if (args && ('data' in args)) {
                data = args.data;
            }
            else if (data_el) {
                extension = data_el.getAttribute('type');
                if (!extension)
                    throw `can't get data type on data script with id 'data'`;
                const content = data_el.innerHTML;
                data = await parse_data(content, extension);
            }
            else {
                const data_url = get_app_data_url();
                default_title = data_url.split('/').last().replace(/\.[^\.]+$/, '');
                extension = get_extension(data_url);
                data = await load_data(data_url);
            }
            // Loading custom CSS if present
            if (is_object(data) && data.css_url)
                await ensure_loaded([data.css_url], 'parallel');
            // Getting block impl
            const block = get_block(data, extension);
            if (block) {
                // Block found
                document.body.classList.add(`plot-single-body`);
                new SingleImpl({ target: document.body, props: {
                        default_title, block_name: block.name, data: block.ndata, block_impl: block.klass
                    } });
            }
            else {
                // Getting app impl
                const app = get_app(data);
                if (app) {
                    // App found
                    document.body.classList.add(`plot-${app.name}-body`);
                    new app.klass({ target: document.body, props: {
                            default_title, data: app.ndata
                        } });
                }
                else {
                    throw "can't find block or app";
                }
            }
        }
        catch (error) {
            console.error(error);
            new Fail({ target: document.body, props: { error } });
        }
    }
    // get_app -----------------------------------------------------------------------------------------
    function get_app(app) {
        if (app === null || app === undefined)
            return;
        if (is_object(app)) {
            const data = app;
            // Checking explicit app and version if specified
            if (data.app) {
                if (!(is_array(data.app) && data.app.length == 2)) {
                    throw `invalid app, it should be \`app: [app_name, ${version}]\``;
                }
                const name = data.app[0];
                const { definition, default: klass } = plot_config.apps[name];
                const ndata = definition.match_and_normalize(data);
                if (!ndata)
                    throw `Data not matching '${name}' app`;
                return { name, klass, ndata };
            }
            // Infering app from data
            for (const name in plot_config.apps) {
                const { definition, default: klass } = plot_config.apps[name];
                const ndata = definition.match_and_normalize(data);
                if (ndata)
                    return { name, klass, ndata };
            }
        }
    }
    // -------------------------------------------------------------------------------------------------
    // Helpers -----------------------------------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------
    function get_app_data_url() {
        const url_params = new URLSearchParams(window.location.search);
        const data_url = url_params.get('data_url');
        if (data_url) {
            return data_url;
        }
        else {
            let path = window.location.pathname;
            if (!path.startsWith('/'))
                path += '/';
            const appExtensionRe = /:([^:]+)$/i;
            return path.replace(appExtensionRe, '');
        }
    }

    // Used for defer loading of the script
    const on_plot_loaded = window.on_plot_loaded;
    if (on_plot_loaded)
        on_plot_loaded();
    // function onMessage(raw: object) {
    //   if ((raw as any).type != 'updated_files') return
    //   const message = raw as UpdatedFilesMessage
    //   const updated = has(message.added || [], (f) => f.path == dataPath)
    //   if (updated) {
    //     const datap = load_data(dataPath)
    //     info(`updating ${dataPath}`)
    //     app.$set({ datap })
    //   }
    // }
    // new PubSubClient('/api-v1/pubsub', [], onMessage)

}());
//# sourceMappingURL=bundle.js.map
