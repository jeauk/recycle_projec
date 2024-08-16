package com.trashformer.springboot_recycle.controller;


import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.GwEntity;
import com.trashformer.springboot_recycle.repository.GwRepository;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class GwController {
  @Autowired GwRepository gwRepository;

  @GetMapping("/gwill")
  public List<GwEntity> getGwill() {
    List<GwEntity> list = gwRepository.findAll();
      return list;
  }
  
}
