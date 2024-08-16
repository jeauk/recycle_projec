package com.trashformer.springboot_recycle.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {
    @GetMapping("/")
    public String map(){
        return "recyclevending/map";
    }
}
