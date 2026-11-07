export const gameDifficulty = {
  difficulties: [
    { label: "1. szint: Kitérő vágány jelzőkkel (Könnyű)", value: 1 },
    { label: "2. szint: Rendező-pályaudvar (Közepes)", value: 2 },
    { label: "3. szint: Fejpályaudvari csúcsforgalom (Nehéz)", value: 3 },
  ],
  selectedDifficulty: 1,
};

export const levelConfigs = {
  1: {
    id: 1,
    name: "1. szint: Kitérő vágány jelzőkkel (Könnyű)",
    nodes: {
      B1: { x: 50, y: 150 }, //belepes
      N1: { x: 260, y: 150 }, //elso switch
      N2: { x: 460, y: 400 }, //also path torespont
      N3: { x: 580, y: 400 }, //2. switch
      N4: { x: 740, y: 150 }, //felso ag egyesulesi pont
      E1: { x: 950, y: 150 },
      E2: { x: 950, y: 400 },
    },
    paths: [
      { id: "S1", from: "B1", to: "N1" }, //bemenet
      { id: "S2", from: "N1", to: "N4" }, //felso ag
      { id: "S7", from: "N4", to: "E1" }, //exit 1
      { id: "S3", from: "N1", to: "N2" }, //lefele
      { id: "S4", from: "N2", to: "N3" }, //also
      { id: "S5", from: "N3", to: "E2" }, //exit 2
      { id: "S6", from: "N3", to: "N4" }, //vissza fel
    ],
    switches: [
      {
        id: "SW1",
        node: "N1",
        inPath: "S1",
        outPaths: ["S2", "S3"],
        activeIndex: 0,
      },
      {
        id: "SW2",
        node: "N3",
        inPath: "S4",
        outPaths: ["S5", "S6"],
        activeIndex: 0,
      },
    ],
    lamps: [
      { id: "L1", path: "S1", posRatio: 0.4, state: "GREEN" },
      { id: "L2", path: "S2", posRatio: 0.5, state: "GREEN" },
      { id: "L3", path: "S4", posRatio: 0.5, state: "GREEN" },
    ],
    exits: [
      { node: "E1", color: "red", label: "1. Vágány (Piros)" },
      { node: "E2", color: "blue", label: "2. Vágány (Kék)" },
    ],
    schedule: [
      {
        id: 1,
        spawnTime: 1,
        startPath: "S1",
        color: "red",
        targetExit: "E1",
        speed: 1.0,
      },
      {
        id: 2,
        spawnTime: 10,
        startPath: "S1",
        color: "blue",
        targetExit: "E2",
        speed: 1.1,
      },
      {
        id: 3,
        spawnTime: 13,
        startPath: "S1",
        color: "red",
        targetExit: "E1",
        speed: 1.2,
      },
      {
        id: 4,
        spawnTime: 21,
        startPath: "S1",
        color: "blue",
        targetExit: "E2",
        speed: 1.3,
      },
    ],
  },
  2: {
    id: 2,
    name: "2. szint: Rendező-pályaudvar (Közepes)",
    nodes: {
      B1: { x: 50, y: 150 }, //felso belepes
      B2: { x: 50, y: 380 }, //also belepes
      N1: { x: 300, y: 265 }, //X (switch)
      N2: { x: 550, y: 150 }, //X to fel nodus (switch)
      N3: { x: 550, y: 380 }, //X to le (switch)
      N4: { x: 680, y: 265 }, //sargaba erkezo
      E1: { x: 950, y: 130 }, //piros
      E2: { x: 950, y: 265 }, //sagra
      E3: { x: 950, y: 400 }, //kek
    },
    paths: [
      { id: "S1", from: "B1", to: "N1" }, //felso start
      { id: "S2", from: "B2", to: "N1" }, //also start
      { id: "S3", from: "N1", to: "N2" }, //X to fel
      { id: "S4", from: "N1", to: "N3" }, //X to le
      { id: "S5", from: "N2", to: "E1" }, //piros exit
      { id: "S6", from: "N2", to: "N4" }, //felso switchtol kozep
      { id: "S7", from: "N3", to: "N4" }, //also ugyanaz
      { id: "S8", from: "N3", to: "E3" }, // sarga exit
      { id: "S9", from: "N4", to: "E2" }, // Középső fix ágtól a zöld peronra
    ],
    switches: [
      {
        id: "SW1",
        node: "N1",
        inPath: "S1",
        outPaths: ["S3", "S4"],
        activeIndex: 0,
      },
      {
        id: "SW2",
        node: "N2",
        inPath: "S3",
        outPaths: ["S5", "S6"],
        activeIndex: 0,
      },
      {
        id: "SW3",
        node: "N3",
        inPath: "S4",
        outPaths: ["S7", "S8"],
        activeIndex: 0,
      },
    ],
    lamps: [
      { id: "L1", path: "S1", posRatio: 0.5, state: "GREEN" },
      { id: "L2", path: "S2", posRatio: 0.5, state: "GREEN" },
      { id: "L3", path: "S3", posRatio: 0.5, state: "GREEN" },
      { id: "L4", path: "S4", posRatio: 0.5, state: "GREEN" },
    ],
    exits: [
      { node: "E1", color: "red", label: "1. Vágány" },
      { node: "E2", color: "yellow", label: "2. Vágány" },
      { node: "E3", color: "blue", label: "3. Vágány" },
    ],
    schedule: [
      {
        id: 1,
        spawnTime: 1,
        startPath: "S1",
        color: "red",
        targetExit: "E1",
        speed: 1.2,
      },
      {
        id: 2,
        spawnTime: 6,
        startPath: "S2",
        color: "blue",
        targetExit: "E3",
        speed: 0.4,
      },
      {
        id: 3,
        spawnTime: 14,
        startPath: "S1",
        color: "yellow",
        targetExit: "E2",
        speed: 2.3,
      },
      {
        id: 4,
        spawnTime: 22,
        startPath: "S2",
        color: "yellow",
        targetExit: "E2",
        speed: 1.1,
      },
      {
        id: 5,
        spawnTime: 32,
        startPath: "S1",
        color: "red",
        targetExit: "E1",
        speed: 4.4,
      },
    ],
  },
  3: {
    id: 3,
    name: "3. szint: Fejpályaudvari csúcsforgalom (Nehéz)",
    nodes: {
      B1: { x: 50, y: 132 }, //felso start
      B2: { x: 50, y: 400 }, //also start
      N0: { x: 100, y: 132 },
      N1: { x: 100, y: 400 },
      N2: { x: 210, y: 267 }, //X (switch 1)
      N3: { x: 330, y: 132 },
      N4: { x: 461, y: 132 }, //felso switch (2)
      N5: { x: 670, y: 132 }, //felso 2. switch (3)
      N6: { x: 763, y: 90 }, //piroshoz
      N7: { x: 763, y: 198 }, //sargahoz
      N8: { x: 339, y: 370 }, //also switch 1 (4)
      N9: { x: 410, y: 306 },
      N10: { x: 380, y: 414 },
      N11: { x: 586, y: 306 },
      N12: { x: 646, y: 414 }, //also switch 2 (5)
      N13: { x: 763, y: 306 },
      E1: { x: 950, y: 90 }, //piros
      E2: { x: 950, y: 198 }, //sarga
      E3: { x: 950, y: 306 }, //kek
      E4: { x: 950, y: 414 }, //pink
    },
    paths: [
      { id: "S1", from: "B1", to: "N0" }, //beginner 1
      { id: "S2", from: "B2", to: "N1" }, //beginner 2
      { id: "S3", from: "N0", to: "N2" }, //felso to X
      { id: "S4", from: "N1", to: "N2" }, //also to X
      { id: "S5", from: "N2", to: "N3" }, //X to fel
      { id: "S6", from: "N3", to: "N4" }, //fenti path
      { id: "S7", from: "N4", to: "N5" },
      { id: "S8", from: "N4", to: "N11" },
      { id: "S9", from: "N5", to: "N6" },
      { id: "S11", from: "N6", to: "E1" }, //exit1
      { id: "S10", from: "N5", to: "N7" },
      { id: "S12", from: "N7", to: "E2" }, //exit2
      { id: "S13", from: "N2", to: "N8" }, //X to le
      { id: "S14", from: "N8", to: "N9" }, //lenti path
      { id: "S15", from: "N9", to: "N11" },
      { id: "S16", from: "N11", to: "N13" },
      { id: "S17", from: "N13", to: "E3" }, //exit3
      { id: "S18", from: "N8", to: "N10" },
      { id: "S19", from: "N10", to: "N12" },
      { id: "S20", from: "N12", to: "N13" }, //vissza kozepre
      { id: "S21", from: "N12", to: "E4" }, //exit4
    ],
    switches: [
      {
        id: "SW1",
        node: "N2",
        inPath: "S3",
        outPaths: ["S5", "S13"],
        activeIndex: 0,
      },
      {
        id: "SW2",
        node: "N4",
        inPath: "S6",
        outPaths: ["S7", "S8"],
        activeIndex: 0,
      },
      {
        id: "SW3",
        node: "N5",
        inPath: "S7",
        outPaths: ["S9", "S10"],
        activeIndex: 0,
      },
      {
        id: "SW4",
        node: "N8",
        inPath: "S13",
        outPaths: ["S14", "S18"],
        activeIndex: 0,
      },
      {
        id: "SW5",
        node: "N12",
        inPath: "S19",
        outPaths: ["S21", "S20"],
        activeIndex: 0,
      },
    ],
    lamps: [
      { id: "L1", path: "S6", posRatio: 0.5, state: "GREEN" },
      { id: "L1", path: "S15", posRatio: 0.4, state: "GREEN" },
      { id: "L1", path: "S16", posRatio: 0.5, state: "GREEN" },
      { id: "L1", path: "S19", posRatio: 0.4, state: "GREEN" },
    ],
    exits: [
      { node: "E1", color: "red", label: "1. Vágány" },
      { node: "E2", color: "yellow", label: "2. Vágány" },
      { node: "E3", color: "blue", label: "3. Vágány" },
      { node: "E4", color: "pink", label: "4. Vágány" },
    ],
    schedule: [
      {
        id: 1,
        spawnTime: 1,
        startPath: "S1",
        color: "red",
        targetExit: "E1",
        speed: 1.1,
      },
      {
        id: 2,
        spawnTime: 3,
        startPath: "S2",
        color: "blue",
        targetExit: "E3",
        speed: 0.5,
      },
      {
        id: 3,
        spawnTime: 4,
        startPath: "S1",
        color: "yellow",
        targetExit: "E2",
        speed: 1.4,
      },
      {
        id: 4,
        spawnTime: 8,
        startPath: "S2",
        color: "pink",
        targetExit: "E4",
        speed: 1.8,
      },
      {
        id: 5,
        spawnTime: 12,
        startPath: "S1",
        color: "pink",
        targetExit: "E4",
        speed: 2.1,
      },
      {
        id: 6,
        spawnTime: 15,
        startPath: "S2",
        color: "yellow",
        targetExit: "E2",
        speed: 1.2,
      },
    ],
  },
};

