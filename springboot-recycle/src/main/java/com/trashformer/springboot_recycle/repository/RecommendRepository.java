package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.RecommendEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;

@Repository
public interface RecommendRepository extends JpaRepository<RecommendEntity, Long> {
    // 사용자와 게시글을 기준으로 추천을 찾는 메서드
    RecommendEntity findByKakaoUserEntityAndReformBoardEntity(KakaoUserEntity kakaoUserEntity, ReformBoardEntity reformBoardEntity);

    // 특정 게시글의 추천 수를 계산하는 메서드
    int countByReformBoardEntity(ReformBoardEntity reformBoardEntity);
}
