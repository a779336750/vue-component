"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isServer = Vue.prototype.$isServer;

Ktu.oneOf = function (value, validList) {
  for (var i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }

  return false;
};

Ktu.findComponentsDownward = function (context, componentName) {
  return context.$children.reduce(function (components, child) {
    if (child.$options.name === componentName) components.push(child);
    var foundChilds = Ktu.findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
};

Ktu.MutationObserver = isServer ? false : window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false;
/* istanbul ignore next */

Ktu.hasClass = function (el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');

  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

Ktu.addClass = function (el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!Ktu.hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }

  if (!el.classList) {
    el.className = curClass;
  }
};

Ktu.removeClass = function (el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (Ktu.hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }

  if (!el.classList) {
    el.className = trim(curClass);
  }
}; // Find components downward


Ktu.findComponentsDownward = function (context, componentName) {
  return context.$children.reduce(function (components, child) {
    if (child.$options.name === componentName) components.push(child);
    var foundChilds = Ktu.findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}; // Find components upward


Ktu.findComponentsUpward = function (context, componentName) {
  var parents = [];
  var parent = context.$parent;

  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(Ktu.findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}; // Find components upward


Ktu.findComponentUpward = function (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  var parent = context.$parent;
  var name = parent.$options.name;

  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }

  return parent;
}; //驼峰命名


var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
} // getStyle


Ktu.getStyle = function (element, styleName) {
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);

  if (styleName === 'float') {
    styleName = 'cssFloat';
  }

  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
}; // Thanks to
// https://github.com/andreypopp/react-textarea-autosize/


var HIDDEN_TEXTAREA_STYLE = "\n  min-height:0 !important;\n  max-height:none !important;\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n";
var SIZING_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing'];
var computedStyleCache = {};
var hiddenTextarea;

function calculateNodeStyling(node) {
  var useCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var nodeRef = node.getAttribute('id') || node.getAttribute('data-reactid') || node.getAttribute('name');

  if (useCache && computedStyleCache[nodeRef]) {
    return computedStyleCache[nodeRef];
  }

  var style = window.getComputedStyle(node);
  var boxSizing = style.getPropertyValue('box-sizing') || style.getPropertyValue('-moz-box-sizing') || style.getPropertyValue('-webkit-box-sizing');
  var paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(style.getPropertyValue('padding-top'));
  var borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(style.getPropertyValue('border-top-width'));
  var sizingStyle = SIZING_STYLE.map(function (name) {
    return "".concat(name, ":").concat(style.getPropertyValue(name));
  }).join(';');
  var nodeInfo = {
    sizingStyle: sizingStyle,
    paddingSize: paddingSize,
    borderSize: borderSize,
    boxSizing: boxSizing
  };

  if (useCache && nodeRef) {
    computedStyleCache[nodeRef] = nodeInfo;
  }

  return nodeInfo;
}

Ktu.calcTextareaHeight = function (uiTextNode) {
  var minRows = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var maxRows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var useCache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  } // Fix wrap="off" issue
  // https://github.com/ant-design/ant-design/issues/6577


  if (uiTextNode.getAttribute('wrap')) {
    hiddenTextarea.setAttribute('wrap', uiTextNode.getAttribute('wrap'));
  } else {
    hiddenTextarea.removeAttribute('wrap');
  } // Copy all CSS properties that have an impact on the height of the content in
  // the textbox


  var _calculateNodeStyling = calculateNodeStyling(uiTextNode, useCache),
      paddingSize = _calculateNodeStyling.paddingSize,
      borderSize = _calculateNodeStyling.borderSize,
      boxSizing = _calculateNodeStyling.boxSizing,
      sizingStyle = _calculateNodeStyling.sizingStyle; // Need to have the overflow attribute to hide the scrollbar otherwise
  // text-lines will not calculated properly as the shadow will technically be
  // narrower for content


  hiddenTextarea.setAttribute('style', "".concat(sizingStyle, ";").concat(HIDDEN_TEXTAREA_STYLE));
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || '';
  var minHeight = Number.MIN_SAFE_INTEGER;
  var maxHeight = Number.MAX_SAFE_INTEGER;
  var height = hiddenTextarea.scrollHeight;
  var overflowY;

  if (boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    // remove padding, since height = content
    height = height - paddingSize;
  }

  if (minRows !== null || maxRows !== null) {
    // measure height of a textarea with a single row
    hiddenTextarea.value = ' ';
    var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

    if (minRows !== null) {
      minHeight = singleRowHeight * minRows;

      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }

      height = Math.max(minHeight, height);
    }

    if (maxRows !== null) {
      maxHeight = singleRowHeight * maxRows;

      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }

      overflowY = height > maxHeight ? '' : 'hidden';
      height = Math.min(maxHeight, height);
    }
  } // Remove scroll bar flash when autosize without maxRows


  if (!maxRows) {
    overflowY = 'hidden';
  }

  return {
    height: "".concat(height, "px"),
    minHeight: "".concat(minHeight, "px"),
    maxHeight: "".concat(maxHeight, "px"),
    overflowY: overflowY
  };
};

