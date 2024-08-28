package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity(name = "ReformBoard")
@Data
public class ReformBoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String url;
    private Long viewcount;

    @ManyToOne
    private KakaoUserEntity kakaoUserEntity;
}
