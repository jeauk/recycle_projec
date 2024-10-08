package com.trashformer.springboot_recycle.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.RecommendEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.repository.RecommendRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;
import com.trashformer.springboot_recycle.service.JwtService;
import com.trashformer.springboot_recycle.service.KakaoUserService;
import com.trashformer.springboot_recycle.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.xml.bind.DatatypeConverter;

@RestController
@CrossOrigin
public class ProfileController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private KakaoUserService kakaoUserService;

    @Autowired
    private KakaoUserRepository kakaoUserRepository;

    @Autowired 
    private ReformBoardRepository reformBoardRepository;

    @Autowired
    private RecommendRepository recommendRepository;

    @Autowired
    JwtUtil jUtil;

    @Autowired
    private JwtService jwtService;

<<<<<<< HEAD
    private final String BASE_URL = "http://localhost:8080/image/profiles";
=======
    private final String BASE_URL = "https://trashformer.site/image/profiles";
>>>>>>> main
    private final String PROFILE_DIR = "src/main/resources/static/uploads/profiles/"; // 프로필 이미지가 저장될 디렉토리 경로

    @PostMapping("/oauth/kakao/callback")
    public Map<String, String> handleKakaoCallback(@RequestBody Map<String, String> requestData) {
        String code = requestData.get("code");

        // 엑세스 토큰 요청
        String clientId = "dcedd1709d6d717e342a5c8ecea26356"; // 여기에 자신의 앱 REST API 키를 입력하세요.
        String redirectUri = "https://trashformer.life/login/oauth2/callback/kakao";

        String tokenRequestUrl = "https://kauth.kakao.com/oauth/token"
                + "?grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&code=" + code;

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<String> tokenRequestEntity = new HttpEntity<>(tokenHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenRequestUrl, tokenRequestEntity, Map.class);

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        //////////////////////////////////////위에는 엑세스토큰 받아오는거 밑에는 정보 받아오는거////////////////////////////////////

        // 사용자 정보 요청
        HttpHeaders profileHeaders = new HttpHeaders();
        profileHeaders.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> profileEntity = new HttpEntity<>(profileHeaders);
        ResponseEntity<Map> profileResponse = restTemplate.postForEntity("https://kapi.kakao.com/v2/user/me", profileEntity, Map.class);

        // 응답에서 필요한 정보 추출
        Map<String, Object> kakaoAccount = (Map<String, Object>) profileResponse.getBody().get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImageUrl = (String) profile.getOrDefault("profile_image_url", "https://example.com/default-profile-image.png");

        // DB에 사용자 정보 저장 또는 기존 사용자 반환
        KakaoUserEntity user = kakaoUserService.saveUser(email, nickname, profileImageUrl);

        // JWT 생성
        String jwt = jwtUtil.createJwt(user.getEmail(), user.getNickname(), user.getProfileImageUrl());

        // 결과 반환
        Map<String, String> result = new HashMap<>();
        result.put("jwt", jwt);

        return result;
    }

    @PostMapping("/parseJwt")
    public Map<String, String> parseJwt(@RequestBody Map<String, String> requestData) {
        String jwt = requestData.get("jwt");
        jwtUtil.getDataFromJwt(jwt);

        // 결과 반환
        Map<String, String> result = new HashMap<>();
        // 필요 시 result에 추가 데이터를 넣을 수 있습니다.

        return result;
    }

    @GetMapping("/user/profile")
    public ResponseEntity<Map<String, Object>> loadProfile(@RequestHeader("Authorization") String jwtToken) {
        // JWT에서 이메일 추출
        String email = jwtService.extractEmailFromJwt(jwtToken);
        if (email == null) {
            return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
        }
    
        // 이메일로 사용자 조회
        KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }
    
        // 사용자 작성 게시글 목록 조회
        List<ReformBoardEntity> userPosts = reformBoardRepository.findByKakaoUserEntity(user);
    
        // 사용자가 추천한 게시글 목록 조회
        List<Map<String, Object>> recommendedPosts = recommendRepository.findByUser(user).stream()
            .map(recommend -> {
                Map<String, Object> recommendInfo = new HashMap<>();
                recommendInfo.put("boardId", recommend.getReformBoardEntity().getId());  // 게시판 ID
                recommendInfo.put("title", recommend.getReformBoardEntity().getTitle()); // 게시판 제목
                recommendInfo.put("viewCount", recommend.getReformBoardEntity().getViewCount()); 
                recommendInfo.put("createAt", recommend.getReformBoardEntity().getCreatedAt()); 
                recommendInfo.put("recommendCount", recommend.getReformBoardEntity().getRecommendCount()); 
                recommendInfo.put("nickname", recommend.getReformBoardEntity().getKakaoUserEntity().getNickname());                return recommendInfo;
            })
            .collect(Collectors.toList());
    
        // 사용자 프로필 정보를 응답으로 반환
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("nickname", user.getNickname());
        profileData.put("profileImageUrl", user.getProfileImageUrl());
    
        // 사용자 작성 게시글 정보 추가
        List<Map<String, Object>> postData = userPosts.stream().map(post -> {
            Map<String, Object> postInfo = new HashMap<>();
            postInfo.put("postId", post.getId());
            postInfo.put("title", post.getTitle());
            postInfo.put("createAt",post.getCreatedAt());
            postInfo.put("viewCount",post.getViewCount());
            postInfo.put("nickname",post.getKakaoUserEntity().getNickname());
            postInfo.put("recommendCount",post.getRecommendCount());
            return postInfo;
        }).collect(Collectors.toList());
        profileData.put("userPosts", postData);
    
        // 사용자가 추천한 게시글 정보 추가
        profileData.put("recommendedPosts", recommendedPosts);
    
        return ResponseEntity.ok(profileData);
    }


    @PostMapping("/user/updateProfile")
