package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.StepFormEntity;

public interface StepFormRepository extends JpaRepository <StepFormEntity, Long>{
    
}
