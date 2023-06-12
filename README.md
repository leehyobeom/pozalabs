

1. 파이썬 3.9 환경 구성 (pyenv, virtualenv, ...)
2. poetry 설치 (`pip install poetry`)
3. 패키지 설치 (`poetry install`)

### 필요 패키지 설치 (파이썬 사용시)

```shell
$ poetry add "PACKAGE"
``` 

### 데이터 및 API

- mock API 실행을 위해 Docker를 먼저 설치해야 합니다.
- mock API에 대한 자세한 내용은 첨부된 API.md 문서를 참조해 주세요.

## 개요

- 사용자가 입력한 메타데이터를 만족하는 샘플 목록을 조합해 리턴하는 API를 작성해야 합니다.
- 필요한 데이터는 제공되는 mock API를 통해 검색합니다.
  - 사용자가 입력할 수 있는 메타데이터 목록
  - 사용할 수 있는 샘플 목록
- 조합 조건은 추후 변경이 잦을 수 있기 때문에 API는 변경에 유연해야 합니다.
  - 조합 조건은 추후 변경될 가능성이 높다고 가정합니다.

### 용어

- 샘플: 하나의 음원을 구성하는 짧은 음원
- 메타데이터: 음원을 구성하는 속성
  - 장르
  - 악기
  - 역할 (음원에서 샘플이 맡는 역할)
  - 키
  - 박자
  - BPM (음원의 빠르기)

## 구현 

- 샘플 필터링 로직 및 API 구현
- 에러 처리
- 타입 힌트 사용. 불가피한 경우를 제외하면 타입 힌트를 사용해야 합니다.
- 확장성 높은 코드
- 가독성 높은 코드

## API

- 요청/응답 스키마는 편의상 TypeScript를 사용해 기술합니다.

### TypeScript 기본 문법

- `interface`: 구조체를 선언합니다.
- `[]`, `Array`: 배열을 나타냅니다.
  - 타입과 함께 사용하면 해당 타입으로 이루어진 배열을 나타냅니다.
  - `string[]`: string 배열. (`Array<string>`으로도 표기할 수 있습니다.)

### 엔드포인트

API는 다음과 같이 호출합니다.

```
POST /v1/musics
```

### 요청 스키마

```typescript
interface Track {
    role: string; // 트랙의 역할
    instruments: string[]; // 트랙에 사용될 악기
    is_primary: boolean; // 주요 트랙 여부
}

interface Request {
    genre: string; // 음원의 장르
    bpm: number[]; // 음원의 템포 최소/최대 (예: [50, 100])
    keys: string[] ; // 음원의 키
    time_signatures: string[]; // 음원의 박자
    tracks: Track[]; // 사용할 트랙 목록
}
```

### 응답 스키마

- 상태 코드: 200 OK

```typescript
interface Sample {
    id: number;
    genre: string;
    role: string;
    instrument: string;
    key: string;
    time_signature: string;
    bpm: number;
}

interface Response {
    total: number;  // 선택된 샘플 개수
    items: Sample[];  // 선택된 샘플 목록
}
```

### 1. 입력 데이터

- 모든 값은 필숫값입니다.
- **mock API로 조회할 수 있는 값들만 사용할 수 있습니다.** (데이터 API 참고)
- 필드별 제한 조건
  - `genre`: 해당 값과 일치하는 샘플 선택
    - mock API 메타데이터 타입: `genre`
    - mock API에서 리턴되는 값만 사용할 수 있습니다.
  - `bpm`: 최대 길이 2의 배열
    - 각 원소의 값 범위: 30 ~ 200
    - 길이 1인 경우: 해당 BPM을 가진 샘플을 선택합니다.
    - 길이 2인 경우: BPM이 `[최소, 최대]` 구간에 속하는 샘플을 선택합니다.
  - `keys`
    - mock API 메타데이터 타입: `key`
    - mock API에서 리턴되는 값만 사용할 수 있습니다.
    - `key`가 입력된 배열에 속하는 샘플을 선택합니다.
  - `time_signatures`
    - mock API 메타데이터 타입: `time_signature`
    - mock API에서 리턴되는 값만 사용할 수 있습니다.
    - `time_signature`가 입력된 배열에 속하는 샘플을 선택합니다.
  - `track.role`
    - mock API 메타데이터 타입: `role`
    - mock API에서 리턴되는 값만 사용할 수 있습니다.
    - 해당 값과 일치하는 `role`을 가진 샘플을 선택합니다.
  - `track.instruments`
    - mock API 메타데이터 타입: `instrument`
    - mock API에서 리턴되는 값만 사용할 수 있습니다.
    - `instrument`가 입력된 배열에 속하는 샘플을 선택합니다.
  - `track.is_primary`
    - 주요 트랙 여부를 나타냅니다.
    - 단 한개의 트랙만 주요 트랙으로 설정할 수 있습니다. (`tracks` 중 `is_primary == true`인 원소는 한개로 제한)
    - `role`이 `drums`인 트랙은 주요 트랙으로 설정할 수 없습니다.

