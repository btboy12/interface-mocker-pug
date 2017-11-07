$("#data_list").on("click-row.bs.table", function (row, field, $element) {
    mod(field.id);
});

function getButton(value, row, index) {
    return "<button class='btn btn-warning' onclick='del(event," + row.id + ")'>删除</button>\
            <button class='btn btn-primary' onclick='mod("+ row.id + ")'>修改</button>";
}

function add() {
    $("#modal input").val(null);
    $("#modal").modal('show');
}

function mod(id) {
    $.get("/api/intfc_class/" + id, function (data, status) {
        for (var i in data) {
            $("#" + i).val(data[i]);
        }
    });
    $("#modal").modal('show');
}

function del(event, id) {
    event.stopPropagation()
    $.ajax({
        url: "/api/intfc_class/" + id,
        type: "delete",
        success: function (data, status) {
            $("#data_list").bootstrapTable('refresh', { silent: true });
        },
        error: function (xhr, status, error) {
            console.warn(error);
        }
    });
}

function upload() {
    var method;
    if ($("#id").val()) {
        method = "put";
    } else {
        method = "post";
    }
    $.ajax({
        url: "/api/intfc_class" + (method == "put" ? ("/" + $("#id").val()) : ""),
        type: method,
        data: $("#modal form").serialize(),
        success: function (data, status) {
            $("#data_list").bootstrapTable('refresh', { silent: true });
            $("#modal").modal('hide');
        },
        error: function (xhr, status, error) {
            console.warn(error);
        }
    });
}