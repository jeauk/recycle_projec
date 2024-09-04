import { useState } from "react";

const Contact = () => {
    const [name, setName] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지

        const formData = new FormData();
        formData.append('name', name);
        formData.append('replyTo', replyTo);
        formData.append('subject', subject);
        formData.append('text', text);
        if (image) {
            formData.append('image', image);
        }

        const url = "http://localhost:8080/api/contact/post";
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            // 응답 상태 및 헤더 확인
            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers]);
            
            // 텍스트로 응답 확인
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('메시지가 성공적으로 전송되었습니다!');

        } catch (error) {
            console.error('Error:', error);
            alert('요청에 문제가 있습니다.');
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <div>이름(닉네임)</div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>이메일(이메일 주소를 정확하게 입력하셔야 답변을 받을 수 있습니다.)</div>
                <input
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>전달하고싶은 메세지</div>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>더 자세한 내용이 있다면 말씀해주세요.</div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div>
                <div>이미지 첨부</div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            <button type="submit">보내기</button>
        </form>
    );
};

export default Contact;
