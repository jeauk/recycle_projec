package com.trashformer.springboot_recycle.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.SidoEntity;
import com.trashformer.springboot_recycle.repository.SidoRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin
@RestController
public class SidoController {
  @Autowired SidoRepository sidoRepository;

  @GetMapping("/sido")
  public List<SidoEntity> getsido() {
    List<SidoEntity> list = sidoRepository.findAll();
      return list;
  }
}