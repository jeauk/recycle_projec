package com.trashformer.springboot_recycle.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class VendingDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String deviceId;
    String recycleType;
    @JsonIgnore
    @ManyToOne
    RecycleEntity recycleEntity;
}
