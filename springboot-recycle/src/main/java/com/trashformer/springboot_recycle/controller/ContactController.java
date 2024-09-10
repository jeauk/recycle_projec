package com.trashformer.springboot_recycle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.trashformer.springboot_recycle.service.ContactService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/contact/post")
    public void sendEmail(
        @RequestParam("name") String name,
        @RequestParam("replyTo") String replyTo,
        @RequestParam("subject") String subject,
        @RequestParam("text") String text,
        @RequestParam(value = "images", required = false) MultipartFile[] images) {

        // 이메일 전송 로직
        contactService.sendSimpleMessage(
            replyTo,
            name,
            subject,
            text,
            images
        );
    }
}