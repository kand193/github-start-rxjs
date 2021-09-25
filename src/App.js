import { useEffect, useMemo, useRef, useState } from 'react';
import { catchError, debounce, fromEvent, interval, map, switchMap } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import styled from 'styled-components';
import RepoItem from './RepoItem';

function App() {
  const inputRef = useRef();

  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);

  const totalStars = useMemo(() => {
    return repos.reduce((prev, curr) => prev + curr.stargazers_count, 0)
  }, [repos]);

  useEffect(() => {
    // 이벤트 자체에 대한 Observable 생성
    const eventObservable = fromEvent(inputRef.current, 'keydown').pipe(
      debounce(() => interval(300)), 
      map((ref) => ref.target.value),
    );
    // 이벤트 결과값을 이름에 대입
    const changeResult = eventObservable.subscribe(x => setUsername(x));

    // 이벤트 Observable에서 API 호출을 위한 Observable 생성
    const reqObservable = eventObservable.pipe(
      switchMap((value) => ajax.getJSON(`https://api.github.com/orgs/${value}/repos`)),
      catchError((_, caught) => caught)
    )
    // 결과를 처리하는 부분
    const reqResult = reqObservable.subscribe({
      next(x) {
        setRepos(x);
      },
      error() {
        setRepos([]);
      },
    });

    return () => {
      reqResult.unsubscribe();
      changeResult.unsubscribe();
    }
  }, []);

  return (
    <>
      <TitleWrapper>
        <h1>Gitstar Ranking</h1>
        <h3>
          Unofficial GitHub star ranking for users, organizations and
          repositories.
        </h3>
        <TitleInput ref={inputRef} />
      </TitleWrapper>
      <RepoResultWrapper>
        {repos.length ? (
          <>
            <h1>{username}</h1>
            <h3>
              {repos.length}
              &nbsp;
              {repos.length > 1 ? "repositories" : "repository"}
              &nbsp;|&nbsp;
              {totalStars}
              &nbsp;
              {totalStars > 1 ? "stars" : "star"}
            </h3>
            <hr />
            <RepoList>
              {repos.map((repo) => (
                <RepoItem repo={repo} key={repo.name} />
              ))}
            </RepoList>
          </>
        ) : (
          <h3>결과가 없습니다.</h3>
        )}
      </RepoResultWrapper>
    </>
  );
}

export default App;

const TitleWrapper = styled.header`
  padding: 10px;
  background-color: rgb(250, 250, 250);
`;

const TitleInput = styled.input`
  padding: 5px 8px;
  font-size: 12px;
`;

const RepoResultWrapper = styled.section`
  margin-top: 20px;
`;

const RepoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  border: 1px solid lightgray;
  > li:not(:first-child) {
    border-top: 1px solid lightgray;
  }
`;