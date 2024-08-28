package com.trashformer.springboot_recycle.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
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
import java.util.Map;
import java.util.UUID;

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
    JwtUtil jUtil;

    @Autowired
    private JwtService jwtService;

    private final String PROFILE_DIR = "C:\\profiles\\"; // 프로필 이미지가 저장될 디렉토리 경로

    @PostMapping("/oauth/kakao/callback")
    public Map<String, String> handleKakaoCallback(@RequestBody Map<String, String> requestData) {
        String code = requestData.get("code");

        // 엑세스 토큰 요청
        String clientId = "dcedd1709d6d717e342a5c8ecea26356"; // 여기에 자신의 앱 REST API 키를 입력하세요.
        String redirectUri = "http://localhost:3000/login/oauth2/callback/kakao";

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

        // 사용자 프로필 정보를 응답으로 반환
        Map<String, Object> profileData = new HashMap<>();
        profileData.put("nickname", user.getNickname());
        profileData.put("profileImageUrl", user.getProfileImageUrl());

        return ResponseEntity.ok(profileData);
    }

   @PostMapping("/user/updateProfile")
    public ResponseEntity<Map<String, String>> updateProfile(
        @RequestHeader("Authorization") String jwtToken, // JWT 토큰을 헤더에서 가져옴
        @RequestParam("nickname") String nickname, // 닉네임 파라미터
        @RequestParam(value = "profileImage", required = false) MultipartFile profileImage // 프로필 이미지 파일 (선택 사항)
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
            String profileImagePath = saveProfileImage(profileImage); // 이미지 저장
            if (profileImagePath != null) {
                user.setProfileImageUrl(profileImagePath); // 저장된 이미지 경로를 설정
            } else {
                return ResponseEntity.status(500).body(Map.of("message", "프로필 이미지 저장 중 오류가 발생했습니다."));
            }
        }

        // 업데이트된 사용자 정보를 DB에 저장
        kakaoUserRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "프로필이 성공적으로 업데이트되었습니다."));
    }

    // 프로필 이미지 저장 메소드
    private String saveProfileImage(MultipartFile file) {
        try {
            // 파일 이름 생성 (UUID 사용)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            // 파일 경로 설정
            String filePath = PROFILE_DIR + fileName;

            // 파일 저장 디렉토리가 없으면 생성
            File directory = new File(PROFILE_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 파일 저장
            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path);

            return filePath; // 저장된 파일 경로 반환
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }



}