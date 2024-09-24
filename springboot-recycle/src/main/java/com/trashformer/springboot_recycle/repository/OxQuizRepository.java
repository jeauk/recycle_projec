package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.OxQuizEntity;

public interface OxQuizRepository extends JpaRepository <OxQuizEntity, Long>{
    
}
