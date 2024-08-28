package com.trashformer.springboot_recycle.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.RecommendEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;

public interface RecommendRepository extends JpaRepository <RecommendEntity ,Long>{
    Optional<RecommendEntity> findByReformBoardEntityAndUserEmail(ReformBoardEntity reformBoardEntity, String userEmail);
}
