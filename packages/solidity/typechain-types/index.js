"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test__factory = exports.Swapper__factory = exports.Lock__factory = exports.IntegrationUniswapV3__factory = exports.IntegrationUniswapV2__factory = exports.IntegrationKyberClassic__factory = exports.IDMMExchangeRouter__factory = exports.IntegrationBalancer__factory = exports.ArbRoleManager__factory = exports.ArbMoneyManager__factory = exports.IUniswapV2Router02__factory = exports.IUniswapV2Router01__factory = exports.IERC165__factory = exports.ERC165__factory = exports.IERC20__factory = exports.IAccessControl__factory = exports.AccessControl__factory = exports.factories = void 0;
exports.factories = __importStar(require("./factories"));
var AccessControl__factory_1 = require("./factories/@openzeppelin/contracts/access/AccessControl__factory");
Object.defineProperty(exports, "AccessControl__factory", { enumerable: true, get: function () { return AccessControl__factory_1.AccessControl__factory; } });
var IAccessControl__factory_1 = require("./factories/@openzeppelin/contracts/access/IAccessControl__factory");
Object.defineProperty(exports, "IAccessControl__factory", { enumerable: true, get: function () { return IAccessControl__factory_1.IAccessControl__factory; } });
var IERC20__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/IERC20__factory");
Object.defineProperty(exports, "IERC20__factory", { enumerable: true, get: function () { return IERC20__factory_1.IERC20__factory; } });
var ERC165__factory_1 = require("./factories/@openzeppelin/contracts/utils/introspection/ERC165__factory");
Object.defineProperty(exports, "ERC165__factory", { enumerable: true, get: function () { return ERC165__factory_1.ERC165__factory; } });
var IERC165__factory_1 = require("./factories/@openzeppelin/contracts/utils/introspection/IERC165__factory");
Object.defineProperty(exports, "IERC165__factory", { enumerable: true, get: function () { return IERC165__factory_1.IERC165__factory; } });
var IUniswapV2Router01__factory_1 = require("./factories/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01__factory");
Object.defineProperty(exports, "IUniswapV2Router01__factory", { enumerable: true, get: function () { return IUniswapV2Router01__factory_1.IUniswapV2Router01__factory; } });
var IUniswapV2Router02__factory_1 = require("./factories/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02__factory");
Object.defineProperty(exports, "IUniswapV2Router02__factory", { enumerable: true, get: function () { return IUniswapV2Router02__factory_1.IUniswapV2Router02__factory; } });
var ArbMoneyManager__factory_1 = require("./factories/contracts/ArbMoneyManager__factory");
Object.defineProperty(exports, "ArbMoneyManager__factory", { enumerable: true, get: function () { return ArbMoneyManager__factory_1.ArbMoneyManager__factory; } });
var ArbRoleManager__factory_1 = require("./factories/contracts/ArbRoleManager__factory");
Object.defineProperty(exports, "ArbRoleManager__factory", { enumerable: true, get: function () { return ArbRoleManager__factory_1.ArbRoleManager__factory; } });
var IntegrationBalancer__factory_1 = require("./factories/contracts/IntegrationBalancer__factory");
Object.defineProperty(exports, "IntegrationBalancer__factory", { enumerable: true, get: function () { return IntegrationBalancer__factory_1.IntegrationBalancer__factory; } });
var IDMMExchangeRouter__factory_1 = require("./factories/contracts/IntegrationKyberClassic.sol/IDMMExchangeRouter__factory");
Object.defineProperty(exports, "IDMMExchangeRouter__factory", { enumerable: true, get: function () { return IDMMExchangeRouter__factory_1.IDMMExchangeRouter__factory; } });
var IntegrationKyberClassic__factory_1 = require("./factories/contracts/IntegrationKyberClassic.sol/IntegrationKyberClassic__factory");
Object.defineProperty(exports, "IntegrationKyberClassic__factory", { enumerable: true, get: function () { return IntegrationKyberClassic__factory_1.IntegrationKyberClassic__factory; } });
var IntegrationUniswapV2__factory_1 = require("./factories/contracts/IntegrationUniswapV2__factory");
Object.defineProperty(exports, "IntegrationUniswapV2__factory", { enumerable: true, get: function () { return IntegrationUniswapV2__factory_1.IntegrationUniswapV2__factory; } });
var IntegrationUniswapV3__factory_1 = require("./factories/contracts/IntegrationUniswapV3__factory");
Object.defineProperty(exports, "IntegrationUniswapV3__factory", { enumerable: true, get: function () { return IntegrationUniswapV3__factory_1.IntegrationUniswapV3__factory; } });
var Lock__factory_1 = require("./factories/contracts/Lock__factory");
Object.defineProperty(exports, "Lock__factory", { enumerable: true, get: function () { return Lock__factory_1.Lock__factory; } });
var Swapper__factory_1 = require("./factories/contracts/Swapper__factory");
Object.defineProperty(exports, "Swapper__factory", { enumerable: true, get: function () { return Swapper__factory_1.Swapper__factory; } });
var Test__factory_1 = require("./factories/contracts/Test__factory");
Object.defineProperty(exports, "Test__factory", { enumerable: true, get: function () { return Test__factory_1.Test__factory; } });
