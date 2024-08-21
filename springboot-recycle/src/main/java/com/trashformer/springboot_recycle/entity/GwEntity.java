package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity 
public class GwEntity {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  Long id;

  String name;
  String address;
  String tel;
  String lat;
  String lng;
}
