package com.trashformer.springboot_recycle.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity(name = "Comments")
@Data
public class CommentsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 ID
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)  // 게시글과의 외래키 관계 설정
    private FreeBulletinBoardEntity post;

    @ManyToOne
    @JoinColumn(name = "parent_id")  // 대댓글의 부모 댓글을 참조
    private CommentsEntity parentComment;

    private String content;

    private String nickname;

    private String password;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate  // 엔티티가 수정될 때마다 updatedAt 갱신
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