Ktu.config = {
  router: [{
    name: '输入框 Input',
    key: 'Input'
  }, {
    name: '折叠框 Collapse',
    key: 'Collapse'
  }, {
    name: '菜单 Menu',
    key: 'Menu'
  }, {
    name: '标签页 Tabs',
    key: 'Tabs'
  }]
};
Ktu.mixins = {};
Ktu.mixins.emitter = {
  methods: {
    //广播所有名为componentName的祖先组件，促发他们的eventName事件
    dispatch: function dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    //递归广播所有名为componentName的子孙组件，促发他们的eventName事件
    emitterBroadcast: function emitterBroadcast(componentName, eventName, params) {
      this.$children.forEach(function (child) {
        var name = child.$options.name;

        if (name === componentName) {
          child.$emit.apply(child, [eventName].concat(params));
        } else {
          child.emitterBroadcast(componentName, eventName, params);
        }
      });
    }
  }
};
Vue.component('svg-gradient', {
  template: "\n        <svg class=\"svg-gradient\" display=\"none\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n\n        </svg>\n    ",
  data: function data() {
    return {
      prefixCls: "icon"
    };
  }
});
Vue.component('svg-sprite', {
  template: "\n        <hgroup class=\"svg-area\">\n            <svg-gradient></svg-gradient>\n            <svg\n                class=\"svg-sprite\"\n                display=\"none\"\n                xmlns=\"http://www.w3.org/2000/svg\"\n                version=\"1.1\"\n            >\n                <g>\n                    <symbol\n                        id=\"svg-alert-error-outline\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M516.461 20.457c-274.346 0-496.742 222.394-496.742 496.742s222.394 496.742 496.742 496.742 496.742-222.394 496.742-496.742-222.394-496.742-496.742-496.742zM516.461 964.278c-246.527 0-447.079-200.547-447.079-447.079s200.547-447.079 447.079-447.079 447.079 200.547 447.079 447.079-200.547 447.079-447.079 447.079z\"></path>\n                        <path d=\"M741.978 291.67c-12.099-12.117-31.79-12.117-43.905 0l-181.633 181.633-181.633-181.633c-12.102-12.117-31.795-12.117-43.905 0-12.117 12.102-12.117 31.79 0 43.905l181.633 181.633-181.633 181.633c-12.117 12.102-12.117 31.79 0 43.905 6.032 6.061 13.984 9.073 21.942 9.073 7.926 0 15.886-3.03 21.942-9.073l181.633-181.633 181.633 181.633c6.061 6.061 14.002 9.073 21.942 9.073s15.886-3.03 21.942-9.073c12.117-12.102 12.117-31.79 0-43.905l-181.669-181.633 181.633-181.633c12.117-12.102 12.117-31.79 0-43.905z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-alert-error\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M983.8 312.7C958 251.7 921 197 874 150c-47-47-101.7-84-162.7-109.7C648.2 13.5 581.1 0 512 0S375.8 13.5 312.7 40.3C251.7 66 197 103 150 150c-47 47-84 101.7-109.7 162.7C13.5 375.8 0 442.9 0 512s13.5 136.2 40.3 199.3C66 772.3 103 827 150 874c47 47 101.8 83.9 162.7 109.7 63.1 26.7 130.2 40.3 199.3 40.3s136.2-13.5 199.3-40.3C772.3 958 827 921 874 874c47-47 83.9-101.8 109.7-162.7 26.7-63.1 40.3-130.2 40.3-199.3s-13.5-136.2-40.2-199.3zM664.7 613.8c14.1 14.1 14.1 36.9 0 50.9-7 7-16.2 10.5-25.5 10.5s-18.4-3.5-25.5-10.5L512 562.9 410.2 664.7c-7 7-16.2 10.5-25.5 10.5s-18.4-3.5-25.5-10.5c-14.1-14.1-14.1-36.9 0-50.9L461.1 512 359.3 410.2c-14.1-14.1-14.1-36.9 0-50.9 14.1-14.1 36.9-14.1 50.9 0L512 461.1l101.8-101.8c14.1-14.1 36.9-14.1 50.9 0 14.1 14.1 14.1 36.9 0 50.9L562.9 512l101.8 101.8z\" />\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-alert-info-outline\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path\n                            d=\"M512 0C229.691077 0 0 229.671385 0 512s229.691077 512 512 512 512-229.671385 512-512S794.308923 0 512 0z m0 984.615385C251.411692 984.615385 39.384615 772.588308 39.384615 512S251.411692 39.384615 512 39.384615s472.615385 212.027077 472.615385 472.615385-212.027077 472.615385-472.615385 472.615385z\"\n                            fill=\"\"\n                            p-id=\"3330\"\n                        />\n                        <path\n                            d=\"M512 196.923077a19.692308 19.692308 0 0 0-19.692308 19.692308v433.230769a19.692308 19.692308 0 1 0 39.384616 0V216.615385a19.692308 19.692308 0 0 0-19.692308-19.692308zM512 728.615385a19.692308 19.692308 0 0 0-19.692308 19.692307v39.384616a19.692308 19.692308 0 1 0 39.384616 0v-39.384616a19.692308 19.692308 0 0 0-19.692308-19.692307z\"\n                            fill=\"\"\n                            p-id=\"3331\"\n                        />\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-alert-info\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path\n                            d=\"M511.999 95.003c-230.524 0-418.076 187.552-418.075 418.077 0 230.527 187.552 418.077 418.075 418.077s418.077-187.55 418.077-418.077c0-230.525-187.552-418.077-418.077-418.077zM512 722.12c-28.86 0-52.26-23.399-52.26-52.263 0-28.858 23.399-52.257 52.26-52.257s52.26 23.399 52.26 52.257c0 28.863-23.399 52.263-52.26 52.263zM564.26 513.078c0 28.86-23.399 52.26-52.26 52.26s-52.26-23.399-52.26-52.26l0-156.775c0-28.86 23.399-52.26 52.26-52.26s52.26 23.399 52.26 52.26l0 156.775z\"\n                            p-id=\"3488\"\n                        />\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-alert-setting\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M579.2 60.8c25.6 99.2 118.4 172.8 230.4 172.8 19.2 0 41.6-3.2 64-9.6L944 342.4c-44.8 41.6-70.4 102.4-70.4 166.4s25.6 121.6 70.4 166.4L873.6 800c-19.2-6.4-41.6-9.6-64-9.6-112 0-204.8 73.6-230.4 172.8H438.4C416 864 320 790.4 211.2 790.4c-19.2 0-41.6 3.2-64 9.6L76.8 681.6c44.8-44.8 70.4-105.6 70.4-169.6s-25.6-121.6-70.4-166.4L147.2 224c22.4 6.4 41.6 9.6 64 9.6C320 233.6 416 160 441.6 60.8h137.6zM633.6 0H390.4c0 96-80 172.8-179.2 172.8-32 0-64-9.6-89.6-22.4L0 361.6c54.4 32 89.6 86.4 89.6 150.4S54.4 633.6 0 662.4l121.6 211.2c25.6-12.8 57.6-22.4 89.6-22.4 99.2 0 179.2 76.8 179.2 172.8h243.2c0-96 80-172.8 179.2-172.8 32 0 64 9.6 89.6 22.4L1024 662.4c-54.4-32-89.6-86.4-89.6-150.4s38.4-121.6 89.6-150.4L902.4 150.4c-25.6 12.8-57.6 22.4-89.6 22.4C713.6 172.8 633.6 96 633.6 0zM512 659.2c-83.2 0-150.4-64-150.4-147.2 0-80 67.2-147.2 150.4-147.2s150.4 64 150.4 147.2c0 80-67.2 147.2-150.4 147.2z m0-236.8c-51.2 0-89.6 38.4-89.6 89.6s38.4 89.6 89.6 89.6 89.6-38.4 89.6-89.6-41.6-89.6-89.6-89.6z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-alert-success-outline\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M512 938.666667C277.333333 938.666667 85.333333 746.666667 85.333333 512 85.333333 277.333333 277.333333 85.333333 512 85.333333s426.666667 192 426.666667 426.666667C938.666667 746.666667 746.666667 938.666667 512 938.666667zM512 128C300.8 128 128 300.8 128 512c0 211.2 172.8 384 384 384 211.2 0 384-172.8 384-384C896 300.8 723.2 128 512 128zM471.466667 678.4c-8.533333 8.533333-21.333333 8.533333-29.866667 0l-151.466667-151.466667c-8.533333-8.533333-8.533333-21.333333 0-29.866667 8.533333-8.533333 21.333333-8.533333 29.866667 0l136.533333 136.533333L682.666667 405.333333c8.533333-8.533333 21.333333-8.533333 29.866667 0 8.533333 8.533333 8.533333 21.333333 0 29.866667L471.466667 678.4z\" />\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-alert-success\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path\n                            xmlns=\"http://www.w3.org/2000/svg\"\n                            d=\"M512 938.666667C277.333333 938.666667 85.333333 746.666667 85.333333 512S277.333333 85.333333 512 85.333333s426.666667 192 426.666667 426.666667-192 426.666667-426.666667 426.666667z m202.666667-537.6c-8.533333-8.533333-21.333333-8.533333-29.866667 0L452.266667 633.6l-136.533334-136.533333c-8.533333-8.533333-21.333333-8.533333-29.866666 0-8.533333 8.533333-8.533333 21.333333 0 29.866666l151.466666 151.466667c8.533333 8.533333 21.333333 8.533333 29.866667 0l247.466667-247.466667c8.533333-8.533333 8.533333-23.466667 0-29.866666z\"\n                        />\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-bottom-1\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M3.277,9.373,6.676,6l-3.4-3.373a.951.951,0,0,1,0-1.349.97.97,0,0,1,1.36,0L8.715,5.325a.952.952,0,0,1,0,1.35L4.637,10.722a.97.97,0,0,1-1.36,0A.951.951,0,0,1,3.277,9.373Z\"\n                                transform=\"translate(19 7.003) rotate(90)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-bottom-2\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(9 16) rotate(-90)\">\n                                <path d=\"M1,2H2V1H3V0H5V1H4V2H3V3H2V5H3V6H4V7H5V8H3V7H2V6H1V5H0V3H1Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-bottom-3\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(19 8.003) rotate(90)\">\n                                <path d=\"M4,4H3V3H2V2H0V3H1V4H2V5H3V7H2V8H1V9H0v1H2V9H3V8H4V7H5V5H4Z\" />\n                                <path d=\"M10,5V4H9V3H8V2H6V3H7V4H8V5H9V7H8V8H7V9H6v1H8V9H9V8h1V7h1V5Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-bottom-4\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M.467,0H7.581A.455.455,0,0,1,7.9.78l-3.534,3.9a.5.5,0,0,1-.688,0L.146.78A.455.455,0,0,1,.467,0Z\"\n                                transform=\"translate(8.985 11)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-bottom-5\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(36.003 12)\">\n                                <path d=\"M-20.5,0H-26V1h1V2h1V3h2V2h1V1h1V0Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-left-1\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M8.715,9.373,5.316,6l3.4-3.373a.951.951,0,0,0,0-1.349.97.97,0,0,0-1.36,0L3.277,5.325a.952.952,0,0,0,0,1.35l4.078,4.047a.97.97,0,0,0,1.36,0A.951.951,0,0,0,8.715,9.373Z\"\n                                transform=\"translate(7.004 7)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-left-2\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(11 9)\">\n                                <path\n                                    d=\"M4,4H5V3H6V2H8V3H7V4H6V5H5V7H6V8H7V9H8v1H6V9H5V8H4V7H3V5H4Z\"\n                                    transform=\"translate(-2.997 -2)\"\n                                />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-left-3\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(8 9)\">\n                                <path\n                                    d=\"M1,6H2V7H3V8H5V7H4V6H3V5H2V3H3V2H4V1H5V0H3V1H2V2H1V3H0V5H1Z\"\n                                    transform=\"translate(6)\"\n                                />\n                                <path d=\"M1,5V6H2V7H3V8H5V7H4V6H3V5H2V3H3V2H4V1H5V0H3V1H2V2H1V3H0V5Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-left-4\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M.452,0H7.567a.455.455,0,0,1,.321.78l-3.534,3.9a.5.5,0,0,1-.688,0L.131.78A.455.455,0,0,1,.452,0Z\"\n                                transform=\"translate(15.82 9) rotate(90)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-left-5\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(15 10) rotate(90)\">\n                                <path d=\"M5.5,0H0V1H1V2H2V3H4V2H5V1H6V0Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-right-1\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M3.277,9.373,6.676,6l-3.4-3.373a.951.951,0,0,1,0-1.349.97.97,0,0,1,1.36,0L8.715,5.325a.952.952,0,0,1,0,1.35L4.637,10.722a.97.97,0,0,1-1.36,0A.951.951,0,0,1,3.277,9.373Z\"\n                                transform=\"translate(7.003 7)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-right-2\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(8.003 7)\">\n                                <path d=\"M7,4H6V3H5V2H3V3H4V4H5V5H6V7H5V8H4V9H3v1H5V9H6V8H7V7H8V5H7Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-right-3\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(8 9)\">\n                                <path d=\"M4,6H3V7H2V8H0V7H1V6H2V5H3V3H2V2H1V1H0V0H2V1H3V2H4V3H5V5H4Z\" />\n                                <path\n                                    d=\"M4,5V6H3V7H2V8H0V7H1V6H2V5H3V3H2V2H1V1H0V0H2V1H3V2H4V3H5V5Z\"\n                                    transform=\"translate(6)\"\n                                />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-right-4\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M.452,4.819H7.567a.455.455,0,0,0,.321-.78L4.354.138a.5.5,0,0,0-.688,0L.131,4.039A.455.455,0,0,0,.452,4.819Z\"\n                                transform=\"translate(15.82 9) rotate(90)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-right-5\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(15 10) rotate(90)\">\n                                <path\n                                    d=\"M-20.5,3H-26V2h1V1h1V0h2V1h1V2h1V3Z\"\n                                    transform=\"translate(26.003)\"\n                                />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-top-1\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M3.277,9.373,6.676,6l-3.4-3.373a.951.951,0,0,1,0-1.349.97.97,0,0,1,1.36,0L8.715,5.325a.952.952,0,0,1,0,1.35L4.637,10.722a.97.97,0,0,1-1.36,0A.951.951,0,0,1,3.277,9.373Z\"\n                                transform=\"translate(7 18.995) rotate(-90)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-top-2\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(17 11) rotate(90)\">\n                                <path d=\"M1,6H2V7H3V8H5V7H4V6H3V5H2V3H3V2H4V1H5V0H3V1H2V2H1V3H0V5H1Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-top-3\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(9 19) rotate(-90)\">\n                                <path d=\"M4,6H3V7H2V8H0V7H1V6H2V5H3V3H2V2H1V1H0V0H2V1H3V2H4V3H5V5H4Z\" />\n                                <path\n                                    d=\"M4,5V6H3V7H2V8H0V7H1V6H2V5H3V3H2V2H1V1H0V0H2V1H3V2H4V3H5V5Z\"\n                                    transform=\"translate(6)\"\n                                />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-top-4\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <path\n                                d=\"M.467,4.819H7.581a.455.455,0,0,0,.321-.78L4.368.138a.5.5,0,0,0-.688,0L.146,4.039A.455.455,0,0,0,.467,4.819Z\"\n                                transform=\"translate(8.985 11)\"\n                            />\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-arrow-top-5\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(10 12)\">\n                                <path\n                                    d=\"M-20.5,3H-26V2h1V1h1V0h2V1h1V2h1V3Z\"\n                                    transform=\"translate(26.003)\"\n                                />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-camera\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path\n                            d=\"M864 248H728l-32.4-90.8C691 144.5 679 136 665.4 136H358.6c-13.5 0-25.6 8.5-30.1 21.2L296 248H160c-44.2 0-80 35.8-80 80v456c0 44.2 35.8 80 80 80h704c44.2 0 80-35.8 80-80V328c0-44.2-35.8-80-80-80z m8 536c0 4.4-3.6 8-8 8H160c-4.4 0-8-3.6-8-8V328c0-4.4 3.6-8 8-8h186.7l17.1-47.8 22.9-64.2h250.5l22.9 64.2 17.1 47.8H864c4.4 0 8 3.6 8 8v456z\"\n                            p-id=\"8321\"\n                        ></path>\n                        <path d=\"M512 384c-88.4 0-160 71.6-160 160s71.6 160 160 160 160-71.6 160-160-71.6-160-160-160z m0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-check-circle\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n                        <path\n                            d=\"M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8c12.7 17.7 39 17.7 51.7 0l210.6-292c3.9-5.3 0.1-12.7-6.4-12.7z\"\n                            p-id=\"8455\"\n                        ></path>\n                        <path\n                            d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"\n                            p-id=\"8456\"\n                        ></path>\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-choose\"\n                        viewBox=\"0 0 21 21\"\n                    >\n\n                        <desc>\u52FE\u9009</desc>\n                        <path d=\"M16.54,7.06h0a1.06,1.06,0,0,0-1.48,0L9.64,12.48,6.94,9.77a1.06,1.06,0,0,0-1.49,0h0a1.08,1.08,0,0,0,0,1.49L8.9,14.7h0a1,1,0,0,0,1.41.07l.07-.07h0l6.16-6.15A1.06,1.06,0,0,0,16.54,7.06Z\" />\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-close-1\"\n                        viewBox=\"0 0 26 26\"\n                    >\n\n                        <g>\n                            <g transform=\"translate(-320.758 212.242)\">\n                                <path d=\"M335.414-199l1.536-1.536a1,1,0,0,0,0-1.414,1,1,0,0,0-1.414,0L334-200.414l-1.536-1.536a1,1,0,0,0-1.414,0,1,1,0,0,0,0,1.414L332.586-199l-1.536,1.536a1,1,0,0,0,0,1.414,1,1,0,0,0,1.415,0L334-197.586l1.536,1.536a1,1,0,0,0,1.414,0,1,1,0,0,0,0-1.414Z\" />\n                            </g>\n                        </g>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-close-2\"\n                        viewBox=\"0 0 12.5 12.4\"\n                    >\n\n                        <desc>\u521B\u5EFA\u4F5C\u54C1\u5F39\u7A97\u5173\u95ED</desc>\n                        <path d=\"M7.7,6.2l4.5-4.5a.967.967,0,0,0,0-1.4.967.967,0,0,0-1.4,0L6.2,4.8,1.7.3A.967.967,0,0,0,.3.3a.967.967,0,0,0,0,1.4L4.8,6.2.3,10.7a.967.967,0,0,0,0,1.4.967.967,0,0,0,1.4,0L6.2,7.6l4.5,4.5a.99.99,0,0,0,1.4-1.4Z\">\n                        </path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-compass\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n                        <path\n                            d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\"\n                            p-id=\"8585\"\n                        ></path>\n                        <path\n                            d=\"M710.4 295.9c-8-3.1-16.7-2.9-24.5 0.5L414.9 415 296.4 686c-3.6 8.2-3.6 17.5 0 25.7 3.4 7.8 9.7 13.9 17.7 17 3.8 1.5 7.7 2.2 11.7 2.2 4.4 0 8.7-0.9 12.8-2.7l271-118.6 118.5-271c3.6-8.2 3.6-17.5 0-25.7-3.5-7.9-9.8-13.9-17.7-17zM576.8 534.4l26.2 26.2-42.4 42.4-26.2-26.2L380 644.4 447.5 490 422 464.4l42.4-42.4 25.5 25.5L644.4 380l-67.6 154.4z\"\n                            p-id=\"8586\"\n                        ></path>\n                        <path\n                            d=\"M464.4 422L422 464.4l25.5 25.6 86.9 86.8 26.2 26.2 42.4-42.4-26.2-26.2-86.8-86.9z\"\n                            p-id=\"8587\"\n                        ></path>\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-input-close\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path\n                            d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m165.4 618.2l-66-0.3L512 563.4l-99.3 118.4-66.1 0.3c-4.4 0-8-3.5-8-8 0-1.9 0.7-3.7 1.9-5.2l130.1-155L340.5 359c-1.2-1.5-1.9-3.3-1.9-5.2 0-4.4 3.6-8 8-8l66.1 0.3L512 464.6l99.3-118.4 66-0.3c4.4 0 8 3.5 8 8 0 1.9-0.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z\"\n                            fill=\"#8a8a8a\"\n                        ></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-input-default\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656z\"></path>\n                        <path d=\"M492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM492 544h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM492 688h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z\"></path>\n                        <path d=\"M380 368m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z\"></path>\n                        <path d=\"M380 512m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z\"></path>\n                        <path d=\"M380 656m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-input-number-down\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-input-number-up\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3c-3.8 5.3-0.1 12.7 6.5 12.7h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-input-search\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n\n                        <path d=\"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6c3.2 3.2 8.4 3.2 11.6 0l43.6-43.5c3.2-3.2 3.2-8.4 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z\"></path>\n\n                    </symbol>\n\n                    <symbol\n                        id=\"svg-mail\"\n                        viewBox=\"0 0 1024 1024\"\n                    >\n                        <path\n                            d=\"M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32z m-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5z\"\n                            p-id=\"8451\"\n                        ></path>\n                        <path\n                            d=\"M833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6c20.2 15.7 48.5 15.7 68.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z\"\n                            p-id=\"8452\"\n                            ></path>\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-notice-error\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <g transform=\"translate(-675 -2773)\">\n                                    <circle\n                                        cx=\"7.5\"\n                                        cy=\"7.5\"\n                                        r=\"7.5\"\n                                        transform=\"translate(681 2779)\"\n                                    />\n                                    <path\n                                        d=\"M800,5V4h1V5Zm-4,0V4h1V5Zm3-1V3h1V4Zm-2,0V3h1V4Zm1-1V2h1V3Zm1-1V1h1V2Zm-2,0V1h1V2Zm3-1V0h1V1Zm-4,0V0h1V1Z\"\n                                        transform=\"translate(-110 2784)\"\n                                        fill=\"#fff\"\n                                    />\n                                </g>\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-notice-info\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <g transform=\"translate(-675 -2815)\">\n                                    <circle\n                                        cx=\"7.5\"\n                                        cy=\"7.5\"\n                                        r=\"7.5\"\n                                        transform=\"translate(681 2821)\"\n                                    />\n                                    <path\n                                        d=\"M796,7V6h1V7Zm0-2V0h1V5Z\"\n                                        transform=\"translate(-108 2825)\"\n                                        fill=\"#ffef98\"\n                                    />\n                                </g>\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-notice-seccuss\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <g transform=\"translate(-675 -2722)\">\n                                    <circle\n                                        cx=\"7.5\"\n                                        cy=\"7.5\"\n                                        r=\"7.5\"\n                                        transform=\"translate(681 2728)\"\n                                    />\n                                    <path\n                                        d=\"M798,5V4h1V5Zm1-1V3h1V4Zm-2,0V3h1V4Zm3-1V2h1V3Zm-4,0V2h1V3Zm5-1V1h1V2Zm1-1V0h1V1Z\"\n                                        transform=\"translate(-111 2733)\"\n                                        fill=\"#fff\"\n                                    />\n                                </g>\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-ok-1\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <path\n                                    d=\"M519.425,54.849a1,1,0,0,0-1.414-.016l-3.994,3.906-2.1-2.145a1,1,0,1,0-1.43,1.4l2.8,2.86a1,1,0,0,0,1.414.016l4.708-4.6A1,1,0,0,0,519.425,54.849Z\"\n                                    transform=\"translate(-502.206 -44.549)\"\n                                />\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-ok-2\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <g transform=\"translate(801 49.768)\">\n                                    <path d=\"M-782.272-41.476h0a1,1,0,0,0-1.415,0l-6.072,7.073-3.535-3.537a1,1,0,0,0-1.414,0h0a1,1,0,0,0,0,1.414l4.242,4.243h0a1,1,0,0,0,1.414,0h0l6.78-7.78A1,1,0,0,0-782.272-41.476Z\" />\n                                </g>\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-order-down\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <title>\u964D\u5E8F</title>\n                            <rect\n                                x=\"5\"\n                                y=\"6\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <rect\n                                x=\"5\"\n                                y=\"9.71\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <rect\n                                x=\"5\"\n                                y=\"13.43\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <rect\n                                x=\"5\"\n                                y=\"17.14\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <path d=\"M18,19a1,1,0,0,1-.38-.07.92.92,0,0,1-.62-.86V6.93a1,1,0,0,1,2,0v8.9l1.29-1.2a1.07,1.07,0,0,1,1.42,0,.88.88,0,0,1,0,1.31l-3,2.79A1,1,0,0,1,18,19Z\" />\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-order-up\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <title>\u5347\u5E8F</title>\n                            <rect\n                                x=\"5\"\n                                y=\"17.14\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <rect\n                                x=\"5\"\n                                y=\"13.43\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <rect\n                                x=\"5\"\n                                y=\"9.71\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <rect\n                                x=\"5\"\n                                y=\"6\"\n                                width=\"10\"\n                                height=\"1.86\"\n                                rx=\"0.93\"\n                                ry=\"0.93\"\n                            />\n                            <path d=\"M18,6a1,1,0,0,0-.38.07.92.92,0,0,0-.62.86V18.07a1,1,0,0,0,2,0V9.17l1.29,1.2a1.07,1.07,0,0,0,1.42,0,.88.88,0,0,0,0-1.31l-3-2.79A1,1,0,0,0,18,6Z\" />\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-search\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <desc>\u641C\u7D22\u6846-\u641C\u7D22</desc>\n                            <path d=\"M12,7a5,5,0,0,1,4,8l-.43.58L15,16a5,5,0,1,1-3-9m0-2a7,7,0,1,0,4.19,12.6l2.17,2.18a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L17.6,16.19A7,7,0,0,0,12,5Z\"></path>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-star\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <path\n                                    d=\"M8.656,13.63l3.681,1.99a.818.818,0,0,0,1.194-.8l-.7-4.079a1,1,0,0,1,.3-.9l2.985-2.885a.819.819,0,0,0-.4-1.393l-4.179-.6a1.547,1.547,0,0,1-.8-.6L8.855.4A.766.766,0,0,0,7.462.4L5.572,4.178a1.032,1.032,0,0,1-.8.6L.7,5.372A.845.845,0,0,0,.2,6.765L3.184,9.651a.8.8,0,0,1,.3.9l-.7,4.079a.772.772,0,0,0,1.194.8l3.681-1.99A1.794,1.794,0,0,1,8.656,13.63Z\"\n                                    transform=\"translate(5.004 5.05)\"\n                                />\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-time-picker\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <g transform=\"translate(0.5 -0.02)\">\n                                    <g>\n                                        <path d=\"M13,21.02a7.5,7.5,0,1,1,7.5-7.5A7.508,7.508,0,0,1,13,21.02Zm0-13a5.5,5.5,0,1,0,5.5,5.5A5.506,5.506,0,0,0,13,8.02Z\" />\n                                    </g>\n                                    <path d=\"M15.113,14.485l-1.768-1.02V11.02a.973.973,0,0,0-.068-.337.986.986,0,0,0-.864-.649c-.023,0-.044-.014-.068-.014h0a1,1,0,0,0-1,1v3a.921.921,0,0,0,.026.129.864.864,0,0,0,.407.721l2.335,1.347a1.006,1.006,0,0,0,1-1.732Z\" />\n                                </g>\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-tool-btn\"\n                            viewBox=\"0 0 8.019 4.819\"\n                        >\n\n                            <desc>\u4E0B\u62C9\u6309\u94AE</desc>\n                            <path\n                                id=\"\u8DEF\u5F84_260\"\n                                data-name=\"\u8DEF\u5F84 260\"\n                                class=\"cls-1\"\n                                d=\"M.467,0H7.581A.455.455,0,0,1,7.9.78l-3.534,3.9a.5.5,0,0,1-.688,0L.146.78A.455.455,0,0,1,.467,0Z\"\n                                transform=\"translate(-0.015)\"\n                            />\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-upload-big\"\n                            viewBox=\"0 0 50 50\"\n                        >\n\n                            <g>\n                                <path\n                                    d=\"M1,49V31H-17a1,1,0,0,1-1-1,1,1,0,0,1,1-1H1V11a1,1,0,1,1,2,0V29H21a1,1,0,1,1,0,2H3V49a1,1,0,1,1-2,0Z\"\n                                    transform=\"translate(23 -5)\"\n                                />\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-upload-smart\"\n                            viewBox=\"0 0 26 26\"\n                        >\n\n                            <g>\n                                <path\n                                    d=\"M-2187,15V9h-6a1,1,0,0,1-1-1,1,1,0,0,1,1-1h6V1a1,1,0,0,1,1-1,1,1,0,0,1,1,1V7h6a1,1,0,0,1,1,1,1,1,0,0,1-1,1h-6v6a1,1,0,0,1-1,1A1,1,0,0,1-2187,15Z\"\n                                    transform=\"translate(2199 5)\"\n                                />\n                            </g>\n\n                        </symbol>\n\n                        <symbol\n                            id=\"svg-user\"\n                            viewBox=\"0 0 1024 1024\"\n                        >\n                            <path\n                                d=\"M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5-34.5-34.5-74.7-61.6-119.5-80.6-0.4-0.2-0.8-0.3-1.2-0.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-0.4 0.2-0.8 0.3-1.2 0.5-44.8 18.9-85 46-119.5 80.6-34.5 34.5-61.6 74.7-80.6 119.5C146.9 807.5 137 854 136 901.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c0.1 4.4 3.6 7.8 8 7.8h60c4.5 0 8.1-3.7 8-8.2-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z\"\n                                p-id=\"8192\"\n                            ></path>\n                        </symbol>\n                    </g>\n                </svg>\n        </hgroup>\n    ",
  data: function data() {
    return {};
  }
});
var Transition = {
  beforeEnter: function beforeEnter(el) {
    Ktu.addClass(el, 'collapse-transition');
    if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.style.height = '0';
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  },
  enter: function enter(el) {
    el.dataset.oldOverflow = el.style.overflow;

    if (el.scrollHeight !== 0) {
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    } else {
      el.style.height = '';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }

    el.style.overflow = 'hidden';
  },
  afterEnter: function afterEnter(el) {
    // for safari: remove class then reset height is necessary
    Ktu.removeClass(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
  },
  beforeLeave: function beforeLeave(el) {
    if (!el.dataset) el.dataset = {};
    el.dataset.oldPaddingTop = el.style.paddingTop;
    el.dataset.oldPaddingBottom = el.style.paddingBottom;
    el.dataset.oldOverflow = el.style.overflow;
    el.style.height = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
  },
  leave: function leave(el) {
    if (el.scrollHeight !== 0) {
      // for safari: add class after set height, or it will jump to zero height suddenly, weired
      Ktu.addClass(el, 'collapse-transition');
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }
  },
  afterLeave: function afterLeave(el) {
    Ktu.removeClass(el, 'collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
    el.style.paddingTop = el.dataset.oldPaddingTop;
    el.style.paddingBottom = el.dataset.oldPaddingBottom;
  }
};
Ktu.CollapseTransition = {
  name: 'CollapseTransition',
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children;
    var data = {
      on: Transition
    };
    return h('transition', data, children);
  }
};
var prefixCls = 'collapse';
Vue.component('Collapse', {
  template: "\n        <div :class=\"classes\">\n            <slot></slot>\n        </div>\n    ",
  props: {
    accordion: {
      type: Boolean,
      "default": false
    },
    value: {
      type: [Array, String]
    },
    simple: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      currentValue: this.value //由于props不允许直接修改，因此使用currentValue进行保存

    };
  },
  computed: {
    classes: function classes() {
      return ["".concat(prefixCls), _defineProperty({}, "".concat(prefixCls, "-simple"), this.simple)];
    }
  },
  mounted: function mounted() {
    this.setActive();
  },
  methods: {
    //设置当前激活的panel
    setActive: function setActive() {
      //获取当前激活的panel对应的key数组
      var activeKey = this.getActiveKey();
      this.$children.forEach(function (child, index) {
        var name = child.name || index.toString();
        child.isActive = activeKey.indexOf(name) > -1;
        child.index = index;
      });
    },
    //获取当前激活的panel对应的key数组
    getActiveKey: function getActiveKey() {
      var activeKey = this.currentValue || [];
      var accordion = this.accordion;

      if (!Array.isArray(activeKey)) {
        activeKey = [activeKey];
      } //手风琴激活第一个panel


      if (accordion && activeKey.length > 1) {
        activeKey = [activeKey[0]];
      } //转为字符串


      for (var i = 0; i < activeKey.length; i++) {
        activeKey[i] = activeKey[i].toString();
      }

      return activeKey;
    },
    //暴露的切换方法，用于给penel组件调用

    /**
     *
     * @param data
     * data: {
     *     name: xxx,
     *     isActive: xxx
     * }
     */
    toggle: function toggle(data) {
      var name = data.name.toString();
      var newActiveKey = []; //判断是否是手风琴

      if (this.accordion) {
        if (!data.isActive) {
          newActiveKey.push(name);
        }
      } else {
        var activeKey = this.getActiveKey();
        var nameIndex = activeKey.indexOf(name); //若为已激活，则取消激活，反之激活

        if (data.isActive) {
          if (nameIndex > -1) {
            activeKey.splice(nameIndex, 1);
          }
        } else {
          if (nameIndex < 0) {
            activeKey.push(name);
          }
        }

        newActiveKey = activeKey;
      } //通知调用者当前激活的key，应用于v-modal指令


      this.$emit('input', newActiveKey);
      this.$emit('on-change', newActiveKey);
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    },
    currentValue: function currentValue() {
      this.setActive();
    }
  }
});
Vue.component('Panel', {
  template: "\n      <div :class=\"itemClasses\">\n        <div :class=\"headerClasses\" @click=\"toggle\">\n            <slot></slot>\n        </div>\n        <div :class=\"contentClasses\" v-show=\"isActive\">\n            <div :class=\"boxClasses\"><slot name=\"content\"></slot></div>\n        </div>\n    </div>\n    ",
  name: 'Panel',
  components: {},
  props: {
    name: {
      type: String
    },
    hideArrow: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      index: 0,
      isActive: false
    };
  },
  computed: {
    itemClasses: function itemClasses() {
      return ["".concat(prefixCls, "-item"), _defineProperty({}, "".concat(prefixCls, "-item-active"), this.isActive)];
    },
    headerClasses: function headerClasses() {
      return "".concat(prefixCls, "-header");
    },
    contentClasses: function contentClasses() {
      return "".concat(prefixCls, "-content");
    },
    boxClasses: function boxClasses() {
      return "".concat(prefixCls, "-content-box");
    }
  },
  methods: {
    toggle: function toggle() {
      this.$parent.toggle({
        name: this.name || this.index,
        isActive: this.isActive
      });
    }
  }
});
Vue.component('Icon', {
  template: "\n        <i\n            :class=\"classes\"\n            @click=\"handleClick\"\n        >\n            <svg\n                class=\"svg-icon\"\n                :fill=\"color\"\n            >\n                <use :xlink:href=\"imageid\"></use>\n            </svg>\n        </i>\n    ",
  props: {
    color: String,
    id: {
      type: String,
      "default": ""
    }
  },
  data: function data() {
    return {
      prefixCls: "icon"
    };
  },
  computed: {
    classes: function classes() {
      return ["".concat(this.prefixCls)];
    },
    imageid: function imageid() {
      return this.id[0] == "#" ? this.id : "#" + this.id;
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      this.$emit("click", event);
    }
  }
});
var _Ktu = Ktu,
    oneOf = _Ktu.oneOf,
    calcTextareaHeight = _Ktu.calcTextareaHeight;
