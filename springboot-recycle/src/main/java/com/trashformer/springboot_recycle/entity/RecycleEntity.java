package com.trashformer.springboot_recycle.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class RecycleEntity {
    @Id
    Long idx;
    String name;
    String address;
    String region1;
    String region2;
    String region3;
    double latitude;
    double longitude;

    @OneToMany(mappedBy = "recycleEntity")
    List<InputWasteEntity> inputWastes;
    
}
