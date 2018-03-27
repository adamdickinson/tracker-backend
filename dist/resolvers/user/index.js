"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.currentUser = void 0;

var athlete = _interopRequireWildcard(require("./athlete"));

var coach = _interopRequireWildcard(require("./coach"));

var guest = _interopRequireWildcard(require("./guest"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const currentUser = () => ({
  id: "Coach:adamdickinson",
  firstName: "Adam",
  lastName: "Dickinson",
  position: "Coach"
});

exports.currentUser = currentUser;

var _default = _objectSpread({}, athlete, coach, guest, {
  currentUser
});

exports.default = _default;