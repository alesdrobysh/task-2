(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;
    var VIZUALIZATION_DELAY = maze.VIZUALIZATION_DELAY;
    var VIZUALIZATION_COLOR = maze.VIZUALIZATION_COLOR;

    /**
     * Создает HTML элемент заданного типа с заданным CSS классом
     *
     * @param {string} type тип создаваемого HTML элемента
     * @param {string} className CSS класс
     * @returns {HTMLElement} HTML элемент
     */
    function element(type, className) {
        var elem = document.createElement(type);
        elem.className = className;
        return elem;
    }

    /**
     * Создает визуализацию лабиринта по его схеме
     *
     * @param {number[][]} maze схема лабиринта
     * @returns {HTMLElement} HTML элемент
     */
    function render(maze) {
        /*if (path && path.length) {
            var point,
                i;

            for (i = 0; i < path.length; i++) {
                point = path[i];
                maze[point[1]][point[0]] = PATH;
            }
            point = path[path.length - 1];
            maze[point[1]][point[0]] = CURRENT;
        }*/

        var containerElem = element('div', 'maze'),
            rowElem,
            type,
            row,
            cell,
            x,
            y;

        for (y = 0; y < maze.length; y++) {
            row = maze[y];
            rowElem = element('div', 'maze__row');

            for (x = 0; x < row.length; x++) {
                cell = row[x];

                switch (cell) {
                    case WALL:
                        type = 'wall';
                        break;
/*
                    case PATH:
                        type = 'path';
                        break;

                    case CURRENT:
                        type = 'current';
                        break;
*/
                    default:
                        type = undefined;
                }

                rowElem.appendChild(
                    element('div', 'maze__cell' + (type ? ' maze__cell_' + type : ''))
                );
            }

            containerElem.appendChild(rowElem);
        }

        return containerElem;
    }

    function visualizeWave(waves, wave) {
        waves[wave].forEach(function(point) {
            var cell = document.querySelector('.maze')
                            .querySelectorAll('.maze__row')[point[0]]
                            .querySelectorAll('.maze__cell')[point[1]];

            cell.style.backgroundColor = VIZUALIZATION_COLOR;
            cell.style.opacity = wave/Object.keys(waves).length;
        });
    }

    function visualizeWaves(waves, pathRenderer, path) {
        var wavesNumbers = Object.keys(waves);

        for (var i = 0; i < wavesNumbers.length + 1; i++) {
            if (i < wavesNumbers.length) {
                setTimeout(visualizeWave.bind(null, waves, wavesNumbers[i]), (i + 1)*VIZUALIZATION_DELAY);
            } else if (pathRenderer && path) {
                setTimeout(pathRenderer.bind(null, path), (i + 1)*VIZUALIZATION_DELAY);
            }
        }
    }

    function renderPath(path) {
        path.forEach(function(point) {
            var cell = document.querySelector('.maze')
                            .querySelectorAll('.maze__row')[point[1]]
                            .querySelectorAll('.maze__cell')[point[0]];

            cell.style.removeProperty('background-color');
            cell.style.removeProperty('opacity');
            cell.classList.add('maze__cell_path');
        });

        var lastPoint = path[path.length - 1];
        var lastCell = document.querySelector('.maze')
                            .querySelectorAll('.maze__row')[lastPoint[1]]
                            .querySelectorAll('.maze__cell')[lastPoint[0]];

        lastCell.classList.add('maze__cell_current');
    }

    root.maze.render = render;
    root.maze.visualizeWaves = visualizeWaves;
    root.maze.renderPath = renderPath;
})(this);
