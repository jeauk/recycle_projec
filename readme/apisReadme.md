| Index | 기능                         | 메소드 | Path                                        | 토큰여부 |
|-------|----------------------------|--------|---------------------------------------------|---------|
| 회원   |                             |        |                                             |         |
|       | 카카오 로그인                | POST   | /oauth/kakao/callback                       | O       |
|       | jwt 디코딩                   | POST   | /parseJwt                                   | O       |
| 프로필 |                             |        |                                             |         |
|       | 내 정보 가져오기             | GET    | /user/profile                               | O       |
|       | 프로필 수정                  | POST   | /user/updateProfile                         | O       |
|       | 내가 적은 글                 | GET    | /mypage/mylist                              | O       |
|       | 추천 누른 글                 | GET    | /mypage/recommend                           | O       |
| 아름다운 가게 |                         |        |                                             |         |
|       | 가게 위치 정보               | GET    | /bmarket                                    | X       |
| 탄소중립 |                             |        |                                             |         |
|       | 회사 정보들 가져오기         | GET    | /carvon/companyList                         | X       |
|       | 제도 소개                    | GET    | /carvon/jedo                                | X       |
| 컨택   |                             |        |                                             |         |
|       | 메일 보내기                  | POST   | /api/contact/post                           |         |
|       | 닉네임 정보 가져오기         | GET    | /contact/nickname                           | O       |
| 굿윌스토어 |                           |        |                                             |         |
|       | 가게 위치 정보               | GET    | /gwill                                      | X       |
| 이미지 |                             |        |                                             |         |
|       | 이미지 가져오기              | GET    | /image/{date}/{filename}                    | O       |
|       |                              | GET    | /image/profiles/{email}/{filename}          | O       |
|       |                              | GET    | /image/recycleMain/{filename}               | O       |
| 백과사전 |                             |        |                                             |         |
|       | 검색 기능                    | GET    | /mainrecycle                                | X       |
|       | 값 불러오기                  | GET    | /mainrecycle/{id}                           | X       |
| 맵     |                             |        |                                             |         |
| 퀴즈   | 퀴즈 값 불러오기            | GET    | /api/quiz                                   | X       |
| 추천   | 추천 값 올리기/내리기        | POST   | /api/posts/recommend/{id}                   | X       |
| 리폼게시판 |                         |        |                                             |         |
|       | 글쓰기                       | POST   | /api/posts                                  | O       |
|       | 글 불러오기                  | GET    | /api/postlist                               | O       |
|       | 상세하게 불러오기            | GET    | /api/posts/{id}                             | O       |
|       | 게시글 삭제하기              | DELETE | /delete/posts/{id}                          | O       |
|       | 게시글 수정하기              | POST   | /edit/posts/{id}                            | O       |
|       | 썸네일 들고오기              | POST   | /naver                                      | X       |
| 시도   |                             |        |                                             |         |
|       | 시도 정보 불러오기           | GET    | /sido                                       | X       |
|       | 시도 조건 검색               | GET    | /sido/submit/{id}                           | X       |
|       | 군구 값 넘기기               | POST   | /sido/submit                                | X       |
