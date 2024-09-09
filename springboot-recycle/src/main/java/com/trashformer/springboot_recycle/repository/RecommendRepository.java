package com.trashformer.springboot_recycle.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.RecommendEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;

public interface RecommendRepository extends JpaRepository <RecommendEntity ,Long>{
    Optional<RecommendEntity> findByReformBoardEntityIdAndUserEmail(Long reformBoardId, String email);
    long countByReformBoardEntityId(Long reformBoardId);
    List<RecommendEntity> findByUser(KakaoUserEntity user);
}
