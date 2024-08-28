package com.trashformer.springboot_recycle.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;

@RestController
@CrossOrigin
public class ReformBoardController {

    @Autowired
    private ReformBoardRepository reformBoardRepository;

    @Autowired
    private KakaoUserRepository kakaoUserRepository;

    
    
    // 게시물 수정 (POST 방식)
    @PostMapping("/post/edit/{id}")
    public ResponseEntity<ReformBoardEntity> updateReformBoard(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        return reformBoardRepository.findById(id)
                .map(existingBoard -> {
                    String title = (String) request.get("title");
                    String content = (String) request.get("content");

                    existingBoard.setTitle(title);
                    existingBoard.setContent(content);

                    ReformBoardEntity updatedEntity = reformBoardRepository.save(existingBoard);
                    return ResponseEntity.ok(updatedEntity);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 모든 게시물을 반환하는 메서드
    @GetMapping("/list")
    public ResponseEntity<List<ReformBoardEntity>> findAllReformBoard() {
        List<ReformBoardEntity> reformBoards = reformBoardRepository.findAll();
        return ResponseEntity.ok(reformBoards);
    }
    // 특정 게시물을 ID로 찾는 메서드
    @GetMapping("/list/{id}")
    public ResponseEntity<ReformBoardEntity> findReformBoardById(@PathVariable Long id) {
        return reformBoardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!reformBoardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        reformBoardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    
}