### 2. 샘플 조합 조건

- 입력된 데이터를 만족하는 샘플 중, 주요 트랙에 해당하는 샘플을 가장 먼저 선택합니다. (`track.is_primary == true`)
- 주요 트랙을 선택하면 이후 샘플은 순서에 상관없이 선택할 수 있습니다.
- 단 이후 선택하는 샘플은 아래 값이 주요 트랙으로 선택된 샘플의 값과 동일해야 합니다.
  - `genre`
  - `bpm`
  - `key` (단 드럼 트랙 (`track.role == drums`)은 해당 조건을 무시합니다.)
  - `time_signature`

### 3. 에러 처리

- 요청 검증 실패, 샘플 조합 실패시 적절한 에러를 응답 코드와 함께 리턴해야 합니다.
- 에러 스키마에 제한은 없으나 일관된 응답을 리턴해야 합니다.
- 에러 응답 역시 JSON으로 리턴해야 합니다.

### 예시

#### 리퀘스트 예시

```json
{
  "genre": "cinematic",
  "bpm": [100, 150],
  "keys": ["cmajor", "aminor"],
  "time_signatures": ["3/4", "4/4"],
  "tracks": [
    {
      "role": "main",
      "instruments": ["piano", "guitar"],
      "is_primary": false
    },
    {
      "role": "sub",
      "instruments": ["piano"],
      "is_primary": true
    },
    {
      "role": "bass",
      "instruments": ["bass"],
      "is_primary": false
    },
    {
      "role": "drums",
      "instruments": ["drums"],
      "is_primary": false
    }
  ]
}
```

사용자가 위와 같은 값을 입력하면 샘플은 다음 과정을 거쳐 조합합니다. 
mock API에서 조회할 수 있는 샘플 목록 중 입력 조건에 맞는 샘플을 선택합니다.

1. 주요 트랙에 해당하는 샘플을 먼저 선택합니다.
   - 위의 예시에서 주요 트랙에 해당하는 샘플은 아래 조건을 만족합니다.
     - `role`: sub
     - `genre`: cinematic
     - `bpm`: 100 ~ 150 사이
     - `key`: cmajor, aminor 중 임의의 값
     - `time_signature`: 3/4, 4/4 중 임의의 값
     - `instrument`: piano
2. 나머지 샘플을 선택합니다.
   - 이후 샘플은 아래 조건을 만족합니다.
     - `role`: 각 트랙별 입력값
     - `instrument`: 각 트랙별 입력값 주 임의의 값
     - `genre`: cinematic
     - `bpm`: 주요 트랙으로 선택된 샘플의 BPM
     - `key`: 주요 트랙으로 선택된 샘플의 key

#### 응답 예시

```json
{
  "total": 4,
  "items": [
    {
      "id": 1,
      "genre": "cinematic",
      "role": "main",
      "instrument": "piano",
      "key": "cmajor",
      "time_signature": "4/4",
      "bpm": 120
    },
    {
      "id": 2,
      "genre": "cinematic",
      "role": "sub",
      "instrument": "piano",
      "key": "cmajor",
      "time_signature": "4/4",
      "bpm": 120
    },
    {
      "id": 3,
      "genre": "cinematic",
      "role": "bass",
      "instrument": "bass",
      "key": "cmajor",
      "time_signature": "4/4",
      "bpm": 120
    },
    {
      "id": 4,
      "genre": "cinematic",
      "role": "drums",
      "instrument": "drums",
      "key": "cmajor",
      "time_signature": "4/4",
      "bpm": 120
    }
  ]
}
```
