"use strict";
/*
 * Copyright 2021 Marek Kobida
 */
Object.defineProperty(exports, "__esModule", { value: true });
function pathToRegExp(path) {
    // from "/" to "\/"
    path = path.replace(/\//, '\\/');
    // from "\/:id" to "(?:\/(?<id>[^\/]+))"
    path = path.replace(/\/:([^\/]+)/g, (..._1) => `(?:\\/(?<${_1[1]}>[^\\/]+))`);
    path = '^' + path + '\\/?' + '$';
    return new RegExp(path);
}
exports.default = pathToRegExp;