export class GameModel {
  constructor() {
    this.playerName = "";
    this.currentLevelId = 1;
    this.elapsedTime = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.successCount = 0;
    this.failCount = 0;

    this.levelConfig = null;
    this.switches = [];
    this.lamps = [];
    this.trains = [];
    this.spawnQueue = [];
    this.activeWarningTrainIds = new Set();
  }

  initLevel(levelId, playerName = "Játékos") {
    this.playerName = playerName;
    this.currentLevelId = Number(levelId);
    this.levelConfig = JSON.parse(
      JSON.stringify(levelConfigs[this.currentLevelId]),
    );

    // console.log(this.levelConfig);

    this.elapsedTime = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.successCount = 0;
    this.failCount = 0;

    this.switches = this.levelConfig.switches;
    this.lamps = this.levelConfig.lamps;
    this.trains = [];
    this.spawnQueue = [...this.levelConfig.schedule];
    this.activeWarningTrainIds.clear();
  }

  toggleSwitch(switchId) {
    const sw = this.switches.find((s) => s.id === switchId);

    if (sw && sw.outPaths.length > 1) {
      sw.activeIndex = (sw.activeIndex + 1) % sw.outPaths.length;
    }
  }

  toggleLamp(lampId) {
    const lamp = this.lamps.find((l) => l.id === lampId);
    if (lamp) {
      lamp.state = lamp.state === "GREEN" ? "RED" : "GREEN";
    }
  }

