(function (exports) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Connection = function () {
    function Connection(output, input) {
        classCallCheck(this, Connection);

        this.output = output;
        this.input = input;

        this.input.addConnection(this);
    }

    createClass(Connection, [{
        key: "remove",
        value: function remove() {
            this.input.removeConnection(this);
            this.output.removeConnection(this, false);
        }
    }]);
    return Connection;
}();

var ContextMenu = function () {
    function ContextMenu(template, items) {
        var _this = this;

        classCallCheck(this, ContextMenu);

        this.visible = false;
        this.x = 0;
        this.y = 0;
        this.items = items;

        this.$cd = alight.ChangeDetector();
        this.$cd.scope.contextMenu = this;

        d3.text(template, function (error, text) {
            if (error) throw error;
            var dom = d3.select('body').append('div');

            dom.html(text);
            alight.bind(_this.$cd, dom.node());
        });
    }

    createClass(ContextMenu, [{
        key: 'searchItems',
        value: function searchItems(filter) {
            var regex = new RegExp(filter, 'i');

            var items = Object.assign({}, this.items);

            Object.keys(items).forEach(function (key) {
                items[key] = Object.assign({}, items[key]);
            });

            Object.keys(items).forEach(function (itemKey) {
                var itemObj = items[itemKey];

                Object.keys(itemObj).forEach(function (subitem) {
                    if (!regex.test(subitem)) delete itemObj[subitem];
                });

                if (Object.keys(itemObj).length === 0) delete items[itemKey];
            });

            return items;
        }
    }, {
        key: 'onCilck',
        value: function onCilck(subitem) {
            throw new TypeError('onClick should be overrided');
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return this.visible;
        }
    }, {
        key: 'show',
        value: function show(x, y) {
            this.visible = true;
            this.x = x;
            this.y = y;
            this.$cd.scan();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.visible = false;
            this.$cd.scan();
        }
    }]);
    return ContextMenu;
}();

var Block = function Block() {
    classCallCheck(this, Block);

    if (this.constructor === Block) throw new TypeError('Cannot construct Block instances');

    this.position = [0.0, 0.0];
};

var Input = function () {
    function Input(title, socket, multipleConnections) {
        classCallCheck(this, Input);

        this.node = null;
        this.multipleConnections = multipleConnections || false;
        this.connections = [];
        this.title = title;
        this.socket = socket;
        this.control = null;
    }

    createClass(Input, [{
        key: 'hasConnection',
        value: function hasConnection() {
            return this.connections.length > 0;
        }
    }, {
        key: 'addConnection',
        value: function addConnection(c) {
            if (!this.multipleConnections && this.hasConnection()) throw new Error('Multiple connections not allowed');
            this.connections.push(c);
        }
    }, {
        key: 'removeConnection',
        value: function removeConnection(connection) {
            this.connections.splice(this.connections.indexOf(connection), 1);
        }
    }, {
        key: 'removeConnections',
        value: function removeConnections() {
            this.connections.forEach(function (c) {
                return c.remove();
            });
        }
    }, {
        key: 'addControl',
        value: function addControl(control) {
            this.control = control;
            control.parent = this;
        }
    }, {
        key: 'showControl',
        value: function showControl() {
            return !this.hasConnection() && this.control !== null;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                'connections': this.connections.map(function (c) {
                    return {
                        node: c.output.node.id,
                        output: c.output.node.outputs.indexOf(c.output)
                    };
                })
            };
        }
    }]);
    return Input;
}();

