"use strict";
/*
 * Copyright 2021 Marek Kobida
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(require("./Route"));
class Router {
    constructor() {
        this.#routes = [];
    }
    #routes;
    addRoute(path) {
        const route = new Route_1.default(path);
        this.#routes.push(route);
        return route;
    }
    async test(context, method, url) {
        for (const route of this.#routes) {
            if (await route.test(context, method, url)) {
                return true;
            }
        }
        return false;
    }
}
exports.default = Router;