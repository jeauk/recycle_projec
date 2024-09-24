package com.trashformer.springboot_recycle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.service.ContactService;
import com.trashformer.springboot_recycle.service.JwtService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @Autowired
    JwtService jwtService;

    @Autowired
    KakaoUserRepository kakaoUserRepository;

    @PostMapping("/contact/post")
    public ResponseEntity<String> sendEmail(
            @RequestParam("name") String name,
            @RequestParam("replyTo") String replyTo,
            @RequestParam("subject") String subject,
            @RequestParam("text") String text,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {

        try {

            // 파일 개수 제한 (최대 5개)
            if (images != null && images.length > 5) {
                throw new IllegalArgumentException("최대 5개의 파일만 첨부할 수 있습니다.");
            }

            // 이메일 전송 로직
            contactService.sendSimpleMessage(
                    replyTo,
                    name,
                    subject,
                    text,
                    images);
            return ResponseEntity.ok("문의가 접수되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("이메일 전송 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/contact/nickname")
    public ResponseEntity<String> profileLoader(@RequestHeader("Authorization") String jwt) {

        // JWT에서 이메일 추출
        String email = jwtService.extractEmailFromJwt(jwt);
        if (email == null) {
            return ResponseEntity.status(400).body("유효하지 않은 JWT 토큰입니다.");
        }

        // 이메일로 사용자 조회
        KakaoUserEntity user = kakaoUserRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }

        // 닉네임 반환
        return ResponseEntity.ok(user.getNickname());
    }
}