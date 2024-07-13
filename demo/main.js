var Counter = function () {
    var _a = React.useState(0), count = _a[0], setCount = _a[1];
    return React.createElement("div", null, React.createElement("p", null, "Counter: " + count), React.createElement("button", {
        onClick: function () {
            setCount(count - 1);
        },
    }, "-"), React.createElement("button", {
        onClick: function () {
            setCount(count + 1);
        },
    }, "+"));
};
var App = function () {
    var _a = React.useState(""), text = _a[0], setText = _a[1];
    return React.createElement("div", null, React.createElement("input", {
        id: 0,
        value: text,
        onInput: function (e) {
            setText(e.target.value);
        },
    }),
        Array.from(Array(1).keys())
            .map(() => React.createElement(Counter))
    );
};
React
    .createRoot(document.getElementById("app"))
    .render(React.createElement(App));
