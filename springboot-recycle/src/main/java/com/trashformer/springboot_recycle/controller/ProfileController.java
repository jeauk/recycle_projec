package com.trashformer.springboot_recycle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
public class ProfileController {

    @Autowired
    private KakaoUserRepository userRepository;

    @PostMapping("/api/save-user")
    public ResponseEntity<Map<String, Object>> saveUser(@RequestBody KakaoUserEntity user) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 사용자 정보를 데이터베이스에 저장
            KakaoUserEntity existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser == null) {
                KakaoUserEntity savedUser = userRepository.save(user);
                response.put("status", "success");
                response.put("message", "Sign up successful");
                response.put("user", savedUser);
            } else {
                // 기존 사용자에 대한 정보가 이미 존재하므로 데이터 저장은 하지 않지만 로그인은 성공으로 처리
                response.put("status", "success");
                response.put("message", "Login successful.");
                response.put("user", existingUser);
            }
            return ResponseEntity.ok(response); // HTTP 200 OK
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "사용자 정보를 저장하는 데 실패했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // HTTP 500 Internal Server Error
        }
    }
}