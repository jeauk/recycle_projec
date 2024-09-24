package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.FreeBulletinBoardEntity;

public interface FreeBulletinBoardRepository extends JpaRepository <FreeBulletinBoardEntity, Long>{
    
}
