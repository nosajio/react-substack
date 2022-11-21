import { useRef, useState, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var NodeType;
(function (NodeType) {
    NodeType["PARAGRAPH"] = "paragraph";
    NodeType["IMAGE"] = "image";
    NodeType["VIDEO"] = "video";
    NodeType["HR"] = "hr";
    NodeType["HEADING"] = "heading";
})(NodeType || (NodeType = {}));

var newParagraph = function (el) {
    var contents = el.innerHTML;
    if (!contents)
        return undefined;
    return {
        type: NodeType.PARAGRAPH,
        contents: contents,
    };
};
var newImage = function (el) {
    var imgEl = el.querySelector('img');
    var src = imgEl === null || imgEl === void 0 ? void 0 : imgEl.getAttribute('src');
    if (!src)
        return undefined;
    var captionEl = el.querySelector('figcaption');
    var caption = captionEl ? captionEl.innerHTML : undefined;
    return {
        type: NodeType.IMAGE,
        src: src,
        caption: caption,
    };
};
var newHeading = function (el) {
    var level = parseInt(el.nodeName[1]);
    var contents = el.innerHTML;
    if (!contents)
        return undefined;
    return {
        type: NodeType.HEADING,
        level: level,
        contents: contents,
    };
};
var newHr = function () {
    return {
        type: NodeType.HR,
    };
};
var parseCDATA = function () {
    var rawStr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rawStr[_i] = arguments[_i];
    }
    var exp = /!\[CDATA\[(.+)\]\]/s;
    return rawStr.map(function (s) {
        var m = exp.exec(s);
        if (!m || m.length < 2) {
            // console.error('No CDATA on string %s', s);
            return '';
        }
        return m[1].trim();
    });
};
/**
 * Take a parsed node list and re-compose a HTML string. This is handy for
 * injecting a post's HTML directly with dangerouslySetHTML.
 */
var recomposeHTML = function (nodes) {
    return nodes
        .map(function (n) {
        switch (n.type) {
            case NodeType.PARAGRAPH:
                return "<p>".concat(n.contents, "</p>");
            case NodeType.HEADING:
                return "<h".concat(n.level, ">").concat(n.contents, "</h").concat(n.level, ">");
            case NodeType.IMAGE:
                return "<figure class=\"post-image\"><img src=\"".concat(n.src, "\"/>").concat(n.caption ? "<figcaption>".concat(n.caption, "</figcaption>") : '', "</figure>");
            case NodeType.HR:
                return '<hr />';
            default:
                return '';
        }
    })
        .join('\n');
};
var parseBody = function (rawBodyHTML) {
    var dom = new DOMParser().parseFromString(rawBodyHTML, 'text/html');
    var units = Array.from(dom.body.children);
    var bodyRaw = units.map(function (el) {
        var _a;
        switch (el.tagName) {
            case 'P':
                return newParagraph(el);
            case 'DIV': {
                if (el.classList.contains('captioned-image-container')) {
                    return newImage(el);
                }
                if (((_a = el.children) === null || _a === void 0 ? void 0 : _a[0]) && el.children[0].tagName === 'HR') {
                    return newHr();
                }
                return undefined;
            }
            default: {
                if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
                    return newHeading(el);
                }
                return undefined;
            }
        }
    });
    // Remove all undefined elements from map
    var nodes = bodyRaw.filter(Boolean);
    // Recompose natural HTML
    var html = recomposeHTML(nodes);
    return {
        nodes: nodes,
        html: html,
    };
};
var getSlugFromUrl = function (url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    var parts = url.split('/');
    return parts[parts.length - 1];
};
var parseItemElement = function (el) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var titleRaw = (_b = (_a = el.querySelector('title')) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : '';
    var descriptionRaw = (_d = (_c = el.querySelector('description')) === null || _c === void 0 ? void 0 : _c.innerHTML) !== null && _d !== void 0 ? _d : '';
    var linkRaw = (_f = (_e = el.querySelector('link')) === null || _e === void 0 ? void 0 : _e.innerHTML) !== null && _f !== void 0 ? _f : '';
    var pubDateRaw = (_h = (_g = el.querySelector('pubDate')) === null || _g === void 0 ? void 0 : _g.innerHTML) !== null && _h !== void 0 ? _h : '';
    var cover = ((_j = el.querySelector('enclosure')) === null || _j === void 0 ? void 0 : _j.getAttribute('url')) || undefined;
    var slug = getSlugFromUrl(linkRaw);
    // These coalescing selectors are necessary to make tests pass. For some reason
    // jsdom needs the namespace (string before the colon), while browsers don't
    // seem to care.
    var creatorRaw = (_o = (_l = (_k = el.querySelector('creator')) === null || _k === void 0 ? void 0 : _k.innerHTML) !== null && _l !== void 0 ? _l : (_m = el.querySelector('dc\\:creator')) === null || _m === void 0 ? void 0 : _m.innerHTML) !== null && _o !== void 0 ? _o : '';
    var contentRaw = (_s = (_q = (_p = el.querySelector('encoded')) === null || _p === void 0 ? void 0 : _p.innerHTML) !== null && _q !== void 0 ? _q : (_r = el.querySelector('content\\:encoded')) === null || _r === void 0 ? void 0 : _r.innerHTML) !== null && _s !== void 0 ? _s : '';
    var _t = parseCDATA(titleRaw, descriptionRaw, creatorRaw, contentRaw), title = _t[0], description = _t[1], author = _t[2], content = _t[3];
    var _u = parseBody(content), body = _u.nodes, bodyHTML = _u.html;
    return {
        slug: slug,
        title: title,
        description: description,
        author: author,
        pubdate: pubDateRaw,
        link: linkRaw,
        cover: cover,
        bodyHTML: bodyHTML,
        body: body,
    };
};

