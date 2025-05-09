## 나만의 네모로직 힌트 생성기

### 프로젝트 개요

이 프로젝트는 사용자가 지정한 크기의 네모로직 퍼즐 격자를 생성하고, 격자에 색칠한 내용을 바탕으로 행과 열 힌트를 자동으로 생성해 주는 웹 애플리케이션입니다. 사용자는 격자 크기를 자유롭게 설정하고, 마우스 드래그를 통해 간편하게 칸을 색칠하며, 실시간으로 업데이트되는 힌트를 확인할 수 있습니다.

### 주요 기능

* **격자 크기 조절:** 원하는 네모로직 퍼즐의 크기 ($n \times n$)를 설정할 수 있습니다.
* **드래그 색칠:** 마우스 드래그를 통해 여러 칸을 한 번에 색칠하거나 해제할 수 있습니다.
* **실시간 힌트 생성:** 격자의 색칠 상태가 변경될 때마다 행과 열 힌트가 자동으로 업데이트되어 표시됩니다.
* **직관적인 UI:** 사용하기 쉬운 인터페이스를 제공하여 네모로직 퍼즐을 만드는 과정을 간편하게 합니다.
* **힌트 위치:** 생성된 행 힌트는 격자의 왼쪽에, 열 힌트는 격자의 상단에 표시됩니다.

### 기술 스택

* **HTML:** 웹 페이지의 구조를 정의합니다.
* **CSS:** 웹 페이지의 스타일링을 담당합니다.
* **TypeScript:** JavaScript로 컴파일되는 타입스크립트로 개발하여 코드의 안정성과 개발 생산성을 높였습니다.
* **Git:** 코드 버전 관리를 위해 사용됩니다.

### 실행 방법

1.  **저장소 복제 (Clone):**
    ```bash
    git clone [이 저장소의 URL]
    ```
2.  **HTML 파일 열기:**
    * 복제한 폴더 내의 `index.html` 파일을 웹 브라우저로 엽니다.

### 개발 환경 설정 (선택 사항)

만약 코드를 수정하거나 개발에 참여하고 싶다면 다음 단계를 따르세요.

1.  **Node.js 및 npm 설치:** 타입스크립트 컴파일러를 사용하기 위해 Node.js와 npm(Node Package Manager)이 설치되어 있어야 합니다. ([https://nodejs.org/](https://nodejs.org/) 에서 다운로드 및 설치할 수 있습니다.)
2.  **타입스크립트 컴파일러 설치:**
    ```bash
    npm install -g typescript
    ```
3.  **프로젝트 폴더로 이동:**
    ```bash
    cd [복제한 폴더 이름]
    ```
4.  **타입스크립트 파일 컴파일:**
    ```bash
    tsc script.ts --outDir dist --outFile main.js
    ```
    (`script.ts` 파일을 `dist` 폴더 내의 `main.js` 파일로 컴파일합니다.)
5.  **웹 브라우저에서 `index.html` 파일 열기:**
    * 컴파일된 JavaScript 파일이 HTML에 연결되어 있으므로, 브라우저에서 바로 실행하여 결과를 확인할 수 있습니다.

### 기여 방법

언제나 환영합니다! 버그 발견, 기능 개선 아이디어, 코드 개선 등 어떤 형태의 기여든 감사드립니다.

1.  **포크 (Fork) 하기**
2.  **자신의 브랜치 (`git checkout -b feature/your-feature`) 만들기**
3.  **변경 사항 커밋 (`git commit -am 'Add some feature'`)**
4.  **원격 저장소에 푸시 (`git push origin feature/your-feature`)**
5.  **풀 리퀘스트 (Pull Request) 보내기**

### 라이선스

MIT License

Copyright (c) [현재 년도] [당신의 이름 또는 조직 이름]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
