package com.trashformer.springboot_recycle.util;

import java.util.Date;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import javax.xml.bind.DatatypeConverter;

@Component
public class JwtUtil {
    public String createJwt(String email, String nickname, String profileImageUrl) {
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        // 문자 1개 = 6bit, 24bit(문자 4개) = 1개 단위
        // 240bit 보다 큰 값의 secretKey 사용 => 44개 이상의 문자 필요
        byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(
                "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr");
        Key signingKey = new SecretKeySpec(secretKeyBytes, signatureAlgorithm.getJcaName());
        JwtBuilder builder = Jwts.builder()
                // Header
                .setHeaderParam("typ", "JWT")
                // Payload - Registered Claim
                .claim("email", email).claim("nickname", nickname).claim("profileImageUrl", profileImageUrl)
                // Signature
                .signWith(signingKey, signatureAlgorithm);
        long now = System.currentTimeMillis();
        builder.setExpiration(new Date(now + 1000 * 60 * 60)); // 1시간 뒤 토큰 유효기간 만료 
        //                                   밀리초 초   분
        String token = builder.compact();
        System.out.println(token);
        return token;
    }

    public void getDataFromJwt(String jwt) {
        byte[] secretKeyBytes = DatatypeConverter.parseBase64Binary(
                "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqr");
        JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(secretKeyBytes).build();
        JwsHeader<?> header = jwtParser.parseClaimsJws(jwt).getHeader();
        String algorithm = header.getAlgorithm();
        System.out.println(algorithm);
        String type = header.getType();
        System.out.println(type);
        Claims claims = jwtParser.parseClaimsJws(jwt).getBody();
        System.out.println(claims.get("email"));
        System.out.println(claims.get("nickname"));
        System.out.println(claims.get("profileImageUrl"));
    }
}