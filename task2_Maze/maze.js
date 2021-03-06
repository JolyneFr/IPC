var ctxs, wid, hei, cols, rows, mazes, stacks = [];
var quadSteps=[{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
var octSteps=[{dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1}, {dx: 1, dy: 0}, {dx: 1, dy: 1}, {dx: 0, dy: 1}, {dx: -1, dy: 1}, {dx: -1, dy: 0}];
var start = [{x:-1, y:-1}, {x:-1, y:-1}], end = [{x:-1, y:-1}, {x:-1, y:-1}],grid = 4;
var padding = 16, s, density=0.5, count=2;

function drawMaze(index) {
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            switch( mazes[index][i][j] ) {
                case 0: ctxs[index].fillStyle = "gray"; break;
                case 1: ctxs[index].fillStyle = "black"; break;
                case 2: ctxs[index].fillStyle = "red"; break;
                case 3: ctxs[index].fillStyle = "yellow"; break;
                case 4: ctxs[index].fillStyle = "#500000"; break;
                case 8: ctxs[index].fillStyle = "blue"; break;
                case 9: ctxs[index].fillStyle = "gold"; break;
            }
            ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}

function drawBlock(ctx, sx, sy, a) {
    switch( a ) {
        case 0: ctx.fillStyle = "black"; break;
        case 1: ctx.fillStyle = "gray"; break;
        case 2: ctx.fillStyle = "red"; break;
        case 3: ctx.fillStyle = "yellow"; break;
        case 4: ctx.fillStyle = "#500000"; break;
        case 8: ctx.fillStyle = "blue"; break;
        case 9: ctxs[index].fillStyle = "gold"; break;
    }
    ctx.fillRect( grid * sx, grid * sy, grid, grid  );
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getNextStepForMaze1( index, sx, sy, a ) {
    var n = [];

    for (let i = 0; i < quadSteps.length; i++) {
        const step = quadSteps[i];
        
        if(sx + step.dx > 0 && sx + step.dx < cols - 1 && sy + step.dy > 0 && sy + step.dy < rows - 1 &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){
            n.push({x: sx + step.dx, y: sy + step.dy});
        }
    }
    //shuffleArray(n);
    return n;
}

function getNextStepForMaze1AStar( index, sx, sy, a ) {
    var n = [];

    for (let i = 0; i < quadSteps.length; i++) {
        const step = quadSteps[i];
        
        if(sx + step.dx > 0 && sx + step.dx < cols - 1 && sy + step.dy > 0 && sy + step.dy < rows - 1 &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){
            n.push({x: sx + step.dx, y: sy + step.dy});
        }
    }
    return n;
}

function getOptimizedNextStepForMaze1(index, sx, sy, a) {

    var n = [];
    var min = cols > rows ? cols : rows;
    min =  2 * min * min;

    var pos = -1;

    for (let i = 0; i < quadSteps.length; i ++) {
        const step = quadSteps[i];

        if(sx + step.dx > -1 && sx + step.dx < cols && sy + step.dy > -1 && sy + step.dy < rows &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){

            distance = (end[index].x - sx - step.dx) * (end[index].x - sx - step.dx) + 
                        (end[index].y - sy - step.dy) * (end[index].y - sy - step.dy);
    
            if (distance < min) {
                pos = i;
                min = distance;
            }
        }
    }

    if (pos > -1) {
        n.push({x: sx + quadSteps[pos].dx, y: sy + quadSteps[pos].dy});
    }

    shuffleArray(n);

    return n; 
}

function getNextStepForMaze2( index, sx, sy, a ) {
    var n = [];

    for (let i = 0; i < octSteps.length; i++) {
        const step = octSteps[i];
        
        if(sx + step.dx >= 0 && sx + step.dx <= cols - 1 && sy + step.dy >= 0 && sy + step.dy <= rows - 1 &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){
            n.push({x: sx + step.dx, y: sy + step.dy});
        }
    }
    shuffleArray(n);
    return n;
}

function getNextStepForMaze2AStar( index, sx, sy, a ) {
    var n = [];

    for (let i = 0; i < octSteps.length; i++) {
        const step = octSteps[i];
        
        if(sx + step.dx > 0 && sx + step.dx < cols - 1 && sy + step.dy > 0 && sy + step.dy < rows - 1 &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){
            n.push({x: sx + step.dx, y: sy + step.dy});
        }
    }
    return n;
}

function getOptimizedNextStepForMaze2(index, sx, sy, a) {

    var n = [];
    var dx = end[index].x - sx;
    var dy = end[index].y - sy;
    var min = cols > rows ? cols : rows;
    min = 2 * min * min;
    var pos = -1;

    for (let i = 0; i < octSteps.length; i ++) {
        const step = octSteps[i];

        if(sx + step.dx > -1 && sx + step.dx < cols && sy + step.dy > -1 && sy + step.dy < rows &&
            mazes[index][sx + step.dx][sy + step.dy] % 8 == a){

            distance = (end[index].x - sx - step.dx) * (end[index].x - sx - step.dx) + 
                        (end[index].y - sy - step.dy) * (end[index].y - sy - step.dy);
    
            if (distance < min) {
                pos = i;
                min = distance;
            }
        }
    }

    if (pos > -1) {
        n.push({x: sx + octSteps[pos].dx, y: sy + octSteps[pos].dy});
    }

    shuffleArray(n);

    return n; 
}

function solveMaze1(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        document.getElementById("canvas1").addEventListener("mousedown", getCursorPos, false);
        return;
    }

    if(start[index].x == -1 || start[index].y == -1) return;
    var neighbours = getNextStepForMaze1( 0, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }

    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1(index);
    } );
}

