(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;
    var WAVES = root.maze.WAVES;

    var SOLUTION = [];
    var START = 1;

    function isPassable(maze, y, x) {
        var indexOutOfMaze = x < 0 || y < 0 || y > maze.length - 1 || x > maze[0].length - 1;

        if (indexOutOfMaze) {
            return false;
        }

        return maze[y][x] === EMPTY;
    }

    function isAnotherOneWavePossible(maze, y, x) {
        if(isPassable(maze, y - 1, x)) {
            return true;
        }

        if(isPassable(maze, y, x - 1)) {
            return true;
        }
        if(isPassable(maze, y + 1, x)) {
            return true;
        }
        if(isPassable(maze, y, x + 1)) {
            return true;
        }

        return false;
    }

    function isFinish(maze, y, x) {
        return y === maze.length - 1;
    }

    function restorePath(maze, y, x, waveNumber) {
        var path = [[x, y]];

        for (var i = waveNumber - 1; i >= START; i--) {
            if(maze[y - 1] && maze[y - 1][x] === i) {
                path.unshift([x, y - 1]);
                y = y - 1;
                continue;
            }

            if(maze[y][x - 1] && maze[y][x - 1] === i) {
                path.unshift([x - 1, y]);
                x = x - 1;
                continue;
            }

            if(maze[y + 1] && maze[y + 1][x] === i) {
                path.unshift([x, y + 1]);
                y = y + 1;
                continue;
            }

            if(maze[y][x + 1] && maze[y][x + 1] === i) {
                path.unshift([x + 1, y]);
                x = x + 1;
                continue;
            }
        };

        SOLUTION = path;
    }

    function wave(maze, y, x, waveNumber) {
        maze[y][x] = waveNumber;

        WAVES[waveNumber] = WAVES[waveNumber] || [];
        WAVES[waveNumber].push([y, x]);

        if(isFinish(maze, y, x)) {
            restorePath(maze, y, x, waveNumber);
        } else if(isAnotherOneWavePossible(maze, y, x)) {
            if(isPassable(maze, y - 1, x)) {
                wave(maze, y - 1, x, waveNumber + 1);
            }

            if(isPassable(maze, y, x - 1)) {
                wave(maze, y, x - 1, waveNumber + 1);
            }

            if(isPassable(maze, y + 1, x)) {
                wave(maze, y + 1, x, waveNumber + 1);
            }

            if(isPassable(maze, y, x + 1)) {
                wave(maze, y, x + 1, waveNumber + 1);
            }
        }

    }

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {
        var mazeCopy = maze.slice();
        var waveNumber = START;

        wave(maze, y, x, waveNumber);

        return SOLUTION;
    }

    root.maze.solution = solution;
})(this);
