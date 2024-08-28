package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.RecommendEntity;

public interface RecommendRepository extends JpaRepository <RecommendEntity ,Long>{
}
