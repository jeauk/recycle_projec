package com.trashformer.springboot_recycle.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.trashformer.springboot_recycle.entity.RecycleEntity;
import com.trashformer.springboot_recycle.repository.RecycleRepository;

@Service
public class RecycleService {
    
    @Autowired
    private RecycleRepository recycleRepository;
    
    public List<RecycleEntity> findAll() {
        return recycleRepository.findAll();
    }
}
