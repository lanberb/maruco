'use strict';

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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function validateComponentName(value) {
    var _a;
    const { mode, name, words } = value;
    let tokens = [];
    /**
     * nameをtokenごとに分割
     */
    switch (mode) {
        case "pascal":
        case "camel":
            tokens = name.split(/(?=[A-Z])/);
            break;
        case "train":
        case "kebab":
            tokens = name.split("-");
            break;
        case "dot":
            tokens = name.split(".");
            break;
        case "snake":
        case "studly":
        case "allcaps":
            tokens = name.split("_");
            break;
    }
    /**
     * tokenが3単語以上になっていないか判定
     */
    if (tokens.length > 3) {
        return "failure";
    }
    /**
     * 文体のチェック
     */
    switch (mode) {
        case "pascal": {
            const regex = new RegExp(/^[A-Z][a-z]+$/);
            const isFailure = tokens.some((token) => !regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        case "camel": {
            const firstToken = (_a = tokens.shift()) !== null && _a !== undefined ? _a : "";
            const firstTokenRegex = new RegExp(/^[a-z]+$/);
            const isFailureToken = firstTokenRegex.test(firstToken) === false;
            if (isFailureToken) {
                return "failure";
            }
            const restTokensRegex = new RegExp(/^[A-Z][a-z]+$/);
            const isRestTokensFailure = tokens.some((token) => !restTokensRegex.test(token));
            if (isRestTokensFailure) {
                return "failure";
            }
            break;
        }
        case "train": {
            const regex = new RegExp(/^[A-Z][a-z]+$/);
            const isFailure = tokens.every((token) => regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        case "kebab": {
            const regex = new RegExp(/^[a-z]+$/);
            const isFailure = tokens.every((token) => regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        case "dot": {
            const regex = new RegExp(/^[a-zA-Z]+$/);
            const isFailure = tokens.every((token) => regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        case "snake": {
            const regex = new RegExp(/^[a-z]+$/);
            const isFailure = tokens.every((token) => regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        case "studly": {
            const regex = new RegExp(/^[A-Z][a-z]+$/);
            const isFailure = tokens.every((token) => regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        case "allcaps": {
            const regex = new RegExp(/^[A-Z]+$/);
            const isFailure = tokens.every((token) => regex.test(token));
            if (isFailure) {
                return "failure";
            }
            break;
        }
        default:
            return "failure";
    }
    /**
     * 単語のチェック
     */
    if (words.primary.includes(tokens[0]) === false) {
        // console.log(words.primary, tokens[0], words.primary.includes(tokens[0]));
        return "failure";
    }
    if ([...words.secondary, ...words.tertiary].includes(tokens[1]) === false) {
        return "failure";
    }
    if (tokens[2] != null) {
        if (words.secondary.includes(tokens[2]) === false) {
            return "failure";
        }
    }
    return "success";
}

const CLIENT_STORAGE_INITIAL_VALUE = {
    mode: "pascal",
    words: {
        primary: [],
        secondary: [],
        tertiary: [],
    },
};
const createValue = (value) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return Object.assign(Object.assign(Object.assign({}, CLIENT_STORAGE_INITIAL_VALUE), value), { words: Object.assign(Object.assign(Object.assign({}, CLIENT_STORAGE_INITIAL_VALUE.words), ((_a = value.words) !== null && _a !== undefined ? _a : {})), { primary: [
                ...CLIENT_STORAGE_INITIAL_VALUE.words.primary,
                ...((_c = (_b = value.words) === null || _b === undefined ? undefined : _b.primary) !== null && _c !== undefined ? _c : []),
            ], secondary: [
                ...CLIENT_STORAGE_INITIAL_VALUE.words.secondary,
                ...((_e = (_d = value.words) === null || _d === undefined ? undefined : _d.secondary) !== null && _e !== undefined ? _e : []),
            ], tertiary: [
                ...CLIENT_STORAGE_INITIAL_VALUE.words.tertiary,
                ...((_g = (_f = value.words) === null || _f === undefined ? undefined : _f.tertiary) !== null && _g !== undefined ? _g : []),
            ] }) });
};
const createWords = (value) => {
    return Array.from(new Set(value)).filter((t) => t !== "");
};

const CLIENT_STORAGE_KEY = `name-ruler-${figma.fileKey}`;
function main() {
    return __awaiter(this, undefined, undefined, function* () {
        figma.skipInvisibleInstanceChildren = true;
        figma.showUI(__html__, {
            width: 400,
            height: 360,
            // height: 400,
            themeColors: true,
        });
        const savedValue = yield figma.clientStorage.getAsync(CLIENT_STORAGE_KEY);
        const value = createValue(savedValue == null ? {} : savedValue);
        switch (figma.command) {
            case "run": {
                figma.ui.postMessage({
                    type: "setViewMode",
                    data: "logging",
                });
                const allNodes = figma.currentPage.findAll();
                const targetNodes = allNodes.filter((node) => {
                    var _a;
                    return (node.type === "COMPONENT_SET" ||
                        (node.type === "COMPONENT" && ((_a = node.parent) === null || _a === undefined ? undefined : _a.type) !== "COMPONENT_SET"));
                });
                const result = targetNodes.map(({ id, name }) => {
                    return {
                        id,
                        name,
                        status: validateComponentName(Object.assign(Object.assign({}, value), { name })),
                    };
                });
                figma.ui.postMessage({
                    type: "allNodesBeforeLinting",
                    data: result,
                });
                figma.notify("チェックが実行されました");
                break;
            }
            case "setting":
                figma.ui.postMessage({
                    type: "setViewMode",
                    data: "setting",
                });
                break;
        }
    });
}
main();
figma.once("run", () => __awaiter(undefined, undefined, undefined, function* () {
    const savedValue = yield figma.clientStorage.getAsync(CLIENT_STORAGE_KEY);
    const value = createValue(savedValue == null ? {} : savedValue);
    figma.ui.postMessage({
        type: "run",
        data: value,
    });
}));
figma.ui.on("message", (msg) => __awaiter(undefined, undefined, undefined, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const savedValue = yield figma.clientStorage.getAsync(CLIENT_STORAGE_KEY);
    let value = createValue(savedValue == null ? {} : savedValue);
    switch (msg.type) {
        case "update": {
            const data = msg.data;
            value = createValue(Object.assign(Object.assign({}, savedValue), { mode: (_a = data.mode) !== null && _a !== undefined ? _a : savedValue.mode, words: {
                    primary: createWords((_c = (_b = data.words) === null || _b === undefined ? undefined : _b.primary) !== null && _c !== undefined ? _c : []),
                    secondary: createWords((_e = (_d = data.words) === null || _d === undefined ? undefined : _d.secondary) !== null && _e !== undefined ? _e : []),
                    tertiary: createWords((_g = (_f = data.words) === null || _f === undefined ? undefined : _f.tertiary) !== null && _g !== undefined ? _g : []),
                } }));
            break;
        }
        case "zoomNodeById": {
            const data = msg.data;
            const node = yield figma.getNodeByIdAsync(data);
            if (node != null) {
                figma.viewport.scrollAndZoomIntoView([node]);
            }
            else {
                figma.notify("選択したNodeが発見できませんでした");
            }
            break;
        }
    }
    try {
        yield figma.clientStorage.setAsync(CLIENT_STORAGE_KEY, value);
        figma.notify("データが保存されました");
    }
    catch (_h) {
        figma.notify("データが保存できませんでした");
    }
    figma.ui.postMessage({
        type: "response",
        data: value,
    });
}));
