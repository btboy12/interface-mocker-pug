(function () {
    window.getButton = function (value, row, index) {
        return "<button class='btn btn-warning' onclick='del(event," + value + ")'>删除</button>\
                <button class='btn btn-primary' onclick='mod("+ value + ")'>修改</button>\
                <a class='btn btn-primary' href='/interface#"+ parseHashParams({ developerId: value }) + "'>所属接口</a>";
    }

    window.add = function () {
        window.developer_modal.clear();
        window.developer_modal.show();
    }

    window.mod = function (id) {
        $.get("/api/developer/" + id, function (data, status) {
            window.developer_modal.set(data.id, data);
            window.developer_modal.show();
        });
    }

    window.del = function (event, id) {
        event.stopPropagation()
        $.ajax({
            url: "/api/developer/" + id,
            type: "delete",
            success: function (data, status) {
                $("#data_list").bootstrapTable('refresh', { silent: true });
            },
            error: function (xhr, status, error) {
                console.warn(error);
            }
        });
    }
})();




