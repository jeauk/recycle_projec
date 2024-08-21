package com.trashformer.springboot_recycle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;

@RestController
@CrossOrigin
public class ReformBoardController {

    @Autowired ReformBoardRepository reformBoardRepository;
    
    @PostMapping("/post")
    public ReformBoardEntity saveReformBoard(@RequestBody ReformBoardEntity reboard){
        // 데이터를 DB에 저장
        ReformBoardEntity savedEntity = reformBoardRepository.save(reboard);
        // 저장된 엔티티를 반환
        return savedEntity;
    }
    
}
