package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.SidoEntity;

public interface SidoRepository extends JpaRepository<SidoEntity, Long> {
  
}
