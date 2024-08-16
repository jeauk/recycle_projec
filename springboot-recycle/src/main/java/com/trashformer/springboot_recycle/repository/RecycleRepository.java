package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.RecycleEntity;

public interface RecycleRepository extends JpaRepository<RecycleEntity, Integer>{
    
}
