package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "sido")
public class SidoEntity {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  Long id;

  String sido;
  String gungoo;
  
  @Column(length = 1000)
  String tel;
  String site;
  String etc;
}
