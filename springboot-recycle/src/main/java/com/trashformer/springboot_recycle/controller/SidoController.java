package com.trashformer.springboot_recycle.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.SidoEntity;
import com.trashformer.springboot_recycle.repository.SidoRepository;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class SidoController {
  @Autowired SidoRepository sidoRepository;

  @GetMapping("/sido")
  public List<SidoEntity> getsido() {
    List<SidoEntity> list = sidoRepository.findAll();
      return list;
  }
}

// @Controller
// public class SidoController {
//   @Autowired SidoRepository sidoRepository;

//   @GetMapping("/sido")
//   public String sido(Model model) {
//     List<SidoEntity> list = sidoRepository.findAll();
//     model.addAttribute("list", list);
//     return "sido";
//   }
// }