function solveMaze1Optimized(index) {

    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        return;
    }

    if(start[index].x == -1 || start[index].y == -1) return;
    var neighbours = getOptimizedNextStepForMaze1( 1, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1Optimized(index);
    } );
}

function solveMaze2(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        document.getElementById("canvas1").addEventListener("mousedown", getCursorPos, false);
        return;
    }
    if(start[index].x == -1 || start[index].y == -1) return;
    var neighbours = getNextStepForMaze2( 0, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze2(index);
    } );
}

function solveMaze2Optimized(index) {

    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        retu2n;
    }
    if(start[index].x == -1 || start[index].y == -1) return;
    var neighbours = getOptimizedNextStepForMaze2( 1, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze2Optimized(index);
    } );
}

function solveMaze1_AStar(index) {
    var openList = [],
        closeList = [];
    
    if(start[index].x == -1 || start[index].y == -1) return;
    openList.push({x:start[index].x, y:start[index].y, G:0});
    drawMaze(index);

    
    recur_AStar_Maze1(index, openList, closeList);
    
}

function recur_AStar_Maze1(index, openList, closeList) {
    openList.sort(sortF);
    var currentPoint = openList.pop();
    if(start[index].x == -1 || start[index].y == -1) return;
    if( currentPoint.x == end[index].x && currentPoint.y == end[index].y ) {
        var callBackPoint = currentPoint;
        while (callBackPoint.x != start[index].x || callBackPoint.y != start[index].y) {
            mazes[index][callBackPoint.x][callBackPoint.y] = 3;
            callBackPoint = callBackPoint.parent;
        }
        mazes[index][start[index].x][start[index].y] = 3;
        drawMaze(index);
        return;
    }
    closeList.push(currentPoint); //closeList = red block?
    mazes[index][currentPoint.x][currentPoint.y] = 4;
    var neighbours = getNextStepForMaze1AStar(index, currentPoint.x, currentPoint.y, 0); //leagl & not in closeList
    for (var i in neighbours) { 
        var curNeighbour = neighbours[i];
        var openCheck = existList(curNeighbour, openList);
        if (!openCheck) {
            curNeighbour['H'] = Math.abs(curNeighbour.x - end[index].x) + Math.abs(curNeighbour.y - end[index].y);
            curNeighbour['G'] = currentPoint.G + 1;
            curNeighbour['F'] = curNeighbour.H + curNeighbour.G;
            curNeighbour['parent'] = currentPoint;
            openList.push(curNeighbour);
        } else {
            if (currentPoint.G + 1 < openList[openCheck].G) {
                openList[openCheck].parent = currentPoint;
                openList[openCheck].G = currentPoint.G + 1;
                openList[openCheck].F = openList[openCheck].G + openList[openCheck].H;
            }
        }
    }
    drawMaze(index);
    requestAnimationFrame( function() {
        recur_AStar_Maze1(index, openList, closeList);
    } );
}

