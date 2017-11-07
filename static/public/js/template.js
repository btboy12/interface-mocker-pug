function template(temp, data) {
    for (var i in data) {
        var reg = new RegExp("\\$\\{" + i + "\\}", "g");
        temp = temp.replace(reg, data[i]);
    }
    return temp;
}