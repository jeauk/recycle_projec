package com.trashformer.springboot_recycle.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.MainRecycleEntity;
import com.trashformer.springboot_recycle.repository.MainRecycleRepository;

@CrossOrigin
@RestController
public class MainRecycleController {
    @Autowired MainRecycleRepository mainRecycleRepository;
    @GetMapping("/mainrecycle")
    public List<MainRecycleEntity> mapdata(@RequestParam(value = "query", required = false) String query) {
        if(query == null || query.isEmpty()){
            return mainRecycleRepository.findAll();
        } else{
            return mainRecycleRepository.findByMrTagContainingIgnoreCase(query);
        }
    }
    @GetMapping("/mainrecycle/{id}")
    public MainRecycleEntity getItemByTag(@PathVariable Long id){
        return mainRecycleRepository.findById(id).orElse(null);
    }
}
