(function () {
    Vue.component('v-select', VueSelect.VueSelect);
    var app = new Vue({
        el: '#example_modal',
        data: {
            id: null,
            info: {
                name: null,
                code: null,
                interfaceId: null,
                cookies: null,
                content: null,
            },
            selectedInterface: null,
            interfaces: []
        },
        methods: {
            getInterfaces: getInterfaces,
            upload: function () {
                var method, postfix, temp = {};
                app.info.interfaceId = app.selectedInterface.id;
                if (app.id) {
                    method = "patch";
                    postfix = "/" + app.id;
                    for (var i in app.info) {
                        app.info[i] != app.orgin_info[i] && (temp[i] = app.info[i]);
                    }
                    if ($.isEmptyObject(temp)) {
                        $("#example_modal").modal('hide');
                        return;
                    }
                } else {
                    method = "post";
                    postfix = "";
                    temp = app.info;
                }
                $.ajax({
                    url: "/api/example" + postfix,
                    type: method,
                    data: temp,
                    success: function (data, status) {
                        $("#data_list").bootstrapTable('refresh', { silent: true });
                        $("#example_modal").modal('hide');
                    },
                    error: function (xhr, status, error) {
                        console.warn(error);
                    }
                });
            }
        }
    });

    getInterfaces();

    function getInterfaces(search, loading) {
        loading && loading(true);
        $.get("/api/interface", function (data, status) {
            app.interfaces = data;
            loading && loading(false);
        });
    }

    window.example_modal = {
        clear: function () {
            app.id = null;
            app.info = {
                name: null,
                code: null,
                interfaceId: null,
                cookies: null,
                content: null,
            };
            app.selectedInterface = null;
        },
        set: function (id, info) {
            app.id = id;
            for (var i in app.info) {
                app.info[i] = info[i];
            }
            app.orgin_info = info;
            for (var intfcl of app.interfaces) {
                if (intfcl.id == info.interfaceId) {
                    app.selectedInterface = intfcl;
                    break;
                }
            }
        },
        show: function () {
            $("#example_modal").modal("show");
        },
        hide: function () {
            $("#example_modal").modal("hide");
        }
    }
})();