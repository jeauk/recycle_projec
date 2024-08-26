package com.trashformer.springboot_recycle.service;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.repository.KakaoUserRepository;

import java.io.IOException; //추가

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile; //추가

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

    //아래추가
    // 사용자의 프로필 조회
    public KakaoUserEntity getUserProfile(String email) {
        return userRepository.findByEmail(email);
    }

    // 사용자의 프로필 업데이트
    public KakaoUserEntity updateUserProfile(String email, String nickname, MultipartFile profileImage) throws IOException {
        KakaoUserEntity user = userRepository.findByEmail(email);

        if (user != null) {
            user.setNickname(nickname);
            if (profileImage != null && !profileImage.isEmpty()) {
                // 프로필 이미지를 파일 시스템이나 클라우드 스토리지에 저장하는 로직 추가 필요
                // 저장된 파일의 URL을 user.setProfileImageUrl()에 설정
                String imageUrl = saveProfileImage(profileImage); // 가정: 이 메서드는 이미지를 저장하고 URL을 반환함
                user.setProfileImageUrl(imageUrl);
            }
            return userRepository.save(user);
        }
        return null;
    }

    // 파일을 저장하고 URL을 반환하는 가상의 메서드
    private String saveProfileImage(MultipartFile profileImage) throws IOException {
        // 이미지 파일 저장 로직 추가
        // 파일을 저장하고 접근 가능한 URL을 생성하여 반환
        return "saved/profile/image/url"; // 실제 이미지 URL 반환
    }
}
