function forEach(a, f) {
    for (var i = 0; i < a.length; i++) {
        f(a[i], i);
    }
}

function toHexDigit(x) {
    return String.fromCharCode(x + ((x < 10) ? 48 : 55));
}
