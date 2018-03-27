"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepFreeze = _interopRequireDefault(require("deep-freeze"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _deepFreeze.default)([{
  _id: "Test:beep",
  name: "Beep Test",
  resultType: "STAGE_SHUTTLE",
  groupTest: true
}, {
  _id: "Test:agility",
  name: "Agility Test",
  resultType: "TIME",
  groupTest: false
}, {
  _id: "Test:lane-agility",
  name: "Lane Agility Drill",
  resultType: "TIME",
  groupTest: false
}, {
  _id: "Test:speed",
  name: "Speed Test",
  resultType: "TIME",
  groupTest: false
}, {
  _id: "Test:time-trial-2km",
  variation: "2 kilometers",
  name: "Time Trial",
  resultType: "TIME",
  groupTest: true
}, {
  _id: "Test:time-trial-3km",
  variation: "3 kilometers",
  name: "Time Trial",
  resultType: "TIME",
  groupTest: true
}, {
  _id: "Test:time-trial-5km",
  variation: "5 kilometers",
  name: "Time Trial",
  resultType: "TIME",
  groupTest: true
}, {
  _id: "Test:vertical-leap",
  name: "Vertical Leap",
  resultType: "MEASUREMENTS",
  specs: [{
    id: "standingVerticalLeap",
    name: "Standing Vertical Leap",
    metric: "CM_FT"
  }, {
    id: "maxVerticalLeap",
    name: "Max Vertical Leap",
    metric: "CM_FT"
  }],
  groupTest: false
}, {
  _id: "Test:measurement-body",
  name: "Body Fat / Strength",
  resultType: "MEASUREMENTS",
  specs: [{
    id: "height",
    name: "Height",
    metric: "CM_FT"
  }, {
    id: "heightWithShoes",
    name: "Height (with shoes)",
    metric: "CM_FT"
  }, {
    id: "weight",
    name: "Weight",
    metric: "KG_LB"
  }, {
    id: "wingspan",
    name: "Wingspan",
    metric: "CM_FT"
  }, {
    id: "standingReach",
    name: "Standing Reach",
    metric: "CM_IN"
  }, {
    id: "bodyFat",
    name: "Body Fat",
    metric: "PERCENTAGE"
  }, {
    id: "handLength",
    name: "Hand Length",
    metric: "CM_IN"
  }, {
    id: "handWidth",
    name: "Hand Width",
    metric: "CM_IN"
  }],
  groupTest: false
}, {
  _id: "Test:shooting-free-throw",
  name: "Shooting Test",
  variation: "Free Throw",
  resultType: "SHOTS",
  groupTest: false
}, {
  _id: "Test:shooting-three-point-top-of-key",
  name: "Shooting Test",
  variation: "Three Point (Top of Key)",
  limit: {
    metric: "TIME",
    value: 30
  },
  resultType: "SHOTS",
  groupTest: false
}, {
  _id: "Test:shooting-three-point-wing",
  name: "Shooting Test",
  variation: "Three Point (Wing)",
  limit: {
    metric: "TIME",
    value: 30
  },
  resultType: "SHOTS",
  groupTest: false
}, {
  _id: "Test:shooting-three-point-baseline",
  name: "Shooting Test",
  variation: "Three Point (Baseline)",
  limit: {
    metric: "TIME",
    value: 30
  },
  resultType: "SHOTS",
  groupTest: false
}, {
  _id: "Test:shooting-elbow",
  name: "Shooting Test",
  variation: "Elbow",
  limit: {
    metric: "TIME",
    value: 30
  },
  resultType: "SHOTS",
  groupTest: false
}, {
  _id: "Test:shooting-base-line",
  name: "Shooting Test",
  variation: "Base Line",
  limit: {
    metric: "TIME",
    value: 30
  },
  resultType: "SHOTS",
  groupTest: false
}, {
  _id: "Test:shooting-45-degree",
  name: "Shooting Test",
  variation: "45 Degree",
  limit: {
    metric: "TIME",
    value: 30
  },
  resultType: "SHOTS",
  groupTest: false
}]);

exports.default = _default;