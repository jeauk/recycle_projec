package com.trashformer.springboot_recycle.controller;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@CrossOrigin
public class CarvonController {

    @GetMapping("/carvon/companyList")
public List<Map<String, String>> carvonCompanyList() {
    // RestTemplate 객체 생성
    RestTemplate rt = new RestTemplate();

    // 요청할 URL
    String url = "https://www.cpoint.or.kr/netzero/entGuide/nv_entGuideList.do?menuId=9";

    // GET 요청을 통해 HTML 가져오기
    ResponseEntity<String> response = rt.getForEntity(url, String.class);
    String html = response.getBody();

    // JSON으로 보낼 결과를 담을 리스트
    List<Map<String, String>> result = new ArrayList<>();

    // 문자열 처리를 통해 <li class="companies_item"> 블록을 분리
    String[] items = html.split("<li class=\"companies_item\">");

    for (String item : items) {
        // 회사 제목 추출
        String title = extractBetween(item, "<span class=\"companies_title\">", "</span>");
        // 회사 설명 추출
        String text = extractBetween(item, "<span class=\"companies_text\">", "</span>");
        // 이미지 URL 추출
        String imgSrc = extractBetween(item, "<span class=\"img_area\"><img src=\"", "\"");

        // 데이터가 있는 경우 맵으로 저장
        if (title != null && text != null && imgSrc != null) {
            Map<String, String> companyData = new HashMap<>();
            companyData.put("title", title);
            companyData.put("text", text);
            // 이미지 URL이 상대 경로일 경우 도메인을 붙여줌
            if (!imgSrc.startsWith("http")) {
                imgSrc = "https://www.cpoint.or.kr" + imgSrc;
            }
            companyData.put("imgSrc", imgSrc);
            result.add(companyData); // 리스트에 추가
        }
    }

    // 리스트를 JSON으로 반환
    return result;
}

// 두 문자열 사이의 텍스트를 추출하는 메소드
private String extractBetween(String source, String start, String end) {
    int startIndex = source.indexOf(start);
    if (startIndex != -1) {
        startIndex += start.length();
        int endIndex = source.indexOf(end, startIndex);
        if (endIndex != -1) {
            return source.substring(startIndex, endIndex).trim();
        }
    }
    return null;
}

    @GetMapping("/carvon/jedo")
public String carvonJedo() {
    // RestTemplate 객체 생성 (HTTP 요청을 보내기 위한 도구)
    RestTemplate rt = new RestTemplate();
    
    // 요청할 URL (외부 API의 주소)
    String url = "https://www.cpoint.or.kr/netzero/site/cntnts/CNTNTS_001.do";

    // exchange 메소드로 GET 요청 보내기 (헤더 필요 없음)
    ResponseEntity<String> response = rt.exchange(
        url,              // 요청할 URL (외부 API 주소)
        HttpMethod.GET,    // HTTP 메소드 (GET 요청)
        null,              // 요청에 포함할 데이터 없음 (헤더도 없음)
        String.class       // 응답 데이터를 문자열(String)로 받을 것
    );

    // 응답 데이터(response.getBody())를 문자열로 반환
    String result = response.getBody();
    // result = result.replace("href=\"/netzero", "href=\"https://www.cpoint.or.kr/netzero")
    //                 .replace("src=\"/netzero", "href=\"https://www.cpoint.or.kr/netzero");
    return result;
}
    
}
