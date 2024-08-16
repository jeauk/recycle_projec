package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class BmEntity {
  @Id
  Long id;

  String name;
  String address;
  String tel;
  String lat;
  String lng;
}
