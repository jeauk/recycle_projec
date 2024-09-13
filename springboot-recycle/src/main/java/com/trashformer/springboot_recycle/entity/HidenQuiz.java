package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class HidenQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 퀴즈 고유 ID
    private String name;  // 이미지 이름
    private String coordinate;  // 이미지 좌표 (JSON 형식으로 저장)
    
}
