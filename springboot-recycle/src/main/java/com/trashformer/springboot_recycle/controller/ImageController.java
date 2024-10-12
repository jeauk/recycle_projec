package com.trashformer.springboot_recycle.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin
@RestController
public class ImageController {

    // 이미지가 저장된 기본 디렉토리 경로
    private final String BASE_DIR = "src/main/resources/static/uploads/reformBoard/";
    
    // 프로필 이미지가 저장된 디렉토리 경로
    private final String PROFILE_DIR = "src/main/resources/static/uploads/profiles/";

    private final String recycleMainDir = "classes/static/image/recycleMain/";

    

    @GetMapping("/image/{date}/{filename}")
    public ResponseEntity<Resource> showImage(@PathVariable String date, @PathVariable String filename) throws MalformedURLException {
        // 요청된 이미지 파일 경로를 생성
        Path filePath = Paths.get(BASE_DIR, date, filename);
        File file = filePath.toFile();

        // 파일이 존재하는지 확인
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        // 파일 리소스를 URL 형식으로 로드
        Resource resource = new UrlResource(filePath.toUri());

        // 파일의 이름을 Content-Disposition 헤더에 설정하여 브라우저가 다운로드하거나 표시할 수 있게 함
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header(HttpHeaders.CONTENT_TYPE, "image/jpeg") // 또는 적절한 이미지 MIME 타입 (예: image/png)
                .body(resource);
    }

    @GetMapping("/image/profiles/{email}/{filename}")
public ResponseEntity<Resource> showProfileImage(
        @PathVariable String email,
        @PathVariable String filename) throws MalformedURLException {

    // 이메일 폴더 경로와 파일명을 결합하여 파일 경로 생성
    File file = new File(PROFILE_DIR + email + "/" + filename);

    if (!file.exists()) {
        return ResponseEntity.notFound().build();
    }

    Resource resource = new UrlResource("file:" + file.getAbsolutePath());

    // 파일 확장자에서 MIME 타입 간단하게 설정
    String contentType = "image/" + filename.substring(filename.lastIndexOf(".") + 1);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
            .header(HttpHeaders.CONTENT_TYPE, contentType)
            .body(resource);
}

@GetMapping("/image/recycleMain/{filename}")
public ResponseEntity<Resource> showRecycleMainImage(@PathVariable String filename) throws MalformedURLException {

    // 파일 경로를 생성
    File file = new File(recycleMainDir + filename);

    // 파일이 존재하는지 확인
    if (!file.exists()) {
        return ResponseEntity.notFound().build();
    }

    // 파일 리소스를 URL 형식으로 로드
    Resource resource = new UrlResource("file:" + file.getAbsolutePath());

    // 파일 확장자에서 MIME 타입을 설정
    String contentType = "image/" + filename.substring(filename.lastIndexOf(".") + 1);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
            .header(HttpHeaders.CONTENT_TYPE, contentType)
            .body(resource);
}
}
