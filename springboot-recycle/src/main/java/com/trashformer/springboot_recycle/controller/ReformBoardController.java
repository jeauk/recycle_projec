package com.trashformer.springboot_recycle.controller;

import com.trashformer.springboot_recycle.dto.EditDto;
import com.trashformer.springboot_recycle.dto.PostRequest;
import com.trashformer.springboot_recycle.dto.StepDto;
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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
@Transactional
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

    private final Set<String> viewedIps = Collections.synchronizedSet(new HashSet<>());

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
public ResponseEntity<Map<String, Object>> getPosts(
    @RequestParam(defaultValue = "0") int page,   // 페이지 번호 (0부터 시작)
    @RequestParam(defaultValue = "12") int size,  // 한 페이지에 보여줄 게시물 수
    @RequestParam(required = false) String search // 검색어 (옵션)
) {
    // Pageable 객체 생성
    Pageable pageable = PageRequest.of(page-1, size);

    // 검색 조건이 있는 경우와 없는 경우 분기 처리
    Page<ReformBoardEntity> postPage;
    if (search != null && !search.trim().isEmpty()) {
        // 검색어가 있는 경우: 제목 또는 내용에 검색어가 포함된 게시물 조회
        postPage = reformBoardRepository.findByTitleContainingOrContentContaining(search, search, pageable);
    } else {
        // 검색어가 없는 경우: 전체 게시물 조회
        postPage = reformBoardRepository.findAll(pageable);
    }

    // 게시물 데이터를 담을 리스트 생성
    List<Map<String, Object>> postList = new ArrayList<>();
    for (ReformBoardEntity post : postPage.getContent()) {
        Map<String, Object> postMap = new HashMap<>();
        postMap.put("id", post.getId());
        postMap.put("title", post.getTitle());
        postMap.put("author", post.getKakaoUserEntity().getNickname()); // 작성자의 닉네임
        postMap.put("recommendCount", post.getRecommendCount());
        postMap.put("viewCount", post.getViewCount());
        postMap.put("imagePath", post.getImagePath());
        postMap.put("authorImg", post.getKakaoUserEntity().getProfileImageUrl());
        postMap.put("createAt", post.getCreatedAt());
        postMap.put("updateChange", post.isUpdateChange());

        postList.add(postMap);
    }

    // 응답에 페이징 정보와 게시물 데이터를 함께 전달
    Map<String, Object> response = new HashMap<>();
    response.put("posts", postList);                    // 게시물 리스트
    response.put("currentPage", postPage.getNumber());   // 현재 페이지 번호
    response.put("totalItems", postPage.getTotalElements());  // 전체 게시물 수
    response.put("totalPages", postPage.getTotalPages());     // 전체 페이지 수

    return ResponseEntity.ok(response);
}


   @GetMapping("/api/posts/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long id,
            HttpServletRequest request) {

        // 클라이언트의 IP 주소를 가져옵니다.
        String clientIp = request.getRemoteAddr();

        // 현재 게시물 ID로 게시물 조회
        Optional<ReformBoardEntity> postOpt = reformBoardRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "게시물을 찾을 수 없습니다."));
        }

        ReformBoardEntity post = postOpt.get();

        // IP 주소가 조회된 적이 없다면 조회수 증가
        String uniqueViewKey = id + "_" + clientIp;
        if (!viewedIps.contains(uniqueViewKey)) {
            viewedIps.add(uniqueViewKey);
            post.setViewCount(post.getViewCount() + 1);
            reformBoardRepository.save(post);
        }

         // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);

    // 현재 사용자가 작성자인지 확인
    boolean isAuthor = email != null && email.equals(post.getKakaoUserEntity().getEmail());

        // 결과 반환
        Map<String, Object> response = new HashMap<>();
        response.put("post", post);
        // 여기서 isAuthor는 사용자의 이메일 등을 바탕으로 추가 로직을 작성해야 함
        response.put("isAuthor", isAuthor); // 예시용으로 false로 설정

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/posts/{id}")
    public ResponseEntity<Map<String, String>> deletePost(
    @RequestHeader("Authorization") String jwtToken,
    @PathVariable Long id) {

    // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);
    if (email == null) {
        return ResponseEntity.status(400).body(Map.of("message", "유효하지 않은 JWT 토큰입니다."));
    }

    // 게시물 조회
    Optional<ReformBoardEntity> postOpt = reformBoardRepository.findById(id);
    if (postOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("message", "게시물을 찾을 수 없습니다."));
    }

    ReformBoardEntity post = postOpt.get();

    // 작성자인지 확인
    if (!post.getKakaoUserEntity().getEmail().equals(email)) {
        return ResponseEntity.status(403).body(Map.of("message", "삭제 권한이 없습니다."));
    }

    // 연관된 StepFormEntity 삭제
    stepFormRepository.deleteAll(post.getSteps());

    // 게시물 삭제
    reformBoardRepository.delete(post);

    return ResponseEntity.ok(Map.of("message", "게시물이 성공적으로 삭제되었습니다."));
}

    @GetMapping("/edit/posts/{id}")
    public ResponseEntity<Map<String, Object>> getPostForEditById(  // 메소드 이름 변경
        @RequestHeader("Authorization") String jwtToken,
        @PathVariable Long id) {

        // JWT에서 이메일 추출
        String email = jwtService.extractEmailFromJwt(jwtToken);

        // 현재 게시물 ID로 게시물 조회
        Optional<ReformBoardEntity> post = reformBoardRepository.findById(id);
        if (post.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "게시물을 찾을 수 없습니다."));
        }
        // 게시물 반환
        return ResponseEntity.ok(Map.of("post", post.get()));
}

