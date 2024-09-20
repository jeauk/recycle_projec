import { useEffect, useRef, useState } from "react";
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
    const myBackDomain = "http://localhost:8080";
    const jwt = sessionStorage.getItem('jwt');
    
    useEffect(() => {
        const fetchProfile = async () => {
            if (!jwt) {
                console.warn('JWT가 없습니다.');
                return; // JWT가 없으면 요청하지 않음
            }
    
            const url = myBackDomain + "/api/contact/nickname";
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
    
                if (response.ok) {
                    const nickname = await response.text();
                    setName(nickname); // 닉네임 설정
                } else {
                    console.error('프로필 정보를 가져오는 중 오류 발생:', response.statusText);
                }
            } catch (error) {
                console.error('Fetch 오류:', error);
            }
        };
    
        fetchProfile(); // fetchProfile 호출
    }, []); // 의존성 배열



    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);
        const newImages = [...images];
        const newPreviews = [];

        if (newFiles.length + images.length > 5) {
            setMessage({ text: "최대 5개의 파일만 첨부할 수 있습니다.", type: 'error', visible: true });
            return;
        }

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

        const url = myBackDomain +"/api/contact/post";
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
            
            const responseMessage = await response.text(); // 서버에서 보낸 메시지를 사용

            if (response.ok) {
                setMessage({ text: responseMessage, type: 'success', visible: true });
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
                setMessage({ text: responseMessage, type: 'error', visible: true }); // 실패 시 메시지 사용
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: "서버와의 연결에 실패했습니다. 나중에 다시 시도해 주세요.", type: 'error', visible: true });
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <>
            <div className={style.contactsub}>
                문 의 하 기
            </div>
            <div className={style.formContainer}>
                <form onSubmit={handleSubmit}>
                    {isLoading && (
                        <>
                            <div className={style.spinner} />
                            <div className={style.spinnerOverlay} />
                        </>
                    )}

                    {/* 성공/실패 메시지 표시 */}
                    {message.visible && (
                        <div className={`${style.message} ${message.type === 'success' ? style.successMessage : style.errorMessage}`}>
                            {message.text}
                            <button onClick={closeMessage} className={style.closeMessageBtn}>
                                닫기
                            </button>
                        </div>
                    )}

                    {/* 이름과 이메일을 같은 줄에 배치 */}
                    <div className={style.formRow}>
                        <div className={`${style.nameInput} ${style.inputWrapper}`}>
                            <div>이름(닉네임)</div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={`${style.emailInput} ${style.inputWrapper}`}>
                            <div className={style.noWrapText}>
                                답변 받을 이메일
                            </div>
                            <input
                                type="email"
                                value={replyTo}
                                onChange={(e) => setReplyTo(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>


                    <div className={`${style.subjectInput} ${style.inputWrapper}`}>
                        <div>제목</div>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={`${style.inputWrapper} ${style.contentInput}`}>
                        <div>내용</div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* 이미지 첨부 필드 */}
                    <div className={style.inputWrapper}>
                        <label className={style.customFileInput}>
                            이미지 첨부
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={isLoading}
                                className={style.hiddenFileInput}
                            />
                        </label>
                        <div className={style.customFilecontent}>♻ 파일 크기: 50MB, 파일 개수: 5개 제한, 이미지 파일만 첨부 가능합니다.</div>
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

                    <div className={style.contactButtonContainer}>
                        <button
                            type="submit"
                            className={style.contactButton}
                            disabled={isLoading}
                        >
                            보내기
                        </button>
                    </div>
                    {isLoading && <div>메일을 보내는 중입니다...</div>}
                </form>
            </div>
        </>
    );
};

export default Contact;
