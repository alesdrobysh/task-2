(function (root) {
    var map = root.maze.MAZE_Y;

    document.querySelector('.outer').appendChild(
        root.maze.render(map)
    );

    var path = root.maze.solution(map, 1, 0);

    //root.maze.visualizeWaves(maze.WAVES);

    root.maze.renderPath(path);
})(this);
