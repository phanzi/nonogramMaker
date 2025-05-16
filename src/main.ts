// HTML 요소 가져오기
const nInput = document.getElementById("nInput") as HTMLInputElement;
const createGridButton = document.getElementById(
  "createGrid"
) as HTMLButtonElement;
const createRandomProblemButton = document.getElementById(
  "createRandomProblemButton"
) as HTMLButtonElement;

// 새로운 Grid 레이아웃 요소들
const gameBoard = document.getElementById("gameBoard") as HTMLDivElement; // 전체 게임 보드 컨테이너
const cornerBox = document.getElementById("cornerBox") as HTMLDivElement;
const columnHintsContainer = document.getElementById(
  "columnHints"
) as HTMLDivElement;
const rowHintsContainer = document.getElementById("rowHints") as HTMLDivElement;
const gridPlayArea = document.getElementById("gridPlayArea") as HTMLDivElement;

const actionButton = document.getElementById(
  "actionButton"
) as HTMLButtonElement;
const checkSolutionButton = document.getElementById(
  "checkSolutionButton"
) as HTMLButtonElement;

let n: number = parseInt(nInput.value) || 5;
let gridCells: HTMLDivElement[][] = []; // 플레이 영역의 셀들을 저장할 2차원 배열
let rowHintDivs: HTMLDivElement[] = []; // 행 힌트 DIV들을 저장할 배열
let colHintDivs: HTMLDivElement[] = []; // 열 힌트 DIV들을 저장할 배열

let grid: number[][] = []; // 내부 로직용 데이터 그리드 (유지)
let solutionGrid: number[][] | null = null;
let isSolvingMode: boolean = false;

let isDragging = false;
let currentDragFillState = false; // 드래그 시작 시 채울지 비울지 결정

// 버튼 상태 업데이트 함수
function updateButtonStates() {
  if (actionButton) {
    actionButton.textContent = isSolvingMode
      ? "새로 그리기 / 편집하기"
      : "이 그림으로 문제내기";
  }
  if (checkSolutionButton) {
    checkSolutionButton.style.display = isSolvingMode ? "inline-block" : "none";
  }
}

// 그리드 및 힌트 초기화 함수
function initializeGrid(forSolving: boolean = false, newNValue?: number) {
  if (forSolving && solutionGrid) {
    n = solutionGrid.length;
    nInput.value = n.toString();
    // 풀이용 그리드는 0으로 초기화
    grid = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));
    isSolvingMode = true;
  } else {
    let inputValue =
      newNValue !== undefined ? newNValue : parseInt(nInput.value);
    if (isNaN(inputValue) || inputValue <= 1 || inputValue > 10) {
      // 최소/최대 크기 제한
      inputValue = 5;
      alert("격자 크기는 2에서 10 사이로 설정해주세요.");
    }
    n = inputValue;
    nInput.value = n.toString();
    grid = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));
    solutionGrid = null;
    isSolvingMode = false;
  }

  // 이전 내용 지우기
  columnHintsContainer.innerHTML = "";
  rowHintsContainer.innerHTML = "";
  gridPlayArea.innerHTML = "";
  // cornerBox.innerHTML = ""; // 필요시

  // CSS Grid를 위한 --grid-n 변수 설정 (CSS에서 사용)
  document.documentElement.style.setProperty("--grid-n", n.toString());

  gridCells = [];
  rowHintDivs = [];
  colHintDivs = [];

  // 1. 열 힌트 영역 DIV 생성
  for (let j = 0; j < n; j++) {
    const hintDiv = document.createElement("div");
    hintDiv.classList.add("hint-cell", "col-hint"); // CSS 스타일링용 클래스
    columnHintsContainer.appendChild(hintDiv);
    colHintDivs.push(hintDiv);
  }

  // 2. 행 힌트 영역 DIV 생성
  for (let i = 0; i < n; i++) {
    const hintDiv = document.createElement("div");
    hintDiv.classList.add("hint-cell", "row-hint"); // CSS 스타일링용 클래스
    rowHintsContainer.appendChild(hintDiv);
    rowHintDivs.push(hintDiv);
  }

  // 3. 플레이 그리드 영역 셀(DIV) 생성
  for (let i = 0; i < n; i++) {
    gridCells[i] = [];
    for (let j = 0; j < n; j++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("grid-cell");
      cellDiv.dataset.row = i.toString();
      cellDiv.dataset.col = j.toString();

      // 마우스 이벤트 (PC)
      cellDiv.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // 왼쪽 클릭만
        isDragging = true;
        currentDragFillState = !grid[i][j]; // 현재 셀의 반대 상태로 드래그 시작
        toggleCell(i, j, currentDragFillState);
        e.preventDefault(); // 드래그 시 텍스트 선택 등 방지
      });

      cellDiv.addEventListener("mouseenter", () => {
        // mousemove 대신 mouseenter 사용
        if (isDragging) {
          toggleCell(i, j, currentDragFillState);
        }
      });

      // 터치 이벤트 (모바일)
      cellDiv.addEventListener(
        "touchstart",
        (e) => {
          isDragging = true;
          currentDragFillState = !grid[i][j];
          toggleCell(i, j, currentDragFillState);
          e.preventDefault();
        },
        { passive: false }
      ); // passive: false로 preventDefault 가능하도록

      cellDiv.addEventListener(
        "touchmove",
        (e) => {
          if (isDragging) {
            const touch = e.touches[0];
            const targetElement = document.elementFromPoint(
              touch.clientX,
              touch.clientY
            ) as HTMLDivElement;
            if (
              targetElement &&
              targetElement.classList.contains("grid-cell")
            ) {
              const row = parseInt(targetElement.dataset.row!);
              const col = parseInt(targetElement.dataset.col!);
              if (!isNaN(row) && !isNaN(col)) {
                toggleCell(row, col, currentDragFillState);
              }
            }
            e.preventDefault();
          }
        },
        { passive: false }
      );

      gridPlayArea.appendChild(cellDiv);
      gridCells[i][j] = cellDiv;
    }
  }

  // 전체 문서 레벨에서 드래그 종료 처리
  const stopDragging = () => {
    if (isDragging) {
      isDragging = false;
    }
  };
  document.removeEventListener("mouseup", stopDragging); // 이전 리스너 제거
  document.addEventListener("mouseup", stopDragging);
  document.removeEventListener("touchend", stopDragging); // 이전 리스너 제거
  document.addEventListener("touchend", stopDragging);

  if (isSolvingMode && solutionGrid) {
    updateHints(solutionGrid); // 정답 힌트 표시
    // 풀이 모드에서는 현재 그리드(grid)는 비어있으므로, 셀들도 비워진 상태로 시작
    gridCells.forEach((row) =>
      row.forEach((cellDiv) => cellDiv.classList.remove("filled"))
    );
  } else {
    updateHints(grid); // 현재 그린 그림 기준으로 힌트 표시
  }
  updateButtonStates();
}

