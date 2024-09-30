import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import styles from '../styles/Sliders.module.css';

const MainSlider = () => {
  const swiperContainerRef = useRef(null);

  useEffect(() => {
    if (swiperContainerRef.current) {
      new Swiper(swiperContainerRef.current, {
        direction: 'horizontal',
        loop: true,
        autoplay: {
          delay: 3000,
        },
        pagination: {
          el: `.${styles.swiperPagination}`,
          clickable: true,
        },
        navigation: {
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        },
      });
    }
  }, []);

  return (
    <section className={styles.mainslider}>
      <div className={styles.swiperContainer} ref={swiperContainerRef}>
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className={styles.container}>
              <div className={styles.inner}>
                <div className={styles.sliderCenter}>
                  <img src={`${process.env.PUBLIC_URL}/img/benner1.png`} alt="Slide 1" />
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className={styles.container}>
              <div className={styles.inner}>
                <div className={styles.sliderCenter}>
                  <img src={`${process.env.PUBLIC_URL}/img/benner2.png`} alt="Slide 2" />
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className={styles.container}>
              <div className={styles.inner}>
                <div className={styles.sliderCenter}>
                  <img src={`${process.env.PUBLIC_URL}/img/benner3.png`} alt="Slide 3" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.swiperPagination}></div>
        <div className={styles.swiperButtonPrev}></div>
        <div className={styles.swiperButtonNext}></div>
      </div>
    </section>
  );
};

export default MainSlider;