@PostMapping("/edit/posts/{id}")
public ResponseEntity<String> editPost(
    @ModelAttribute EditDto editDto,
    @RequestHeader("Authorization") String jwtToken,
    @PathVariable Long id) {

    // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);
    if (email == null) {
        return ResponseEntity.badRequest().body("유효하지 않은 JWT 토큰입니다.");
    }

    // 이메일과 게시물 ID로 게시물 조회
    Optional<ReformBoardEntity> postOpt = reformBoardRepository.findByKakaoUserEntityEmailAndId(email, id);
    if (postOpt.isEmpty()) {
        return ResponseEntity.status(404).body("게시물을 찾을 수 없습니다.");
    }
    ReformBoardEntity post = postOpt.get();

    // 제목과 내용 업데이트
    post.setTitle(editDto.getTitle());
    post.setContent(editDto.getContent());

    // 메인 이미지 업데이트
    MultipartFile imageFile = editDto.getImageFile();
    if (imageFile != null && !imageFile.isEmpty()) {
        // 기존 이미지 삭제
        if (post.getImagePath() != null) {
            deleteFile(post.getImagePath());
        }

        // 새 이미지 저장
        String imagePath = saveFile(imageFile);  // 이미지 저장 메서드 호출
        if (imagePath != null) {
            post.setImagePath(imagePath);  // 경로를 DB에 저장
        } else {
            return ResponseEntity.status(500).body("이미지 저장 중 오류가 발생했습니다.");
        }
    }

    // 스텝 내용과 이미지 업데이트
    List<StepDto> steps = editDto.getSteps();
    if (steps != null) {
        for (int i = 0; i < steps.size(); i++) {
            StepFormEntity stepForm = post.getSteps().get(i);
            stepForm.setStepContent(steps.get(i).getStepContent());

            MultipartFile stepImageFile = steps.get(i).getStepImage();
            if (stepImageFile != null && !stepImageFile.isEmpty()) {
                // 기존 스텝 이미지 삭제
                if (stepForm.getImgUrl() != null) {
                    deleteFile(stepForm.getImgUrl());
                }

                // 새 스텝 이미지 저장
                String stepImagePath = saveFile(stepImageFile);  // 스텝 이미지 저장 메서드 호출
                if (stepImagePath != null) {
                    stepForm.setImgUrl(stepImagePath);  // 경로를 DB에 저장
                } else {
                    return ResponseEntity.status(500).body("스텝 이미지 저장 중 오류가 발생했습니다.");
                }
            }

            // 스텝 저장
            stepFormRepository.save(stepForm);
        }
    }

    // 게시물 저장
    post.setUpdateChange(true);
    reformBoardRepository.save(post);

    return ResponseEntity.ok("게시물이 성공적으로 수정되었습니다.");
}

private void deleteFile(String filePath) {
    try {
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}


}
