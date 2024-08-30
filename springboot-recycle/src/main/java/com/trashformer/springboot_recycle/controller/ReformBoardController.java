package com.trashformer.springboot_recycle.controller;

import com.trashformer.springboot_recycle.dto.PostRequest;
import com.trashformer.springboot_recycle.entity.FileStorageEntity;
import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.entity.StepFormEntity;
import com.trashformer.springboot_recycle.repository.FileStorageRepository;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;
import com.trashformer.springboot_recycle.repository.StepFormRepository;
import com.trashformer.springboot_recycle.service.JwtService;
import com.trashformer.springboot_recycle.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;

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

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StepFormRepository stepFormRepository;

    // Base URL for accessing images
    private final String BASE_URL = "http://localhost:8080/image/";

    // 이미지 파일이 저장될 기본 디렉토리 경로
    private final String UPLOAD_DIR = "src/main/resources/static/uploads/reformBoard/";

    @PostMapping("/api/posts")
    public ResponseEntity<Map<String, Object>> post(
        @ModelAttribute PostRequest request,
        @RequestHeader("Authorization") String jwtToken) {

        // JWT 토큰 출력 및 이메일 추출
        System.out.println("JWT Token: " + jwtToken);
        String userEmail = jwtService.extractEmailFromJwt(jwtToken);
        if (userEmail == null) {
            return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
        }
        System.out.println("Extracted Email: " + userEmail);

        // 이메일로 사용자 조회
        KakaoUserEntity user = kakaoUserRepository.findByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        // ReformBoardEntity 객체 생성 및 데이터 설정
        ReformBoardEntity reformBoard = new ReformBoardEntity();
        reformBoard.setTitle(request.getTitle());
        reformBoard.setVideoLink(request.getVideoLink());
        reformBoard.setContent(request.getContent());
        reformBoard.setKakaoUserEntity(user);

        // 메인 이미지 파일 저장
        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            String imagePath = saveFile(image);
            if (imagePath != null) {
                reformBoard.setImagePath(imagePath);
            } else {
                return ResponseEntity.status(500).body(Map.of("message", "이미지 저장 중 오류가 발생했습니다."));
            }
        }

        // ReformBoardEntity 저장
        reformBoardRepository.save(reformBoard);

        // StepFormEntity 저장
        List<String> steps = request.getSteps();
        List<MultipartFile> stepImages = request.getStepImages();
        if (steps != null) {
            for (int i = 0; i < steps.size(); i++) {
                StepFormEntity stepForm = new StepFormEntity();
                stepForm.setStep(i + 1);
                stepForm.setStepContent(steps.get(i));
                stepForm.setReformBoardEntity(reformBoard);

                // 스텝 이미지 파일 저장
                if (stepImages != null && i < stepImages.size() && stepImages.get(i) != null && !stepImages.get(i).isEmpty()) {
                    String stepImagePath = saveFile(stepImages.get(i));
                    if (stepImagePath != null) {
                        stepForm.setImgUrl(stepImagePath);
                    } else {
                        return ResponseEntity.status(500).body(Map.of("message", "스텝 이미지 저장 중 오류가 발생했습니다."));
                    }
                }

                // 스텝 내용이 있으면 저장
                if (stepForm.getStepContent() != null && !stepForm.getStepContent().isEmpty()) {
                    stepFormRepository.save(stepForm); // 각 StepFormEntity 저장
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "게시물이 성공적으로 저장되었습니다.");
        return ResponseEntity.ok(response);
    }

    // 파일 저장 메소드 및 데이터베이스에 저장
    private String saveFile(MultipartFile file) {
        try {
            // 날짜별 폴더 생성
            String dateFolder = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            String directoryPath = UPLOAD_DIR + dateFolder;
            File directory = new File(directoryPath);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 파일 이름 생성 (UUID 사용)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            String filePath = directoryPath + "/" + fileName;

            // 파일 저장
            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path);

            // FileStorageEntity 생성 및 데이터베이스에 저장
            FileStorageEntity fileStorageEntity = new FileStorageEntity();
            fileStorageEntity.setOriginalFileName(file.getOriginalFilename());
            fileStorageEntity.setUuidFileName(fileName);
            fileStorageEntity.setFilePath(filePath);
            fileStorageEntity.setFileType(file.getContentType());
            fileStorageEntity.setFileSize(file.getSize());

            fileStorageRepository.save(fileStorageEntity);

            // URL 경로 반환
            return BASE_URL + dateFolder + "/" + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/api/postlist")
    public List<Map<String, Object>> getPosts() {
        // ReformBoardEntity 리스트를 가져옵니다.
        List<ReformBoardEntity> posts = reformBoardRepository.findAll();

        // 응답을 위한 리스트 생성
        List<Map<String, Object>> response = new ArrayList<>();

        for (ReformBoardEntity post : posts) {
            // 각 게시물에 대해 제목과 작성자의 닉네임을 추출
            Map<String, Object> postMap = new HashMap<>();
            postMap.put("id", post.getId());
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

    @GetMapping("/api/posts/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(
        @RequestHeader("Authorization") String jwtToken,    
        @PathVariable Long id) {
        
        // JWT에서 이메일 추출
        String email = jwtService.extractEmailFromJwt(jwtToken);

        // 현재 게시물 ID로 게시물 조회
        Optional<ReformBoardEntity> post = reformBoardRepository.findById(id);
        if (post.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "게시물을 찾을 수 없습니다."));
        }

        // 이메일로 사용자가 작성한 게시물들 조회
        List<ReformBoardEntity> userPosts = reformBoardRepository.findAllByKakaoUserEntityEmail(email);

        // 사용자가 작성한 게시물 중에 현재 게시물과 동일한 ID가 있는지 확인
        boolean isAuthor = userPosts.stream().anyMatch(userPost -> userPost.getId().equals(id));

        // 결과에 isAuthor 추가
        Map<String, Object> response = new HashMap<>();
        response.put("post", post.get());
        response.put("isAuthor", isAuthor);

        return ResponseEntity.ok(response);
    }
}