// 셀 상태 변경 함수
function toggleCell(rowIdx: number, colIdx: number, fillState: boolean) {
  if (rowIdx < 0 || rowIdx >= n || colIdx < 0 || colIdx >= n) return;

  const cellDiv = gridCells[rowIdx]?.[colIdx];
  if (!cellDiv) return;

  const shouldFill = fillState; // isDragging 중에는 currentDragFillState를 사용

  // 현재 셀의 상태가 변경하려는 상태와 다를 때만 업데이트
  if (grid[rowIdx][colIdx] !== (shouldFill ? 1 : 0)) {
    grid[rowIdx][colIdx] = shouldFill ? 1 : 0;
    cellDiv.classList.toggle("filled", shouldFill);

    if (!isSolvingMode) {
      updateHints(grid); // 그리기 모드일 때만 현재 그리드 기준으로 힌트 업데이트
    }
  }
}

// 힌트 업데이트 함수
function updateHints(sourceGridData: number[][]) {
  if (!sourceGridData || sourceGridData.length === 0) return;
  const currentN = sourceGridData.length;

  // 행 힌트 업데이트
  for (let i = 0; i < currentN; i++) {
    const rowData = sourceGridData[i];
    if (!rowData || !rowHintDivs[i]) continue;

    const hints: number[] = [];
    let count = 0;
    for (const cellValue of rowData) {
      if (cellValue === 1) count++;
      else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) hints.push(count);
    rowHintDivs[i].textContent = hints.length > 0 ? hints.join(" ") : "0";
  }

  // 열 힌트 업데이트
  for (let j = 0; j < currentN; j++) {
    if (!colHintDivs[j]) continue;
    const colData: number[] = [];
    for (let i = 0; i < currentN; i++) {
      colData.push(sourceGridData[i]?.[j] || 0);
    }

    const hints: number[] = [];
    let count = 0;
    for (const cellValue of colData) {
      if (cellValue === 1) count++;
      else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) hints.push(count);
    colHintDivs[j].textContent = hints.length > 0 ? hints.join("\n") : "0";
  }
}
// 랜덤 그리드 생성 함수
function generateRandomGrid(size: number, fillRatio: number = 0.5): number[][] {
  const randomGrid: number[][] = [];
  for (let i = 0; i < size; i++) {
    randomGrid[i] = [];
    for (let j = 0; j < size; j++) {
      // fillRatio (0.0 ~ 1.0) 확률로 셀을 채움
      randomGrid[i][j] = Math.random() < fillRatio ? 1 : 0;
    }
  }
  return randomGrid;
}
// 정답 확인 함수
function checkSolution() {
  if (!isSolvingMode || !solutionGrid) {
    alert("풀이 모드에서만 정답을 확인할 수 있습니다.");
    return;
  }

  let allCorrect = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== solutionGrid[i][j]) {
        allCorrect = false;
        break;
      }
    }
    if (!allCorrect) break;
  }

  if (allCorrect) {
    alert("축하합니다! 정답입니다!");
    // isSolvingMode = false; // (선택) 정답 후 그리기 모드로 전환
    // updateButtonStates();
    // initializeGrid(false, n); // (선택) 같은 크기로 새 그리드
  } else {
    alert("틀린 부분이 있습니다. 다시 확인해주세요.");
  }
}

