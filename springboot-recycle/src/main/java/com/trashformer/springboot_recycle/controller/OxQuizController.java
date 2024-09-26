package com.trashformer.springboot_recycle.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.OxQuizEntity;
import com.trashformer.springboot_recycle.repository.OxQuizRepository;

import java.util.List;


@RestController
@CrossOrigin

@RequestMapping("/api/quiz")
public class OxQuizController {

    private final OxQuizRepository oxQuizRepository;

    public OxQuizController(OxQuizRepository oxQuizRepository) {
        this.oxQuizRepository = oxQuizRepository;
    }

    // 모든 퀴즈 데이터를 반환
    @GetMapping
    public List<OxQuizEntity> getAllQuizzes() {
        return oxQuizRepository.findAll();  // DB에서 모든 퀴즈 가져오기
    }
}

