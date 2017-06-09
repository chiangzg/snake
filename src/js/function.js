/**
 * Created by chiang on 2017/6/8.
 */

/**
 * 控制类
 * @type {{snake_body: [*], run_flag: null, cur_direction: string, next_direction: string, sleep_time: number, direction_set: [*], allow_set: [*], move_up: Control_direction.move_up, move_down: Control_direction.move_down, move_left: Control_direction.move_left, move_right: Control_direction.move_right, run: Control_direction.run, start: Control_direction.start, pause: Control_direction.pause, end: Control_direction.end}}
 */
var Control_direction = {
    //构建蛇身体
    snake_body: [{x: 5, y: 9}, {x: 5, y: 10}, {x: 5, y: 11}],

    //运行标志
    run_flag: null,

    //目前方向
    cur_direction: 'ArrowUp',

    //下一个方向
    next_direction: 'ArrowUp',

    //行动间隔时间（ms）
    sleep_time: 1000,

    //合法按键
    direction_set: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    allow_set: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Space'],

    //上方向
    move_up: function () {
        var axis_y = this.snake_body[0].y - 1
        var axis_x = this.snake_body[0].x
        if (axis_y < 0 || !this.is_accord_rule(axis_x, axis_y)) {
            this.end()
            return false
        }

        var elem = {x: axis_x, y: axis_y}
        this.snake_body.unshift(elem)
        if (this.is_add_beans(elem)) {
            this.add_beans()
        } else {
            Show.remove_class(this.snake_body.pop())
        }

        Show.add_class(elem)
        return true
    },

    //下方向
    move_down: function () {
        var axis_y = this.snake_body[0].y + 1
        var axis_x = this.snake_body[0].x
        if (axis_y >= canvas_y || !this.is_accord_rule(axis_x, axis_y)) {
            this.end()
            return false
        }

        var elem = {x: axis_x, y: axis_y}
        this.snake_body.unshift(elem)
        if (this.is_add_beans(elem)) {
            this.add_beans()
        } else {
            Show.remove_class(this.snake_body.pop())
        }

        Show.add_class(elem)
        return true
    },

    //左方向
    move_left: function () {
        var axis_y = this.snake_body[0].y
        var axis_x = this.snake_body[0].x - 1
        if (axis_x < 0 || !this.is_accord_rule(axis_x, axis_y)) {
            this.end()
            return false
        }

        var elem = {x: axis_x, y: axis_y}
        this.snake_body.unshift(elem)
        if (this.is_add_beans(elem)) {
            this.add_beans()
        } else {
            Show.remove_class(this.snake_body.pop())
        }

        Show.add_class(elem)
        return true
    },

    //右方向
    move_right: function () {
        var axis_y = this.snake_body[0].y
        var axis_x = this.snake_body[0].x + 1
        if (axis_x >= canvas_x || !this.is_accord_rule(axis_x, axis_y)) {
            this.end()
            return false
        }

        var elem = {x: axis_x, y: axis_y}
        this.snake_body.unshift(elem)
        if (this.is_add_beans(elem)) {
            this.add_beans()
        } else {
            Show.remove_class(this.snake_body.pop())
        }

        Show.add_class(elem)
        return true
    },

    //是否增加身体
    is_add_beans: function (first_body) {
        var beans = beans_pond.beans_point[0]
        if (first_body.x == beans.x && first_body.y == beans.y) {
            return true
        }
        return false;
    },
    //规则
    is_accord_rule: function (point_x, point_y) {
        for (var index in this.snake_body) {
            if (this.snake_body[index].x == point_x && this.snake_body[index].y == point_y) {
                return false
            }
        }
        return true
    },

    //增加身体
    add_beans: function () {
        var beans = beans_pond.beans_point.pop()
        Show.remove_class(beans)
        Show.add_class(beans, Show.body_css)
        beans_pond.update_pond()
    },
    start: function () {
        move_snake()
        this.run_flag = setInterval("move_snake()", this.sleep_time)
    },
    pause: function () {
        clearInterval(directionObj.run_flag)
    },

    //停止运动
    end: function () {
        clearInterval(this.run_flag)
        alert('GameOver！')
        location.reload(true)
        return
    }
}

/**
 * 显示
 * @type {{fill_canvas: Show.fill_canvas, add_class: Show.add_class}}
 */
var Show = {
    //蛇身样式
    body_css: 'fill_box',

    //豆子样式
    beans_css: 'beans',

    //填充画布
    fill_canvas: function (body, class_name) {
        if (!class_name) class_name = this.body_css;

        for (index in body) {
            this.add_class(body[index], class_name)
        }
    },

    //显示
    add_class: function (body, class_name) {
        if (!class_name) class_name = this.body_css;
        var point = 'x' + body.x + 'y' + body.y
        var origin_class = $(point).getAttribute('class')
        if (origin_class != null) {
            class_name = origin_class + ' ' + class_name
        }

        $(point).setAttribute('class', class_name)
    },

    //隐藏
    remove_class: function (body) {
        var point = 'x' + body.x + 'y' + body.y
        $(point).setAttribute('class', 'size')
    }
}

/**
 * 生成豆子
 * @type {{beans_pond_x: Array, beans_pond_y: Array, beans_point: Array, update_pond: Generate_beans.update_pond, init_pond: Generate_beans.init_pond, create_beans: Generate_beans.create_beans}}
 */
var Generate_beans = {
    //豆池
    beans_map: [],

    //豆子所在位置
    beans_point: [],

    //更新豆池
    update_pond: function () {
        for (index in directionObj.snake_body) {
            var point_x = directionObj.snake_body[index].x
            var point_y = directionObj.snake_body[index].y

            this.beans_map[point_y][point_x] = 1
        }

        //筛选出允许的坐标点
        var allow_point_list = []
        for (var index in this.beans_map) {
            var point_x_list = this.beans_map[index]
            for (point_x in point_x_list) {
                if (point_x_list[point_x] != 1) {
                    allow_point_list.push({x: parseInt(point_x), y: parseInt(index)})
                }
            }
        }

        this.create_beans(allow_point_list)
    },

    //创建豆子
    create_beans: function (point_list) {
        var point = point_list[Math.floor(Math.random() * point_list.length)]
        this.beans_point.push(point)
        Show.add_class(point, Show.beans_css)
    }
}

/**
 * 通过id获取dom
 * @param id
 * @returns {Element}
 */
function $(id) {
    return document.getElementById(id)
}

/**
 * object中是否存在index
 * @param object
 * @param index
 */
function is_exist(object, index) {
    for (x in object) {
        if (object[x] == index) {
            return true
        }
    }
    return false
}

/**
 * 单步移动
 * @returns {boolean}
 */
function move_snake() {

    var move_result = false
    switch (directionObj.next_direction) {
        case 'ArrowUp':
            move_result = directionObj.move_up()
            break;
        case 'ArrowDown':
            move_result = directionObj.move_down()
            break;
        case 'ArrowLeft':
            move_result = directionObj.move_left()
            break;
        case 'ArrowRight':
            move_result = directionObj.move_right()
            break;
        default:
            break;
    }

    return move_result
}

/**
 * 构建画布
 * @param x x-axis
 * @param y y-axis
 * @param canvas 画布
 */
function init_canvas(x, y, canvas) {
    var canvas_cont = ''
    for (var i = 0; i < y; i++) {
        //构建豆池
        beans_pond.beans_map.push([])
        var axis_x = x
        for (var j = 0; j < axis_x; j++) {
            //画布
            var point = 'x' + j + 'y' + i
            canvas_cont += '<div class="size" id="' + point + '"></div>'

            //豆池
            beans_pond.beans_map[i].push(0)
        }
    }

    canvas.innerHTML = canvas_cont
    beans_pond.update_pond()
}