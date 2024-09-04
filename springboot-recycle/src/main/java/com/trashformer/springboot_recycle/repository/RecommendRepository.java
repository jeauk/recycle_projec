package com.trashformer.springboot_recycle.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.RecommendEntity;

public interface RecommendRepository extends JpaRepository <RecommendEntity ,Long>{
    Optional<RecommendEntity> findByReformBoardEntityIdAndUserEmail(Long reformBoardId, String email);
    long countByReformBoardEntityId(Long reformBoardId);
}
