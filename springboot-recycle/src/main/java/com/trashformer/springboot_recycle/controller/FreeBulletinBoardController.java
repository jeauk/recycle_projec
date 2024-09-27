package com.trashformer.springboot_recycle.controller;

import com.trashformer.springboot_recycle.dto.FreePostDto;
import com.trashformer.springboot_recycle.entity.FreeBulletinBoardEntity;
import com.trashformer.springboot_recycle.repository.FreeBulletinBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@CrossOrigin
@RestController
public class FreeBulletinBoardController {

    @Autowired
    private FreeBulletinBoardRepository freeBulletinBoardRepository;

    private final String UPLOAD_DIR = "src/main/resources/static/uploads/freeBoard/";

    @PostMapping("/freeBoard/post")
    public ResponseEntity<String> postFreeBoard(@ModelAttribute FreePostDto freePostDto) throws IOException {
        // 게시물 엔티티 생성
        FreeBulletinBoardEntity post = new FreeBulletinBoardEntity();
        post.setTitle(freePostDto.getTitle());
        post.setContent(freePostDto.getContent());
        post.setNickname(freePostDto.getNickname());
        post.setPassword(freePostDto.getPassword());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        // 이미지 파일 처리
        MultipartFile image = freePostDto.getImage();
        if (image != null && !image.isEmpty()) {
            String savedFileName = saveImage(image);
            post.setImageUrl("/uploads/freeBoard/" + savedFileName);
        }

        // 게시물 저장
        freeBulletinBoardRepository.save(post);

        return ResponseEntity.ok("게시물이 성공적으로 등록되었습니다.");
    }

    private String saveImage(MultipartFile image) throws IOException {
        String originalFileName = image.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + fileExtension;

        String projectRootPath = System.getProperty("user.dir");
        Path uploadPath = Paths.get(projectRootPath, UPLOAD_DIR);
        File directory = new File(uploadPath.toString());
        if (!directory.exists()) {
            directory.mkdirs();
        }

        File destinationFile = new File(uploadPath.resolve(savedFileName).toString());
        image.transferTo(destinationFile);

        return savedFileName;
    }

    @GetMapping("/freeBoard/posts")
    public List<FreeBulletinBoardEntity> getAllPosts() {
        return freeBulletinBoardRepository.findAll();
    }

    @GetMapping("/freeBoard/post/{id}")
    public ResponseEntity<FreeBulletinBoardEntity> getPostById(@PathVariable Long id) {
        FreeBulletinBoardEntity post = freeBulletinBoardRepository.findById(id).orElse(null);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        // 여기서 post 객체를 로그로 확인해보세요.
        System.out.println(post); // 로그 확인
        return ResponseEntity.ok(post);
    }
}
