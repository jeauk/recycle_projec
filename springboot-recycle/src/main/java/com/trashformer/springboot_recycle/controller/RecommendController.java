package com.trashformer.springboot_recycle.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.RecommendEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import com.trashformer.springboot_recycle.repository.RecommendRepository;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;
import com.trashformer.springboot_recycle.service.JwtService;

@RestController
@CrossOrigin
public class RecommendController {

    @Autowired 
    private JwtService jwtService;

    @Autowired
    private RecommendRepository recommendRepository;

    @Autowired
    private ReformBoardRepository reformBoardRepository;

    @Autowired
    private KakaoUserRepository userRepository;

    @PostMapping("/api/posts/recommend/{id}")
public ResponseEntity<String> recommendPost(
    @RequestHeader("Authorization") String jwtToken, 
    @PathVariable Long id) {

    // JWT에서 이메일 추출
    String email = jwtService.extractEmailFromJwt(jwtToken);
    if (email == null) {
        return ResponseEntity.badRequest().body("유효하지 않은 JWT 토큰입니다.");
    }
    System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    System.out.println(id);

    // 게시물과 유저 정보 조회
    Optional<ReformBoardEntity> postOpt = reformBoardRepository.findById(id);
    KakaoUserEntity user = userRepository.findByEmail(email);

    if (postOpt.isEmpty() || user == null) {
        return ResponseEntity.status(404).body("게시글 또는 사용자를 찾을 수 없습니다.");
    }

    ReformBoardEntity post = postOpt.get();

    // 기존 추천 여부 확인
    Optional<RecommendEntity> recommendOpt = recommendRepository.findByReformBoardEntityIdAndUserEmail(id, email);

    if (recommendOpt.isPresent()) {
        // 이미 추천한 경우, 추천 취소 (추천 수 감소)
        recommendRepository.delete(recommendOpt.get());
        post.setRecommendCount(post.getRecommendCount() - 1);
    } else {
        // 추천하지 않은 경우, 새로운 추천 추가 (추천 수 증가)
        RecommendEntity recommend = new RecommendEntity();
        recommend.setReformBoardEntity(post);
        recommend.setUser(user);
        recommendRepository.save(recommend);
        post.setRecommendCount(post.getRecommendCount() + 1);
    }

    // 변경된 추천 수 저장
    reformBoardRepository.save(post);

    return ResponseEntity.ok("추천 상태가 변경되었습니다.");
}

}