public ResponseEntity<Map<String, String>> updateProfile(
    @RequestHeader("Authorization") String jwtToken,
    @RequestParam("nickname") String nickname,
    @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
) {
    // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);
    if (email == null) {
        return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
    }

    // 이메일로 사용자 조회
    KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
    if (user == null) {
        return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
    }

    // 닉네임 업데이트
    user.setNickname(nickname);

    // 프로필 이미지 업데이트
    if (profileImage != null && !profileImage.isEmpty()) {
        deleteProfileImage(user.getProfileImageUrl());
        String profileImagePath = saveProfileImage(profileImage, email); // 이메일 인자를 추가
        if (profileImagePath != null) {
            user.setProfileImageUrl(profileImagePath);
        } else {
            return ResponseEntity.status(500).body(Map.of("message", "프로필 이미지 저장 중 오류가 발생했습니다."));
        }
    }

    // 업데이트된 사용자 정보를 DB에 저장
    kakaoUserRepository.save(user);

    return ResponseEntity.ok(Map.of("message", "프로필이 성공적으로 업데이트되었습니다."));
}

// 기존 프로필 이미지 삭제 메소드
private void deleteProfileImage(String imageUrl) {
    if (imageUrl != null && !imageUrl.isEmpty()) {
        // 로컬 파일 시스템에서 파일 경로 생성
        String filePath = imageUrl.replace(BASE_URL, PROFILE_DIR);
        File file = new File(filePath);
        if (file.exists()) {
            file.delete(); // 파일 삭제
        }
    }
}

    // 프로필 이미지 저장 메소드
// 프로필 이미지 저장 메소드
private String saveProfileImage(MultipartFile file, String email) {
    try {
        // 실제 email 값을 사용하여 경로 생성
        String directoryPath = PROFILE_DIR + email;

        // 파일 이름 생성 (UUID 사용)
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        // 로컬 파일 시스템에 저장될 실제 경로
        String filePath = directoryPath + "/" + fileName;

        // 파일 저장 디렉토리가 없으면 생성
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 파일 저장
        Path path = Paths.get(filePath);
        Files.copy(file.getInputStream(), path);

        // 클라이언트가 접근할 수 있는 URL 경로 반환
        return BASE_URL + "/" + email + "/" + fileName;
    } catch (IOException e) {
        e.printStackTrace();
        return null;
    }
}


