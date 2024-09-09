package com.trashformer.springboot_recycle.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.RecommendEntity;

public interface RecommendRepository extends JpaRepository <RecommendEntity ,Long>{
    Optional<RecommendEntity> findByReformBoardEntityIdAndUserEmail(Long reformBoardId, String email);
    long countByReformBoardEntityId(Long reformBoardId);
    
    List<RecommendEntity> findByUser(KakaoUserEntity user);
    Page<RecommendEntity> findByUser(KakaoUserEntity user, Pageable pageable);
    
}
