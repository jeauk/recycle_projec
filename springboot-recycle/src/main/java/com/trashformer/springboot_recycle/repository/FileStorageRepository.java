package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.FileStorageEntity;

public interface FileStorageRepository extends JpaRepository <FileStorageEntity, Long>{
    
}
