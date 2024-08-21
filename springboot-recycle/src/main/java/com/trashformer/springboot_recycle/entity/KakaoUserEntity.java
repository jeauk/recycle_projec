package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity(name = "kakaoUser")
@Data
public class KakaoUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String nickname;
    private String email;
    private String profileImageUrl;
    
}
