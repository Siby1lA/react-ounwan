# 💪 오운완! 프로젝트

<img width="1900" alt="image" src="https://user-images.githubusercontent.com/77488652/197386991-987b4b4d-47b2-4980-ada5-6840f4c32918.png">
react + firebase 프로젝트 <br>
하루하루 운동 인증샷을 올리고 <br>
운동 자세 등 운동 관련 피드백을 유저들에게 받을 수 있는 서비스입니다. <br>

## 프로젝트 개발 계기

운동을 좋아하고 즐기는 사람으로서 오늘 하루 운동한 사진을 올리거나 피드백을 주고 받거나 회원권, PT를 구매하거나 등.. 운동과 관련된 모든 것이 있는 통합 사이트가 있으면 했습니다.
무엇보다 헬스, 필라테스 등 오늘 하루 운동을 했다는 사진을 인스타에 올리는 사람들이 많아졌기도 했고 개인적으로 깃허브 잔디처럼 시각적으로 언제, 몇일 운동했는지 볼 수 있는 기능과 운동 영상을 올려 유저들이 서로 피드백을 주고 받는 사이트를 구축해보고 싶었습니다.

## 🔗 [사이트 바로가기!](https://react-ounwan.web.app/)

## 📆 작업 기간

2022.09.04 ~ 2020.09.20

## 🛠 기술 스택

- react, typescript
- redux
- react-image-crop
- styled-components
- react-hook-form
- react-github-contribution-calendar
- react-progress-bar
- firebase

## 🖥 기능 구현 사항

- 헤더바
  - 다크모드
  - 내 프로필
    - 닉네임, 비밀번호, 프로필 이미지 변경
    - 자신이 올린 오운완, 피드백 게시글 표시
- 로그인 및 회원가입
  - 로그인
    - Email
    - Google
  - 회원가입
    - 회원가입시 프로필 이미지 랜덤 지정
  - 비밀번호 찾기
- 오운완 페이지
  - 실시간 오운완(DB) 불러오기 (firebase onSnapshot())
  - Infiniti scroll (오운완 12개씩 추가)
  - 오운완 작성 Modal
    - image-crop (이미지 오운완 포맷에 맞게 자르기)
    - 오운완 태그 입력
    - react-progress-bar로 업로드 진행 상황 표시 (firebase sotrage)
- 피드백 페이지

  - 실시간 피드백(DB) 불러오기 (firebase onSnapshot())
  - Infiniti scroll (피드백 12개씩 추가)

- 그 외
  - react-github-contribution-calendar를 통한 운동 일수 체크

## 🙋🏻‍♂️ 업데이트 내역

- 오운완 업로드시 프로그레스바 추가 (새로고침 하거나 페이지 이탈하면 업로드가 안된다는 피드백을 수용)
- 다크모드 적용이 제대로 안되던 이슈 해결
- 오운완 게시글에 날짜 표시
- contribution calendar 추가
