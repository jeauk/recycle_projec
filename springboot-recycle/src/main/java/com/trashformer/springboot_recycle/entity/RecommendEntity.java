package com.trashformer.springboot_recycle.entity;

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

        private String userEmail;
        private int recommendCount; // 추천 수를 저장하는 필드
    
        @ManyToOne
        @JoinColumn(name = "reform_board_id", nullable = false)
        private ReformBoardEntity reformBoardEntity; // 게시글과의 관계

}
    