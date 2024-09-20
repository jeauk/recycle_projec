package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "MainRecycle")
public class MainRecycleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mrName;
    private String mrTag;
    private String mrUm;
    private String mrCategory;
    private String imgUrl;
    @Column(length = 2000)
    private String mrContent;

}
