package com.trashformer.springboot_recycle.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.service.KakaoUserService;
import com.trashformer.springboot_recycle.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;

import java.util.HashMap;
import java.util.Map;

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

       @PostMapping("/api/users/nickname")
    public ResponseEntity<Map<String, Object>> updateNickname(
            @RequestHeader("Authorization") String jwtToken,
            @RequestParam("newNickname") String newNickname) {

        // JWT에서 사용자 정보 추출
        String token = jwtToken.replace("Bearer ", "");
        Claims claims = extractClaims(token);  // JWT에서 클레임 추출
        String email = claims.get("email", String.class);  // 이메일 추출

        // 사용자 정보로 KakaoUserEntity 찾기
        KakaoUserEntity user = kakaoUserRepository.findByEmail(email);

        if (user == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "사용자를 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 닉네임 업데이트
        user.setNickname(newNickname);
        kakaoUserRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "닉네임이 성공적으로 업데이트되었습니다.");
        response.put("newNickname", newNickname);

        return ResponseEntity.ok(response);
    }

    // Claims 추출을 위한 메서드
    private Claims extractClaims(String jwtToken) {
        try {
            byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr");
            JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(secretKeyBytes).build();
            return jwtParser.parseClaimsJws(jwtToken).getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}