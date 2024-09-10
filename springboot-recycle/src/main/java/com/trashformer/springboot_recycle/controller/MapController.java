package com.trashformer.springboot_recycle.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import com.trashformer.springboot_recycle.entity.RecycleEntity;
import com.trashformer.springboot_recycle.repository.RecycleRepository;
@CrossOrigin
@RestController
public class MapController {
    @Autowired RecycleRepository recycleRepository;    
    @GetMapping("/dataload")
    @ResponseBody
    public List<RecycleEntity> mapdata(@RequestParam(value = "query", required = false) String query) {
        List<RecycleEntity> latlng = recycleRepository.findAll();

        return latlng;
    }
}