function solveMaze2_AStar(index) {
    var openList = [],
        closeList = [];


    if(start[index].x == -1 || start[index].y == -1) return;
    openList.push({x:start[index].x, y:start[index].y, G:0});
    drawMaze(index);

    recur_AStar_Maze2(index, openList, closeList);
    
}

function recur_AStar_Maze2(index, openList, closeList) {
    openList.sort(sortF);
    var currentPoint = openList.pop();
    if(start[index].x == -1 || start[index].y == -1) return;
    if( currentPoint.x == end[index].x && currentPoint.y == end[index].y ) {
        var callBackPoint = currentPoint;
        while (callBackPoint.x != start[index].x || callBackPoint.y != start[index].y) {
            mazes[index][callBackPoint.x][callBackPoint.y] = 3;
            callBackPoint = callBackPoint.parent;
        }
        mazes[index][start[index].x][start[index].y] = 3;
        drawMaze(index);
        return;
    }
    closeList.push(currentPoint); //closeList = red block?
    mazes[index][currentPoint.x][currentPoint.y] = 4;
    var neighbours = getNextStepForMaze2AStar(index, currentPoint.x, currentPoint.y, 0); //leagl & not in closeList
    for (var i in neighbours) { 
        var curNeighbour = neighbours[i];
        var openCheck = existList(curNeighbour, openList);
        if (!openCheck) {
            curNeighbour['H'] = Math.abs(curNeighbour.x - end[index].x) + Math.abs(curNeighbour.y - end[index].y);
            curNeighbour['G'] = currentPoint.G + 1;
            curNeighbour['F'] = curNeighbour.H + curNeighbour.G;
            curNeighbour['parent'] = currentPoint;
            openList.push(curNeighbour);
        } else {
            if (currentPoint.G + 1 < openList[openCheck].G) {
                openList[openCheck].parent = currentPoint;
                openList[openCheck].G = currentPoint.G + 1;
                openList[openCheck].F = openList[openCheck].G + openList[openCheck].H;
            }
        }
    }
    drawMaze(index);
    requestAnimationFrame( function() {
        recur_AStar_Maze2(index, openList, closeList);
    } );
}


function sortF(a,b){
    return b.F - a.F;
}

function existList(point,list) {
    for(var i in list) {
        if(point.x==list[i].x && point.y==list[i].y) {
            return i;
        }
    }
    return false;
}

function getCursorPos( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    
    if(end[0].x != -1) {
        onClear();
    }

    if( mazes[0][x][y] ) return;
    if( start[0].x == -1 ) {
        start[0] = { x: x, y: y };
        start[1] = { x: x, y: y };
        mazes[0][start[0].x][start[0].y] = 9;
        mazes[1][start[1].x][start[1].y] = 9;
        
        for(var i = 0; i < count; i++) {
            drawMaze(i); 
        }
    } else {
        end[0] = { x: x, y: y };
        end[1] = { x: x, y: y };
        mazes[0][end[0].x][end[0].y] = 8;
        mazes[1][end[1].x][end[1].y] = 8;

        document.getElementById("canvas1").removeEventListener("mousedown", getCursorPos);

        if(document.getElementById("sltType").value == "Maze1") {
            solveMaze1(0);
            if(document.getElementById("algType").value == "A* Algorithm") {
                solveMaze1_AStar(1);    
            } else {
                solveMaze1Optimized(1);
            }
        } else {
            solveMaze2(0);
            if(document.getElementById("algType").value == "A* Algorithm") {
                solveMaze2_AStar(1);    
            } else {
                solveMaze2Optimized(1);
            }
        }

    }
}

