package com.trashformer.springboot_recycle.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class RecommendEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
    
        @ManyToOne
        @JoinColumn(name = "reform_board_id", nullable = false)
        private ReformBoardEntity reformBoardEntity;  // 게시글과의 관계
    
        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private KakaoUserEntity user;  // 사용자와의 관계
    }
    