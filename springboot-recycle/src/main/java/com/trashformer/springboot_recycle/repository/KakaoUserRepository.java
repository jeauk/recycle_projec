package com.trashformer.springboot_recycle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;


public interface KakaoUserRepository extends JpaRepository <KakaoUserEntity, Long>{
    KakaoUserEntity findByEmail(String email);
}
