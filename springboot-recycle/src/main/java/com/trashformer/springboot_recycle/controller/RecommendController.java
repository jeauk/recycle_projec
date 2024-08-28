package com.trashformer.springboot_recycle.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.RecommendEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.RecommendRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;

@RestController
@CrossOrigin
public class RecommendController {
    @Autowired
    private ReformBoardRepository reformBoardRepository;

    @Autowired
    private RecommendRepository recommendRepository;

    @PostMapping("/post/recommend/{id}")
    public ResponseEntity<RecommendEntity> recommendPost(@PathVariable Long id) {
        ReformBoardEntity reformBoard = reformBoardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    
        // 게시글 작성자의 이메일 가져오기
        String userEmail = reformBoard.getKakaoUserEntity().getEmail();
    
        // 사용자가 해당 게시글에 대해 이미 추천했는지 확인
        Optional<RecommendEntity> optionalRecommend = recommendRepository.findByReformBoardEntityAndUserEmail(reformBoard, userEmail);
    
        RecommendEntity recommend;
    
        if (optionalRecommend.isPresent()) {
            // 이미 추천한 경우 -> 추천 해제
            recommend = optionalRecommend.get();
            recommend.setRecommendCount(0);
            recommendRepository.delete(recommend); // 추천 해제 시 해당 추천 레코드를 삭제할 수도 있음
        } else {
            // 추천하지 않은 경우 -> 추천 추가
            recommend = new RecommendEntity();
            recommend.setReformBoardEntity(reformBoard);
            recommend.setUserEmail(userEmail);
            recommend.setRecommendCount(1);
            recommend = recommendRepository.save(recommend);
        }
    
        return ResponseEntity.ok(recommend);
    }
    
}