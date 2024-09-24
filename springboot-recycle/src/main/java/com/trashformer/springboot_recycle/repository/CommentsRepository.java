package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.CommentsEntity;

public interface CommentsRepository extends JpaRepository <CommentsEntity, Long>{
    
}
