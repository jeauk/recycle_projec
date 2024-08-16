package com.trashformer.springboot_recycle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.trashformer.springboot_recycle.entity.RecycleEntity;
import com.trashformer.springboot_recycle.service.RecycleService;

@Controller
public class RecycleController {
    @Autowired
    RecycleService recycleService;

    @GetMapping("/vending-data")
    public String RecycleDataRead(Model model) {
        List<RecycleEntity> recycleEntities = recycleService.findAll();
        model.addAttribute("recycleEntities", recycleEntities);
        return "recyclevending/vendingdataread";
    }
}
