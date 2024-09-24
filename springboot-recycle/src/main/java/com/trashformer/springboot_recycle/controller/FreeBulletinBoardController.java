package com.trashformer.springboot_recycle.controller;

import com.trashformer.springboot_recycle.dto.FreePostDto;
import com.trashformer.springboot_recycle.entity.FreeBulletinBoardEntity;
import com.trashformer.springboot_recycle.repository.FreeBulletinBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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

    // 이미지 저장 기본 디렉토리 (프로젝트 루트 기준 상대 경로)
    private final String UPLOAD_DIR = "src/main/resources/static/uploads/freeBoard/";

    @PostMapping("/freeBoard/post")
    public String postFreeBoard(
        @ModelAttribute FreePostDto freePostDto
    ) throws IOException {
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
            String savedFileName = saveImage(image);  // 이미지 저장 로직 호출
            post.setImageUrl("/uploads/freeBoard/" + savedFileName);  // 이미지 경로 저장
        }

        // 게시물 저장
        freeBulletinBoardRepository.save(post);

        return "게시물이 성공적으로 등록되었습니다.";
    }

    // 이미지 저장 로직
    private String saveImage(MultipartFile image) throws IOException {
        // 파일 이름 생성 (UUID 사용)
        String originalFileName = image.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String savedFileName = UUID.randomUUID().toString() + fileExtension;

        // 실행 경로 (프로젝트 루트 기준 상대 경로로 설정)
        String projectRootPath = System.getProperty("user.dir");
        Path uploadPath = Paths.get(projectRootPath, UPLOAD_DIR);
        File directory = new File(uploadPath.toString());
        if (!directory.exists()) {
            directory.mkdirs();  // 디렉토리가 없으면 생성
        }

        // 저장 경로에 파일 저장
        File destinationFile = new File(uploadPath.resolve(savedFileName).toString());
        image.transferTo(destinationFile);

        return savedFileName;  // 저장된 파일 이름 반환
    }
}