  toggleTrainBrake(trainId) {
    const train = this.trains.find((t) => t.id === trainId);
    if (train) {
      train.isBraked = !train.isBraked;
    }
  }

  update(dt) {
    if (!this.levelConfig || this.isPaused || this.isGameOver || this.isVictory)
      return;

    this.elapsedTime += dt;

    //spawning
    for (let i = this.spawnQueue.length - 1; i >= 0; i--) {
      const item = this.spawnQueue[i];
      if (this.elapsedTime >= item.spawnTime) {
        const path = this.levelConfig.paths.find(
          (e) => e.id === item.startPath,
        );
        this.trains.push({
          id: item.id,
          color: item.color,
          targetExit: item.targetExit,
          speed: item.speed,
          currentPathId: item.startPath,
          distanceOnPath: 0,
          isBraked: false,
          isWaitingAtRed: false,
          x: this.levelConfig.nodes[path.from].x,
          y: this.levelConfig.nodes[path.from].y,
        });
        this.spawnQueue.splice(i, 1);
      }
    }

    //train movement
    this.activeWarningTrainIds.clear();
    for (let i = 0; i < this.trains.length; i++) {
      const train = this.trains[i];
      if (train.isBraked) continue;

      const path = this.levelConfig.paths.find(
        (p) => p.id === train.currentPathId,
      );
      const fromNode = this.levelConfig.nodes[path.from];
      const toNode = this.levelConfig.nodes[path.to];
      const pathLength = Math.hypot(
        toNode.x - fromNode.x,
        toNode.y - fromNode.y,
      );

      //lamp logika
      const lamp = this.lamps.find((l) => l.path === path.id);
      let blockedByLamp = false;
      if (lamp && lamp.state === "RED") {
        const lampDist = pathLength * lamp.posRatio;
        if (
          train.distanceOnPath < lampDist &&
          train.distanceOnPath + train.speed * 60 * dt >= lampDist
        ) {
          blockedByLamp = true;
          train.isWaitingAtRed = true;
        }
      }

      if (blockedByLamp) continue;
      train.isWaitingAtRed = false;

      train.distanceOnPath += train.speed * 60 * dt;

      if (train.distanceOnPath >= pathLength) {
        const nextNodeId = path.to;
        const exit = this.levelConfig.exits.find(
          (ex) => ex.node === nextNodeId,
        );

        //win vagy loss
        if (exit) {
          if (exit.node === train.targetExit) {
            this.successCount++;
          } else {
            this.failCount++;
          }
          this.trains.splice(i, 1);
          i--;
          continue;
        }

        //switches
        const sw = this.switches.find((s) => s.node === nextNodeId);
        let nextPathId = null;

        if (sw) {
          nextPathId = sw.outPaths[sw.activeIndex];
        } else {
          const possiblePaths = this.levelConfig.paths.filter(
            (e) => e.from === nextNodeId,
          );
          if (possiblePaths.length > 0) nextPathId = possiblePaths[0].id;
        }

        if (nextPathId) {
          train.currentPathId = nextPathId;
          train.distanceOnPath = 0;
        } else {
          this.failCount++;
          this.isGameOver = true;
          return;
        }
      }

      const curPaths = this.levelConfig.paths.find(
        (e) => e.id === train.currentPathId,
      );
      const fn = this.levelConfig.nodes[curPaths.from];
      const tn = this.levelConfig.nodes[curPaths.to];
      const el = Math.hypot(tn.x - fn.x, tn.y - fn.y);
      const ratio = Math.min(1, train.distanceOnPath / el);
      train.x = fn.x + (tn.x - fn.x) * ratio;
      train.y = fn.y + (tn.y - fn.y) * ratio;
    }

    //collision vizsgálat
    const warningLimit = 75;
    const crashLimit = 25;

    for (let i = 0; i < this.trains.length; i++) {
      for (let j = i + 1; j < this.trains.length; j++) {
        const t1 = this.trains[i];
        const t2 = this.trains[j];
        const dist = Math.hypot(t1.x - t2.x, t1.y - t2.y);

        if (dist <= crashLimit) {
          this.isGameOver = true;
          return;
        } else if (dist <= warningLimit) {
          this.activeWarningTrainIds.add(t1.id);
          this.activeWarningTrainIds.add(t2.id);
        }
      }
    }

    //win condicio
    const totalTrains = this.levelConfig.schedule.length;
    if (
      this.successCount + this.failCount === totalTrains &&
      this.trains.length === 0
    ) {
      this.isVictory = true;
    }
  }

  //saving + loading
  exportState() {
    return JSON.stringify({
      playerName: this.playerName,
      currentLevelId: this.currentLevelId,
      elapsedTime: this.elapsedTime,
      successCount: this.successCount,
      failCount: this.failCount,
      switches: this.switches,
      lamps: this.lamps,
      trains: this.trains,
      spawnQueue: this.spawnQueue,
    });
  }

  importState(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.playerName = data.playerName;
      this.currentLevelId = data.currentLevelId;
      this.levelConfig = JSON.parse(
        JSON.stringify(levelConfigs[this.currentLevelId]),
      );
      this.elapsedTime = data.elapsedTime;
      this.successCount = data.successCount;
      this.failCount = data.failCount;
      this.switches = data.switches;
      this.lamps = data.lamps;
      this.trains = data.trains;
      this.spawnQueue = data.spawnQueue;
      this.isPaused = false;
      this.isGameOver = false;
      this.isVictory = false;
      return true;
    } catch (e) {
      return false;
    }
  }
}
