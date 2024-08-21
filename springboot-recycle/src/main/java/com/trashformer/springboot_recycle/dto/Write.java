package com.trashformer.springboot_recycle.dto;

import com.trashformer.springboot_recycle.entity.KakaoUserEntity;
import com.trashformer.springboot_recycle.entity.ReformBoardEntity;

import lombok.Data;

@Data
public class Write {
    KakaoUserEntity kakaoUser;
    ReformBoardEntity reformBoard;
}
