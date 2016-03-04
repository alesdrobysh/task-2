(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;
    var WAVES = root.maze.WAVES;

    var PATHS = root.maze.PATHS = [];
    var START = 1;

    /**
     * Проверяет можно ли продвинуться в указанную точку
     *
     * @param  {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param  {number} координата точки проходимость которой проверяем по оси Y
     * @param  {number} координата точки проходимость которой проверяем по оси Y
     * @return {Boolean}
     */
    function isPassable(maze, y, x) {
        var indexOutOfMaze = x < 0 || y < 0 || y > maze.length - 1 || x > maze[0].length - 1;

        if (indexOutOfMaze) {
            return false;
        }

        return maze[y][x] === EMPTY;
    }

    /**
     * Проверяет можно ли продвинуться дальше из указанной точки
     *
     * @param  {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param  {number} координата точки по оси Y из которой ищется дальнейший путь
     * @param  {number} координата точки по оси X из которой ищется дальнейший путь
     * @return {Boolean}
     */
    function isAnotherOneWavePossible(maze, y, x) {
        if (isPassable(maze, y - 1, x)) {
            return true;
        }

        if (isPassable(maze, y, x - 1)) {
            return true;
        }
        if (isPassable(maze, y + 1, x)) {
            return true;
        }
        if (isPassable(maze, y, x + 1)) {
            return true;
        }

        return false;
    }

    /**
     * Проверяет является ли координата финишной
     *
     * @param  {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param  {number} предполагаемая координата точки финиша по оси Y
     * @param  {number} предполагаемая координата точки финиша по оси X
     * @return {Boolean}
     */
    function isFinish(maze, y, x) {
        return y === maze.length - 1;
    }

    /**
     * Восстанавливает путь от точки финиша до точки старта
     *
     * @param  {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param  {number} координата точки финиша по оси Y
     * @param  {number} координата точки финиша по оси X
     * @param  {number} номер волны, во время которой была обнаружена точка финиша
     * @return {void}
     */
    function restorePath(maze, y, x, waveNumber) {
        var path = [[x, y]];

        for (var i = waveNumber - 1; i >= START; i--) {
            if (maze[y - 1] && maze[y - 1][x] === i) {
                path.unshift([x, y - 1]);
                y = y - 1;
                continue;
            }

            if (maze[y][x - 1] && maze[y][x - 1] === i) {
                path.unshift([x - 1, y]);
                x = x - 1;
                continue;
            }

            if (maze[y + 1] && maze[y + 1][x] === i) {
                path.unshift([x, y + 1]);
                y = y + 1;
                continue;
            }

            if (maze[y][x + 1] && maze[y][x + 1] === i) {
                path.unshift([x + 1, y]);
                x = x + 1;
                continue;
            }
        };

        PATHS.push(path);
    }

    /**
     * Находит кратчайший путь из лабиринта из предоставленных возможных
     *
     * @param  {[number, number][][]} массив всевозможных путей из лабиринта
     * @return {[number, number][]} кратчайший путь из лабиринта
     */
    function getShortestPath(paths) {
        var indexOfShortestPath = 0;
        var shortestPathLength = paths[0].length;

        for (var i = 0; i < paths.length; i++) {
            if (paths[i].length < shortestPathLength) {
                shortestPathLength = paths[i].length;
                indexOfShortestPath = i;
            }
        }

        return paths[indexOfShortestPath];
    }

    /**
     * Реализация алгоритма Ли для поиска выхода из лабиринта
     *
     * @param  {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param  {number} координата точки старта по оси Y
     * @param  {number} координата точки старта по оси X
     * @param  {number} номер первой волны
     * @return {void}
     */
    function lee(maze, yStart, xStart, waveNumber) {
        var dx = [1, 0, -1, 0];
        var dy = [0, 1, 0, -1];
        var mazeHeight = maze.length;
        var mazeWidth = maze[0].length;
        var stop = false;
        var x, y, k;

        maze[yStart][xStart] = waveNumber;

        WAVES[waveNumber] = [];
        WAVES[waveNumber].push([yStart, xStart]);

        do {
            stop = true;

            for (y = 0; y < mazeHeight; y++) {
                for (x = 0; x < mazeWidth; x++) {
                    if (maze[y][x] === waveNumber) {
                        WAVES[waveNumber] = WAVES[waveNumber] || [];
                        WAVES[waveNumber].push([y, x]);

                        if (isFinish(maze, y, x)) {
                            restorePath(maze, y, x, waveNumber);
                        }

                        for (k = 0; k < 4; k++) {
                            var iy = y + dy[k];
                            var ix = x + dx[k];

                            if (isPassable(maze, iy, ix)) {
                                stop = false;
                                maze[iy][ix] = waveNumber + 1;
                            }
                        }
                    }
                }
            }

            waveNumber++;
        } while (!stop);

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

        lee(maze, y, x, waveNumber);

        return getShortestPath(PATHS);
    }

    root.maze.solution = solution;
})(this);