@GetMapping("/mypage/mylist")
public ResponseEntity<Map<String, Object>> loadMyList(
        @RequestHeader("Authorization") String jwtToken,
        @RequestParam(defaultValue = "1") int page, // 페이지 번호
        @RequestParam(defaultValue = "10") int size // 페이지당 게시글 수
) {
    // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);
    if (email == null) {
        return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
    }

    // 이메일로 사용자 조회
    KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
    if (user == null) {
        return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
    }

    // 사용자 작성 게시글 목록 조회 (페이징 처리)
    Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<ReformBoardEntity> userPostsPage = reformBoardRepository.findByKakaoUserEntity(user, pageable);

    // 사용자 프로필 정보를 응답으로 반환
    Map<String, Object> profileData = new HashMap<>();
    profileData.put("nickname", user.getNickname());
    profileData.put("profileImageUrl", user.getProfileImageUrl());

    // 사용자 작성 게시글 정보 추가 (페이징 처리)
    List<Map<String, Object>> postData = userPostsPage.getContent().stream().map(post -> {
        Map<String, Object> postInfo = new HashMap<>();
        postInfo.put("postId", post.getId());
        postInfo.put("title", post.getTitle());
        postInfo.put("createAt", post.getCreatedAt());
        postInfo.put("viewCount", post.getViewCount());
        postInfo.put("nickname", post.getKakaoUserEntity().getNickname());
        postInfo.put("recommendCount", post.getRecommendCount());
        return postInfo;
    }).collect(Collectors.toList());

    // 페이징 정보 및 게시글 데이터 추가
    profileData.put("userPosts", postData);
    profileData.put("currentPage", userPostsPage.getNumber() + 1); // 현재 페이지 번호 (0-based이므로 +1)
    profileData.put("totalPages", userPostsPage.getTotalPages()); // 총 페이지 수
    profileData.put("totalItems", userPostsPage.getTotalElements()); // 전체 게시글 수

    return ResponseEntity.ok(profileData);
}

@GetMapping("/mypage/recommend")
public ResponseEntity<Map<String, Object>> loadMyRecommend(
        @RequestHeader("Authorization") String jwtToken,
        @RequestParam(defaultValue = "1") int page, // 페이지 번호, 기본값 1
        @RequestParam(defaultValue = "10") int size // 페이지당 게시글 수, 기본값 10
) {
    // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);
    if (email == null) {
        return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
    }

    // 이메일로 사용자 조회
    KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
    if (user == null) {
        return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
    }

    // 사용자가 추천한 게시글 목록 조회 (페이징 처리)
    Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "reformBoardEntity.createdAt"));
    Page<RecommendEntity> recommendedPostsPage = recommendRepository.findByUser(user, pageable);

    // 추천 게시글 정보 수집
    List<Map<String, Object>> recommendedPosts = recommendedPostsPage.getContent().stream()
    .map(recommend -> {
        Map<String, Object> recommendInfo = new HashMap<>();
        ReformBoardEntity post = recommend.getReformBoardEntity();
        recommendInfo.put("boardId", post.getId());  // 게시판 ID
        recommendInfo.put("title", post.getTitle()); // 게시판 제목
        recommendInfo.put("viewCount", post.getViewCount());
        recommendInfo.put("createAt", post.getCreatedAt());  // 게시판 생성 시간
        recommendInfo.put("recommendCount", post.getRecommendCount());
        recommendInfo.put("nickname", post.getKakaoUserEntity().getNickname());
        return recommendInfo;
    }).collect(Collectors.toList());

    // 페이징 정보 및 추천 게시글 반환
    Map<String, Object> responseData = new HashMap<>();
    responseData.put("recommendedPosts", recommendedPosts);
    responseData.put("currentPage", recommendedPostsPage.getNumber() + 1); // 현재 페이지 번호 (0-based이므로 +1)
    responseData.put("totalPages", recommendedPostsPage.getTotalPages()); // 총 페이지 수
    responseData.put("totalItems", recommendedPostsPage.getTotalElements()); // 전체 추천 게시글 수

    return ResponseEntity.ok(responseData);
}



}