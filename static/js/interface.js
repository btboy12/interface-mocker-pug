(function () {
    var query = getHashParams();
    $(function () {
        if (query.search != undefined) {
            $("#data_list").bootstrapTable('resetSearch', query.search);
        }

        var filter = $("#filter").select2({
            width: "400px",
            placeholder: "请选择开发者",
            allowClear: true,
            minimumResultsForSearch: Infinity,
            ajax: {
                url: '/api/developer',
                dataType: 'json',
                processResults: function (data) {
                    return {
                        results: data.map(function (v, i, a) {
                            return { id: v.id, text: v.name }
                        })
                    };
                }
            }
        });

        if (query.developerId != undefined) {
            $.get("/api/developer/" + query.developerId, function (data) {
                filter.append(new Option(data.name, data.id, true, true)).trigger('change');
            });
        }

        $("#filter").on("select2:select", function (e) {
            query.developerId = e.params.data.id;
            $("#data_list").bootstrapTable("refresh");
        });

        $("#filter").on("select2:unselect", function (e) {
            delete query.developerId;
            $("#data_list").bootstrapTable("refresh");
        });

        $('#data_list').on('load-success.bs.table', function (e, text) {
            document.location.hash = parseHashParams(query);
            $("input.switch").bootstrapSwitch({
                handleWidth: 80,
                onText: "转发",
                offText: "模拟",
                onSwitchChange: function (event, state) {
                    var jqDom = $(this);
                    var id = jqDom.data("id");
                    jqDom.bootstrapSwitch("disabled", true);
                    jqDom.bootstrapSwitch("indeterminate", true);
                    jqDom.bootstrapSwitch("labelText", "设定中...");
                    $.ajax({
                        url: "/api/interface/" + id,
                        type: "patch",
                        data: { isProxy: state },
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
        if (query.developerId != undefined) {
            params.developerId = query.developerId;
        }
        query.search = params.search;
        params.search = params.search;
        if (params.search == undefined || params.search == null || params.search.trim().length == 0) {
            delete query.search;
            delete params.search;
        }
        return params;
    }

    var buttonTemplate = "<button class='btn btn-warning' onclick='del(event,${id})'>删除</button>\
                          <button class='btn btn-primary' onclick='mod(${id})'>修改</button>\
                          <a class='btn btn-primary' href='/example#${params}'>返回样例</a>";


    window.getButton = function (value, row, index) {
        return template(buttonTemplate, {
            id: row.id,
            params: parseHashParams({ interfaceId: row.id })
        });
    }

    window.getSwitch = function (value, row, index) {
        return template("<div><input data-id='${id}' class='switch' type='checkbox' ${isProxy}></div>"
            , {
                id: row.id,
                isProxy: row.isProxy ? "checked" : ""
            });
    }

    window.add = function () {
        window.interface_modal.clear();
        window.interface_modal.show();
    }

    window.mod = function (id) {
        $.get("/api/interface/" + id, function (data, status) {
            try {
                data.resInfo = JSON.parse(data.resInfo);
            } catch (err) {
                console.error(err);
                data.resInfo = [];
            }
            try {
                data.reqInfo = JSON.parse(data.reqInfo);
            } catch (err) {
                console.error(err);
                data.reqInfo = [];
            }
            window.interface_modal.set(data.id, data);
            window.interface_modal.show();
        });
    }

    window.del = function (event, id) {
        event.stopPropagation()
        $.ajax({
            url: "/api/interface/" + id,
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

$("#req_info").editableTableWidget();

$('#req_info_content').on('nextStep', function (event) {
    var target = $(event.target);
    var parent = target.parent();
    if (target.index() === parent.children().length - 1) {
        addReqInfo(event);
        parent.next().children()[0].focus();
    } else {
        target.next().focus();
    }
});

function addReqInfo(event) {
    event && event.preventDefault();
    $("#req_info_del").append("<tr><td><a class='glyphicon glyphicon-trash' onclick='delReqInfo(this)'></a>&nbsp;</td></tr>");
    $("#req_info_content").append("<tr><td>&nbsp;</td><td></td><td></td></tr>");
    $("#req_info_content").editableTableWidget();
}

function delReqInfo(id) {
    current.reqInfo.slice(id, 1);
    $("#req_info_content").children()[id].remove();
    $("#req_info_del").children()[id].remove();
    $("#req_info button").show();
}

function addResInfo(event) {
    event && event.preventDefault();
    $("#res_info_del").append("<tr><td><a class='glyphicon glyphicon-trash'></a>&nbsp;</td></tr>");
    $("#res_info_content").append("<tr><td>&nbsp;</td><td></td><td></td></tr>");
    $("#res_info_content").editableTableWidget();
}

function iSubmit(event, element) {
    if (event.ctrlKey && (event.keyCode == 10)) {
        // $(element).prev().show();
        // $(element).hide();
        console.info(current);
    }
}

function getTableData(selector) {
    var result = [];
    $(selector).find("tr").each(function (i, e) {
        var temp = [];
        $(e).find("td").each(function (_i, _e) {
            temp.push($(_e).text());
        })
        result.push(temp);
    });
    return result;
}