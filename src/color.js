export default function Color(r, g, b) {

    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;

    this.clone = function () {
        return new Color(r, g, b);
    }

    this.toArray = function () {
        return [this.r, this.g, this.b];
    }

    this.toHex = function () {
        return '#' + componentToHex(this.r) + componentToHex(this.g) + componentToHex(this.b);
    }

    function componentToHex(c) {
        var hex = Math
            .floor(c * 255)
            .toString(16);

        return hex.length == 1
            ? '0' + hex
            : hex;
    }
}

Color.fromArray = function (a) {
    return new Color(a[0], a[1], a[2]);
}

Color.fromHex = function (hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
        ? new Color(parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255)
        : null;
}
