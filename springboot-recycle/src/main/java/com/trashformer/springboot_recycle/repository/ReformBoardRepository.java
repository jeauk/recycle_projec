package com.trashformer.springboot_recycle.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;

public interface ReformBoardRepository extends JpaRepository<ReformBoardEntity, Long> {
    List<ReformBoardEntity> findAllByKakaoUserEntityEmail(String email);
    List<ReformBoardEntity> findByKakaoUserEntity(KakaoUserEntity user);
    List<ReformBoardEntity> findTop5ByOrderByRecommendCountDesc();
    Optional<ReformBoardEntity> findByKakaoUserEntityEmailAndId(String email, Long id);
    
    // 페이징 메소드들
    Page<ReformBoardEntity> findAll(Pageable pageable);
    Page<ReformBoardEntity> findByTitleContaining(String title, Pageable pageable);
    Page<ReformBoardEntity> findByKakaoUserEntity(KakaoUserEntity user, Pageable pageable);
    Page<ReformBoardEntity> findByKakaoUserEntityNicknameContaining(String nickname, Pageable pageable);
    Page<ReformBoardEntity> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
    
}