// 액션 버튼 클릭 핸들러
function handleActionButtonClick() {
  if (isSolvingMode) {
    // "새로 그리기 / 편집하기" -> 그리기 모드로 전환
    initializeGrid(false, n); // 현재 크기 유지하며 새로 그리기
  } else {
    // "이 그림으로 문제내기" -> 풀이 모드로 전환
    // 그려진 셀이 하나라도 있는지 확인
    const hasPaintedCells = grid.some((row) => row.some((cell) => cell === 1));
    if (!hasPaintedCells) {
      alert("문제를 만들 그림이 없습니다. 셀을 하나 이상 채워주세요.");
      return;
    }
    solutionGrid = JSON.parse(JSON.stringify(grid)); // 현재 그리드를 정답으로 저장 (깊은 복사)
    initializeGrid(true); // 풀이 모드로 그리드 초기화
    alert("문제가 출제되었습니다. 풀어보세요!");
  }
}
function handleCreateRandomProblemClick() {
  const currentN = parseInt(nInput.value) || 5; // 현재 설정된 N값 사용 또는 기본값
  if (isNaN(currentN) || currentN <= 1 || currentN > 10) {
    alert("랜덤 문제 생성을 위한 격자 크기가 유효하지 않습니다. (2~10)");
    return;
  }

  // fillRatio를 조절하여 난이도 변경 가능 (0.4 ~ 0.6 사이가 적당할 수 있음)
  const randomSolution = generateRandomGrid(currentN, 0.45);

  // 생성된 그리드가 너무 비어있거나 꽉 차있으면 다시 생성 (선택적 개선)
  // 이 부분은 필요에 따라 주석 해제하고, 재시도 로직을 좀 더 견고하게 만들 수 있습니다.
  /*
  const filledCells = randomSolution.flat().reduce((acc, val) => acc + val, 0);
  const totalCells = currentN * currentN;
  let retries = 0; // 무한 루프 방지
  while ((filledCells < totalCells * 0.1 || filledCells > totalCells * 0.9) && retries < 10) {
      console.log("생성된 그리드가 너무 편향되어 다시 생성합니다. (시도: " + (retries + 1) + ")");
      // randomSolution = generateRandomGrid(currentN, 0.45); // 새 randomSolution을 할당해야 함
      // filledCells = randomSolution.flat().reduce((acc, val) => acc + val, 0);
      // 위 로직은 실제로는 이 함수를 재귀 호출하거나 루프 내에서 재할당 필요
      // 간단하게 하려면 일단 이 검증 없이 진행하거나, 이 함수를 재귀 호출
      handleCreateRandomProblemClick(); // 주의: 스택 오버플로우 가능성, 카운터로 제한 필요
      return; // 재귀 호출 후 현재 실행 종료
  }
  if (retries >= 10) {
    alert("적절한 랜덤 문제 생성에 실패했습니다. 다시 시도해주세요.");
    return;
  }
  */

  solutionGrid = randomSolution; // 생성된 그리드를 정답으로 설정
  initializeGrid(true); // 풀이 모드로 그리드 초기화 (solutionGrid 기반 힌트 표시)
  alert(`${currentN}x${currentN} 랜덤 문제가 생성되었습니다. 풀어보세요!`);
}
// ▲▲▲ 여기에 handleCreateRandomProblemClick 함수 추가 ▲▲▲
// --- 이벤트 리스너 등록 ---
if (createGridButton) {
  createGridButton.addEventListener("click", () => {
    const newNValue = parseInt(nInput.value);
    initializeGrid(false, newNValue);
  });
} else {
  console.error("ID 'createGrid' 버튼을 찾을 수 없습니다.");
}

if (actionButton) {
  actionButton.addEventListener("click", handleActionButtonClick);
} else {
  console.error("ID 'actionButton' 버튼을 찾을 수 없습니다.");
}

if (checkSolutionButton) {
  checkSolutionButton.addEventListener("click", checkSolution);
} else {
  console.error("ID 'checkSolutionButton' 버튼을 찾을 수 없습니다.");
}
if (createRandomProblemButton) {
  createRandomProblemButton.addEventListener(
    "click",
    handleCreateRandomProblemClick
  );
} else {
  console.error("ID 'createRandomProblemButton' 버튼을 찾을 수 없습니다.");
}
// --- 초기 그리드 생성 ---
initializeGrid(false);
