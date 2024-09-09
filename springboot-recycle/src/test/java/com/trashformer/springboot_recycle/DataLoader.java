package com.trashformer.springboot_recycle;

import com.trashformer.springboot_recycle.entity.ReformBoardEntity;
import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.ReformBoardRepository;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ReformBoardRepository reformBoardRepository;

    @Autowired
    private KakaoUserRepository kakaoUserRepository;

    @Override
    public void run(String... args) throws Exception {
        // 유저를 하나 생성
        KakaoUserEntity user = new KakaoUserEntity();
        user.setEmail("test@example.com");
        user.setNickname("TestUser");
        kakaoUserRepository.save(user);

        // 100개의 포스트 생성
        for (int i = 1; i <= 1000; i++) {
            ReformBoardEntity post = new ReformBoardEntity();
            post.setTitle("Sample Post Title " + i);
            post.setContent("This is the content for post number " + i);
            post.setKakaoUserEntity(user);
            post.setViewCount(0L); // 초기 조회수 설정
            post.setVideoLink("https://www.youtube.com/watch?v=sample" + i);
            reformBoardRepository.save(post);
        }

        System.out.println("1000개의 포스트가 생성되었습니다.");
    }
}
