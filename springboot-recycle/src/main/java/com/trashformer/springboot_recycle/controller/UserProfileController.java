package com.trashformer.springboot_recycle.controller; //전체추가

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.service.KakaoUserService;

@RestController
@RequestMapping("/user")
public class UserProfileController {

    @Autowired
    private KakaoUserService kakaoUserService;

    // 사용자 프로필 조회
    @GetMapping("/profile")
    public ResponseEntity<KakaoUserEntity> getUserProfile(@RequestParam String email) {
        KakaoUserEntity user = kakaoUserService.getUserProfile(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 사용자 프로필 업데이트
    @PostMapping("/profile/update")
    public ResponseEntity<KakaoUserEntity> updateUserProfile(
            @RequestParam String email,
            @RequestParam String nickname,
            @RequestParam(required = false) MultipartFile profileImageUrl) {
        try {
            KakaoUserEntity updatedUser = kakaoUserService.updateUserProfile(email, nickname, profileImageUrl);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}