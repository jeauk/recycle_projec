package com.trashformer.springboot_recycle.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.service.JwtService;
import com.trashformer.springboot_recycle.service.KakaoUserService;
import com.trashformer.springboot_recycle.util.JwtUtil;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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
    private JwtService jwtService;

    // 프로필 이미지가 저장될 디렉토리 경로
    private final String PROFILE_DIR = "src/main/resources/static/uploads/profiles/";

    // Base URL for accessing profile images
    private final String BASE_URL = "http://localhost:8080/image/profiles/";

    @PostMapping("/oauth/kakao/callback")
    public Map<String, String> handleKakaoCallback(@RequestBody Map<String, String> requestData) {
        String code = requestData.get("code");

        // 엑세스 토큰 요청
        String clientId = "your_client_id"; // 여기에 자신의 앱 REST API 키를 입력하세요.
        String redirectUri = "http://localhost:3000/login/oauth2/callback/kakao";

        String tokenRequestUrl = "https://kauth.kakao.com/oauth/token"
                + "?grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&code=" + code;

        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        ResponseEntity<Map> tokenResponse = new RestTemplate().postForEntity(tokenRequestUrl, new HttpEntity<>(tokenHeaders), Map.class);

        String accessToken = (String) tokenResponse.getBody().get("access_token");

        // 사용자 정보 요청
        HttpHeaders profileHeaders = new HttpHeaders();
        profileHeaders.set("Authorization", "Bearer " + accessToken);

        ResponseEntity<Map> profileResponse = new RestTemplate().postForEntity("https://kapi.kakao.com/v2/user/me", new HttpEntity<>(profileHeaders), Map.class);

        // 응답에서 필요한 정보 추출
        Map<String, Object> kakaoAccount = (Map<String, Object>) profileResponse.getBody().get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImageUrl = (String) profile.getOrDefault("profile_image_url", BASE_URL + "default-profile-image.png");

        // DB에 사용자 정보 저장 또는 기존 사용자 반환
        KakaoUserEntity user = kakaoUserService.saveUser(email, nickname, profileImageUrl);

        // JWT 생성
        String jwt = jwtUtil.createJwt(user.getEmail(), user.getNickname(), user.getProfileImageUrl());

        // 결과 반환
        Map<String, String> result = new HashMap<>();
        result.put("jwt", jwt);

        return result;
    }

    @GetMapping("/user/profile")
    public ResponseEntity<Map<String, Object>> loadProfile(@RequestHeader("Authorization") String jwtToken) {
        String email = jwtService.extractEmailFromJwt(jwtToken);
        if (email == null) {
            return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
        }
    
        KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }
    
        // 저장된 프로필 이미지 경로를 URL로 변환
        String profileImageUrl = user.getProfileImageUrl();
        if (profileImageUrl != null && profileImageUrl.startsWith(PROFILE_DIR)) {
            // 프로필 이미지 경로를 웹 URL로 변환
            profileImageUrl = profileImageUrl.replace(PROFILE_DIR, BASE_URL);
        }
    
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("nickname", user.getNickname());
        profileData.put("profileImageUrl", profileImageUrl);
    
        return ResponseEntity.ok(profileData);
    }
    

    @PostMapping("/user/updateProfile")
    public ResponseEntity<Map<String, String>> updateProfile(
        @RequestHeader("Authorization") String jwtToken,
        @RequestParam("nickname") String nickname,
        @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        String email = jwtService.extractEmailFromJwt(jwtToken);
        if (email == null) {
            return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
        }

        KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        user.setNickname(nickname);

        if (profileImage != null && !profileImage.isEmpty()) {
            String profileImagePath = saveProfileImage(profileImage);
            if (profileImagePath != null) {
                user.setProfileImageUrl(profileImagePath);
            } else {
                return ResponseEntity.status(500).body(Map.of("message", "프로필 이미지 저장 중 오류가 발생했습니다."));
            }
        }

        kakaoUserRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "프로필이 성공적으로 업데이트되었습니다."));
    }

    private String saveProfileImage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = PROFILE_DIR + fileName;

            File directory = new File(PROFILE_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path);

            // 실제 파일 경로를 URL로 변환하여 반환
            return BASE_URL + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
