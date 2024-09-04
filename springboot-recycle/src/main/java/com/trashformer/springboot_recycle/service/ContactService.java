package com.trashformer.springboot_recycle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String replyTo, String name, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("projectrecyclebs@gmail.com"); // 이메일을 보내는 주소 (Gmail 주소)
        message.setTo("projectrecyclebs@gmail.com"); // 이메일을 받는 주소 (Gmail 주소)
        message.setReplyTo(replyTo); // 사용자가 입력한 회신 받을 이메일 주소
        message.setSubject(subject); // 사용자가 입력한 제목
        message.setText("Name: " + name + "\nemail: " + replyTo + "\n\nMessage: " + text ); // 사용자 이름과 내용
        emailSender.send(message);
    }
}
 