class Cell {
  constructor(ctx, i, j, size, scl, maze, color = "#333") {
    this.c = ctx;
    this.y = i * size + size;
    this.x = j * size + size;
    this.i = i;
    this.j = j;
    this.maze = maze;
    this.points = [];
    this.neighbors = [];
    this.size = size;
    this.scale = scl;
    this.color = color;
    this.visited = false;
    this.back = false;
    this.active = false;
    this.preActiv = false;
    this.complete = false;
    this.finalUpdate = false;
    //          br  bl l  tl tr  r
    this.wall = [1, 1, 1, 1, 1, 1];


    if (i % 2) {
      this.x = j * size + size * 1.5;
    }
    this.#createHexagon();
    c.lineCap = "round";
    c.lineJoin = "round";
    c.imageSmoothingEnabled = false;
  }

  #createHexagon() {
    const { c, x, y, size, wall } = this;
    const wallLen = wall.length;

    for (let i = 0; i < wallLen; i++) {
      const j = (i + 1 + wallLen) % wallLen;
      const a = this.#aglPoint(i);
      const b = this.#aglPoint(j);

      this.points[i] = [
        { x: x + a.x, y: y + a.y },
        { x: x + b.x, y: y + b.y }
      ];
    }
  }

  draw() {
    const { c, points, size, color, scale } = this;
    if (!this.complete || !this.finalUpdate) {
      c.lineWidth = 1.4 * scale;
    
      // fill
      c.beginPath();
      c.moveTo(points[0][0].x, points[0][0].y);
      for (let i = 1; i < points.length; i++) {
        c.lineTo(points[i][0].x, points[i][0].y);
      }
      if (this.complete) {
        c.fillStyle = this.maze.cellFinalFillColor;
        this.finalUpdate = true;
      }
      else if (this.active) c.fillStyle = "#fff";
      else if (this.back) c.fillStyle = "#ff0";
      else if (this.visited) c.fillStyle = "#0ff";
      else c.fillStyle = color;
      c.fill();

      // pre active
      if (!this.visited && !this.back && this.preActive) {
        c.beginPath();
        c.moveTo(points[0][0].x, points[0][0].y);
        for (let i = 1; i < points.length; i++) {
          c.lineTo(points[i][0].x, points[i][0].y);
        }
        c.fillStyle = "#fff3";
        c.fill();
      }

      // wall
      points.forEach((point, i) => {
        if (this.wall[i]) c.strokeStyle = this.maze.cellStrokeColor;
        else c.strokeStyle = "#0000";

        const a = point[0];
        const b = point[1];

        c.beginPath();
        c.moveTo(a.x, a.y);
        c.lineTo(b.x, b.y);
        c.stroke();
      });
    }
  }

  #aglPoint(da) {
    const a = (Math.PI / 3) * (da + 0.5);
    return {
      x: Math.cos(a) * (this.size * 0.58),
      y: Math.sin(a) * (this.size * 0.68)
    }
  }
}