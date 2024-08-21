package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.ReformBoardEntity;

public interface ReformBoardRepository extends JpaRepository <ReformBoardEntity,Long>{
    
}