var Output = function () {
    function Output(title, socket) {
        classCallCheck(this, Output);

        this.node = null;
        this.connections = [];

        this.title = title;
        this.socket = socket;
    }

    createClass(Output, [{
        key: 'connectTo',
        value: function connectTo(input) {
            if (!(input instanceof Input)) throw new Error('Invalid input');
            if (!this.socket.compatibleWith(input.socket)) throw new Error('Sockets not compatible');
            if (!input.multipleConnections && input.hasConnection()) throw new Error('Input already has one connection');

            var connection = new Connection(this, input);

            this.connections.push(connection);
            return connection;
        }
    }, {
        key: 'connectedTo',
        value: function connectedTo(input) {
            return this.connections.some(function (item) {
                return item.input === input;
            });
        }
    }, {
        key: 'removeConnection',
        value: function removeConnection(connection) {
            var propagate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            this.connections.splice(this.connections.indexOf(connection), 1);
            if (propagate) connection.remove();
        }
    }, {
        key: 'removeConnections',
        value: function removeConnections() {
            this.connections.forEach(function (connection) {
                connection.remove();
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                'connections': this.connections.map(function (c) {
                    return {
                        node: c.input.node.id,
                        input: c.input.node.inputs.indexOf(c.input)
                    };
                })
            };
        }
    }]);
    return Output;
}();

var Node = function (_Block) {
    inherits(Node, _Block);

    function Node(title) {
        classCallCheck(this, Node);

        var _this = possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

        _this.id = Node.incrementId();
        _this.group = null;
        _this.inputs = [];
        _this.outputs = [];
        _this.controls = [];
        _this.data = {};

        _this.title = title;
        _this.width = 180;
        _this.height = 100;
        return _this;
    }

    createClass(Node, [{
        key: 'addControl',
        value: function addControl(control) {
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            if (!(control instanceof Control)) throw new Error('Invalid instance');

            control.parent = this;

            if (index >= 0) this.controls.splice(index, 0, control);else this.controls.push(control);

            return this;
        }
    }, {
        key: 'addInput',
        value: function addInput(input) {
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            if (!(input instanceof Input)) throw new Error('Invalid instance');
            if (input.node !== null) throw new Error('Input has already been added to the node');

            input.node = this;

            if (index >= 0) this.inputs.splice(index, 0, input);else this.inputs.push(input);

            return this;
        }
    }, {
        key: 'addOutput',
        value: function addOutput(output) {
            var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            if (!(output instanceof Output)) throw new Error('Invalid instance');
            if (output.node !== null) throw new Error('Output has already been added to the node');

            output.node = this;

            if (index >= 0) this.outputs.splice(index, 0, output);else this.outputs.push(output);

            return this;
        }
    }, {
        key: 'inputsWithVisibleControl',
        value: function inputsWithVisibleControl() {
            return this.inputs.filter(function (input) {
                return input.showControl();
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.inputs.forEach(function (input) {
                input.removeConnections();
            });
            this.outputs.forEach(function (output) {
                output.removeConnections();
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                'id': this.id,
                'data': this.data,
                'group': this.group ? this.group.id : null,
                'inputs': this.inputs.map(function (input) {
                    return input.toJSON();
                }),
                'outputs': this.outputs.map(function (output) {
                    return output.toJSON();
                }),
                'position': this.position,
                'title': this.title
            };
        }
    }], [{
        key: 'incrementId',
        value: function incrementId() {
            if (!this.latestId) this.latestId = 1;else this.latestId++;
            return this.latestId;
        }
    }, {
        key: 'fromJSON',
        value: function fromJSON(builder, json) {
            var node = builder();

            node.id = json.id;
            node.data = json.data;
            Node.latestId = Math.max(node.id, Node.latestId);
            node.position = json.position;
            node.title = json.title;

            return node;
        }
    }]);
    return Node;
}(Block);

var Control = function () {
    function Control(html) {
        var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        classCallCheck(this, Control);

        this.html = html;
        this.parent = null;
        this.handler = handler;
    }

    createClass(Control, [{
        key: "getNode",
        value: function getNode() {
            if (this.parent === null) throw new Error("Control isn't added to Node/Input");

            return this.parent instanceof Node ? this.parent : this.parent.node;
        }
    }, {
        key: "getData",
        value: function getData(key) {
            return this.getNode().data[key];
        }
    }, {
        key: "putData",
        value: function putData(key, data) {
            this.getNode().data[key] = data;
        }
    }]);
    return Control;
}();

var Utils = function () {
    function Utils() {
        classCallCheck(this, Utils);
    }

    createClass(Utils, null, [{
        key: 'nodesBBox',
        value: function nodesBBox(nodes) {
            var left = Math.min.apply(Math, toConsumableArray(nodes.map(function (node) {
                return node.position[0];
            })));
            var top = Math.min.apply(Math, toConsumableArray(nodes.map(function (node) {
                return node.position[1];
            })));
            var right = Math.max.apply(Math, toConsumableArray(nodes.map(function (node) {
                return node.position[0] + node.width;
            })));
            var bottom = Math.max.apply(Math, toConsumableArray(nodes.map(function (node) {
                return node.position[1] + node.height;
            })));

            return {
                left: left,
                right: right,
                top: top,
                bottom: bottom
            };
        }
    }, {
        key: 'isValidJSON',
        value: function isValidJSON(data) {
            return typeof data.id === 'string' && _typeof(data.nodes) === 'object' && _typeof(data.groups) === 'object';
        }
    }, {
        key: 'isValidId',
        value: function isValidId(id) {
            return (/^[\w-]{3,}@[0-9]+\.[0-9]+\.[0-9]+$/.test(id)
            );
        }
    }, {
        key: 'isCompatibleIDs',
        value: function isCompatibleIDs(id1, id2) {
            id1 = id1.split('@');
            id2 = id2.split('@');

            if (id1[0] !== id2[0]) {
                console.error('Names don\'t match');
                return false;
            }
            if (id1[1] !== id2[1]) {
                console.error('Versions don\'t match');
                return false;
            }
            return true;
        }
    }]);
    return Utils;
}();

var State = { AVALIABLE: 0, PROCESSED: 1, ABORT: 2 };

var Engine = function () {
    function Engine(id, worker) {
        classCallCheck(this, Engine);


        if (!Utils.isValidId(id)) throw new Error('ID should be valid to name@0.1.0 format');

        this.id = id;
        this.worker = worker;
        this.data = null;
        this.state = State.AVALIABLE;
        this.onAbort = function () {};
    }

    createClass(Engine, [{
        key: 'processStart',
        value: function processStart() {
            if (this.state === State.AVALIABLE) {
                this.state = State.PROCESSED;
                return true;
            }

            return false;
        }
    }, {
        key: 'processDone',
        value: function processDone() {
            var success = this.state !== State.ABORT;

            this.state = State.AVALIABLE;

            if (!success) {
                this.onAbort();
                this.onAbort = function () {};
            }

            return success;
        }
    }, {
        key: 'abort',
        value: function abort() {
            var _this = this;

            return regeneratorRuntime.async(function abort$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            return _context.abrupt('return', new Promise(function (ret) {
                                if (_this.state === State.PROCESSED) {
                                    _this.state = State.ABORT;
                                    _this.onAbort = ret;
                                } else ret();
                            }));

                        case 1:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'lock',
        value: function lock(node) {
            return regeneratorRuntime.async(function lock$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            return _context2.abrupt('return', new Promise(function (res) {
                                node.unlockPool = node.unlockPool || [];
                                if (node.busy && !node.outputData) node.unlockPool.push(res);else res();

                                node.busy = true;
                            }));

                        case 1:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'unlock',
        value: function unlock(node) {
            node.unlockPool.forEach(function (a) {
                return a();
            });
            node.unlockPool = [];
            node.busy = false;
        }
    }, {
        key: 'extractInputData',
        value: function extractInputData(node) {
            var _this2 = this;

            return regeneratorRuntime.async(function extractInputData$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return regeneratorRuntime.awrap(Promise.all(node.inputs.map(function _callee2(input) {
                                var connData;
                                return regeneratorRuntime.async(function _callee2$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return regeneratorRuntime.awrap(Promise.all(input.connections.map(function _callee(c) {
                                                    var outputs;
                                                    return regeneratorRuntime.async(function _callee$(_context3) {
                                                        while (1) {
                                                            switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                    _context3.next = 2;
                                                                    return regeneratorRuntime.awrap(_this2.processNode(_this2.data.nodes[c.node], node));

                                                                case 2:
                                                                    outputs = _context3.sent;
                                                                    return _context3.abrupt('return', outputs[c.output]);

                                                                case 4:
                                                                case 'end':
                                                                    return _context3.stop();
                                                            }
                                                        }
                                                    }, null, _this2);
                                                })));

                                            case 2:
                                                connData = _context4.sent;
                                                return _context4.abrupt('return', connData);

                                            case 4:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, null, _this2);
                            })));

                        case 2:
                            return _context5.abrupt('return', _context5.sent);

                        case 3:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'processNode',
        value: function processNode(node) {
            var inputData, key;
            return regeneratorRuntime.async(function processNode$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if (!(this.state === State.ABORT)) {
                                _context6.next = 2;
                                break;
                            }

                            return _context6.abrupt('return', null);

                        case 2:
                            _context6.next = 4;
                            return regeneratorRuntime.awrap(this.lock(node));

                        case 4:
                            if (node.outputData) {
                                _context6.next = 21;
                                break;
                            }

                            _context6.next = 7;
                            return regeneratorRuntime.awrap(this.extractInputData(node));

                        case 7:
                            inputData = _context6.sent;


                            node.outputData = node.outputs.map(function () {
                                return null;
                            });

                            key = node.title.toLowerCase();
                            _context6.prev = 10;
                            _context6.next = 13;
                            return regeneratorRuntime.awrap(this.worker[key](node, inputData, node.outputData));

                        case 13:
                            _context6.next = 19;
                            break;

                        case 15:
                            _context6.prev = 15;
                            _context6.t0 = _context6['catch'](10);

                            this.abort();
                            console.error(_context6.t0);

                        case 19:
                            if (!(node.outputData.length !== node.outputs.length)) {
                                _context6.next = 21;
                                break;
                            }

                            throw new Error('Output data does not correspond to number of outputs');

                        case 21:

                            this.unlock(node);
                            return _context6.abrupt('return', node.outputData);

                        case 23:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, null, this, [[10, 15]]);
        }
    }, {
        key: 'forwardProcess',
        value: function forwardProcess(node) {
            var _this3 = this;

            return regeneratorRuntime.async(function forwardProcess$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            if (!(this.state === State.ABORT)) {
                                _context9.next = 2;
                                break;
                            }

                            return _context9.abrupt('return', null);

                        case 2:
                            _context9.next = 4;
                            return regeneratorRuntime.awrap(Promise.all(node.outputs.map(function _callee4(output) {
                                return regeneratorRuntime.async(function _callee4$(_context8) {
                                    while (1) {
                                        switch (_context8.prev = _context8.next) {
                                            case 0:
                                                _context8.next = 2;
                                                return regeneratorRuntime.awrap(Promise.all(output.connections.map(function _callee3(c) {
                                                    return regeneratorRuntime.async(function _callee3$(_context7) {
                                                        while (1) {
                                                            switch (_context7.prev = _context7.next) {
                                                                case 0:
                                                                    _context7.next = 2;
                                                                    return regeneratorRuntime.awrap(_this3.processNode(_this3.data.nodes[c.node]));

                                                                case 2:
                                                                    _context7.next = 4;
                                                                    return regeneratorRuntime.awrap(_this3.forwardProcess(_this3.data.nodes[c.node]));

                                                                case 4:
                                                                case 'end':
                                                                    return _context7.stop();
                                                            }
                                                        }
                                                    }, null, _this3);
                                                })));

                                            case 2:
                                                return _context8.abrupt('return', _context8.sent);

                                            case 3:
                                            case 'end':
                                                return _context8.stop();
                                        }
                                    }
                                }, null, _this3);
                            })));

                        case 4:
                            return _context9.abrupt('return', _context9.sent);

                        case 5:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'process',
        value: function process(data) {
            var startNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var i, node;
            return regeneratorRuntime.async(function process$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            if (this.processStart()) {
                                _context10.next = 2;
                                break;
                            }

                            return _context10.abrupt('return', 'not started');

                        case 2:
                            if (Utils.isValidJSON(data)) {
                                _context10.next = 4;
                                break;
                            }

                            throw new Error('Data are damaged');

                        case 4:
                            if (Utils.isCompatibleIDs(data.id, this.id)) {
                                _context10.next = 6;
                                break;
                            }

                            throw new Error('IDs not compatible');

                        case 6:

                            this.data = Object.assign({}, data);

                            if (!startNode) {
                                _context10.next = 12;
                                break;
                            }

                            _context10.next = 10;
                            return regeneratorRuntime.awrap(this.processNode(startNode));

                        case 10:
                            _context10.next = 12;
                            return regeneratorRuntime.awrap(this.forwardProcess(startNode));

                        case 12:
                            _context10.t0 = regeneratorRuntime.keys(this.data.nodes);

                        case 13:
                            if ((_context10.t1 = _context10.t0()).done) {
                                _context10.next = 23;
                                break;
                            }

                            i = _context10.t1.value;

                            if (!(typeof this.data.nodes[i].outputData === 'undefined')) {
                                _context10.next = 21;
                                break;
                            }

                            node = this.data.nodes[i];
                            _context10.next = 19;
                            return regeneratorRuntime.awrap(this.processNode(node));

                        case 19:
                            _context10.next = 21;
                            return regeneratorRuntime.awrap(this.forwardProcess(node));

                        case 21:
                            _context10.next = 13;
                            break;

                        case 23:
                            return _context10.abrupt('return', this.processDone() ? 'success' : 'aborted');

                        case 24:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, null, this);
        }
    }]);
    return Engine;
}();

var Group = function (_Block) {
    inherits(Group, _Block);

    function Group(title, params) {
        classCallCheck(this, Group);

        var _this = possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this));

        _this.id = Group.incrementId();
        _this.title = title;

        _this.nodes = [];
        _this.minWidth = 600;
        _this.minHeight = 250;

        if (params.nodes) _this.coverNodes(params.nodes);else {
            _this.position = params.position;
            _this.width = params.width;
            _this.height = params.height;
        }

        return _this;
    }

    createClass(Group, [{
        key: 'setWidth',
        value: function setWidth(w) {
            return this.width = Math.max(this.minWidth, w);
        }
    }, {
        key: 'setHeight',
        value: function setHeight(h) {
            return this.height = Math.max(this.minHeight, h);
        }
    }, {
        key: 'isCoverNode',
        value: function isCoverNode(node) {
            var gp = this.position;
            var np = node.position;

            return np[0] > gp[0] && np[1] > gp[1] && np[0] + node.width < gp[0] + this.width && np[1] + node.height < gp[1] + this.height;
        }
    }, {
        key: 'coverNodes',
        value: function coverNodes(nodes) {
            var self = this;
            var margin = 30;
            var bbox = Utils.nodesBBox(nodes);

            nodes.forEach(function (node) {
                if (node.group !== null) node.group.removeNode(node.group);
                self.addNode(node);
            });
            this.position = [bbox.left - margin, bbox.top - 2 * margin];
            this.setWidth(bbox.right - bbox.left + 2 * margin);
            this.setHeight(bbox.bottom - bbox.top + 3 * margin);
        }
    }, {
        key: 'containNode',
        value: function containNode(node) {
            return this.nodes.indexOf(node) !== -1;
        }
    }, {
        key: 'addNode',
        value: function addNode(node) {
            if (this.containNode(node)) return false;
            if (node.group !== null) node.group.removeNode(node);
            node.group = this;
            this.nodes.push(node);
            return true;
        }
    }, {
        key: 'removeNode',
        value: function removeNode(node) {
            if (!this.containNode(node)) return;
            this.nodes.splice(this.nodes.indexOf(node), 1);
            node.group = null;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.nodes.forEach(function (node) {
                node.group = null;
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return {
                'id': this.id,
                'title': this.title,
                'nodes': this.nodes.map(function (a) {
                    return a.id;
                }),
                'minWidth': this.minWidth,
                'minHeight': this.minHeight,
                'position': this.position,
                'width': this.width,
                'height': this.height
            };
        }
    }], [{
        key: 'incrementId',
        value: function incrementId() {
            if (!this.latestId) this.latestId = 1;else this.latestId++;
            return this.latestId;
        }
    }, {
        key: 'fromJSON',
        value: function fromJSON(json) {
            var group = new Group(null, {
                position: json.position,
                width: json.width,
                height: json.height
            });

            group.id = json.id;
            Group.latestId = Math.max(group.id, Group.latestId);
            group.title = json.title;
            group.minWidth = json.minWidth;
            group.minHeight = json.minHeight;
            return group;
        }
    }]);
    return Group;
}(Block);

var EditorView = function () {
    function EditorView(editor, container, template, menu) {
        var _this = this;

        classCallCheck(this, EditorView);


        this.editor = editor;
        this.pickedOutput = null;
        this.dom = container;
        this.dom.tabIndex = 1;
        this.svg = d3.select(this.dom);
        this.mouse = [0, 0];

        this.contextMenu = menu;
        this.contextMenu.onClick = function (subitem) {
            var result = subitem();

            if (result instanceof Node) _this.editor.addNode(result, true);

            _this.contextMenu.hide();
        };

        this.clickable = this.svg.append('rect').attr('fill', 'transparent').on('click', this.areaClick.bind(this));

        this.view = this.svg.append('g');

        this.zoom = d3.zoom().on('zoom', function () {
            _this.view.attr('transform', d3.event.transform);
        });

        this.svg.call(this.zoom);

        this.setScaleExtent(0.1, 1);
        var size = Math.pow(2, 12);

        this.setTranslateExtent(-size, -size, size, size);

        d3.select(window).on('mousemove', function () {
            _this.mouse = d3.mouse(_this.view.node());
            _this.update();
        }).on('keydown.' + editor.id, function (e) {
            if (_this.dom === document.activeElement) editor.keyDown(e);
        }).on('resize.' + editor.id, this.resize.bind(this));

        this.$cd = alight.ChangeDetector();
        this.$cd.scope.editor = editor;

        this.declareDirectives();

        d3.text(template, function (error, text) {
            if (error) throw error;
            _this.view.html(text);
            alight.bind(_this.$cd, _this.view.node());
            _this.resize();
            editor.loaded = true;
            editor.eventListener.trigger('load');
        });
    }

    createClass(EditorView, [{
        key: 'declareDirectives',
        value: function declareDirectives() {
            var _this2 = this;

            alight.directives.al.dragableNode = function (scope, el, expression, env) {
                var node = env.changeDetector.locals.node;
                var parent = el.parentNode;

                node.el = el;
                d3.select(el).call(d3.drag().on('start', function () {
                    d3.select(parent).raise();
                    _this2.editor.selectNode(node);
                }).on('drag', function () {
                    node.position[0] += d3.event.dx;
                    node.position[1] += d3.event.dy;
                    _this2.update();
                }).on('end', function () {
                    _this2.editor.groups.forEach(function (group) {
                        var contain = group.containNode(node);
                        var cover = group.isCoverNode(node);

                        if (contain && !cover) group.removeNode(node);else if (!contain && cover) group.addNode(node);
                    });

                    _this2.editor.eventListener.trigger('change');
                    _this2.update();
                }));
            };

            alight.directives.al.nodeLoad = function (scope, el, expression, env) {
                window.addEventListener('load', function () {
                    var node = env.changeDetector.locals.node;

                    node.width = el.offsetWidth;
                    node.height = el.offsetHeight;
                    env.scan();
                });
            };

            alight.directives.al.dragableGroup = function (scope, el, expression, env) {
                var group = env.changeDetector.locals.group;

                d3.select(el).call(d3.drag().on('start', function () {
                    _this2.editor.selectGroup(group);
                }).on('drag', function () {
                    group.position[0] += d3.event.dx;
                    group.position[1] += d3.event.dy;

                    for (var i in group.nodes) {
                        var node = group.nodes[i];

                        node.position[0] += d3.event.dx;
                        node.position[1] += d3.event.dy;
                    }

                    _this2.update();
                }).on('end', function () {
                    _this2.editor.eventListener.trigger('change');
                }));
            };

            alight.directives.al.dragableGroupHandler = function (scope, el, arg, env) {
                var group = env.changeDetector.locals.group;
                var mousePrev;

                d3.select(el).call(d3.drag().on('start', function () {
                    mousePrev = d3.mouse(_this2.svg.node());
                    _this2.editor.selectGroup(group);
                }).on('drag', function () {
                    var zoom = d3.zoomTransform(_this2.dom);
                    var mouse = d3.mouse(_this2.svg.node());
                    var deltax = (mouse[0] - mousePrev[0]) / zoom.k;
                    var deltay = (mouse[1] - mousePrev[1]) / zoom.k;
                    var deltaw = Math.max(0, group.width - group.minWidth);
                    var deltah = Math.max(0, group.height - group.minHeight);

                    if (deltaw !== 0) mousePrev[0] = mouse[0];
                    if (deltah !== 0) mousePrev[1] = mouse[1];

                    if (arg.match('l')) {
                        group.position[0] += Math.min(deltaw, deltax);
                        group.setWidth(group.width - deltax);
                    } else if (arg.match('r')) group.setWidth(group.width + deltax);

                    if (arg.match('t')) {
                        group.position[1] += Math.min(deltah, deltay);
                        group.setHeight(group.height - deltay);
                    } else if (arg.match('b')) group.setHeight(group.height + deltay);

                    _this2.update();
                }).on('end', function () {
                    _this2.editor.nodes.forEach(function (node) {
                        if (group.isCoverNode(node)) group.addNode(node);else group.removeNode(node);
                    });

                    _this2.editor.eventListener.trigger('change');
                    _this2.update();
                }));
            };

            alight.directives.al.groupTitleClick = function (scope, el, expression, env) {
                var group = env.changeDetector.locals.group;

                d3.select(el).on('click', function () {
                    var title = prompt('Please enter title of the group', group.title);

                    if (title !== null && title.length > 0) group.title = title;
                    env.scan();
                });
            };

            alight.directives.al.pickInput = function (scope, el, expression, env) {
                var input = env.changeDetector.locals.input;

                input.el = el;

                d3.select(el).on('mousedown', function () {
                    d3.event.preventDefault();
                    if (_this2.pickedOutput === null) {
                        if (input.hasConnection()) {
                            _this2.pickedOutput = input.connections[0].output;
                            _this2.editor.removeConnection(input.connections[0]);
                        }
                        _this2.update();
                        return;
                    }

                    if (!input.multipleConnections && input.hasConnection()) _this2.editor.removeConnection(input.connections[0]);else if (_this2.pickedOutput.connectedTo(input)) {
                        var connections = input.connections.filter(function (c) {
                            return c.output === _this2.pickedOutput;
                        });

                        _this2.editor.removeConnection(connections[0]);
                    }

                    _this2.editor.connect(_this2.pickedOutput, input);

                    _this2.pickedOutput = null;
                    _this2.update();
                });
            };

            alight.directives.al.pickOutput = function (scope, el, expression, env) {
                var output = env.changeDetector.locals.output;

                output.el = el;

                d3.select(el).on('mousedown', function () {
                    _this2.pickedOutput = output;
                });
            };

            alight.directives.al.control = function (scope, el, expression, env) {
                var locals = env.changeDetector.locals;
                var control = expression.split('.').reduce(function (o, i) {
                    return o[i];
                }, locals);

                el.innerHTML = control.html;
                control.handler(el.children[0], control);
            };
        }
    }, {
        key: 'getConnectionPathData',
        value: function getConnectionPathData(connection, x1, y1, x2, y2) {
            var distanceX = Math.abs(x1 - x2);
            var distanceY = y2 - y1;

            var p1 = [x1, y1];
            var p4 = [x2, y2];

            var p2 = [x1 + 0.3 * distanceX, y1 + 0.1 * distanceY];
            var p3 = [x2 - 0.3 * distanceX, y2 - 0.1 * distanceY];

            var points = [p1, p2, p3, p4];

            var curve = d3.curveBasis(d3.path());

            curve.lineStart();
            for (var i = 0; i < points.length; i++) {
                var point = points[i];

                curve.point(point[0], point[1]);
            }
            curve.lineEnd();
            var d = curve._context.toString();

            return d;
        }
    }, {
        key: 'resize',
        value: function resize() {
            var width = this.dom.parentElement.clientWidth;
            var height = this.dom.parentElement.clientHeight;

            this.svg.style('width', width + 'px').style('height', height + 'px');

            this.clickable.attr('width', width + 20).attr('height', height + 20);

            this.update();
        }
    }, {
        key: 'updateConnections',
        value: function updateConnections() {
            var pathData = [];

            for (var i in this.editor.nodes) {
                var outputs = this.editor.nodes[i].outputs;

                for (var j in outputs) {
                    var cons = outputs[j].connections;

                    for (var k in cons) {
                        if (!cons[k].input.el) break;
                        var input = cons[k].input;
                        var output = cons[k].output;

                        pathData.push({
                            d: this.getConnectionPathData(cons[k], output.node.position[0] + output.el.offsetLeft + output.el.offsetWidth / 2, output.node.position[1] + output.el.offsetTop + output.el.offsetHeight / 2, input.node.position[0] + input.el.offsetLeft + input.el.offsetWidth / 2, input.node.position[1] + input.el.offsetTop + input.el.offsetHeight / 2)
                        });
                    }
                }
            }

            if (this.pickedOutput !== null) {
                if (!this.pickedOutput.el) return;
                var _output = this.pickedOutput;
                var _input = this.mouse;

                pathData.push({
                    active: true, d: this.getConnectionPathData(null, _output.node.position[0] + _output.el.offsetLeft + _output.el.offsetWidth / 2, _output.node.position[1] + _output.el.offsetTop + _output.el.offsetHeight / 2, _input[0], _input[1])
                });
            }

            this.editor.paths = pathData;
        }
    }, {
        key: 'update',
        value: function update() {
            this.updateConnections();
            this.$cd.scan();
        }
    }, {
        key: 'areaClick',
        value: function areaClick() {
            if (this.pickedOutput !== null && !d3.event.ctrlKey) this.pickedOutput = null;else this.contextMenu.show(d3.event.clientX - 20, d3.event.clientY - 20);
            this.update();
        }
    }, {
        key: 'zoomAt',
        value: function zoomAt(nodes) {
            var bbox = Utils.nodesBBox(nodes);
            var scalar = 0.9;
            var kh = this.dom.clientHeight / Math.abs(bbox.top - bbox.bottom);
            var kw = this.dom.clientWidth / Math.abs(bbox.left - bbox.right);
            var k = Math.min(kh, kw, 1);
            var cx = (bbox.left + bbox.right) / 2;
            var cy = (bbox.top + bbox.bottom) / 2;

            this.zoom.translateTo(this.svg, cx, cy);
            this.zoom.scaleTo(this.svg, scalar * k);
        }
    }, {
        key: 'setScaleExtent',
        value: function setScaleExtent(scaleMin, scaleMax) {
            this.zoom.scaleExtent([scaleMin, scaleMax]);
        }
    }, {
        key: 'setTranslateExtent',
        value: function setTranslateExtent(left, top, right, bottom) {
            this.zoom.translateExtent([[left, top], [right, bottom]]);
        }
    }]);
    return EditorView;
}();

var EventListener = function () {
    function EventListener() {
        classCallCheck(this, EventListener);

        this.events = [];
    }

    createClass(EventListener, [{
        key: 'on',
        value: function on(names, handler) {
            var _this = this;

            if (typeof handler !== 'function') throw new Error('Second argument should be function');

            names.split(' ').forEach(function (name) {
                _this.events[name] = handler;
            });

            return this;
        }
    }, {
        key: 'trigger',
        value: function trigger(name, args) {
            var handler = this.events[name];

            if (typeof handler === 'function') return handler(args) !== false;

            return true;
        }
    }]);
    return EventListener;
}();

var NodeEditor = function () {
    function NodeEditor(id, container, template, builder, menu) {
        classCallCheck(this, NodeEditor);


        if (!Utils.isValidId(id)) throw new Error('ID should be valid to name@0.1.0 format');

        this.id = id;
        this.builder = builder;
        this.view = new EditorView(this, container, template, menu);
        this.eventListener = new EventListener();
        this.active = null;
        this.nodes = [];
        this.groups = [];
        this.loaded = false;
    }

    createClass(NodeEditor, [{
        key: 'addNode',
        value: function addNode(node) {
            var mousePlaced = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!(node instanceof Node)) throw new Error('Wrong instance');

            if (this.eventListener.trigger('nodecreate', node)) {
                if (mousePlaced) node.position = this.view.mouse;
                this.nodes.push(node);
                this.eventListener.trigger('change');
                this.selectNode(node);
            }
        }
    }, {
        key: 'addGroup',
        value: function addGroup(group) {
            if (this.eventListener.trigger('groupcreate', group)) {
                this.groups.push(group);
                this.eventListener.trigger('change');
            }

            this.view.update();
        }
    }, {
        key: 'removeNode',
        value: function removeNode(node) {
            var index = this.nodes.indexOf(node);

            if (this.eventListener.trigger('noderemove', node)) {
                this.nodes.splice(index, 1);
                node.remove();
                this.eventListener.trigger('change');

                if (this.nodes.length > 0) this.selectNode(this.nodes[Math.max(0, index - 1)]);
            }

            this.view.update();
        }
    }, {
        key: 'removeGroup',
        value: function removeGroup(group) {
            if (this.eventListener.trigger('groupremove', group)) {
                group.remove();
                this.groups.splice(this.groups.indexOf(group), 1);
                this.eventListener.trigger('change');
            }

            this.view.update();
        }
    }, {
        key: 'connect',
        value: function connect(output, input) {
            if (this.eventListener.trigger('connectioncreate', { output: output, input: input })) try {
                output.connectTo(input);
                this.eventListener.trigger('change');
            } catch (e) {
                console.error(e);
                alert(e.message);
            }
        }
    }, {
        key: 'removeConnection',
        value: function removeConnection(connection) {
            if (this.eventListener.trigger('connectionremove', connection)) {
                connection.remove();
                this.eventListener.trigger('change');
            }
        }
    }, {
        key: 'selectNode',
        value: function selectNode(node) {
            if (this.nodes.indexOf(node) === -1) throw new Error('Node not exist in list');

            if (this.eventListener.trigger('nodeselect', node)) this.active = node;

            this.view.update();
        }
    }, {
        key: 'selectGroup',
        value: function selectGroup(group) {
            if (this.eventListener.trigger('groupselect', group)) this.active = group;

            this.view.update();
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var nodes = {};
            var groups = {};

            this.nodes.forEach(function (node) {
                return nodes[node.id] = node.toJSON();
            });
            this.groups.forEach(function (group) {
                return groups[group.id] = group.toJSON();
            });

            return {
                'id': this.id,
                'nodes': nodes,
                'groups': groups
            };
        }
    }, {
        key: 'keyDown',
        value: function keyDown() {

            switch (d3.event.keyCode) {
                case 46:
                    if (this.active instanceof Node) this.removeNode(this.active);else if (this.active instanceof Group) this.removeGroup(this.active);
                    this.view.update();
                    break;
                case 71:
                    if (!(this.active instanceof Node)) {
                        alert('Select the node for adding to group');return;
                    }
                    var group = new Group('Group', { nodes: [this.active] });

                    this.addGroup(group);
                    break;
            }
        }
    }, {
        key: 'fromJSON',
        value: function fromJSON(json) {
            var _this = this;

            this.nodes.splice(0, this.nodes.length);
            this.groups.splice(0, this.groups.length);

            var nodes = {};

            Object.keys(json.nodes).forEach(function (id) {
                var node = json.nodes[id];

                nodes[id] = Node.fromJSON(_this.builder[node.title.toLowerCase()], node);
                _this.addNode(nodes[id]);
            });

            Object.keys(json.nodes).forEach(function (id) {
                var jsonNode = json.nodes[id];
                var node = nodes[id];

                jsonNode.outputs.forEach(function (outputJson, i) {
                    outputJson.connections.forEach(function (jsonConnection) {
                        var nodeId = jsonConnection.node;
                        var inputIndex = jsonConnection.input;
                        var targetInput = nodes[nodeId].inputs[inputIndex];

                        _this.connect(node.outputs[i], targetInput);
                    });
                });
            });

            Object.keys(json.groups).forEach(function (id) {
                var group = Group.fromJSON(json.groups[id]);

                json.groups[id].nodes.forEach(function (nodeId) {
                    var node = nodes[nodeId];

                    group.addNode(node);
                });
                _this.addGroup(group);
            });
            this.view.update();
        }
    }]);
    return NodeEditor;
}();

var Socket = function () {
    function Socket(id, name, hint) {
        classCallCheck(this, Socket);

        this.id = id;
        this.name = name;
        this.hint = hint;
        this.compatible = [];
    }

    createClass(Socket, [{
        key: 'combineWith',
        value: function combineWith(socket) {
            if (!(socket instanceof Socket)) throw new Error('Invalid socket');
            this.compatible.push(socket);
        }
    }, {
        key: 'compatibleWith',
        value: function compatibleWith(socket) {
            if (!(socket instanceof Socket)) throw new Error('Invalid socket');
            return this.id === socket.id || this.compatible.indexOf(socket) !== -1;
        }
    }]);
    return Socket;
}();

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!function (global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function (arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (!info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }
    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
}(
// In sloppy mode, unbound `this` refers to the global object, fallback to
// Function constructor if we're in global strict mode. That is sadly a form
// of indirect eval which violates Content Security Policy.
function () {
  return this;
}() || Function("return this")());

exports.Connection = Connection;
exports.ContextMenu = ContextMenu;
exports.Control = Control;
exports.NodeEditor = NodeEditor;
exports.Engine = Engine;
exports.Group = Group;
exports.Input = Input;
exports.Node = Node;
exports.Output = Output;
exports.Socket = Socket;

}((this.D3NE = this.D3NE || {})));
//# sourceMappingURL=node-editor.js.map
