package com.trashformer.springboot_recycle.controller;

import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.BmEntity;
import com.trashformer.springboot_recycle.repository.BmRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin
@RestController
public class BmController {
  @Autowired BmRepository bmRepository;

  @GetMapping("/bmarket")
  public List<BmEntity> getBmarket() {
    List<BmEntity> list = bmRepository.findAll();
      return list;
  }
  
}
