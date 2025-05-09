// HTML 요소 가져오기 (기존 코드와 동일)
const nInput = document.getElementById("nInput") as HTMLInputElement;
const createGridButton = document.getElementById(
  "createGrid"
) as HTMLButtonElement;
const gridContainer = document.getElementById(
  "gridContainer"
) as HTMLDivElement;

let n: number = parseInt(nInput.value);
let table: HTMLTableElement;
let grid: number[][] = [];
let isDragging = false; // 드래그 상태를 추적하는 변수
let shouldFill = false; // 드래그 시작 시 색칠/해제 여부 결정

// 격자 생성 함수 (기존 코드와 동일)
function createGrid() {
  n = parseInt(nInput.value);
  gridContainer.innerHTML = "";
  grid = Array(n)
    .fill(null)
    .map(() => Array(n).fill(0));

  table = document.createElement("table");
  for (let i = 0; i <= n; i++) {
    const row = table.insertRow();
    for (let j = 0; j <= n; j++) {
      const cell = row.insertCell();
      if (i === 0 || j === 0) {
        cell.classList.add("hint");
      } else {
        cell.addEventListener("mousedown", (e) => {
          isDragging = true;
          shouldFill = !cell.classList.contains("filled"); // 드래그 시작 시 색칠/해제 결정
          toggleCell(i - 1, j - 1, e.buttons === 1 && shouldFill); // 왼쪽 버튼 클릭 시 색칠
        });
        cell.addEventListener("mousemove", (e) => {
          if (isDragging) {
            const targetCell = e.target as HTMLTableCellElement;
            if (
              !targetCell.classList.contains("hint") &&
              targetCell.parentNode
            ) {
              const rowIdx =
                (targetCell.parentNode as HTMLTableRowElement).rowIndex - 1;
              const colIdx = targetCell.cellIndex - 1;
              toggleCell(rowIdx, colIdx, e.buttons === 1 && shouldFill);
            }
          }
        });
        cell.addEventListener("mouseup", () => {
          isDragging = false;
        });
        cell.addEventListener("mouseout", () => {
          // 드래그 중 마우스가 벗어났을 때도 색칠/해제 유지 (선택 사항)
        });
      }
    }
  }
  gridContainer.appendChild(table);
  updateHints();
}

// 셀 색칠/해제 함수
function toggleCell(rowIdx: number, colIdx: number, fill: boolean) {
  if (rowIdx >= 0 && rowIdx < n && colIdx >= 0 && colIdx < n) {
    const cell = table.rows[rowIdx + 1].cells[colIdx + 1];
    grid[rowIdx][colIdx] = fill ? 1 : 0;
    cell.classList.toggle("filled", fill);
    updateHints();
  }
}

// 힌트 생성 함수 (기존 코드와 동일)
function updateHints() {
  for (let i = 1; i <= n; i++) {
    const row = grid[i - 1];
    const hints: number[] = [];
    let count = 0;
    for (const cell of row) {
      if (cell === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      hints.push(count);
    }
    const hintCell = table.rows[i].cells[0];
    hintCell.textContent = hints.join(" ");
  }

  for (let j = 1; j <= n; j++) {
    const col: number[] = [];
    for (let i = 0; i < n; i++) {
      col.push(grid[i][j - 1]);
    }
    const hints: number[] = [];
    let count = 0;
    for (const cell of col) {
      if (cell === 1) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      hints.push(count);
    }
    const hintCell = table.rows[0].cells[j];
    hintCell.textContent = hints.join("\n");
    hintCell.style.whiteSpace = "pre-wrap";
  }
}

// 격자 생성 버튼 이벤트 리스너 (기존 코드와 동일)
createGridButton.addEventListener("click", createGrid);

// 초기 격자 생성 (기존 코드와 동일)
createGrid();
