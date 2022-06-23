let url = `ws://${window.location.host}/ws/socket-server/`

const chatSocket = new WebSocket(url)

$(function(){
    var canvas = $('.whiteboard')[0]
    var context = canvas.getContext('2d')
    var current = {color: 'black'};
    var drawing = false

    function drawLine2(x0, y0, x1, y1, color){
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1,y1);
        context.strokeStyle = current.color
        context.lineWidth = 2
        context.stroke();
        context.closePath();
    }

    function drawLine(x0, y0, x1, y1, color) {
//        console.log(x0, y0, x1, y1)
        chatSocket.send(JSON.stringify({
            'x0': x0,
            'y0': y0,
            'x1': x1,
            'y1': y1,
            'color': color
        }))
    }

    function onMouseDown(e) {
        drawing = true;
        console.log(e.clientY)
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onMouseUp(e) {
        if (!drawing){return;}
        drawing = false;
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color)
    }

    function onMouseMove(e) {
        if (!drawing){return;}
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color);
        current.x = e.clientX;
        current.y = e.clientY;
    };

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    chatSocket.onmessage = function(e){
        let data = JSON.parse(e.data)
        var result = data['data']

        if(data.type === 'chat'){
            console.log(result)
            drawLine2(result['x0'], result['y0'], result['x1'], result['y1'], result['color'])
        }
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseout', onMouseUp)
    canvas.addEventListener('mousemove', onMouseMove)

    window.addEventListener('resize', onResize);
    onResize()
})