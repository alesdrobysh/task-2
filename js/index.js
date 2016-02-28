(function (root) {
    var map = root.maze.MAZE_51;

    document.querySelector('.outer').appendChild(
        root.maze.render(map)
    );

    var path = root.maze.solution(map, 1, 0);

    root.maze.visualize(maze.WAVES);
})(this);
