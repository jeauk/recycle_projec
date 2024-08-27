package com.trashformer.springboot_recycle.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.trashformer.springboot_recycle.entity.SidoEntity;
import com.trashformer.springboot_recycle.repository.SidoRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin
@RestController
public class SidoController {
  @Autowired
  SidoRepository sidoRepository;
  @Autowired

  @GetMapping("/sido")
  public List<SidoEntity> getsido() {
    List<SidoEntity> list = sidoRepository.findAll();
<<<<<<< HEAD
      return list; 
=======
    return list;
  }

  @GetMapping("/sido/submit/{id}")
  public Optional<SidoEntity> getSidoSub(@PathVariable Long id) {
    Optional<SidoEntity> list = sidoRepository.findById(id);
    return list;
  }

  @PostMapping("/sido/submit")
  public ResponseEntity<List<SidoEntity>> submitData(@RequestBody Map<String, String> data) {
    String sido = data.get("sido"); // Assuming 'city' corresponds to 'site'
    String gungoo = data.get("gungoo");

    // Process the data as needed
    System.out.println("Received sido: " + sido);
    System.out.println("Received gungoo: " + gungoo);

    // Create a response
    Map<String, String> response = new HashMap<>();
    response.put("status", "success");
    response.put("message", "Data received successfully");

    // Query the database for the corresponding values
    List<SidoEntity> result = sidoRepository.findBySidoAndGungoo(sido, gungoo);
    System.out.println(result);

    return ResponseEntity.ok(result);
>>>>>>> kimhuigon
  }
}