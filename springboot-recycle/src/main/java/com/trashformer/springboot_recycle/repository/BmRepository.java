package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.BmEntity; 

public interface BmRepository extends JpaRepository<BmEntity, Long> {
  
}
