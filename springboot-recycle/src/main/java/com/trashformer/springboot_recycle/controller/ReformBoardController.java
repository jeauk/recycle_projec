package com.trashformer.springboot_recycle.controller;

import com.trashformer.springboot_recycle.dto.PostRequest;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.FileStorageRepository;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;
import com.trashformer.springboot_recycle.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        @ModelAttribute PostRequest request,
        @RequestHeader("Authorization") String jwtToken) {

        // JWT 토큰 출력
        System.out.println("JWT Token: " + jwtToken);

        // 데이터 출력
        System.out.println("Title: " + request.getTitle());
        System.out.println("Content: " + request.getContent());
        System.out.println("Video Link: " + request.getVideoLink());
        // 메인 이미지 파일 이름 출력
        MultipartFile image = request.getImage();
        if (image != null) {
            System.out.println("Main Image: " + image.getOriginalFilename());
        }
        // steps 내용 및 step 이미지 출력
        List<String> steps = request.getSteps();
        List<MultipartFile> stepImages = request.getStepImages();
        if (steps != null) {
            for (int i = 0; i < steps.size(); i++) {
                System.out.println("Step " + (i + 1) + " Content: " + steps.get(i));
                if (stepImages != null && i < stepImages.size()) {
                    System.out.println("Step " + (i + 1) + " Image: " + stepImages.get(i).getOriginalFilename());
                }
            }
        }



        Map<String, Object> response = new HashMap<>();
        response.put("message", "게시물이 성공적으로 처리되었습니다.");
        return ResponseEntity.ok(response);
    }


    
    
    


    // @PostMapping("/api/posts")
    // public ResponseEntity<Map<String, Object>> post(
    //         @RequestParam("title") String title,
    //         @RequestParam("content") String content,
    //         @RequestPart(value = "image", required = false) MultipartFile image,
    //         @RequestHeader("Authorization") String jwtToken) {

    //     System.out.println("JWT Token Received: " + jwtToken);

    //     // JWT에서 사용자 정보 추출
    //     String token = jwtToken.replace("Bearer ", "");
    //     System.out.println("Parsed Token: " + token);

    //     Claims claims = Jwts.parserBuilder()
    //             .setSigningKey(DatatypeConverter.parseBase64Binary("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr"))
    //             .build()
    //             .parseClaimsJws(token)
    //             .getBody();

    //     String email = (String) claims.get("email");
    //     System.out.println("Email extracted from JWT: " + email);

    //     // 사용자 정보로 KakaoUserEntity 찾기
    //     KakaoUserEntity kakaoUserEntity = kakaoUserRepository.findByEmail(email);

    //     if (kakaoUserEntity == null) {
    //         System.out.println("User not found for email: " + email);
    //         Map<String, Object> response = new HashMap<>();
    //         response.put("error", "사용자를 찾을 수 없습니다.");
    //         return ResponseEntity.badRequest().body(response);
    //     }

    //     System.out.println("User found: " + kakaoUserEntity.getId());

    //     // 이미지 저장 로직 및 FileStorageEntity 생성
    //     FileStorageEntity fileStorageEntity = null;
    //     if (image != null && !image.isEmpty()) {
    //         try {
    //             String uploadDir = "C:/uploads/";
    //             Files.createDirectories(Paths.get(uploadDir));

    //             String uuidFileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
    //             String imagePath = uploadDir + uuidFileName;

    //             Files.copy(image.getInputStream(), Paths.get(imagePath), StandardCopyOption.REPLACE_EXISTING);
    //             System.out.println("Image saved at: " + imagePath);

    //             fileStorageEntity = new FileStorageEntity();
    //             fileStorageEntity.setOriginalFileName(image.getOriginalFilename());
    //             fileStorageEntity.setUuidFileName(uuidFileName);
    //             fileStorageEntity.setFilePath(imagePath);
    //             fileStorageEntity.setFileType(image.getContentType());
    //             fileStorageEntity.setFileSize(image.getSize());

    //             fileStorageEntity = fileStorageRepository.save(fileStorageEntity);
    //             System.out.println("FileStorageEntity saved with ID: " + fileStorageEntity.getId());

    //         } catch (IOException e) {
    //             e.printStackTrace();
    //             Map<String, Object> response = new HashMap<>();
    //             response.put("error", "이미지 저장 중 오류가 발생했습니다.");
    //             return ResponseEntity.status(500).body(response);
    //         }
    //     }

    //     ReformBoardEntity post = new ReformBoardEntity();
    //     post.setTitle(title);
    //     post.setContent(content);
    //     post.setKakaoUserEntity(kakaoUserEntity);

    //     if (fileStorageEntity != null) {
    //         post.setImagePath(fileStorageEntity.getFilePath());
    //     }

    //     System.out.println("ReformBoardEntity to save: " + post);

    //     ReformBoardEntity savedPost = reformBoardRepository.save(post);
    //     System.out.println("Post saved with ID: " + savedPost.getId());

    //     Map<String, Object> response = new HashMap<>();
    //     response.put("message", "게시물이 성공적으로 저장되었습니다.");
    //     response.put("postId", savedPost.getId());
    //     if (fileStorageEntity != null) {
    //         response.put("fileId", fileStorageEntity.getId());
    //     }

    //     return ResponseEntity.ok(response);
    // }


    @GetMapping("/api/postlist")
    public List<Map<String, Object>> getPosts() {
        // ReformBoardEntity 리스트를 가져옵니다.
        List<ReformBoardEntity> posts = reformBoardRepository.findAll();

        // 응답을 위한 리스트 생성
        List<Map<String, Object>> response = new ArrayList<>();

        for (ReformBoardEntity post : posts) {
            // 각 게시물에 대해 제목과 작성자의 닉네임을 추출
            Map<String, Object> postMap = new HashMap<>();
            postMap.put("title", post.getTitle());
            postMap.put("author", post.getKakaoUserEntity().getNickname()); // 작성자의 닉네임을 포함
            
            // 각 게시물 정보 출력
            System.out.println("Post Title: " + post.getTitle() + ", Author: " + post.getKakaoUserEntity().getNickname());

            // 응답 리스트에 추가
            response.add(postMap);
        }

        // 응답 반환
        return response;
    }

}