Vue.component('Input', {
  template: "\n        <div :class=\"wrapClasses\">\n            <template v-if=\"type !== 'textarea'\">\n                <!-- \u8F93\u5165\u6846\u7684\u524D\u7F00\u5185\u5BB9\uFF0C\u53EF\u4EE5\u662F\u56FE\u6807\uFF0C\u9009\u62E9\u6846\u7B49\u7B49\u7B49 -->\n                <div\n                    :class=\"[prefixCls + '-group-prepend']\"\n                    v-if=\"prepend\"\n                    v-show=\"slotReady\"\n                >\n                    <slot name=\"prepend\"></slot>\n                </div>\n\n                <!-- \u6E05\u9664\u6309\u94AE -->\n                <icon\n                    id=\"#svg-close-2\"\n                    :class=\"[prefixCls + '-icon', prefixCls + '-icon-clear' , prefixCls + '-icon-normal']\"\n                    v-if=\"clearable && currentValue && !disabled\"\n                    @click=\"handleClear\"\n                ></icon>\n                <!-- \u8C03\u7528\u65F6\u4F20\u9012\u8FDB\u6765\u7684\u6309\u94AE -->\n                <icon\n                    id=\"#svg-time-picker\"\n                    :class=\"[prefixCls + '-icon', prefixCls + '-icon-normal']\"\n                    v-else-if=\"icon\"\n                    @click=\"handleIconClick\"\n                ></icon>\n                <!-- \u524D\u7F6E\u7684\u641C\u7D22\u6309\u94AE -->\n                <icon\n                    id=\"#svg-search\"\n                    :class=\"[prefixCls + '-icon', prefixCls + '-icon-normal', prefixCls + '-search-icon']\"\n                    v-else-if=\"search && enterButton === false\"\n                    @click=\"handleSearch\"\n                ></icon>\n\n                <!-- \u524D\u7F6E-\u5728\u8C03\u7528\u65F6\u901A\u8FC7\u5C5E\u6027\u4F20\u9012\u8FDB\u6765\u7684 -->\n                <span\n                    class=\"input-suffix\"\n                    v-else-if=\"showSuffix\"\n                >\n                    <slot name=\"suffix\">\n                        <icon\n                            :id=\"'#'+suffix\"\n                            :class=\"[prefixCls + '-icon', prefixCls + '-icon-' + suffix]\"\n                            v-if=\"suffix\"\n                        ></icon>\n                    </slot>\n                </span>\n\n                <!-- \u52A0\u8F7D\u56FE\u6807\uFF0C\u4E0D\u77E5\u9053\u6709\u4EC0\u4E48\u7528 -->\n                <!-- <transition name=\"fade\">\n                    <i class=\"ivu-icon ivu-icon-ios-loading ivu-load-loop\" :class=\"[prefixCls + '-icon', prefixCls + '-icon-validate']\" v-if=\"!icon\"></i>\n                </transition> -->\n\n                <input\n                    :id=\"elementId\"\n                    :autocomplete=\"autocomplete\"\n                    :spellcheck=\"spellcheck\"\n                    ref=\"input\"\n                    :type=\"type\"\n                    :class=\"inputClasses\"\n                    :placeholder=\"placeholder\"\n                    :disabled=\"disabled\"\n                    :maxlength=\"maxlength\"\n                    :readonly=\"readonly\"\n                    :name=\"name\"\n                    :value=\"currentValue\"\n                    :number=\"number\"\n                    :autofocus=\"autofocus\"\n                    @keyup.enter=\"handleEnter\"\n                    @keyup=\"handleKeyup\"\n                    @keypress=\"handleKeypress\"\n                    @keydown=\"handleKeydown\"\n                    @focus=\"handleFocus\"\n                    @blur=\"handleBlur\"\n                    @compositionstart=\"handleComposition\"\n                    @compositionupdate=\"handleComposition\"\n                    @compositionend=\"handleComposition\"\n                    @input=\"handleInput\"\n                    @change=\"handleChange\"\n                >\n\n                <!-- \u8F93\u5165\u6846\u540E\u7F6E\u5185\u5BB9\uFF0C\u53EF\u4EE5\u662F\u56FE\u6807\uFF0C\u9009\u62E9\u6846\u7B49\u7B49\u7B49 -->\n                <div\n                    :class=\"[prefixCls + '-group-append']\"\n                    v-if=\"append\"\n                    v-show=\"slotReady\"\n                >\n                    <slot name=\"append\"></slot>\n                </div>\n\n                <!-- \u540E\u7F6E\u7684\u641C\u7D22\u6309\u94AE -->\n                <div\n                    :class=\"[prefixCls + '-group-append', prefixCls + '-search']\"\n                    v-else-if=\"search && enterButton\"\n                    @click=\"handleSearch\"\n                >\n                    <icon\n                        id=\"#svg-search\"\n                        :class=\"[prefixCls + '-icon', prefixCls + '-search-icon']\"\n                        v-if=\"enterButton === true\"\n                    ></icon>\n                    <template v-else>{{ enterButton }}</template>\n                </div>\n                <!-- \u540E\u7F6E-\u5728\u8C03\u7528\u65F6\u901A\u8FC7\u5C5E\u6027\u4F20\u9012\u8FDB\u6765\u7684 -->\n                <span\n                    class=\"input-prefix\"\n                    v-else-if=\"showPrefix\"\n                >\n                    <slot name=\"prefix\">\n                        <icon\n                            :id=\"'#'+prefix\"\n                            :class=\"[prefixCls + '-icon', prefixCls + '-icon-' + prefix]\"\n                            v-if=\"prefix\"\n                        ></icon>\n                    </slot>\n                </span>\n\n            </template>\n            <textarea\n                v-else\n                :id=\"elementId\"\n                :wrap=\"wrap\"\n                :autocomplete=\"autocomplete\"\n                :spellcheck=\"spellcheck\"\n                ref=\"textarea\"\n                :class=\"textareaClasses\"\n                :style=\"textareaStyles\"\n                :placeholder=\"placeholder\"\n                :disabled=\"disabled\"\n                :rows=\"rows\"\n                :maxlength=\"maxlength\"\n                :readonly=\"readonly\"\n                :name=\"name\"\n                :value=\"currentValue\"\n                :autofocus=\"autofocus\"\n                @keyup.enter=\"handleEnter\"\n                @keyup=\"handleKeyup\"\n                @keypress=\"handleKeypress\"\n                @keydown=\"handleKeydown\"\n                @focus=\"handleFocus\"\n                @blur=\"handleBlur\"\n                @compositionstart=\"handleComposition\"\n                @compositionupdate=\"handleComposition\"\n                @compositionend=\"handleComposition\"\n                @input=\"handleInput\"\n            >\n            </textarea>\n        </div>\n    ",
  props: {
    type: {
      validator: function validator(value) {
        return oneOf(value, ["text", "textarea", "password", "url", "email", "date", "number", "tel"]);
      },
      "default": "text"
    },
    value: {
      type: [String, Number],
      "default": ""
    },
    size: {
      validator: function validator(value) {
        return oneOf(value, ["small", "large", "default"]);
      },
      "default": function _default() {
        return !this.$IVIEW || this.$IVIEW.size === "" ? "default" : this.$IVIEW.size;
      }
    },
    placeholder: {
      type: String,
      "default": ""
    },
    maxlength: {
      type: Number
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    icon: String,
    autosize: {
      type: [Boolean, Object],
      "default": false
    },
    rows: {
      type: Number,
      "default": 2
    },
    readonly: {
      type: Boolean,
      "default": false
    },
    name: {
      type: String
    },
    number: {
      type: Boolean,
      "default": false
    },
    autofocus: {
      type: Boolean,
      "default": false
    },
    spellcheck: {
      type: Boolean,
      "default": false
    },
    autocomplete: {
      validator: function validator(value) {
        return oneOf(value, ["on", "off"]);
      },
      "default": "off"
    },
    clearable: {
      type: Boolean,
      "default": false
    },
    elementId: {
      type: String
    },
    wrap: {
      validator: function validator(value) {
        return oneOf(value, ["hard", "soft"]);
      },
      "default": "soft"
    },
    prefix: {
      type: String,
      "default": ""
    },
    suffix: {
      type: String,
      "default": ""
    },
    search: {
      type: Boolean,
      "default": false
    },
    enterButton: {
      type: [Boolean, String],
      "default": false
    }
  },
  data: function data() {
    return {
      prefixCls: 'input',
      currentValue: this.value,
      prepend: true,
      append: true,
      slotReady: false,
      textareaStyles: {},
      showPrefix: false,
      showSuffix: false,
      isOnComposition: false
    };
  },
  computed: {
    wrapClasses: function wrapClasses() {
      var _ref4;

      return ["".concat(prefixCls, "-wrapper"), (_ref4 = {}, _defineProperty(_ref4, "".concat(prefixCls, "-wrapper-").concat(this.size), !!this.size), _defineProperty(_ref4, "".concat(prefixCls, "-type"), this.type), _defineProperty(_ref4, "".concat(prefixCls, "-group"), this.prepend || this.append || this.search && this.enterButton), _defineProperty(_ref4, "".concat(prefixCls, "-group-").concat(this.size), (this.prepend || this.append || this.search && this.enterButton) && !!this.size), _defineProperty(_ref4, "".concat(prefixCls, "-group-with-prepend"), this.prepend), _defineProperty(_ref4, "".concat(prefixCls, "-group-with-append"), this.append || this.search && this.enterButton), _defineProperty(_ref4, "".concat(prefixCls, "-hide-icon"), this.append), _defineProperty(_ref4, "".concat(prefixCls, "-with-search"), this.search && this.enterButton), _ref4)];
    },
    inputClasses: function inputClasses() {
      var _ref5;

      return ["".concat(prefixCls), (_ref5 = {}, _defineProperty(_ref5, "".concat(prefixCls, "-").concat(this.size), !!this.size), _defineProperty(_ref5, "".concat(prefixCls, "-disabled"), this.disabled), _defineProperty(_ref5, "".concat(prefixCls, "-with-prefix"), this.showPrefix), _defineProperty(_ref5, "".concat(prefixCls, "-with-suffix"), this.showSuffix || this.search && this.enterButton === false), _ref5)];
    },
    textareaClasses: function textareaClasses() {
      return ["".concat(prefixCls), _defineProperty({}, "".concat(prefixCls, "-disabled"), this.disabled)];
    }
  },
  methods: {
    handleEnter: function handleEnter(event) {
      this.$emit("on-enter", event);
      if (this.search) this.$emit("on-search", this.currentValue);
    },
    handleKeydown: function handleKeydown(event) {
      this.$emit("on-keydown", event);
    },
    handleKeypress: function handleKeypress(event) {
      this.$emit("on-keypress", event);
    },
    handleKeyup: function handleKeyup(event) {
      this.$emit("on-keyup", event);
    },
    handleIconClick: function handleIconClick(event) {
      this.$emit("on-click", event);
    },
    handleFocus: function handleFocus(event) {
      var _this = this;

      this.$emit("on-focus", event);
      console.log(); // self.$el.select();

      this.$nextTick(function () {
        if (_this.type === "textarea") {
          _this.$refs.textarea.select();
        } else {
          _this.$refs.input.select();
        }
      });
    },
    handleBlur: function handleBlur(event) {
      this.$emit("on-blur", event);
    },
    handleComposition: function handleComposition(event) {
      if (event.type === "compositionstart") {
        this.isOnComposition = true;
      }

      if (event.type === "compositionend") {
        this.isOnComposition = false;
        this.handleInput(event);
      }
    },
    handleInput: function handleInput(event) {
      if (this.isOnComposition) return;
      var value = event.target.value;
      if (this.number && value !== "") value = Number.isNaN(Number(value)) ? value : Number(value);
      this.$emit("input", value);
      this.setCurrentValue(value);
      this.$emit("on-change", event);
    },
    handleChange: function handleChange(event) {
      this.$emit("on-input-change", event);
    },
    setCurrentValue: function setCurrentValue(value) {
      var _this2 = this;

      if (value === this.currentValue) return;
      this.$nextTick(function () {
        _this2.resizeTextarea();
      });
      this.currentValue = value;
    },
    resizeTextarea: function resizeTextarea() {
      var autosize = this.autosize;

      if (!autosize || this.type !== "textarea") {
        return false;
      }

      var minRows = autosize.minRows;
      var maxRows = autosize.maxRows;
      this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    focus: function focus() {
      if (this.type === "textarea") {
        this.$refs.textarea.focus();
      } else {
        this.$refs.input.focus();
      }
    },
    blur: function blur() {
      if (this.type === "textarea") {
        this.$refs.textarea.blur();
      } else {
        this.$refs.input.blur();
      }
    },
    handleClear: function handleClear() {
      var e = {
        target: {
          value: ""
        }
      };
      this.$emit("input", "");
      this.setCurrentValue("");
      this.$emit("on-change", e);
    },
    handleSearch: function handleSearch() {
      if (this.disabled) return false;
      this.$refs.input.focus();
      this.$emit("on-search", this.currentValue);
    }
  },
  watch: {
    value: function value(val) {
      this.setCurrentValue(val);
    }
  },
  mounted: function mounted() {
    if (this.type !== "textarea") {
      this.prepend = this.$slots.prepend !== undefined;
      this.append = this.$slots.append !== undefined;
      this.showPrefix = this.prefix !== "" || this.$slots.prefix !== undefined;
      this.showSuffix = this.suffix !== "" || this.$slots.suffix !== undefined;
    } else {
      this.prepend = false;
      this.append = false;
    }

    this.slotReady = true;
    this.resizeTextarea();
  }
});
Vue.component('MenuItem', {
  template: "\n        <a :class=\"classes\" @click.stop=\"handleClickItem\" :style=\"itemStyle\">\n            <slot></slot>\n        </a>\n    ",
  mixins: [Ktu.mixins.emitter],
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      active: false,
      prefixCls: 'menu',
      menu: Ktu.findComponentUpward(this, 'Menu')
    };
  },
  computed: {
    hasParentSubmenu: function hasParentSubmenu() {
      return !!Ktu.findComponentUpward(this, 'Submenu');
    },
    parentSubmenuNum: function parentSubmenuNum() {
      return Ktu.findComponentsUpward(this, 'Submenu').length;
    },
    mode: function mode() {
      return this.menu.mode;
    },
    classes: function classes() {
      var _ref7;

      return ["".concat(this.prefixCls, "-item"), (_ref7 = {}, _defineProperty(_ref7, "".concat(this.prefixCls, "-item-active"), this.active), _defineProperty(_ref7, "".concat(this.prefixCls, "-item-selected"), this.active), _defineProperty(_ref7, "".concat(this.prefixCls, "-item-disabled"), this.disabled), _ref7)];
    },
    itemStyle: function itemStyle() {
      return this.hasParentSubmenu && this.mode !== "horizontal" ? {
        paddingLeft: 43 + (this.parentSubmenuNum - 1) * 24 + "px"
      } : {};
    }
  },
  methods: {
    handleClickItem: function handleClickItem() {
      if (this.disabled) return;
      this.dispatch("Menu", "on-menu-item-select", this.name);
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    this.$on("on-update-active-name", function (name) {
      if (_this3.name === name) {
        _this3.active = true;

        _this3.dispatch("Submenu", "on-update-active", true);
      } else {
        _this3.active = false;
      }
    });
  }
});
Vue.component('Menu', {
  template: "\n        <ul\n            :class=\"classes\"\n            :style=\"styles\"\n        >\n            <slot></slot>\n        </ul>\n    ",
  mixins: [Ktu.mixins.emitter],
  props: {
    mode: {
      validator: function validator(value) {
        return Ktu.oneOf(value, ["horizontal", "vertical"]);
      },
      "default": "vertical"
    },
    //当前激活的选项名字
    activeName: {
      type: [String, Number]
    },
    width: {
      type: String,
      "default": "240px"
    }
  },
  data: function data() {
    return {
      //当前激活的选项名字
      currentActiveName: this.activeName,
      prefixCls: 'menu'
    };
  },
  computed: {
    classes: function classes() {
      return ["".concat(this.prefixCls), "".concat(this.prefixCls, "-light"), _defineProperty({}, "".concat(this.prefixCls, "-").concat(this.mode), this.mode)];
    },
    styles: function styles() {
      var style = {};
      if (this.mode === "vertical") style.width = this.width;
      return style;
    }
  },
  methods: {
    //更新当前激活的选项
    updateActiveName: function updateActiveName() {
      if (this.currentActiveName === undefined) {
        this.currentActiveName = -1;
      }

      this.emitterBroadcast("Submenu", "on-update-active", false);
      this.emitterBroadcast("MenuItem", "on-update-active-name", this.currentActiveName);
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    this.updateActiveName();
    this.$on("on-menu-item-select", function (name) {
      _this4.currentActiveName = name;

      _this4.$emit("on-select", name);
    });
  },
  watch: {
    activeName: function activeName(val) {
      this.currentActiveName = val;
    },
    currentActiveName: function currentActiveName() {
      this.updateActiveName();
    }
  }
});
Vue.component('Submenu', {
  template: "\n        <li :class=\"classes\" @mouseenter=\"handleMouseenter\" @mouseleave=\"handleMouseleave\">\n            <div :class=\"[prefixCls + '-submenu-title']\" ref=\"reference\" @click.stop=\"handleClick\" >\n                <slot name=\"title\"></slot>\n            </div>\n            <div :class=\"[prefixCls + '-dropdown']\" v-show=\"opened\">\n                <ul :class=\"[prefixCls + '-drop-list']\">\n                    <slot></slot>\n                </ul>\n            </div>\n        </li>\n    ",
  mixins: [Ktu.mixins.emitter],
  components: {},
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    disabled: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      prefixCls: "menu",
      active: false,
      opened: false,
      menu: Ktu.findComponentUpward(this, 'Menu')
    };
  },
  computed: {
    mode: function mode() {
      return this.menu.mode;
    },
    classes: function classes() {
      var _ref9;

      return ["".concat(this.prefixCls, "-submenu"), (_ref9 = {}, _defineProperty(_ref9, "".concat(this.prefixCls, "-item-active"), this.active), _defineProperty(_ref9, "".concat(this.prefixCls, "-opened"), this.opened), _defineProperty(_ref9, "".concat(this.prefixCls, "-submenu-disabled"), this.disabled), _defineProperty(_ref9, "".concat(this.prefixCls, "-child-item-active"), this.active), _ref9)];
    },
    accordion: function accordion() {
      return this.menu.accordion;
    }
  },
  methods: {
    handleMouseenter: function handleMouseenter() {
      var _this5 = this;

      if (this.disabled) return;
      if (this.mode === "vertical") return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this5.opened = true;
      }, 250);
    },
    handleMouseleave: function handleMouseleave() {
      var _this6 = this;

      if (this.disabled) return;
      if (this.mode === "vertical") return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        _this6.opened = false;
      }, 150);
    },
    handleClick: function handleClick() {
      if (this.disabled) return;
      if (this.mode === "horizontal") return;
      var opened = this.opened;

      if (this.accordion) {
        this.$parent.$children.forEach(function (item) {
          if (item.$options.name === "Submenu") item.opened = false;
        });
      }

      this.opened = !opened;
    }
  },
  watch: {
    opened: function opened(val) {
      if (this.mode === "vertical") return;
    }
  },
  mounted: function mounted() {
    var _this7 = this;

    this.$on("on-menu-item-select", function (name) {
      if (_this7.mode === "horizontal") _this7.opened = false;

      _this7.dispatch("Menu", "on-menu-item-select", name);

      return true;
    });
    this.$on("on-update-active", function (status) {
      _this7.active = status;
    });
  }
});
Vue.component('TabPane', {
  template: "\n <div\n        :class=\"prefixCls\"\n        v-show=\"show\"\n        :style=\"contentStyle\"\n    >\n        <slot></slot>\n    </div>\n",
  name: 'TabPane',
  inject: ["TabsInstance"],
  props: {
    name: {
      type: String
    },
    label: {
      type: [String, Function],
      "default": ""
    },
    icon: {
      type: String
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    closable: {
      type: Boolean,
      "default": null
    },
    // Tabs 嵌套时，用 tab 区分层级，指向对应的 Tabs 的 name
    tab: {
      type: String
    },
    // 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序
    // 数值需大于 0
    index: {
      type: Number
    }
  },
  data: function data() {
    return {
      prefixCls: 'tabs-tabpane',
      show: true,
      currentName: this.name
    };
  },
  computed: {
    contentStyle: function contentStyle() {
      return {
        visibility: this.TabsInstance.activeKey !== this.currentName ? "hidden" : "visible"
      };
    }
  },
  methods: {
    updateNav: function updateNav() {
      this.TabsInstance.updateNav();
    }
  },
  watch: {
    name: function name(val) {
      this.currentName = val;
      this.updateNav();
    },
    label: function label() {
      this.updateNav();
    },
    icon: function icon() {
      this.updateNav();
    },
    disabled: function disabled() {
      this.updateNav();
    }
  },
  mounted: function mounted() {
    this.updateNav();
  },
  destroyed: function destroyed() {
    this.updateNav();
  }
});
var transitionTime = 300; // from CSS

var getNextTab = function getNextTab(list, activeKey, direction, countDisabledAlso) {
  var currentIndex = list.findIndex(function (tab) {
    return tab.name === activeKey;
  });
  var nextIndex = (currentIndex + direction + list.length) % list.length;
  var nextTab = list[nextIndex];
  if (nextTab.disabled) return getNextTab(list, nextTab.name, direction, countDisabledAlso);else return nextTab;
};

var focusFirst = function focusFirst(element, root) {
  try {
    element.focus();
  } catch (err) {} // eslint-disable-line no-empty


  if (document.activeElement == element && element !== root) return true;
  var candidates = element.children;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = candidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var candidate = _step.value;
      if (focusFirst(candidate, root)) return true;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
};

Vue.component('Tabs', {
  template: "\n        <div :class=\"classes\">\n        <div :class=\"['prefixCls'+'-bar']\">\n            <div\n                :class=\"[prefixCls + '-nav-right']\"\n                v-if=\"showSlot\"\n            >\n                <slot name=\"extra\"></slot>\n            </div>\n            <div\n                :class=\"[prefixCls + '-nav-container']\"\n                tabindex=\"0\"\n                ref=\"navContainer\"\n                @keydown=\"handleTabKeyNavigation\"\n                @keydown.space.prevent=\"handleTabKeyboardSelect(false)\"\n            >\n                <div\n                    ref=\"navWrap\"\n                    :class=\"[prefixCls + '-nav-wrap', scrollable ? prefixCls + '-nav-scrollable' : '']\"\n                >\n                    <span\n                        :class=\"[prefixCls + '-nav-prev', scrollable ? '' : prefixCls + '-nav-scroll-disabled']\"\n                        @click=\"scrollPrev\"\n                    >\n                    </span>\n                    <span\n                        :class=\"[prefixCls + '-nav-next', scrollable ? '' : prefixCls + '-nav-scroll-disabled']\"\n                        @click=\"scrollNext\"\n                    >\n                    </span>\n                    <div\n                        ref=\"navScroll\"\n                        :class=\"[prefixCls + '-nav-scroll']\"\n                    >\n                        <div\n                            ref=\"nav\"\n                            :class=\"[prefixCls + '-nav']\"\n                            class=\"nav-text\"\n                            :style=\"navStyle\"\n                        >\n                            <div\n                                :class=\"barClasses\"\n                                :style=\"barStyle\"\n                            ></div>\n                            <div\n                                :class=\"tabCls(item)\"\n                                v-for=\"(item, index) in navList\"\n                                :key=\"index\"\n                                @click=\"handleChange(index)\"\n                            >\n                                <template>{{ item.label }}</template>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div\n            :class=\"contentClasses\"\n            :style=\"contentStyle\"\n            ref=\"panes\"\n        >\n            <slot></slot>\n        </div>\n    </div>\n    ",
  mixins: [Ktu.mixins.emitter],
  provide: function provide() {
    return {
      TabsInstance: this
    };
  },
  props: {
    value: {
      type: [String, Number]
    },
    type: {
      validator: function validator(value) {
        return Ktu.oneOf(value, ["line", "card", "custom"]);
      },
      "default": "line"
    },
    size: {
      validator: function validator(value) {
        return Ktu.oneOf(value, ["small", "default"]);
      },
      "default": "default"
    },
    animated: {
      type: Boolean,
      "default": true
    },
    captureFocus: {
      type: Boolean,
      "default": false
    },
    closable: {
      type: Boolean,
      "default": false
    },
    beforeRemove: Function,
    // Tabs 嵌套时，用 name 区分层级
    name: {
      type: String
    },
    isButton: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      prefixCls: 'tabs',
      navList: [],
      barWidth: 0,
      barOffset: 0,
      activeKey: this.value,
      focusedKey: this.value,
      showSlot: false,
      navStyle: {
        transform: ""
      },
      scrollable: false,
      transitioning: false
    };
  },
  computed: {
    classes: function classes() {
      var _ref10;

      return ["".concat(this.prefixCls), (_ref10 = {}, _defineProperty(_ref10, "".concat(this.prefixCls, "-card"), this.type === "card"), _defineProperty(_ref10, "".concat(this.prefixCls, "-mini"), this.size === "small" && this.type === "line"), _defineProperty(_ref10, "".concat(this.prefixCls, "-no-animation"), !this.animated), _defineProperty(_ref10, "".concat(this.prefixCls, "-button"), this.isButton), _ref10)];
    },
    contentClasses: function contentClasses() {
      return ["".concat(this.prefixCls, "-content"), _defineProperty({}, "".concat(this.prefixCls, "-content-animated"), this.animated)];
    },
    barClasses: function barClasses() {
      return ["".concat(this.prefixCls, "-ink-bar"), _defineProperty({}, "".concat(this.prefixCls, "-ink-bar-animated"), this.animated)];
    },
    contentStyle: function contentStyle() {
      var x = this.getTabIndex(this.activeKey);
      var p = x === 0 ? "0%" : "-".concat(x, "00%");
      var style = {};

      if (x > -1) {
        style = {
          transform: "translateX(".concat(p, ") translateZ(0px)")
        };
      }

      return style;
    },
    barStyle: function barStyle() {
      var marginWidth = 0;

      if (this.isButton) {
        marginWidth = 2;
      }

      var style = {
        visibility: "hidden",
        width: "".concat(this.barWidth - marginWidth * 2, "px")
      };
      if (this.type === "line") style.visibility = "visible";

      if (this.animated) {
        style.transform = "translate3d(".concat(this.barOffset + marginWidth, "px, 0px, 0px)");
      } else {
        style.left = "".concat(this.barOffset, "px");
      }

      return style;
    }
  },
  methods: {
    getTabs: function getTabs() {
      var _this8 = this;

      // return this.$children.filter(item => item.$options.name === 'TabPane');
      var AllTabPanes = Ktu.findComponentsDownward(this, "TabPane");
      var TabPanes = [];
      AllTabPanes.forEach(function (item) {
        if (item.tab && _this8.name) {
          if (item.tab === _this8.name) {
            TabPanes.push(item);
          }
        } else {
          TabPanes.push(item);
        }
      }); // 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序

      TabPanes.sort(function (a, b) {
        if (a.index && b.index) {
          return a.index > b.index ? 1 : -1;
        }
      });
      return TabPanes;
    },
    updateNav: function updateNav() {
      var _this9 = this;

      this.navList = [];
      this.getTabs().forEach(function (pane, index) {
        _this9.navList.push({
          labelType: _typeof(pane.label),
          label: pane.label,
          icon: pane.icon || "",
          name: pane.currentName || index,
          disabled: pane.disabled,
          closable: pane.closable
        });

        if (!pane.currentName) pane.currentName = index;

        if (index === 0) {
          if (!_this9.activeKey) _this9.activeKey = pane.currentName || index;
        }
      });
      this.updateStatus();
      this.updateBar();
    },
    updateBar: function updateBar() {
      var _this10 = this;

      this.$nextTick(function () {
        var index = _this10.getTabIndex(_this10.activeKey);

        if (!_this10.$refs.nav) return; // 页面销毁时，这里会报错，为了解决 #2100

        var prevTabs = _this10.$refs.nav.querySelectorAll(".".concat(_this10.prefixCls, "-tab"));

        var tab = prevTabs[index];
        _this10.barWidth = tab ? parseFloat(tab.offsetWidth) : 0;

        if (index > 0) {
          var offset = 0;
          var gutter = _this10.size === "small" ? 0 : 0;

          for (var i = 0; i < index; i++) {
            offset += parseFloat(prevTabs[i].offsetWidth) + gutter;
          }

          _this10.barOffset = offset;
        } else {
          _this10.barOffset = 0;
        }

        _this10.updateNavScroll();
      });
    },
    updateStatus: function updateStatus() {
      var _this11 = this;

      var tabs = this.getTabs();
      tabs.forEach(function (tab) {
        return tab.show = tab.currentName === _this11.activeKey || _this11.animated;
      });
    },
    tabCls: function tabCls(item) {
      var _ref13;

      return ["".concat(this.prefixCls, "-tab"), (_ref13 = {}, _defineProperty(_ref13, "".concat(this.prefixCls, "-tab-disabled"), item.disabled), _defineProperty(_ref13, "".concat(this.prefixCls, "-tab-active"), item.name === this.activeKey), _defineProperty(_ref13, "".concat(this.prefixCls, "-tab-focused"), item.name === this.focusedKey), _ref13)];
    },
    handleChange: function handleChange(index) {
      var _this12 = this;

      if (this.transitioning) return;
      this.transitioning = true;
      setTimeout(function () {
        return _this12.transitioning = false;
      }, transitionTime);
      var nav = this.navList[index];
      if (nav.disabled) return;
      this.activeKey = nav.name;
      this.$emit("input", nav.name);
      this.$emit("on-click", nav.name);
    },
    handleTabKeyNavigation: function handleTabKeyNavigation(e) {
      if (e.keyCode !== 37 && e.keyCode !== 39) return;
      var direction = e.keyCode === 39 ? 1 : -1;
      var nextTab = getNextTab(this.navList, this.focusedKey, direction);
      this.focusedKey = nextTab.name;
    },
    handleTabKeyboardSelect: function handleTabKeyboardSelect() {
      var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (init) return;
      var focused = this.focusedKey || 0;
      var index = this.getTabIndex(focused);
      this.handleChange(index);
    },
    handleRemove: function handleRemove(index) {
      var _this13 = this;

      if (!this.beforeRemove) {
        return this.handleRemoveTab(index);
      }

      var before = this.beforeRemove(index);

      if (before && before.then) {
        before.then(function () {
          _this13.handleRemoveTab(index);
        });
      } else {
        this.handleRemoveTab(index);
      }
    },
    handleRemoveTab: function handleRemoveTab(index) {
      var tabs = this.getTabs();
      var tab = tabs[index];
      tab.$destroy();

      if (tab.currentName === this.activeKey) {
        var newTabs = this.getTabs();
        var activeKey = -1;

        if (newTabs.length) {
          var leftNoDisabledTabs = tabs.filter(function (item, itemIndex) {
            return !item.disabled && itemIndex < index;
          });
          var rightNoDisabledTabs = tabs.filter(function (item, itemIndex) {
            return !item.disabled && itemIndex > index;
          });

          if (rightNoDisabledTabs.length) {
            activeKey = rightNoDisabledTabs[0].currentName;
          } else if (leftNoDisabledTabs.length) {
            activeKey = leftNoDisabledTabs[leftNoDisabledTabs.length - 1].currentName;
          } else {
            activeKey = newTabs[0].currentName;
          }
        }

        this.activeKey = activeKey;
        this.$emit("input", activeKey);
      }

      this.$emit("on-tab-remove", tab.currentName);
      this.updateNav();
    },
    showClose: function showClose(item) {
      if (this.type === "card") {
        if (item.closable !== null) {
          return item.closable;
        } else {
          return this.closable;
        }
      } else {
        return false;
      }
    },
    scrollPrev: function scrollPrev() {
      var containerWidth = this.$refs.navScroll.offsetWidth;
      var currentOffset = this.getCurrentScrollOffset();
      if (!currentOffset) return;
      var newOffset = currentOffset > containerWidth ? currentOffset - containerWidth : 0;
      this.setOffset(newOffset);
    },
    scrollNext: function scrollNext() {
      var navWidth = this.$refs.nav.offsetWidth;
      var containerWidth = this.$refs.navScroll.offsetWidth;
      var currentOffset = this.getCurrentScrollOffset();
      if (navWidth - currentOffset <= containerWidth) return;
      var newOffset = navWidth - currentOffset > containerWidth * 2 ? currentOffset + containerWidth : navWidth - containerWidth;
      this.setOffset(newOffset);
    },
    getCurrentScrollOffset: function getCurrentScrollOffset() {
      var navStyle = this.navStyle;
      return navStyle.transform ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1]) : 0;
    },
    getTabIndex: function getTabIndex(name) {
      return this.navList.findIndex(function (nav) {
        return nav.name === name;
      });
    },
    setOffset: function setOffset(value) {
      this.navStyle.transform = "translateX(-".concat(value, "px)");
    },
    scrollToActiveTab: function scrollToActiveTab() {
      if (!this.scrollable) return;
      var nav = this.$refs.nav;
      var activeTab = this.$el.querySelector(".".concat(this.prefixCls, "-tab-active"));
      if (!activeTab) return;
      var navScroll = this.$refs.navScroll;
      var activeTabBounding = activeTab.getBoundingClientRect();
      var navScrollBounding = navScroll.getBoundingClientRect();
      var navBounding = nav.getBoundingClientRect();
      var currentOffset = this.getCurrentScrollOffset();
      var newOffset = currentOffset;

      if (navBounding.right < navScrollBounding.right) {
        newOffset = nav.offsetWidth - navScrollBounding.width;
      }

      if (activeTabBounding.left < navScrollBounding.left) {
        newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
      } else if (activeTabBounding.right > navScrollBounding.right) {
        newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
      }

      if (currentOffset !== newOffset) {
        this.setOffset(Math.max(newOffset, 0));
      }
    },
    updateNavScroll: function updateNavScroll() {
      var navWidth = this.$refs.nav.offsetWidth;
      var containerWidth = this.$refs.navScroll.offsetWidth;
      var currentOffset = this.getCurrentScrollOffset();

      if (containerWidth < navWidth) {
        this.scrollable = true;

        if (navWidth - currentOffset < containerWidth) {
          this.setOffset(navWidth - containerWidth);
        }
      } else {
        this.scrollable = false;

        if (currentOffset > 0) {
          this.setOffset(0);
        }
      }
    },
    handleResize: function handleResize() {
      this.updateNavScroll();
    },
    isInsideHiddenElement: function isInsideHiddenElement() {
      var parentNode = this.$el.parentNode;

      while (parentNode && parentNode !== document.body) {
        if (parentNode.style && parentNode.style.display === "none") {
          return parentNode;
        }

        parentNode = parentNode.parentNode;
      }

      return false;
    },
    updateVisibility: function updateVisibility(index) {
      var _this14 = this;

      _toConsumableArray(this.$refs.panes.querySelectorAll(".".concat(this.prefixCls, "-tabpane"))).forEach(function (el, i) {
        if (index === i) {
          _toConsumableArray(el.children).filter(function (child) {
            return child.classList.contains("".concat(_this14.prefixCls, "-tabpane"));
          }).forEach(function (child) {
            return child.style.visibility = "visible";
          });

          if (_this14.captureFocus) setTimeout(function () {
            return focusFirst(el, el);
          }, transitionTime);
        } else {
          setTimeout(function () {
            _toConsumableArray(el.children).filter(function (child) {
              return child.classList.contains("".concat(_this14.prefixCls, "-tabpane"));
            }).forEach(function (child) {
              return child.style.visibility = "hidden";
            });
          }, transitionTime);
        }
      });
    }
  },
  watch: {
    value: function value(val) {
      this.activeKey = val;
      this.focusedKey = val;
    },
    activeKey: function activeKey(val) {
      var _this15 = this;

      this.focusedKey = val;
      this.updateBar();
      this.updateStatus();
      this.emitterBroadcast("Table", "on-visible-change", true);
      this.$nextTick(function () {
        _this15.scrollToActiveTab();
      }); // update visibility

      var nextIndex = Math.max(this.getTabIndex(this.focusedKey), 0);
      this.updateVisibility(nextIndex);
    }
  },
  mounted: function mounted() {
    var _this16 = this;

    this.showSlot = this.$slots.extra !== undefined;
    var hiddenParentNode = this.isInsideHiddenElement();

    if (hiddenParentNode) {
      this.mutationObserver = new Ktu.MutationObserver(function () {
        if (hiddenParentNode.style.display !== "none") {
          _this16.updateBar();

          _this16.mutationObserver.disconnect();
        }
      });
      this.mutationObserver.observe(hiddenParentNode, {
        attributes: true,
        childList: true,
        characterData: true,
        attributeFilter: ["style"]
      });
    }

    this.handleTabKeyboardSelect(true);
    this.updateVisibility(this.getTabIndex(this.activeKey));
  },
  beforeDestroy: function beforeDestroy() {
    if (this.mutationObserver) this.mutationObserver.disconnect();
  }
});
Vue.component('app-view', {
  template: "\n        <div class=\"app-view\">\n            <router-view></router-view>\n        </div>\n    ",
  props: {},
  data: function data() {
    return {};
  },
  computed: {},
  created: function created() {}
});
Ktu.router.Collapse = Vue.extend({
  template: "\n        <div class=\"comtent\">\n            <h2>Collapse \u6298\u53E0\u9762\u677F</h2>\n            <div class=\"content-item\">\n                <h3> \u7B80\u5355\u6837\u5F0F </h3>\n                <button @click=\"value1 = '2'\">aaaa</button>\n                <template>\n                    <Collapse v-model=\"value1\">\n                        <Panel name=\"1\">\n                            \u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\n                            <p slot=\"content\">\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\uFF08Steve Jobs\uFF09\uFF0C1955\u5E742\u670824\u65E5\u751F\u4E8E\u7F8E\u56FD\u52A0\u5229\u798F\u5C3C\u4E9A\u5DDE\u65E7\u91D1\u5C71\uFF0C\u7F8E\u56FD\u53D1\u660E\u5BB6\u3001\u4F01\u4E1A\u5BB6\u3001\u7F8E\u56FD\u82F9\u679C\u516C\u53F8\u8054\u5408\u521B\u529E\u4EBA\u3002</p>\n                        </Panel>\n                        <Panel name=\"2\">\n                            \u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\n                            <p slot=\"content\">\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\uFF08Stephen Gary Wozniak\uFF09\uFF0C\u7F8E\u56FD\u7535\u8111\u5DE5\u7A0B\u5E08\uFF0C\u66FE\u4E0E\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\u5408\u4F19\u521B\u7ACB\u82F9\u679C\u7535\u8111\uFF08\u4ECA\u4E4B\u82F9\u679C\u516C\u53F8\uFF09\u3002\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\u66FE\u5C31\u8BFB\u4E8E\u7F8E\u56FD\u79D1\u7F57\u62C9\u591A\u5927\u5B66\uFF0C\u540E\u8F6C\u5B66\u5165\u7F8E\u56FD\u8457\u540D\u9AD8\u7B49\u5B66\u5E9C\u52A0\u5DDE\u5927\u5B66\u4F2F\u514B\u5229\u5206\u6821\uFF08UC Berkeley\uFF09\u5E76\u83B7\u5F97\u7535\u673A\u5DE5\u7A0B\u53CA\u8BA1\u7B97\u673A\uFF08EECS\uFF09\u672C\u79D1\u5B66\u4F4D\uFF081987\u5E74\uFF09\u3002</p>\n                        </Panel>\n                        <Panel name=\"3\">\n                            \u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\n                            <p slot=\"content\">\u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\u662F\u4E00\u4F4D\u5DE5\u4E1A\u8BBE\u8BA1\u5E08\uFF0C\u73B0\u4EFBApple\u516C\u53F8\u8BBE\u8BA1\u5E08\u517C\u8D44\u6DF1\u526F\u603B\u88C1\uFF0C\u82F1\u56FD\u7235\u58EB\u3002\u4ED6\u66FE\u53C2\u4E0E\u8BBE\u8BA1\u4E86iPod\uFF0CiMac\uFF0CiPhone\uFF0CiPad\u7B49\u4F17\u591A\u82F9\u679C\u4EA7\u54C1\u3002\u9664\u4E86\u4E54\u5E03\u65AF\uFF0C\u4ED6\u662F\u5BF9\u82F9\u679C\u90A3\u4E9B\u8457\u540D\u7684\u4EA7\u54C1\u6700\u6709\u5F71\u54CD\u529B\u7684\u4EBA\u3002</p>\n                        </Panel>\n                    </Collapse>\n                </template>\n                \n                \n            </div>\n    \n            <div class=\"content-item\">\n                <h3> \u624B\u98CE\u7434 </h3>\n    \n                <template>\n                    <Collapse v-model=\"value2\" accordion>\n                        <Panel name=\"1\">\n                            \u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\n                            <p slot=\"content\">\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\uFF08Steve Jobs\uFF09\uFF0C1955\u5E742\u670824\u65E5\u751F\u4E8E\u7F8E\u56FD\u52A0\u5229\u798F\u5C3C\u4E9A\u5DDE\u65E7\u91D1\u5C71\uFF0C\u7F8E\u56FD\u53D1\u660E\u5BB6\u3001\u4F01\u4E1A\u5BB6\u3001\u7F8E\u56FD\u82F9\u679C\u516C\u53F8\u8054\u5408\u521B\u529E\u4EBA\u3002</p>\n                        </Panel>\n                        <Panel name=\"2\">\n                            \u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\n                            <p slot=\"content\">\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\uFF08Stephen Gary Wozniak\uFF09\uFF0C\u7F8E\u56FD\u7535\u8111\u5DE5\u7A0B\u5E08\uFF0C\u66FE\u4E0E\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\u5408\u4F19\u521B\u7ACB\u82F9\u679C\u7535\u8111\uFF08\u4ECA\u4E4B\u82F9\u679C\u516C\u53F8\uFF09\u3002\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\u66FE\u5C31\u8BFB\u4E8E\u7F8E\u56FD\u79D1\u7F57\u62C9\u591A\u5927\u5B66\uFF0C\u540E\u8F6C\u5B66\u5165\u7F8E\u56FD\u8457\u540D\u9AD8\u7B49\u5B66\u5E9C\u52A0\u5DDE\u5927\u5B66\u4F2F\u514B\u5229\u5206\u6821\uFF08UC Berkeley\uFF09\u5E76\u83B7\u5F97\u7535\u673A\u5DE5\u7A0B\u53CA\u8BA1\u7B97\u673A\uFF08EECS\uFF09\u672C\u79D1\u5B66\u4F4D\uFF081987\u5E74\uFF09\u3002</p>\n                        </Panel>\n                        <Panel name=\"3\">\n                            \u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\n                            <p slot=\"content\">\u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\u662F\u4E00\u4F4D\u5DE5\u4E1A\u8BBE\u8BA1\u5E08\uFF0C\u73B0\u4EFBApple\u516C\u53F8\u8BBE\u8BA1\u5E08\u517C\u8D44\u6DF1\u526F\u603B\u88C1\uFF0C\u82F1\u56FD\u7235\u58EB\u3002\u4ED6\u66FE\u53C2\u4E0E\u8BBE\u8BA1\u4E86iPod\uFF0CiMac\uFF0CiPhone\uFF0CiPad\u7B49\u4F17\u591A\u82F9\u679C\u4EA7\u54C1\u3002\u9664\u4E86\u4E54\u5E03\u65AF\uFF0C\u4ED6\u662F\u5BF9\u82F9\u679C\u90A3\u4E9B\u8457\u540D\u7684\u4EA7\u54C1\u6700\u6709\u5F71\u54CD\u529B\u7684\u4EBA\u3002</p>\n                        </Panel>\n                    </Collapse>\n                </template>\n    \n            </div>\n    \n    \n            <div class=\"content-item\">\n                <h3> \u9762\u677F\u5D4C\u5957 </h3>\n    \n                <template>\n                    <Collapse accordion v-model=\"value3\">\n                        <Panel name=\"1\">\n                            \u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\n                            <div slot=\"content\">\n                                \u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\uFF08Steve Jobs\uFF09\uFF0C1955\u5E742\u670824\u65E5\u751F\u4E8E\u7F8E\u56FD\u52A0\u5229\u798F\u5C3C\u4E9A\u5DDE\u65E7\u91D1\u5C71\uFF0C\u7F8E\u56FD\u53D1\u660E\u5BB6\u3001\u4F01\u4E1A\u5BB6\u3001\u7F8E\u56FD\u82F9\u679C\u516C\u53F8\u8054\u5408\u521B\u529E\u4EBA\u3002\n                                <Collapse accordion v-model=\"value4\">\n                                    <Panel name=\"1-1\">\n                                        iPhone\n                                        <p slot=\"content\">iPhone\uFF0C\u662F\u7F8E\u56FD\u82F9\u679C\u516C\u53F8\u7814\u53D1\u7684\u667A\u80FD\u624B\u673A\uFF0C\u5B83\u642D\u8F7DiOS\u64CD\u4F5C\u7CFB\u7EDF\u3002\u7B2C\u4E00\u4EE3iPhone\u4E8E2007\u5E741\u67089\u65E5\u7531\u82F9\u679C\u516C\u53F8\u524D\u9996\u5E2D\u6267\u884C\u5B98\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\u53D1\u5E03\uFF0C\u5E76\u57282007\u5E746\u670829\u65E5\u6B63\u5F0F\u53D1\u552E\u3002</p>\n                                    </Panel>\n                                    <Panel name=\"1-2\">\n                                        iPad\n                                        <p slot=\"content\">iPad\u662F\u7531\u82F9\u679C\u516C\u53F8\u4E8E2010\u5E74\u5F00\u59CB\u53D1\u5E03\u7684\u5E73\u677F\u7535\u8111\u7CFB\u5217\uFF0C\u5B9A\u4F4D\u4ECB\u4E8E\u82F9\u679C\u7684\u667A\u80FD\u624B\u673AiPhone\u548C\u7B14\u8BB0\u672C\u7535\u8111\u4EA7\u54C1\u4E4B\u95F4\uFF0C\uFF08\u5C4F\u5E55\u4E2D\u67094\u4E2A\u865A\u62DF\u7A0B\u5E8F\u56FA\u5B9A\u680F\uFF09\u4E0EiPhone\u5E03\u5C40\u4E00\u6837\uFF0C\u63D0\u4F9B\u6D4F\u89C8\u7F51\u7AD9\u3001\u6536\u53D1\u7535\u5B50\u90AE\u4EF6\u3001\u89C2\u770B\u7535\u5B50\u4E66\u3001\u64AD\u653E\u97F3\u9891\u6216\u89C6\u9891\u3001\u73A9\u6E38\u620F\u7B49\u529F\u80FD\u3002\u7531\u82F1\u56FD\u51FA\u751F\u7684\u8BBE\u8BA1\u4E3B\u7BA1\u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\uFF08Jonathan Ive\uFF09\uFF08\u6709\u4E9B\u7FFB\u8BD1\u4E3A \u4E54\u7EB3\u68EE\xB7\u827E\u7EF4\uFF09\u9886\u5BFC\u7684\u56E2\u961F\u8BBE\u8BA1\u7684\uFF0C\u8FD9\u4E2A\u5706\u6ED1\u3001\u8D85\u8584\u7684\u4EA7\u54C1\u53CD\u6620\u51FA\u4E86\u4F0A\u592B\u5BF9\u5FB7\u56FD\u5929\u624D\u8BBE\u8BA1\u5E08Dieter Rams\u7684\u5D07\u656C\u4E4B\u60C5\u3002</p>\n                                    </Panel>\n                                </Collapse>\n                            </div>\n                        </Panel>\n                        <Panel name=\"2\">\n                            \u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\n                            <p slot=\"content\">\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\uFF08Stephen Gary Wozniak\uFF09\uFF0C\u7F8E\u56FD\u7535\u8111\u5DE5\u7A0B\u5E08\uFF0C\u66FE\u4E0E\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\u5408\u4F19\u521B\u7ACB\u82F9\u679C\u7535\u8111\uFF08\u4ECA\u4E4B\u82F9\u679C\u516C\u53F8\uFF09\u3002\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\u66FE\u5C31\u8BFB\u4E8E\u7F8E\u56FD\u79D1\u7F57\u62C9\u591A\u5927\u5B66\uFF0C\u540E\u8F6C\u5B66\u5165\u7F8E\u56FD\u8457\u540D\u9AD8\u7B49\u5B66\u5E9C\u52A0\u5DDE\u5927\u5B66\u4F2F\u514B\u5229\u5206\u6821\uFF08UC Berkeley\uFF09\u5E76\u83B7\u5F97\u7535\u673A\u5DE5\u7A0B\u53CA\u8BA1\u7B97\u673A\uFF08EECS\uFF09\u672C\u79D1\u5B66\u4F4D\uFF081987\u5E74\uFF09\u3002</p>\n                        </Panel>\n                        <Panel name=\"3\">\n                            \u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\n                            <p slot=\"content\">\u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\u662F\u4E00\u4F4D\u5DE5\u4E1A\u8BBE\u8BA1\u5E08\uFF0C\u73B0\u4EFBApple\u516C\u53F8\u8BBE\u8BA1\u5E08\u517C\u8D44\u6DF1\u526F\u603B\u88C1\uFF0C\u82F1\u56FD\u7235\u58EB\u3002\u4ED6\u66FE\u53C2\u4E0E\u8BBE\u8BA1\u4E86iPod\uFF0CiMac\uFF0CiPhone\uFF0CiPad\u7B49\u4F17\u591A\u82F9\u679C\u4EA7\u54C1\u3002\u9664\u4E86\u4E54\u5E03\u65AF\uFF0C\u4ED6\u662F\u5BF9\u82F9\u679C\u90A3\u4E9B\u8457\u540D\u7684\u4EA7\u54C1\u6700\u6709\u5F71\u54CD\u529B\u7684\u4EBA\u3002</p>\n                        </Panel>\n                    </Collapse>\n                </template>\n    \n            </div>\n    \n            <div class=\"content-item\">\n                <h3> \u7B80\u6D01\u6A21\u5F0F </h3> \n    \n                <template>\n                    <Collapse simple>\n                        <Panel name=\"1\">\n                            \u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\n                            <p slot=\"content\">\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\uFF08Steve Jobs\uFF09\uFF0C1955\u5E742\u670824\u65E5\u751F\u4E8E\u7F8E\u56FD\u52A0\u5229\u798F\u5C3C\u4E9A\u5DDE\u65E7\u91D1\u5C71\uFF0C\u7F8E\u56FD\u53D1\u660E\u5BB6\u3001\u4F01\u4E1A\u5BB6\u3001\u7F8E\u56FD\u82F9\u679C\u516C\u53F8\u8054\u5408\u521B\u529E\u4EBA\u3002</p>\n                        </Panel>\n                        <Panel name=\"2\">\n                            \u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\n                            <p slot=\"content\">\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\uFF08Stephen Gary Wozniak\uFF09\uFF0C\u7F8E\u56FD\u7535\u8111\u5DE5\u7A0B\u5E08\uFF0C\u66FE\u4E0E\u53F2\u8482\u592B\xB7\u4E54\u5E03\u65AF\u5408\u4F19\u521B\u7ACB\u82F9\u679C\u7535\u8111\uFF08\u4ECA\u4E4B\u82F9\u679C\u516C\u53F8\uFF09\u3002\u65AF\u8482\u592B\xB7\u76D6\u745E\xB7\u6C83\u5179\u5C3C\u4E9A\u514B\u66FE\u5C31\u8BFB\u4E8E\u7F8E\u56FD\u79D1\u7F57\u62C9\u591A\u5927\u5B66\uFF0C\u540E\u8F6C\u5B66\u5165\u7F8E\u56FD\u8457\u540D\u9AD8\u7B49\u5B66\u5E9C\u52A0\u5DDE\u5927\u5B66\u4F2F\u514B\u5229\u5206\u6821\uFF08UC Berkeley\uFF09\u5E76\u83B7\u5F97\u7535\u673A\u5DE5\u7A0B\u53CA\u8BA1\u7B97\u673A\uFF08EECS\uFF09\u672C\u79D1\u5B66\u4F4D\uFF081987\u5E74\uFF09\u3002</p>\n                        </Panel>\n                        <Panel name=\"3\">\n                            \u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\n                            <p slot=\"content\">\u4E54\u7EB3\u68EE\xB7\u4F0A\u592B\u662F\u4E00\u4F4D\u5DE5\u4E1A\u8BBE\u8BA1\u5E08\uFF0C\u73B0\u4EFBApple\u516C\u53F8\u8BBE\u8BA1\u5E08\u517C\u8D44\u6DF1\u526F\u603B\u88C1\uFF0C\u82F1\u56FD\u7235\u58EB\u3002\u4ED6\u66FE\u53C2\u4E0E\u8BBE\u8BA1\u4E86iPod\uFF0CiMac\uFF0CiPhone\uFF0CiPad\u7B49\u4F17\u591A\u82F9\u679C\u4EA7\u54C1\u3002\u9664\u4E86\u4E54\u5E03\u65AF\uFF0C\u4ED6\u662F\u5BF9\u82F9\u679C\u90A3\u4E9B\u8457\u540D\u7684\u4EA7\u54C1\u6700\u6709\u5F71\u54CD\u529B\u7684\u4EBA\u3002</p>\n                        </Panel>\n                    </Collapse>\n                </template>\n    \n            </div>\n        </div>\n      ",
  data: function data() {
    return {
      value1: '1',
      value2: '1',
      value3: '1',
      value4: '1-1'
    };
  },
  created: function created() {},
  computed: {},
  watch: {},
  mounted: function mounted() {},
  methods: {}
});
Ktu.router.Compoment = Vue.extend({
  name: 'Compoment',
  template: "\n        <div class=\"comp-view\">\n            <div class=\"comp-nav\">\n                <ul class=\"nav-list\">\n                    <li\n                        class=\"nav-item\"\n                        :class=\"{'active' : index === active }\"\n                        v-for=\"(item,index) in routerList\"\n                        :key=\"item.key\"\n                        @click=\"change( index )\"\n                    >\n                        <span v-text=\"item.name\"></span>\n                    </li>\n                </ul>\n            </div>\n\n            <div class=\"comp-content\">\n                <router-view></router-view>\n            </div>\n        </div>\n    ",
  data: function data() {
    return {
      routerList: Ktu.config.router,
      active: -1,
      parentPath: "/Components/"
    };
  },
  created: function created() {},
  computed: {},
  watch: {},
  mounted: function mounted() {
    this.change(0);
  },
  methods: {
    change: function change(index) {
      if (index != this.active) {
        var item = this.routerList[index];
        var key = item.key;
        var path = this.parentPath + key;
        this.$router.push({
          path: path
        });
        this.active = index;
      }
    }
  }
});
Ktu.router.Input = Vue.extend({
  template: "\n        <div class=\"comtent\">\n            <h2> \u8F93\u5165\u6846 Input </h2>\n\n            <div class=\"content-item\">\n                <h3>\u7B80\u5355\u6837\u5F0F</h3>\n                <Input\n                    v-model=\"value\"\n                    placeholder=\"Enter something...\"\n                    style=\"width: 300px\"\n                />\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u4E0D\u540C\u5927\u5C0F</h3>\n                <template>\n                    <Input\n                        v-model=\"value1\"\n                        size=\"large\"\n                        placeholder=\"large size\"\n                    />\n                    <br>\n                    <Input\n                        v-model=\"value2\"\n                        placeholder=\"default size\"\n                    />\n                    <br>\n                    <Input\n                        v-model=\"value3\"\n                        size=\"small\"\n                        placeholder=\"small size\"\n                    />\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u6E05\u9664\u6837\u5F0F</h3>\n                <template>\n                    <Input\n                        v-model=\"value1\"\n                        placeholder=\"Enter something...\"\n                        clearable\n                        style=\"width: 200px\"\n                    />\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u5E26\u56FE\u6807</h3>\n                <template>\n                    <Input\n                        v-model=\"value1\"\n                        icon=\"svg-close-2\"\n                        placeholder=\"Enter something...\"\n                        style=\"width: 200px\"\n                    />\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u5E26\u56FE\u6807 \u524D\u7F00\u548C\u540E\u7F00\u56FE\u6807</h3>\n\n                <template>\n                    <div>\n                        Props\uFF1A\n                        <Input\n                            prefix=\"svg-close-2\"\n                            placeholder=\"Enter name\"\n                            style=\"width: auto\"\n                        />\n                        <Input\n                            suffix=\"close-2\"\n                            placeholder=\"Enter text\"\n                            style=\"width: auto\"\n                        />\n                    </div>\n                    <div style=\"margin-top: 6px\">\n                        Slots\uFF1A\n                        <Input\n                            placeholder=\"Enter name\"\n                            style=\"width: auto\"\n                        >\n                        <icon\n                            id=\"#svg-close-2\"\n                            slot=\"prefix\"\n                        ></icon>\n                        </Input>\n                        <Input\n                            placeholder=\"Enter text\"\n                            style=\"width: auto\"\n                        >\n                        <icon\n                            id=\"#svg-close-2\"\n                            slot=\"suffix\"\n                        ></icon>\n                        </Input>\n                    </div>\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u81EA\u5E26\u641C\u7D22\u6309\u94AE</h3>\n\n                <template>\n                    <div>\n                        <Input\n                            search\n                            placeholder=\"Enter something...\"\n                        />\n                        <Input\n                            search\n                            enter-button\n                            placeholder=\"Enter something...\"\n                        />\n                        <Input\n                            search\n                            enter-button=\"Search\"\n                            placeholder=\"Enter something...\"\n                        />\n                    </div>\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u6587\u672C\u6846</h3>\n                <template>\n                    <Input\n                        v-model=\"value5\"\n                        type=\"textarea\"\n                        placeholder=\"Enter something...\"\n                    />\n                    <Input\n                        v-model=\"value6\"\n                        type=\"textarea\"\n                        :rows=\"4\"\n                        placeholder=\"Enter something...\"\n                    />\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u81EA\u52A8\u9002\u5E94\u9AD8\u5EA6\u7684\u6587\u672C\u6846</h3>\n                <template>\n                    <Input\n                        v-model=\"value7\"\n                        type=\"textarea\"\n                        :autosize=\"true\"\n                        placeholder=\"Enter something...\"\n                    />\n                    <Input\n                        v-model=\"value8\"\n                        type=\"textarea\"\n                        :autosize=\"{minRows: 2,maxRows: 5}\"\n                        placeholder=\"Enter something...\"\n                    />\n                </template>\n            </div>\n\n            <div class=\"content-item\">\n                <h3>\u4E0D\u53EF\u8F93\u5165\u7684\u6587\u672C\u6846</h3>\n                <template>\n                    <Input\n                        v-model=\"value9\"\n                        disabled\n                        placeholder=\"Enter something...\"\n                    />\n                    <Input\n                        v-model=\"value10\"\n                        disabled\n                        type=\"textarea\"\n                        placeholder=\"Enter something...\"\n                    />\n                </template>\n            </div>\n        </div>\n      ",
  data: function data() {
    return {
      value: "",
      value1: "",
      value2: "",
      value3: "",
      value5: "",
      value6: "",
      value7: "",
      value8: "",
      value9: "",
      value10: "",
      value11: "",
      value12: "",
      value13: "",
      select1: "http",
      select2: "com",
      select3: "day"
    };
  },
  created: function created() {},
  computed: {},
  watch: {},
  mounted: function mounted() {},
  methods: {}
});
Ktu.router.Menu = Vue.extend({
  template: "\n        <div class=\"comtent\">\n            <h2>Menu \u5BFC\u822A\u680F</h2>\n            <div class=\"content-item\">\n                <h3>\u6C34\u5E73\u5BFC\u822A</h3>\n                <template>\n                    <Menu\n                        mode=\"horizontal\"\n                        active-name=\"1\"\n                        @on-select=\"select\"\n                    >\n                        <MenuItem name=\"0\">\n                            \u5185\u5BB9\u7BA1\u7406\n                        </MenuItem>\n                        <MenuItem name=\"1\">\n                            \u7528\u6237\u7BA1\u7406\n                        </MenuItem>\n                        <MenuItem name=\"2\">\n                            \u7EFC\u5408\u8BBE\u7F6E\n                        </MenuItem>\n                    </Menu>\n                </template>\n                \n                <h3>\u4E8C\u7EA7\u5BFC\u822A</h3>\n                <template>\n                    <Menu\n                        mode=\"horizontal\"\n                        active-name=\"1\"\n                        @on-select=\"select\"\n                    >\n                       <MenuItem name=\"0\">\u7528\u6237\u7BA1\u7406</MenuItem>\n                       <Submenu name=\"1\">\n                            <template slot=\"title\">\n                                \u5185\u5BB9\u7BA1\u7406\n                            </template>\n                            <MenuItem name=\"1-1\">\u6587\u7AE0\u7BA1\u7406</MenuItem>\n                            <MenuItem name=\"1-2\">\u8BC4\u8BBA\u7BA1\u7406</MenuItem>\n                            <MenuItem name=\"1-3\">\u4E3E\u62A5\u7BA1\u7406</MenuItem>\n                        </Submenu>\n                        <Submenu name=\"2\">\n                            <template slot=\"title\">\n                                \u7528\u6237\u7BA1\u7406\n                            </template>\n                            <MenuItem name=\"2-1\">\u65B0\u589E\u7528\u6237</MenuItem>\n                            <MenuItem name=\"2-2\">\u6D3B\u8DC3\u7528\u6237</MenuItem>\n                            <MenuItem name=\"2-3\">\u50BB\u5B50\u7528\u6237</MenuItem>\n                        </Submenu>\n                    </Menu>\n                </template>\n            </div>\n            \n            <div class=\"content-item\" style=\"margin-top: 200px;\">\n                <h3>\u5782\u76F4\u5BFC\u822A</h3>\n                <template>\n                    <Menu\n                        mode=\"vertical\"\n                        active-name=\"0\"\n                        @on-select=\"select\"\n                    >\n                        <MenuItem name=\"0\">\n                            \u5185\u5BB9\u7BA1\u7406\n                        </MenuItem>\n                        <MenuItem name=\"1\">\n                            \u7528\u6237\u7BA1\u7406\n                        </MenuItem>\n                        <MenuItem name=\"2\">\n                            \u7EFC\u5408\u8BBE\u7F6E\n                        </MenuItem>\n                    </Menu>\n                </template>\n                \n                <h3>\u5782\u76F4\u4E8C\u7EA7\u5BFC\u822A</h3>\n                <template>\n                    <Menu\n                        mode=\"vertical\"\n                        active-name=\"1\"\n                        @on-select=\"select\"\n                    >\n                       <MenuItem name=\"0\">\u7528\u6237\u7BA1\u7406</MenuItem>\n                       <Submenu name=\"1\">\n                            <template slot=\"title\">\n                                \u5185\u5BB9\u7BA1\u7406\n                            </template>\n                            <MenuItem name=\"1-1\">\u6587\u7AE0\u7BA1\u7406</MenuItem>\n                            <MenuItem name=\"1-2\">\u8BC4\u8BBA\u7BA1\u7406</MenuItem>\n                            <MenuItem name=\"1-3\">\u4E3E\u62A5\u7BA1\u7406</MenuItem>\n                        </Submenu>\n                        <Submenu name=\"2\">\n                            <template slot=\"title\">\n                                \u7528\u6237\u7BA1\u7406\n                            </template>\n                            <MenuItem name=\"2-1\">\u65B0\u589E\u7528\u6237</MenuItem>\n                            <MenuItem name=\"2-2\">\u6D3B\u8DC3\u7528\u6237</MenuItem>\n                            <MenuItem name=\"2-3\">\u50BB\u5B50\u7528\u6237</MenuItem>\n                        </Submenu>\n                    </Menu>\n                </template>\n            </div>\n        </div>\n      ",
  data: function data() {
    return {
      value1: '1',
      value2: '1',
      value3: '1',
      value4: '1-1'
    };
  },
  created: function created() {},
  computed: {},
  watch: {},
  mounted: function mounted() {},
  methods: {
    select: function select(name) {
      console.log(name);
    }
  }
});
Ktu.router.Tabs = Vue.extend({
  template: "\n        <div class=\"comtent\">\n            <h2>Collapse \u6298\u53E0\u9762\u677F</h2>\n            <div class=\"content-item\">\n                <h3> \u7B80\u5355\u6837\u5F0F </h3>\n                <template>\n                    <Tabs value=\"name1\" style=\"width: 272px;\" :is-button=\"true\" >\n                        <TabPane\n                                label=\"\u6807\u7B7E\u4E00\"\n                                name=\"name1\"\n                        >\u6807\u7B7E\u4E00\u7684\u5185\u5BB9</TabPane>\n                        <TabPane\n                                label=\"\u6807\u7B7E\u4E8C\"\n                                name=\"name2\"\n                        >\u6807\u7B7E\u4E8C\u7684\u5185\u5BB9</TabPane>\n                    </Tabs>\n                </template>\n            </div>\n        </div>\n      ",
  data: function data() {
    return {
      value1: '1',
      value2: '1',
      value3: '1',
      value4: '1-1'
    };
  },
  created: function created() {},
  computed: {},
  watch: {},
  mounted: function mounted() {},
  methods: {}
});
Ktu.router = new VueRouter({
  esModule: false,
  routes: [{
    path: '/Components',
    component: Ktu.router.Compoment,
    children: function () {
      var routerList = [];
      Ktu.config.router.forEach(function (item) {
        var key = item.key;
        routerList.push({
          path: key,
          component: Ktu.router[key]
        });
      });
      return routerList;
    }()
  }, {
    path: '*',
    redirect: '/Components'
  }]
});
Ktu.vm = new Vue({
  el: '#app',
  data: {
    hasLoaded: false
  },
  router: Ktu.router,
  computed: {},
  mounted: function mounted() {},
  methods: {}
});