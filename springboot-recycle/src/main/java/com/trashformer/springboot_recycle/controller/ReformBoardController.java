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

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    @Autowired
    private JwtService jwtService;

    @Autowired
    private StepFormRepository stepFormRepository;

    // 이미지 파일이 저장될 디렉토리 경로
    private final String UPLOAD_DIR = "C:\\uploads\\";

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
        if (steps != null && stepImages != null) {
            for (int i = 0; i < steps.size(); i++) {
                StepFormEntity stepForm = new StepFormEntity();
                stepForm.setStep(i + 1);
                stepForm.setStepContent(steps.get(i));
                stepForm.setReformBoardEntity(reformBoard);

                // 스텝 이미지 파일 저장
                if (i < stepImages.size() && stepImages.get(i) != null && !stepImages.get(i).isEmpty()) {
                    String stepImagePath = saveFile(stepImages.get(i));
                    if (stepImagePath != null) {
                        stepForm.setImgUrl(stepImagePath);
                    } else {
                        return ResponseEntity.status(500).body(Map.of("message", "스텝 이미지 저장 중 오류가 발생했습니다."));
                    }
                }

                stepFormRepository.save(stepForm); // 각 StepFormEntity 저장
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "게시물이 성공적으로 저장되었습니다.");
        return ResponseEntity.ok(response);
    }

    // 파일 저장 메소드 및 데이터베이스에 저장
    private String saveFile(MultipartFile file) {
        try {
            // 파일 이름 생성 (UUID 사용)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            // 파일 경로 설정
            String filePath = UPLOAD_DIR + fileName;

            // 파일 저장 디렉토리가 없으면 생성
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

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

            return filePath; // 저장된 파일 경로 반환
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

    @GetMapping("/api/posts/${id}")
    public ResponseEntity<ReformBoardEntity> postDetail(@PathVariable Long id) {
        // 데이터베이스에서 ID로 게시물 조회
        Optional<ReformBoardEntity> post = reformBoardRepository.findById(id);

        // 게시물이 존재하는지 확인
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        } else {
            // 게시물이 존재하지 않으면 404 상태 반환
            return ResponseEntity.status(404).body(null);
        }
    }
}