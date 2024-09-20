package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity (name = "OxQuiz")
@Data
public class OxQuizEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quizId;  // 퀴즈의 고유 ID (Primary Key)

    private String question;  // 퀴즈 질문

    private Boolean correctAnswer;  // 정답 (True = O, False = X)
    
    private String explanation;  // 오답 설명 (추가된 필드)
}
