package com.trashformer.springboot_recycle.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EditDto {
    private String title;
    private String content;
    private List<StepDto> steps;
    private MultipartFile imageFile;
    private List<MultipartFile> stepImages;

}
