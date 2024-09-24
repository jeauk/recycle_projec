package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "FreeBulletinBoard")
@Data
public class FreeBulletinBoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 ID
    private Long id;

    private String title;

    @Column(length = 5000)
    private String content;


    private String imageUrl;

    private String nickname;

    private String password;

    private LocalDateTime createdAt = LocalDateTime.now();;

    private LocalDateTime updatedAt= LocalDateTime.now();;

 
     // 엔티티가 수정될 때마다 수정 날짜 갱신
     @PreUpdate
     protected void onUpdate() {
         this.updatedAt = LocalDateTime.now();
     }
}
