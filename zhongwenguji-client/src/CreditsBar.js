import React from 'react';
import style from './CreditsBar.module.scss';

// eslint-disable-next-line jsx-a11y/anchor-has-content
const Link = (props) => (<a target="_blank" rel="noopener" {...props} />);

export default () => (
  <div className={style.container}>
    <span>Non-linear regression code by <Link href="https://github.com/jonasalmeida/fminsearch">Dr. Jonas Almeida</Link></span>
    <span>Chinese character frequency list by <Link href="http://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO">Dr. Jun Da</Link></span>
    <span>Icons by <Link href="https://www.flaticon.com/authors/egor-rumyantsev">Egor Rumyantsev</Link>, <Link href="https://www.flaticon.com/authors/dave-gandy">Dave Gandy</Link> and <Link href="https://www.freepik.com/">Freepik</Link>
    </span>
    <span>Created with love by <Link className={style.selfLink} href="https://www.linkedin.com/in/codyjenkins/">iknowcss</Link></span>
  </div>
);
