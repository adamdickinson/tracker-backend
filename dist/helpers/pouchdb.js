"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unpouchDocs = exports.unpouchDoc = exports.resolveIDsToDocs = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

const resolveIDsToDocs = async ids => {
  if (!ids || !ids.length) return [];
  const results = await pouchdb.allDocs({
    include_docs: true,
    keys: ids
  });
  return results.rows.map(result => result.doc);
};

exports.resolveIDsToDocs = resolveIDsToDocs;

const unpouchDoc = doc => {
  if (!doc) return null;

  const {
    _id
  } = doc,
        data = _objectWithoutProperties(doc, ["_id"]);

  return _objectSpread({
    id: _id
  }, data);
};

exports.unpouchDoc = unpouchDoc;

const unpouchDocs = docs => docs.map(unpouchDoc);

exports.unpouchDocs = unpouchDocs;