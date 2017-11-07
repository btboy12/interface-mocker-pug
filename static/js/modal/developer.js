(function () {
    Vue.component('v-select', VueSelect.VueSelect);
    
    var app = new Vue({
        el: '#developer_modal',
        data: {
            id: null,
            info: {
                name: null,
                addr: null,
                port: null
            },
            orgin_info: {}
        },
        methods: {
            upload: function () {
                var method, param, temp = {};
                if (app.id) {
                    method = "patch";
                    param = "/" + app.id;
                    for (var i in app.info) {
                        app.info[i] != app.orgin_info[i] && (temp[i] = app.info[i]);
                    }
                    if ($.isEmptyObject(temp)) {
                        $("#developer_modal").modal('hide');
                        return;
                    }
                } else {
                    method = "post";
                    param = "";
                }
                $.ajax({
                    url: "/api/developer" + param,
                    type: method,
                    data: app.info,
                    success: function (data, status) {
                        $("#data_list").bootstrapTable('refresh', { silent: true });
                        $("#developer_modal").modal('hide');
                    },
                    error: function (xhr, status, error) {
                        console.warn(error);
                    }
                });
            }
        }
    });

    window.developer_modal = {
        clear: function () {
            app.id = null;
            app.info = {
                name: null,
                addr: null,
                port: null
            };
        },
        set: function (id, info) {
            app.id = id;
            for (var i in app.info) {
                app.info[i] = info[i];
            }
            app.orgin_info = info;
        },
        show: function () {
            $("#developer_modal").modal("show");
        },
        hide: function () {
            $("#developer_modal").modal("hide");
        }
    }
})();