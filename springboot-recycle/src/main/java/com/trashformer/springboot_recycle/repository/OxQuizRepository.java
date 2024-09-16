package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.OXQuizEntity;

public interface OxQuizRepository extends JpaRepository <OXQuizEntity, Long>{
    
}
