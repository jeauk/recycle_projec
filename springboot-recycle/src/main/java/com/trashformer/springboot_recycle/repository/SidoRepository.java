package com.trashformer.springboot_recycle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.SidoEntity;

public interface SidoRepository extends JpaRepository<SidoEntity, Long> {
  List<SidoEntity> findBySidoAndGungoo(String sido, String gungoo);
}
