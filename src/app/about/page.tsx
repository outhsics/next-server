import React from 'react';
import styles from './about.module.css';

export default function About() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    关于我们
                </h1>

                <p className={styles.description}>
                    我们致力于构建下一代智能 Web 应用程序。
                </p>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h2>我们的使命 &rarr;</h2>
                        <p>通过创新的 AI 技术赋能开发者和企业。</p>
                    </div>

                    <div className={styles.card}>
                        <h2>我们的愿景 &rarr;</h2>
                        <p>创造一个互联互通、智能高效的数字未来。</p>
                    </div>

                    <div className={styles.card}>
                        <h2>团队 &rarr;</h2>
                        <p>由充满激情的工程师、设计师和思想家组成的全球团队。</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
