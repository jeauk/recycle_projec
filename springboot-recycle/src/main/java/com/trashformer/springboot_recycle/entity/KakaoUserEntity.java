package com.trashformer.springboot_recycle.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
 
    @OneToMany(mappedBy = "kakaoUserEntity")
    private List<ReformBoardEntity> boards;
}
