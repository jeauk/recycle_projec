package com.trashformer.springboot_recycle.service;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KakaoUserService {

    @Autowired
    private KakaoUserRepository userRepository;

    public KakaoUserEntity saveUser(String email, String nickname, String profileImageUrl) {
        // 이메일을 기준으로 사용자 검색
        KakaoUserEntity existingUser = userRepository.findByEmail(email);

        // 이미 사용자가 존재하는 경우 해당 사용자 반환
        if (existingUser != null) {
            return existingUser;
        }

        // 사용자가 존재하지 않는 경우 새로운 사용자 생성 및 저장
        KakaoUserEntity user = new KakaoUserEntity();
        user.setEmail(email);
        user.setNickname(nickname);
        user.setProfileImageUrl(profileImageUrl);

        return userRepository.save(user);
    }

    // 필요에 따라 사용자 검색, 업데이트, 삭제 등의 메서드를 추가할 수 있습니다.
}
