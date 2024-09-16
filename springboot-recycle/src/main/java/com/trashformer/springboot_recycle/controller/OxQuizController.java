package com.trashformer.springboot_recycle.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.OXQuizEntity;
import com.trashformer.springboot_recycle.repository.OxQuizRepository;

import java.util.List;

@RestController
public class OxQuizController {
    
    @RestController
@RequestMapping("/api/quiz")
public class OXQuizController {

    private final OxQuizRepository oxQuizRepository;

    public OXQuizController(OxQuizRepository oxQuizRepository) {
        this.oxQuizRepository = oxQuizRepository;
    }

    // 모든 퀴즈 데이터를 반환
    @GetMapping
    public List<OXQuizEntity> getAllQuizzes() {
        return oxQuizRepository.findAll();  // DB에서 모든 퀴즈 가져오기
    }
}
}
