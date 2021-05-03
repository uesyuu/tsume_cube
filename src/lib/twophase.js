const twophase = (() => {

const U = 0;
const F = 1;
const R = 2;
const D = 3;
const B = 4;
const L = 5;

let moveName;
let moveObject;
let restrictedMove;
let Cnk;

let twistTable;
let flipTable;
let eSliceTable;
let cPTable;
let UDEPTable;
let eSliceTable2;

let twistESlicePrun;
let flipESlicePrun;
let cPESlicePrun;
let UDEPESlicePrun;

let initialized = false;

const getTwist = (obj) => {
  let ret = 0;
  for (let i = 0; i < 7; i++) {
    ret *= 3;
    ret += obj.co[i]
  }
  return ret;
}

const getFlip = (obj) => {
  let ret = 0;
  for (let i = 0; i < 11; i++) {
    ret *= 2;
    ret += obj.eo[i]
  }
  return ret;
}

const getESlice = (obj) => {
  let ret = 0
  let s = 4;
  for (let i = 0; i < 12; i++) {
    if (obj.ep[i] > 7) {
      ret += Cnk[11 - i][s--];
    }
  }
  return ret;
}

const getCP = (obj) => {
  let flag = 255;
  let ret = 0;
  let tmp;
  for (let i = 0; i < 8; i++) {
    tmp = 255 >> 8 - obj.cp[i];
    ret += fact(7 - i) * bitCount(flag & tmp);
    flag ^= 1 << obj.cp[i];
  }
  return ret;
}

const getUDEP = (obj) => {
  let flag = 255;
  let ret = 0;
  let tmp;
  for (let i = 0; i < 8; i++) {
    tmp = 255 >> 8 - obj.ep[i];
    ret += fact(7 - i) * bitCount(flag & tmp);
    flag ^= 1 << obj.ep[i];
  }
  return ret;
}

const getESlice2 = (obj) => {
  let ret = 0
  let flag = 15;
  let tmp;
  let cur;
  for (let i = 0; i < 4; i++) {
    cur = obj.ep[i + 8] - 8;

    tmp = 15 >> 4 - cur;
    ret += fact(3 - i) * bitCount(flag & tmp);
    flag ^= 1 << cur;
  }
  return ret;
}

const setTwist = (obj, idx) => {
  let tw = 0
  for (let i = 0; i < 7; i++) {
    obj.co[i] = idx / (3 ** (6 - i)) | 0;
    tw += obj.co[i];
    idx = idx % (3 ** (6 - i));
  }
  obj.co[7] = (15 - tw) % 3;
}

const setFlip = (obj, idx) => {
  let fl = 0;
  for (let i = 0; i < 11; i++) {
    obj.eo[10 - i] = idx & 1;
    fl += obj.eo[10 - i];
    idx = idx >>> 1;
  }
  obj.eo[11] = (12 - fl) % 2
}

const setESlice = (obj, idx) => {
  let s = 4;
  for (let i = 0; i < 12; i++) {
    if (idx >= Cnk[11 - i][s]) {
      obj.ep[i] = s + 7;
      idx -= Cnk[11 - i][s--];
    } else {
      obj.ep[i] = i - 4 + s;
    }
  }
}

const setCP = (obj, idx) => {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  let tmp;
  for (let i = 0; i < 8; i++) {
    tmp = 1 << idx / fact(7 - i) | 0;
    obj.cp[i] = arr.splice(bitCount(tmp - 1), 1)[0];
    idx = idx % fact(7 - i);
  }
}

const setUDEP = (obj, idx) => {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  let tmp;
  for (let i = 0; i < 8; i++) {
    tmp = 1 << idx / fact(7 - i) | 0;
    obj.ep[i] = arr.splice(bitCount(tmp - 1), 1)[0];
    idx = idx % fact(7 - i);
  }
}

const setESlice2 = (obj, idx) => {
  let arr = [8, 9, 10, 11];
  let tmp;
  for (let i = 0; i < 4; i++) {
    tmp = 1 << idx / fact(3 - i) | 0;
    obj.ep[i + 8] = arr.splice(bitCount(tmp - 1), 1)[0];
    idx = idx % fact(3 - i);
  }
}

const setEP = (obj, idx) => {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let tmp;
  for (let i = 0; i < 12; i++) {
    tmp = 1 << idx / fact(11 - i) | 0;
    obj.ep[i] = arr.splice(bitCount(tmp - 1), 1)[0];
    idx = idx % fact(11 - i);
  }
}

const getCornerParity = (idx) => {
  let tmp;
  let p = 0;
  for (let i = 0; i < 8; i++) {
    tmp = 1 << idx / fact(7 - i) | 0;
    p += bitCount(tmp - 1);
    idx = idx % fact(7 - i);
  }
  return p & 1;
}

const getEdgeParity = (idx) => {
  let tmp;
  let p = 0;
  for (let i = 0; i < 12; i++) {
    tmp = 1 << idx / fact(11 - i) | 0;
    p += bitCount(tmp - 1);
    idx = idx % fact(11 - i);
  }
  return p & 1;
}

const initTable = () => {
  initTwistTable();
  initFlipTable();
  initESliceTable();
  initCPTable();
  initUDEPTable();
  initESliceTable2();
}

const initTwistTable = () => {
  twistTable = create2DArray(2187, 18);
  let obj_0 = new ArrayCube()
  let i, j;
  for (i = 0; i < 2187; i++) {
    setTwist(obj_0, i);
    for (j = 0; j < 18; j++) {
      twistTable[i][j] = getTwist(obj_0.apply(moveObject[j]));
    }
  }
}

const initFlipTable = () => {
  flipTable = create2DArray(2048, 18);
  let obj_0 = new ArrayCube()
  let i, j;
  for (i = 0; i < 2048; i++) {
    setFlip(obj_0, i);
    for (j = 0; j < 18; j++) {
      flipTable[i][j] = getFlip(obj_0.apply(moveObject[j]));
    }
  }
}

const initESliceTable = () => {
  eSliceTable = create2DArray(495, 18);
  let obj_0 = new ArrayCube()
  let i, j;
  for (i = 0; i < 495; i++) {
    setESlice(obj_0, i);
    for (j = 0; j < 18; j++) {
      eSliceTable[i][j] = getESlice(obj_0.apply(moveObject[j]));
    }
  }
}

const initCPTable = () => {
  cPTable = create2DArray(40320, 10);
  let obj_0 = new ArrayCube()
  let i, j;
  for (i = 0; i < 40320; i++) {
    setCP(obj_0, i);
    for (j = 0; j < 10; j++) {
      cPTable[i][j] = getCP(obj_0.apply(moveObject[restrictedMove[j]]));
    }
  }
}

const initUDEPTable = () => {
  UDEPTable = create2DArray(40320, 10);
  let obj_0 = new ArrayCube()
  let i, j;
  for (i = 0; i < 40320; i++) {
    setUDEP(obj_0, i);
    for (j = 0; j < 10; j++) {
      UDEPTable[i][j] = getUDEP(obj_0.apply(moveObject[restrictedMove[j]]));
    }
  }
}

const initESliceTable2 = () => {
  eSliceTable2 = create2DArray(24, 10);
  let obj_0 = new ArrayCube()
  let i, j;
  for (i = 0; i < 24; i++) {
    setESlice2(obj_0, i);
    for (j = 0; j < 10; j++) {
      eSliceTable2[i][j] = getESlice2(obj_0.apply(moveObject[restrictedMove[j]]));
    }
  }
}

const initPrun = () => {
  initTwistESlicePrun();
  initFlipESlicePrun();
  initCPESlicePrun();
  initUDEPESlicePrun();
}

const initTwistESlicePrun = () => {
  twistESlicePrun = Array(1082565);
  twistESlicePrun.fill(15);

  let children1, children2, done, depth, i, j;

  twistESlicePrun[0] = 0;
  done = 1;
  depth = 0;
  while (done < 1082565) {
    for (i = 0; i < 1082565; i++) {
      if (twistESlicePrun[i] !== depth) {
        continue;
      }
      
      children1 = twistTable[i / 495 | 0];
      children2 = eSliceTable[i % 495];
      for (j = 0; j < 18; j++) {
        if (twistESlicePrun[children1[j] * 495 + children2[j]] === 15) {
          twistESlicePrun[children1[j] * 495 + children2[j]] = depth + 1;
          done++
        }
      }
    }
    depth++;
  }
}

const initFlipESlicePrun = () => {
  flipESlicePrun = Array(1013760);
  flipESlicePrun.fill(15);

  let children1, children2, done, depth, i, j;

  flipESlicePrun[0] = 0;
  done = 1;
  depth = 0;
  while (done < 1013760) {
    for (i = 0; i < 1013760; i++) {
      if (flipESlicePrun[i] !== depth) {
        continue;
      }
      
      children1 = flipTable[i / 495 | 0];
      children2 = eSliceTable[i % 495];
      for (j = 0; j < 18; j++) {
        if (flipESlicePrun[children1[j] * 495 + children2[j]] === 15) {
          flipESlicePrun[children1[j] * 495 + children2[j]] = depth + 1;
          done++
        }
      }
    }
    depth++;
  }
}

const initCPESlicePrun = () => {
  cPESlicePrun = Array(967680);
  cPESlicePrun.fill(15);

  let children1, children2, done, depth, i, j;

  cPESlicePrun[0] = 0;
  done = 1;
  depth = 0;
  while (done < 967680) {
    for (i = 0; i < 967680; i++) {
      if (cPESlicePrun[i] !== depth) {
        continue;
      }
      
      children1 = cPTable[i / 24 | 0];
      children2 = eSliceTable2[i % 24];
      for (j = 0; j < 10; j++) {
        if (cPESlicePrun[children1[j] * 24 + children2[j]] === 15) {
          cPESlicePrun[children1[j] * 24 + children2[j]] = depth + 1;
          done++
        }
      }
    }
    depth++;
  }
}

const initUDEPESlicePrun = () => {
  UDEPESlicePrun = Array(967680);
  UDEPESlicePrun.fill(15);

  let children1, children2, done, depth, i, j;

  UDEPESlicePrun[0] = 0;
  done = 1;
  depth = 0;
  while (done < 967680) {
    for (i = 0; i < 967680; i++) {
      if (UDEPESlicePrun[i] !== depth) {
        continue;
      }
      
      children1 = UDEPTable[i / 24 | 0];
      children2 = eSliceTable2[i % 24];
      for (j = 0; j < 10; j++) {
        if (UDEPESlicePrun[children1[j] * 24 + children2[j]] === 15) {
          UDEPESlicePrun[children1[j] * 24 + children2[j]] = depth + 1;
          done++
        }
      }
    }
    depth++;
  }
}

class ArrayCube {
  constructor(cp, co, ep, eo) {
    this.cp = cp ? cp : [0, 1, 2, 3, 4, 5, 6, 7]
    this.co = co ? co : [0, 0, 0, 0, 0, 0, 0, 0]
    this.ep = ep ? ep : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    this.eo = eo ? eo : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  apply(move) {
    return new ArrayCube(
      this.cp.map((cur, idx) => this.cp[move.cp[idx]]),
      this.co.map((cur, idx) => (this.co[move.cp[idx]] + move.co[idx]) % 3),
      this.ep.map((cur, idx) => this.ep[move.ep[idx]]),
      this.eo.map((cur, idx) => (this.eo[move.ep[idx]] + move.eo[idx]) % 2)
    )
  }

  copy() {
    return new ArrayCube(
      this.cp,
      this.co,
      this.ep,
      this.eo
    )
  }

  toIndexPhase1() {
    return new IndexCubePhase1(
      getTwist(this),
      getFlip(this),
      getESlice(this),
      []
    )
  }

  toIndexPhase2() {
    return new IndexCubePhase2(
      getCP(this),
      getUDEP(this),
      getESlice2(this),
      []
    )
  }
}

class IndexCubePhase1 {
  constructor(twist, flip, eslice, move) {
    this.twist = twist ? twist : 0
    this.flip = flip ? flip : 0
    this.eslice = eslice ? eslice : 0
    this.move = move ? move : []
  }

  apply(move) {
    let newTwist, newFlip, newESlice, newMove
    newTwist = twistTable[this.twist][move]
    newFlip = flipTable[this.flip][move]
    newESlice = eSliceTable[this.eslice][move]
    newMove = this.move.slice()
    newMove.push(move)
    return new IndexCubePhase1(
      newTwist,
      newFlip,
      newESlice,
      newMove
    )
  }

  toArray() {
    return
  }
}

class IndexCubePhase2 {
  constructor(cp, udep, eslice2, move) {
    this.cp = cp ? cp : 0
    this.udep = udep ? udep : 0
    this.eslice2 = eslice2 ? eslice2 : 0
    this.move = move ? move : []
  }

  apply(move) {
    let _move = restrictedMove.indexOf(move)
    let newCp, newUDEP, newESlice2, newMove
    newCp = cPTable[this.cp][_move]
    newUDEP = UDEPTable[this.udep][_move]
    newESlice2 = eSliceTable2[this.eslice2][_move]
    newMove = this.move.slice()
    newMove.push(move)
    return new IndexCubePhase2(
      newCp,
      newUDEP,
      newESlice2,
      newMove
    )
  }

  toArray() {
    return
  }
}

const search = (root, max) => {
  let stack, _stack, root1, root2, _root

  root1 = root.toIndexPhase1()

  for (let depth = 10; depth <= 13; depth++) {
    stack = new Stack()
    stack.push(root1)
    let cur, nextMove, nextFace, curFace
    while(stack.size() > 0) {
      cur = stack.pop();
      if(cur.move.length === depth && cur.twist === 0 && cur.flip === 0 && cur.eslice === 0) {
        _root = root.copy()
        for (let i = 0; i < cur.move.length; i++) {
          _root = _root.apply(moveObject[cur.move[i]])
        }
        root2 = _root.toIndexPhase2()

        for (let _depth = 0; _depth <= max - cur.move.length; _depth++) {
          _stack = new Stack()
          _stack.push(root2)
          let _cur, _nextMove, _nextFace, _curFace
          while(_stack.size() > 0) {
            _cur = _stack.pop();
            if(_cur.cp === 0 && _cur.udep === 0 && _cur.eslice2 === 0) {
              return cur.move.concat(_cur.move)
            }

            if (_cur.move.length + Math.max(cPESlicePrun[_cur.cp * 24 + _cur.eslice2], UDEPESlicePrun[_cur.udep * 24 + _cur.eslice2]) > _depth) {
              continue;
            }

            for (let i = 0; i < 10; i++) {
              _nextMove = restrictedMove[i]
              _nextFace = _nextMove / 3 | 0;
              _curFace = _cur.move.length === 0 ? -1 : _cur.move[_cur.move.length - 1] / 3 | 0;
              if (_nextFace % 3 !== _curFace % 3 || _nextFace > _curFace) {
                _stack.push(_cur.apply(_nextMove));
              }
            }
          }
        }
      }
  
      if (cur.move.length + Math.max(twistESlicePrun[cur.twist * 495 + cur.eslice], flipESlicePrun[cur.flip * 495 + cur.eslice]) > depth) {
        continue;
      }
  
      for (nextMove = 0; nextMove < 18; nextMove++) {
        nextFace = nextMove / 3 | 0;
        curFace = cur.move.length === 0 ? -1 : cur.move[cur.move.length - 1] / 3 | 0;
        if (nextFace % 3 !== curFace % 3 || nextFace > curFace) {
          stack.push(cur.apply(nextMove));
        }
      }
    }
  }

  return null
}

const getRandomState = (seed) => {
  let cp, co, ep, eo;
  let random = new Random(seed);
  let obj = new ArrayCube();
  do {
    cp = random.randomInt(40320);
    ep = random.randomInt(479001600);
  } while (getCornerParity(cp) !== getEdgeParity(ep))
  co = random.randomInt(2187);
  eo = random.randomInt(2048);

  setCP(obj, cp);
  setTwist(obj, co);
  setEP(obj, ep);
  setFlip(obj, eo)
  
  return obj;
}

const cancelMoves = (moves) => {
  let l, faceList, axisList, suffixList, newFaceList, newAxisList, newSuffixList, cancelled, ret;
  l = moves.length;
  faceList = Array(l);
  axisList = Array(l);
  suffixList = Array(l);
  for (let i = 0; i < l; i++) {
    faceList[i] = moves[i] / 3 | 0;
    axisList[i] = faceList[i] % 3;
    suffixList[i] = moves[i] % 3
  }
  
  do {
    cancelled = 0;
    l = faceList.length;

    for (let i = 0; i < l - 1; i++) {
      if (axisList[i] === axisList[i + 1] && faceList[i] > faceList[i + 1]) {
        swapElement(faceList, i);
        swapElement(axisList, i);
        swapElement(suffixList, i);
      }
    }

    for (let i = 0; i < l - 1; i++) {
      if (faceList[i] === faceList[i + 1]) {
        cancelled++;
        suffixList[i] = (suffixList[i] + suffixList[i + 1] + 1) % 4;
        suffixList[i + 1] = 3;
      }
    }

    newFaceList = [];
    newAxisList = [];
    newSuffixList = [];

    for (let i = 0; i < l; i++) {
      if (suffixList[i] !== 3) {
        newFaceList.push(faceList[i]);
        newAxisList.push(axisList[i]);
        newSuffixList.push(suffixList[i]);
      }
    }

    faceList = newFaceList.slice();
    axisList = newAxisList.slice();
    suffixList = newSuffixList.slice();
  } while (cancelled > 0)

  ret = Array(faceList.length);
  for (let i = 0; i < faceList.length; i++) {
    ret[i] = faceList[i] * 3 + suffixList[i];
  }
  return ret;
}

const swapElement = (arr, idx) => {
  arr.splice(idx, 2, arr[idx + 1], arr[idx]);
}

const initUtil = () => {
  Cnk = create2DArray(12, 12);
  for (let i = 0; i < 12; i++) {
    Cnk[i].fill(0);
    Cnk[i][0] = 1;
    Cnk[i][i] = 1;
    for (let j = 1; j < i; j++) {
      Cnk[i][j] = Cnk[i - 1][j - 1] + Cnk[i - 1][j];
    }
  }

  moveName = ["U", "U2", "U'", "F", "F2", "F'", "R", "R2", "R'", "D", "D2", "D'", "B", "B2", "B'", "L", "L2", "L'"];

  moveObject = Array(18);
  moveObject[U * 3] = new ArrayCube(
    [3, 0, 1, 2, 4, 5, 6, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [4, 5, 2, 3, 1, 0, 6, 7, 8, 9, 10, 11],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  )
  moveObject[F * 3] = new ArrayCube(
    [1, 7, 2, 3, 0, 5, 6, 4],
    [1, 2, 0, 0, 2, 0, 0, 1],
    [9, 1, 2, 8, 4, 5, 6, 7, 0, 3, 10, 11],
    [1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0]
  );
  moveObject[R * 3] = new ArrayCube(
    [4, 1, 2, 0, 5, 3, 6, 7],
    [2, 0, 0, 1, 1, 2, 0, 0],
    [0, 1, 2, 3, 8, 5, 6, 11, 7, 9, 10, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  moveObject[D * 3] = new ArrayCube(
    [0, 1, 2, 3, 7, 4, 5, 6],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 7, 6, 4, 5, 2, 3, 8, 9, 10, 11],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  moveObject[B * 3] = new ArrayCube(
    [0, 1, 3, 5, 4, 6, 2, 7],
    [0, 0, 1, 2, 0, 1, 2, 0],
    [0, 11, 10, 3, 4, 5, 6, 7, 8, 9, 1, 2],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1]
  );
  moveObject[L * 3] = new ArrayCube(
    [0, 2, 6, 3, 4, 5, 7, 1],
    [0, 1, 2, 0, 0, 0, 1, 2],
    [0, 1, 2, 3, 4, 10, 9, 7, 8, 5, 6, 11],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  for (let i = 0; i < 6; i++) {
    moveObject[i * 3 + 1] = moveObject[i * 3].apply(moveObject[i * 3])
    moveObject[i * 3 + 2] = moveObject[i * 3 + 1].apply(moveObject[i * 3])
  }

  restrictedMove = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16];
}

const bitCount = (bits) =>{
  bits = (bits & 0x55555555) + (bits >> 1 & 0x55555555);
  bits = (bits & 0x33333333) + (bits >> 2 & 0x33333333);
  bits = (bits & 0x0f0f0f0f) + (bits >> 4 & 0x0f0f0f0f);
  bits = (bits & 0x00ff00ff) + (bits >> 8 & 0x00ff00ff);
  return (bits & 0x0000ffff) + (bits >>16 & 0x0000ffff);
}

const fact = (n) => {
  let fact = 1;
  for (let i = 1; i <= n; i++) {
    fact *= i;
  }
  return fact;
}

const create2DArray = (l1, l2) => {
  let ret = Array(l1);
  for (let i = 0; i < l1; i++){
    ret[i] = Array(l2);
  }
  return ret;
}

class Random {
  constructor(seed) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed ? seed : Math.floor(Math.random() * Date.now());
  }
  
  _random() {
    let t;
 
    t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
  }
  
  randomInt(n) {
    const r = Math.abs(this._random());
    return (r % n);
  }
}

class Stack {
  constructor() {
    this.heap = [];
  }

  empty() {
    if (this.heap.length === 0) return true;
    return false;
  }

  size() {
    return this.heap.length;
  }

  top() {
    return this.heap[0];
  }
 
  push(item) {
    this.heap.unshift(item);
  }
  
  pop() {
    return this.heap.shift();
  }
}

const initialize = () => {
  if (!initialized) {
    initUtil();
    initTable();
    initPrun();
    initialized = true;
  }
}

const solve = (scramble, max = 22) => {
  // console.log('scramble: ' + scramble);
  let arr = scramble.split(' ');
  let obj = new ArrayCube()
  let _solution;
  let solution = '';

  for (let i = 0; i < arr.length; i++) {
    if (moveName.indexOf(arr[i]) >= 0) obj = obj.apply(moveObject[moveName.indexOf(arr[i])])
  }

  _solution = search(obj, max);
  if (_solution == null) {
    return 'Error';
  }
  _solution = cancelMoves(_solution);
  _solution.forEach((val) => {
    solution += moveName[val] + ' '
  })
  // console.log('solution: ' + solution);
  // console.log(_solution.length + ' moves');
  return solution;
}

const getScramble = (seed, max = 22) => {
  let scr, solution, ret;

  scr = getRandomState(seed);
  solution = search(scr, max);
  if (solution == null) {
    return 'Error';
  }
  solution = cancelMoves(solution);
  solution.reverse();
  ret = '';
  solution.forEach((val) => {
    ret += moveName[val] + ' '
  })
  console.log(ret + '[' + solution.length + ' moves]')
  return ret;
}

return {
  initialize: initialize,
  solve: solve,
  getScramble: getScramble,
}

})();

export default twophase