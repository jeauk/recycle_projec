package com.trashformer.springboot_recycle.controller;

import com.trashformer.springboot_recycle.entity.FileStorageEntity;
import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.FileStorageRepository;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;
import com.trashformer.springboot_recycle.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin
public class ReformBoardController {

    @Autowired
    private ReformBoardRepository reformBoardRepository;

    @Autowired
    private KakaoUserRepository kakaoUserRepository;

    @Autowired
    private FileStorageRepository fileStorageRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/api/posts")
    public ResponseEntity<Map<String, Object>> post(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestHeader("Authorization") String jwtToken) {

        System.out.println("JWT Token Received: " + jwtToken);

        // JWT에서 사용자 정보 추출
        String token = jwtToken.replace("Bearer ", "");
        System.out.println("Parsed Token: " + token);

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(DatatypeConverter.parseBase64Binary("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr"))
                .build()
                .parseClaimsJws(token)
                .getBody();

        String email = (String) claims.get("email");
        System.out.println("Email extracted from JWT: " + email);

        // 사용자 정보로 KakaoUserEntity 찾기
        KakaoUserEntity kakaoUserEntity = kakaoUserRepository.findByEmail(email);

        if (kakaoUserEntity == null) {
            System.out.println("User not found for email: " + email);
            Map<String, Object> response = new HashMap<>();
            response.put("error", "사용자를 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        System.out.println("User found: " + kakaoUserEntity.getId());

        // 이미지 저장 로직 및 FileStorageEntity 생성
        FileStorageEntity fileStorageEntity = null;
        if (image != null && !image.isEmpty()) {
            try {
                String uploadDir = "C:/uploads/";
                Files.createDirectories(Paths.get(uploadDir));

                String uuidFileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                String imagePath = uploadDir + uuidFileName;

                Files.copy(image.getInputStream(), Paths.get(imagePath), StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Image saved at: " + imagePath);

                fileStorageEntity = new FileStorageEntity();
                fileStorageEntity.setOriginalFileName(image.getOriginalFilename());
                fileStorageEntity.setUuidFileName(uuidFileName);
                fileStorageEntity.setFilePath(imagePath);
                fileStorageEntity.setFileType(image.getContentType());
                fileStorageEntity.setFileSize(image.getSize());

                fileStorageEntity = fileStorageRepository.save(fileStorageEntity);
                System.out.println("FileStorageEntity saved with ID: " + fileStorageEntity.getId());

            } catch (IOException e) {
                e.printStackTrace();
                Map<String, Object> response = new HashMap<>();
                response.put("error", "이미지 저장 중 오류가 발생했습니다.");
                return ResponseEntity.status(500).body(response);
            }
        }

        ReformBoardEntity post = new ReformBoardEntity();
        post.setTitle(title);
        post.setContent(content);
        post.setKakaoUserEntity(kakaoUserEntity);

        if (fileStorageEntity != null) {
            post.setImagePath(fileStorageEntity.getFilePath());
        }

        System.out.println("ReformBoardEntity to save: " + post);

        ReformBoardEntity savedPost = reformBoardRepository.save(post);
        System.out.println("Post saved with ID: " + savedPost.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "게시물이 성공적으로 저장되었습니다.");
        response.put("postId", savedPost.getId());
        if (fileStorageEntity != null) {
            response.put("fileId", fileStorageEntity.getId());
        }

        return ResponseEntity.ok(response);
    }
}
