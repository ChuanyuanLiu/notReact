var Counter = function () {
    var _a = react.useState(0), count = _a[0], setCount = _a[1];
    return react.createElement("div", null, react.createElement("p", null, "Counter: " + count), react.createElement("button", {
        onClick: function () {
            setCount(count - 1);
        },
    }, "-"), react.createElement("button", {
        onClick: function () {
            setCount(count + 1);
        },
    }, "+"));
};
var App = function () {
    var _a = react.useState(""), text = _a[0], setText = _a[1];
    return react.createElement("div", null, react.createElement("input", {
        id: 0,
        value: text,
        onInput: function (e) {
            setText(e.target.value);
        },
    }), react.createElement("p", null, "My Counter App"), text.length > 0 ? react.createElement(Counter) : "", react.createElement(Counter));
};
react
    .createRoot(document.getElementById("app"))
    .render(react.createElement(App));
