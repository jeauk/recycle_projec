package com.trashformer.springboot_recycle.controller;


import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.BmEntity;
import com.trashformer.springboot_recycle.repository.BmRepository;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class BmController {
  @Autowired BmRepository bmRepository;

  @GetMapping("/bmarker")
  public List<BmEntity> getBmarker() {
    List<BmEntity> list = bmRepository.findAll();
      return list;
  }
  
}
