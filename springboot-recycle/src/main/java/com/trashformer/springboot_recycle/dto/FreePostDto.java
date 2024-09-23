package com.trashformer.springboot_recycle.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class FreePostDto {
    private String title;
    private String content;
    private String nickname;
    private String password;
    private MultipartFile image;
    
}
