import { useRef, useState } from "react";

const Contact = () => {
    const [name, setName] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null); // 파일 입력필드에 대한 참조

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const newImages = [...images, ...newFiles];
        setImages(newImages);

        // 새로 선택된 파일들만 미리보기 URL 생성
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지

        const formData = new FormData();
        formData.append('name', name);
        formData.append('replyTo', replyTo);
        formData.append('subject', subject);
        formData.append('text', text);
        // 여러 파일을 추가
        images.forEach((file) => {
            formData.append('images', file);
        });

        const url = "http://localhost:8080/api/contact/post";
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("문의가 접수되었습니다"); // 메시지 창 표시
                // 폼 초기화
                setName('');
                setReplyTo('');
                setSubject('');
                setText('');
                setImages([]);
                setImagePreviews([]);

                // 파일 입력 필드 초기화
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                throw new Error("문의를 보내는 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
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
                <div>이메일 (이메일 주소를 정확하게 입력하셔야 답변을 받을 수 있습니다.)</div>
                <input
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>제목</div>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>내용</div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>
            <div>
                <div>이미지 첨부</div>
                <div>1장씩 첨부시 첨부 순서대로 정렬되고 한번에 첨부시 파일 이름 순으로 정렬됩니다.</div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div>
                    {imagePreviews.map((preview, index) => (
                        <img
                            key={index}
                            src={preview}
                            alt={`preview-${index}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                        />
                    ))}
                </div>
            </div>
            <button type="submit">보내기</button>
        </form>
    );
};

export default Contact;
