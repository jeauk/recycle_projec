package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.GwEntity; 

public interface GwRepository extends JpaRepository<GwEntity, Long> {
  
}
