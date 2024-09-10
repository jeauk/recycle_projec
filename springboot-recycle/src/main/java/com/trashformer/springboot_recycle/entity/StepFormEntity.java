package com.trashformer.springboot_recycle.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.trashformer.springboot_recycle.dto.StepDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class StepFormEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private int step;
    private String stepContent;
    private String imgUrl;

    @JsonIgnore
    @ManyToOne
    private ReformBoardEntity reformBoardEntity;
    
}
