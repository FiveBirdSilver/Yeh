📝 **프로젝트 기획**

- 익명성 보장을 기반으로 글을 통해 자신의 목소리를 낼수 있는 사내 소셜 네트워크 서비스입니다.

📝 **프로젝트 총평**

- 프로젝트의 기획부터 디자인까지 모든 영역을 수행해 볼 수 있는 좋은 경험이었습니다.
- 유저 관리를 JWT 토큰을 사용함으로써 보안을 한 층 생각할 수 있는 계기가 되었습니다.
- RESTful API를 활용한 데이터 통신을 경험해볼 수 있었습니다.
- 다양한 라이브러리를 사용해 볼 수 있는 좋은 경험이었습니다.

📝 **프로젝트 기능 구현**

- NextJs을 이용한 SSR 환경 구축

- 공통
  - API routes를 이용해 mongoDB 연결
  - mongoose를 이용하여, Schema를 적용한 데이터 구조 정의
  - Recoil을 사용한 유저 및 검색 state 관리
  - 데이터 로드 전 Skeleton Loading 전체 추가
- 유저
  - useForm, yupResolver 을 이용한 회원가입 폼 구현 및 유효성 검사
  - nodemailer를 이용한 비밀번호 재설정 전 단계 인증을 위한 이메일 전송
  - JWT 발급 (AccessToke ⇒ 쿠키, RefreshToken DB에 적재 및 만료 시간에 따른 제거 기능)
- 게시글
  - useInfiniteQuery를 이용한 무한 스크롤 기능 구현
  - 게시글 생성 시, formidable 모듈을 이용한 이미지 업로드
  - 게시글 수정 시, 이미지 미리보기 기능 구현
  - 좋아요, 댓글, 공유 기능 구현

📝 **프로젝트 아쉬운 점**

    - 단독 진행으로 주석 및 커밋 메시지 통일적으로 관리하지 않은 점
    - 반응형 라이브러리를 활용하지 않은 점 (활용했으면 조금 더 깔끔했을 것 같은 느낌)

📝 **앞으로**

- 전반적 코드 리팩토링
- 게시글 생성 시, 이미지 Drag and Drop 기능 추가
- 푸시 알람 기능 추가
- 익명 대화 기능 추가
- 조회 수 쿠키를 이용한 카운트
