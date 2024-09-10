import { useRef, useState } from "react";
import style from '../styles/Contact.module.css';
import { getFileHash } from "../utils";

const Contact = () => {
    const [name, setName] = useState('');
    const [replyTo, setReplyTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null); // 파일 입력필드에 대한 참조
    const [message, setMessage] = useState({ text: '', type: '', visible: false }); // type: 'success' or 'error'


    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);
        const newImages = [...images];
        const newPreviews = [];
        for (const file of newFiles) {
            const fileHash = await getFileHash(file);
            // 중복 파일 체크
            const isDuplicate = images.some(img => img.hash === fileHash);
            if (!isDuplicate) {
                newImages.push({ file, hash: fileHash });
                newPreviews.push(URL.createObjectURL(file));
            }
        }

        setImages(newImages);
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const handleImageDelete = (index) => {
        // 이미지 배열에서 특정 이미지를 제거
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        // 이미지 미리보기 배열에서 특정 미리보기를 제거
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
        // 파일 입력 필드를 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const closeMessage = () => {
        setMessage({ text: '', type: '', visible: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        setIsLoading(true); // 로딩 시작

        const formData = new FormData();
        formData.append('name', name);
        formData.append('replyTo', replyTo);
        formData.append('subject', subject);
        formData.append('text', text);
        // 여러 파일을 추가
        images.forEach((img) => {
            formData.append('images', img.file);
        });

        const url = "http://localhost:8080/api/contact/post";
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage({ text: "문의가 접수되었습니다.", type: 'success', visible: true });
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
            setMessage({ text: error.message, type: 'error', visible: true });
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {isLoading && (
                <>
                    <div className={style.spinner} />
                    <div className={style.spinnerOverlay} />
                </>
            )}

            {/* 이름과 이메일을 같은 줄에 배치 */}
            <div className={style.formRow}>
                <div>
                    <div>이름</div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <div>이메일 (이메일 주소를 정확하게 입력하셔야 답변을 받을 수 있습니다.)</div>
                    <input
                        type="email"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div>
                <div>제목</div>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div>
                <div>내용</div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            {/* 이미지 첨부 필드 */}
            <div>
                <div>이미지 첨부</div>
                <div>1장씩 첨부시 첨부 순서대로 정렬되고 한번에 첨부시 파일 이름 순으로 정렬됩니다.</div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
                <div>
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className={style.contactpreview}>
                            <img
                                className={style.contactpreviewimg}
                                src={preview}
                                alt={`preview-${index}`}
                            />
                            <button
                                className={style.contactdeletebtn}
                                type="button"
                                onClick={() => handleImageDelete(index)}
                                disabled={isLoading}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit">보내기</button>
            {isLoading && <div>메일을 보내는 중입니다...</div>}
        </form>

    );
};

export default Contact;
