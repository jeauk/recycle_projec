package com.trashformer.springboot_recycle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class ContactService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String replyTo, String name, String subject, String text, MultipartFile[] images) {

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("projectrecyclebs@gmail.com"); // 이메일을 보내는 주소 (Gmail 주소)
            helper.setTo("projectrecyclebs@gmail.com"); // 이메일을 받는 주소 (Gmail 주소)
            helper.setReplyTo(replyTo); // 사용자가 입력한 회신 받을 이메일 주소
            helper.setSubject(subject); // 사용자가 입력한 제목
            helper.setText("Name: " + name + "\n Email: " + replyTo + "\n\n Message: " + text); // 사용자 이름과 내용

            // 이미지 파일이 있으면 첨부
            if (images != null) {
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String fileName = image.getOriginalFilename();
                        if (fileName == null || fileName.isEmpty()) {
                            fileName = "unknown-file"; // 파일 이름이 null이거나 비어있는 경우 기본 이름 사용
                        }
                        helper.addAttachment(fileName, image);
                    }
                }
            }
            emailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
