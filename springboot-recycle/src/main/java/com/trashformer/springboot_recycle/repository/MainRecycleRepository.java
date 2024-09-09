package com.trashformer.springboot_recycle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.MainRecycleEntity;

public interface MainRecycleRepository extends JpaRepository<MainRecycleEntity, Long> {
    MainRecycleEntity findById(long id);
    List<MainRecycleEntity> findByMrTagContainingIgnoreCase(String mrTag);
}
