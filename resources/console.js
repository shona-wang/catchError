$(function () {
    var err = '错误信息',
        $select = $('.select'),
        $add = $('.add'),
        ip = 'http://172.16.11.100:8987',
        url = {
            index: '/',
            add: '/add',
            select: '/select'
        },
        insert = function (params) {
            $.ajax({
                url: ip + url.add,
                type: 'POST',
                data: {
                    error: params
                }
            }).done(function (result) {
                console.log(result);
            }).fail(function () {
                console.log('请求错误');
            });
        },
        select = function (params){
            $.ajax({
                url: ip + url.select,
                type: 'POST',
                data: params
            }).done(function (result) {
                console.log(result);
            }).fail(function () {
                console.log('请求错误');
            })
        };
    $add.on('click',function(){
        insert(err);
    });
    $select.on('click',function(){
        select({
            start: 0,
            length: 10
        });
    });
    window.console.submit = function(err) {
        insert(err);
    }
})