function getNeighbours( index, sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] == a && sx - 2 > 0 && mazes[index][sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] == a && sx + 2 < cols - 1 && mazes[index][sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] == a && sy - 2 > 0 && mazes[index][sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] == a && sy + 2 < rows - 1 && mazes[index][sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
}

function createArray( c, r ) {
    var m = new Array( count );
    for( var i = 0; i < count; i++ ) {
        m[i] = new Array( c );
        for( var j = 0; j < c; j++ ) {
            m[i][j] = new Array(r);
            for(var k = 0; k < r; k++) {
                m[i][j][k] = 1;
            }
        }
    }
    return m;
}

function createMaze1() {
    var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stacks[0].length < 1 ) {

            for(var i = 0; i < count; i++) {
                drawMaze(i); 
            }

            stacks = new Array(count);
            stacks[0] = [];
            stacks[1] = [];
            
            start[0].x = start[0].y = -1;
            document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
            document.getElementById("btnCreateMaze").removeAttribute("disabled");
            document.getElementById("btnClear").removeAttribute("disabled");
            document.getElementById("rows").removeAttribute("disabled");
            document.getElementById("cols").removeAttribute("disabled");

            return;
        }
        start[0] = stacks[0].pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        mazes[0][l.x][l.y] = 0;
        mazes[1][l.x][l.y] = 0;

        l = neighbours[i + 1]; 
        mazes[0][l.x][l.y] = 0;
        mazes[1][l.x][l.y] = 0;

        start[0] = l

        stacks[0].push( start[0] )
    }
    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }
    
    requestAnimationFrame( createMaze1 );
}

function createMaze1NonAni(ctx) {

    while(true) {

        var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stacks[0].length < 1 ) {
                for(var i = 0; i < count; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                for(var i = 0; i < count; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                stacks = new Array(count);
                stacks[0] = []
                stacks[1] = [];
                
                start[0].x = start[0].y = -1;
                document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
                document.getElementById("btnCreateMaze").removeAttribute("disabled");
                document.getElementById("btnClear").removeAttribute("disabled");
                document.getElementById("rows").removeAttribute("disabled");
                document.getElementById("cols").removeAttribute("disabled");

                return;
            }
            start[0] = stacks[0].pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            mazes[0][l.x][l.y] = 0;    
            mazes[1][l.x][l.y] = 0;

            l = neighbours[i + 1]; 
            mazes[0][l.x][l.y] = 0;
            mazes[1][l.x][l.y] = 0;
    
            start[0] = l
            stacks[0].push( start[0] )
        }    
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

function createMaze2(ctx) {

    var r = Math.random();

    mazes[0][start[0].x][start[0].y] = r < density ? 0 : 1;
    mazes[1][start[0].x][start[0].y] = r < density ? 0 : 1;
    
    drawMaze(0);
    drawMaze(1);

    if(start[0].x == (cols - 1) && start[0].y == (rows - 1)){

        start[0].x = start[0].y = -1;
        document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        document.getElementById("btnClear").removeAttribute("disabled");
        document.getElementById("rows").removeAttribute("disabled");
        document.getElementById("cols").removeAttribute("disabled");

        return;
    }

    start[0].x = start[0].x + 1;
    if(start[0].x == cols){
        start[0].x = 0;
        start[0].y = start[0].y + 1;
    }

    requestAnimationFrame(createMaze2);
}

function createMaze2NonAni() {

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            flag = Math.random();
            mazes[0][i][j] = flag < density ? 0 : 1;    
            mazes[1][i][j] = flag < density ? 0 : 1;    
        }
    }

    drawMaze(0);
    drawMaze(1);

    start[0].x = start[0].y = -1;

    document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
    document.getElementById("btnClear").removeAttribute("disabled");
    document.getElementById("rows").removeAttribute("disabled");
    document.getElementById("cols").removeAttribute("disabled");
}