/**
 * Parse a feed XML string into a JSON data structure
 */
var parseFeed = function (feed, subdomain) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var dom = new DOMParser().parseFromString(feed, 'text/xml');
    var url = (_b = (_a = dom.querySelector('channel > link')) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : '';
    var titleRaw = (_d = (_c = dom.querySelector('channel > title')) === null || _c === void 0 ? void 0 : _c.innerHTML) !== null && _d !== void 0 ? _d : '';
    var aboutRaw = (_f = (_e = dom.querySelector('channel > description')) === null || _e === void 0 ? void 0 : _e.innerHTML) !== null && _f !== void 0 ? _f : '';
    var image = (_h = (_g = dom.querySelector('channel > image > url')) === null || _g === void 0 ? void 0 : _g.innerHTML) !== null && _h !== void 0 ? _h : '';
    var items = Array.from(dom.querySelectorAll('channel > item'));
    var posts = items.map(parseItemElement);
    var _j = parseCDATA(aboutRaw, titleRaw), about = _j[0], title = _j[1];
    return {
        about: about,
        title: title,
        image: image,
        posts: posts,
        subdomain: subdomain,
        url: url,
    };
};

var proxyBaseUrl = 'http://localhost:3909';
var proxyUrl = function (subdomain) { return "".concat(proxyBaseUrl, "/").concat(subdomain); };
/**
 * Get the raw XML feed for any substack
 */
var getFeed = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(url, {
                    mode: 'cors',
                })];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.text()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var getAndParseSubstack = function (subdomain) { return __awaiter(void 0, void 0, void 0, function () {
    var url, feed, substack;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = proxyUrl(subdomain);
                return [4 /*yield*/, getFeed(url)];
            case 1:
                feed = _a.sent();
                substack = parseFeed(feed, subdomain);
                return [2 /*return*/, substack];
        }
    });
}); };

/**
 * Returns any substack newsletter as JSON
 */
var useSubstack = function (subdomain) {
    var requestLock = useRef(false);
    var _a = useState(), substack = _a[0], setSubstack = _a[1];
    var _b = useState(), error = _b[0], setError = _b[1];
    var _c = useState('ready'), state = _c[0], setState = _c[1];
    useEffect(function () {
        if (state === 'loading' || requestLock.current) {
            return;
        }
        if (subdomain === '') {
            setError('A valid substack subdomain is required');
            return;
        }
        var getSubstack = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestLock.current = true;
                        setState('loading');
                        return [4 /*yield*/, getAndParseSubstack(subdomain)];
                    case 1:
                        result = _a.sent();
                        setSubstack(result);
                        setState('data');
                        return [2 /*return*/];
                }
            });
        }); };
        getSubstack();
    }, [state, subdomain]);
    return __assign(__assign({}, substack), { state: error ? 'error' : state, error: error });
};
/**
 * Returns a single post from a substack newsletter
 */
var usePost = function (subdomain, slug) {
    var substack = useSubstack(subdomain);
    var _a = useState(), post = _a[0], setPost = _a[1];
    var _b = useState(), error = _b[0], setError = _b[1];
    useEffect(function () {
        if (!Array.isArray(substack === null || substack === void 0 ? void 0 : substack.posts) || substack.posts.length === 0) {
            return;
        }
        var foundPost = substack.posts.find(function (p) { return p.slug === slug; });
        if (!foundPost) {
            setError('Post not found');
            return;
        }
        setPost(foundPost);
    }, [slug, substack.posts]);
    var errorState = error || substack.error;
    var state = errorState ? 'error' : post === undefined ? 'loading' : 'data';
    return {
        post: post,
        state: state,
        error: errorState,
    };
};

export { NodeType, usePost, useSubstack };
//# sourceMappingURL=index.js.map
