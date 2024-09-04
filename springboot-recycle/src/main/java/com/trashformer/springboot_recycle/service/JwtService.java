package com.trashformer.springboot_recycle.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.xml.bind.DatatypeConverter;

@Service
public class JwtService {

    private static final String SECRET_KEY = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr"; // 비밀 키

    public String extractEmailFromJwt(String jwtToken) {
        try {
            // "Bearer " 접두사를 제거하고 순수 토큰을 가져옴
            String token = jwtToken.replace("Bearer ", "").trim();

            // 비밀 키를 바이트 배열로 변환
            byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(SECRET_KEY);

            // JWT 파서 생성 및 설정
            JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(secretKeyBytes).build();

            // JWT 토큰에서 클레임 추출
            Claims claims = jwtParser.parseClaimsJws(token).getBody();

            // 이메일 클레임을 반환
            return claims.get("email", String.class);
        } catch (Exception e) {
            // 예외 처리
            System.err.println("JWT 파싱 오류: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
