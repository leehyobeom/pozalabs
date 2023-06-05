# mock API

- 본 문서는 과제에서 사용할 mock API 명세를 기술합니다.
- 배열은 쿼리 파라미터를 여러번 입력해 전달합니다. (explode)
  - 예: `parameter1=123&parameter1=456`

## 서버 실행 방법

- docker, docker-compose가 먼저 설치되어야 합니다.
 
### Docker 사용

1. 컨테이너 빌드
```shell
$ docker build -f mock.Dockerfile . -t mock:latest
```
2. 컨테이너 실행
```shell
$ docker run -p 9000:9000 --name mock mock:latest
```
3. 컨테이너 종료
```shell
$ docker stop $(docker ps -f "name=mock" --format "{{.ID}}")
```

### docker-compose 사용

1. 컨테이너 빌드 및 실행
```shell
$ docker-compose up
```

## 공통

### 목록 조회 응답 스키마

- 목록을 조회하는 엔드포인트는 아래 응답 스키마를 공통으로 사용합니다.
- 필드 설명
  - `total`: 총 목록 개수
  - `items`: 실제 리턴되는 원소 목록
  - `has_prev`: (페이지네이션 수행 시) 이전 페이지 존재 여부
  - `has_next`: (페이지네이션 수행 시) 다음 페이지 존재 여부
- 페이지네이션 수행시 전체 목록을 저장하려면 `has_next`가 `true`에서 `false`로 변하는 시점까지 `page`를 증가시키면서 API를 호출합니다. 

```json
{
  "total": 100,
  "items": [
    {},
    {}
  ],
  "has_next": true,
  "has_prev": false
}
```

### 에러 응답

- `title`, `type`은 필수 응답 데이터입니다.
- 필드 설명
  - `title`: 에러 메시지
  - `type`: 에러 유형
  - `detail`: (nullable string) 자세한 에러 메시지
  - `invalid_params`: (nullable array) 리퀘스트 검증 오류 등이 발생하는 경우, 에러가 발생한 필드에 관한 에러 내용

```json
{
  "title": "에러 메시지",
  "type": "에러 유형",
  "detail": "자세한 에러 메시지 (nullable)",
  "invalid_params": [
    {
      "loc": "에러 발생 위치",
      "message": "해당 위치에서 발생한 에러의 메시지",
      "type": "에러 유형",
    }
  ]
}
```


## 메타데이터 조회

- 엔드포인트: GET /v1/categories
- 에러 응답: 404, 422, 500
- 전체 목록이 모두 리턴되기 때문에 `has_prev`, `has_next` 필드는 무시합니다.

| 파라미터   | 타입                | 필수 여부 | 
|--------|-------------------|:-----:|
 | `type` | `array of string` |   X   |

### 응답 스키마

```typescript
interface Category {
    id: number;
    type: string;  // 카테고리 유형
    name: string;  // 카테고리 이름
}

interface CategoryList {
    total: number;  // 리턴된 목록 개수
    items: Category[];  // 리턴된 카테고리 목록
    has_prev: boolean;  // 이전 페이지 존재 여부
    has_next: boolean;  // 다음 페이지 존재 여부
}
```

### 리퀘스트 예시 (cURL)

전체 목록 조회
```shell
$ curl -XGET "http://localhost:9000/v1/categories"
```

파라미터 지정
```shell
$ curl -XGET "http://localhost:9000/v1/categories?type=role&type=key"
```

## 샘플 목록 조회

- 엔드포인트: GET /v1/samples
- 에러 응답: 404, 422, 500

| 파라미터             | 타입                | 필수 여부 | 제한 조건    | 기본값 | 설명          | 
|------------------|-------------------|:-----:|----------|-----|-------------|
 | `genre`          | `array of string` |   X   |          |     |             |
 | `role`           | `array of string` |   X   |          |     |             |
 | `key`            | `array of string` |   X   |          |     |             |
 | `time_signature` | `array of string` |   X   |          |     |             |
 | `min_bpm`        | `number`          |   X   | 30 ~ 200 |     |             |
 | `max_bpm`        | `number`          |   X   | 30 ~ 200 |     |             |
 | `page`           | `number`          |   X   | 1 이상     | 1   | 페이지 번호      |
 | `per_page`       | `number`          |   X   | 1 이상     | 10  | 페이지 당 목록 개수 |

### 응답 스키마

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

interface SampleList {
    total: number;  // 리턴된 목록 개수
    items: Sample[];  // 리턴된 샘플 목록
    has_prev: boolean;  // 이전 페이지 존재 여부
    has_next: boolean;  // 다음 페이지 존재 여부
}
```

### 리퀘스트 예시 (cURL)

전체 목록 조회
```shell
$ curl -XGET "http://localhost:9000/v1/samples"
```

파라미터 지정
```shell
$ curl -XGET "http://localhost:9000/v1/samples?genre=cinematic&time_signature=3/4&time_signature=4/4"
```
