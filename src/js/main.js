/**
 * Created by chiang on 2017/6/8.
 */
canvas_x = 10
canvas_y = 20

directionObj = Object.create(Control_direction)
beans_pond = Object.create(Generate_beans)

window.onload = function () {
    init_canvas(canvas_x, canvas_y, $('canvas'))
    Show.fill_canvas(directionObj.snake_body)
    run()
};

/**
 * 开始执行
 */
function run() {
    //监听键盘
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (is_exist(directionObj.allow_set, e.code)) {
            if (is_exist(directionObj.direction_set, e.code)) {
                //下行时不允许上行操作,反之亦然
                if (e.code == 'ArrowUp' && directionObj.next_direction != 'ArrowDown') {
                    directionObj.pause()
                    directionObj.next_direction = e.code
                    directionObj.start()
                }

                if (e.code == 'ArrowDown' && directionObj.next_direction != 'ArrowUp') {
                    directionObj.pause()
                    directionObj.next_direction = e.code
                    directionObj.start()
                }

                //右行时不允许左行操作，反之亦然
                if (e.code == 'ArrowLeft' && directionObj.next_direction != 'ArrowRight') {
                    directionObj.pause()
                    directionObj.next_direction = e.code
                    directionObj.start()
                }

                if (e.code == 'ArrowRight' && directionObj.next_direction != 'ArrowLeft') {
                    directionObj.pause()
                    directionObj.next_direction = e.code
                    directionObj.start()
                }

            }
        }
    };
}