function createCanvas(count) {

    ctxs = new Array(count);
    mazes = new Array(count);

    for(var i = 0; i < count; i++) {
        var canvas = document.createElement( "canvas" );
        wid = document.getElementById("maze" + (i + 1)).offsetWidth - padding; 
        hei = 400;
        
        canvas.width = wid; canvas.height = 350;
        canvas.id = "canvas" + (i + 1);
        ctxs[i] = canvas.getContext( "2d" );
        ctxs[i].fillStyle = "grey"; 
        var div = document.getElementById("maze" + (i + 1))
        div.appendChild( canvas );    
    }
    
    for(var i = 0; i < count; i++) {
        ctxs[i].fillRect( 0, 0, wid, hei );
    }
}

function init() {
    createCanvas(count);
}

function onCreate() {

    stacks = new Array(count);
    stacks[0] = []
    stacks[1] = [];

    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");
    document.getElementById("btnClear").setAttribute("disabled", "disabled");
    document.getElementById("rows").setAttribute("disabled", "disabled");
    document.getElementById("cols").setAttribute("disabled", "disabled");

    wid = document.getElementById("maze1").offsetWidth - padding; 
    hei = 400;

    cols = eval(document.getElementById("cols").value); 
    rows = eval(document.getElementById("rows").value);

    var mazeType = document.getElementById("sltType").value;

    if(mazeType == "Maze1") {
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    mazes = createArray( cols, rows );

    for(var i = 0; i < count; i++) {

        var canvas = document.getElementById("canvas" + (i + 1));
        canvas.width = wid;
        canvas.height = hei;
        s = canvas.width / (grid * cols);
        canvas.height = s * grid * rows;
        ctxs[i].scale(s, s);
    }

    if(mazeType == "Maze1") {

        start[0].x = Math.floor( Math.random() * ( cols / 2 ) );
        start[0].y = Math.floor( Math.random() * ( rows / 2 ) );
        if( !( start[0].x & 1 ) ) start[0].x++; if( !( start[0].y & 1 ) ) start[0].y++;
        
        for(var i = 0; i < count; i++) {

            mazes[i][start[0].x][start[0].y] = 0;
        }

        if(document.getElementById("chkAnimated").checked) {

            createMaze1();
        }
        else {

            createMaze1NonAni();
        }
    }
    else {

        density = document.getElementById("density").value / 100;
        start[0].x = 0;
        start[0].x = 0;

        if(document.getElementById("chkAnimated").checked) {

            createMaze2();
        }
        else {

            createMaze2NonAni();
        }
    }
}

function onSltType() {
    if(document.getElementById("sltType").value == "Maze2") {
        document.getElementById("density").removeAttribute("disabled");
    }
    else {
        document.getElementById("density").setAttribute("disabled", "disabled");
    }
}

function onClear() {
    
    for(var i = 0; i < count; i++){
        for(var j = 0; j < cols; j++){
            for( var k = 0; k < rows; k++) {
                if(mazes[i][j][k] == 3 || mazes[i][j][k] == 4 || mazes[i][j][k] == 8 || mazes[i][j][k] == 9) {
                    mazes[i][j][k] = 0;
                }    
            }
        }
    }

    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }
    for(var i = 0; i < count; i++) {
        drawMaze(i); 
    }

    stacks = new Array(count);
    stacks[0] = []
    stacks[1] = [];

    start[0].x = start[0].y = -1;
    start[1].x = start[1].y = -1;

    end[0].x = end[0].y = -1;
    end[1].x = end[1].y = -1;

}