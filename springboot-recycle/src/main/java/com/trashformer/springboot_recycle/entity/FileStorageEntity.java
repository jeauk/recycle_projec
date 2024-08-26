package com.trashformer.springboot_recycle.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;


@Entity(name = "FileStorage")
@Data
public class FileStorageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalFileName; // 원래 파일 이름

    private String uuidFileName; // UUID로 변환된 파일 이름

    private String filePath; // 파일 경로

    private String fileType; // 파일 타입 (예: 이미지, PDF 등)

    private Long fileSize; // 파일 크기

}
