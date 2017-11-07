(function () {
    var query = getHashParams();
    $(function () {
        if (query.search != undefined) {
            $("#data_list").bootstrapTable('resetSearch', query.search);
        }

        var filter = $("#filter").select2({
            width: "400px",
            placeholder: "请选择接口",
            allowClear: true,
            ajax: {
                url: '/api/interface',
                dataType: 'json',
                data: function (params) {
                    return {
                        search: params.term
                    }
                },
                processResults: function (data) {
                    return {
                        results: data.map(function (v, i, a) {
                            return { id: v.id, text: v.name }
                        })
                    };
                }
            }
        });

        if (query.interfaceId != undefined) {
            $.get("/api/interface/" + query.interfaceId, function (data) {
                filter.append(new Option(data.name, data.id, true, true)).trigger('change');
            });
        }

        $("#filter").on("select2:select", function (e) {
            query.interfaceId = e.params.data.id;
            $("#data_list").bootstrapTable("refresh");
        });

        $("#filter").on("select2:unselect", function (e) {
            delete query.interfaceId;
            $("#data_list").bootstrapTable("refresh");
        });

        $('#data_list').on('load-success.bs.table', function (e, text) {
            document.location.hash = parseHashParams(query);
            $("input.switch").bootstrapSwitch({
                handleWidth: 80,
                onText: "启用",
                offText: "禁用",
                onSwitchChange: function (event, state) {
                    var jqDom = $(this);
                    var id = jqDom.data("id");
                    jqDom.bootstrapSwitch("disabled", true);
                    jqDom.bootstrapSwitch("indeterminate", true);
                    jqDom.bootstrapSwitch("labelText", "设定中...");
                    $.ajax({
                        url: "/api/example/" + id,
                        type: "patch",
                        data: { inUse: state },
                        success: function () {
                            jqDom.bootstrapSwitch("disabled", false);
                            jqDom.bootstrapSwitch("indeterminate", false);
                            jqDom.bootstrapSwitch("labelText", "");
                        },
                        error: function (xhr, status, error) {
                            console.error(error);
                            jqDom.bootstrapSwitch("disabled", false);
                            jqDom.bootstrapSwitch("indeterminate", false);
                            jqDom.bootstrapSwitch("labelText", "");
                            jqDom.bootstrapSwitch("toggleState", true);
                        }
                    });
                }
            });
        });
    });

    window.getParams = function (params) {
        if (query.interfaceId != undefined) {
            params.interfaceId = query.interfaceId;
        }
        query.search = params.search;
        params.search = params.search;
        if (params.search == undefined || params.search == null || params.search.trim().length == 0) {
            delete query.search;
            delete params.search;
        }
        return params;
    }

    window.getSwitch = function (value, row, index) {
        return template("<div><input data-id='${id}' class='switch' type='checkbox' ${isProxy}></div>"
            , {
                id: row.id,
                inUse: row.isProxy ? "checked" : ""
            });
    }

    window.getButton = function (value, row, index) {
        return template(
            "<button class='btn btn-warning' onclick='del(event,${id})'>删除</button>\
             <button class='btn btn-primary' onclick='mod(${id})'>修改</button>",
            { id: row.id })
    }

    window.add = function () {
        window.example_modal.clear();
        if (query.interfaceId) {
            window.example_modal.set(null, { interfaceId: query.interfaceId });
        }
        window.example_modal.show();
    }

    window.mod = function (id) {
        $.get("/api/example/" + id, function (data, status) {
            window.example_modal.set(id, data);
            window.example_modal.show();
        });
    }

    window.del = function (event, id) {
        event.stopPropagation()
        $.ajax({
            url: "/api/example/" + id,
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




