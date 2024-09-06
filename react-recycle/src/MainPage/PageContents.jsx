import s from '../styles/PageContents.module.css';

const PageContents = () => {
    return (
        <section className={s.sct}>
            <div className={s.d1}>
                <div className={s.d2}>
                    {/* 1 */}
                    <div className={s.d3}>
                        <div className={s.d4}>
                            <div className={s.d5}>
                                <div className={s.d6}><i>AI</i></div>
                                <h2 className={s.h1}>AI 판독기</h2>
                                <p className={s.p1}>애매한 재활용을 찍어보자</p>
                            </div>
                        </div>
                    </div>
                    <div className={s.d3}>
                        <div className={s.d4}>
                            <div className={s.d5}>
                                <div className={s.d6}><i>지도</i></div>
                                <h2 className={s.h1}>중고 가게 / 재활용 기계</h2>
                            </div>
                        </div>
                    </div>
                    <div className={s.d3}>
                        <div className={s.d4}>
                            <div className={s.d5}>
                                <div className={s.d6}><i>번호</i></div>
                                <h2 className={s.h1}>폐기물 시/군/구 별 <br /> 전화번호</h2>
                            </div>
                        </div>
                    </div>
                    <div className={s.d3}>
                        <div className={s.d4}>
                            <div className={s.d5}>
                                <div className={s.d6}><i>용</i></div>
                                <h2 className={s.h1}>간단한 재활용 법</h2>
                            </div>
                        </div>
                    </div>
                    <div className={s.d3}>
                        <div className={s.d4}>
                            <div className={s.d5}>
                                <div className={s.d6}><i>{`<>`}</i></div>
                                <h2 className={s.h1}>리폼게시판</h2>
                            </div>
                        </div>
                    </div>
                    <div className={s.d3}>
                        <div className={s.d4}>
                            <div className={s.d5}>
                                <div className={s.d6}><i>Q/Z</i></div>
                                <h2 className={s.h1}>간단한 재활용 퀴즈</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageContents;