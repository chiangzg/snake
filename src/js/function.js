/**
 * Created by chiang on 2017/6/8.
 */

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
        beans_pond.beans_pond_y.push(i + 1)
        var axis_x = x
        for (var j = 0; j < axis_x; j++) {
            var point = 'x' + j + 'y' + i
            canvas_cont += '<div class="size" id="' + point + '"></div>'
        }
    }

    //构建豆池
    for (var j = 0; j < x; j++) {
        beans_pond.beans_pond_x.push(j + 1)
    }
    beans_pond.update_pond()

    canvas.innerHTML = canvas_cont
}

/**
 * 控制类
 * @type {{}}
 */
var Control_direction = {
    //构建蛇身体
    snake_body: [{x: 5, y: 9}, {x: 5, y: 10}, {x: 5, y: 11}],

    //清除的身体
    remove_body: null,

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
        if (axis_y < 0) {
            this.end()
            return
        }

        var elem = {x: axis_x, y: axis_y}
        var last = this.snake_body.pop()
        Show.remove_class(last)
        this.snake_body.unshift(elem)
        Show.add_class(elem)
        this.remove_body = last
    },

    //下方向
    move_down: function () {
        var axis_y = this.snake_body[0].y + 1
        var axis_x = this.snake_body[0].x
        if (axis_y >= canvas_y) {
            this.end()
            return
        }
        var elem = {x: axis_x, y: axis_y}
        var last = this.snake_body.pop()
        Show.remove_class(last)
        this.snake_body.unshift(elem)
        Show.add_class(elem)
        this.remove_body = last
    },

    //左方向
    move_left: function () {
        var axis_y = this.snake_body[0].y
        var axis_x = this.snake_body[0].x - 1
        if (axis_x < 0) {
            this.end()
            return
        }

        var elem = {x: axis_x, y: axis_y}
        var last = this.snake_body.pop()
        Show.remove_class(last)
        this.snake_body.unshift(elem)
        Show.add_class(elem)
        this.remove_body = last
    },

    //右方向
    move_right: function () {
        var axis_y = this.snake_body[0].y
        var axis_x = this.snake_body[0].x + 1
        if (axis_x >= canvas_x) {
            this.end()
            return
        }

        var elem = {x: axis_x, y: axis_y}
        var last = this.snake_body.pop()
        Show.remove_class(last)
        this.snake_body.unshift(elem)
        Show.add_class(elem)
        this.remove_body = last
    },
    run: function () {

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
        return
    }
}

/**
 * 显示
 * @type {{fill_canvas: Show.fill_canvas, add_class: Show.add_class}}
 */
var Show = {
    fill_canvas: function (body) {
        for (index in body) {
            this.add_class(body[index])
        }
    },
    add_class: function (body) {
        var point = 'x' + body.x + 'y' + body.y
        var origin_class = $(point).getAttribute('class')
        var class_name = 'fill_box'
        if (origin_class != null) {
            class_name = origin_class + ' ' + class_name
        }
        $(point).setAttribute('class', class_name)
    },
    remove_class: function (body) {
        var point = 'x' + body.x + 'y' + body.y
        $(point).setAttribute('class', 'size')
    }
}

var Generate_beans = {
    beans_pond_x: [],
    beans_pond_y: [],
    update_pond: function () {
        for (index in directionObj.snake_body) {
            this.beans_pond_x.splice(directionObj.snake_body[index].x, 1)
            this.beans_pond_y.splice(directionObj.snake_body[index].y, 1)
        }

        //蛇身尾迹加入豆池
        if (this.remove_body != null) {
            for (index in directionObj.remove_body)
            this.beans_pond_y.push(directionObj.remove_body[index].y)
            this.beans_pond_x.push(directionObj.remove_body[index].x)
        }

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

function move_snake() {

    switch (directionObj.next_direction) {
        case 'ArrowUp':
            directionObj.move_up()
            break;
        case 'ArrowDown':
            directionObj.move_down()
            break;
        case 'ArrowLeft':
            directionObj.move_left()
            break;
        case 'ArrowRight':
            directionObj.move_right()
            break;
        default:
            break;
    }

    //更新豆池
    beans_pond.update_pond()
    console.log(beans_pond.beans_pond_y)
    console.log(beans_pond.beans_pond_x)

}
