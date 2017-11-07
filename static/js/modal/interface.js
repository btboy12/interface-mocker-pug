(function () {
    Vue.component('v-select', VueSelect.VueSelect);

    var app = new Vue({
        el: "#interface_modal",
        data: {
            id: null,
            info: {},
            orgin_info: {},
            selectedDeveloper: null,
            developers: [],
            editting: {
                reqInfo: false,
                resInfo: false,
                str: ""
            },
        },
        methods: {
            getDevelopers: getDevelopers,
            upload: function () {
                var method, postfix, temp = {};
                app.info.developerId = app.selectedDeveloper.id;
                if (app.id) {
                    method = "patch";
                    postfix = "/" + app.id;
                    for (var i in app.info) {
                        app.info[i] != app.orgin_info[i] && (temp[i] = app.info[i]);
                    }
                    if (JSON.stringify(app.info.reqInfo) != JSON.stringify(app.orgin_info.reqInfo)) {
                        temp.reqInfo = JSON.stringify(app.info.reqInfo);
                    }
                    if (JSON.stringify(app.info.resInfo) != JSON.stringify(app.orgin_info.resInfo)) {
                        temp.resInfo = JSON.stringify(app.info.resInfo);
                    }
                    if ($.isEmptyObject(temp)) {
                        $("#interface_modal").modal('hide');
                        return;
                    }
                } else {
                    method = "post";
                    postfix = "";
                    temp = app.info;
                    temp.reqInfo = JSON.stringify(app.info.reqInfo);
                    temp.resInfo = JSON.stringify(app.info.resInfo);
                }
                $.ajax({
                    url: "/api/interface" + postfix,
                    type: method,
                    data: temp,
                    success: function (data, status) {
                        $("#data_list").bootstrapTable('refresh', { silent: true });
                        $("#interface_modal").modal('hide');
                    },
                    error: function (xhr, status, error) {
                        console.warn(error);
                    }
                });
            },
            edit: function (info) {
                app.editting[info] = !app.editting[info];
                var arr = [];
                if (app.editting[info]) {
                    for (var i in app.info[info]) {
                        arr.push(app.info[info][i].join("\t"));
                    }
                    app.editting.str = arr.join("\n");
                } else {
                    arr = app.editting.str.split("\n");
                    app.info[info] = [];
                    for (var i in arr) {
                        var item = arr[i].split("\t");
                        item.length = 4;
                        app.info[info].push(item);
                    }
                }
            },
            tab: function ($event) {
                var str =
                    this.editting.str.slice(0, $event.target.selectionStart) +
                    "\t" +
                    this.editting.str.slice($event.target.selectionEnd);
                this.editting.str = str;
            }
        },
        computed: {
            reqInfoBtn: function () {
                return this.editting.reqInfo ? "确认" : "编辑";
            },
            resInfoBtn: function () {
                return this.editting.resInfo ? "确认" : "编辑";
            }
        }
    });

    getDevelopers();

    function getDevelopers(search, loading) {
        loading && loading(true);
        $.get("/api/developer", function (data, status) {
            app.developers = data;
            loading && loading(false);
        });
    }

    window.interface_modal = {
        clear: function () {
            app.id = null;
            app.info = {};
            app.selectedDeveloper = null;
            app.editting = {
                reqInfo: false,
                resInfo: false,
                str: ""
            }
        },
        set: function (id, info) {
            app.id = id;
            app.info = info;
            for (var developer of app.developers) {
                if (developer.id == info.developerId) {
                    app.selectedDeveloper = developer;
                    break;
                }
            }
            app.orgin_info = {};
            for(var i in info){
                app.orgin_info[i] = info[i];
            }
        },
        show: function () {
            $("#interface_modal").modal('show');
        },
        hide: function () {
            $("#interface_modal").modal('hide');
        }
    }
})();