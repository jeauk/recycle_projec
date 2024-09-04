package com.trashformer.springboot_recycle.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class StepDto {
    Long id;
    MultipartFile stepImage;
    Integer step;
    String stepContent;
}
