// HTML 요소 가져오기
const nInput = document.getElementById("nInput") as HTMLInputElement;
const createGridButton = document.getElementById(
  "createGrid"
) as HTMLButtonElement;
const gridContainer = document.getElementById(
  "gridContainer"
) as HTMLDivElement;
const actionButton = document.getElementById(
  "actionButton"
) as HTMLButtonElement;
// 정답 확인 버튼 요소 가져오기
const checkSolutionButton = document.getElementById(
  "checkSolutionButton"
) as HTMLButtonElement;

let n: number = parseInt(nInput.value) || 5;
let table: HTMLTableElement;
let grid: number[][] = [];
let solutionGrid: number[][] | null = null;
let isSolvingMode: boolean = false;

let isDragging = false;
let shouldFill = false;

// 버튼 상태 업데이트 함수 (정답 확인 버튼 포함)
function updateButtonStates() {
  if (actionButton) {
    if (isSolvingMode) {
      actionButton.textContent = "새로 그리기 / 편집하기";
    } else {
      actionButton.textContent = "이 그림으로 문제내기";
    }
  }
  if (checkSolutionButton) {
    // 풀이 모드일 때만 정답 확인 버튼 표시
    checkSolutionButton.style.display = isSolvingMode ? "inline-block" : "none";
  }
}

function initializeGrid(forSolving: boolean = false, newNValue?: number) {
  if (forSolving && solutionGrid) {
    n = solutionGrid.length;
    nInput.value = n.toString();
    grid = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));
    isSolvingMode = true;
  } else {
    let inputValue =
      newNValue !== undefined ? newNValue : parseInt(nInput.value);
    if (isNaN(inputValue) || inputValue <= 0) {
      inputValue = 5;
    }
    n = inputValue;
    nInput.value = n.toString();
    grid = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0));
    solutionGrid = null;
    isSolvingMode = false;
  }

  gridContainer.innerHTML = "";
  table = document.createElement("table");

  for (let i = 0; i <= n; i++) {
    const row = table.insertRow();
    for (let j = 0; j <= n; j++) {
      const cell = row.insertCell();
      if (i === 0 || j === 0) {
        cell.classList.add("hint");
      } else {
        cell.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          isDragging = true;
          shouldFill = !cell.classList.contains("filled");
          toggleCell(i - 1, j - 1, shouldFill);
        });
        cell.addEventListener("mousemove", (e) => {
          if (isDragging) {
            const targetCell = e.target as HTMLTableCellElement;
            if (
              targetCell &&
              targetCell.tagName === "TD" &&
              !targetCell.classList.contains("hint") &&
              targetCell.parentNode
            ) {
              const rowIdx =
                (targetCell.parentNode as HTMLTableRowElement).rowIndex - 1;
              const colIdx = targetCell.cellIndex - 1;
              const currentCellInGrid =
                table.rows[rowIdx + 1]?.cells[colIdx + 1];
              if (currentCellInGrid === targetCell) {
                toggleCell(rowIdx, colIdx, shouldFill);
              }
            }
          }
        });
      }
    }
  }
  gridContainer.appendChild(table);

  document.addEventListener("mouseup", () => {
    if (isDragging) isDragging = false;
  });

  if (isSolvingMode && solutionGrid) {
    updateHints(solutionGrid);
  } else {
    updateHints(grid);
  }
  updateButtonStates(); // 모드 변경 후 버튼 상태 업데이트
}

// toggleCell 함수에서 checkSolution() 호출 제거
function toggleCell(rowIdx: number, colIdx: number, fill: boolean) {
  if (rowIdx >= 0 && rowIdx < n && colIdx >= 0 && colIdx < n) {
    const cell = table.rows[rowIdx + 1].cells[colIdx + 1];
    if (!cell) return;
    grid[rowIdx][colIdx] = fill ? 1 : 0;
    cell.classList.toggle("filled", fill);
    if (!isSolvingMode) {
      updateHints(grid);
    }
    // 풀이 모드일 때 자동 정답 확인 제거
    // else { checkSolution(); }
  }
}

function updateHints(sourceGrid: number[][]) {
  if (!sourceGrid || sourceGrid.length === 0 || !table) return;
  const currentN = sourceGrid.length;

  // 행 힌트
  for (let i = 1; i <= currentN; i++) {
    const rowData = sourceGrid[i - 1];
    if (!rowData) continue;
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
    const hintCell = table.rows[i]?.cells[0];
    if (hintCell) {
      // 수정: hints 배열의 길이가 0이면 빈 문자열, 아니면 join
      hintCell.textContent = hints.length > 0 ? hints.join(" ") : ""; // <--- 첫 번째 수정 지점
    }
  }

  // 열 힌트
  for (let j = 1; j <= currentN; j++) {
    const colData: number[] = [];
    for (let i = 0; i < currentN; i++) {
      if (sourceGrid[i] && sourceGrid[i][j - 1] !== undefined)
        colData.push(sourceGrid[i][j - 1]);
      else colData.push(0);
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
    const hintCell = table.rows[0]?.cells[j];
    if (hintCell) {
      // 수정: hints 배열의 길이가 0이면 빈 문자열, 아니면 join
      hintCell.textContent = hints.length > 0 ? hints.join("\n") : ""; // <--- 두 번째 수정 지점
      hintCell.style.whiteSpace = "pre-wrap"; // 열 힌트는 줄바꿈 유지를 위해 필요
    }
  }
}

// 정답 확인 함수 (사용자가 버튼을 눌렀을 때만 호출됨)
function checkSolution() {
  if (!isSolvingMode || !solutionGrid) {
    // 이 경우는 보통 checkSolutionButton이 숨겨져 있어서 발생하지 않지만, 안전장치.
    alert("풀이 모드에서만 정답을 확인할 수 있습니다.");
    return;
  }

  let allCorrect = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      // solutionGrid가 null이 아님은 위에서 보장됨
      if (grid[i][j] !== solutionGrid![i][j]) {
        allCorrect = false;
        break;
      }
    }
    if (!allCorrect) break;
  }

  if (allCorrect) {
    alert("축하합니다! 정답입니다!");
    // (선택) 정답 후 다음 동작
    // isSolvingMode = false;
    // updateButtonStates();
    // initializeGrid(false, n);
  } else {
    alert("틀린 부분이 있습니다.");
  }
}

function handleActionButtonClick() {
  if (isSolvingMode) {
    initializeGrid(false, n);
  } else {
    if (grid && grid.length > 0 && grid.some((row) => row.indexOf(1) !== -1)) {
      solutionGrid = JSON.parse(JSON.stringify(grid));
      initializeGrid(true);
      alert("문제가 출제되었습니다. 풀어보세요!");
    } else {
      alert("문제를 만들 그림이 없습니다. 셀을 하나 이상 채워주세요.");
    }
  }
}

// 이벤트 리스너
createGridButton.addEventListener("click", () => {
  const newNValue = parseInt(nInput.value);
  initializeGrid(false, newNValue);
});

if (actionButton) {
  actionButton.addEventListener("click", handleActionButtonClick);
} else {
  console.warn("ID 'actionButton' 버튼을 찾을 수 없습니다.");
}

// 정답 확인 버튼 이벤트 리스너 추가
if (checkSolutionButton) {
  checkSolutionButton.addEventListener("click", checkSolution);
} else {
  console.warn("ID 'checkSolutionButton' 버튼을 찾을 수 없습니다.");
}

// 초기화
initializeGrid(false);
