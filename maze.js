class Maze {
  constructor(context, rows, cols, size, scale) {
    this.c = context;
    this.cols = cols;
    this.rows = rows;
    this.size = size;
    this.scale = scale;
    this.cells = [];
    this.path = [];
    this.complete = false;
    this.cellStrokeColor = "#000";
    this.cellFinalFillColor = "#fff";
    this.skips = {
      odd: [
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, 0],
        [1, 1]
      ],
      evn: [
        [-1, -1],
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0]
      ]
    }
    this.#createMaze();
    this.#setNeighbor();
    this.current = this.cells[0][0];
    this.#preActive(this.current, true);
    this.current.visited = true;
  }
  
  setStrockColor(color) {
    this.cellStrokeColor = color;
  }
  setFinalFillColor(color) {
    this.cellFinalFillColor = color;
  }
  
  reset(rows, cols, size) {
    this.cells = [];
    this.path = [];
    this.cols = cols;
    this.rows = rows;
    this.size = size;
    this.complete = false;
    this.#createMaze();
    this.#setNeighbor();
    this.current = this.cells[0][0];
    this.#preActive(this.current, true);
    this.current.visited = true;
  }

  #createMaze() {
    const { cols, rows, c, size, scale } = this;
    for (let i = 0; i < cols; i++) {
      this.cells[i] = [];
      const crows = i % 2 ? rows - 1 : rows;
      for (let j = 0; j < crows; j++) {
        this.cells[i][j] = new Cell(c, i, j, size, scale, this);
      }
    }
  }

  #setNeighbor() {
    const { cols, rows } = this;

    for (let i = 0; i < cols; i++) {
      const crows = i % 2 ? rows - 1 : rows;
      for (let j = 0; j < crows; j++) {

        const name = i % 2 ? "odd" : "evn";
        this.skips[name].forEach((s) => {
          if (
            this.#isNeighborExist(i + s[0], j + s[1])
          ) {
            this.cells[i][j].neighbors.push(
              this.cells[i + s[0]][j + s[1]]
            );
          }
        });
      }
    }
  }

  #removeWall(y, i, j, old, newe) {
    const name = y % 2 ? "odd" : "evn";
    this.skips[name].forEach((s, I) => {
      if (i == s[0] && j == s[1]) {

        //br  bl l  tl tr  r
        switch (I) {
          case 0:
            this.#rmBdr(old, 3);
            this.#rmBdr(newe, 0);
            break;
          case 1:
            this.#rmBdr(old, 4);
            this.#rmBdr(newe, 1);
            break;
          case 2:
            this.#rmBdr(old, 2);
            this.#rmBdr(newe, 5);
            break;
          case 3:
            this.#rmBdr(old, 5);
            this.#rmBdr(newe, 2);
            break;
          case 4:
            this.#rmBdr(old, 1);
            this.#rmBdr(newe, 4);
            break;
          case 5:
            this.#rmBdr(old, 0);
            this.#rmBdr(newe, 3);
            break;
        }
      }
    });
  }

  #rmBdr(cell, i) {
    cell.wall[i] = 0;
  }


  #isNeighborExist(y, x) {
    return x >= 0 && x < this.rows &&
      y >= 0 && y < this.cols && this.cells[y][x];
  }

  update() {
    if (!this.complete) {
      this.current.active = false;
      const currentNeighbors = this.current.neighbors.filter((cell) => !cell.visited);

      if (currentNeighbors.length > 0) {
        const rndIndex = Math.floor(currentNeighbors.length * Math.random());
        const rndCell = currentNeighbors[rndIndex];
        this.path.push(rndCell);
        
        this.#preActive(this.current);
        this.#preActive(rndCell, true);

        const old = this.current
        this.current = rndCell;

        const di = rndCell.i - old.i;
        const dj = rndCell.j - old.j;

        this.#removeWall(old.i, di, dj, old, rndCell);

        this.current.active = true;
        rndCell.visited = true;

      } else if (this.path.length > 0) {
        const last = this.path.pop();
        last.back = true;

        if (this.path.length == 0) {
          this.cells[0][0].back = true;
          this.complete = true;
          
          this.cells.forEach((cols) => {
            cols.forEach((cell) => {
              cell.complete = true;
            })
          })
        }

        if (this.path.length > 0) {
          const pre = this.path[this.path.length - 1];
          this.current = pre;
          this.current.active = true;
        }
      }
    }
  }

  #preActive(cell, bool = false) {
    cell.neighbors.forEach((cell) => {
      cell.preActive = bool;
    });
  }

  draw() {
    this.cells.forEach((cell) => {
      cell.forEach((cl) => {
        cl.draw();
      })
    })
  }
}