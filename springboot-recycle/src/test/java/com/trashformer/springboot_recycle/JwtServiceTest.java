package com.trashformer.springboot_recycle;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.trashformer.springboot_recycle.service.JwtService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    public void testExtractEmailFromJwt() {
        // JWT 토큰 생성 (이 테스트에서는 미리 생성된 유효한 토큰을 사용)
        String validJwtToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAbWFpbC5jb20iLCJuaWNrbmFtZSI6IlRlc3QiLCJwcm9maWxlSW1hZ2VVcmwiOiJodHRwOi8vcHJvZmlsZS5jb20vaW1hZ2UuanBnIn0.S0meSecretKey";

        // JWT 토큰에서 이메일 추출
        String email = jwtService.extractEmailFromJwt(validJwtToken);

        // 올바른 이메일인지 확인
        assertEquals("test@mail.com", email);
    }

    @Test
    public void testExtractEmailFromInvalidJwt() {
        // 잘못된 JWT 토큰
        String invalidJwtToken = "Bearer InvalidToken";

        // JWT 토큰에서 이메일 추출 시 null이 반환되어야 함
        String email = jwtService.extractEmailFromJwt(invalidJwtToken);

        // null인지 확인
        assertNull(email);
    }
}
