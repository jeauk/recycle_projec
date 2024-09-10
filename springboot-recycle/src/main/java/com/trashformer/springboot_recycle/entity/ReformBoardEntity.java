package com.trashformer.springboot_recycle.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Entity(name = "ReformBoard")
@Data
public class ReformBoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String imagePath;
    private Long viewCount = 0L;
    private int recommendCount = 0;
    private String videoLink;


    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date createdAt; // 작성일, 날짜 형식만 저장

    private boolean updateChange;

    @ManyToOne
    private KakaoUserEntity kakaoUserEntity;

    @OneToMany(mappedBy = "reformBoardEntity", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<StepFormEntity> steps;
    
    
    @OneToMany(mappedBy = "reformBoardEntity", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<RecommendEntity> recommendations;
}
